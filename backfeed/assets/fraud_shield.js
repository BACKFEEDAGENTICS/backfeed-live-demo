// High Fidelity Backfeed Sentinel Security Operations Desktop Engine
// Manages the Windows 11 desktop window frames, taskbar clock, dynamic notifications, and email reports

const scenarios = {
    scraper: {
        id: "scraper",
        title: "Procurement Bid Fraud",
        from: "purchasing-manager@unverified-bids-portal.xyz",
        subject: "RFQ: Bulk Inventory Cataloge & Pricing sheets verification Urgently",
        date: "June 4, 2026 9:30 PM",
        snippet: "Dearest Sales, We are audit logistics and supply chain vendors for regional contract...",
        avatar: "U",
        senderName: "Unverified Procurement Desk",
        hasAttachment: false,
        attachmentName: "",
        body: "Dearest Sales,\n\nWe are audit logistics and supply chain vendors for regional contract bids. Kindly provide complete pricing matrix sheets and volume discount factors for represented electrical strut channels, copper wire cables, and fittings. We require immediate exports pricing sheets files to register your company as vendor.\n\nThank you,",
        decision: "Quarantine & Verify ID",
        decisionBg: "rgba(234, 88, 12, 0.15)",
        decisionColor: "var(--color-warning)",
        riskScore: 85,
        riskLabel: "HIGH RISK",
        riskColor: "var(--color-warning)",
        warningBanner: {
            class: "yellow",
            icon: "fa-solid fa-triangle-exclamation",
            text: "<strong>External Sender Alert:</strong> This sender is outside your organization and the domain registration is extremely fresh. Be cautious sharing pricing schemas.",
            actions: [
                { label: "Trust Sender", action: "trust" },
                { label: "Quarantine Info", action: "quarantine" }
            ]
        },
        variables: {
            spf: { status: "FAIL", class: "danger" },
            whois: { status: "WARNING", class: "warning" },
            homoglyph: { status: "SAFE", class: "safe" },
            nlp: { status: "SAFE", class: "safe" },
            attachment: { status: "SAFE", class: "safe" }
        },
        flags: [
            {
                severity: "danger",
                title: "Procurement Billing Fraud Signature",
                desc: "Fraudulent buyers pretend to audit supply chains to obtain custom corporate pricing schemas and templates, which they then use to forge fake invoices or execute bid-rigging fraud."
            },
            {
                severity: "warning",
                title: "Unverified Vendor Validation Audit",
                desc: "Requests for absolute price lists and custom multipliers without specifying a valid billing account number or project jobsite are high-probability social engineering fraud vectors."
            },
            {
                severity: "safe",
                title: "Defense Strategy: Decoy Validation Response",
                desc: "To combat vendor invoice fraud, the agent automatically intercepts the request, flags the account as unverified, and generates a standard public catalog response while requesting identity verification before releasing custom rates."
            }
        ],
        logs: [
            "PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId 'MSG-06048512'",
            "Initializing Backfeed Mail Security Gateway analytics module...",
            "Checking SMTP envelope validation standards...",
            "WARNING: SPF record softfail detected from transmission IP 198.51.100.42.",
            "WARNING: DKIM signature validation failed. Origin alignment corrupted.",
            "Checking WHOIS domain registry metrics...",
            "WARNING: Domain 'unverified-bids-portal.xyz' registered 3 days ago via anonymized proxy.",
            "Auditing database account history...",
            "ACCOUNT EXCEPTION: No customer billing files match requested details.",
            "Analyzing body text structure using NLP semantic parser...",
            "LEXICAL TRIGGER: Matches template harvesting sequences ('complete pricing matrix', 'volume discounts').",
            "VERDICT: High probability of Procurement Fraud/Bid-Rigging template setup.",
            "MITIGATION ACTION: Restricting access to internal discount tables.",
            "MITIGATION ACTION: Quarantined email. Dispatched public list catalog proxy response to sender."
        ]
    },
    spoof: {
        id: "spoof",
        title: "CEO Impersonation Phish",
        from: "specialist.d@summit-sales-executives.top",
        subject: "URGENT: Verify Wire Transfer details immediate",
        date: "June 4, 2026 9:43 PM",
        snippet: "Hi there, I'm in executive board meeting and need you to verify wire release of $45,000...",
        avatar: "TS",
        senderName: "Specialist D (Executives)",
        hasAttachment: false,
        attachmentName: "",
        body: "Hi there,\n\nI'm in executive board meeting right now and need you to verify and approve wire release of $45,000 to supplier account immediately. The jobsite shipment is hold until payment clear. Send confirmation copy as soon as its processed. Do not call my phone, just reply here.",
        decision: "Block & Alert Security",
        decisionBg: "rgba(220, 38, 38, 0.15)",
        decisionColor: "var(--color-danger)",
        riskScore: 98,
        riskLabel: "CRITICAL",
        riskColor: "var(--color-danger)",
        warningBanner: {
            class: "red",
            icon: "fa-solid fa-skull-crossbones",
            text: "<strong>Spoofing Alert:</strong> We think this message is a phishing attempt. The sender name mimics Specialist D but origin credentials do not align.",
            actions: [
                { label: "Report Phish", action: "report" },
                { label: "Ignore & Delete", action: "delete" }
            ]
        },
        variables: {
            spf: { status: "FAIL", class: "danger" },
            whois: { status: "DANGER", class: "danger" },
            homoglyph: { status: "DANGER", class: "danger" },
            nlp: { status: "DANGER", class: "danger" },
            attachment: { status: "SAFE", class: "safe" }
        },
        flags: [
            {
                severity: "danger",
                title: "Look-Alike Domain Spoofing",
                desc: "The domain 'summit-sales-executives.top' mimics our internal domain to bypass keyword spam filters. Attackers use homoglyph/typosquatting to trick staff."
            },
            {
                severity: "danger",
                title: "Financial Authority Override Pattern",
                desc: "Urgent demands to transfer funds bypassing the ERP system and standard phone verification are classic business email compromise (BEC) vectors."
            },
            {
                severity: "safe",
                title: "Defense Strategy: Protocol Isolation",
                desc: "AI blocks the email and tags it in the organization-wide directory. The agent automatically creates an IT ticket and locks any outgoing ERP financial queues originating from this thread."
            }
        ],
        logs: [
            "PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId 'MSG-06048525'",
            "Initializing Backfeed Mail Security Gateway analytics module...",
            "Checking domain credentials...",
            "CRITICAL EXCEPTION: Sender domain 'summit-sales-executives.top' fails SPF and DKIM authentication alignments.",
            "Analyzing typosquatting patterns...",
            "CRITICAL: High match score for Homoglyph attack on summitsales.com.",
            "Evaluating sender IP reputation...",
            "CRITICAL: IP 203.0.113.111 reported for high frequency spam relays.",
            "Evaluating urgency and threat level using NLP semantic parser...",
            "BEC TRIPPED: Urgency markers matched ('URGENT', 'wire release', 'do not call').",
            "HALTING OPERATIONS: Locking outgoing transaction queues.",
            "MITIGATION ACTION: Added sender to network firewall blocklist.",
            "MITIGATION ACTION: Quarantined email. Dispatched alert to executive desk."
        ]
    },
    invoice: {
        id: "invoice",
        title: "Malicious Invoice Attachment",
        from: "logistics-billing@freight-invoices-portal.com",
        subject: "Pending Overdue Statement & bill of lading PDF document",
        date: "June 4, 2026 9:58 PM",
        snippet: "Pls find attached outstanding delivery statement invoice for your West Deptford...",
        avatar: "FB",
        senderName: "Freight Billing Portal",
        hasAttachment: true,
        attachmentName: "statement_WD.zip",
        body: "Pls find attached outstanding delivery statement invoice for your West Deptford logistics branch. The attachment is compressed inside zip folder. Open it to check details before legal interest charge accumulate.\n\nThank.",
        decision: "Sandbox Quarantine",
        decisionBg: "rgba(220, 38, 38, 0.15)",
        decisionColor: "var(--color-danger)",
        riskScore: 95,
        riskLabel: "DANGER",
        riskColor: "var(--color-danger)",
        warningBanner: {
            class: "red",
            icon: "fa-solid fa-virus",
            text: "<strong>Attachment Warning:</strong> Suspicious binary double extension (.pdf.exe) extracted inside this archive. Sandbox detonation shows malware behaviour.",
            actions: [
                { label: "Detonate File", action: "detonate" },
                { label: "Delete Attachment", action: "delete_att" }
            ]
        },
        variables: {
            spf: { status: "PASS", class: "safe" },
            whois: { status: "SAFE", class: "safe" },
            homoglyph: { status: "SAFE", class: "safe" },
            nlp: { status: "WARNING", class: "warning" },
            attachment: { status: "DANGER", class: "danger" }
        },
        flags: [
            {
                severity: "danger",
                title: "Double Extension Attachment Trojan",
                desc: "The attachment contains 'invoice_WD.pdf.exe' inside a zip archive. Attackers double-extend files so users execute binaries thinking they are reading documents."
            },
            {
                severity: "warning",
                title: "External Account Mismatch",
                desc: "The invoice number referenced in the body does not map to any active logistics record or purchase order in our database."
            },
            {
                severity: "safe",
                title: "Defense Strategy: Automated Sandbox Detonation",
                desc: "Incoming files are detoured to an isolated virtual sandbox. The file is opened, analyzed for malicious shellcode hooks, and discarded before reaching user endpoints."
            }
        ],
        logs: [
            "PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId 'MSG-06048540'",
            "Initializing Backfeed Mail Security Gateway analytics module...",
            "Checking attachments payload...",
            "Found compressed zip archive 'statement_WD.zip'. Extracting archive payload...",
            "WARNING: Found file 'invoice_WD.pdf.exe' inside archive container.",
            "CRITICAL: Double-extension payload bypass detected (.pdf.exe represents PE binary).",
            "Routing to Sandbox detonation room...",
            "Detonating file in virtual environment...",
            "CRITICAL: Sandbox reports process attempted system registry write hook.",
            "MITIGATION ACTION: Deleted zip attachment from mail server.",
            "MITIGATION ACTION: Blocked file hash in endpoint firewall."
        ]
    },
    extortion: {
        id: "extortion",
        title: "Extortion & Ransom",
        from: "shadow-leak@anonymous-onion.onion",
        subject: "Security Alert: Database backup Export breached warning",
        date: "June 4, 2026 10:13 PM",
        snippet: "DEAR CUSTOMER, We have hacked your network server and downloaded database backups...",
        avatar: "SL",
        senderName: "Shadow Leak Group",
        hasAttachment: false,
        attachmentName: "",
        body: "DEAR CUSTOMER,\n\nWe have hacked your network server and downloaded database backups containing your regional sales, client lists and pricing sheets. To prevent this data leak publically, send 0.5 BTC to wallet address below. You have 48 hour. If you do not pay, your clients will be informed.",
        decision: "Quarantine & Audit",
        decisionBg: "rgba(220, 38, 38, 0.15)",
        decisionColor: "var(--color-danger)",
        riskScore: 92,
        riskLabel: "DANGER",
        riskColor: "var(--color-danger)",
        warningBanner: {
            class: "red",
            icon: "fa-solid fa-circle-radiation",
            text: "<strong>Extortion Warning:</strong> This message was routed via Tor relays and demands cryptocurrency ransom. AI is currently scanning internal databases for export logs.",
            actions: [
                { label: "Run SQL Audit", action: "audit" },
                { label: "Purge Message", action: "purge" }
            ]
        },
        variables: {
            spf: { status: "FAIL", class: "danger" },
            whois: { status: "DANGER", class: "danger" },
            homoglyph: { status: "SAFE", class: "safe" },
            nlp: { status: "DANGER", class: "danger" },
            attachment: { status: "SAFE", class: "safe" }
        },
        flags: [
            {
                severity: "danger",
                title: "Extortion / Blackmail Lexicon",
                desc: "High density of extortion terms ('leak publically', 'pay BTC', '48 hours') combined with anonymous onion relay routing."
            },
            {
                severity: "safe",
                title: "Defense Strategy: Database Auditing",
                desc: "The agent quarantines the email and runs automated database checksum audits to verify if any export operations occurred during the timestamp windows. Most extortion emails are spray-and-pray scams using zero actual breach data."
            }
        ],
        logs: [
            "PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId 'MSG-06048555'",
            "Initializing Backfeed Mail Security Gateway analytics module...",
            "Scanning email metadata...",
            "Anonymous onion mail relay detected. Origin blocked.",
            "Checking extortion dictionary matches...",
            "MATCH: Ransom terms detected. Flagging message.",
            "INITIATING DATA AUDIT: Checking database export logs for unauthorized accesses...",
            "AUDIT OK: No bulk database exports or checksum mismatches found. Email identified as standard automated bluff scam.",
            "MITIGATION ACTION: Alerted IT compliance. Quarantined sender."
        ]
    },
    authentic: {
        id: "authentic",
        title: "Authentic RFQ Inquiry",
        from: "estimating@vanguard-contractors-llc.net",
        subject: "RFQ Project: Deptford Storage Yard Expansion",
        date: "June 4, 2026 10:20 PM",
        snippet: "Please quote the following materials for our upcoming Deptford yard refit project...",
        avatar: "V",
        senderName: "Vanguard Contractors LLC",
        hasAttachment: false,
        attachmentName: "",
        body: "Please quote the following materials for our upcoming Deptford yard refit project:\n- 1,200 ft Strut Channel 12G Galv\n- 500 ft THHN 10 AWG Copper\nAccount Reference: VG-992",
        decision: "Forward to Representative",
        decisionBg: "rgba(22, 163, 74, 0.15)",
        decisionColor: "var(--color-safe)",
        riskScore: 10,
        riskLabel: "SAFE",
        riskColor: "var(--color-safe)",
        warningBanner: {
            class: "safe",
            icon: "fa-solid fa-circle-check",
            text: "<strong>Verified Sender:</strong> This email was verified via full SPF and DKIM validation. Matches client record 'Vanguard Contractors LLC'.",
            actions: [
                { label: "Add to Safe Senders", action: "safe_sender" }
            ]
        },
        variables: {
            spf: { status: "PASS", class: "safe" },
            whois: { status: "SAFE", class: "safe" },
            homoglyph: { status: "SAFE", class: "safe" },
            nlp: { status: "SAFE", class: "safe" },
            attachment: { status: "SAFE", class: "safe" }
        },
        flags: [
            {
                severity: "safe",
                title: "Valid Business Signature",
                desc: "Sender matches active contractor credentials in our local registry database, and uses recognized SKU and quantity structures."
            },
            {
                severity: "safe",
                title: "Reputation Check Pass",
                desc: "Sender IP and MX records have zero historical listings on global blocklists. SPF/DKIM credentials align perfectly."
            }
        ],
        logs: [
            "PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId 'MSG-06049002'",
            "Initializing Backfeed Mail Security Gateway analytics module...",
            "Scanning incoming message...",
            "Checking sender credentials...",
            "VERIFIED: Match found for Account Ref VG-992 (Vanguard Contractors).",
            "IP Check: Domain health score 100/100.",
            "BOM Matching: Extracted 'Strut Channel' and 'THHN 10 AWG' for routing.",
            "MITIGATION ACTION: Checked safe. Routing to Specialist B for final project quote."
        ]
    }
};

