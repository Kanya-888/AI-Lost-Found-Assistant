import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from backend.config import settings

class EmailService:
    """Service for rendering and delivering HTML emails via Gmail SMTP."""

    @staticmethod
    def send_match_notification(
        recipient_email: str,
        user_name: str,
        lost_item: Any,
        found_item: Any,
        similarity_score: float
    ) -> bool:
        """
        Render match template and send email to item owner.
        Returns True if sent successfully, False otherwise.
        """
        similarity_percentage = round(similarity_score * 100, 1)

        template_path = os.path.join(
            os.path.dirname(__file__), "..", "emails", "templates", "match_notification.html"
        )

        try:
            with open(template_path, "r", encoding="utf-8") as f:
                template_content = f.read()

            template = Template(template_content)
            html_body = template.render(
                user_name=user_name,
                similarity_percentage=similarity_percentage,
                lost_item_name=lost_item.name,
                lost_category=lost_item.category,
                date_lost=lost_item.date_lost,
                lost_location=lost_item.location,
                lost_description=lost_item.description,
                found_item_name=found_item.name,
                found_category=found_item.category,
                date_found=found_item.date_found,
                found_location=found_item.location,
                found_description=found_item.description
            )

            # Check if SMTP user/password configured
            if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
                print(f"[Email Service MOCK] Match Email to {recipient_email} (Confidence: {similarity_percentage}%). SMTP credentials not configured.")
                return True

            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"🔍 AI Match Found ({similarity_percentage}% Confidence): {lost_item.name}"
            msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.SMTP_USER}>"
            msg["To"] = recipient_email

            part = MIMEText(html_body, "html")
            msg.attach(part)

            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USER, recipient_email, msg.as_string())

            print(f"[Email Service] Successfully sent match email to {recipient_email}")
            return True

        except Exception as e:
            print(f"[Email Service Error] Failed to send email to {recipient_email}: {e}")
            return False

email_service = EmailService()
