from django.db import models
from django.utils import timezone
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from weasyprint import HTML
import tempfile
from decimal import Decimal
from django.conf import settings
User = settings.AUTH_USER_MODEL

# Create your models here.

class Room(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rooms")
    room_number = models.CharField(max_length=10)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Room {self.room_number}"


class Tenant(models.Model):
    room = models.OneToOneField(Room, on_delete=models.SET_NULL, null=True, blank=True)
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    join_date = models.DateField()
    leave_date = models.DateField(null=True, blank=True)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=10, choices=(('active', 'Active'), ('left', 'Left')), default='active')

    def save(self, *args, **kwargs):
        if self.room:
            self.room.is_occupied = (self.status == 'active')
            self.room.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

class ElectricityBill(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='electricity_bills')
    month = models.DateField(default=timezone.now)
    previous_unit = models.DecimalField(max_digits=10, decimal_places=2)
    current_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10.0)  # e.g. 10 per unit
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    is_paid = models.BooleanField(default=False)

    def clean(self):
        if self.current_unit < self.previous_unit:
            raise ValidationError("Current unit cannot be less than previous unit.")

    def save(self, *args, **kwargs):
        self.total_amount = (self.current_unit - self.previous_unit) * self.unit_rate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.tenant.full_name} - {self.month.strftime('%B %Y')}"
    
class WaterBill(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    month = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.tenant.full_name} - Water Bill - {self.month.strftime('%B %Y')}"


class WasteManagementBill(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    month = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.tenant.full_name} - Waste Bill - {self.month.strftime('%B %Y')}"


class MonthlyBill(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    month = models.DateField(default=timezone.now)
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    electricity_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    water_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    waste_management_bill = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    due_date = models.DateField()

    class Meta:
        unique_together = ('tenant', 'month')

    def save(self, *args, **kwargs):
        # Calculate amounts as before
        if not self.rent_amount:
            self.rent_amount = self.tenant.room.rent_amount if self.tenant.room else 0.0

        if not self.electricity_bill:
            e_bill = ElectricityBill.objects.filter(tenant=self.tenant, month__month=self.month.month, month__year=self.month.year).first()
            self.electricity_bill = e_bill.total_amount if e_bill else 0.0

        if not self.water_bill:
            w_bill = WaterBill.objects.filter(tenant=self.tenant, month__month=self.month.month, month__year=self.month.year).first()
            self.water_bill = w_bill.amount if w_bill else 0.0

        if not self.waste_management_bill:
            wm_bill = WasteManagementBill.objects.filter(tenant=self.tenant, month__month=self.month.month, month__year=self.month.year).first()
            self.waste_management_bill = wm_bill.amount if wm_bill else 0.0

        self.total_amount = (
            Decimal(self.rent_amount) +
            Decimal(self.electricity_bill) +
            Decimal(self.water_bill) +
            Decimal(self.waste_management_bill)
        )

        super().save(*args, **kwargs)

        # After saving, send invoice PDF
        self.send_invoice_email()

    def send_invoice_email(self):
        if not self.tenant.email:
            return  # No email to send to

        subject = f"Invoice for {self.month.strftime('%B %Y')}"
        message = f"Dear {self.tenant.full_name},\n\nPlease find attached your invoice for {self.month.strftime('%B %Y')}.\n\nThank you!"
        to_email = [self.tenant.email]

        html_string = render_to_string("bill/invoice.html", {"bill": self})
        pdf_file = HTML(string=html_string).write_pdf()

        # Write to temp file
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as output:
            output.write(pdf_file)
            output.flush()

            email = EmailMessage(
                subject, message, to=to_email
            )
            email.attach(f"Invoice-{self.month.strftime('%b-%Y')}.pdf", output.read(), "application/pdf")
            email.send()

class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=(('cash', 'Cash'), ('bank', 'Bank Transfer'), ('upi', 'UPI')))
    receipt_number = models.CharField(max_length=100, blank=True, null=True)
    is_confirmed = models.BooleanField(default=True)

    def __str__(self):
        return f"Payment by {self.tenant.full_name} on {self.date}"
    