// DOM Elements
const mailItemsList = document.getElementById('mail-items-list');
const emailSubject = document.getElementById('email-subject');
const emailFrom = document.getElementById('email-from');
const senderAvatarInitial = document.getElementById('sender-avatar-initial');
const senderNameLabel = document.getElementById('sender-name-label');
const emailDate = document.getElementById('email-date');
const emailBodyText = document.getElementById('email-body-text');

const attachmentBadgeContainer = document.getElementById('attachment-badge-container');
const attachmentName = document.getElementById('attachment-name');

const consoleLogsContainer = document.getElementById('console-logs-container');

const decisionBadgeValue = document.getElementById('decision-badge-value');
const varSpf = document.getElementById('var-spf');
const varWhois = document.getElementById('var-whois');
const varHomoglyph = document.getElementById('var-homoglyph');
const varNlp = document.getElementById('var-nlp');
const varAttachmentRow = document.getElementById('var-attachment-row');
const varAttachment = document.getElementById('var-attachment');
const redFlagsContainer = document.getElementById('red-flags-container');

// Ribbon/Folders and Banner Elements
const outlookSecurityBanner = document.getElementById('outlook-security-banner');
const inboxUnreadCount = document.getElementById('inbox-unread-count');
const junkUnreadCount = document.getElementById('junk-unread-count');

