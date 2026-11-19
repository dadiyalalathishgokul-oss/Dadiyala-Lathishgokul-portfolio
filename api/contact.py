"""
Vercel Python Serverless Function & Local Development Server
Handles portfolio contact queries and sends email to dadiyalalathishgokul@gmail.com.
"""

from __future__ import annotations

import argparse
from email.message import EmailMessage
import html
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import smtplib
import ssl
from typing import Any
import urllib.error
import urllib.request

DEFAULT_RECIPIENT = "dadiyalalathishgokul@gmail.com"
EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$")


def _load_local_env() -> None:
    """Load .env variables when running locally outside Vercel."""
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if not env_path.exists():
        return
    try:
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
    except OSError:
        pass


def _sanitize_header_text(value: str) -> str:
    """Prevent email header injection by stripping CR/LF characters."""
    return re.sub(r"[\r\n]+", " ", value).strip()


def validate_contact_payload(data: Any) -> tuple[dict[str, str] | None, dict[str, str]]:
    """Validate the four required contact fields: name, email, subject, message."""
    if not isinstance(data, dict):
        return None, {"form": "Request body must be a JSON object."}

    errors: dict[str, str] = {}

    name = _sanitize_header_text(str(data.get("name", "")))
    email = _sanitize_header_text(str(data.get("email", "")))
    subject = _sanitize_header_text(str(data.get("subject", "")))
    message = str(data.get("message", "")).strip()

    if len(name) < 2:
        errors["name"] = "Please enter your name (at least 2 characters)."
    elif len(name) > 100:
        errors["name"] = "Name must be 100 characters or fewer."

    if not email:
        errors["email"] = "Please enter your contact email address."
    elif len(email) > 150 or not EMAIL_PATTERN.match(email):
        errors["email"] = "Please enter a valid contact email address."

    if len(subject) < 2:
        errors["subject"] = "Please enter a subject (at least 2 characters)."
    elif len(subject) > 150:
        errors["subject"] = "Subject must be 150 characters or fewer."

    if len(message) < 10:
        errors["message"] = "Please enter a message (at least 10 characters)."
    elif len(message) > 4000:
        errors["message"] = "Message must be 4,000 characters or fewer."

    if errors:
        return None, errors

    return {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
    }, {}


def _build_email_bodies(fields: dict[str, str]) -> tuple[str, str]:
    plain_text = (
        "New Portfolio Contact Query\n"
        "===========================\n\n"
        f"Name: {fields['name']}\n"
        f"Contact Email: {fields['email']}\n"
        f"Subject: {fields['subject']}\n\n"
        "Message:\n"
        f"{fields['message']}\n"
    )

    escaped_name = html.escape(fields["name"])
    escaped_email = html.escape(fields["email"])
    escaped_subject = html.escape(fields["subject"])
    escaped_message = html.escape(fields["message"]).replace("\n", "<br />")

    html_body = f"""\
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f6f8f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111e24;">
    <div style="max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #d8e2df;border-radius:12px;padding:28px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#0b6b62;">Portfolio Inquiry</p>
      <h2 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#111e24;">{escaped_subject}</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e6eeeb;color:#4d626a;width:130px;">From</td>
          <td style="padding:8px 0;border-bottom:1px solid #e6eeeb;font-weight:600;">{escaped_name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e6eeeb;color:#4d626a;">Reply Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #e6eeeb;"><a href="mailto:{escaped_email}" style="color:#0b6b62;text-decoration:none;">{escaped_email}</a></td>
        </tr>
      </table>
      <div style="background:#f6f8f7;border-radius:8px;padding:16px;font-size:15px;line-height:1.65;color:#111e24;">
        {escaped_message}
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#4d626a;">
        Sent via the Python contact backend on your portfolio. Hit reply to respond directly to {escaped_email}.
      </p>
    </div>
  </body>
</html>
"""
    return plain_text, html_body


def send_via_smtp(fields: dict[str, str], recipient: str) -> None:
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com").strip() or "smtp.gmail.com"
    smtp_port = int(os.environ.get("SMTP_PORT", "465").strip() or "465")
    smtp_user = os.environ.get("SMTP_USER", recipient).strip() or recipient
    smtp_pass = os.environ.get("SMTP_PASS", "").strip()

    if not smtp_pass:
        raise RuntimeError("EMAIL_NOT_CONFIGURED")

    plain_text, html_body = _build_email_bodies(fields)

    msg = EmailMessage()
    msg["Subject"] = f"[Portfolio Query] {fields['subject']}"
    msg["From"] = f"{fields['name']} via Portfolio <{smtp_user}>"
    msg["To"] = recipient
    msg["Reply-To"] = f"{fields['name']} <{fields['email']}>"
    msg.set_content(plain_text)
    msg.add_alternative(html_body, subtype="html")

    context = ssl.create_default_context()
    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=15) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    else:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)


