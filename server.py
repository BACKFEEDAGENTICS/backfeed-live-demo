import http.server
import json
import sys
import os
import urllib.request
import xml.etree.ElementTree as ET
import threading
import time
import math
import random
import imaplib
import email
import email.header
import email.utils
import re
import hashlib
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timedelta

# Add scripts directory to sys.path to resolve imported modules
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts'))

try:
    import win32com.client as win32
    HAS_WIN32COM = True
except ImportError:
    win32 = None
    HAS_WIN32COM = False

PORT = 8085

# ─────────────────────────────────────────────
# IMAP Inbox Infrastructure
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INBOXES_CONFIG = os.path.join(BASE_DIR, "inboxes.json")

_email_cache = {}
_email_cache_ts = 0
EMAIL_CACHE_TTL = 60

_SPAM_SUBJ = re.compile(
    r'(urgent|wire.?transfer|verify.?account|confirm.?payment|act.?now|'
    r'limited.?time|click.?here|congratulations|you.?won|free.?gift|'
    r'account.?suspended|password.?expire|bitcoin|crypto|invoice.?attached)', re.I)
_SPAM_BODY = re.compile(
    r'(unsubscribe|click.?below|dear.?friend|dear.?customer|'
    r'nigerian|lottery|inheritance|wire.?\$)', re.I)
_HIGH_RISK_TLDS = {'.top', '.xyz', '.info', '.click', '.loan', '.work', '.bid',
                   '.win', '.gq', '.ml', '.cf', '.tk', '.pw'}

def load_inbox_config() -> list:
    if not os.path.exists(INBOXES_CONFIG):
        return []
    try:
        with open(INBOXES_CONFIG) as f:
            return json.load(f).get("inboxes", [])
    except Exception:
        return []

def _score_spam(sender_email: str, subject: str, body: str) -> int:
    score = 0
    domain = sender_email.split("@")[-1].lower() if "@" in sender_email else ""
    tld = "." + domain.rsplit(".", 1)[-1] if "." in domain else ""
    if tld in _HIGH_RISK_TLDS:
        score += 40
    if _SPAM_SUBJ.search(subject):
        score += 35
    if _SPAM_BODY.search(body[:500]):
        score += 20
    if re.search(r'\$[\d,]+', subject + body[:200]):
        score += 10
    if re.search(r'[A-Z]{5,}', subject):
        score += 5
    return min(score, 99)

def _decode_hdr(value: str) -> str:
    if not value:
        return ""
    parts = email.header.decode_header(value)
    out = []
    for chunk, charset in parts:
        if isinstance(chunk, bytes):
            out.append(chunk.decode(charset or "utf-8", errors="replace"))
        else:
            out.append(chunk)
    return "".join(out)

def _extract_body(msg) -> str:
    if msg.is_multipart():
        for part in msg.walk():
            ct = part.get_content_type()
            if ct == "text/plain":
                try:
                    return part.get_payload(decode=True).decode(
                        part.get_content_charset() or "utf-8", errors="replace")
                except Exception:
                    pass
        for part in msg.walk():
            if part.get_content_type() == "text/html":
                try:
                    html = part.get_payload(decode=True).decode(
                        part.get_content_charset() or "utf-8", errors="replace")
                    return re.sub(r'<[^>]+>', ' ', html)
                except Exception:
                    pass
    else:
        try:
            payload = msg.get_payload(decode=True)
            if payload:
                return payload.decode(msg.get_content_charset() or "utf-8", errors="replace")
        except Exception:
            pass
    return ""

def fetch_imap_emails(inbox_cfg: dict, max_msgs: int = 30) -> list:
    host = inbox_cfg["imap_host"]
    port = inbox_cfg.get("imap_port", 993)
    use_ssl = inbox_cfg.get("imap_ssl", True)
    user = inbox_cfg["username"]
    pwd = inbox_cfg["password"]
    inbox_id = inbox_cfg.get("id", "inbox")

    try:
        M = imaplib.IMAP4_SSL(host, port) if use_ssl else imaplib.IMAP4(host, port)
        M.login(user, pwd)
        M.select("INBOX")
        _, data = M.search(None, "ALL")
        uids = data[0].split()
        uids = uids[-max_msgs:][::-1]

        results = []
        for uid in uids:
            try:
                _, raw = M.fetch(uid, "(RFC822)")
                raw_bytes = raw[0][1]
                msg = email.message_from_bytes(raw_bytes)
                sender_raw = msg.get("From", "")
                sender_name, sender_addr = email.utils.parseaddr(sender_raw)
                sender_name = _decode_hdr(sender_name) or sender_addr
                subject = _decode_hdr(msg.get("Subject", "(no subject)"))
                date_str = msg.get("Date", "")
                body = _extract_body(msg)
                snippet = body[:120].replace("\n", " ").strip() + "..."
                uid_str = uid.decode() if isinstance(uid, bytes) else str(uid)
                msg_id = hashlib.md5(f"{inbox_id}:{uid_str}".encode()).hexdigest()[:12]
                unread_flags = M.fetch(uid, "(FLAGS)")[1]
                unread = b"\\Seen" not in (unread_flags[0] if unread_flags[0] else b"")
                has_attach = any(
                    part.get_content_disposition() == "attachment"
                    for part in (msg.walk() if msg.is_multipart() else [msg])
                )
                attach_name = ""
                if has_attach:
                    for part in msg.walk():
                        if part.get_content_disposition() == "attachment":
                            attach_name = part.get_filename() or ""
                            break

                results.append({
                    "id": msg_id,
                    "inbox_id": inbox_id,
                    "senderName": sender_name,
                    "senderEmail": sender_addr,
                    "date": date_str,
                    "subject": subject,
                    "snippet": snippet,
                    "body": body,
                    "folder": "inbox",
                    "unread": unread,
                    "hasAttachment": has_attach,
                    "attachmentName": attach_name,
                    "riskScore": _score_spam(sender_addr, subject, body),
                    "uid": uid_str
                })
            except Exception as e:
                print(f"[IMAP] Error parsing message {uid}: {e}")
                continue
        M.logout()
        return results
    except Exception as e:
        print(f"[IMAP] Connection error for {inbox_id}: {e}")
        return []

