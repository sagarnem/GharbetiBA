from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from bill.models import Room, Tenant, ElectricityBill, WaterBill, WasteManagementBill, MonthlyBill, Payment
from .serializers import (
    RoomSerializer, TenantSerializer, ElectricityBillSerializer,
    WaterBillSerializer, WasteManagementBillSerializer, MonthlyBillSerializer,
    PaymentSerializer
)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

class ElectricityBillViewSet(viewsets.ModelViewSet):
    queryset = ElectricityBill.objects.all()
    serializer_class = ElectricityBillSerializer

class WaterBillViewSet(viewsets.ModelViewSet):
    queryset = WaterBill.objects.all()
    serializer_class = WaterBillSerializer

class WasteManagementBillViewSet(viewsets.ModelViewSet):
    queryset = WasteManagementBill.objects.all()
    serializer_class = WasteManagementBillSerializer

class MonthlyBillViewSet(viewsets.ModelViewSet):
    queryset = MonthlyBill.objects.all()
    serializer_class = MonthlyBillSerializer

    def create(self, request, *args, **kwargs):
        """
        Override create to call send_invoice_email after saving.
        This is already called in the model save() but this is extra safety.
        """
        response = super().create(request, *args, **kwargs)
        bill_id = response.data['id']
        bill = MonthlyBill.objects.get(id=bill_id)
        bill.send_invoice_email()
        return response

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
