import sys
import os
import json
import uuid
import time
import subprocess
import threading
import queue
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import webbrowser

# Load config tools
from backfeed.core.config import load_config, CONFIG_FILE_PATH
from backfeed.core.license import verify_license_or_prompt, LICENSE_FILE_PATH

# Visual Styling Palette
BG_COLOR = "#0f172a"          # Sleek Slate-900 Dark Background
CARD_BG = "#1e293b"           # Slate-800 Card Container Background
ACCENT_GREEN = "#10b981"      # Emerald green accent
ACCENT_RED = "#ef4444"        # Crimson alert accent
TEXT_COLOR = "#f8fafc"        # Ghost white text
TEXT_MUTED = "#94a3b8"        # Muted gray text
NAV_BG = "#0b0f19"            # Deeper navigation panel color
BORDER_COLOR = "#334155"      # Border color for separation

class BackfeedGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Backfeed Operations Center")
        self.root.geometry("980x680")
        self.root.configure(bg=BG_COLOR)
        
        # Windows-specific custom styling overrides if possible
        try:
            self.root.iconbitmap(default=None)
        except Exception:
            pass
            
        self.current_tab = "dashboard"
        
        # Subprocess tracking
        self.server_process = None
        self.listener_process = None
        self.log_queue = queue.Queue()
        
        # Load environment configuration
        self.config = load_config()
        
        # Setup UI layout
        self.setup_nav_rail()
        self.setup_main_area()
        self.setup_status_bar()
        
        # Start queue reader thread for log redirection
        self.alive = True
        threading.Thread(target=self.queue_reader_loop, daemon=True).start()
        
        # Check running instances on load
        self.root.after(500, self.auto_detect_running)
        
        # Handle graceful window shutdown
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

    def setup_nav_rail(self):
        """Creates the premium left-side navigation rail."""
        self.nav_frame = tk.Frame(self.root, bg=NAV_BG, width=220)
        self.nav_frame.pack(side="left", fill="y")
        self.nav_frame.pack_propagate(False)
        
        # Logo and branding header
        logo_label = tk.Label(
            self.nav_frame, 
            text="BACKFEED", 
            font=("Segoe UI", 18, "bold"), 
            bg=NAV_BG, 
            fg=ACCENT_GREEN
        )
        logo_label.pack(pady=(25, 2))
        
        sub_label = tk.Label(
            self.nav_frame, 
            text="Operations Center", 
            font=("Segoe UI", 9), 
            bg=NAV_BG, 
            fg=TEXT_MUTED
        )
        sub_label.pack(pady=(0, 30))
        
        # Nav buttons list
        self.nav_buttons = {}
        tabs = [
            ("dashboard", "Dashboard"),
            ("config", "Environment Setup"),
            ("licensing", "Licensing & Host")
        ]
        
        for tab_id, label in tabs:
            btn = tk.Button(
                self.nav_frame,
                text=f"   {label}",
                font=("Segoe UI", 11, "medium" if tab_id == self.current_tab else "normal"),
                bg=NAV_BG,
                fg=TEXT_COLOR if tab_id == self.current_tab else TEXT_MUTED,
                activebackground=CARD_BG,
                activeforeground=TEXT_COLOR,
                bd=0,
                anchor="w",
                padx=15,
                pady=12,
                cursor="hand2",
                command=lambda tid=tab_id: self.switch_tab(tid)
            )
            btn.pack(fill="x", padx=10, pady=2)
            self.nav_buttons[tab_id] = btn
            
            # Bind hover animations
            btn.bind("<Enter>", lambda e, b=btn: b.config(bg=CARD_BG) if b['fg'] != TEXT_COLOR else None)
            btn.bind("<Leave>", lambda e, b=btn, tid=tab_id: b.config(bg=NAV_BG) if tid != self.current_tab else None)
            
        # Draw active indicator bar
        self.update_nav_styles()

    def update_nav_styles(self):
        """Highlights the active tab in the left rail."""
        for tab_id, btn in self.nav_buttons.items():
            if tab_id == self.current_tab:
                btn.config(fg=TEXT_COLOR, font=("Segoe UI", 11, "bold"), bg=CARD_BG)
            else:
                btn.config(fg=TEXT_MUTED, font=("Segoe UI", 11), bg=NAV_BG)

    def switch_tab(self, tab_id):
        self.current_tab = tab_id
        self.update_nav_styles()
        
        # Hide all view panels
        self.dashboard_panel.pack_forget()
        self.config_panel.pack_forget()
        self.licensing_panel.pack_forget()
        
        # Show selected
        if tab_id == "dashboard":
            self.dashboard_panel.pack(fill="both", expand=True, padx=25, pady=20)
        elif tab_id == "config":
            self.config_panel.pack(fill="both", expand=True, padx=25, pady=20)
            self.load_config_fields()
        elif tab_id == "licensing":
            self.licensing_panel.pack(fill="both", expand=True, padx=25, pady=20)
            self.load_licensing_fields()

    def setup_main_area(self):
        """Creates container panels for all tabs."""
        self.main_container = tk.Frame(self.root, bg=BG_COLOR)
        self.main_container.pack(side="right", fill="both", expand=True)
        
        self.create_dashboard_tab()
        self.create_config_tab()
        self.create_licensing_tab()
        
        # Show default dashboard tab
        self.dashboard_panel.pack(fill="both", expand=True, padx=25, pady=20)

    def create_dashboard_tab(self):
        self.dashboard_panel = tk.Frame(self.main_container, bg=BG_COLOR)
        
        # Header Area
        header_frame = tk.Frame(self.dashboard_panel, bg=BG_COLOR)
        header_frame.pack(fill="x", pady=(0, 20))
        
        lbl = tk.Label(header_frame, text="Service Status Control", font=("Segoe UI", 20, "bold"), bg=BG_COLOR, fg=TEXT_COLOR)
        lbl.pack(side="left")
        
        # Grid layout for Service Cards
        cards_frame = tk.Frame(self.dashboard_panel, bg=BG_COLOR)
        cards_frame.pack(fill="x", pady=(0, 20))
        
        # Card 1: Web Portal Server
        self.card_server = tk.Frame(cards_frame, bg=CARD_BG, bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.card_server.pack(side="left", fill="both", expand=True, padx=(0, 10), ipady=10)
        
        c1_title = tk.Label(self.card_server, text="Web Portal Server", font=("Segoe UI", 12, "bold"), bg=CARD_BG, fg=TEXT_COLOR)
        c1_title.pack(anchor="w", padx=15, pady=(15, 2))
        
        c1_desc = tk.Label(self.card_server, text="Serves HTML application and API hooks on port 8085", font=("Segoe UI", 9), bg=CARD_BG, fg=TEXT_MUTED)
        c1_desc.pack(anchor="w", padx=15, pady=(0, 15))
        
        # Status row
        c1_status_frame = tk.Frame(self.card_server, bg=CARD_BG)
        c1_status_frame.pack(fill="x", padx=15, pady=(0, 15))
        
        self.server_indicator = tk.Canvas(c1_status_frame, width=12, height=12, bg=CARD_BG, highlightthickness=0)
        self.server_indicator.pack(side="left")
        self.draw_status_dot(self.server_indicator, "gray")
        
        self.server_status_lbl = tk.Label(c1_status_frame, text="Offline", font=("Segoe UI", 10), bg=CARD_BG, fg=TEXT_MUTED)
        self.server_status_lbl.pack(side="left", padx=8)
        
        # Control Buttons
        c1_btn_frame = tk.Frame(self.card_server, bg=CARD_BG)
        c1_btn_frame.pack(fill="x", padx=15, pady=5)
        
        self.btn_server_start = tk.Button(c1_btn_frame, text="Start", bg=ACCENT_GREEN, fg="#ffffff", font=("Segoe UI", 9, "bold"), bd=0, padx=12, pady=6, cursor="hand2", command=self.start_server_service)
        self.btn_server_start.pack(side="left", padx=(0, 5))
        
        self.btn_server_stop = tk.Button(c1_btn_frame, text="Stop", bg=ACCENT_RED, fg="#ffffff", font=("Segoe UI", 9, "bold"), bd=0, padx=12, pady=6, cursor="hand2", state="disabled", command=self.stop_server_service)
        self.btn_server_stop.pack(side="left", padx=(0, 5))
        
        self.btn_server_open = tk.Button(c1_btn_frame, text="Open Portal", bg="#334155", fg="#ffffff", font=("Segoe UI", 9), bd=0, padx=12, pady=6, cursor="hand2", command=self.open_portal)
        self.btn_server_open.pack(side="left")

        # Card 2: Background Sourcing Agent
        self.card_agent = tk.Frame(cards_frame, bg=CARD_BG, bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.card_agent.pack(side="right", fill="both", expand=True, padx=(10, 0), ipady=10)
        
        c2_title = tk.Label(self.card_agent, text="Background Email Listener", font=("Segoe UI", 12, "bold"), bg=CARD_BG, fg=TEXT_COLOR)
        c2_title.pack(anchor="w", padx=15, pady=(15, 2))
        
        c2_desc = tk.Label(self.card_agent, text="Monitors Outlook folders, processes RFQs and checks status", font=("Segoe UI", 9), bg=CARD_BG, fg=TEXT_MUTED)
        c2_desc.pack(anchor="w", padx=15, pady=(0, 15))
        
        # Status row
        c2_status_frame = tk.Frame(self.card_agent, bg=CARD_BG)
        c2_status_frame.pack(fill="x", padx=15, pady=(0, 15))
        
        self.agent_indicator = tk.Canvas(c2_status_frame, width=12, height=12, bg=CARD_BG, highlightthickness=0)
        self.agent_indicator.pack(side="left")
        self.draw_status_dot(self.agent_indicator, "gray")
        
        self.agent_status_lbl = tk.Label(c2_status_frame, text="Offline", font=("Segoe UI", 10), bg=CARD_BG, fg=TEXT_MUTED)
        self.agent_status_lbl.pack(side="left", padx=8)
        
        # Control Buttons
        c2_btn_frame = tk.Frame(self.card_agent, bg=CARD_BG)
        c2_btn_frame.pack(fill="x", padx=15, pady=5)
        
        self.btn_agent_start = tk.Button(c2_btn_frame, text="Start", bg=ACCENT_GREEN, fg="#ffffff", font=("Segoe UI", 9, "bold"), bd=0, padx=12, pady=6, cursor="hand2", command=self.start_agent_service)
        self.btn_agent_start.pack(side="left", padx=(0, 5))
        
        self.btn_agent_stop = tk.Button(c2_btn_frame, text="Stop", bg=ACCENT_RED, fg="#ffffff", font=("Segoe UI", 9, "bold"), bd=0, padx=12, pady=6, cursor="hand2", state="disabled", command=self.stop_agent_service)
        self.btn_agent_stop.pack(side="left")

        # Logging Console Header
        console_lbl = tk.Label(self.dashboard_panel, text="Real-Time Sourcing Log Terminal", font=("Segoe UI", 12, "bold"), bg=BG_COLOR, fg=TEXT_COLOR)
        console_lbl.pack(anchor="w", pady=(15, 5))
        
        # Logging Console Textbox
        self.console = scrolledtext.ScrolledText(
            self.dashboard_panel,
            bg=NAV_BG,
            fg="#e2e8f0",
            insertbackground="#ffffff",
            font=("Consolas", 10),
            bd=1,
            relief="flat",
            highlightbackground=BORDER_COLOR,
            highlightthickness=1
        )
        self.console.pack(fill="both", expand=True)
        
        # Apply tagging for styling logs
        self.console.tag_config("info", fg="#38bdf8")
        self.console.tag_config("success", fg="#4ade80")
        self.console.tag_config("error", fg="#f87171")
        self.console.tag_config("system", fg="#a78bfa")
        
        self.log_info("Operations Center loaded. Ready to monitor services.")

    def create_config_tab(self):
        self.config_panel = tk.Frame(self.main_container, bg=BG_COLOR)
        
        title = tk.Label(self.config_panel, text="Environment Configuration Wizard", font=("Segoe UI", 20, "bold"), bg=BG_COLOR, fg=TEXT_COLOR)
        title.pack(anchor="w", pady=(0, 10))
        
        desc = tk.Label(self.config_panel, text="Configure target email addresses, webhook URLs, and project scratch paths below.", font=("Segoe UI", 10), bg=BG_COLOR, fg=TEXT_MUTED)
        desc.pack(anchor="w", pady=(0, 20))
        
        # Form Container Card
        form_card = tk.Frame(self.config_panel, bg=CARD_BG, bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        form_card.pack(fill="both", expand=True, ipady=15)
        
        # Fields mapping helper
        self.config_fields = {}
        fields = [
            ("outlook_email", "Target Outlook Email", "Primary inbox monitored for RFQs and commands"),
            ("notification_email", "Notification Target Email", "Primary inbox for briefs, alerts, and commodity pricing triggers"),
            ("project_scratch_dir", "Project Scratch Directory", "Absolute path for internal reports and file creations"),
            ("oddball_scratch_dir", "Oddball Scratch Directory", "Absolute path for parts and sourcing calculation matrices"),
            ("teams_webhook_url", "Microsoft Teams Webhook URL", "Webhook destination for headless channels (silently skipped if blank)"),
            ("gemini_api_key", "Gemini API Key", "API key for interpreting incoming email inquiries intelligently")
        ]
        
        for i, (key, label, desc_text) in enumerate(fields):
            row_frame = tk.Frame(form_card, bg=CARD_BG)
            row_frame.pack(fill="x", padx=25, pady=10)
            
            lbl_col = tk.Frame(row_frame, bg=CARD_BG, width=220)
            lbl_col.pack(side="left", fill="y")
            lbl_col.pack_propagate(False)
            
            lbl = tk.Label(lbl_col, text=label, font=("Segoe UI", 10, "bold"), bg=CARD_BG, fg=TEXT_COLOR)
            lbl.pack(anchor="w")
            
            desc_lbl = tk.Label(lbl_col, text=desc_text, font=("Segoe UI", 8), bg=CARD_BG, fg=TEXT_MUTED, wraplength=200, justify="left")
            desc_lbl.pack(anchor="w", pady=(2, 0))
            
            show_char = "*" if key == "gemini_api_key" else None
            entry = tk.Entry(row_frame, font=("Segoe UI", 10), bg=BG_COLOR, fg=TEXT_COLOR, insertbackground="#ffffff", bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1, show=show_char)
            entry.pack(side="right", fill="x", expand=True, padx=(20, 0), ipady=5)
            self.config_fields[key] = entry
            
        # Save Button Frame
        save_frame = tk.Frame(self.config_panel, bg=BG_COLOR)
        save_frame.pack(fill="x", pady=20)
        
        self.btn_save_config = tk.Button(
            save_frame,
            text="Save Configurations",
            bg=ACCENT_GREEN,
            fg="#ffffff",
            font=("Segoe UI", 11, "bold"),
            bd=0,
            padx=25,
            pady=8,
            cursor="hand2",
            command=self.save_config_data
        )
        self.btn_save_config.pack(side="right")

    def create_licensing_tab(self):
        self.licensing_panel = tk.Frame(self.main_container, bg=BG_COLOR)
        
        title = tk.Label(self.licensing_panel, text="Hardware Licensing Gate", font=("Segoe UI", 20, "bold"), bg=BG_COLOR, fg=TEXT_COLOR)
        title.pack(anchor="w", pady=(0, 10))
        
        desc = tk.Label(self.licensing_panel, text="Backfeed implements a node-locked licensing model verifying the local host's signature.", font=("Segoe UI", 10), bg=BG_COLOR, fg=TEXT_MUTED)
        desc.pack(anchor="w", pady=(0, 20))
        
        # Details layout
        info_card = tk.Frame(self.licensing_panel, bg=CARD_BG, bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        info_card.pack(fill="x", pady=(0, 20), ipady=15)
        
        # MAC display
        self.mac_frame = tk.Frame(info_card, bg=CARD_BG)
        self.mac_frame.pack(fill="x", padx=25, pady=8)
        tk.Label(self.mac_frame, text="Local MAC Signature:", font=("Segoe UI", 10, "bold"), bg=CARD_BG, fg=TEXT_COLOR).pack(side="left")
        self.mac_val = tk.Label(self.mac_frame, text="Querying...", font=("Consolas", 11), bg=CARD_BG, fg=ACCENT_GREEN)
        self.mac_val.pack(side="left", padx=10)
        
        # License File
        self.lic_file_frame = tk.Frame(info_card, bg=CARD_BG)
        self.lic_file_frame.pack(fill="x", padx=25, pady=8)
        tk.Label(self.lic_file_frame, text="License Registry Path:", font=("Segoe UI", 10, "bold"), bg=CARD_BG, fg=TEXT_COLOR).pack(side="left")
        tk.Label(self.lic_file_frame, text=LICENSE_FILE_PATH, font=("Consolas", 10), bg=CARD_BG, fg=TEXT_MUTED).pack(side="left", padx=10)
        
        # Status Label
        self.lic_status_frame = tk.Frame(info_card, bg=CARD_BG)
        self.lic_status_frame.pack(fill="x", padx=25, pady=8)
        tk.Label(self.lic_status_frame, text="Validation Status:", font=("Segoe UI", 10, "bold"), bg=CARD_BG, fg=TEXT_COLOR).pack(side="left")
        self.lic_status_val = tk.Label(self.lic_status_frame, text="Unverified", font=("Segoe UI", 10, "bold"), bg=CARD_BG, fg=TEXT_MUTED)
        self.lic_status_val.pack(side="left", padx=10)
        
        # Active Serial Panel
        activate_card = tk.Frame(self.licensing_panel, bg=CARD_BG, bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        activate_card.pack(fill="x", ipady=15)
        
        tk.Label(activate_card, text="Product Activation Serial", font=("Segoe UI", 12, "bold"), bg=CARD_BG, fg=TEXT_COLOR).pack(anchor="w", padx=25, pady=(15, 5))
        tk.Label(activate_card, text="Submit product key serial directly to register this machine node.", font=("Segoe UI", 9), bg=CARD_BG, fg=TEXT_MUTED).pack(anchor="w", padx=25, pady=(0, 15))
        
        act_row = tk.Frame(activate_card, bg=CARD_BG)
        act_row.pack(fill="x", padx=25, pady=5)
        
        self.entry_serial = tk.Entry(act_row, font=("Consolas", 11), bg=BG_COLOR, fg=TEXT_COLOR, insertbackground="#ffffff", bd=1, relief="flat", highlightbackground=BORDER_COLOR, highlightthickness=1)
        self.entry_serial.pack(side="left", fill="x", expand=True, ipady=6)
        
        self.btn_activate = tk.Button(
            act_row,
            text="Activate Node",
            bg=ACCENT_GREEN,
            fg="#ffffff",
            font=("Segoe UI", 10, "bold"),
            bd=0,
            padx=20,
            pady=7,
            cursor="hand2",
            command=self.activate_license_node
        )
        self.btn_activate.pack(side="right", padx=(15, 0))

    def setup_status_bar(self):
        self.status_bar = tk.Frame(self.root, bg=NAV_BG, height=25, bd=1, relief="flat")
        self.status_bar.pack(side="bottom", fill="x")
        
        self.status_text = tk.Label(self.status_bar, text="System Ready", font=("Segoe UI", 9), bg=NAV_BG, fg=TEXT_MUTED)
        self.status_text.pack(side="left", padx=10)
        
        hostname = os.environ.get("COMPUTERNAME", "LocalHost")
        self.host_lbl = tk.Label(self.status_bar, text=f"Node: {hostname}", font=("Segoe UI", 9), bg=NAV_BG, fg=TEXT_MUTED)
        self.host_lbl.pack(side="right", padx=10)

    def draw_status_dot(self, canvas, color):
        canvas.delete("all")
        rgb = ACCENT_GREEN if color == "green" else (ACCENT_RED if color == "red" else "#64748b")
        canvas.create_oval(2, 2, 10, 10, fill=rgb, outline="")

    # Log writer utilities
    def log_info(self, msg):
        self.log_queue.put(("[INFO] " + msg, "info"))
        
    def log_success(self, msg):
        self.log_queue.put(("[SUCCESS] " + msg, "success"))
        
    def log_error(self, msg):
        self.log_queue.put(("[ERROR] " + msg, "error"))
        
    def log_sys(self, msg):
        self.log_queue.put(("[SYSTEM] " + msg, "system"))

    def queue_reader_loop(self):
        """Asynchronously dequeues status logs to insert into the terminal viewport without blocking UI threads."""
        while self.alive:
            try:
                msg, tag = self.log_queue.get(timeout=0.1)
                self.console.configure(state="normal")
                self.console.insert(tk.END, f"{msg}\n", tag)
                self.console.see(tk.END)
                self.console.configure(state="disabled")
            except queue.Empty:
                pass

    # Dynamic service checks
    def auto_detect_running(self):
        """Audits ports and processes to detect running backfeed instances."""
        # 1. Audit Server (Port 8085)
        server_running = False
        if os.name == 'nt':
            try:
                res = subprocess.run('netstat -aon | findstr "LISTENING" | findstr ":8085"', shell=True, capture_output=True, text=True)
                if res.stdout.strip():
                    server_running = True
            except Exception:
                pass
        
        if server_running:
            self.draw_status_dot(self.server_indicator, "green")
            self.server_status_lbl.config(text="Online (Port 8085)", fg=ACCENT_GREEN)
            self.btn_server_start.config(state="disabled")
            self.btn_server_stop.config(state="normal")
        else:
            self.draw_status_dot(self.server_indicator, "gray")
            self.server_status_lbl.config(text="Offline", fg=TEXT_MUTED)
            self.btn_server_start.config(state="normal")
            self.btn_server_stop.config(state="disabled")

        # 2. Audit Background Listener Process
        listener_running = False
        if os.name == 'nt':
            try:
                cmd = 'wmic process where "CommandLine like \'%run_work_cycle.py%\'" get ProcessId'
                res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                lines = [line.strip() for line in res.stdout.strip().split('\n') if line.strip().isdigit()]
                if lines:
                    listener_running = True
            except Exception:
                pass
                
        if listener_running:
            self.draw_status_dot(self.agent_indicator, "green")
            self.agent_status_lbl.config(text="Active (Polling Outlook)", fg=ACCENT_GREEN)
            self.btn_agent_start.config(state="disabled")
            self.btn_agent_stop.config(state="normal")
        else:
            self.draw_status_dot(self.agent_indicator, "gray")
            self.agent_status_lbl.config(text="Offline", fg=TEXT_MUTED)
            self.btn_agent_start.config(state="normal")
            self.btn_agent_stop.config(state="disabled")
            
        # Re-check status every 4 seconds
        if self.alive:
            self.root.after(4000, self.auto_detect_running)

    # Core Operations Executions
    def start_server_service(self):
        if self.server_process:
            return
        self.log_sys("Launching Web Portal Server subprocess...")
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Launch server process
        self.server_process = subprocess.Popen(
            [sys.executable, "-m", "backfeed.server"],
            cwd=root_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        # Spin a thread to read its stdout logs
        threading.Thread(target=self.stream_process_logs, args=(self.server_process, "Web Server"), daemon=True).start()
        self.root.after(1000, self.auto_detect_running)

    def stop_server_service(self):
        self.log_sys("Terminating Web Portal Server...")
        if self.server_process:
            self.server_process.terminate()
            self.server_process = None
            
        # Windows fallback: taskkill to free up ports
        if os.name == 'nt':
            try:
                res = subprocess.run('netstat -aon | findstr "LISTENING" | findstr ":8085"', shell=True, capture_output=True, text=True)
                for line in res.stdout.strip().split('\n'):
                    if line:
                        parts = line.split()
                        if len(parts) >= 5:
                            pid = parts[-1]
                            self.log_sys(f"Forcing release of locked port 8085 (Process ID: {pid})")
                            subprocess.run(f"taskkill /f /pid {pid}", shell=True, capture_output=True)
            except Exception as e:
                self.log_error(f"Error checking port lock: {e}")
                
        self.root.after(1000, self.auto_detect_running)

    def start_agent_service(self):
        if self.listener_process:
            return
        self.log_sys("Launching Background Email Sourcing listener...")
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        listener_path = os.path.join(root_dir, "run_work_cycle.py")
        
        self.listener_process = subprocess.Popen(
            [sys.executable, listener_path],
            cwd=root_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        # Spin thread to read listener stdout logs
        threading.Thread(target=self.stream_process_logs, args=(self.listener_process, "Sourcing Agent"), daemon=True).start()
        self.root.after(1000, self.auto_detect_running)

    def stop_agent_service(self):
        self.log_sys("Terminating Sourcing Agent process...")
        if self.listener_process:
            self.listener_process.terminate()
            self.listener_process = None
            
        if os.name == 'nt':
            try:
                cmd = 'wmic process where "CommandLine like \'%run_work_cycle.py%\'" get ProcessId'
                res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                pids = [line.strip() for line in res.stdout.strip().split('\n') if line.strip().isdigit()]
                for pid in pids:
                    self.log_sys(f"Killing old worker Process ID: {pid}")
                    subprocess.run(f"taskkill /f /pid {pid}", shell=True, capture_output=True)
            except Exception as e:
                self.log_error(f"Error checking background process handles: {e}")
                
        self.root.after(1000, self.auto_detect_running)

    def stream_process_logs(self, proc, label):
        """Reads stdout/stderr stream from a subprocess in a non-blocking background thread."""
        for line in iter(proc.stdout.readline, ''):
            if not self.alive:
                break
            clean_line = line.strip()
            if clean_line:
                if "error" in clean_line.lower() or "failed" in clean_line.lower():
                    self.log_error(f"[{label}] {clean_line}")
                elif "success" in clean_line.lower() or "ok" in clean_line.lower() or "active" in clean_line.lower():
                    self.log_success(f"[{label}] {clean_line}")
                else:
                    self.log_info(f"[{label}] {clean_line}")
        proc.stdout.close()

    def open_portal(self):
        host = self.config.get("host", "localhost")
        port = self.config.get("port", 8085)
        # Avoid binding to 0.0.0.0 directly on browser redirection
        if host == "0.0.0.0":
            host = "localhost"
        url = f"http://{host}:{port}"
        self.log_sys(f"Launching external browser: {url}")
        webbrowser.open(url)

    # Configuration Handlers
    def load_config_fields(self):
        self.config = load_config()
        for key, entry in self.config_fields.items():
            entry.delete(0, tk.END)
            entry.insert(0, str(self.config.get(key, "")))

    def save_config_data(self):
        for key, entry in self.config_fields.items():
            self.config[key] = entry.get().strip()
            
        try:
            os.makedirs(os.path.dirname(CONFIG_FILE_PATH), exist_ok=True)
            with open(CONFIG_FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=4)
            self.log_success("System config file successfully saved to registry.")
            messagebox.showinfo("Success", "Configuration settings saved successfully!")
        except Exception as e:
            self.log_error(f"Failed to write config file: {e}")
            messagebox.showerror("Error", f"Failed to save configuration: {e}")

    # Licensing Handlers
    def load_licensing_fields(self):
        try:
            mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff) for ele in range(0, 8*6, 8)][::-1])
            self.mac_val.config(text=mac)
        except Exception:
            self.mac_val.config(text="Unknown", fg=ACCENT_RED)
            
        is_valid = verify_license_or_prompt()
        if is_valid:
            self.lic_status_val.config(text="Activated (Node Locked)", fg=ACCENT_GREEN)
        else:
            self.lic_status_val.config(text="Invalid / Unregistered", fg=ACCENT_RED)
            
        if os.path.exists(LICENSE_FILE_PATH):
            try:
                with open(LICENSE_FILE_PATH, 'r', encoding='utf-8') as f:
                    self.entry_serial.delete(0, tk.END)
                    self.entry_serial.insert(0, f.read().strip())
            except Exception:
                pass

    def activate_license_node(self):
        key = self.entry_serial.get().strip()
        if not key:
            messagebox.showwarning("Warning", "Please enter a valid activation key.")
            return
            
        try:
            os.makedirs(os.path.dirname(LICENSE_FILE_PATH), exist_ok=True)
            with open(LICENSE_FILE_PATH, 'w', encoding='utf-8') as f:
                f.write(key)
                
            self.log_sys(f"Serial registry updated. Re-verifying machine node activation...")
            if verify_license_or_prompt():
                self.log_success("Machine node registration completed successfully. License is active.")
                messagebox.showinfo("Success", "Backfeed license activated successfully!")
                self.load_licensing_fields()
            else:
                self.log_error("License key signature mismatched with hardware MAC signature.")
                messagebox.showerror("Activation Failed", "Invalid license key signature for this machine node.")
                self.load_licensing_fields()
        except Exception as e:
            self.log_error(f"License verification error: {e}")
            messagebox.showerror("Error", f"Failed to register key: {e}")

    def on_close(self):
        """Shut down background subprocesses cleanly on window close."""
        self.alive = False
        if self.server_process:
            self.server_process.terminate()
        if self.listener_process:
            self.listener_process.terminate()
        self.root.destroy()

def start_gui():
    root = tk.Tk()
    app = BackfeedGUI(root)
    root.mainloop()

if __name__ == "__main__":
    start_gui()
