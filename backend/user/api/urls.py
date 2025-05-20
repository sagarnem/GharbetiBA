from django.urls import path
from .views import *

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("verify-otp/", OTPVerifyView.as_view()),
    path("login/", LoginView.as_view()),
    path("request-reset/", RequestPasswordResetView.as_view()),
    path("confirm-reset/", ConfirmPasswordResetView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
]
