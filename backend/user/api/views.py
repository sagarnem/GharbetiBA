from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from user.models import User, OTP, PendingUser,UserProfile
from .serializers import *
from user.utils import send_otp_email
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser, FormParser
from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import AuthException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import logging
import os
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
import requests
User = get_user_model()

logger = logging.getLogger(__name__)
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            role = serializer.validated_data['role']

            # Save pending user
            hashed_password = make_password(password)
            PendingUser.objects.update_or_create(
                email=email,
                defaults={'password': hashed_password, 'role': role}
            )

            send_otp_email(email, "register")
            return Response({"message": "OTP sent. Please verify your email."}, status=200)
        else:
        # If serializer is not valid, print the errors for debugging
            print("Serializer errors:", serializer.errors)
        # This will help you see what went wrong in the request data
        return Response(serializer.errors, status=400)


class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            purpose = serializer.validated_data.get('purpose', 'register')  # default to register

            otp = OTP.objects.filter(email=email, code=code, purpose=purpose, is_verified=False).last()

            if otp and not otp.is_expired():
                otp.is_verified = True
                otp.save()

                if purpose == 'register':
                    try:
                        pending = PendingUser.objects.get(email=email)
                        user = User.objects.create(
                            email=email,
                            password=pending.password,
                            role=pending.role,
                            is_active=True,
                        )
                        pending.delete()
                        return Response({"message": "Email verified. Account created."})
                    except PendingUser.DoesNotExist:
                        return Response({"error": "No pending registration found."}, status=404)

                elif purpose == 'reset_password':
                    return Response({"message": "OTP verified. You can now reset your password."})

                elif purpose == 'social_login':
                    try:
                        user = User.objects.get(email=email)
                        refresh = RefreshToken.for_user(user)
                        return Response({
                            "message": "OTP verified. Logged in via social account.",
                            "access": str(refresh.access_token),
                            "refresh": str(refresh),
                        })
                    except User.DoesNotExist:
                        return Response({"error": "User not found."}, status=404)

                return Response({"message": "OTP verified."})

            return Response({"error": "Invalid or expired OTP"}, status=400)

        return Response(serializer.errors, status=400)



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh = RefreshToken.for_user(user)
            return Response({
               "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "email": user.email,
                    "role": user.role,
                }
            })
        return Response(serializer.errors, status=400)
class RequestPasswordResetView(APIView):
    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User, email=serializer.validated_data['email'])
            send_otp_email(user.email, "reset")
            return Response({"message": "OTP sent for password reset"})
        return Response(serializer.errors, status=400)

class ConfirmPasswordResetView(APIView):
    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            new_password = serializer.validated_data['new_password']

            user = get_object_or_404(User, email=email)
            otp = OTP.objects.filter(email=user.email, code=code, purpose="reset").last()
            if otp:
                print(f"OTP found: {otp}")
                expired = otp.is_expired()
                print(f"OTP expired? {expired}")
                if not expired:
                    user.set_password(new_password)
                    user.save()
                    otp.is_verified = True
                    otp.save()
                    return Response({"message": "Password reset successful"})
                else:
                    print("OTP is expired.")
            return Response({"error": "Invalid or expired OTP"}, status=400)
        
        return Response(serializer.errors, status=400)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"error": "Old password is incorrect"}, status=400)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully"})
        return Response(serializer.errors, status=400)
    
class CreateUserProfileView(generics.CreateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RetrieveUserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class UpdateUserProfileView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user.profile

class SocialLoginView(APIView):
    def post(self, request, *args, **kwargs):
        provider = request.data.get("provider")
        access_token = request.data.get("access_token")

        if not provider or not access_token:
            return Response({"error": "provider and access_token are required"}, status=400)

        strategy = load_strategy(request)
        try:
            backend = load_backend(strategy=strategy, name=provider, redirect_uri=None)
        except Exception as e:
            logger.error(f"Failed to load backend {provider}: {e}")
            return Response({"error": f"Invalid provider: {provider}"}, status=400)

        try:
            user = backend.do_auth(access_token)
        except AuthException as e:
            logger.error(f"Authentication failed for provider {provider}: {e}")
            return Response({"error": "Invalid token"}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error during auth: {e}")
            return Response({"error": "Authentication error"}, status=500)

        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })

        return Response({"error": "Authentication failed"}, status=400)
    
class GoogleLoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        id_token_str = request.data.get("id_token")
        role_from_frontend = request.data.get("role", "tenant")
        if not id_token_str:
            return Response({"error": "ID token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify token with Google
            idinfo = id_token.verify_oauth2_token(id_token_str, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            email = idinfo.get('email')
            name = idinfo.get('name')
            picture_url = idinfo.get('picture')
            email_verified = idinfo.get('email_verified', False)

            if not email or not email_verified:
                return Response({"error": "Email not verified by Google"}, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "is_active": True,
                    "role": role_from_frontend,  # assign role only on create
                }
            )

            # Create or update profile
            profile, _ = UserProfile.objects.get_or_create(user=user)
            if name:
                profile.full_name = name
            birthdate = idinfo.get("birthdate")
            if birthdate:
                profile.date_of_birth = birthdate
            if picture_url and not profile.photo:
                try:
                    img_temp = NamedTemporaryFile(delete=True)
                    img_response = requests.get(picture_url)
                    img_temp.write(img_response.content)
                    img_temp.flush()
                    file_name = f"{user.email.replace('@', '_')}_google.jpg"
                    profile.photo.save(file_name, File(img_temp), save=False)
                except Exception as e:
                    print(f"Image download failed: {e}")

            profile.save()

            # Issue JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "email": user.email,
                    "full_name": profile.full_name,
                    "photo": profile.photo.url if profile.photo else None,
                    "role": user.role,
                }
            })

        except ValueError as e:
            return Response({"error": "Invalid ID token", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)