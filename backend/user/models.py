from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string


class UserRoles(models.TextChoices):
    OWNER = "owner", "Owner"
    TENANT = "tenant", "Tenant"
    SUPERUSER = "superuser", "Superuser"


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role=UserRoles.TENANT, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, role=UserRoles.SUPERUSER, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=15, choices=UserRoles.choices, default=UserRoles.TENANT)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # admin site access
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"
    
# models.py
class PendingUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # store hashed password!
    role = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=100, blank=True)
    phone_number_1 = models.CharField(max_length=15, blank=True)
    phone_number_2 = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to='user_photos/', null=True, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Profile of {self.user.email}"
    
class OTP(models.Model):
    PURPOSE_CHOICES = [
        ('register', 'Register'),
        ('reset_password', 'Reset Password'),
        ('social_login', 'Social Login'),
    ]

    email = models.EmailField()
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        return self.created_at < timezone.now() - timedelta(minutes=10)


