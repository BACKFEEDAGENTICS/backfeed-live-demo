import os
import json

CONFIG_FILE_PATH = os.path.expanduser("~/.backfeed_config.json")

def is_running_in_docker() -> bool:
    """Returns True if running inside a Docker container."""
    if os.path.exists('/.dockerenv'):
        return True
    try:
        with open('/proc/1/cgroup', 'rt', encoding='utf-8') as f:
            content = f.read()
            if 'docker' in content or 'containerd' in content or 'kubepods' in content:
                return True
    except Exception:
        pass
    return False

if is_running_in_docker() or os.name != 'nt':
    DEFAULT_CONFIG = {
        "outlook_email": "kevin.pollock@backfeedagentics.com",
        "notification_email": "kdp10891@outlook.com",
        "project_scratch_dir": "/app/scratch",
        "oddball_scratch_dir": "/app/oddball-scratch",
        "port": 8085,
        "host": "0.0.0.0",
        "teams_webhook_url": "",
        "gemini_api_key": ""
    }
else:
    DEFAULT_CONFIG = {
        "outlook_email": "kevin.pollock@backfeedagentics.com",
        "notification_email": "kdp10891@outlook.com",
        "project_scratch_dir": r"c:\Users\kDP10\OneDrive\Project_Default_2026-03-10_091750\scratch",
        "oddball_scratch_dir": r"c:\Users\kDP10\OneDrive\oddball-electrical-sourcing\scratch",
        "port": 8085,
        "host": "localhost",
        "teams_webhook_url": "",
        "gemini_api_key": ""
    }



def load_config():
    """Loads the user-specific Backfeed configuration. Creates a default one if missing."""
    if not os.path.exists(CONFIG_FILE_PATH):
        try:
            os.makedirs(os.path.dirname(CONFIG_FILE_PATH), exist_ok=True)
            with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(DEFAULT_CONFIG, f, indent=4)
            print(f"[Config] Created default user config at: {CONFIG_FILE_PATH}")
            return DEFAULT_CONFIG
        except Exception as e:
            print(f"[Config Warning] Failed to write default config: {e}")
            return DEFAULT_CONFIG
            
    try:
        with open(CONFIG_FILE_PATH, 'r', encoding='utf-8') as f:
            user_config = json.load(f)
        # Merge with defaults to ensure all keys exist
        config = dict(DEFAULT_CONFIG)
        config.update(user_config)
        return config
    except Exception as e:
        print(f"[Config Error] Failed to read config from {CONFIG_FILE_PATH}: {e}. Using defaults.")
        return DEFAULT_CONFIG

def run_setup_wizard():
    """Runs an interactive console setup wizard to configure the user environment."""
    print("\n" + "=" * 60)
    print("             BACKFEED INITIAL ENVIRONMENT SETUP")
    print("=" * 60)
    print("Please configure your local environment settings to link the assistant.")
    print("-" * 60)
    
    config = load_config()
    
    try:
        # 1. Prompt for target email
        email = input(f"Target Outlook Email [{config.get('outlook_email')}]: ").strip()
        if email:
            config['outlook_email'] = email
            
        # 2. Prompt for project scratch directory
        proj_dir = input(f"Project Scratch Directory [{config.get('project_scratch_dir')}]: ").strip()
        if proj_dir:
            config['project_scratch_dir'] = proj_dir
            
        # 3. Prompt for oddball scratch directory
        odd_dir = input(f"Oddball Scratch Directory [{config.get('oddball_scratch_dir')}]: ").strip()
        if odd_dir:
            config['oddball_scratch_dir'] = odd_dir
            
        # 4. Prompt for Teams Webhook URL
        teams_url = input(f"Teams Webhook URL [{config.get('teams_webhook_url')}]: ").strip()
        if teams_url:
            config['teams_webhook_url'] = teams_url
            
        # 5. Prompt for Gemini API Key
        gkey = input(f"Gemini API Key [{config.get('gemini_api_key')}]: ").strip()
        if gkey:
            config['gemini_api_key'] = gkey
            
        # Save config
        os.makedirs(os.path.dirname(CONFIG_FILE_PATH), exist_ok=True)
        with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=4)
        print("\n[SUCCESS] Configuration saved to:", CONFIG_FILE_PATH)
        print("=" * 60 + "\n")
    except KeyboardInterrupt:
        print("\n\n[ERROR] Setup wizard cancelled by user. Using defaults.")
