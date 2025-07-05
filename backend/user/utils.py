from .models import OTP
from django.core.mail import EmailMultiAlternatives
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

    # Create the OTP entry in the database
    OTP.objects.create(email=email, code=code, purpose=purpose)
  
    # Email subject
    subject = f"Your OTP for {purpose.capitalize()}"

    # Plain text version (fallback)
    text_content = f"""
    Hello,

    Your One-Time Password (OTP) for {purpose} is: {code}

    Please do not share this code with anyone. It is valid for a limited time.

    Thank you,
    GharbetiBa Team
    """

    # HTML version
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #2b6cb0;">GharbetiBa</h2>
        <p style="font-size: 16px;">Hi there,</p>
        <p style="font-size: 16px;">Your <strong>{purpose}</strong> OTP is:</p>
        <p style="font-size: 28px; font-weight: bold; color: #2b6cb0; text-align: center; letter-spacing: 4px;">{code}</p>
        <p style="font-size: 14px; color: #666;">This code is valid for a limited time about <span style="font-weight: bold; color:red;">5 minutes</span> and should not be shared with anyone.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 14px; color: #999;">If you didn't request this, you can safely ignore this email.</p>
        <p style="font-size: 14px; color: #999;">– GharbetiBa Team</p>
      </div>
    </body>
    </html>
    """

    email_message = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=None,
        to=[email],
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()
