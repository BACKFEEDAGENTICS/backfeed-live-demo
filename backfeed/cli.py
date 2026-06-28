import sys
import argparse
import threading
import time
import webbrowser
import os
from backfeed.core.license import verify_license_or_prompt, LICENSE_FILE_PATH
from backfeed.core.config import load_config, run_setup_wizard
from backfeed.server import start_server

def open_browser(url, delay=1.5):
    time.sleep(delay)
    print(f"[CLI] Opening web browser to: {url}")
    webbrowser.open(url)

def main():
    # Check if a license file already exists before we verify/prompt
    license_existed = os.path.exists(LICENSE_FILE_PATH)
    
    # Enforce license check before doing anything
    if not verify_license_or_prompt():
        print("[CLI Error] License validation failed. Exiting.")
        sys.exit(1)
        
    config = load_config()
    
    parser = argparse.ArgumentParser(description="Backfeed Sales & Operations Assistant CLI")
    parser.add_argument("--port", type=int, default=config.get("port", 8085), help="Port to run the HTTP server on")
    parser.add_argument("--host", type=str, default=config.get("host", "localhost"), help="Host to bind the server to")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open the web browser")
    parser.add_argument("--no-gui", action="store_true", help="Run in headless terminal mode without desktop GUI")
    parser.add_argument("--setup", action="store_true", help="Run the interactive environment setup wizard")
    
    args = parser.parse_args()
    
    # Run the setup wizard if requested manually
    if args.setup:
        run_setup_wizard()
        sys.exit(0)
        
    # Run the setup wizard automatically if this is the very first activation
    if not license_existed and os.path.exists(LICENSE_FILE_PATH):
        from backfeed.core.config import is_running_in_docker
        if is_running_in_docker() or "BACKFEED_LICENSE_KEY" in os.environ:
            print("\n[✔] First-time activation detected in headless/Docker environment. Skipping interactive setup wizard.")
        else:
            print("\n[✔] First-time activation detected!")
            run_setup_wizard()
            # Reload configuration in case it changed during setup
            config = load_config()
            
    # Try launching Desktop GUI by default if not explicitly run in terminal-only mode
    from backfeed.core.config import is_running_in_docker
    if not args.no_gui and not is_running_in_docker():
        try:
            print("[CLI] Starting Backfeed Operations Center GUI...")
            from backfeed.gui import start_gui
            start_gui()
            sys.exit(0)
        except Exception as e:
            print(f"[CLI Warning] Desktop GUI startup failed: {e}. Falling back to console mode.")
    
    # Auto launch web portal (Console fallback mode)
    url = f"http://{args.host}:{args.port}"
    if not args.no_browser:
        threading.Thread(target=open_browser, args=(url,), daemon=True).start()
        
    start_server(port=args.port, host=args.host)

if __name__ == "__main__":
    main()
