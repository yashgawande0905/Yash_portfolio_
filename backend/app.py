# app.py
#
# Local development server. It mirrors the production Vercel function in
# ../api/contact.js exactly — same validation, same escaping, same Resend call —
# so what you test here is what ships.
#
# In production on Vercel this file is NOT used: the static frontend is served
# from the CDN and /api/contact runs as a Node function. Keep this around for
# local work, or deploy it as-is to Render/Railway if you'd rather run a real
# Python server (see README).
import html
import json
import os
import re
import time
import urllib.error
import urllib.request
from collections import defaultdict

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

load_dotenv()

# The React app is built by Vite into ../frontend/dist (run `npm run build`
# inside /frontend first). Flask just serves that static bundle + the API.
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

# static_folder=None on purpose. With static_url_path="" Flask registers its own
# "/<path:filename>" handler, which wins over the catch-all below and answers a
# bare 404 for unknown paths — killing the SPA deep-link fallback. Serving the
# files ourselves keeps routing in one place.
app = Flask(__name__, static_folder=None)
CORS(app, resources={r"/api/*": {"origins": os.getenv("ALLOWED_ORIGINS", "*").split(",")}})

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
CONTACT_TO_EMAIL = os.getenv("CONTACT_TO_EMAIL")
CONTACT_FROM_EMAIL = os.getenv("CONTACT_FROM_EMAIL", "Portfolio <onboarding@resend.dev>")

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[a-z]{2,}$", re.IGNORECASE)

RATE_LIMIT_WINDOW = 60 * 60  # seconds
RATE_LIMIT_MAX = 5
_hits: dict[str, list[float]] = defaultdict(list)


def _rate_limited(ip: str) -> bool:
    now = time.time()
    recent = [t for t in _hits[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(recent) >= RATE_LIMIT_MAX:
        _hits[ip] = recent
        return True
    recent.append(now)
    _hits[ip] = recent
    return False


def _validate(payload: dict) -> tuple[dict | None, str | None]:
    """Returns (cleaned_data, error_message)."""
    name = str(payload.get("name") or "").strip()
    email = str(payload.get("email") or "").strip()
    subject = str(payload.get("subject") or "").strip()
    message = str(payload.get("message") or "").strip()

    if not (2 <= len(name) <= 100):
        return None, "Please enter your name (2–100 characters)."
    if not email or len(email) > 254 or not EMAIL_RE.match(email):
        return None, "Please enter a valid email address."
    if len(subject) > 150:
        return None, "Subject must be under 150 characters."
    if not (10 <= len(message) <= 5000):
        return None, "Message must be between 10 and 5000 characters."
    # Header-injection guard: newlines have no business in these fields.
    if any("\r" in f or "\n" in f for f in (name, email, subject)):
        return None, "Invalid characters in name, email or subject."

    return {"name": name, "email": email, "subject": subject, "message": message}, None


def _build_email(data: dict, ip: str) -> tuple[str, str, str]:
    safe_subject = data["subject"] or "No subject"
    e = html.escape
    body_html = f"""
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;color:#1a1a1a">
      <h2 style="margin:0 0 4px;font-size:18px">New portfolio message</h2>
      <p style="margin:0 0 20px;color:#666;font-size:13px">Just reply to this email to answer {e(data['name'])} directly.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:80px">Name</td><td style="padding:6px 0"><strong>{e(data['name'])}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:{e(data['email'])}">{e(data['email'])}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Subject</td><td style="padding:6px 0">{e(safe_subject)}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#f6f6f8;border-radius:8px;white-space:pre-wrap;font-size:14px;line-height:1.6">{e(data['message'])}</div>
      <p style="margin-top:20px;color:#999;font-size:11px">Sent from your portfolio contact form · {e(ip)}</p>
    </div>"""

    body_text = (
        "New portfolio message\n\n"
        f"Name: {data['name']}\nEmail: {data['email']}\nSubject: {safe_subject}\n\n"
        f"{data['message']}\n\n— sent from your portfolio contact form"
    )
    return body_html, body_text, safe_subject


def _send_via_resend(data: dict, ip: str) -> tuple[bool, str | None]:
    body_html, body_text, safe_subject = _build_email(data, ip)
    payload = json.dumps(
        {
            "from": CONTACT_FROM_EMAIL,
            "to": [CONTACT_TO_EMAIL],
            "reply_to": data["email"],
            "subject": f"[Portfolio] {safe_subject} — {data['name']}",
            "html": body_html,
            "text": body_text,
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            if response.status in (200, 201, 202):
                return True, None
            return False, f"Resend responded {response.status}"
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400]
        return False, f"Resend responded {exc.code}: {detail}"
    except Exception as exc:  # network failure, DNS, timeout...
        return False, f"{type(exc).__name__}: {exc}"


@app.route("/api/contact", methods=["POST", "GET", "PUT", "DELETE"])
def contact():
    if request.method != "POST":
        return jsonify({"error": "Method not allowed. Use POST."}), 405

    if not RESEND_API_KEY or not CONTACT_TO_EMAIL:
        app.logger.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL env var")
        return jsonify({"error": "The contact form is not configured yet. Please email me directly."}), 503

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Malformed request body."}), 400

    # Honeypot: real people never see this field, bots fill everything in.
    if str(payload.get("company") or "").strip():
        app.logger.warning("honeypot triggered")
        return jsonify({"ok": True})

    data, error = _validate(payload)
    if error:
        return jsonify({"error": error}), 400

    ip = (request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
          or request.remote_addr or "unknown")

    if _rate_limited(ip):
        return jsonify({"error": "Too many messages sent. Please try again later."}), 429

    ok, failure = _send_via_resend(data, ip)
    if ok:
        app.logger.info("Contact email sent for %s", data["email"])
        return jsonify({"ok": True})

    app.logger.error("Send failed: %s", failure)
    return jsonify({"error": "Could not send the message right now. Please email me directly."}), 502


@app.get("/api/health")
def health():
    """Cheap readiness probe — also tells you whether the env vars landed."""
    return jsonify({
        "ok": True,
        "resend_key_loaded": bool(RESEND_API_KEY),
        "to_email_configured": bool(CONTACT_TO_EMAIL),
    })


# Serve the built React app for every non-API route (so a hard refresh on
# any path still resolves correctly)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path.startswith("api/"):
        return jsonify({"error": "Not found"}), 404
    full_path = os.path.join(FRONTEND_DIST, path)
    if path and os.path.exists(full_path) and os.path.isfile(full_path):
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    print(f"Flask running at: http://127.0.0.1:{port}")
    print("Resend key loaded:", bool(RESEND_API_KEY))
    print("Delivering to:", CONTACT_TO_EMAIL or "(not set — check backend/.env)")
    if not os.path.isdir(FRONTEND_DIST):
        print("frontend/dist not found — run `npm install && npm run build` inside /frontend first.")
    app.run(debug=debug, port=port, host="0.0.0.0")
