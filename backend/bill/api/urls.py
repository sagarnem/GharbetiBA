from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RoomViewSet, TenantViewSet, ElectricityBillViewSet, WaterBillViewSet,
    WasteManagementBillViewSet, MonthlyBillViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'tenants', TenantViewSet)
router.register(r'electricity-bills', ElectricityBillViewSet)
router.register(r'water-bills', WaterBillViewSet)
router.register(r'waste-bills', WasteManagementBillViewSet)
router.register(r'monthly-bills', MonthlyBillViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