def get_inbox_emails(account_filter=None) -> list:
    global _email_cache, _email_cache_ts
    now = time.time()
    cache_key = account_filter or "all"
    if cache_key in _email_cache and (now - _email_cache_ts) < EMAIL_CACHE_TTL:
        return _email_cache[cache_key]

    inboxes = load_inbox_config()
    if not inboxes:
        return []

    all_emails = []
    for inbox in inboxes:
        if account_filter and inbox.get("id") != account_filter:
            continue
        all_emails.extend(fetch_imap_emails(inbox))

    all_emails.sort(key=lambda m: m.get("date", ""), reverse=True)
    _email_cache[cache_key] = all_emails
    _email_cache_ts = now
    return all_emails

# ─────────────────────────────────────────────
# Stochastic & Merton Pricing Model State
# ─────────────────────────────────────────────
_stochastic_state = {
    "active": False,
    "multipliers": {
        "Copper": 1.0,
        "Aluminum": 1.0,
        "Crude Oil": 1.0,
        "Natural Gas": 1.0,
        "Steel HRC": 1.0,
        "PVC Resin": 1.0
    },
    "alert_email": None
}

RANDOM_SENDERS = [
    ("John Miller", "j.miller@miller-electric.co", "Miller Electric"),
    ("Sarah Jenkins", "sjenkins@apex-industrial.net", "Apex Industrial"),
    ("David Vance", "dvance@vance-builders.com", "Vance Builders"),
    ("Amanda Ross", "aross@ross-electrical.com", "Ross Electrical Contractors"),
    ("Robert Chen", "r.chen@chen-partners.org", "Chen & Partners"),
    ("Emily Taylor", "etaylor@taylor-power.net", "Taylor Power Systems"),
    ("Gary Peterson", "gpeterson@redwood-electric.com", "Redwood Electric"),
    ("Kelly Vance", "kvance@vance-power.com", "Vance Power Services")
]

_stochastic_inbox_emails = []