// Risk Gauge elements
const riskGaugeCircle = document.getElementById('risk-gauge-circle');
const riskPercentText = document.getElementById('risk-percent-text');
const riskLabelText = document.getElementById('risk-label-text');

// Override Buttons
const btnRelease = document.getElementById('btn-release');
const btnHardDelete = document.getElementById('btn-hard-delete');
const btnWhitelist = document.getElementById('btn-whitelist');
const btnDecoy = document.getElementById('btn-decoy');
const btnBlockIp = document.getElementById('btn-block-ip');

// Windows 11 elements
const desktopArea = document.getElementById('desktop-area');
const clockElement = document.getElementById('tray-clock');
const winNotif = document.getElementById('win11-notification');
const notifTitle = document.getElementById('notif-title');
const notifDesc = document.getElementById('notif-desc');

let activeScenarioId = 'scraper';
let isAutoplayPlaying = false;
let userScenariosOverride = {}; // Keeps track of manual interventions
let highestZ = 100;
let inboxCount = 4;
let junkCount = 2;

// --- Drag and Drop Windows Handler ---
function makeDraggable(windowEl, titleBarEl) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    titleBarEl.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        // Check if button click on windows controls
        if (e.target.closest('.window-controls')) return;
        
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        
        bringToFront(windowEl);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        windowEl.style.top = (windowEl.offsetTop - pos2) + "px";
        windowEl.style.left = (windowEl.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function bringToFront(windowEl) {
    highestZ++;
    windowEl.style.zIndex = highestZ;
    
    // update active state styles
    document.querySelectorAll('.win-frame').forEach(el => {
        el.style.borderColor = '#c8c8c8';
        el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
    });
    windowEl.style.borderColor = '#0078d4';
    windowEl.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
}

// Bind drag hooks and click layers to Win11 Frames
function initWindowEvents(windowId) {
    const frame = document.getElementById(windowId);
    const header = document.getElementById(windowId + '-header');
    
    if (frame && header) {
        makeDraggable(frame, header);
        frame.addEventListener('mousedown', () => bringToFront(frame));
        
        // Minimize/Maximize/Close bindings
        const closeBtn = header.querySelector('.win-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                frame.style.display = 'none';
                const tbIcon = document.getElementById('tb-' + windowId.replace('win-', ''));
                if (tbIcon) tbIcon.classList.remove('active');
            });
        }
        
        const minBtn = header.querySelector('.win-min');
        if (minBtn) {
            minBtn.addEventListener('click', () => {
                frame.classList.add('minimized');
            });
        }
    }
}

