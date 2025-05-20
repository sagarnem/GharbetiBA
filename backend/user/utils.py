from .models import OTP
from django.core.mail import send_mail
import random

def send_otp_email(user_or_email, purpose):
    code = str(random.randint(100000, 999999))

    # Determine if we got a User object or an email string
    if isinstance(user_or_email, str):
        email = user_or_email
        user = None
    else:
        email = user_or_email.email
        user = user_or_email

    OTP.objects.create(user=user, email=email, code=code, purpose=purpose)

    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP code is {code}. It expires in 10 minutes.",
        from_email="no-reply@yourapp.com",
        recipient_list=[email],
    )