def generate_random_rfq_email(index):
    """Generates a highly conversational, erratic RFQ email thread from component pools."""
    sender_name, sender_email, company = random.choice(RANDOM_SENDERS)
    now = datetime.now()
    minutes_ago = index * 15 + random.randint(1, 10)
    mail_date = (now - timedelta(minutes=minutes_ago)).strftime("%B %d, %Y %I:%M %p")
    
    greetings = [
        "Yo Kevin, need a quick price check. Pls check stock.",
        "Hey buddy, check this out - need some stock checks ASAP!!",
        "Hi Kevin - hope you are doing well. RFQ list below.",
        "URGENT!!! Please quote pricing and availability on this list for tomorrow morning:",
        "Gary here, can you quote us on these project items for the Deptford job?"
    ]

    products = [
        ("EMT conduit 1\"", "sticks"),
        ("THHN 12 AWG solid copper", "ft"),
        ("MC Cable 12/2", "rolls"),
        ("GFCI Receptacle 20A", "pcs"),
        ("Aluminum Cable 4/0", "ft"),
        ("Unit Heater 5kW", "pcs"),
        ("EMT Compression Connector 3/4\"", "pcs"),
        ("LED Exit Sign", "pcs"),
        ("Main Lug Subpanel", "pcs")
    ]

    formats = [
        "- need {qty} {unit} of that {desc} if possible",
        "- {qty} {unit} - {desc}",
        "- can we get {qty} {unit} of the {desc}?",
        "- {desc} (need {qty} {unit})"
    ]

    thread_replies = [
        "\n\n---- Original Message ----\nFrom: sales@erpdistribution.com\nTo: estimator\nSent: Monday, June 15, 2026\nSubject: Re: Pricing Update\n\nThanks for reaching out. We can consolidate your freight. Let us know when the list is ready.",
        f"\n\nOn Tue, Jun 16, 2026 at 9:30 AM {sender_name} <{sender_email}> wrote:\n> Did you verify if the flatbed has room for B-Line channels? Let me know.",
        f"\n\nOn Mon, Jun 15, 2026 at 4:12 PM {sender_name} <{sender_email}> wrote:\n> We have the school project starting next week. Need to finalize pricing."
    ]

    greeting = greetings[index % len(greetings)]
    thread = thread_replies[index % len(thread_replies)]

    num_items = random.randint(2, 3)
    selected = random.sample(products, num_items)
    
    body_items = ""
    snippet_parts = []
    for i, (desc, unit) in enumerate(selected):
        qty = ((index + i + 1) * 15) % 300 or 50
        if qty > 100:
            qty = (qty // 50) * 50
        elif qty > 10:
            qty = (qty // 10) * 10
            
        fmt = formats[(index + i) % len(formats)]
        body_items += fmt.format(qty=qty, unit=unit, desc=desc) + "\n"
        snippet_parts.append(f"{qty} {unit} of {desc}")
        
    subject_options = [
        f"RFQ: {company} - Material list",
        f"Urgent Price Request - {company}",
        f"Re: Stock check / RFQ for {company}",
        f"Material Quote - {company} phase 2"
    ]
    subject = subject_options[index % len(subject_options)]
    
    body = f"{greeting}\n\n{body_items}\nLet me know if we can consolidate this with the flatbed scheduled out of West Deptford to save shipping cost. Thanks!\n\nBest,\n{sender_name}\n{company}\nCell: (609) 555-01{index}{thread}"
    snippet = f"Please check price/stock: {', '.join(snippet_parts)}..."
    
    return {
        "id": f"rand-rfq-{index}-{random.randint(1000, 9999)}",
        "senderName": sender_name,
        "senderEmail": sender_email,
        "date": mail_date,
        "subject": subject,
        "snippet": snippet[:60] + "...",
        "body": body,
        "folder": "inbox",
        "unread": True,
        "hasAttachment": False,
        "attachmentName": "",
        "riskScore": 5
    }

def apply_merton_shock(base_price, steps=30):
    """
    Simulates Merton Jump-Diffusion model for commodity price shock.
    dS(t) = (mu - lambda * kappa) * S * dt + sigma * S * dW + S * dJ
    """
    mu = 0.0384
    sigma = 0.2215
    lam = 3.12
    mu_j = 0.11 # Positive mean jump for a price shock surge
    sigma_j = 0.0984
    dt = 1.0 / 252.0
    
    # Expected relative jump size change kappa
    kappa = math.exp(mu_j + 0.5 * (sigma_j ** 2)) - 1
    
    S = base_price
    for _ in range(steps):
        # Brownian motion
        z = random.gauss(0, 1)
        
        # Poisson jumps count (usually 0 or 1 since lam * dt is small)
        p = lam * dt
        n_jumps = 1 if random.random() < p else 0
        
        # Jumps sum
        jump_sum = sum(random.gauss(mu_j, sigma_j) for _ in range(n_jumps))
        
        # Merton SDE step
        S = S * math.exp((mu - 0.5 * (sigma ** 2) - lam * kappa) * dt + sigma * math.sqrt(dt) * z + jump_sum)
        
    # Ensure a minimum shock of +8% to +15% on metals/commodities
    ratio = S / base_price
    if ratio < 1.08:
        ratio = random.uniform(1.08, 1.15)
    elif ratio > 1.25:
        ratio = random.uniform(1.15, 1.22)
    return ratio

def apply_shock_multipliers(results):
    global _stochastic_state
    shocked = {}
    for name, item in list(results.items()):
        mult = _stochastic_state["multipliers"].get(name, 1.0)
        old_price = item["price"]
        new_price = round(old_price * mult, 4 if name in ["Copper", "PVC Resin"] else 2)
        
        old_change = item.get("change", 0.0)
        prev_close = old_price - old_change
        new_change = round(new_price - prev_close, 4 if name in ["Copper", "PVC Resin"] else 2)
        new_pct = round((new_change / prev_close) * 100, 1) if prev_close else 0.0
        
        shocked[name] = {
            "symbol": item.get("symbol", ""),
            "price": new_price,
            "change": new_change,
            "pctChange": new_pct,
            "shockActive": True
        }
    return shocked


class SecurityGatewayServer(http.server.SimpleHTTPRequestHandler):
    def is_authenticated(self) -> bool:
        passcodes_str = os.environ.get("RENDER_PASSCODES", "BF-LIVE-DEMO").strip()
        if not passcodes_str:
            return True
        valid_passcodes = [p.strip() for p in passcodes_str.split(",") if p.strip()]
        if not valid_passcodes:
            return True
        cookie_header = self.headers.get('Cookie', '')
        cookies = {}
        if cookie_header:
            for item in cookie_header.split(';'):
                if '=' in item:
                    parts = item.strip().split('=', 1)
                    if len(parts) == 2:
                        cookies[parts[0].strip()] = parts[1].strip()
        return cookies.get('backfeed_passcode', '') in valid_passcodes

    def serve_login_page(self, error_msg=""):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        error_html = ""
        if error_msg:
            error_html = f"<div style='color: #ef4444; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 13px;'>{error_msg}</div>"
        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Backfeed Operations Center - Unlock</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {{
            font-family: 'Inter', -apple-system, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }}
        .card {{
            background-color: #1e293b;
            border: 1px solid #334155;
            padding: 40px;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
            text-align: center;
        }}
        .logo {{
            font-size: 24px;
            font-weight: 700;
            color: #10b981;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }}
        .subtitle {{
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 30px;
        }}
        .form-group {{
            text-align: left;
            margin-bottom: 20px;
        }}
        label {{
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #94a3b8;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }}
        input[type="password"] {{
            width: 100%;
            padding: 12px;
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 6px;
            color: #f8fafc;
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.15s ease;
        }}
        input[type="password"]:focus {{
            outline: none;
            border-color: #10b981;
        }}
        button {{
            width: 100%;
            padding: 12px;
            background-color: #10b981;
            border: none;
            border-radius: 6px;
            color: #0f172a;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.15s ease;
        }}
        button:hover {{
            opacity: 0.9;
        }}
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">BACKFEED</div>
        <div class="subtitle">Cognitive Sales Operations Center</div>
        {error_html}
        <form action="/login" method="get">
            <div class="form-group">
                <label for="code">Enter Passcode</label>
                <input type="password" id="code" name="code" placeholder="••••••••" required autofocus>
            </div>
            <button type="submit">Unlock Workspace</button>
        </form>
    </div>
</body>
</html>
"""
        self.wfile.write(html.encode('utf-8'))

    def do_GET(self):
        # 1. Parse and handle authentication requests
        parsed_url = urlparse(self.path)
        if parsed_url.path == '/login':
            query_params = parse_qs(parsed_url.query)
            submitted_code = query_params.get("code", [""])[0].strip()
            passcodes_str = os.environ.get("RENDER_PASSCODES", "BF-LIVE-DEMO").strip()
            valid_passcodes = [p.strip() for p in passcodes_str.split(",") if p.strip()] if passcodes_str else []
            if not valid_passcodes or submitted_code in valid_passcodes:
                self.send_response(302)
                self.send_header('Set-Cookie', f'backfeed_passcode={submitted_code}; Path=/; HttpOnly; Max-Age=86400')
                self.send_header('Location', '/index.html')
                self.end_headers()
                return
            else:
                self.serve_login_page(error_msg="Invalid Passcode. Please try again.")
                return

        # 2. Check if user is authenticated
        if not self.is_authenticated():
            self.serve_login_page()
            return
        if self.path == '/api/commodities':
            self.handle_commodities()
        elif self.path == '/api/news':
            self.handle_news()
        elif self.path.startswith('/api/inbox') or self.path == '/api/outlook-inbox':
            parsed = urlparse(self.path)
            account = parse_qs(parsed.query).get("account", [None])[0]
            if parsed.path == '/api/inbox/config':
                inboxes = load_inbox_config()
                self._send_json({"configured": len(inboxes) > 0, "count": len(inboxes),
                                 "inboxes": [{"id": i["id"], "name": i["name"],
                                              "display_email": i.get("display_email", i["username"])}
                                             for i in inboxes]})
            else:
                self.handle_inbox(account)
        elif self.path == '/api/scratch/list':
            self.handle_scratch_list()
        elif self.path.startswith('/api/scratch/view'):
            self.handle_scratch_view()
        else:
            super().do_GET()

    def handle_scratch_list(self):
        try:
            import os
            dirs = {
                "project": r"c:\Users\kDP10\OneDrive\Project_Default_2026-03-10_091750\scratch",
                "oddball": r"c:\Users\kDP10\OneDrive\oddball-electrical-sourcing\scratch"
            }
            result = {}
            for key, path in dirs.items():
                result[key] = []
                if os.path.exists(path):
                    for filename in sorted(os.listdir(path)):
                        filepath = os.path.join(path, filename)
                        if os.path.isfile(filepath):
                            size = os.path.getsize(filepath)
                            desc = ""
                            try:
                                # Read first line for comment description
                                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                                    first_line = f.readline().strip()
                                    if first_line.startswith(('#', '//', '::')):
                                        desc = first_line.lstrip('#/ :').strip()
                            except Exception:
                                pass
                            result[key].append({
                                "name": filename,
                                "size": size,
                                "desc": desc or "Utility script"
                            })
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as e:
            print(f"[ERROR] handle_scratch_list failed: {e}")
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))

    def handle_scratch_view(self):
        try:
            import urllib.parse
            parsed_url = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed_url.query)
            workspace = params.get('workspace', ['project'])[0]
            filename = params.get('file', [''])[0]
            
            # Prevent directory traversal
            filename = os.path.basename(filename)
            
            dirs = {
                "project": r"c:\Users\kDP10\OneDrive\Project_Default_2026-03-10_091750\scratch",
                "oddball": r"c:\Users\kDP10\OneDrive\oddball-electrical-sourcing\scratch"
            }
            
            target_dir = dirs.get(workspace)
            if not target_dir or not filename:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Invalid parameters")
                return
                
            filepath = os.path.join(target_dir, filename)
            if os.path.exists(filepath) and os.path.isfile(filepath):
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/plain; charset=utf-8')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(content.encode('utf-8'))
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
                    self.wfile.write(str(e).encode('utf-8'))
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"File not found")
        except Exception as e:
            print(f"[ERROR] handle_scratch_view failed: {e}")
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))

    def do_POST(self):
        if not self.is_authenticated():
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Unauthorized. Please unlock the workspace first."}).encode('utf-8'))
            return

        global _stochastic_state
        if self.path == '/send-email':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                scenario_title = data.get('title', 'Unknown Threat')
                decision = data.get('decision', 'Quarantine')
                reasoning = data.get('reasoning', '')
                logs = data.get('logs', [])
                
                if not HAS_WIN32COM or win32 is None:
                    raise Exception("Outlook COM integration is not supported on this host (missing pywin32 / non-Windows).")
                
                # Send email via Outlook COM
                outlook = win32.Dispatch('outlook.application')
                mail = outlook.CreateItem(0)
                mail.To = 'kdp10891@outlook.com'
                mail.Subject = f"[Backfeed Sentinel Alert] Heuristic Report: {scenario_title}"
                
                body_text = f"""BACKFEED COGNITIVE SECURITY Sentinel Report
--------------------------------------------------
Scenario Analyzed : {scenario_title}
Shield Decision   : {decision}

Defensive Reasoning & Opinions:
{reasoning}

PowerShell Diagnostics Executed:
"""
                for log in logs:
                    body_text += f"{log}\n"
                
                mail.Body = body_text
                mail.Send()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Email sent successfully via Outlook!"}).encode('utf-8'))
                print(f"[Server] Sent threat report email for {scenario_title} to kdp10891@outlook.com")
            except Exception as e:
                print(f"[Server] Error sending report email: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/generate-pptx':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                if not HAS_WIN32COM:
                    raise Exception("PowerPoint COM integration is not supported on this host (missing pywin32 / non-Windows).")
                
                import type_pptx_live
                import pythoncom
                pythoncom.CoInitialize()
                try:
                    type_pptx_live.build_presentation(data)
                finally:
                    pythoncom.CoUninitialize()
                print("[Server] Successfully generated ERP_Workflow_Concept.pptx via live typing")
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "PowerPoint slide deck created successfully!"}).encode('utf-8'))
            except Exception as e:
                print(f"[Server] Error generating presentation: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        elif self.path == '/api/inject-stochastic':
            
            # Fetch baseline prices
            base_commodities = {
                "Copper":      6.48,
                "Aluminum":    2540.00,
                "Crude Oil":   78.45,
                "Natural Gas": 2.84,
                "Steel HRC":   810.00,
                "PVC Resin":   0.92
            }
            
            # Compute new Merton multipliers
            multipliers = {}
            for name, base_price in base_commodities.items():
                multipliers[name] = apply_merton_shock(base_price, steps=30)
                
            # Copper and Aluminum get a forced surge between +8% and +15%
            for metal in ["Copper", "Aluminum"]:
                if multipliers[metal] < 1.08 or multipliers[metal] > 1.16:
                    multipliers[metal] = random.uniform(1.08, 1.15)
                    
            _stochastic_state["active"] = True
            _stochastic_state["multipliers"] = multipliers
            
            # Generate the alert email
            from datetime import datetime
            now_str = datetime.now().strftime("%B %d, %Y %I:%M %p")
            alert_subject = "ALERT: Merton Stochastic Pricing Shock - Metal Surge Triggered"
            alert_body = f"""MARKET INTELLIGENCE ALERT
--------------------------------------------------
Stochastic model: Merton Jump-Diffusion
Drift (mu)      : 3.84%
Volatility (sig): 22.15%
Jump Arrival (l): 3.12/yr

A discontinuous pricing surge event has been registered on the LME (London Metal Exchange) and Chicago Mercantile Exchange. High-volatility path simulation has triggered a step jump:

- Copper Price Surge    : +{round((multipliers['Copper'] - 1.0)*100, 2)}%
- Aluminum Price Surge  : +{round((multipliers['Aluminum'] - 1.0)*100, 2)}%
- Steel HRC Price Surge : +{round((multipliers['Steel HRC'] - 1.0)*100, 2)}%

All active distributor price sheets represent an immediate margins protection hold. Adjust counter-agent prepaids and contract line item margins immediately.

Global Commodities Desk
ERP Distribution Security Gateway"""

            alert_email = {
                "id": f"mail-shock-{int(time.time())}",
                "senderName": "Global Commodities Desk",
                "senderEmail": "commodities@lme-alerts.org",
                "date": now_str,
                "subject": alert_subject,
                "snippet": "A discontinuous pricing surge event has been registered. Metals prices show a step jump...",
                "body": alert_body,
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 75 # Suspicious/Notice
            }
            
            _stochastic_state["alert_email"] = alert_email
            
            print(f"[Server] Merton Shock Injected! Multipliers: {multipliers}")
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True, 
                "message": "Merton Jump-Diffusion price shock applied successfully",
                "multipliers": multipliers,
                "alert_email": alert_email
            }).encode('utf-8'))
        elif self.path == '/api/reset-stochastic':
            _stochastic_state["active"] = False
            _stochastic_state["multipliers"] = {
                "Copper": 1.0,
                "Aluminum": 1.0,
                "Crude Oil": 1.0,
                "Natural Gas": 1.0,
                "Steel HRC": 1.0,
                "PVC Resin": 1.0
            }
            _stochastic_state["alert_email"] = None
            print("[Server] Stochastic shock RESET. Prices returned to baseline.")
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "message": "Stochastic shock cleared"}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()


    def handle_commodities(self):
        with _cache_lock:
            data = dict(_cached_commodities)
        if _stochastic_state["active"]:
            data = apply_shock_multipliers(data)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def handle_news(self):
        with _cache_lock:
            data = list(_cached_news)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))


    def _send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def handle_inbox(self, account=None):
        inboxes = load_inbox_config()
        emails = get_inbox_emails(account_filter=account)
        self._send_json({
            "configured": len(inboxes) > 0,
            "inbox_count": len(inboxes),
            "emails": emails,
            "fetched_at": datetime.now().isoformat()
        })

    def handle_outlook_inbox(self):
        import time
        now_str = datetime.now().strftime("%B %d, %Y %I:%M %p")
        ts = time.time()

        # Load local base emails directly (no proxying to port 3001 to prevent connection timeouts)
        demo_emails = [
            {
                "id": "mail-1",
                "senderName": "Estimator (Client A)",
                "senderEmail": "estimating@vanguard-contractors-llc.net",
                "date": "June 8, 2026 8:02 AM",
                "subject": "RFQ: Deptford Storage Yard Expansion - Quick Quote Needed",
                "snippet": "Please quote the following materials for our upcoming Deptford yard refit project: 1,200 ft Titan B-Line strut...",
                "body": "Hello ERP Estimating Team,\n\nPlease quote the following materials for our upcoming Deptford yard refit project:\n- 1,200 ft Titan B-Line strut channel 14G\n- 800 ft Liberty Copper Cable THHN 4/0 AWG\n- 500 pcs Matrix Fittings EMT Compression Connector 1/2\"\n- 25 pcs GFCI SmartGuard Receptacle 20A White (DEV-GFCI)\n- 4 spools MC Cable 12/2 w/ Ground 250ft (CBL-MC122)\n\nWe need this quote back quickly. Address delivery to our Deptford Storage site. Account Reference: VG-992.\n\nThanks,\nClient A Estimator\nVanguard Contractors LLC",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 5
            },
            {
                "id": "mail-4",
                "senderName": "Purchasing (Client B)",
                "senderEmail": "purchasing@apex-distributors.com",
                "date": "June 8, 2026 7:12 AM",
                "subject": "RFQ: Prime Aluminum Feeder Cable & Heaters",
                "snippet": "We are putting together a quote for a commercial feeder job in Cherry Hill. Can you quote us pricing...",
                "body": "Hi Specialist,\n\nWe are putting together a quote for a commercial feeder job in Cherry Hill. Can you quote us pricing and availability for:\n- 3,000 ft Prime Aluminum Cable 4/0 AWG Feeder (WIR-XHHW40)\n- 4 pcs AeroTherm Electric Unit Heater 5kW (AER-THE-120)\n- 2 pcs 100A Main Lug Subpanel 12-Spc (PNL-100A)\n- 6 pcs 30A Double Pole Circuit Breaker (BKR-2P30)\n\nPlease advise on the lead time. If this qualifies for prepaid freight shipping, let us know.\n\nThanks,\nClient B Purchasing\nApex Electrical Distributors",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 5
            },
            {
                "id": "mail-5",
                "senderName": "Estimator (Client C)",
                "senderEmail": "estimating@beacon-supply.com",
                "date": "June 8, 2026 6:45 AM",
                "subject": "RFQ: Nova LED Lighting Upgrade & Breakers",
                "snippet": "We need pricing on represented lighting products and circuit breakers for the gym project: 120 pcs Nova LED...",
                "body": "Hi Client,\n\nWe need pricing on represented lighting products and circuit breakers for the high school gymnasium project:\n- 120 pcs Nova LED Lighting Industrial High Bay LED fixture 150W (LTG-HBAY)\n- 50 pcs 20A Single Pole Circuit Breaker (BKR-1P20)\n- 15 pcs LED Emergency Exit Sign Red Combo (LTG-EXIT)\n- 100 pcs 1-Gang Plastic Wallplate White (DEV-PL1G)\n\nPlease check if these items are in stock at West Deptford and provide your distributor pricing sheet. We would like to coordinate a local truck pickup if stock is ready, or check prepaid freight shipping terms.\n\nBest,\nClient C Estimator\nBeacon Electric Supply",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 8
            },
            {
                "id": "mail-2",
                "senderName": "Specialist D",
                "senderEmail": "specialist.d@erp-executives.top",
                "date": "June 8, 2026 7:45 AM",
                "subject": "URGENT: Verify Wire Transfer details immediately",
                "snippet": "Kevin, I am in an executive board meeting right now and need you to verify and approve a wire release...",
                "body": "Kevin,\n\nI am in an executive board meeting right now and need you to verify and approve a wire release of $45,000 for a supplier account. The job site shipment is on hold until payment clears.\n\nStaged Items on Hold:\n- 1,000 ft Titan B-Line strut channel 10ft (CON-STRUT)\n- 20 pcs Titan Transformers Buck-Boost (TITAN-XFMR-BB)\n- 100 pcs Nova LED Lighting High Bay (LTG-HBAY)\n\nSend confirmation as soon as it's processed. Do not call, just reply here.\n\nSpecialist D\nERP Executives",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 98
            },
            {
                "id": "mail-6",
                "senderName": "Titan B-Line Support",
                "senderEmail": "bline.support@titandevices-mock.com",
                "date": "June 7, 2026 5:02 PM",
                "subject": "Titan B-Line: Strut Channel Stock Shortages & Allocation Updates",
                "snippet": "ERP Team, due to raw steel coil pricing hikes on LME and Midwest production backlogs, all Titan B-Line...",
                "body": "ERP Team,\n\nDue to raw steel coil pricing hikes on LME and Midwest production backlogs, all Titan B-Line 10ft hot-dip galvanized steel strut channel (14G and 12G) will be placed on strict allocation starting June 15.\n\nAffected Allocation Items:\n- 1,500 ft Titan B-Line strut channel 14G (CON-STRUT)\n- 800 ft Titan B-Line strut channel deep slotted (CON-STRD)\n\nPlease review active customer blanket orders and cross-reference your regional stock counts in the West Deptford logistics queue. Contact Specialist B if you need to coordinate direct factory shipments.\n\nBest regards,\nTitan Division Sales Support",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 2
            },
            {
                "id": "mail-3",
                "senderName": "DuraPVC Sales Support",
                "senderEmail": "support@durapvc-mock.com",
                "date": "June 7, 2026 4:15 PM",
                "subject": "DuraPVC Fittings: Pricing list updates June 2026",
                "snippet": "Dear Distributors, please note the updated pricing matrices for PVC couplers, junctions, and elbows...",
                "body": "Dear Distributors,\n\nPlease note the updated pricing matrices for PVC couplers, junctions, and elbows effective June 15, 2026. \nWe represent the finest PVC conduit fittings in the regional market, shipped directly from our regional warehouses.\n\nAffected Price Book Items:\n- 1,000 pcs Schedule 40 PVC Coupling 2\" (CON-PVC20)\n- 2,500 pcs PVC Male Adapter 1\" (FIT-PVCC)\n\nPrepaid freight thresholds remain at $3,000 for East Division delivery out of West Deptford HQ.",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 5
            },
            {
                "id": "mail-9",
                "senderName": "Accounts Payable",
                "senderEmail": "ap.desk@erpdistribution.com",
                "date": "June 8, 2026 8:15 AM",
                "subject": "Discrepancy: Invoice Variance on PO-99180 (Matrix Fittings)",
                "snippet": "Kevin, there is a billing mismatch on Vanguard's PO-99180. The vendor invoice says $1,890 but ERP is $1,750...",
                "body": "Hi Kevin,\n\nWe received a vendor invoice for order SO-99180 / PO-99180 from Vanguard Contractors (our account Ref: VG-992). The billing doesn't align with what was entered in the ERP system, and we need to reconcile this direct billing variance.\n\nERP Order Entry shows:\n- 500 pcs Matrix Fittings EMT 1/2\" (MAT-FIT-201) entered at $3.50/pc (Total: $1,750.00)\n\nVendor Invoice states:\n- 500 pcs Matrix Fittings EMT 1/2\" billed at $3.78/pc (Total: $1,890.00)\n\nI'm not completely clear on what we need here. Did we authorize a price increase on these zinc compression connectors, or did they ship the wrong part? Please look into this and log it in the resolution queue.\n\nThanks,\nAccounts Payable Team",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0
            },
            {
                "id": "mail-10",
                "senderName": "Accounts Payable",
                "senderEmail": "ap.desk@erpdistribution.com",
                "date": "June 8, 2026 8:45 AM",
                "subject": "Discrepancy: Direct Billing Margin Variance on PO-99200 (DuraPVC)",
                "snippet": "Kevin, there is a billing mismatch on Redwood Electric's PO-99200. The vendor invoice says $3,750 but ERP is $2,450...",
                "body": "Hi Kevin,\n\nWe received a vendor invoice for order SO-99222 / PO-99200 from Redwood Electric (our account Ref: RW-802). The billing doesn't align with what was entered in the ERP system, and we need to reconcile this direct billing variance.\n\nERP Order Entry shows:\n- 2,500 pcs PVC Male Adapter 1\" (FIT-PVCC) entered at $0.98/pc (Total: $2,450.00)\n\nVendor Invoice states:\n- 2,500 pcs PVC Male Adapter 1\" (FIT-PVCC) billed at $1.50/pc (Total: $3,750.00)\n\nI'm not completely clear on what we need here. Did we authorize a price increase on these PVC male adapters, or did they ship the heavy-wall industrial grade? Please look into this and log it in the resolution queue.\n\nThanks,\nAccounts Payable Team",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0
            },
            {
                "id": f"sim-{ts}-1",
                "senderName": "Contractor Estimator",
                "senderEmail": "contractor.estimator@clientelec.com",
                "date": now_str,
                "subject": "RFQ: Ewing Storage Yard Expansion - Materials Quote",
                "snippet": "Hey Kevin, need pricing and availability on the following conduit, wire, fittings, and connectors...",
                "body": "Hey Kevin,\n\nCan you get me a quote and check stock on the below items for our Ewing storage yard expansion?\n- 500 sticks of 3/4 EMT conduit (CON-EMT34)\n- 300 sticks of 1 EMT conduit (CON-EMT10)\n- 600 pcs compression connectors 3/4 (FIT-EMTC)\n- 400 pcs set screw couplings 3/4 (FIT-EMTS)\n- 5000 ft 12 AWG THHN Copper wire black (WIR-THHN12)\n- 3000 ft 10 AWG THHN Copper wire black (WIR-THHN10)\n- 200 pcs 4S box 1-1/2 deep (BOX-4SQR)\n- 30 boxes yellow wire nuts (ACC-WNUT)\n\nWe need to pull this together by the end of the day. Please let us know if there are any shipping freight consolidation opportunities to save on delivery costs.\n\nBest,\nContractor Estimator\nProject Manager | Client Company Solutions",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 5
            },
            {
                "id": f"sim-{ts}-2",
                "senderName": "AC Project Lead",
                "senderEmail": "ac.project.lead@atlanticcoastelec.com",
                "date": now_str,
                "subject": "RFQ: AC Boardwalk Refit Lighting Order",
                "snippet": "Hi Kevin, we need to order wire, receptacles, and tape for the Atlantic City Boardwalk project. Please see...",
                "body": "Hi Kevin,\n\nWe are ready to place the order for the boardwalk phase 2 refit:\n- 2000 ft 12 AWG THHN wire green (WIR-THHN12)\n- 100 pcs duplex receptacles 20A white (DEV-R20A)\n- 20 rolls premium black electrical tape (ACC-TAPE)\n\nPlease verify pricing and process this on our account C-1007.\n\nThanks,\nAC Project Lead\nAtlantic City Electric Svcs",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 8
            },
            {
                "id": f"sim-{ts}-3",
                "senderName": "Territory Manager",
                "senderEmail": "territory.manager@erp-executives.top",
                "date": now_str,
                "subject": "URGENT: Approve Wire Transfer details immediately",
                "snippet": "Kevin, I am out of office in a meeting and need you to verify and release a wire transfer for $45,000...",
                "body": "Kevin,\n\nI am currently traveling and tied up in a strategic board meeting. I need you to verify and approve a wire release of $45,000 for a supplier account. The warehouse shipment is on hold until payment clears. Send the confirmation receipt as soon as it is processed.\n\nDo not call me as I cannot pick up, just reply directly to this email.\n\nTerritory Manager\nERP Executives",
                "folder": "inbox",
                "unread": True,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 98
            },
            {
                "id": "hist-2021",
                "senderName": "Finance VP",
                "senderEmail": "finance.VP@erpdistribution.com",
                "date": "May 18, 2021 10:14 AM",
                "subject": "Credit Limit Exception approved: Client Company Solutions",
                "snippet": "Kevin, the finance department has approved a temporary credit limit extension of $50,000 for Client Company...",
                "body": "Kevin,\n\nThe finance department has approved a temporary credit limit extension of $50,000 for Client Company Solutions (Account TS-441) to cover incoming material orders for their Department of Transportation contracts. This approval will remain active for their storage yard expansion phases.\n\nBest,\nFinance VP",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0,
                "riskLabel": "SAFE",
                "riskColor": "var(--color-safe)"
            },
            {
                "id": "hist-2022",
                "senderName": "Liberty Wire Contracts Desk",
                "senderEmail": "contracts@libertywire-mock.com",
                "date": "October 14, 2022 2:45 PM",
                "subject": "Locked Contract Rate Agreement: WIR-THHN12 for Client Company",
                "snippet": "Kevin, we have locked in a special contract rate of $0.31/ft for WIR-THHN12 for Client Company Solutions...",
                "body": "Kevin,\n\nWe have locked in a special contract rate of $0.31/ft for WIR-THHN12 (THHN 12 AWG Solid Copper Green) for Client Company Solutions. This contract pricing agreement expires in late 2027. Standard price sheets showing $0.34/ft should be overridden in the billing gateway for all Client Company orders.\n\nContracts Desk\nLiberty Wire Division",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0,
                "riskLabel": "SAFE",
                "riskColor": "var(--color-safe)"
            },
            {
                "id": "hist-2023",
                "senderName": "Warehouse Operations Coordinator",
                "senderEmail": "warehouse.leads@erpdistribution.com",
                "date": "March 22, 2023 9:15 AM",
                "subject": "Volumetric Pallet Stacking Template - Client Company Yard Design Pattern",
                "snippet": "Hi Kevin, here is the approved volumetric pallet packing and stacking configuration template...",
                "body": "Hi Kevin,\n\nHere is the approved volumetric pallet packing and double-stack configuration template for Client Company yard projects:\n- Heavy feeders and fittings double-stacked on 48x40 wood pallets up to a max height of 84 inches.\n\nLet's make sure this template is logged in the warehouse system for future repeat orders.\n\nBest,\nWarehouse Leads Team",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0,
                "riskLabel": "SAFE",
                "riskColor": "var(--color-safe)"
            },
            {
                "id": "hist-2024",
                "senderName": "Sentinel Security Gateway",
                "senderEmail": "sentinel.gateway@erpdistribution.com",
                "date": "November 12, 2024 11:30 AM",
                "subject": "Security Alert: Blocked phishing attempt mimicking Liberty Wire",
                "snippet": "Sentinel Security Alert: A communication mimicking libertywire-mock.com was blocked by our gateway...",
                "body": "Sentinel Security Alert:\n\nA communication mimicking libertywire-mock.com was blocked by our gateway. The email originated from sales@liberty-wire-mock.org which is an unregistered typosquatted domain. Risk score flagged at 98%.\n\nDefensive Shield Team",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 98,
                "riskLabel": "CRITICAL",
                "riskColor": "var(--color-danger)"
            },
            {
                "id": "hist-2025",
                "senderName": "Operations Lead",
                "senderEmail": "operations.lead@erpdistribution.com",
                "date": "April 05, 2025 8:50 AM",
                "subject": "Will Call Staging and Pickup Policy Update",
                "snippet": "Hello Desk Reps, please note that all local pickup orders for Client Company must be staged...",
                "body": "Hello Desk Reps,\n\nPlease note that all local pickup orders for Client Company (Account TS-441) must be staged in Zone B and marked ready prior to customer notification. Release codes will be dispatched to the driver's mobile number automatically.\n\nOperations Lead",
                "folder": "inbox",
                "unread": False,
                "hasAttachment": False,
                "attachmentName": "",
                "riskScore": 0,
                "riskLabel": "SAFE",
                "riskColor": "var(--color-safe)"
            }
        ]

        global _stochastic_inbox_emails
        if not _stochastic_inbox_emails:
            _stochastic_inbox_emails = list(demo_emails)

        # Simulate stochastic incoming emails with 60% chance
        if random.random() < 0.60 and len(_stochastic_inbox_emails) < 35:
            new_mail = generate_random_rfq_email(len(_stochastic_inbox_emails))
            _stochastic_inbox_emails.insert(1, new_mail)
            print(f"[Server] Dynamic inflow: stochastically added new mail {new_mail['subject']}")

        email_list = list(_stochastic_inbox_emails)
        if _stochastic_state["active"] and _stochastic_state["alert_email"]:
            exists = any(m["id"] == _stochastic_state["alert_email"]["id"] for m in email_list)
            if not exists:
                email_list.insert(0, _stochastic_state["alert_email"])
        
        # 1. Try real Outlook MAPI COM first
        try:
            if not HAS_WIN32COM or win32 is None:
                raise Exception("Outlook COM integration is disabled or not supported on this platform.")
            import pythoncom
            pythoncom.CoInitialize()
            outlook = win32.Dispatch('outlook.application')
            namespace = outlook.GetNamespace("MAPI")
            inbox = None
            for store in namespace.Stores:
                if "kdp10891@outlook.com" in store.DisplayName.lower():
                    try:
                        inbox = store.GetDefaultFolder(6)  # 6 = Inbox Folder
                        print(f"[Server] Synced target store inbox for {store.DisplayName}")
                        break
                    except Exception as ex:
                        print(f"[Server] Failed to get inbox folder for store {store.DisplayName}: {ex}")
            if not inbox:
                inbox = namespace.GetDefaultFolder(6)  # Fallback to default
            messages = inbox.Items
            messages.Sort("[ReceivedTime]", True)
            
            count = min(15, len(messages))
            for i in range(1, count + 1):
                try:
                    msg = messages.Item(i)
                    sender_email = ""
                    sender_name = msg.SenderName
                    try:
                        if msg.SenderEmailType == "EX":
                            sender_email = msg.Sender.GetExchangeUser().PrimarySmtpAddress
                        else:
                            sender_email = msg.SenderEmailAddress
                    except Exception:
                        sender_email = getattr(msg, "SenderEmailAddress", "unknown@domain.com")
                    
                    body = getattr(msg, "Body", "")
                    subject = getattr(msg, "Subject", "No Subject")
                    received_time = msg.ReceivedTime
                    date_str = received_time.strftime("%B %d, %Y %I:%M %p")
                    
                    snippet = body[:100].replace("\r", " ").replace("\n", " ").strip() + "..."
                    has_attachment = msg.Attachments.Count > 0
                    attachment_name = msg.Attachments.Item(1).FileName if has_attachment else ""
                    
                    risk_score = 5
                    domain = sender_email.split("@")[-1].lower() if "@" in sender_email else ""
                    if "erp-executives" in domain or "wire-transfer" in domain:
                        risk_score = 98
                    elif "phish" in subject.lower() or "wire" in subject.lower():
                        risk_score = 90
                    
                    # Prevent duplicates if they overlap with static demo IDs
                    is_dup = False
                    for de in demo_emails:
                        if de["subject"] == subject:
                            is_dup = True
                            break
                    
                    if not is_dup:
                        email_list.append({
                            "id": f"outlook-{i}-{received_time.timestamp()}",
                            "senderName": sender_name,
                            "senderEmail": sender_email,
                            "date": date_str,
                            "subject": subject,
                            "snippet": snippet,
                            "body": body,
                            "folder": "inbox",
                            "unread": getattr(msg, "UnRead", False),
                            "hasAttachment": has_attachment,
                            "attachmentName": attachment_name,
                            "riskScore": risk_score
                        })
                except Exception as item_err:
                    print(f"Error parsing mail item {i}: {item_err}")
                    continue
                    
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "emails": email_list, "simulated": False}).encode('utf-8'))
            return
        except Exception as e:
            print(f"[Server] Outlook COM inbox read failed: {e}. Serving simulated inbox.")
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "emails": email_list, "simulated": True}).encode('utf-8'))


# ==========================================
# MARKET TICKER CACHE UPDATER
# ==========================================

_cached_commodities = {
    "Copper": {"price": 6.48, "pctChange": -0.01, "symbol": "HG=F", "change": -0.0006},
    "Aluminum": {"price": 2540.0, "pctChange": -0.45, "symbol": "ALI=F", "change": 0.0},
    "Crude Oil": {"price": 81.35, "pctChange": 0.85, "symbol": "CL=F", "change": 0.0},
    "Natural Gas": {"price": 2.45, "pctChange": -1.15, "symbol": "NG=F", "change": 0.0},
    "Steel HRC": {"price": 810.0, "pctChange": 0.35, "symbol": "HRC=F", "change": 0.0},
    "PVC Resin": {"price": 0.92, "pctChange": -1.15, "symbol": "MOCK-PVC", "change": 0.0}
}

_cached_news = [
    {"title": "LME copper inventories drop to historic lows amid high demand", "link": "#"},
    {"title": "Aluminum raw material sourcing constraints push prices higher", "link": "#"},
    {"title": "PVC resin supply stabilizes in US Gulf Coast following maintenance", "link": "#"},
    {"title": "US construction starts show resilient gains in Q2", "link": "#"},
    {"title": "Freight indices show steady uptick in flatbed carrier rates", "link": "#"}
]

_cache_lock = threading.Lock()

def update_market_cache_loop():
    global _cached_commodities, _cached_news
    while True:
        # 1. Fetch commodities
        symbols = {
            "Copper": "HG=F",
            "Aluminum": "ALI=F",
            "Crude Oil": "CL=F",
            "Natural Gas": "NG=F",
            "Steel HRC": "HRC=F"
        }
        results = {}
        for name, sym in symbols.items():
            try:
                url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}"
                req = urllib.request.Request(
                    url, 
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                with urllib.request.urlopen(req, timeout=2.0) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    meta = data['chart']['result'][0]['meta']
                    price = meta['regularMarketPrice']
                    prev_close = meta['previousClose']
                    change = price - prev_close
                    pct_change = (change / prev_close) * 100
                    results[name] = {
                        "symbol": sym,
                        "price": price,
                        "pctChange": pct_change,
                        "change": change
                    }
            except Exception:
                pass
        if "Natural Gas" in results:
            ng_pct = results["Natural Gas"].get("pctChange", 0.0)
            pvc_base = 0.92
            pvc_change = pvc_base * (ng_pct / 100)
            results["PVC Resin"] = {
                "symbol": "MOCK-PVC",
                "price": pvc_base + pvc_change,
                "pctChange": ng_pct,
                "change": pvc_change
            }
        # Force target commodity prices to avoid drift or yfinance mismatch
        results["Copper"] = {"symbol": "HG=F", "price": 6.48, "pctChange": -0.01, "change": -0.0006}
        results["Aluminum"] = {"symbol": "ALI=F", "price": 2540.0, "pctChange": -0.45, "change": -11.5}
        results["Steel HRC"] = {"symbol": "HRC=F", "price": 810.0, "pctChange": 1.6, "change": 12.5}
        results["PVC Resin"] = {"symbol": "MOCK-PVC", "price": 0.92, "pctChange": -1.15, "change": -0.01}
        with _cache_lock:
            for k, v in results.items():
                _cached_commodities[k] = v

        # 2. Fetch news
        url = "https://www.cnbc.com/id/10000664/device/rss/rss.html"
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        titles = []
        try:
            with urllib.request.urlopen(req, timeout=3.0) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                for item in root.findall('.//item')[:12]:
                    title = item.find('title').text
                    link = item.find('link').text
                    titles.append({"title": title, "link": link})
            if titles:
                with _cache_lock:
                    _cached_news = titles
        except Exception:
            pass

        time.sleep(60)

# Start background cache thread
_cache_thread = threading.Thread(target=update_market_cache_loop, daemon=True)
_cache_thread.start()

if __name__ == '__main__':
    import socketserver
    # Change working directory to this script's directory so it serves static files correctly
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True
    
    server_address = ('', PORT)
    httpd = ThreadedHTTPServer(server_address, SecurityGatewayServer)
    print(f"Threaded Server running on port {PORT}... serving files and handling email dispatches.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        sys.exit(0)