// Bind Taskbar Icons and Desktop Shortcuts to toggle windows
function setupTrayAndDesktopIcons() {
    const apps = ['outlook', 'terminal', 'sentinel', 'controller'];
    
    apps.forEach(app => {
        const tbIcon = document.getElementById('tb-' + app);
        const win = document.getElementById('win-' + app);
        const shortcut = document.getElementById('shortcut-' + app);
        
        if (tbIcon && win) {
            tbIcon.addEventListener('click', () => {
                if (win.style.display === 'none' || win.classList.contains('minimized')) {
                    win.style.display = 'flex';
                    win.classList.remove('minimized');
                    bringToFront(win);
                    tbIcon.classList.add('active');
                } else {
                    win.classList.add('minimized');
                }
            });
        }
        
        if (shortcut && win) {
            shortcut.addEventListener('dblclick', () => {
                win.style.display = 'flex';
                win.classList.remove('minimized');
                bringToFront(win);
                if (tbIcon) tbIcon.classList.add('active');
            });
        }
    });
}

// System Tray clock updater
let simTime = new Date('2026-06-04T21:30:00');
function updateClock() {
    simTime.setTime(simTime.getTime() + 1000);
    let hours = simTime.getHours();
    let minutes = simTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 is 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    
    const trayDate = document.getElementById('tray-date');
    if (trayDate) {
        const month = simTime.getMonth() + 1;
        const day = simTime.getDate();
        const year = simTime.getFullYear();
        trayDate.textContent = `${month}/${day}/${year}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Threat alert email dispatch API call ---
function dispatchAlertEmail(sc) {
    // Compile reasoning
    const reasoningText = sc.flags.map(f => `* ${f.title}: ${f.desc}`).join('\n\n');
    
    showToast("Sentinel Dispatching Alert report via local Outlook client...", false);
    
    // Call Python backend endpoint
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: sc.title,
            decision: sc.decision,
            reasoning: reasoningText,
            logs: sc.logs
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            showToast(`Report emailed to kdp10891@outlook.com successfully!`);
        } else {
            console.error("Mail server error:", data.message);
            showToast(`Failed to dispatch email: ${data.message}`, true);
        }
    })
    .catch(err => {
        console.error("HTTP dispatch failure:", err);
        showToast("Email API unreachable. Server likely starting up.", true);
    });
}

// --- Outlook Mail Render Core ---
function renderInboxList() {
    mailItemsList.innerHTML = '';
    Object.values(scenarios).forEach(sc => {
        const item = document.createElement('div');
        
        const isRead = sc.id === 'authentic' || userScenariosOverride[sc.id];
        const isUnread = !isRead;
        const isActive = sc.id === activeScenarioId;
        
        item.className = `mail-item ${isUnread ? 'unread' : ''} ${isActive ? 'active' : ''}`;
        item.setAttribute('data-id', sc.id);
        
        item.innerHTML = `
            <div class="mail-item-top">
                <span class="mail-sender">${sc.senderName}</span>
                <span class="mail-date">${sc.date.split(' ')[2] + ' ' + sc.date.split(' ')[3]}</span>
            </div>
            <div class="mail-subject">${sc.subject}</div>
            <div class="mail-snippet">${sc.snippet}</div>
        `;
        
        item.addEventListener('click', () => {
            if (isAutoplayPlaying) {
                isAutoplayPlaying = false;
                const triggerBtn = document.getElementById('trigger-demo-btn');
                triggerBtn.disabled = false;
                triggerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Autoplay Simulation';
            }
            selectEmail(sc.id);
        });
        
        mailItemsList.appendChild(item);
    });
}

function selectEmail(id) {
    activeScenarioId = id;
    renderInboxList();
    loadScenario(id);
}

// Risk Circle Gauge logic
function updateGauge(score, label, color) {
    const totalOffset = 251.2;
    const offset = totalOffset - (score / 100) * totalOffset;
    
    riskGaugeCircle.style.strokeDashoffset = offset;
    riskGaugeCircle.style.stroke = color;
    
    let currentPercent = 0;
    const interval = setInterval(() => {
        if (currentPercent >= score) {
            riskPercentText.textContent = `${score}%`;
            clearInterval(interval);
        } else {
            currentPercent += Math.ceil(score / 10);
            if (currentPercent > score) currentPercent = score;
            riskPercentText.textContent = `${currentPercent}%`;
        }
    }, 30);
    
    riskLabelText.textContent = label;
    riskLabelText.style.color = color;
}

// Warning banner layout
function renderWarningBanner(sc) {
    if (!sc.warningBanner) {
        outlookSecurityBanner.style.display = 'none';
        return;
    }
    
    if (userScenariosOverride[sc.id]) {
        const override = userScenariosOverride[sc.id];
        outlookSecurityBanner.style.display = 'flex';
        outlookSecurityBanner.className = `outlook-warning-banner safe`;
        outlookSecurityBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div class="banner-content">
                <strong>SecOps Action Overridden:</strong> This message was marked as <strong>${override.decision}</strong> by KP.
            </div>
        `;
        return;
    }
    
    outlookSecurityBanner.style.display = 'flex';
    outlookSecurityBanner.className = `outlook-warning-banner ${sc.warningBanner.class}`;
    
    let actionButtonsHTML = sc.warningBanner.actions.map(act => {
        return `<button class="banner-btn" onclick="executeBannerAction('${sc.id}', '${act.action}')">${act.label}</button>`;
    }).join(' ');
    
    outlookSecurityBanner.innerHTML = `
        <div class="banner-icon"><i class="${sc.warningBanner.icon}"></i></div>
        <div class="banner-content">
            ${sc.warningBanner.text}
            <div class="banner-actions">${actionButtonsHTML}</div>
        </div>
    `;
}

