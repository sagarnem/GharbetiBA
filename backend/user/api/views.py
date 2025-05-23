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

        return Response(serializer.errors, status=400)


class OTPVerifyView(APIView):
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']

            otp = OTP.objects.filter(email=email, code=code, purpose="register").last()
            if otp and not otp.is_expired():
                try:
                    pending = PendingUser.objects.get(email=email)

                    # Create real user now
                    user = User.objects.create(
                        email=email,
                        password=pending.password,  # already hashed
                        role=pending.role,
                        is_active=True
                    )

                    otp.is_verified = True
                    otp.save()
                    pending.delete()  # clean up

                    return Response({"message": "Email verified. Account created."})

                except PendingUser.DoesNotExist:
                    return Response({"error": "No pending registration found."}, status=404)

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
            })
        return Response(serializer.errors, status=400)
class RequestPasswordResetView(APIView):
    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User, email=serializer.validated_data['email'])
            send_otp_email(user, "reset")
            return Response({"message": "OTP sent for password reset"})
        return Response(serializer.errors, status=400)

class ConfirmPasswordResetView(APIView):
    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(User, email=serializer.validated_data['email'])
            otp = OTP.objects.filter(user=user, code=serializer.validated_data['code'], purpose="reset").last()
            if otp and not otp.is_expired():
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                otp.is_verified = True
                otp.save()
                return Response({"message": "Password reset successful"})
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
