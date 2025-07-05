from rest_framework import serializers
from bill.models import Room, Tenant, ElectricityBill, WaterBill, WasteManagementBill, MonthlyBill, Payment

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class ElectricityBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityBill
        fields = '__all__'

class WaterBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterBill
        fields = '__all__'

class WasteManagementBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteManagementBill
        fields = '__all__'

class MonthlyBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBill
        fields = '__all__'
        read_only_fields = ('total_amount',)

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
