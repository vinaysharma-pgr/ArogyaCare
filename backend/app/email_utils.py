from flask_mail import Message
from app import mail
import os


def send_verification_email(user_email, verify_link):

    msg = Message(
        subject="Verify your ArogyaCare account",
        sender=os.getenv("MAIL_USERNAME"),
        recipients=[user_email]
    )

    msg.body = f"""
Welcome to ArogyaCare!

Please verify your email by clicking the link below:

{verify_link}

If you did not create this account, please ignore this email.
"""

    mail.send(msg)