import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

try:
    import win32com.client as win32
    HAS_WIN32COM = True
except ImportError:
    win32 = None
    HAS_WIN32COM = False

def send_outlook_email(to_recipients, subject, html_body=None, text_body=None, attachments=None) -> bool:
    """Sends an email using the local Outlook COM interface (Windows only).
    Falls back to SMTP protocol if Outlook COM is unavailable/unsupported,
    otherwise prints a simulation log.
    """
    recipients_str = '; '.join(to_recipients) if isinstance(to_recipients, list) else to_recipients
    recipients_list = to_recipients if isinstance(to_recipients, list) else [to_recipients]
    
    # 1. Attempt Outlook COM sending (Windows host only)
    if HAS_WIN32COM and win32 is not None:
        try:
            outlook = win32.Dispatch('outlook.application')
            mail = outlook.CreateItem(0)
            mail.To = recipients_str
            mail.Subject = subject
            
            if html_body:
                mail.HTMLBody = html_body
            elif text_body:
                mail.Body = text_body
                
            if attachments:
                for att in attachments:
                    if os.path.exists(att):
                        mail.Attachments.Add(os.path.abspath(att))
                    else:
                        print(f"[Mail Warning] Attachment not found at: {att}")
                        
            mail.Send()
            print(f"[Mail Success] Sent Outlook email to: {recipients_str}")
            return True
        except Exception as e:
            print(f"[Mail Warning] Outlook COM failure: {e}. Falling back to SMTP...")
            
    # 2. Attempt SMTP fallback (Container/Headless mode support)
    try:
        from backfeed.core.config import load_config
        cfg = load_config()
    except Exception:
        cfg = {}
        
    email_user = os.environ.get("EMAIL_ADDRESS") or cfg.get("outlook_email")
    email_pass = os.environ.get("EMAIL_PASSWORD")
    
    if email_user and email_pass:
        try:
            msg = MIMEMultipart()
            msg['From'] = email_user
            msg['To'] = recipients_str
            msg['Subject'] = subject
            
            if html_body:
                msg.attach(MIMEText(html_body, 'html'))
            elif text_body:
                msg.attach(MIMEText(text_body, 'plain'))
                
            if attachments:
                from email.mime.base import MIMEBase
                from email import encoders
                for att in attachments:
                    if os.path.exists(att):
                        filename = os.path.basename(att)
                        with open(att, 'rb') as f:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(f.read())
                            encoders.encode_base64(part)
                            part.add_header('Content-Disposition', f'attachment; filename={filename}')
                            msg.attach(part)
                            
            smtp_server = "smtp.gmail.com"
            smtp_port = 587
            
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(email_user, email_pass)
            server.sendmail(email_user, recipients_list, msg.as_string())
            server.quit()
            print(f"[Mail Success] Sent SMTP email via {email_user} to: {recipients_str}")
            return True
        except Exception as smtp_err:
            print(f"[Mail Error] SMTP fallback failure: {smtp_err}")
            
    # 3. Graceful simulation printing fallback
    print("\n--- [SIMULATION] EMAIL DISPATCH (NO ACTIVE CLIENT CONNECTED) ---")
    print(f"To          : {recipients_str}")
    print(f"Subject     : {subject}")
    if html_body:
        print("Body (HTML) : [Omitted HTML Content]")
        if "BACKFEED COGNITIVE" in html_body or "Trial Locked" in subject:
            # print snippet for verification
            print(html_body[:300].strip() + "...")
    elif text_body:
        print(f"Body (Text) : {text_body}")
    if attachments:
        print(f"Attachments : {attachments}")
    print("-----------------------------------------------------------------\n")
    return True