def send_via_resend(fields: dict[str, str], recipient: str) -> None:
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("EMAIL_NOT_CONFIGURED")

    from_addr = os.environ.get("RESEND_FROM", "Portfolio Contact <onboarding@resend.dev>").strip()
    plain_text, html_body = _build_email_bodies(fields)

    payload = json.dumps(
        {
            "from": from_addr,
            "to": [recipient],
            "reply_to": fields["email"],
            "subject": f"[Portfolio Query] {fields['subject']}",
            "text": plain_text,
            "html": html_body,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "lathish-portfolio-python-backend/1.0",
        },
        method="POST",
    )

    with urllib.request.urlopen(req, timeout=15) as resp:
        if resp.status >= 400:
            raise RuntimeError(f"Resend returned status {resp.status}")


def dispatch_contact_email(fields: dict[str, str]) -> str:
    _load_local_env()
    recipient = os.environ.get("RECIPIENT_EMAIL", DEFAULT_RECIPIENT).strip() or DEFAULT_RECIPIENT

    if os.environ.get("SMTP_PASS", "").strip():
        send_via_smtp(fields, recipient)
        return "smtp"

    if os.environ.get("RESEND_API_KEY", "").strip():
        send_via_resend(fields, recipient)
        return "resend"

    raise RuntimeError("EMAIL_NOT_CONFIGURED")


def is_mail_configured() -> bool:
    _load_local_env()
    return bool(os.environ.get("SMTP_PASS", "").strip() or os.environ.get("RESEND_API_KEY", "").strip())


class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function entrypoint (also used by local HTTP server)."""

    def _send_json(self, status_code: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        _load_local_env()
        recipient = os.environ.get("RECIPIENT_EMAIL", DEFAULT_RECIPIENT).strip() or DEFAULT_RECIPIENT
        self._send_json(
            200,
            {
                "ok": True,
                "runtime": "python",
                "recipient": recipient,
                "configured": is_mail_configured(),
            },
        )

    def do_POST(self) -> None:
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self._send_json(400, {"ok": False, "message": "Invalid Content-Length header."})
            return

        if content_length <= 0 or content_length > 64 * 1024:
            self._send_json(400, {"ok": False, "message": "Request body size is invalid."})
            return

        raw_body = self.rfile.read(content_length)
        try:
            parsed = json.loads(raw_body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(400, {"ok": False, "message": "Invalid JSON payload."})
            return

        fields, field_errors = validate_contact_payload(parsed)
        if fields is None:
            self._send_json(
                400,
                {
                    "ok": False,
                    "code": "VALIDATION_ERROR",
                    "message": "Please check the highlighted form fields.",
                    "errors": field_errors,
                },
            )
            return

        recipient = os.environ.get("RECIPIENT_EMAIL", DEFAULT_RECIPIENT).strip() or DEFAULT_RECIPIENT

        try:
            provider = dispatch_contact_email(fields)
        except RuntimeError as exc:
            if str(exc) == "EMAIL_NOT_CONFIGURED":
                self._send_json(
                    503,
                    {
                        "ok": False,
                        "code": "EMAIL_NOT_CONFIGURED",
                        "recipient": recipient,
                        "message": (
                            "Email transport is not configured on this environment yet. "
                            "Add SMTP_PASS (Gmail App Password) in Vercel Environment Variables "
                            "to send emails directly, or use the direct email option below."
                        ),
                    },
                )
                return
            self._send_json(
                502,
                {
                    "ok": False,
                    "code": "DELIVERY_FAILED",
                    "message": f"Mail provider error: {exc}",
                },
            )
            return
        except (smtplib.SMTPException, urllib.error.URLError, OSError) as exc:
            self._send_json(
                502,
                {
                    "ok": False,
                    "code": "DELIVERY_FAILED",
                    "message": f"Could not deliver message via mail server: {exc}",
                },
            )
            return

        self._send_json(
            200,
            {
                "ok": True,
                "provider": provider,
                "recipient": recipient,
                "message": f"Your message has been delivered to {recipient}.",
            },
        )

    def log_message(self, format: str, *args: Any) -> None:
        # Suppress noisy stderr access logs unless debugging
        return


def run_local_server(port: int) -> None:
    _load_local_env()
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Python contact backend listening on http://127.0.0.1:{port}/api/contact", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run local Python contact backend server.")
    parser.add_argument("--port", type=int, default=8001)
    cli_args = parser.parse_args()
    run_local_server(cli_args.port)
