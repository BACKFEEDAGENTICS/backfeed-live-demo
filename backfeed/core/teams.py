import urllib.request
import json
from backfeed.core.config import load_config

def send_teams_notification(title, text, color="0078D4") -> bool:
    """Sends a headless MessageCard notification to Microsoft Teams via Incoming Webhook URL.
    
    If the webhook is not configured in config.json, it skips sending.
    """
    config = load_config()
    url = config.get("teams_webhook_url", "")
    if not url:
        return False
        
    try:
        payload = {
            "@type": "MessageCard",
            "@context": "http://schema.org/extensions/messagecard.json",
            "themeColor": color,
            "title": title,
            "text": text
        }
        
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        # Execute headless POST request
        with urllib.request.urlopen(req, timeout=5) as response:
            pass
        print(f"[Teams Notification] Sent successfully: {title}")
        return True
    except Exception as e:
        print(f"[Teams Notification Error] Failed to dispatch Teams message: {e}")
        return False