window.executeBannerAction = function(scenarioId, action) {
    if (action === 'trust' || action === 'safe_sender') {
        executeSecOpsOverride('Whitelisted & Delivered', 'SAFE', 'var(--color-safe)');
    } else {
        executeSecOpsOverride('Quarantined & Deleted', 'DANGER', 'var(--color-danger)');
    }
};

function appendPowerShellHeader() {
    consoleLogsContainer.innerHTML = '';
    const headers = [
        "Windows PowerShell",
        "Copyright (C) Microsoft Corporation. All rights reserved.",
        "",
        "Try the new cross-platform PowerShell https://aka.ms/pscore6",
        ""
    ];
    headers.forEach(line => {
        const el = document.createElement('div');
        el.className = "console-text";
        el.textContent = line;
        consoleLogsContainer.appendChild(el);
    });
}

// Windows 11 Slide-in notification helper
function showWin11Notification(title, text) {
    notifTitle.textContent = title;
    notifDesc.textContent = text;
    winNotif.classList.add('show');
    
    // Play system warning beep sound in browser context if supported
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, context.currentTime); // Windows notification pitch
        osc.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + 0.15);
    } catch(e) {}

    setTimeout(() => {
        winNotif.classList.remove('show');
    }, 4500);
}

function loadScenario(id) {
    const sc = scenarios[id];
    if (!sc) return;

    // 1. Outlook updates
    emailSubject.textContent = sc.subject;
    emailFrom.textContent = sc.from;
    senderAvatarInitial.textContent = sc.avatar;
    senderNameLabel.textContent = sc.senderName;
    emailDate.textContent = sc.date;
    emailBodyText.textContent = sc.body;

    if (sc.hasAttachment) {
        attachmentBadgeContainer.style.display = 'block';
        attachmentName.textContent = sc.attachmentName;
        varAttachmentRow.style.display = 'flex';
    } else {
        attachmentBadgeContainer.style.display = 'none';
        varAttachmentRow.style.display = 'none';
    }

    renderWarningBanner(sc);

    // Reset gauge & variables
    updateGauge(0, "SCANNING", "#8a8886");
    decisionBadgeValue.textContent = "Analyzing...";
    decisionBadgeValue.style.background = "#edebe9";
    decisionBadgeValue.style.color = "var(--outlook-text-dark)";

    varSpf.textContent = "CHECKING"; varSpf.className = "var-status-badge warning";
    varWhois.textContent = "CHECKING"; varWhois.className = "var-status-badge warning";
    varHomoglyph.textContent = "CHECKING"; varHomoglyph.className = "var-status-badge warning";
    varNlp.textContent = "CHECKING"; varNlp.className = "var-status-badge warning";
    varAttachment.textContent = "CHECKING"; varAttachment.className = "var-status-badge warning";

    redFlagsContainer.innerHTML = '<div style="font-size: 11px; color: var(--outlook-text-light); text-align: center; padding: 20px;">Agent analyzing threat data...</div>';

    appendPowerShellHeader();
    const promptLine = document.createElement('div');
    promptLine.className = "console-text prompt";
    promptLine.textContent = `PS C:\\Users\\KP\\SecurityGateway> .\\Analyze-Email.ps1 -MessageId '${sc.id.toUpperCase()}-FILE'`;
    consoleLogsContainer.appendChild(promptLine);

    setOverrideButtonsDisabled(true);

    setTimeout(() => {
        if (userScenariosOverride[sc.id]) {
            const override = userScenariosOverride[sc.id];
            updateGauge(override.score, override.label, override.color);
            decisionBadgeValue.textContent = override.decision;
            decisionBadgeValue.style.background = override.bg;
            decisionBadgeValue.style.color = override.color;
            
            varSpf.textContent = "OVERRIDDEN"; varSpf.className = "var-status-badge safe";
            varWhois.textContent = "OVERRIDDEN"; varWhois.className = "var-status-badge safe";
            varHomoglyph.textContent = "OVERRIDDEN"; varHomoglyph.className = "var-status-badge safe";
            varNlp.textContent = "OVERRIDDEN"; varNlp.className = "var-status-badge safe";
            varAttachment.textContent = "OVERRIDDEN"; varAttachment.className = "var-status-badge safe";
            
            redFlagsContainer.innerHTML = `
                <div class="reasoning-item">
                    <strong><i class="fa-solid fa-circle-check" style="color: var(--color-safe); margin-right: 6px;"></i> Administrator Override Applied</strong>
                    This threat vector was audited and whitelisted/terminated manually by Security Operations Administrator KP.
                </div>
            `;
            
            const actionLog = document.createElement('div');
            actionLog.className = "console-text ok";
            actionLog.textContent = `PS C:\\Users\\KP\\SecurityGateway> Override action applied: ${override.decision}. Outgoing filters configured.`;
            consoleLogsContainer.appendChild(actionLog);
            setOverrideButtonsDisabled(false);
            return;
        }

        updateGauge(sc.riskScore, sc.riskLabel, sc.riskColor);
        updateVariableBadge(varSpf, sc.variables.spf);
        updateVariableBadge(varWhois, sc.variables.whois);
        updateVariableBadge(varHomoglyph, sc.variables.homoglyph);
        updateVariableBadge(varNlp, sc.variables.nlp);
        updateVariableBadge(varAttachment, sc.variables.attachment);

        decisionBadgeValue.textContent = sc.decision;
        decisionBadgeValue.style.background = sc.decisionBg;
        decisionBadgeValue.style.color = sc.decisionColor;

        redFlagsContainer.innerHTML = '';
        sc.flags.forEach(flag => {
            const el = document.createElement('div');
            el.className = `reasoning-item`;
            let iconColor = 'var(--color-safe)';
            if (flag.severity === 'danger') iconColor = 'var(--color-danger)';
            if (flag.severity === 'warning') iconColor = 'var(--color-warning)';
            el.innerHTML = `
                <strong><i class="fa-solid fa-circle-info" style="color: ${iconColor}; margin-right: 4px;"></i> ${flag.title}</strong>
                ${flag.desc}
            `;
            redFlagsContainer.appendChild(el);
        });

        sc.logs.forEach((log, index) => {
            setTimeout(() => {
                if (log.startsWith("PS ")) return;
                const el = document.createElement('div');
                el.className = "console-text";
                if (log.includes("WARNING") || log.includes("EXCEPTION")) {
                    el.className += " warn";
                } else if (log.includes("CRITICAL") || log.includes("FAIL") || log.includes("DETONATE")) {
                    el.className += " err";
                } else if (log.includes("MITIGATION") || log.includes("RESPONSE") || log.includes("VERIFIED") || log.includes("AUDIT OK")) {
                    el.className += " ok";
                } else {
                    el.className += " info";
                }
                el.textContent = log;
                consoleLogsContainer.appendChild(el);
                consoleLogsContainer.scrollTop = consoleLogsContainer.scrollHeight;
            }, index * 100);
        });

        setOverrideButtonsDisabled(false);
        
        // Show Win11 Native Toast for threat alerts
        if (sc.id !== 'authentic') {
            showWin11Notification(`Sentinel Alert: Blocked Threat`, `${sc.title} has been quarantined.`);
            
            // ACTUALLY EMAIL THE OPINIONS TO THE USER ON DISPATCH
            dispatchAlertEmail(sc);
        } else {
            showToast("Authentic RFQ analysis complete.");
        }
    }, 1000);
}

function updateVariableBadge(badge, config) {
    badge.textContent = config.status;
    badge.className = `var-status-badge ${config.class}`;
}

function setOverrideButtonsDisabled(isDisabled) {
    btnRelease.disabled = isDisabled;
    btnHardDelete.disabled = isDisabled;
    btnWhitelist.disabled = isDisabled;
    btnDecoy.disabled = isDisabled;
    btnBlockIp.disabled = isDisabled;
}

function showToast(message, isWarning = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    let iconHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-safe);"></i>`;
    if (isWarning) {
        iconHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--color-warning);"></i>`;
    }
    toast.innerHTML = `${iconHTML} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            container.removeChild(toast);
        }, 500);
    }, 3000);
}

function executeSecOpsOverride(actionName, label, color) {
    const sc = scenarios[activeScenarioId];
    if (!sc) return;
    
    userScenariosOverride[sc.id] = {
        decision: actionName,
        label: label,
        score: label === 'SAFE' ? 0 : 100,
        color: color,
        bg: label === 'SAFE' ? 'rgba(22, 163, 74, 0.15)' : 'rgba(220, 38, 38, 0.15)'
    };
    
    inboxCount--;
    inboxUnreadCount.textContent = inboxCount;
    if (label !== 'SAFE') {
        junkCount++;
        junkUnreadCount.textContent = junkCount;
    }
    
    loadScenario(sc.id);
    renderInboxList();
    showToast(`SecOps override executed: ${actionName}`);
    
    // Also email reports on manual override
    dispatchAlertEmail(sc);
}

// Bind manual controls
btnRelease.addEventListener('click', () => {
    executeSecOpsOverride('Manually Approved', 'SAFE', 'var(--color-safe)');
    const logEl = document.createElement('div');
    logEl.className = "console-text ok";
    logEl.textContent = "PS C:\\Users\\KP\\SecurityGateway> .\\Release-QuarantinedEmail.ps1 -Recipient 'sales@summitsales.com' -ForceDeliver";
    consoleLogsContainer.appendChild(logEl);
});

btnHardDelete.addEventListener('click', () => {
    executeSecOpsOverride('Permanently Purged', 'CRITICAL', 'var(--color-danger)');
    const logEl = document.createElement('div');
    logEl.className = "console-text err";
    logEl.textContent = "PS C:\\Users\\KP\\SecurityGateway> .\\Remove-ExchangeMessage.ps1 -Subject 'URGENT' -HardDelete";
    consoleLogsContainer.appendChild(logEl);
});

btnWhitelist.addEventListener('click', () => {
    executeSecOpsOverride('Sender Whitelisted', 'SAFE', 'var(--color-safe)');
    const logEl = document.createElement('div');
    logEl.className = "console-text ok";
    logEl.textContent = `PS C:\\Users\\KP\\SecurityGateway> Add-SafeSenderList -Email '${scenarios[activeScenarioId].from}'`;
    consoleLogsContainer.appendChild(logEl);
});

btnDecoy.addEventListener('click', () => {
    executeSecOpsOverride('Decoy Price List Released', 'WARNING', 'var(--color-warning)');
    const logEl = document.createElement('div');
    logEl.className = "console-text warn";
    logEl.textContent = `PS C:\\Users\\KP\\SecurityGateway> .\\Deploy-DecoyPricingCatalog.ps1 -TargetIP '198.51.100.42'`;
    consoleLogsContainer.appendChild(logEl);
});

btnBlockIp.addEventListener('click', () => {
    executeSecOpsOverride('Sender IP Blacklisted', 'CRITICAL', 'var(--color-danger)');
    const logEl = document.createElement('div');
    logEl.className = "console-text err";
    logEl.textContent = "PS C:\\Users\\KP\\SecurityGateway> New-NetFirewallRule -RemoteAddress '203.0.113.111' -Action Block";
    consoleLogsContainer.appendChild(logEl);
});

// Ribbon top commands hooks
const cmdDelete = document.getElementById('cmd-delete');
if (cmdDelete) {
    cmdDelete.addEventListener('click', () => {
        executeSecOpsOverride('Quarantined & Deleted', 'DANGER', 'var(--color-danger)');
    });
}
const cmdJunk = document.getElementById('cmd-junk');
if (cmdJunk) {
    cmdJunk.addEventListener('click', () => {
        executeSecOpsOverride('Junk Classified', 'WARNING', 'var(--color-warning)');
    });
}

// Autoplay Simulation Trigger
const triggerDemoBtn = document.getElementById('trigger-demo-btn');
if (triggerDemoBtn) {
    triggerDemoBtn.addEventListener('click', () => {
        isAutoplayPlaying = true;
        triggerDemoBtn.disabled = true;
        triggerDemoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Autoplay running...';
        
        // Auto-arrange windows for clean viewing
        const winEdge = document.getElementById('win-outlook');
        const winTerm = document.getElementById('win-terminal');
        const winSent = document.getElementById('win-sentinel');
        
        if (winEdge) { winEdge.style.top = "2vh"; winEdge.style.left = "2vw"; winEdge.style.width = "62vw"; winEdge.style.height = "84vh"; bringToFront(winEdge); }
        if (winTerm) { winTerm.style.top = "38vh"; winTerm.style.left = "20vw"; winTerm.style.width = "44vw"; winTerm.style.height = "48vh"; bringToFront(winTerm); }
        if (winSent) { winSent.style.top = "2vh"; winSent.style.left = "65vw"; winSent.style.width = "33vw"; winSent.style.height = "84vh"; bringToFront(winSent); }
        
        const demoSequence = ['scraper', 'spoof', 'invoice', 'extortion', 'authentic'];
        let step = 0;
        
        function playNext() {
            if (!isAutoplayPlaying) return;
            
            if (step < demoSequence.length) {
                selectEmail(demoSequence[step]);
                step++;
                setTimeout(playNext, 7000); // 7 seconds per scenario
            } else {
                isAutoplayPlaying = false;
                triggerDemoBtn.disabled = false;
                triggerDemoBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Autoplay Simulation';
                showToast('Automated simulation demo complete.');
            }
        }
        
        playNext();
    });
}

// Initial Window Initialization
window.addEventListener('DOMContentLoaded', () => {
    initWindowEvents('win-outlook');
    initWindowEvents('win-terminal');
    initWindowEvents('win-sentinel');
    initWindowEvents('win-controller');
    setupTrayAndDesktopIcons();
    
    // Set active depths
    bringToFront(document.getElementById('win-outlook'));
    bringToFront(document.getElementById('win-terminal'));
    bringToFront(document.getElementById('win-sentinel'));
    bringToFront(document.getElementById('win-controller'));
    
    renderInboxList();
    loadScenario('scraper');
});
