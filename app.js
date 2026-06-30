// ERP Distribution - Outlook Portal Core Logic Engine
// Integrates email operations, contacts, commodities tickers, and Backfeed Sales Copilot tools.

// ==========================================
// 1. DATASETS & MOCK DATA
// ==========================================

const lineCardBrands = [
    {
        id: 'titan-wiring',
        name: 'Titan Wiring Devices',
        category: 'titan',
        desc: 'Commercial and residential switches, receptacles, dimmers, and plugs.',
        prepaid: '$1,000 Prepaid',
        prepaidValue: 1000,
        insideRep: 'Specialist A',
        email: 'specialist.a@erpdistribution.com'
    },
    {
        id: 'titan-bline',
        name: 'Titan B-Line',
        category: 'titan',
        desc: 'Metal support strut systems, bolted framing, cable trays, and enclosures.',
        prepaid: '$7,500 Prepaid',
        prepaidValue: 7500,
        insideRep: 'Specialist B',
        email: 'specialist.b@erpdistribution.com'
    },
    {
        id: 'titan-fuses',
        name: 'Titan Edison Fuses',
        category: 'titan',
        desc: 'Circuit fuses, fuse holders, fuse blocks, and overcurrent protectors.',
        prepaid: '$250 Prepaid',
        prepaidValue: 250,
        insideRep: 'Specialist A',
        email: 'specialist.a@erpdistribution.com'
    },
    {
        id: 'liberty-copper',
        name: 'Liberty Copper Cable',
        category: 'wire',
        desc: 'Copper building wire, including THHN, NM-B Romex alternative, and MC Cable.',
        prepaid: '$5,000 Prepaid',
        prepaidValue: 5000,
        insideRep: 'Specialist B',
        email: 'specialist.b@erpdistribution.com'
    },
    {
        id: 'prime-aluminum',
        name: 'Prime Aluminum Cable',
        category: 'wire',
        desc: 'Aluminum feeder wire, building cables, and bulk reels.',
        prepaid: '$5,000 Prepaid',
        prepaidValue: 5000,
        insideRep: 'Specialist B',
        email: 'specialist.b@erpdistribution.com'
    },
    {
        id: 'matrix-fittings',
        name: 'Matrix Fittings',
        category: 'fittings',
        desc: 'EMT/Rigid steel connectors, zinc couplings, wire connectors, and outlet boxes.',
        prepaid: '$1,500 Prepaid',
        prepaidValue: 1500,
        insideRep: 'Specialist A',
        email: 'specialist.a@erpdistribution.com'
    },
    {
        id: 'durapvc-fittings',
        name: 'DuraPVC Fittings',
        category: 'fittings',
        desc: 'Rigid PVC conduit fittings, junctions, utility boxes, and couplings.',
        prepaid: '$3,000 Prepaid',
        prepaidValue: 3000,
        insideRep: 'Specialist A',
        email: 'specialist.a@erpdistribution.com'
    },
    {
        id: 'nova-lighting',
        name: 'Nova LED Lighting',
        category: 'fittings',
        desc: 'High-efficiency industrial LED bays, emergency lights, and controls.',
        prepaid: '$1,500 Prepaid',
        prepaidValue: 1500,
        insideRep: 'Specialist C',
        email: 'specialist.c@erpdistribution.com'
    },
    {
        id: 'aerotherm-heat',
        name: 'AeroTherm Heat Systems',
        category: 'fittings',
        desc: 'Electric wall heaters, unit heaters, baseboards, and controls.',
        prepaid: '$2,500 Prepaid',
        prepaidValue: 2500,
        insideRep: 'Specialist D',
        email: 'specialist.d@erpdistribution.com'
    }
];

const contacts = [
    // Vendors (Manufacturers)
    { id: 'c-titan', name: 'Titan Division Sales Support', email: 'titan.support@titandevices-mock.com', phone: '(800) 555-0199', type: 'vendors', company: 'Titan Electrical Division', address: 'Chicago, IL', brands: 'Titan Wiring, B-Line, Fuses' },
    { id: 'c-liberty', name: 'Liberty Wire Sales Desk', email: 'sales@libertywire-mock.com', phone: '(800) 555-0142', type: 'vendors', company: 'Liberty Copper Cable Corp', address: 'Brooklyn, NY', brands: 'Liberty Copper Cable' },
    { id: 'c-matrix', name: 'Matrix Fittings Orders', email: 'orders@matrixfittings-mock.com', phone: '(866) 555-9080', type: 'vendors', company: 'Matrix Metal Fittings', address: 'Cleveland, OH', brands: 'Matrix Fittings' },
    { id: 'c-durapvc', name: 'DuraPVC Product Support', email: 'support@durapvc-mock.com', phone: '(888) 555-3344', type: 'vendors', company: 'DuraPVC Conduit Systems', address: 'Atlanta, GA', brands: 'DuraPVC Fittings' },
    
    // Customers (Distributors & Contractors)
    { id: 'c-vanguard', name: 'Estimator (Client A)', email: 'estimating@vanguard-contractors-llc.net', phone: '(856) 555-0202', type: 'customers', company: 'Vanguard Contractors LLC', address: 'West Deptford, NJ', brands: 'Electrical Supplies' },
    { id: 'c-apex', name: 'Purchasing (Client B)', email: 'purchasing@apex-distributors.com', phone: '(609) 555-4040', type: 'customers', company: 'Apex Electrical Distributors', address: 'Cherry Hill, NJ', brands: 'Lighting, Wiring Devices' },
    { id: 'c-beacon', name: 'Estimator (Client C)', email: 'estimating@beacon-supply.com', phone: '(215) 555-7788', type: 'customers', company: 'Beacon Electric Supply', address: 'Philadelphia, PA', brands: 'Transformers, Wire' },
    { id: 'c-redwood', name: 'Operations (Client D)', email: 'operations@redwood-electric.com', phone: '(215) 555-3210', type: 'customers', company: 'Redwood Electric', address: 'Conshohocken, PA', brands: 'All Lines' }
];

const erpCustomerAccounts = {
    'm.davis@clientelec.com': {
        customerId: 'CUST-TS-1001',
        company: 'Client Company Solutions (C-1001)',
        creditLimit: 60000.00,
        balanceDue: 18450.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'clientelec.com'
    },
    'c.dominguez@atlanticcoastelec.com': {
        customerId: 'CUST-AC-1007',
        company: 'Atlantic City Electric Svcs (C-1007)',
        creditLimit: 60000.00,
        balanceDue: 58500.00,
        status: 'CREDIT HOLD',
        statusClass: 'danger',
        statusBg: '#fdf2f2',
        statusColor: '#b91c1c',
        authDomain: 'atlanticcoastelec.com'
    },
    'patterson@delawarevalley.com': {
        customerId: 'CUST-DV-1004',
        company: 'Delaware Valley Contractors (C-1004)',
        creditLimit: 80000.00,
        balanceDue: 3500.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'delawarevalley.com'
    },
    'l.morales@keystone-elec.com': {
        customerId: 'CUST-KS-1006',
        company: 'Keystone Electrical Group (C-1006)',
        creditLimit: 75000.00,
        balanceDue: 12450.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'keystone-elec.com'
    },
    'j.miller@gardenstatesolar.com': {
        customerId: 'CUST-GS-1005',
        company: 'Garden State Solar (C-1005)',
        creditLimit: 50000.00,
        balanceDue: 12000.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'gardenstatesolar.com'
    },
    'estimating@vanguard-contractors-llc.net': {
        customerId: 'CUST-VG-992',
        company: 'Vanguard Contractors LLC',
        creditLimit: 50000.00,
        balanceDue: 12450.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'vanguard-contractors-llc.net'
    },
    'purchasing@apex-distributors.com': {
        customerId: 'CUST-AX-341',
        company: 'Apex Electrical Distributors',
        creditLimit: 120000.00,
        balanceDue: 84500.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'apex-distributors.com'
    },
    'estimating@beacon-supply.com': {
        customerId: 'CUST-BC-481',
        company: 'Beacon Electric Supply',
        creditLimit: 75000.00,
        balanceDue: 74200.00,
        status: 'CREDIT WARNING',
        statusClass: 'warning',
        statusBg: '#fffbeb',
        statusColor: '#b45309',
        authDomain: 'beacon-supply.com'
    },
    'operations@redwood-electric.com': {
        customerId: 'CUST-RW-802',
        company: 'Redwood Electric',
        creditLimit: 100000.00,
        balanceDue: 15400.00,
        status: 'ACTIVE',
        statusClass: 'good',
        statusBg: '#e6f4ea',
        statusColor: '#137333',
        authDomain: 'redwood-electric.com'
    },
    'specialist.a@erp-executives.top': {
        customerId: 'UNVERIFIED',
        company: 'UNKNOWN SENDER',
        creditLimit: 0.00,
        balanceDue: 0.00,
        status: 'SUSPENDED',
        statusClass: 'danger',
        statusBg: '#fdf2f2',
        statusColor: '#b91c1c',
        authDomain: 'erpdistribution.com'
    },
    'specialist.d@erp-executives.top': {
        customerId: 'UNVERIFIED',
        company: 'UNKNOWN SENDER',
        creditLimit: 0.00,
        balanceDue: 0.00,
        status: 'SUSPENDED',
        statusClass: 'danger',
        statusBg: '#fdf2f2',
        statusColor: '#b91c1c',
        authDomain: 'erpdistribution.com'
    }
};

const customerOrdersDatabase = {
    'CUST-VG-992': [
        { orderId: 'SO-99231', date: 'Jun 8, 2026', items: '120 pcs Nova LED High Bays', price: 9780.00, status: 'Processing' },
        { orderId: 'SO-99214', date: 'Jun 5, 2026', items: '800 ft Liberty Copper Cable THHN 4/0', price: 3840.00, status: 'Shipped' },
        { orderId: 'SO-99180', date: 'May 28, 2026', items: '500 pcs Matrix Fittings EMT 1/2"', price: 1750.00, status: 'Delivered' }
    ],
    'CUST-AX-341': [
        { orderId: 'SO-98912', date: 'Jun 3, 2026', items: '3,000 ft Prime Aluminum 4/0 AWG', price: 12500.00, status: 'Shipped' },
        { orderId: 'SO-98750', date: 'May 15, 2026', items: '4,500 pcs Commercial Switches', price: 15750.00, status: 'Delivered' }
    ],
    'CUST-BC-481': [
        { orderId: 'SO-99105', date: 'Jun 1, 2026', items: '240 pcs Titan B-Line Steel Strut 10ft', price: 1728.00, status: 'Hold' }
    ],
    'CUST-RW-802': [
        { orderId: 'SO-99222', date: 'Jun 7, 2026', items: '4-Legs Liberty Copper 4/0 (600ft)', price: 2880.00, status: 'Processing' }
    ]
};

let lastOrderId = 99231;

// ─────────────────────────────────────────────
// BACKFEED MEMORY LEDGER — Persistent Transaction Memory
// ─────────────────────────────────────────────
let backfeedMemoryLedger = [];

const scenarioMemoryData = {
    'happy-path': {
        scenarioId: 1, scenarioName: 'RFQ to Sales Order (Happy Path)',
        orderNumber: 'SO-99401', customerName: 'Vanguard Contractors LLC',
        customerAccount: 'CUST-VG-992', jobName: 'Deptford Storage Yard Expansion',
        jobNumber: 'JOB-VG-DPT-2026', decisionType: 'Approved + Freight Consolidated',
        statusClass: 'approved', freightMethod: 'Flatbed Truck #03 Consolidation',
        creditStatus: 'Approved ($37,550 available)',
        skus: [
            { sku: 'CON-STRUT', desc: 'Titan B-Line Strut Channel 14G 10ft', qty: 120, unitPrice: 7.20 },
            { sku: 'WIR-THHN40', desc: 'Liberty Copper THHN 4/0 AWG', qty: 800, unitPrice: 4.80 },
            { sku: 'MAT-FIT-201', desc: 'Matrix Fittings EMT Connector 1/2"', qty: 500, unitPrice: 1.85 },
            { sku: 'DEV-GFCI', desc: 'GFCI SmartGuard Receptacle 20A', qty: 25, unitPrice: 12.50 },
            { sku: 'CBL-MC122', desc: 'MC Cable 12/2 w/ Ground 250ft', qty: 4, unitPrice: 165.00 }
        ]
    },
    'security-path': {
        scenarioId: 2, scenarioName: 'Security Gate Audit (Phishing Block)',
        orderNumber: '—', customerName: 'BLOCKED SENDER',
        customerAccount: 'UNVERIFIED', jobName: 'Executive Wire Fraud Attempt',
        jobNumber: 'SEC-QUARANTINE-042', decisionType: 'Quarantined & Blocked',
        statusClass: 'blocked', freightMethod: 'N/A',
        creditStatus: 'Suspended — Phishing Detected',
        skus: [
            { sku: 'THREAT-EXE', desc: 'Malicious payload (.pdf.exe) — DETACHED', qty: 1, unitPrice: 0 }
        ]
    },
    'credit-path': {
        scenarioId: 3, scenarioName: 'Credit Risk Audit (Credit Hold)',
        orderNumber: 'SO-99402', customerName: 'Beacon Electric Supply',
        customerAccount: 'CUST-BC-481', jobName: 'HS Gymnasium LED Refit',
        jobNumber: 'JOB-BC-GYM-2026', decisionType: 'Credit Hold + 50% Deposit Required',
        statusClass: 'hold', freightMethod: 'Standard — Pending Release',
        creditStatus: 'HOLD ($74,200 / $75,000 limit)',
        skus: [
            { sku: 'LTG-HBAY', desc: 'Nova LED High Bay 150W', qty: 120, unitPrice: 115.00 },
            { sku: 'BKR-20A', desc: '20A Single Pole Circuit Breaker', qty: 50, unitPrice: 8.92 },
            { sku: 'LTG-EXIT', desc: 'LED Emergency Exit Sign Red', qty: 15, unitPrice: 38.50 },
            { sku: 'WP-1G', desc: '1-Gang Plastic Wallplate White', qty: 100, unitPrice: 0.45 }
        ]
    },
    'pricing-path': {
        scenarioId: 4, scenarioName: 'Surcharge Bulletin Audit (Price Update)',
        orderNumber: 'SO-99403', customerName: 'Apex Electrical Distributors',
        customerAccount: 'CUST-AX-341', jobName: 'Cherry Hill Commercial Feeder',
        jobNumber: 'JOB-AX-CHR-2026', decisionType: 'Repriced w/ Vendor Surcharge',
        statusClass: 'repriced', freightMethod: 'Prepaid Freight Qualified',
        creditStatus: 'Approved ($35,500 available)',
        skus: [
            { sku: 'PRM-AL-40FEED', desc: 'Prime Aluminum 4/0 AWG Feeder 1000ft', qty: 3, unitPrice: 2100.00 },
            { sku: 'AER-THE-120', desc: 'AeroTherm Unit Heater 5kW', qty: 4, unitPrice: 245.00 },
            { sku: 'PNL-100A', desc: '100A Main Lug Subpanel 12-Spc', qty: 2, unitPrice: 142.50 },
            { sku: 'BKR-30A', desc: '30A Double Pole Breaker', qty: 6, unitPrice: 14.98 }
        ]
    },
    'intercept-path': {
        scenarioId: 5, scenarioName: 'Line-Card Competitor Intercept',
        orderNumber: 'SO-99404', customerName: 'Client Company Solutions',
        customerAccount: 'CUST-TS-1001', jobName: 'Warehouse Build-Out',
        jobNumber: 'JOB-TS-WHS-2026', decisionType: 'Steered to Commission Line',
        statusClass: 'intercepted', freightMethod: 'Standard Distributor Ship',
        creditStatus: 'Approved ($41,550 available)',
        skus: [
            { sku: 'BKR-20A', desc: 'Titan 20A Breaker (replaces Quadra Q120)', qty: 150, unitPrice: 8.92 },
            { sku: 'CON-EMT34', desc: 'Matrix EMT 3/4" Conduit 10ft (replaces Union)', qty: 100, unitPrice: 12.50 }
        ]
    },
    'arbitrage-path': {
        scenarioId: 6, scenarioName: 'Retail Arbitrage Scan (Emergency)',
        orderNumber: 'SO-99405', customerName: 'Redwood Electric',
        customerAccount: 'CUST-RW-802', jobName: 'Summit Valley WTP Emergency',
        jobNumber: 'JOB-RW-WTP-2026', decisionType: 'Emergency Courier Staged',
        statusClass: 'emergency', freightMethod: 'Hot-Shot Courier (Runnemede → WTP)',
        creditStatus: 'Approved ($84,600 available)',
        skus: [
            { sku: 'AER-THE-120', desc: 'AeroTherm Unit Heater 5kW', qty: 4, unitPrice: 245.00 },
            { sku: 'PNL-100A', desc: '100A Main Lug Subpanel 12-Spc', qty: 2, unitPrice: 142.50 }
        ]
    },
    'sizing-path': {
        scenarioId: 7, scenarioName: 'NEC Conductor Sizing Sandbox',
        orderNumber: 'SO-99406', customerName: 'Apex Electrical Distributors',
        customerAccount: 'CUST-AX-341', jobName: 'Deptford Storage Feeder Run',
        jobNumber: 'JOB-AX-DPT-2026', decisionType: 'Aluminum Substitute Proposed',
        statusClass: 'approved', freightMethod: 'Standard Ship (360 lbs)',
        creditStatus: 'Approved ($35,500 available)',
        skus: [
            { sku: 'WIR-XHHW40', desc: 'Prime Aluminum 4/0 AWG Feeder (NEC Alt)', qty: 800, unitPrice: 2.10 }
        ]
    },
    'weg-path': {
        scenarioId: 8, scenarioName: 'Industrial Motor RFQ Intercept',
        orderNumber: 'SO-99407', customerName: 'Crown Food Processing',
        customerAccount: 'NEW-PROSPECT', jobName: 'Applegate Plant Flaker Line',
        jobNumber: 'JOB-CF-APL-2026', decisionType: 'Drop-in Motor Mapped',
        statusClass: 'intercepted', freightMethod: 'Same-Day Shipment',
        creditStatus: 'New Prospect — Routed to Credit Desk',
        skus: [
            { sku: 'MOT-APX-20HP', desc: 'Apex Motors 20HP Industrial (alt for VEG)', qty: 1, unitPrice: 1450.00 }
        ]
    },
    'mersen-path': {
        scenarioId: 9, scenarioName: 'Min-Order Threshold Resolution',
        orderNumber: 'SO-99408', customerName: 'National Rail Service',
        customerAccount: 'NEW-PROSPECT', jobName: 'C+S Transfer Switches',
        jobNumber: 'JOB-NR-CSS-2026', decisionType: 'Threshold Padded to $150',
        statusClass: 'approved', freightMethod: 'Factory Direct (6-10 week lead)',
        creditStatus: 'New Prospect — Routed to Credit Desk',
        skus: [
            { sku: 'PDB-MER-FSPDB3', desc: 'Meridian Power Distribution Block', qty: 8, unitPrice: 16.36 },
            { sku: 'ACC-MER-ANCHOR', desc: 'Meridian Anchors (threshold pad)', qty: 8, unitPrice: 2.50 }
        ]
    },
    'duraline-path': {
        scenarioId: 10, scenarioName: 'High-Stakes Conduit Status Check',
        orderNumber: 'SO-99409', customerName: 'National Rail Service',
        customerAccount: 'NEW-PROSPECT', jobName: 'NE Substation HDPE Install',
        jobNumber: 'JOB-NR-SUB-2026', decisionType: 'Status Confirmed',
        statusClass: 'confirmed', freightMethod: 'Factory Ship — On Schedule',
        creditStatus: 'Existing Order — Status Check Only',
        skus: [
            { sku: 'CON-HDPE-4', desc: '4" Duraflow SDR11 HDPE Conduit', qty: 1, unitPrice: 0 }
        ]
    },
    'storm-path': {
        scenarioId: 11, scenarioName: 'Emergency Storm Grid Restoration',
        orderNumber: 'SO-99410', customerName: 'Mid-Atlantic Power',
        customerAccount: 'NEW-PROSPECT', jobName: 'Mercy General Hospital Grid',
        jobNumber: 'JOB-MA-MCY-2026', decisionType: 'Allocation Override + Hot-Shot',
        statusClass: 'emergency', freightMethod: 'Hot-Shot Express Courier',
        creditStatus: 'Emergency Override — Released',
        skus: [
            { sku: 'WIR-XHHW6', desc: 'XHHW-2 6 AWG Stranded Copper', qty: 1500, unitPrice: 1.44 }
        ]
    },
    'bid-path': {
        scenarioId: 12, scenarioName: 'Bid Deadline & Credit Escalation',
        orderNumber: 'SO-99411', customerName: 'Keystone Electric',
        customerAccount: 'NEW-PROSPECT', jobName: 'City Transit Authority Substation',
        jobNumber: 'JOB-KE-CTA-2026', decisionType: 'Credit Escalated + Price Lock',
        statusClass: 'hold', freightMethod: 'Prepaid Freight — Next Day',
        creditStatus: 'Escalated to Credit Manager ($12k over limit)',
        skus: [
            { sku: 'PNL-200A', desc: 'Titan 200A Main Breaker Panel 42-Spc', qty: 50, unitPrice: 172.84 },
            { sku: 'BKR-GFCI', desc: 'Titan 20A GFCI Protection Breaker', qty: 200, unitPrice: 32.40 }
        ]
    }
};

const mockInventory = [
    // â•â•â• TITAN WIRING DEVICES â•â•â•
    { sku: 'TITAN-WD-101', desc: 'Commercial Single Pole Switch 20A 120V', brand: 'Titan Wiring Devices', qty: 4500, bin: 'A-12-04', leadTime: 'Stock' },
    { sku: 'TITAN-WD-102', desc: 'Decora 3-Way Switch 15A 120/277V White', brand: 'Titan Wiring Devices', qty: 3200, bin: 'A-12-06', leadTime: 'Stock' },
    { sku: 'TITAN-WD-103', desc: 'Decora 4-Way Switch 15A 120/277V Ivory', brand: 'Titan Wiring Devices', qty: 1100, bin: 'A-12-07', leadTime: 'Stock' },
    { sku: 'TITAN-WD-110', desc: 'Toggle Switch 20A 277V Industrial Brown', brand: 'Titan Wiring Devices', qty: 2800, bin: 'A-12-09', leadTime: 'Stock' },
    { sku: 'TITAN-WD-205', desc: 'Duplex Receptacle 20A 125V Commercial Ivory', brand: 'Titan Wiring Devices', qty: 6800, bin: 'A-13-01', leadTime: 'Stock' },
    { sku: 'TITAN-WD-206', desc: 'Duplex Receptacle 15A 125V Residential White', brand: 'Titan Wiring Devices', qty: 9400, bin: 'A-13-02', leadTime: 'Stock' },
    { sku: 'DEV-GFCI', desc: 'GFCI SmartGuard Receptacle 20A White', brand: 'Titan Wiring Devices', qty: 1250, bin: 'A-13-05', leadTime: 'Stock' },
    { sku: 'TITAN-WD-GF15', desc: 'GFCI Receptacle 15A 125V Self-Test Ivory', brand: 'Titan Wiring Devices', qty: 980, bin: 'A-13-06', leadTime: 'Stock' },
    { sku: 'TITAN-WD-USB1', desc: 'USB Charger Receptacle 20A Type A/C White', brand: 'Titan Wiring Devices', qty: 650, bin: 'A-13-08', leadTime: 'Stock' },
    { sku: 'TITAN-WD-DIM1', desc: 'Slide Dimmer 600W Single Pole White', brand: 'Titan Wiring Devices', qty: 1400, bin: 'A-14-01', leadTime: 'Stock' },
    { sku: 'TITAN-WD-WP1', desc: 'Weatherproof Cover 1-Gang Duplex Gray', brand: 'Titan Wiring Devices', qty: 3600, bin: 'A-14-04', leadTime: 'Stock' },
    { sku: 'TITAN-WD-WP2', desc: 'In-Use Cover 2-Gang GFCI Clear', brand: 'Titan Wiring Devices', qty: 2200, bin: 'A-14-05', leadTime: 'Stock' },
    { sku: 'TITAN-WD-PLT1', desc: 'Wall Plate 1-Gang Decora White (10-Pack)', brand: 'Titan Wiring Devices', qty: 4200, bin: 'A-15-01', leadTime: 'Stock' },
    { sku: 'TITAN-WD-PLT2', desc: 'Wall Plate 2-Gang Toggle Ivory (10-Pack)', brand: 'Titan Wiring Devices', qty: 2800, bin: 'A-15-02', leadTime: 'Stock' },
    // â•â•â• TITAN B-LINE â•â•â•
    { sku: 'TITAN-BL-300', desc: '14-Gauge Galv Steel Strut Channel 10ft', brand: 'Titan B-Line', qty: 240, bin: 'B-04-12', leadTime: '3 Days' },
    { sku: 'CON-STRUT', desc: 'Titan B-Line Strut Channel 10ft 12-Gauge', brand: 'Titan B-Line', qty: 180, bin: 'B-04-14', leadTime: '3 Days' },
    { sku: 'TITAN-BL-310', desc: 'Strut Channel 10ft 14-Gauge Slotted Galv', brand: 'Titan B-Line', qty: 320, bin: 'B-04-16', leadTime: '3 Days' },
    { sku: 'TITAN-BL-320', desc: 'Strut Channel 20ft 12-Gauge Back-to-Back', brand: 'Titan B-Line', qty: 60, bin: 'B-05-01', leadTime: '5 Days' },
    { sku: 'TITAN-BL-405', desc: 'Cable Tray Ladder 12"W x 24ft Galv', brand: 'Titan B-Line', qty: 44, bin: 'B-06-01', leadTime: '5 Days' },
    { sku: 'TITAN-BL-410', desc: 'Cable Tray Ladder 18"W x 24ft Galv', brand: 'Titan B-Line', qty: 28, bin: 'B-06-03', leadTime: '5 Days' },
    { sku: 'TITAN-BL-SB1', desc: 'Spring Nut 3/8-16 for Strut Channel', brand: 'Titan B-Line', qty: 15000, bin: 'B-08-02', leadTime: 'Stock' },
    { sku: 'TITAN-BL-SB2', desc: 'Strut Strap 1" 2-Hole Galvanized', brand: 'Titan B-Line', qty: 8500, bin: 'B-08-04', leadTime: 'Stock' },
    { sku: 'TITAN-BL-CL1', desc: 'Beam Clamp 3/8" for Strut and Rod', brand: 'Titan B-Line', qty: 4200, bin: 'B-08-06', leadTime: 'Stock' },
    { sku: 'TITAN-BL-TB1', desc: 'Threaded Rod 3/8-16 x 10ft Galv', brand: 'Titan B-Line', qty: 600, bin: 'B-09-01', leadTime: 'Stock' },
    { sku: 'TITAN-BL-TB2', desc: 'Threaded Rod 1/2-13 x 10ft Galv', brand: 'Titan B-Line', qty: 440, bin: 'B-09-02', leadTime: 'Stock' },
    { sku: 'TITAN-BL-UB1', desc: 'U-Bolt 2" Pipe Galvanized', brand: 'Titan B-Line', qty: 3200, bin: 'B-09-05', leadTime: 'Stock' },
    // â•â•â• TITAN EDISON FUSES â•â•â•
    { sku: 'TITAN-EF-15', desc: 'Edison Fuse 15A 250V Class RK5', brand: 'Titan Edison Fuses', qty: 3600, bin: 'A-20-01', leadTime: 'Stock' },
    { sku: 'TITAN-EF-20', desc: 'Edison Fuse 20A 250V Class RK5', brand: 'Titan Edison Fuses', qty: 3100, bin: 'A-20-02', leadTime: 'Stock' },
    { sku: 'TITAN-EF-30', desc: 'Edison Fuse 30A 250V Class RK5', brand: 'Titan Edison Fuses', qty: 2400, bin: 'A-20-03', leadTime: 'Stock' },
    { sku: 'TITAN-EF-60', desc: 'Edison Fuse 60A 600V Class J Time Delay', brand: 'Titan Edison Fuses', qty: 800, bin: 'A-20-05', leadTime: 'Stock' },
    { sku: 'TITAN-EF-100', desc: 'Edison Fuse 100A 600V Class J', brand: 'Titan Edison Fuses', qty: 340, bin: 'A-20-07', leadTime: 'Stock' },
    { sku: 'TITAN-EF-200', desc: 'Edison Fuse 200A 600V Class L', brand: 'Titan Edison Fuses', qty: 80, bin: 'A-20-09', leadTime: '3 Days' },
    { sku: 'TITAN-EF-FH30', desc: 'Fuse Holder 30A 600V 3-Pole', brand: 'Titan Edison Fuses', qty: 260, bin: 'A-21-01', leadTime: 'Stock' },
    { sku: 'TITAN-EF-FH60', desc: 'Fuse Holder 60A 600V 3-Pole', brand: 'Titan Edison Fuses', qty: 140, bin: 'A-21-03', leadTime: 'Stock' },
    // â•â•â• TITAN TRANSFORMERS â•â•â•
    { sku: 'TITAN-XFMR-BB', desc: 'Buck-Boost Transformer 1kVA 120/240V', brand: 'Titan Transformers', qty: 22, bin: 'F-01-01', leadTime: '1 Week' },
    { sku: 'TITAN-XFMR-3', desc: 'Dry-Type Transformer 3kVA 240/120V', brand: 'Titan Transformers', qty: 14, bin: 'F-01-02', leadTime: '1 Week' },
    { sku: 'TITAN-XFMR-15', desc: 'Dry-Type Transformer 15kVA 480/208Y', brand: 'Titan Transformers', qty: 6, bin: 'F-01-04', leadTime: '2 Weeks' },
    { sku: 'TITAN-XFMR-25', desc: 'Dry-Type Transformer 25kVA 480/208Y', brand: 'Titan Transformers', qty: 4, bin: 'F-01-05', leadTime: '2 Weeks' },
    { sku: 'TITAN-XFMR-45', desc: 'Dry-Type Transformer 45kVA 480/208Y', brand: 'Titan Transformers', qty: 2, bin: 'F-01-06', leadTime: '4 Weeks' },
    { sku: 'TITAN-XFMR-75', desc: 'Dry-Type Transformer 75kVA 480/208Y', brand: 'Titan Transformers', qty: 1, bin: 'F-01-08', leadTime: '6 Weeks' },
    // â•â•â• LIBERTY COPPER CABLE â•â•â•
    { sku: 'LIB-CU-14THHN', desc: 'THHN 14 AWG Solid Copper 2500ft Reel', brand: 'Liberty Copper Cable', qty: 42, bin: 'C-07-01', leadTime: 'Stock' },
    { sku: 'LIB-CU-12THHN', desc: 'THHN 12 AWG Solid Copper Wire 500ft Coil', brand: 'Liberty Copper Cable', qty: 85, bin: 'C-08-01', leadTime: 'Stock' },
    { sku: 'WIR-THHN12', desc: 'THHN 12 AWG Copper Black 2500ft Reel', brand: 'Liberty Copper Cable', qty: 32, bin: 'C-08-03', leadTime: 'Stock' },
    { sku: 'WIR-THHN12-R', desc: 'THHN 12 AWG Copper Red 2500ft Reel', brand: 'Liberty Copper Cable', qty: 28, bin: 'C-08-04', leadTime: 'Stock' },
    { sku: 'WIR-THHN12-G', desc: 'THHN 12 AWG Copper Green 2500ft Reel', brand: 'Liberty Copper Cable', qty: 24, bin: 'C-08-05', leadTime: 'Stock' },
    { sku: 'WIR-THHN10', desc: 'THHN 10 AWG Copper Black 2500ft Reel', brand: 'Liberty Copper Cable', qty: 28, bin: 'C-08-07', leadTime: 'Stock' },
    { sku: 'WIR-THHN10-R', desc: 'THHN 10 AWG Copper Red 2500ft Reel', brand: 'Liberty Copper Cable', qty: 22, bin: 'C-08-08', leadTime: 'Stock' },
    { sku: 'WIR-THHN8', desc: 'THHN 8 AWG Stranded Copper Black 1000ft', brand: 'Liberty Copper Cable', qty: 18, bin: 'C-08-10', leadTime: 'Stock' },
    { sku: 'LIB-CU-60THHN', desc: 'THHN 6 AWG Stranded Copper Green 1000ft', brand: 'Liberty Copper Cable', qty: 14, bin: 'C-09-01', leadTime: '3 Days' },
    { sku: 'LIB-CU-4THHN', desc: 'THHN 4 AWG Stranded Copper Black 500ft', brand: 'Liberty Copper Cable', qty: 10, bin: 'C-09-03', leadTime: '3 Days' },
    { sku: 'LIB-CU-2THHN', desc: 'THHN 2 AWG Stranded Copper Black 500ft', brand: 'Liberty Copper Cable', qty: 12, bin: 'C-09-04', leadTime: '3 Days' },
    { sku: 'LIB-CU-10THHN', desc: 'THHN 1/0 AWG Stranded Copper 500ft', brand: 'Liberty Copper Cable', qty: 8, bin: 'C-09-05', leadTime: '5 Days' },
    { sku: 'LIB-CU-40THHN', desc: 'THHN 4/0 AWG Stranded Copper 500ft', brand: 'Liberty Copper Cable', qty: 8, bin: 'C-09-06', leadTime: '5 Days' },
    { sku: 'CBL-MC122', desc: 'MC Cable 12/2 w/ Ground 250ft Coil', brand: 'Liberty Copper Cable', qty: 145, bin: 'C-10-02', leadTime: 'Stock' },
    { sku: 'CBL-MC123', desc: 'MC Cable 12/3 w/ Ground 250ft Coil', brand: 'Liberty Copper Cable', qty: 88, bin: 'C-10-03', leadTime: 'Stock' },
    { sku: 'CBL-MC102', desc: 'MC Cable 10/2 w/ Ground 250ft Coil', brand: 'Liberty Copper Cable', qty: 62, bin: 'C-10-05', leadTime: 'Stock' },
    { sku: 'CBL-NM122', desc: 'NM-B Romex 12/2 w/ Ground 250ft Box', brand: 'Liberty Copper Cable', qty: 200, bin: 'C-11-01', leadTime: 'Stock' },
    { sku: 'CBL-NM142', desc: 'NM-B Romex 14/2 w/ Ground 250ft Box', brand: 'Liberty Copper Cable', qty: 280, bin: 'C-11-03', leadTime: 'Stock' },
    { sku: 'CBL-SER44', desc: 'SER Cable 4/4 Aluminum 500ft', brand: 'Liberty Copper Cable', qty: 6, bin: 'C-12-01', leadTime: '1 Week' },
    // â•â•â• PRIME ALUMINUM CABLE â•â•â•
    { sku: 'PRM-AL-60XHHW', desc: '6 AWG Aluminum XHHW-2 500ft', brand: 'Prime Aluminum Cable', qty: 18, bin: 'C-15-01', leadTime: '3 Days' },
    { sku: 'PRM-AL-20XHHW', desc: '2/0 AWG Aluminum XHHW-2 500ft', brand: 'Prime Aluminum Cable', qty: 10, bin: 'C-15-03', leadTime: '5 Days' },
    { sku: 'PRM-AL-40FEED', desc: '4/0 Aluminum Feeder Cable 1000ft Reel', brand: 'Prime Aluminum Cable', qty: 12, bin: 'C-15-04', leadTime: '5 Days' },
    { sku: 'PRM-AL-250MC', desc: '250 MCM Aluminum XHHW-2 500ft', brand: 'Prime Aluminum Cable', qty: 8, bin: 'C-15-06', leadTime: '1 Week' },
    { sku: 'PRM-AL-350MC', desc: '350 MCM Aluminum XHHW-2 500ft', brand: 'Prime Aluminum Cable', qty: 6, bin: 'C-15-08', leadTime: '1 Week' },
    { sku: 'PRM-AL-500MC', desc: '500 MCM Aluminum XHHW-2 500ft', brand: 'Prime Aluminum Cable', qty: 4, bin: 'C-15-10', leadTime: '2 Weeks' },
    // â•â•â• MATRIX FITTINGS â•â•â•
    { sku: 'CON-EMT12', desc: '1/2" EMT Conduit 10ft Stick Galvanized', brand: 'Matrix Fittings', qty: 4800, bin: 'D-01-01', leadTime: 'Stock' },
    { sku: 'CON-EMT34', desc: '3/4" EMT Conduit 10ft Stick Galvanized', brand: 'Matrix Fittings', qty: 3200, bin: 'D-01-03', leadTime: 'Stock' },
    { sku: 'CON-EMT10', desc: '1" EMT Conduit 10ft Stick Galvanized', brand: 'Matrix Fittings', qty: 1800, bin: 'D-01-05', leadTime: 'Stock' },
    { sku: 'CON-EMT114', desc: '1-1/4" EMT Conduit 10ft Galvanized', brand: 'Matrix Fittings', qty: 600, bin: 'D-01-07', leadTime: 'Stock' },
    { sku: 'CON-EMT112', desc: '1-1/2" EMT Conduit 10ft Galvanized', brand: 'Matrix Fittings', qty: 420, bin: 'D-01-08', leadTime: 'Stock' },
    { sku: 'CON-EMT20', desc: '2" EMT Conduit 10ft Galvanized', brand: 'Matrix Fittings', qty: 340, bin: 'D-01-09', leadTime: '3 Days' },
    { sku: 'CON-RGD34', desc: '3/4" Rigid Steel Conduit 10ft Galvanized', brand: 'Matrix Fittings', qty: 280, bin: 'D-01-12', leadTime: 'Stock' },
    { sku: 'CON-RGD10', desc: '1" Rigid Steel Conduit 10ft Galvanized', brand: 'Matrix Fittings', qty: 200, bin: 'D-01-14', leadTime: 'Stock' },
    { sku: 'MAT-FIT-201', desc: '1/2" EMT Compression Connector Zinc', brand: 'Matrix Fittings', qty: 12500, bin: 'D-02-10', leadTime: 'Stock' },
    { sku: 'MAT-FIT-202', desc: '1/2" EMT Compression Coupling Zinc', brand: 'Matrix Fittings', qty: 10200, bin: 'D-02-11', leadTime: 'Stock' },
    { sku: 'FIT-EMTC', desc: 'EMT Compression Connector 3/4" Zinc', brand: 'Matrix Fittings', qty: 9500, bin: 'D-02-12', leadTime: 'Stock' },
    { sku: 'FIT-EMTS', desc: 'EMT Set Screw Coupling 3/4" Zinc', brand: 'Matrix Fittings', qty: 8200, bin: 'D-02-14', leadTime: 'Stock' },
    { sku: 'MAT-FIT-110', desc: '1" EMT Compression Connector Zinc', brand: 'Matrix Fittings', qty: 6400, bin: 'D-02-16', leadTime: 'Stock' },
    { sku: 'MAT-FIT-LB12', desc: '1/2" EMT Set Screw LB Conduit Body', brand: 'Matrix Fittings', qty: 1800, bin: 'D-03-01', leadTime: 'Stock' },
    { sku: 'MAT-FIT-LB34', desc: '3/4" EMT Set Screw LB Conduit Body', brand: 'Matrix Fittings', qty: 1400, bin: 'D-03-02', leadTime: 'Stock' },
    { sku: 'BOX-4SQR', desc: '4" Square Box 1-1/2" Deep Galv Steel', brand: 'Matrix Fittings', qty: 4100, bin: 'D-05-02', leadTime: 'Stock' },
    { sku: 'BOX-4SQR-D', desc: '4" Square Box 2-1/8" Deep Galv Steel', brand: 'Matrix Fittings', qty: 3400, bin: 'D-05-03', leadTime: 'Stock' },
    { sku: 'BOX-4OCT', desc: '4" Octagon Box 1-1/2" Deep', brand: 'Matrix Fittings', qty: 2600, bin: 'D-05-06', leadTime: 'Stock' },
    { sku: 'BOX-1GNG', desc: '1-Gang Device Box 3"x2" Galv', brand: 'Matrix Fittings', qty: 5500, bin: 'D-05-08', leadTime: 'Stock' },
    { sku: 'BOX-MRING', desc: '4" Square Mud Ring 1/2" Raised', brand: 'Matrix Fittings', qty: 4800, bin: 'D-05-10', leadTime: 'Stock' },
    { sku: 'ACC-WNUT', desc: 'Wire Connectors Yellow Box/100', brand: 'Matrix Fittings', qty: 620, bin: 'D-06-01', leadTime: 'Stock' },
    { sku: 'ACC-WNUT-R', desc: 'Wire Connectors Red Box/100', brand: 'Matrix Fittings', qty: 840, bin: 'D-06-02', leadTime: 'Stock' },
    { sku: 'ACC-WNUT-T', desc: 'Wire Connectors Tan Box/100 (Large)', brand: 'Matrix Fittings', qty: 480, bin: 'D-06-03', leadTime: 'Stock' },
    { sku: 'ACC-GRND-GR', desc: 'Green Grounding Connector Box/100', brand: 'Matrix Fittings', qty: 550, bin: 'D-06-05', leadTime: 'Stock' },
    { sku: 'MAT-CLIP-MC', desc: 'MC/BX Cable Snap-In Connector 3/8"', brand: 'Matrix Fittings', qty: 7200, bin: 'D-07-01', leadTime: 'Stock' },
    { sku: 'MAT-CLIP-NM', desc: 'NM Cable Connector 1/2" Snap-In', brand: 'Matrix Fittings', qty: 5400, bin: 'D-07-03', leadTime: 'Stock' },
    // â•â•â• DURAPVC FITTINGS â•â•â•
    { sku: 'CON-PVC12', desc: 'Schedule 40 PVC Conduit 1/2" x 10ft', brand: 'DuraPVC Fittings', qty: 2800, bin: 'D-11-01', leadTime: 'Stock' },
    { sku: 'CON-PVC34', desc: 'Schedule 40 PVC Conduit 3/4" x 10ft', brand: 'DuraPVC Fittings', qty: 2200, bin: 'D-11-02', leadTime: 'Stock' },
    { sku: 'CON-PVC10', desc: 'Schedule 40 PVC Conduit 1" x 10ft', brand: 'DuraPVC Fittings', qty: 1800, bin: 'D-11-03', leadTime: 'Stock' },
    { sku: 'CON-PVC20', desc: 'Schedule 40 PVC Conduit 2" x 10ft', brand: 'DuraPVC Fittings', qty: 1600, bin: 'D-11-05', leadTime: 'Stock' },
    { sku: 'DUR-PVC-505', desc: 'Schedule 40 PVC Coupling 2"', brand: 'DuraPVC Fittings', qty: 8400, bin: 'D-12-01', leadTime: 'Stock' },
    { sku: 'FIT-PVCC', desc: 'PVC Male Adapter 1" Schedule 40', brand: 'DuraPVC Fittings', qty: 5800, bin: 'D-12-02', leadTime: 'Stock' },
    { sku: 'DUR-PVC-MA12', desc: 'PVC Male Adapter 1/2" Schedule 40', brand: 'DuraPVC Fittings', qty: 6200, bin: 'D-12-03', leadTime: 'Stock' },
    { sku: 'DUR-PVC-FA34', desc: 'PVC Female Adapter 3/4" Schedule 40', brand: 'DuraPVC Fittings', qty: 3800, bin: 'D-12-04', leadTime: 'Stock' },
    { sku: 'DUR-PVC-LB1', desc: 'PVC Type LB Conduit Body 1" with Cover', brand: 'DuraPVC Fittings', qty: 680, bin: 'D-12-05', leadTime: 'Stock' },
    { sku: 'DUR-PVC-LB2', desc: 'PVC Type LB Conduit Body 2" with Cover', brand: 'DuraPVC Fittings', qty: 440, bin: 'D-12-06', leadTime: 'Stock' },
    { sku: 'DUR-PVC-ELB34', desc: 'PVC 90 Degree Elbow 3/4" Schedule 40', brand: 'DuraPVC Fittings', qty: 4600, bin: 'D-13-01', leadTime: 'Stock' },
    { sku: 'DUR-PVC-ELB10', desc: 'PVC 90 Degree Elbow 1" Schedule 40', brand: 'DuraPVC Fittings', qty: 3200, bin: 'D-13-02', leadTime: 'Stock' },
    { sku: 'DUR-PVC-GLUE', desc: 'PVC Cement 1 Quart Heavy Duty Clear', brand: 'DuraPVC Fittings', qty: 320, bin: 'D-14-01', leadTime: 'Stock' },
    // â•â•â• NOVA LED LIGHTING â•â•â•
    { sku: 'NOV-LED-HI5', desc: 'Industrial High Bay LED 150W 5000K', brand: 'Nova LED Lighting', qty: 65, bin: 'E-03-02', leadTime: '1 Week' },
    { sku: 'LTG-HBAY', desc: 'Nova LED High Bay 200W 5000K UFO', brand: 'Nova LED Lighting', qty: 38, bin: 'E-03-05', leadTime: '1 Week' },
    { sku: 'NOV-LED-HI3', desc: 'Industrial High Bay LED 100W 4000K', brand: 'Nova LED Lighting', qty: 80, bin: 'E-03-06', leadTime: '1 Week' },
    { sku: 'NOV-LED-FP4', desc: 'LED Flat Panel 2x4 50W 4000K Edge-Lit', brand: 'Nova LED Lighting', qty: 120, bin: 'E-04-01', leadTime: 'Stock' },
    { sku: 'NOV-LED-FP2', desc: 'LED Flat Panel 2x2 40W 4000K Edge-Lit', brand: 'Nova LED Lighting', qty: 95, bin: 'E-04-02', leadTime: 'Stock' },
    { sku: 'NOV-LED-TRF4', desc: 'LED Troffer Retrofit Kit 2x4 40W', brand: 'Nova LED Lighting', qty: 140, bin: 'E-04-04', leadTime: 'Stock' },
    { sku: 'NOV-LED-WP1', desc: 'LED Wall Pack 30W 5000K Full Cutoff', brand: 'Nova LED Lighting', qty: 55, bin: 'E-05-01', leadTime: 'Stock' },
    { sku: 'NOV-LED-WP2', desc: 'LED Wall Pack 60W 5000K Adjustable', brand: 'Nova LED Lighting', qty: 32, bin: 'E-05-02', leadTime: '1 Week' },
    { sku: 'NOV-LED-FL1', desc: 'LED Flood Light 150W 5000K Bracket Mount', brand: 'Nova LED Lighting', qty: 24, bin: 'E-05-04', leadTime: '1 Week' },
    { sku: 'NOV-LED-PK1', desc: 'LED Parking Lot Light 300W 5000K Slip-Fit', brand: 'Nova LED Lighting', qty: 12, bin: 'E-05-06', leadTime: '2 Weeks' },
    { sku: 'NOV-LED-ST4', desc: 'LED Strip Light 4ft 18W 4000K Linkable', brand: 'Nova LED Lighting', qty: 240, bin: 'E-06-01', leadTime: 'Stock' },
    { sku: 'NOV-LED-EX1', desc: 'LED Exit Sign Red/Green Combo Battery BU', brand: 'Nova LED Lighting', qty: 180, bin: 'E-06-04', leadTime: 'Stock' },
    { sku: 'NOV-LED-EM1', desc: 'LED Emergency Light 2-Head Battery BU', brand: 'Nova LED Lighting', qty: 160, bin: 'E-06-05', leadTime: 'Stock' },
    // â•â•â• AEROTHERM HEAT SYSTEMS â•â•â•
    { sku: 'AER-THE-120', desc: 'Electric Unit Heater 5kW 248V with T-stat', brand: 'AeroTherm Heat Systems', qty: 18, bin: 'E-12-08', leadTime: 'Stock' },
    { sku: 'AER-THE-240', desc: 'Electric Unit Heater 10kW 480V Industrial', brand: 'AeroTherm Heat Systems', qty: 8, bin: 'E-12-10', leadTime: '2 Weeks' },
    { sku: 'AER-THE-BAS1', desc: 'Baseboard Heater 4ft 1000W 240V White', brand: 'AeroTherm Heat Systems', qty: 45, bin: 'E-13-01', leadTime: 'Stock' },
    { sku: 'AER-THE-BAS2', desc: 'Baseboard Heater 6ft 1500W 240V White', brand: 'AeroTherm Heat Systems', qty: 32, bin: 'E-13-02', leadTime: 'Stock' },
    { sku: 'AER-THE-INF1', desc: 'Infrared Quartz Heater 3kW 240V Ceiling', brand: 'AeroTherm Heat Systems', qty: 10, bin: 'E-13-04', leadTime: '1 Week' },
];



const seedActivities = [
    { text: 'Staged 450 cu ft of Liberty Copper materials on 3 standard pallets for Deptford jobsite.', time: '08:12 AM' },
    { text: 'Picking order #SO-99231 (120 pcs Nova LED High Bays) initiated in Zone E.', time: '08:05 AM' },
    { text: 'Pallet staging and volumetric optimization calculated for load #02.', time: '07:45 AM' },
    { text: 'Flatbed truck #03 loaded with Titan B-Line structural materials out of West Deptford HQ.', time: '06:40 AM' },
    { text: 'Morning operations briefing complete. Fleet dispatched from Mid Atlantic Parkway.', time: '06:30 AM' },
    { text: 'Warehouse gate #4 opened for carrier pickup (Flatbed #03 and Box Truck #12).', time: '06:15 AM' },
    { text: 'Automatic inventory reconciliation complete. All stock status sheets synchronized.', time: '06:00 AM' },
    { text: 'Night shift operations complete. 12 orders staged in shipping bays A & B.', time: '05:45 AM' },
    { text: 'Custom freight packaging plan logged in logistics queue.', time: '05:12 AM' },
    { text: 'Security scan checklist: All firewall rules and Sentinel gateway statuses VERIFIED.', time: '04:30 AM' },
    { text: 'Receiving dock check-in: DuraPVC fittings replenishment shipment received.', time: '03:15 AM' }
];


const PRODUCT_CATALOG = [
    {
        sku: 'CON-EMT34',
        desc: 'EMT Conduit 3/4" x 10\' Galvanized',
        uom: 'EA',
        price: 4.43,
        brandId: 'titan-bline',
        brand: 'Titan B-Line',
        weight: 0.5,
        keywords: ['3/4 emt', 'emt conduit 3/4', 'con-emt34', 'emt 3/4', 'union metal emt', 'union emt', 'union']
    },
    {
        sku: 'CON-EMT10',
        desc: 'EMT Conduit 1" x 10\' Galvanized',
        uom: 'EA',
        price: 5.95,
        brandId: 'titan-bline',
        brand: 'Titan B-Line',
        weight: 0.5,
        keywords: ['1 emt', 'emt conduit 1', 'con-emt10', 'emt 1"']
    },
    {
        sku: 'FIT-EMTC',
        desc: 'EMT Compression Connector 3/4"',
        uom: 'EA',
        price: 0.74,
        brandId: 'matrix-fittings',
        brand: 'Matrix Fittings',
        weight: 0.15,
        keywords: ['compression connector', 'fit-emtc', 'compression coupling 3/4', 'compression connector 1/2']
    },
    {
        sku: 'FIT-EMTS',
        desc: 'EMT Set Screw Coupling 3/4"',
        uom: 'EA',
        price: 0.52,
        brandId: 'matrix-fittings',
        brand: 'Matrix Fittings',
        weight: 0.15,
        keywords: ['set screw coupling', 'fit-emts', 'screw coupling 3/4']
    },
    {
        sku: 'WIR-THHN12',
        desc: 'THHN 12 AWG Solid Copper Green',
        uom: 'FT',
        price: 0.34,
        brandId: 'liberty-copper',
        brand: 'Liberty Copper Cable',
        weight: 0.08,
        keywords: ['12 awg thhn', 'thhn 12 awg', 'wir-thhn12', 'copper wire green', 'copper cable thhn 4/0']
    },
    {
        sku: 'ACC-WNUT',
        desc: 'Wire Connectors Yellow Box/100',
        uom: 'BX',
        price: 9.86,
        brandId: 'matrix-fittings',
        brand: 'Matrix Fittings',
        weight: 0.15,
        keywords: ['wire nuts', 'acc-wnut', 'yellow wire nuts', 'connectors yellow']
    },
    {
        sku: 'CBL-MC122',
        desc: 'MC Cable 12/2 w/ Ground 250ft',
        uom: 'RL',
        price: 145.00,
        brandId: 'liberty-copper',
        brand: 'Liberty Copper Cable',
        weight: 25.0,
        keywords: ['mc cable 12/2', 'cbl-mc122', 'mc cable 12']
    },
    {
        sku: 'DEV-GFCI',
        desc: 'GFCI SmartGuard Receptacle 20A White',
        uom: 'EA',
        price: 12.50,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 0.25,
        keywords: ['gfci smartguard', 'gfci receptacle', 'dev-gfci', 'receptacle 20a']
    },
    {
        sku: 'WIR-XHHW40',
        desc: 'Prime Aluminum Cable 4/0 AWG Feeder',
        uom: 'FT',
        price: 2.10,
        brandId: 'prime-aluminum',
        brand: 'Prime Aluminum Cable',
        weight: 0.45,
        keywords: ['aluminum cable 4/0', 'wir-xhhw40', 'aluminum cable', 'feeder wire']
    },
    {
        sku: 'AER-THE-120',
        desc: 'AeroTherm Electric Unit Heater 5kW',
        uom: 'EA',
        price: 245.00,
        brandId: 'aerotherm-heat',
        brand: 'AeroTherm Heat Systems',
        weight: 18.0,
        keywords: ['electric unit heater', 'heater 5kw', 'aer-the-120', 'unit heater']
    },
    {
        sku: 'PNL-100A',
        desc: '100A Main Lug Subpanel 12-Spc',
        uom: 'EA',
        price: 45.00,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 12.0,
        keywords: ['subpanel 12-spc', '100a subpanel', 'pnl-100a', 'main lug subpanel']
    },
    {
        sku: 'BKR-2P30',
        desc: '30A Double Pole Circuit Breaker',
        uom: 'EA',
        price: 12.50,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 0.5,
        keywords: ['30a double pole', 'circuit breaker 30a', 'bkr-2p30', 'breaker 2p30']
    },
    {
        sku: 'LTG-HBAY',
        desc: 'Nova LED Lighting Industrial High Bay LED fixture 150W',
        uom: 'EA',
        price: 115.00,
        brandId: 'nova-lighting',
        brand: 'Nova LED Lighting',
        weight: 8.5,
        keywords: ['industrial high bay', 'high bay led fixture', 'ltg-hbay', 'high bay 150w']
    },
    {
        sku: 'BKR-1P20',
        desc: '20A Single Pole Circuit Breaker',
        uom: 'EA',
        price: 8.50,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 0.3,
        keywords: ['20a single pole', 'circuit breaker 20a', 'bkr-1p20', 'breaker 1p20', 'quadra', 'quadra electric', 'q120']
    },
    {
        sku: 'LTG-EXIT',
        desc: 'LED Emergency Exit Sign Red Combo',
        uom: 'EA',
        price: 35.00,
        brandId: 'nova-lighting',
        brand: 'Nova LED Lighting',
        weight: 2.5,
        keywords: ['emergency exit sign', 'exit sign', 'ltg-exit', 'exit sign red']
    },
    {
        sku: 'DEV-PL1G',
        desc: '1-Gang Plastic Wallplate White',
        uom: 'EA',
        price: 1.25,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 0.1,
        keywords: ['1-gang plastic wallplate', 'wallplate white', 'dev-pl1g', 'wallplate 1-gang']
    },
    {
        sku: 'WIR-XHHW6',
        desc: 'XHHW-2 6 AWG Stranded Copper Blk',
        uom: 'FT',
        price: 1.44,
        brandId: 'liberty-copper',
        brand: 'Liberty Copper Cable',
        weight: 0.15,
        keywords: ['6 awg stranded', 'xhhw-2 6 awg', 'wir-xhhw6', 'copper wire black']
    },
    {
        sku: 'PNL-200A',
        desc: '200A Main Breaker Panel 42-Spc',
        uom: 'EA',
        price: 172.84,
        brandId: 'titan-wiring',
        brand: 'Titan Wiring Devices',
        weight: 35.0,
        keywords: ['200a main breaker', '200a panel', 'pnl-200a', 'breaker panel 42-spc']
    },
    {
        sku: 'BKR-GFCI',
        desc: '20A GFCI Protection Breaker 1P',
        uom: 'EA',
        price: 32.40,
        brandId: 'titan-fuses',
        brand: 'Titan Edison Fuses',
        weight: 0.5,
        keywords: ['gfci protection breaker', 'gfci breaker', 'bkr-gfci', '20a gfci breaker']
    }
];

const initialMailItems = [
    {
        id: 'mail-storm',
        senderName: 'Janet Chen',
        senderEmail: 'estimating@midatlanticpower.com',
        date: 'June 8, 2026 10:10 AM',
        subject: 'EMERGENCY RESTORATION: Grid Substation Failure - Hospital feeds',
        snippet: 'Janet Chen from Mid-Atlantic Power requests emergency release of 1,500 ft copper XHHW 6 AWG wire...',
        body: `Hi there,
        
A severe transformer explosion has knocked out the main substation serving the Mercy General Hospital grid. The governor has declared a state of emergency. 

We are facing statutory fines of $50,000 per hour for every hour the hospital runs on back-up diesel generators after 8:00 PM tonight.

We need immediate release and hot-shot delivery of:
- 1,500 ft XHHW-2 6 AWG Stranded Copper Black (SKU: WIR-XHHW6)

We know this stock is tight, but we need you to override any standard allocations. Client's warehouse job can wait, but this hospital cannot. Please dispatch immediately and coordinate courier will-call.

Janet Chen
VP Operations
Mid-Atlantic Power`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-bid',
        senderName: 'Brian Hayes',
        senderEmail: 'b.haye@keystoneelec.com',
        date: 'June 8, 2026 10:25 AM',
        subject: 'TIGHT DEADLINE BID: Transit Substation RFP - Honor price lock',
        snippet: 'Brian Hayes from Keystone Electric needs 50 panels and 200 GFCI breakers before 3:00 PM bid close...',
        body: `Hi there,
        
We are submitting our final package for the City Transit Authority Substation project. The bid portal closes at exactly 3:00 PM today. No extensions.

We need a firm, manager-approved quote for:
- 50 pcs 200A Main Breaker Panel 42-Spc (SKU: PNL-200A)
- 200 pcs 20A GFCI Protection Breaker 1P (SKU: BKR-GFCI)

I saw your company warning about a 15% manufacturer surcharge starting next week. We CANNOT accept that. You must honor last month's contract price lock of $172.84 on panels and $32.40 on breakers, or we lose this bid and we will cancel our entire account with you.

Also, I know we are slightly over our credit line right now, but we need you to bypass the ERP credit hold so this quote prints immediately. We have no time for credit reviews!

Send it back in 10 minutes.

Brian Hayes
Estimator
Keystone Electric`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-weg',
        senderName: 'Carlos Hernandez',
        senderEmail: 'c.hernandez@crown-food-processing.com',
        date: 'June 8, 2026 9:15 AM',
        subject: 'RFQ: VEG 20HP Flaker Motor replacement - Crown Food',
        snippet: 'Carlos Hernandez from Crown Food requests pricing and availability on VEG 20HP Flaker Motor...',
        body: `Hi there,

Our facility is experiencing an emergency downtime event on our primary flaker line. We need to replace our failed flaker motor as soon as possible.

Can you please quote pricing and lead time for:
- 1 pc VEG Industrial Motors 20HP Flaker Motor (MPN: 02012ET3E286T-W22G / SKU: MOT-WEG-20HP)

We need this shipped to our Applegate processing plant. Please check stock availability.

Best,
Carlos Hernandez
Crown Food Processing`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-mersen',
        senderName: 'T. Zellers',
        senderEmail: 't.zellers@nationalrail.gov',
        date: 'June 8, 2026 9:30 AM',
        subject: 'RFQ: Meridian Power Blocks for C+S Transfer Switches',
        snippet: 'T. Zellers from National Rail Service releases 8 pcs Meridian Power Distribution Blocks...',
        body: `Hello there,

Following up on our quote for the C+S Transfer Switches. We would like to release the order for the following items:
- 8 pcs Meridian Power Distribution Blocks (MPN: FSPDB3C / SKU: PDB-MER-FSPDB3) @ $16.36 each

Please verify if this meets your supplier's release requirements and send us the order acknowledgment.

Thanks,
T. Zellers
National Rail Service`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-duraline',
        senderName: 'T. Zellers',
        senderEmail: 't.zellers@nationalrail.gov',
        date: 'June 8, 2026 9:45 AM',
        subject: 'EXPEDITE STATUS: 4" HDPE Conduit - Substation Build',
        snippet: 'T. Zellers from National Rail Service is requesting expected ship date status on S144745017...',
        body: `Good afternoon,

Following up on our S-number order S144745017 for the 4" Duraflow SDR11 HDPE Conduit (Amtrak part: 5000006862 / SKU: CON-HDPE-4). 

Our records show an Estimated Ship Date (ESD) on file for this Friday. Since this is a high-stakes project for our Northeast Substation, can you please confirm if this order is still on track to ship, and provide tracking numbers as soon as possible?

Thanks,
T. Zellers
National Rail Service`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-intercept',
        senderName: 'Engineering (Client E)',
        senderEmail: 'engineering@clientelec.com',
        date: 'June 8, 2026 8:40 AM',
        subject: 'RFQ: Subpanel and Breaker Package - Quadra Brand Specified',
        snippet: 'Please quote 150 pcs Quadra Electric Q120 20A breakers and 1,000 ft Union Metal conduit...',
        body: `Hi there,

We need pricing on the following items for a warehouse build-out:
- 150 pcs Quadra Electric Q120 20A Single Pole Circuit Breaker
- 1,000 ft Union Metal EMT Conduit 3/4"

Our engineers specified the Quadra brand for these breakers, but we are open to drop-in equivalents if they are code-compliant. Please advise on lead time and price.

Thanks,
Mark Davis
Client Company Solutions`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-arbitrage',
        senderName: 'Operations (Client D)',
        senderEmail: 'operations@redwood-electric.com',
        date: 'June 8, 2026 8:48 AM',
        subject: 'EMERGENCY RFQ: Water Treatment Plant Down - Strut & Heaters Needed',
        snippet: 'Plant is down! Need immediate will-call pickup at West Deptford: 4 pcs AeroTherm 5kW heaters...',
        body: `URGENT!

The Summit Valley Water Treatment Plant has suffered an emergency equipment failure. The facility is down and we need to pull these materials immediately for a will-call pickup today:
- 4 pcs AeroTherm Electric Unit Heater 5kW (AER-THE-120)
- 2 pcs 100A Main Lug Subpanel 12-Spc (PNL-100A)

Please verify stock status at West Deptford HQ yard. We will dispatch our truck as soon as you confirm.

Thanks,
Gary Peterson
Redwood Electric`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-sizing',
        senderName: 'Purchasing (Client B)',
        senderEmail: 'purchasing@apex-distributors.com',
        date: 'June 8, 2026 8:52 AM',
        subject: 'RFQ: Heavy Copper Conductor Feeder Run - Deptford Site',
        snippet: 'Please quote 800 ft Liberty Copper Cable THHN 4/0 AWG. Need pricing and weight details...',
        body: `Hi Specialist,

We are quoting a heavy feeder line run for the Deptford Storage site and need pricing for:
- 800 ft Liberty Copper Cable THHN 4/0 AWG (WIR-THHN40)

Please calculate the pricing, total shipping weight, and advise if we qualify for prepaid freight terms. Our budget is very tight on this copper run.

Best,
Janet Chen
Apex Electrical Distributors`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-1',
        senderName: 'Estimator (Client A)',
        senderEmail: 'estimating@vanguard-contractors-llc.net',
        date: 'June 8, 2026 8:02 AM',
        subject: 'RFQ: Deptford Storage Yard Expansion - Quick Quote Needed',
        snippet: 'Please quote the following materials for our upcoming Deptford yard refit project: 1,200 ft Titan B-Line strut...',
        body: `Hello ERP Estimating Team,

Please quote the following materials for our upcoming Deptford yard refit project:
- 1,200 ft Titan B-Line strut channel 14G
- 800 ft Liberty Copper Cable THHN 4/0 AWG
- 500 pcs Matrix Fittings EMT Compression Connector 1/2"
- 25 pcs GFCI SmartGuard Receptacle 20A White
- 4 coils MC Cable 12/2 w/ Ground 250ft

We need this quote back quickly. Address delivery to our Deptford Storage site. Account Reference: VG-992.

Thanks,
Client A Estimator
Vanguard Contractors LLC`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 5,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-4',
        senderName: 'Purchasing (Client B)',
        senderEmail: 'purchasing@apex-distributors.com',
        date: 'June 8, 2026 7:12 AM',
        subject: 'RFQ: Prime Aluminum Feeder Reels & Heaters',
        snippet: 'We are putting together a quote for a commercial feeder job in Cherry Hill. Can you quote us pricing...',
        body: `Hi Specialist,

We are putting together a quote for a commercial feeder job in Cherry Hill. Can you quote us pricing and availability for:
- 3,000 ft Prime Aluminum Cable 4/0 AWG Feeder
- 4 pcs AeroTherm Electric Unit Heater 5kW
- 2 pcs 100A Main Lug Subpanel 12-Spc
- 6 pcs 30A Double Pole Circuit Breaker

Please advise on the lead time. If this qualifies for prepaid freight shipping, let us know.

Thanks,
Client B Purchasing
Apex Electrical Distributors`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 5,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-5',
        senderName: 'Estimator (Client C)',
        senderEmail: 'estimating@beacon-supply.com',
        date: 'June 8, 2026 6:45 AM',
        subject: 'RFQ: Nova LED Lighting Upgrade & Breakers',
        snippet: 'We need pricing on represented lighting products and circuit breakers for the gym project: 120 pcs Nova LED...',
        body: `Hi Client,

We need pricing on represented lighting products and circuit breakers for the high school gymnasium project:
- 120 pcs Nova LED Lighting Industrial High Bay LED fixture 150W
- 50 pcs 20A Single Pole Circuit Breaker
- 15 pcs LED Emergency Exit Sign Red Combo
- 100 pcs 1-Gang Plastic Wallplate White

Please check if these items are in stock at West Deptford and provide your distributor pricing sheet. We would like to coordinate a local truck pickup if stock is ready, or check prepaid freight shipping terms.

Best,
Client C Estimator
Beacon Electric Supply`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 8,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-2',
        senderName: 'Specialist D',
        senderEmail: 'specialist.d@erp-executives.top',
        date: 'June 8, 2026 7:45 AM',
        subject: 'URGENT: Verify Wire Transfer details immediately',
        snippet: 'Hi there, I am in an executive board meeting right now and need you to verify and approve a wire release...',
        body: `Hi there,

I am in an executive board meeting right now and need you to verify and approve a wire release of $45,000 for a supplier account. The job site shipment is on hold until payment clears.

Staged Items on Hold:
- 1,000 ft Titan B-Line strut channel 10ft (CON-STRUT)
- 20 pcs Titan Transformers Buck-Boost (TITAN-XFMR-BB)
- 100 pcs Nova LED Lighting High Bay (LTG-HBAY)

Send confirmation as soon as it's processed. Do not call, just reply here.

Specialist D
ERP Executives`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 98,
        riskLabel: 'CRITICAL',
        riskColor: 'var(--color-danger)',
        warningBanner: {
            class: 'red',
            icon: 'fa-solid fa-skull-crossbones',
            text: '<strong>Spoofing Alert:</strong> We think this message is a phishing attempt. The sender domain <em>erp-executives.top</em> mimics erpdistribution.com but SPF and DKIM alignments failed. Origin IP 203.0.113.111 reported for high frequency spam.',
            actions: [
                { label: 'Quarantine & Report', action: 'quarantine' },
                { label: 'Ignore & Delete', action: 'delete' }
            ]
        }
    },
    {
        id: 'mail-6',
        senderName: 'Titan B-Line Support',
        senderEmail: 'bline.support@titandevices-mock.com',
        date: 'June 7, 2026 5:02 PM',
        subject: 'Titan B-Line: Strut Channel Stock Shortages & Allocation Updates',
        snippet: 'ERP Team, due to raw steel coil pricing hikes on LME and Midwest production backlogs, all Titan B-Line...',
        body: `ERP Team,

Due to raw steel coil pricing hikes on LME and Midwest production backlogs, all Titan B-Line 10ft hot-dip galvanized steel strut channel (14G and 12G) will be placed on strict allocation starting June 15.

Affected Allocation Items:
- 1,500 ft Titan B-Line strut channel 14G (CON-STRUT)
- 800 ft Titan B-Line strut channel deep slotted (CON-STRD)

Please review active customer blanket orders and cross-reference your regional stock counts in the West Deptford logistics queue. Contact Specialist B if you need to coordinate direct factory shipments.

Best regards,
Titan Division Sales Support`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 2,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-3',
        senderName: 'DuraPVC Sales Support',
        senderEmail: 'support@durapvc-mock.com',
        date: 'June 7, 2026 4:15 PM',
        subject: 'DuraPVC Fittings: Pricing list updates June 2026',
        snippet: 'Dear Distributors, please note the updated pricing matrices for PVC couplers, junctions, and elbows...',
        body: `Dear Distributors,

Please note the updated pricing matrices for PVC couplers, junctions, and elbows effective June 15, 2026. 
We represent the finest PVC conduit fittings in the regional market, shipped directly from our regional warehouses.

Affected Price Book Items:
- 1,000 pcs Schedule 40 PVC Coupling 2" (CON-PVC20)
- 2,500 pcs PVC Male Adapter 1" (FIT-PVCC)

Prepaid freight thresholds remain at $3,000 for East Division delivery out of West Deptford HQ.

Best regards,
DuraPVC Sales Support`,
        folder: 'inbox',
        unread: false,
        hasAttachment: true,
        attachmentName: 'DuraPVC_Pricing_Sheets_June2026.xlsx',
        riskScore: 10,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-7',
        senderName: 'Liberty Wire Sales',
        senderEmail: 'sales@libertywire-mock.com',
        date: 'June 7, 2026 3:30 PM',
        subject: 'Liberty Copper: Price increase warning effective June 15',
        snippet: 'Dear Representatives, please note that COMEX copper spot prices have spiked to historic highs (rising above $4.50/lb)...',
        body: `Dear Representatives,

Please note that COMEX copper spot prices have spiked to historic highs (rising above $4.50/lb). As a result, Liberty Copper will be implementing a 4.5% sheet price increase across all THHN, NM-B Romex alternatives, and MC Cable lines.

Monitored Wire Price Sheet Lines:
- 5,000 ft THHN 12 AWG Solid Copper Black (WIR-THHN12)
- 3,000 ft THHN 10 AWG Stranded Copper Black (WIR-THHN10)
- 2,000 ft THHN 8 AWG Stranded Copper Green (WIR-THHN08)

All quotes issued prior to June 15 will be honored at current copper multiplier rates. Please contact Specialist B to lock in contract pricing for ongoing estimator projects.

Sincerely,
Liberty Wire Sales Desk`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 3,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-8',
        senderName: 'Operations (Client D)',
        senderEmail: 'operations@redwood-electric.com',
        date: 'June 7, 2026 2:15 PM',
        subject: 'Logistics inquiry: Parallel wire run packing status - PO-88301',
        snippet: 'Hi Specialist, can you check on our custom parallel reel cut order (PO-88301)? We ordered: 4-Legs Liberty Copper Cable...',
        body: `Hi Specialist,

Can you check on our custom parallel reel cut order (PO-88301)? We ordered:
- 4-Legs Liberty Copper Cable THHN 4/0 AWG - 600ft run

The contractor is asking when it will be dispatched from West Deptford. Has it been packed and palletized in the warehouse yet? Please check the Logistics logs and advise.

Thanks,
Client D Operations
Redwood Electric Operations`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 4,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-9',
        senderName: 'Accounts Payable',
        senderEmail: 'ap.desk@erpdistribution.com',
        date: 'June 8, 2026 8:15 AM',
        subject: 'Discrepancy: Invoice Variance on PO-99180 (Matrix Fittings)',
        snippet: 'Hi there, there is a billing mismatch on Vanguard\'s PO-99180. The vendor invoice says $1,890 but the ERP PO is $1,750...',
        body: `Hi there,

We received a vendor invoice for order SO-99180 / PO-99180 from Vanguard Contractors (our account Ref: VG-992). The billing doesn't align with what was entered in the ERP system, and we need to reconcile this direct billing variance.

ERP Order Entry shows:
- 500 pcs Matrix Fittings EMT 1/2" (MAT-FIT-201) entered at $3.50/pc (Total: $1,750.00)

Vendor Invoice states:
- 500 pcs Matrix Fittings EMT 1/2" billed at $3.78/pc (Total: $1,890.00)

I'm not completely clear on what we need here. Did we authorize a price increase on these zinc compression connectors, or did they ship the wrong part? Please look into this and log it in the resolution queue.

Thanks,
Accounts Payable Team`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'mail-10',
        senderName: 'Accounts Payable',
        senderEmail: 'ap.desk@erpdistribution.com',
        date: 'June 8, 2026 8:45 AM',
        subject: 'Discrepancy: Direct Billing Margin Variance on PO-99200 (DuraPVC)',
        snippet: 'Hi there, there is a billing mismatch on Redwood Electric\'s PO-99200. The vendor invoice says $3,750 but ERP is $2,450...',
        body: `Hi there,

We received a vendor invoice for order SO-99222 / PO-99200 from Redwood Electric (our account Ref: RW-802). The billing doesn't align with what was entered in the ERP system, and we need to reconcile this direct billing variance.

ERP Order Entry shows:
- 2,500 pcs PVC Male Adapter 1" (FIT-PVCC) entered at $0.98/pc (Total: $2,450.00)

Vendor Invoice states:
- 2,500 pcs PVC Male Adapter 1" (FIT-PVCC) billed at $1.50/pc (Total: $3,750.00)

I'm not completely clear on what we need here. Did we authorize a price increase on these PVC male adapters, or did they ship the heavy-wall industrial grade? Please look into this and log it in the resolution queue.

Thanks,
Accounts Payable Team`,
        folder: 'inbox',
        unread: true,
        riskColor: 'var(--color-danger)'
    },
    {
        id: 'hist-2021',
        senderName: 'Finance VP',
        senderEmail: 'finance.VP@erpdistribution.com',
        date: 'May 18, 2021 10:14 AM',
        subject: 'Credit Limit Exception approved: Client Company Solutions',
        snippet: 'Hi there, the finance department has approved a temporary credit limit extension of $50,000 for Client Company...',
        body: `Hi there,

The finance department has approved a temporary credit limit extension of $50,000 for Client Company Solutions (Account TS-441) to cover incoming material orders for their Department of Transportation contracts. This approval will remain active for their storage yard expansion phases.

Best,
Finance VP`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'hist-2022',
        senderName: 'Liberty Wire Contracts Desk',
        senderEmail: 'contracts@libertywire-mock.com',
        date: 'October 14, 2022 2:45 PM',
        subject: 'Locked Contract Rate Agreement: WIR-THHN12 for Client Company',
        snippet: 'Hi there, we have locked in a special contract rate of $0.31/ft for WIR-THHN12 for Client Company Solutions...',
        body: `Hi there,

We have locked in a special contract rate of $0.31/ft for WIR-THHN12 (THHN 12 AWG Solid Copper Green) for Client Company Solutions. This contract pricing agreement expires in late 2027. Standard price sheets showing $0.34/ft should be overridden in the billing gateway for all Client Company orders.

Contracts Desk
Liberty Wire Division`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'hist-2023',
        senderName: 'Warehouse Operations Coordinator',
        senderEmail: 'warehouse.leads@erpdistribution.com',
        date: 'March 22, 2023 9:15 AM',
        subject: 'Palletization Layout Template - Client Company Yard Design Pattern',
        snippet: 'Hi there, here is the approved freight packaging configuration template for Client Company yard projects...',
        body: `Hi there,

Here is the approved palletization layout configuration template for Client Company yard projects:
- Standard 48x40 double-stack pallets with heavy-duty strapping and shrinkwrap set to maximize truck volume.

Let's make sure this template is logged in the warehouse system for future repeat orders.

Best,
Warehouse Leads Team`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    },
    {
        id: 'hist-2024',
        senderName: 'Sentinel Security Gateway',
        senderEmail: 'sentinel.gateway@erpdistribution.com',
        date: 'November 12, 2024 11:30 AM',
        subject: 'Security Alert: Blocked phishing attempt mimicking Liberty Wire',
        snippet: 'Sentinel Security Alert: A communication mimicking libertywire-mock.com was blocked by our gateway...',
        body: `Sentinel Security Alert:

A communication mimicking libertywire-mock.com was blocked by our gateway. The email originated from sales@liberty-wire-mock.org which is an unregistered typosquatted domain. Risk score flagged at 98%.

Defensive Shield Team`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 98,
        riskLabel: 'CRITICAL',
        riskColor: 'var(--color-danger)'
    },
    {
        id: 'hist-2025',
        senderName: 'Operations Lead',
        senderEmail: 'operations.lead@erpdistribution.com',
        date: 'April 05, 2025 8:50 AM',
        subject: 'Will Call Staging and Pickup Policy Update',
        snippet: 'Hello Desk Reps, please note that all local pickup orders for Client Company must be staged...',
        body: `Hello Desk Reps,

Please note that all local pickup orders for Client Company (Account TS-441) must be staged in Zone B and marked ready prior to customer notification. Release codes will be dispatched to the driver's mobile number automatically.

Operations Lead`,
        folder: 'inbox',
        unread: false,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    }
];

// ==========================================
// 2. GLOBAL STATE
// ==========================================

let activeView = 'mail'; // 'mail', 'contacts', 'capacity', 'inventory', 'linecard'
let activeFolder = 'inbox'; // 'inbox', 'sent', 'quarantine', 'drafts', 'junk', 'archive', 'deleted'
let mailItems = [...initialMailItems];
let sentMailItems = [];
let activeMailId = 'mail-1';
let activeContactId = null;
let activeCategoryFilter = 'all';
let isCopilotOpen = true;
let activeCopilotTab = 'rfq';
let parsedQuoteData = null; // Stored calculation result
let selectedAttachmentToAttach = null;
let vacationAutopilotActive = false;

let representedBrandPricing = {
    'titan-bline': 7.20,
    'liberty-copper': 4.80,
    'matrix-fittings': 1.85,
    'titan-wiring': 12.50,
    'nova-lighting': 115.00,
    'prime-aluminum': 2.10,
    'durapvc-fittings': 1.45,
    'titan-fuses': 4.25,
    'aerotherm-heat': 245.00
};

// ==========================================
// 3. DOM ELEMENT CACHING
// ==========================================

// Views & Navigation
const railButtons = document.querySelectorAll('.rail-btn');
const foldersPane = document.getElementById('folders-pane');
const mailFoldersSection = document.getElementById('mail-folders-section');
const contactsFoldersSection = document.getElementById('contacts-folders-section');
const opsFoldersSection = document.getElementById('ops-folders-section');
const paneTitleText = document.getElementById('pane-title-text');
const folderItems = document.querySelectorAll('.folder-item');

// Middle List Pane
const listItemsScroll = document.getElementById('list-items-scroll');
const mailFiltersBar = document.getElementById('mail-filters-bar');
const contactsSearchBar = document.getElementById('contacts-search-bar');
const contactSearchInput = document.getElementById('contact-search-input');
const tabFocused = document.getElementById('tab-focused');
const tabOther = document.getElementById('tab-other');

// Right Reading Pane
const readingPane = document.getElementById('reading-pane');
const mailReadingView = document.getElementById('mail-reading-view');
const contactDetailView = document.getElementById('contact-detail-view');
const opsCapacityView = document.getElementById('ops-capacity-view');
const inventoryView = document.getElementById('inventory-view');
const linecardView = document.getElementById('linecard-view');
const erpView = document.getElementById('erp-view');
const scratchView = document.getElementById('scratch-view');

const scratchWorkspaceSelect = document.getElementById('scratch-workspace-select');
const scratchFileList = document.getElementById('scratch-file-list');
const scratchViewerFilename = document.getElementById('scratch-viewer-filename');
const scratchViewerSize = document.getElementById('scratch-viewer-size');
const scratchCodeDisplay = document.getElementById('scratch-code-display');
const btnRefreshScratch = document.getElementById('btn-refresh-scratch');

// Mail detail elements
const emailSubject = document.getElementById('email-subject');
const emailSenderAvatar = document.getElementById('email-sender-avatar');
const emailSenderName = document.getElementById('email-sender-name');
const emailSenderAddress = document.getElementById('email-sender-address');
const emailRecipient = document.getElementById('email-recipient');
const emailDate = document.getElementById('email-date');
const emailAttachmentsRow = document.getElementById('email-attachments-row');
const emailAttachmentName = document.getElementById('email-attachment-name');
const emailBodyText = document.getElementById('email-body-text');
const outlookSecurityBanner = document.getElementById('outlook-security-banner');
const btnOpenAttachment = document.getElementById('btn-open-attachment');
const btnReplyEmail = document.getElementById('btn-reply-email');
const btnForwardEmail = document.getElementById('btn-forward-email');
const btnContactEmail = document.getElementById('btn-contact-email');

// Contact detail elements
const cardAvatar = document.getElementById('card-avatar');
const cardName = document.getElementById('card-name');
const cardRole = document.getElementById('card-role');
const cardEmail = document.getElementById('card-email');
const cardPhone = document.getElementById('card-phone');
const cardAddress = document.getElementById('card-address');
const cardBrands = document.getElementById('card-brands');

// Copilot Pane
const copilotSidebar = document.getElementById('copilot-sidebar');
const btnToggleCopilot = document.getElementById('btn-toggle-copilot');
const copilotTabs = document.querySelectorAll('.copilot-tab');
const copilotTabBodies = document.querySelectorAll('.copilot-tab-body');
const parsedItemsContainer = document.getElementById('parsed-items-container');
const btnParseSelected = document.getElementById('btn-parse-selected');
const laserScanBox = document.getElementById('laser-scan-box');
const customParseBox = document.getElementById('custom-parse-box');
const btnOpenTextParser = document.getElementById('btn-open-text-parser');
const rfqTextInput = document.getElementById('rfq-text-input');
const btnExecuteCustomParse = document.getElementById('btn-execute-custom-parse');

// Context Router Elements
const btnEnterErp = document.getElementById('btn-enter-erp');
const btnAgentEnterErp = document.getElementById('btn-agent-enter-erp');
const erpRoutingModal = document.getElementById('erp-routing-modal');
const btnCloseRouting = document.getElementById('btn-close-routing');
const btnCancelRouting = document.getElementById('btn-cancel-routing');
const btnExecuteRouting = document.getElementById('btn-execute-routing');
const btnRouteStock = document.getElementById('btn-route-stock');
const btnRouteDirect = document.getElementById('btn-route-direct');
const routerVendorGroup = document.getElementById('router-vendor-group');
const routerVendor = document.getElementById('router-vendor');
const routerCustomerName = document.getElementById('router-customer-name');
const routerCustomerId = document.getElementById('router-customer-id');
const routerQuoteTotal = document.getElementById('router-quote-total');
const routerLineCount = document.getElementById('router-line-count');
let selectedRoutingType = 'stock'; // Default stock routing

// ── Universal ERP Connector State ──────────────────────────────
const erpConnector = {
    activeProfileId: localStorage.getItem('backfeed_erp_profile') || 'eclipse-demo',
    customUrl: localStorage.getItem('backfeed_erp_custom_url') || '',
    getProfile: function() { return window.getERPProfile ? window.getERPProfile(this.activeProfileId) : null; },
    isDemoMode: function() { return this.activeProfileId === 'eclipse-demo'; },
    getPortalUrl: function() {
        const p = this.getProfile();
        if (!p) return '';
        if (p.type === 'external' && this.customUrl) return this.customUrl;
        return p.portalUrl || '';
    }
};

// ERP Connector UI Elements
const eclipseErpContainer = document.getElementById('eclipse-erp-container');
const erpEmptyState = document.getElementById('erp-empty-state');
const erpConnName = document.getElementById('erp-conn-name');
const erpConnBadge = document.getElementById('erp-conn-badge');
const erpConnStatus = document.getElementById('erp-conn-status');
const erpTerminalTitle = document.getElementById('erp-terminal-title');
const routingErpTargetName = document.getElementById('routing-erp-target-name');
const btnErpConfigure = document.getElementById('btn-erp-configure');
const btnErpEmptyConfigure = document.getElementById('btn-erp-empty-configure');
const settingsErpProfile = document.getElementById('settings-erp-profile');
const settingsErpUrlGroup = document.getElementById('settings-erp-url-group');
const settingsErpUrl = document.getElementById('settings-erp-url');
const settingsErpStatusText = document.getElementById('settings-erp-status-text');

/** Synchronize all ERP UI elements with the active profile */
function syncERPConnectorUI() {
    const profile = erpConnector.getProfile();
    if (!profile) return;
    const portalUrl = erpConnector.getPortalUrl();
    const hasUrl = !!portalUrl;

    // Toolbar
    if (erpConnName) erpConnName.textContent = profile.name;
    if (erpConnBadge) {
        erpConnBadge.textContent = profile.badgeLabel;
        erpConnBadge.style.color = profile.color;
        erpConnBadge.style.background = profile.color + '22';
        erpConnBadge.style.borderColor = profile.color + '44';
    }
    // Status dot
    const statusDot = erpConnStatus ? erpConnStatus.querySelector('.erp-status-dot') : null;
    if (statusDot) {
        statusDot.className = 'erp-status-dot ' + (hasUrl ? 'connected' : 'disconnected');
    }
    // Terminal title
    if (erpTerminalTitle) erpTerminalTitle.textContent = profile.name;
    // Routing modal target
    if (routingErpTargetName) {
        routingErpTargetName.textContent = profile.name + (profile.type === 'demo' ? ' (Demo)' : '');
    }
    // Demo ERP container vs empty state
    const isDemoProfile = profile.type === 'demo';
    if (isDemoProfile || hasUrl) {
        if (eclipseErpContainer) eclipseErpContainer.style.display = isDemoProfile ? 'flex' : 'none';
        if (erpEmptyState) erpEmptyState.style.display = 'none';
    } else {
        if (eclipseErpContainer) eclipseErpContainer.style.display = 'none';
        if (erpEmptyState) erpEmptyState.style.display = 'flex';
    }
    // Settings modal sync
    if (settingsErpProfile) settingsErpProfile.value = erpConnector.activeProfileId;
    if (settingsErpUrl) settingsErpUrl.value = erpConnector.customUrl;
    const showUrlGroup = profile.type === 'external';
    if (settingsErpUrlGroup) settingsErpUrlGroup.style.display = showUrlGroup ? 'block' : 'none';
    if (settingsErpStatusText) {
        settingsErpStatusText.textContent = hasUrl
            ? profile.name + ' — ' + (profile.type === 'demo' ? 'Ready' : 'Connected')
            : profile.name + ' — Configure Portal URL';
    }
}

/** Apply and persist a new ERP profile */
function setERPProfile(profileId, customUrl) {
    erpConnector.activeProfileId = profileId;
    erpConnector.customUrl = customUrl || '';
    localStorage.setItem('backfeed_erp_profile', profileId);
    localStorage.setItem('backfeed_erp_custom_url', customUrl || '');
    syncERPConnectorUI();
}

// ERP & Security Add-in
const erpCustomerId = document.getElementById('erp-customer-id');
const erpCompanyName = document.getElementById('erp-company-name');
const erpAccountStatus = document.getElementById('erp-account-status');
const erpCreditLimit = document.getElementById('erp-credit-limit');
const erpBalanceDue = document.getElementById('erp-balance-due');
const erpAvailableCredit = document.getElementById('erp-available-credit');
const erpQuoteValue = document.getElementById('erp-quote-value');
const erpCreditResultBox = document.getElementById('erp-credit-result-box');
const erpDomainCheck = document.getElementById('erp-domain-check');
const erpDkimCheck = document.getElementById('erp-dkim-check');
const erpSpfCheck = document.getElementById('erp-spf-check');
const erpAgeCheck = document.getElementById('erp-age-check');
const erpFraudVerdict = document.getElementById('erp-fraud-verdict');
const erpOrderCount = document.getElementById('erp-order-count');
const erpOrdersLogList = document.getElementById('erp-orders-log-list');

// Freight Calculator Add-in
const calcTotalWeight = document.getElementById('calc-total-weight');
const calcTotalPrice = document.getElementById('calc-total-price');
const calcShippingCapacity = document.getElementById('calc-shipping-capacity');
const calcCapacityBar = document.getElementById('calc-capacity-bar');
const freightBrandsBreakdownList = document.getElementById('freight-brands-breakdown-list');
const consolidationRecommendationBox = document.getElementById('consolidation-recommendation-box');
const consolidationAlertText = document.getElementById('consolidation-alert-text');
const btnExecuteConsolidation = document.getElementById('btn-execute-consolidation');
const btnDispatchQuote = document.getElementById('btn-dispatch-quote');

// Smart-Cut CNC Add-in
const serviceTypeSelect = document.getElementById('cut-material-type');
const wireBrandSelect = document.getElementById('cut-manufacturer');
const wireGaugeSelect = document.getElementById('cut-wire-gauge');
const wireLegsSelect = document.getElementById('cut-wire-legs');
const cutLengthInput = document.getElementById('cut-length');
const outWeight = document.getElementById('out-weight');
const startCutBtn = document.getElementById('start-cut-btn');
const visualReelDisk = document.getElementById('visual-reel-disk');
const visualWireFill = document.getElementById('visual-wire-fill');

// Compose Modal
const composeModal = document.getElementById('compose-modal');
const btnNewMail = document.getElementById('btn-new-mail');
const btnRefreshMail = document.getElementById('btn-refresh-mail');
const btnCloseCompose = document.getElementById('btn-close-compose');
const btnDiscardCompose = document.getElementById('btn-discard-compose');
const composeTo = document.getElementById('compose-to');
const composeSubject = document.getElementById('compose-subject');
const composeBody = document.getElementById('compose-body');
const btnSendMail = document.getElementById('btn-send-mail');
const composeContactsList = document.getElementById('compose-contacts-list');
const btnAttachFile = document.getElementById('btn-attach-file');
const composeAttachmentsBar = document.getElementById('compose-attachments-bar');
const composeAttachmentLabel = document.getElementById('compose-attachment-label');
const btnRemoveAttachment = document.getElementById('btn-remove-attachment');

// Director Panel
const btnInjectRFQ = document.getElementById('btn-inject-rfq');
const btnInjectPhish = document.getElementById('btn-inject-phish');
const btnInjectPriceUpdate = document.getElementById('btn-inject-price-update');
const btnInjectStochastic = document.getElementById('btn-inject-stochastic');
const btnRunAutoDemo = document.getElementById('btn-run-auto-demo');
const btnToggleAutopilot = document.getElementById('btn-toggle-autopilot');
const btnDirectorAutopilot = document.getElementById('btn-director-autopilot');
const copilotStatusBadge = document.getElementById('copilot-status-badge');

// Capacity / Dashboard elements
const activityLogContainer = document.getElementById('activity-log-list');
const clearActivityBtn = document.getElementById('clear-activity-btn');
const statQuotes = document.getElementById('stat-quotes');
const statCuts = document.getElementById('stat-cuts');
const statDeliveries = document.getElementById('stat-deliveries');
const toastContainer = document.getElementById('toast-container');

// Will Call elements
const opsWillCallView = document.getElementById('ops-willcall-view');
const wcTicketsContainer = document.getElementById('wc-tickets-container');
const wcDetailContent = document.getElementById('wc-detail-content');
const wcDetailActions = document.getElementById('wc-detail-actions');
const wcSearchInput = document.getElementById('wc-search');
const btnCreateWcTicket = document.getElementById('btn-create-wc-ticket');
const btnWcStage = document.getElementById('btn-wc-stage');
const btnWcReady = document.getElementById('btn-wc-ready');
const btnWcDispatch = document.getElementById('btn-wc-dispatch');

const wcFilterAll = document.getElementById('wc-filter-all');
const wcFilterPicking = document.getElementById('wc-filter-picking');
const wcFilterStaged = document.getElementById('wc-filter-staged');
const wcFilterReady = document.getElementById('wc-filter-ready');

// ==========================================
// 4. TOAST NOTIFICATION UTILITY
// ==========================================

function showToast(title, desc, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-circle-exclamation';
    if (type === 'error') icon = 'fa-solid fa-triangle-exclamation';
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="${icon}"></i></div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${desc}</p>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 400);
    }, 4500);
}

// ==========================================
// 5. VIEW & NAVIGATION SWITCHING
// ==========================================

function setView(view) {
    activeView = view;
    
    // Toggle split-desk class on workspace
    const workspace = document.querySelector('.outlook-main-workspace');
    if (workspace) {
        if (view === 'desk') {
            workspace.classList.add('split-desk-mode');
        } else {
            workspace.classList.remove('split-desk-mode');
        }
    }
    
    // Determine if this is an operations sub-view
    const isOpsView = (view === 'capacity' || view === 'logistics' || view === 'willcall' || view === 'smartcut');
    
    // Update rail buttons - keep 'capacity' rail highlighted for all ops sub-views
    railButtons.forEach(btn => {
        const btnView = btn.getAttribute('data-view');
        if (btnView === view || (btnView === 'capacity' && isOpsView)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Toggle folders sections
    mailFoldersSection.style.display = (view === 'mail' || view === 'desk') ? 'block' : 'none';
    contactsFoldersSection.style.display = view === 'contacts' ? 'block' : 'none';
    opsFoldersSection.style.display = isOpsView ? 'block' : 'none';
    
    // Toggle middle header items
    mailFiltersBar.style.display = (view === 'mail' || view === 'desk') ? 'flex' : 'none';
    contactsSearchBar.style.display = view === 'contacts' ? 'block' : 'none';
    
    // Toggle reading pane views
    mailReadingView.style.display = (view === 'mail' || view === 'desk') ? 'block' : 'none';
    contactDetailView.style.display = view === 'contacts' ? 'block' : 'none';
    opsCapacityView.style.display = view === 'capacity' ? 'block' : 'none';
    opsWillCallView.style.display = view === 'willcall' ? 'block' : 'none';
    inventoryView.style.display = view === 'inventory' ? 'block' : 'none';
    linecardView.style.display = view === 'linecard' ? 'block' : 'none';
    erpView.style.display = (view === 'erp' || view === 'desk') ? 'flex' : 'none';
    scratchView.style.display = view === 'scratch' ? 'block' : 'none';

    // Hide middle list pane on operations/inventory/linecard/erp/scratch views — only show for mail, contacts, and desk
    const listPane = document.querySelector('.outlook-list-pane');
    if (listPane) {
        listPane.style.display = (view === 'mail' || view === 'contacts' || view === 'desk') ? 'flex' : 'none';
    }

    // Show/hide folders pane based on selection
    if (view === 'inventory' || view === 'linecard' || view === 'erp' || view === 'scratch') {
        foldersPane.style.display = 'none';
    } else {
        foldersPane.style.display = 'flex';
    }

    if (view === 'mail' || view === 'desk') {
        paneTitleText.textContent = view === 'desk' ? 'Sales Desk Workspace' : 'Mail';
        renderMailList();
    } else if (view === 'contacts') {
        paneTitleText.textContent = 'People';
        renderContactsList();
    } else if (view === 'capacity') {
        paneTitleText.textContent = 'Operations';
        updateLogisticsView();
    } else if (view === 'willcall') {
        paneTitleText.textContent = 'Will Call Queue';
        renderWillCallList();
    } else if (view === 'inventory') {
        renderInventoryTable();
    } else if (view === 'linecard') {
        renderLineCards();
    } else if (view === 'scratch') {
        paneTitleText.textContent = 'Scratch Study';
        loadScratchFiles();
    }
}

// Bind folder/nav selection events
function initNavigation() {
    railButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setView(btn.getAttribute('data-view'));
        });
    });

    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state in folder list
            folderItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const folder = item.getAttribute('data-folder');
            const contactType = item.getAttribute('data-contact-type');
            const opsPanel = item.getAttribute('data-ops-panel');

            const isOpsActive = (activeView === 'capacity' || activeView === 'logistics' || activeView === 'willcall' || activeView === 'smartcut');

            if (activeView === 'mail' && folder) {
                activeFolder = folder;
                renderMailList();
            } else if (activeView === 'contacts' && contactType) {
                renderContactsList(contactType);
            } else if (isOpsActive && opsPanel) {
                if (opsPanel === 'dashboard' || opsPanel === 'logistics') {
                    setView('capacity');
                } else if (opsPanel === 'willcall') {
                    setView('willcall');
                } else if (opsPanel === 'smartcut') {
                    // Quick route to smartcut tab inside copilot
                    openCopilotTab('smartcut');
                }
            }
        });
    });

    // Sidebar add-in links
    document.getElementById('btn-shortcut-freight').addEventListener('click', () => {
        openCopilotTab('freight');
    });
    document.getElementById('btn-shortcut-smartcut').addEventListener('click', () => {
        openCopilotTab('smartcut');
    });
}

// ==========================================
// 6. MAIL ENGINE (INBOX, READ, RENDER)
// ==========================================

function renderMailList() {
    listItemsScroll.innerHTML = '';
    
    // Filter mails based on activeFolder
    let filtered = mailItems;
    if (activeFolder === 'sent') {
        filtered = sentMailItems;
    } else if (activeFolder === 'quarantine') {
        filtered = mailItems.filter(m => m.riskScore >= 75);
    } else {
        filtered = mailItems.filter(m => m.riskScore < 75);
    }
    
    if (filtered.length === 0) {
        listItemsScroll.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: var(--text-light); font-size: 12px;">
                <i class="fa-regular fa-folder-open" style="font-size: 24px; margin-bottom: 8px;"></i>
                <p>This folder is empty.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(mail => {
        const item = document.createElement('div');
        const isSelected = mail.id === activeMailId;
        item.className = `mail-item ${mail.unread ? 'unread' : ''} ${isSelected ? 'active' : ''}`;
        item.setAttribute('data-id', mail.id);
        
        let attachmentIcon = mail.hasAttachment ? '<i class="fa-solid fa-paperclip" title="Has attachment"></i>' : '';
        let riskScoreBadge = '';
        if (mail.riskScore > 0) {
            let severity = 'safe';
            if (mail.riskScore >= 75) severity = 'danger';
            else if (mail.riskScore >= 40) severity = 'warning';
            riskScoreBadge = `<span class="mail-risk-score-badge ${severity}">SecOps: ${mail.riskScore}%</span>`;
        }

        item.innerHTML = `
            <div class="mail-item-top">
                <span class="mail-sender">${mail.senderName}</span>
                <span class="mail-date">${mail.date.split(' ')[2] + ' ' + mail.date.split(' ')[3]}</span>
            </div>
            <div class="mail-subject">${mail.subject}</div>
            <div class="mail-snippet">${mail.snippet}</div>
            <div class="mail-badges-row">
                <div class="mail-icons-group">${attachmentIcon}</div>
                ${riskScoreBadge}
            </div>
        `;

        item.addEventListener('click', () => {
            selectMail(mail.id);
        });

        listItemsScroll.appendChild(item);
    });
}

function selectMail(id) {
    activeMailId = id;
    
    // Find in inbox or sent
    let mail = mailItems.find(m => m.id === id);
    if (!mail) mail = sentMailItems.find(m => m.id === id);
    if (!mail) return;

    // Mark as read
    if (mail.unread) {
        mail.unread = false;
        updateUnreadCount();
    }

    renderMailList();
    loadMailReadingPane(mail);
    updateWordDocTabForSelectedMail(id);
    resetCopilotParser();
}

function updateUnreadCount() {
    const unreadInboxCount = mailItems.filter(m => m.folder === 'inbox' && m.unread && m.riskScore < 75).length;
    document.getElementById('inbox-count-badge').textContent = unreadInboxCount;
}

function loadMailReadingPane(mail) {
    emailSubject.textContent = mail.subject;
    emailSenderName.textContent = mail.senderName;
    emailSenderAddress.textContent = mail.senderEmail;
    emailSenderAvatar.textContent = mail.senderName.charAt(0);
    emailRecipient.textContent = mail.recipient || 'sales@erpdistribution.com';
    emailDate.textContent = mail.date;
    emailBodyText.textContent = mail.body;

    // Attachments
    if (mail.hasAttachment) {
        emailAttachmentsRow.style.display = 'block';
        emailAttachmentName.textContent = mail.attachmentName;
    } else {
        emailAttachmentsRow.style.display = 'none';
    }

    // Security warning banner
    if (mail.warningBanner) {
        outlookSecurityBanner.style.display = 'flex';
        outlookSecurityBanner.className = `outlook-warning-banner ${mail.warningBanner.class}`;
        
        let actionButtonsHTML = mail.warningBanner.actions.map(act => {
            return `<button class="banner-btn" onclick="executeBannerAction('${mail.id}', '${act.action}')">${act.label}</button>`;
        }).join(' ');
        
        outlookSecurityBanner.innerHTML = `
            <div class="banner-icon"><i class="${mail.warningBanner.icon}"></i></div>
            <div class="banner-content">
                ${mail.warningBanner.text}
                <div class="banner-actions">${actionButtonsHTML}</div>
            </div>
        `;
    } else {
        outlookSecurityBanner.style.display = 'none';
    }

    // Clear copilot parse results if switching mail
    if (parsedQuoteData && parsedQuoteData.mailId !== mail.id) {
        resetCopilotParser();
    }

    // Update the ERP & Security add-in panel with this email's metadata
    updateERPPane(mail);

    // Show/hide Enter in ERP button if RFQ criteria met
    if (btnEnterErp) {
        const isRFQ = mail.subject.toLowerCase().includes('rfq') || mail.body.toLowerCase().includes('quote') || mail.body.toLowerCase().includes('wire') || mail.body.toLowerCase().includes('strut');
        btnEnterErp.style.display = isRFQ ? 'flex' : 'none';
    }
}

function updateERPPane(mail) {
    if (!erpCustomerId) return; // Guard clause if elements not loaded

    const emailLower = mail.senderEmail.toLowerCase();
    
    // Check if customer exists in ERP database
    let account = erpCustomerAccounts[emailLower];
    
    if (!account) {
        // Check if vendor
        if (emailLower.includes('mock') || emailLower.includes('durapvc') || emailLower.includes('libertywire') || emailLower.includes('titandevices')) {
            account = {
                customerId: 'VNDR-824',
                company: mail.senderName.replace(/\s*\(Vendor\)|\s*Support/gi, '') || 'Represented Vendor',
                creditLimit: 0,
                balanceDue: 0,
                status: 'ACTIVE VENDOR',
                statusClass: 'safe',
                statusBg: '#f0fdf4',
                statusColor: '#15803d',
                authDomain: emailLower.split('@')[1]
            };
        } else {
            // General external unknown account
            account = {
                customerId: 'UNREGISTERED',
                company: 'External Prospect / Lead',
                creditLimit: 0,
                balanceDue: 0,
                status: 'NEW PROSPECT',
                statusClass: 'warning',
                statusBg: '#fffbeb',
                statusColor: '#b45309',
                authDomain: emailLower.split('@')[1]
            };
        }
    }

    // 1. Update Profile Info
    erpCustomerId.textContent = account.customerId;
    erpCompanyName.textContent = account.company;
    
    erpAccountStatus.textContent = account.status;
    erpAccountStatus.style.background = account.statusBg;
    erpAccountStatus.style.color = account.statusColor;
    erpAccountStatus.className = `status-badge ${account.statusClass}`;
    
    if (account.customerId.startsWith('VNDR')) {
        erpCreditLimit.textContent = 'N/A (Vendor)';
        erpBalanceDue.textContent = 'N/A (Vendor)';
        erpAvailableCredit.textContent = 'N/A';
        erpAvailableCredit.style.color = 'var(--text-secondary)';
    } else if (account.customerId === 'UNREGISTERED') {
        erpCreditLimit.textContent = '$0.00';
        erpBalanceDue.textContent = '$0.00';
        erpAvailableCredit.textContent = '$0.00';
        erpAvailableCredit.style.color = 'var(--text-secondary)';
    } else {
        const availableCredit = account.creditLimit - account.balanceDue;
        erpCreditLimit.textContent = `$${account.creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        erpBalanceDue.textContent = `$${account.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        erpAvailableCredit.textContent = `$${availableCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (availableCredit > 10000) {
            erpAvailableCredit.style.color = '#15803d'; // Green
        } else if (availableCredit > 0) {
            erpAvailableCredit.style.color = '#b45309'; // Orange
        } else {
            erpAvailableCredit.style.color = '#b91c1c'; // Red
        }
    }

    // 2. Quote Credit Check Value
    if (parsedQuoteData && parsedQuoteData.mailId === mail.id) {
        const quoteVal = parsedQuoteData.total;
        erpQuoteValue.textContent = `$${quoteVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        if (account.customerId.startsWith('VNDR')) {
            erpCreditResultBox.textContent = "Manufacturer pricing notification (no credit evaluation needed).";
            erpCreditResultBox.style.background = "#fafbfc";
            erpCreditResultBox.style.color = "var(--text-secondary)";
        } else if (account.customerId === 'UNREGISTERED') {
            erpCreditResultBox.textContent = "HOLD: Unregistered Account. Credit application required.";
            erpCreditResultBox.style.background = "#fffbeb";
            erpCreditResultBox.style.color = "#b45309";
        } else {
            const availableCredit = account.creditLimit - account.balanceDue;
            if (quoteVal <= availableCredit) {
                erpCreditResultBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Quote approved. Fits in available credit.`;
                erpCreditResultBox.style.background = "#e6f4ea";
                erpCreditResultBox.style.color = "#137333";
            } else {
                erpCreditResultBox.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> CREDIT HOLD: Quote exceeds available credit by $${(quoteVal - availableCredit).toLocaleString('en-US', { maximumFractionDigits: 2 })}!`;
                erpCreditResultBox.style.background = "#fdf2f2";
                erpCreditResultBox.style.color = "#b91c1c";
            }
        }
    } else {
        erpQuoteValue.textContent = '$0.00';
        erpCreditResultBox.textContent = "No active quote to evaluate. Map RFQ first.";
        erpCreditResultBox.style.background = "#f3f2f1";
        erpCreditResultBox.style.color = "var(--text-secondary)";
    }

    // 3. Security and Fraud Checks
    const senderDomain = emailLower.split('@')[1];
    
    // Check domain alignment
    let isDomainAligned = false;
    if (account && account.authDomain) {
        isDomainAligned = senderDomain === account.authDomain;
    } else {
        isDomainAligned = !mail.warningBanner;
    }

    if (isDomainAligned) {
        erpDomainCheck.innerHTML = `<i class="fa-solid fa-circle-check"></i> MATCH`;
        erpDomainCheck.style.color = 'var(--color-safe)';
    } else {
        erpDomainCheck.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> MISMATCH`;
        erpDomainCheck.style.color = 'var(--color-danger)';
    }

    // DKIM / SPF checks based on risk score or warning banner
    if (mail.riskScore >= 75) {
        erpDkimCheck.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> FAIL`;
        erpDkimCheck.style.color = 'var(--color-danger)';
        erpSpfCheck.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> FAIL`;
        erpSpfCheck.style.color = 'var(--color-danger)';
        erpAgeCheck.textContent = '5 Days (Fresh)';
        erpAgeCheck.style.color = 'var(--color-danger)';
        
        erpFraudVerdict.innerHTML = `
            <i class="fa-solid fa-skull-crossbones"></i>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; font-weight: bold;">VERDICT: PHISHING TROJAN</span>
                <span style="font-size: 9px; font-weight: normal;">Critical spoof alert! Hard delete recommended.</span>
            </div>
        `;
        erpFraudVerdict.style.borderLeft = '4px solid #b91c1c';
        erpFraudVerdict.style.background = '#fdf2f2';
        erpFraudVerdict.style.color = '#b91c1c';
    } else if (mail.riskScore >= 20) {
        erpDkimCheck.innerHTML = `<i class="fa-solid fa-circle-check"></i> VALID`;
        erpDkimCheck.style.color = 'var(--color-safe)';
        erpSpfCheck.innerHTML = `<i class="fa-solid fa-circle-check"></i> PASS`;
        erpSpfCheck.style.color = 'var(--color-safe)';
        erpAgeCheck.textContent = '2 Weeks';
        erpAgeCheck.style.color = 'var(--color-warning)';
        
        erpFraudVerdict.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; font-weight: bold;">VERDICT: SUSPICIOUS SENDER</span>
                <span style="font-size: 9px; font-weight: normal;">Fresh domain and pricing sheet harvesting pattern.</span>
            </div>
        `;
        erpFraudVerdict.style.borderLeft = '4px solid #b45309';
        erpFraudVerdict.style.background = '#fffbeb';
        erpFraudVerdict.style.color = '#b45309';
    } else {
        erpDkimCheck.innerHTML = `<i class="fa-solid fa-circle-check"></i> VALID`;
        erpDkimCheck.style.color = 'var(--color-safe)';
        erpSpfCheck.innerHTML = `<i class="fa-solid fa-circle-check"></i> PASS`;
        erpSpfCheck.style.color = 'var(--color-safe)';
        erpAgeCheck.textContent = account && account.customerId.startsWith('VNDR') ? '10+ Years' : '2.4 Years';
        erpAgeCheck.style.color = 'var(--color-safe)';
        
        erpFraudVerdict.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 10px; font-weight: bold;">VERDICT: SAFE SENDER</span>
                <span style="font-size: 9px; font-weight: normal;">No threat markers detected. Verification passed.</span>
            </div>
        `;
        erpFraudVerdict.style.borderLeft = '4px solid #15803d';
        erpFraudVerdict.style.background = '#f0fdf4';
        erpFraudVerdict.style.color = '#15803d';
    }

    // Render customer order history log
    renderERPOrderLog(account.customerId);
}

function renderERPOrderLog(customerId) {
    if (!erpOrdersLogList || !erpOrderCount) return;
    
    const orders = customerOrdersDatabase[customerId] || [];
    erpOrderCount.textContent = `${orders.length} Order${orders.length === 1 ? '' : 's'}`;
    
    if (orders.length === 0) {
        erpOrdersLogList.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 16px 0; font-style: italic;">
                No order history found for this account.
            </div>
        `;
    } else {
        erpOrdersLogList.innerHTML = orders.map(order => {
            let badgeStyle = '';
            if (order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'shipped') {
                badgeStyle = 'background: #e6f4ea; color: #137333;';
            } else if (order.status.toLowerCase() === 'hold') {
                badgeStyle = 'background: #fdf2f2; color: #b91c1c;';
            } else {
                badgeStyle = 'background: #fffbeb; color: #b45309;';
            }
            
            const priceStr = typeof order.price === 'number' ? 
                `$${order.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                order.price;

            return `
                <div class="order-log-row" style="display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 8px; border-bottom: 1px solid #edebe9; border-radius: 4px; background: #fafbfc; margin-bottom: 4px;">
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span style="font-weight: 600; color: var(--text-primary); font-size: 11px;">${order.orderId} <span style="font-weight: normal; color: var(--text-secondary);">(${order.date})</span></span>
                        <span style="color: var(--text-secondary); font-size: 10px; line-height: 1.2;">${order.items}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; min-width: 70px;">
                        <span style="font-weight: 600; color: var(--text-primary); font-size: 11px;">${priceStr}</span>
                        <span class="status-badge" style="font-size: 8px; padding: 1px 4px; font-weight: bold; border-radius: 3px; display: inline-block; ${badgeStyle}">${order.status.toUpperCase()}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Action triggers from warning banner
window.executeBannerAction = function(mailId, action) {
    const mail = mailItems.find(m => m.id === mailId);
    if (!mail) return;

    if (action === 'quarantine') {
        mail.riskScore = 98;
        showToast('SecOps Dispatch Alert', 'Email quarantined. Sending threat heuristic report to executive office.', 'warning');
        
        // Auto open the doc briefing tab and type quarantine audit report
        openCopilotTab('doc');
        triggerDocBriefingForMail(mailId);
        
        // Dispatch API
        fetch('/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: mail.subject,
                decision: 'QUARANTINE & BLOCK SOURCE',
                reasoning: `Look-alike domain spoofing bypass triggered on incoming message from: ${mail.senderEmail}. Sender envelope mimics executive Specialist D.`,
                logs: [
                    'Analyze-Email.ps1 message flagged: MSG-SEC-84225',
                    'WARNING: SPF records alignment failed.',
                    'DMARC: Alignment fail. Quarantining mail object.',
                    'ACTION: Locked external relay IP 203.0.113.111.'
                ]
            })
        }).then(res => res.json())
        .then(data => {
            showToast('Email Dispatch', 'Threat report successfully emailed to kdp10891@outlook.com via Outlook COM');
        }).catch(err => console.error(err));

        activeFolder = 'quarantine';
        renderMailList();
    } else if (action === 'delete') {
        mailItems = mailItems.filter(m => m.id !== mailId);
        showToast('System Action', 'Email permanently purged from Exchange database', 'error');
        renderMailList();
        if (mailItems.length > 0) selectMail(mailItems[0].id);
    }
};

// ==========================================
// 7. CONTACTS BOOK ENGINE (PEOPLE TAB)
// ==========================================

function renderContactsList(type = 'all') {
    listItemsScroll.innerHTML = '';
    
    let filtered = contacts;
    if (type !== 'all') {
        filtered = contacts.filter(c => c.type === type);
    }

    if (filtered.length === 0) {
        listItemsScroll.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light);">No contacts.</div>';
        return;
    }

    filtered.forEach(c => {
        const item = document.createElement('div');
        const isSelected = c.id === activeContactId;
        item.className = `contact-list-item ${isSelected ? 'active' : ''}`;
        
        let avatarClass = c.type === 'vendors' ? 'vendor' : '';

        item.innerHTML = `
            <div class="contact-item-avatar ${avatarClass}">${c.name.split(' ').map(n=>n[0]).join('')}</div>
            <div class="contact-item-info">
                <div class="contact-item-name">${c.name}</div>
                <div class="contact-item-sub">${c.company}</div>
            </div>
        `;

        item.addEventListener('click', () => {
            selectContact(c.id);
        });

        listItemsScroll.appendChild(item);
    });

    if (filtered.length > 0 && !activeContactId) {
        selectContact(filtered[0].id);
    }
}

function selectContact(id) {
    activeContactId = id;
    
    // Update active list state
    document.querySelectorAll('.contact-list-item').forEach(el => el.classList.remove('active'));
    const activeEl = Array.from(document.querySelectorAll('.contact-list-item')).find(el => el.querySelector('.contact-item-name').textContent === contacts.find(c=>c.id === id).name);
    if (activeEl) activeEl.classList.add('active');

    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    cardName.textContent = contact.name;
    cardRole.textContent = `${contact.type === 'vendors' ? 'Manufacturer Vendor Partner' : 'Customer Client'} â€¢ ${contact.company}`;
    cardEmail.textContent = contact.email;
    cardPhone.textContent = contact.phone;
    cardAddress.textContent = contact.address;
    cardBrands.textContent = contact.brands;
    cardAvatar.textContent = contact.name.split(' ').map(n=>n[0]).join('');
    cardAvatar.className = `contact-card-avatar ${contact.type === 'vendors' ? 'vendor' : ''}`;
}

// Search contacts
contactSearchInput.addEventListener('input', () => {
    const val = contactSearchInput.value.toLowerCase();
    const items = listItemsScroll.querySelectorAll('.contact-list-item');
    items.forEach(item => {
        const name = item.querySelector('.contact-item-name').textContent.toLowerCase();
        const company = item.querySelector('.contact-item-sub').textContent.toLowerCase();
        if (name.includes(val) || company.includes(val)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// ==========================================
// 8. COMPOSE & SEND ENGINE
// ==========================================

let currentEmailTypingInterval = null;

function typeEmailBody(text, callback) {
    const el = document.getElementById('compose-body');
    if (!el) {
        callback();
        return;
    }
    if (currentEmailTypingInterval) {
        clearInterval(currentEmailTypingInterval);
    }
    el.value = '';
    let i = 0;
    currentEmailTypingInterval = setInterval(() => {
        if (i < text.length) {
            el.value += text.substr(i, 2);
            el.scrollTop = el.scrollHeight;
            i += 2;
        } else {
            clearInterval(currentEmailTypingInterval);
            currentEmailTypingInterval = null;
            el.value = text;
            setTimeout(callback, 500);
        }
    }, 10);
}

function openComposeMail(to = '', subject = '', body = '', attachment = null, simulateTyping = false, typingCallback = null) {
    composeTo.value = to;
    composeSubject.value = subject;
    
    if (attachment) {
        selectedAttachmentToAttach = attachment;
        composeAttachmentsBar.style.display = 'block';
        composeAttachmentLabel.textContent = attachment;
    } else {
        selectedAttachmentToAttach = null;
        composeAttachmentsBar.style.display = 'none';
    }

    composeModal.style.display = 'flex';
    
    if (simulateTyping) {
        typeEmailBody(body, typingCallback);
    } else {
        composeBody.value = body;
        if (typingCallback) typingCallback();
    }
}

btnNewMail.addEventListener('click', () => {
    openComposeMail();
});

// Set true after the first failed /api call so we stop hammering a backend
// that isn't there (e.g. static GitHub Pages hosting) and use demo data instead.
var backendOffline = false;

function syncOutlookMailbox(silent = false) {
    if (backendOffline) {
        // No live backend — inbox already shows the in-browser demo data.
        if (!silent) showToast('Sync Complete', 'Inbox is up to date (demo data).', 'info');
        return Promise.resolve();
    }
    if (!silent) {
        showToast('Syncing Inbox', 'Checking Outlook inbox for new messages...', 'info');
    }

    const icon = btnRefreshMail ? btnRefreshMail.querySelector('i') : null;
    if (icon) icon.classList.add('fa-spin');
    if (btnRefreshMail) btnRefreshMail.disabled = true;

    return fetch('/api/outlook-inbox')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.emails) {
                let newCount = 0;
                data.emails.forEach(email => {
                    if (email.folder === 'sent') {
                        const exists = sentMailItems.some(m => m.id === email.id || m.subject === email.subject);
                        if (!exists) {
                            sentMailItems.unshift(email);
                            newCount++;
                        }
                    } else {
                        const exists = mailItems.some(m => m.id === email.id || (m.subject === email.subject && m.date === email.date));
                        if (!exists) {
                            if (!email.riskLabel) {
                                if (email.riskScore >= 75) {
                                    email.riskLabel = 'DANGER';
                                    email.riskColor = 'var(--color-danger)';
                                } else if (email.riskScore >= 30) {
                                    email.riskLabel = 'SUSPICIOUS';
                                    email.riskColor = 'var(--color-warning)';
                                } else {
                                    email.riskLabel = 'SAFE';
                                    email.riskColor = 'var(--color-safe)';
                                }
                            }
                            mailItems.unshift(email);
                            newCount++;
                        }
                    }
                });
                
                if (newCount > 0) {
                    if (!silent) {
                        showToast('Sync Complete', `Successfully retrieved ${newCount} new email(s).`, 'success');
                    }
                    renderMailList();
                    if (vacationAutopilotActive) {
                        scanAndProcessUnreadEmails();
                    }
                } else {
                    if (!silent) {
                        showToast('Sync Complete', 'Inbox is already up to date.', 'info');
                    }
                }
            } else if (data.simulated) {
                if (!silent) {
                    showToast('Sync Complete', 'Inbox synchronized successfully (simulated).', 'success');
                }
            } else {
                if (!silent) {
                    showToast('Sync Failed', 'Failed to retrieve emails from server.', 'error');
                }
            }
        })
        .catch(err => {
            backendOffline = true;
            console.info('Backfeed: no live backend detected — running on in-browser demo data.');
            if (!silent) {
                showToast('Demo Mode', 'No live backend — showing in-browser demo data.', 'info');
            }
        })
        .finally(() => {
            if (icon) icon.classList.remove('fa-spin');
            if (btnRefreshMail) btnRefreshMail.disabled = false;
        });
}

if (btnRefreshMail) {
    btnRefreshMail.addEventListener('click', () => {
        syncOutlookMailbox(false);
    });
}

btnContactEmail.addEventListener('click', () => {
    const contact = contacts.find(c => c.id === activeContactId);
    if (contact) {
        openComposeMail(contact.email, '', '');
    }
});

btnReplyEmail.addEventListener('click', () => {
    let mail = mailItems.find(m => m.id === activeMailId);
    if (!mail) mail = sentMailItems.find(m => m.id === activeMailId);
    if (mail) {
        openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, `\n\n-----Original Message-----\nFrom: ${mail.senderName}\nSent: ${mail.date}\n\n${mail.body}`);
    }
});

btnCloseCompose.addEventListener('click', () => { composeModal.style.display = 'none'; });
btnDiscardCompose.addEventListener('click', () => { composeModal.style.display = 'none'; });

// File Attachment mock
btnAttachFile.addEventListener('click', () => {
    selectedAttachmentToAttach = "ERP_Quote_Proposal.xlsx";
    composeAttachmentsBar.style.display = 'block';
    composeAttachmentLabel.textContent = selectedAttachmentToAttach;
    showToast('Attachment Added', 'Successfully attached spreadsheet: ERP_Quote_Proposal.xlsx', 'success');
});

btnRemoveAttachment.addEventListener('click', () => {
    selectedAttachmentToAttach = null;
    composeAttachmentsBar.style.display = 'none';
    showToast('Attachment Removed', 'File attachment removed from compose window.', 'info');
});

// Send Mail execution
btnSendMail.addEventListener('click', () => {
    const to = composeTo.value.trim();
    const subject = composeSubject.value.trim();
    const body = composeBody.value;
    
    if (!to) {
        showToast('Error', 'Please enter a recipient email address.', 'error');
        return;
    }

    const newMail = {
        id: `sent-${Date.now()}`,
        senderName: 'Sales Desk',
        senderEmail: 'sales@erpdistribution.com',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: subject || '(No Subject)',
        snippet: body.substring(0, 60) + '...',
        body: body,
        folder: 'sent',
        unread: false,
        recipient: to,
        hasAttachment: !!selectedAttachmentToAttach,
        attachmentName: selectedAttachmentToAttach || '',
        riskScore: 0
    };

    const emailLower = to.toLowerCase();
    const account = erpCustomerAccounts[emailLower];
    
    let orderId = '';
    let itemsDescription = "Electrical Supplies";
    let orderPrice = 0;

    if (account) {
        lastOrderId++;
        orderId = `SO-${lastOrderId}`;
        
        if (parsedQuoteData && parsedQuoteData.items && parsedQuoteData.items.length > 0) {
            itemsDescription = parsedQuoteData.items.map(item => `${item.qty} ${item.brandName}`).join(', ');
            if (itemsDescription.length > 60) itemsDescription = itemsDescription.substring(0, 57) + '...';
            orderPrice = parsedQuoteData.total;
        } else {
            if (subject.toLowerCase().includes('strut') || body.toLowerCase().includes('strut')) {
                itemsDescription = "Titan B-Line Strut Channel";
                orderPrice = 1728.00;
            } else if (subject.toLowerCase().includes('copper') || body.toLowerCase().includes('copper')) {
                itemsDescription = "Liberty Copper Cable THHN";
                orderPrice = 3840.00;
            } else {
                itemsDescription = "Standard Distributor Materials";
                orderPrice = 2450.00;
            }
        }
    }

    composeModal.style.display = 'none';

    const term = document.getElementById('app-erp-cli-terminal');
    const inputEl = document.getElementById('app-cli-input-text');
    
    if (account && term && inputEl) {
        openCopilotTab('erp');
        
        function typeCommand(text, callback) {
            inputEl.textContent = '';
            inputEl.style.color = '#fff';
            let charIdx = 0;
            const typingInterval = setInterval(() => {
                if (charIdx < text.length) {
                    inputEl.textContent += text.charAt(charIdx);
                    charIdx++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(callback, 200);
                }
            }, 15);
        }

        function addTermLine(cmd, res, color) {
            const line = document.createElement('div');
            line.className = 'cli-line';
            line.style.color = '#64748b';
            line.textContent = `> ${cmd}`;
            const resLine = document.createElement('div');
            resLine.className = 'cli-line';
            resLine.style.color = color;
            resLine.textContent = res;
            const promptLine = document.getElementById('app-cli-prompt-line');
            term.insertBefore(line, promptLine);
            term.insertBefore(resLine, promptLine);
            term.scrollTop = term.scrollHeight;
        }

        const cmd1 = `set-customer --id=${account.customerId}`;
        typeCommand(cmd1, () => {
            addTermLine(cmd1, `[ERP System] Active Customer: ${account.company}`, '#10b981');
            const cmd2 = `add-order-lines --value=${orderPrice.toFixed(2)}`;
            typeCommand(cmd2, () => {
                addTermLine(cmd2, `[ERP System] Line items added. Total: $${orderPrice.toFixed(2)}`, '#38bdf8');
                const cmd3 = `ship-order --mode=flatbed --id=${orderId}`;
                typeCommand(cmd3, () => {
                    addTermLine(cmd3, `[ERP System] Order shipped. Dispatch scheduled.`, '#10b981');
                    inputEl.textContent = 'Awaiting command...';
                    inputEl.style.color = '#64748b';
                    finalizeSend();
                });
            });
        });
    } else {
        finalizeSend();
    }

    function finalizeSend() {
        sentMailItems.unshift(newMail);
        if (account) {
            if (!customerOrdersDatabase[account.customerId]) customerOrdersDatabase[account.customerId] = [];
            customerOrdersDatabase[account.customerId].unshift({
                orderId: orderId,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                items: itemsDescription,
                price: orderPrice,
                status: 'Processing'
            });
            account.balanceDue += orderPrice;
            addActivityItem(`ERP Order Entered: Created Sales Order ${orderId} for ${account.company} - Total: $${orderPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            showToast('ERP Order Entered', `Sales Order ${orderId} registered in ERP for ${account.company}`, 'success');
            
            let activeMail = mailItems.find(m => m.id === activeMailId);
            if (!activeMail) activeMail = sentMailItems.find(m => m.id === activeMailId);
            if (activeMail && activeMail.senderEmail.toLowerCase() === emailLower) {
                updateERPPane(activeMail);
            }
        }
        
        addActivityItem(`Sent email to ${to}: "${subject || 'No Subject'}"`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('Success', `Email sent successfully to ${to}!`);

        if (activeView === 'mail' && activeFolder === 'sent') {
            renderMailList();
        }

        if (to.includes('vanguard') || to.includes('contractors') || subject.toLowerCase().includes('quote')) {
            setTimeout(() => {
                injectSimulatedReply(to, subject);
            }, 8000);
        }
    }
});

function injectSimulatedReply(originalTo, originalSubject) {
    const sender = contacts.find(c => c.email === originalTo) || { name: 'Client Desk', email: originalTo };
    const cleanSubject = originalSubject.replace(/re:\s*/i, '');
    
    const replyMail = {
        id: `mail-reply-${Date.now()}`,
        senderName: sender.name,
        senderEmail: sender.email,
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: `RE: ${cleanSubject}`,
        snippet: 'Thank you for the quote proposal. The pricing looks aligned. We will submit a PO...',
        body: `Hi there,

Thank you for the quick quote proposal. The pricing and freight consolidation options look aligned. 

We will submit a formal Purchase Order (PO) to ERP Distribution by tomorrow morning to release the materials. Please schedule the flatbed dispatch to our Deptford storage yard branch as planned.

Best regards,
${sender.name}`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0
    };

    mailItems.unshift(replyMail);
    updateUnreadCount();
    
    addActivityItem(`Received reply from ${sender.name} regarding "${cleanSubject}"`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    showToast('New Message Received', `From: ${sender.name} - RE: ${cleanSubject}`, 'success');

    if (activeView === 'mail' && activeFolder === 'inbox') {
        renderMailList();
    }
}

// Contacts autocomplete support
composeTo.addEventListener('focus', showContactsDropdown);
composeTo.addEventListener('input', showContactsDropdown);
document.addEventListener('click', (e) => {
    if (!e.target.closest('#compose-to') && !e.target.closest('#compose-contacts-list')) {
        composeContactsList.style.display = 'none';
    }
});

function showContactsDropdown() {
    const val = composeTo.value.toLowerCase();
    const matched = contacts.filter(c => c.name.toLowerCase().includes(val) || c.email.toLowerCase().includes(val));
    
    if (matched.length === 0) {
        composeContactsList.style.display = 'none';
        return;
    }

    composeContactsList.innerHTML = '';
    matched.forEach(c => {
        const row = document.createElement('div');
        row.className = 'compose-contact-option';
        row.textContent = `${c.name} (${c.email})`;
        row.addEventListener('click', () => {
            composeTo.value = c.email;
            composeContactsList.style.display = 'none';
        });
        composeContactsList.appendChild(row);
    });
    
    composeContactsList.style.display = 'block';
}

// ==========================================
// 9. BACKFEED ADD-IN: SPEED-QUOTE & PARSER
// ==========================================

function openCopilotTab(tab) {
    if (isCopilotOpen === false) {
        toggleCopilot();
    }

    activeCopilotTab = tab;
    
    // Update headers
    copilotTabs.forEach(t => {
        if (t.getAttribute('data-copilot-tab') === tab) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    // Toggle tab panels
    copilotTabBodies.forEach(b => {
        if (b.id === `copilot-body-${tab}`) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    if (tab === 'freight') {
        renderFreightCalculator();
    } else if (tab === 'smartcut') {
        calculateReelSpecs();
    }
}

function toggleCopilot() {
    isCopilotOpen = !isCopilotOpen;
    if (isCopilotOpen) {
        copilotSidebar.classList.remove('collapsed');
        btnToggleCopilot.querySelector('i').className = 'fa-solid fa-chevron-right';
    } else {
        copilotSidebar.classList.add('collapsed');
        btnToggleCopilot.querySelector('i').className = 'fa-solid fa-chevron-left';
    }
}

btnToggleCopilot.addEventListener('click', toggleCopilot);

copilotTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        openCopilotTab(tab.getAttribute('data-copilot-tab'));
    });
});

// Context Router Bindings & Logic
if (btnEnterErp) {
    btnEnterErp.addEventListener('click', openContextRouter);
}
if (btnAgentEnterErp) {
    btnAgentEnterErp.addEventListener('click', openContextRouter);
}
if (btnCloseRouting) {
    btnCloseRouting.addEventListener('click', closeContextRouter);
}
if (btnCancelRouting) {
    btnCancelRouting.addEventListener('click', closeContextRouter);
}
if (btnRouteStock) {
    btnRouteStock.addEventListener('click', () => setRoutingSelection('stock'));
}
if (btnRouteDirect) {
    btnRouteDirect.addEventListener('click', () => setRoutingSelection('direct'));
}
if (btnExecuteRouting) {
    btnExecuteRouting.addEventListener('click', executeRoutingAutopilot);
}

function openContextRouter() {
    let mail = mailItems.find(m => m.id === activeMailId);
    if (!mail) mail = sentMailItems.find(m => m.id === activeMailId);
    
    const customerName = erpCompanyName ? erpCompanyName.textContent : 'Vanguard Contractors LLC';
    const customerId = erpCustomerId ? erpCustomerId.textContent : 'CUST-VG-992';
    
    if (routerCustomerName) routerCustomerName.textContent = customerName;
    if (routerCustomerId) routerCustomerId.textContent = customerId;
    
    if (parsedQuoteData && parsedQuoteData.items && parsedQuoteData.items.length > 0) {
        if (routerQuoteTotal) routerQuoteTotal.textContent = '$' + parsedQuoteData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (routerLineCount) routerLineCount.textContent = `${parsedQuoteData.items.length} item${parsedQuoteData.items.length > 1 ? 's' : ''}`;
        
        const firstSku = parsedQuoteData.items[0].sku;
        if (routerVendor) {
            if (firstSku.includes('STRUT') || firstSku.includes('TITAN')) {
                routerVendor.value = 'VNDR-711';
            } else if (firstSku.includes('PVC') || firstSku.includes('DURA')) {
                routerVendor.value = 'VNDR-310';
            } else {
                routerVendor.value = 'VNDR-824';
            }
        }
    } else {
        if (routerQuoteTotal) routerQuoteTotal.textContent = '$0.00';
        if (routerLineCount) routerLineCount.textContent = '0 items';
        if (routerVendor) routerVendor.value = 'VNDR-824';
    }
    
    setRoutingSelection('stock');
    if (erpRoutingModal) erpRoutingModal.classList.add('active');
}

function closeContextRouter() {
    if (erpRoutingModal) erpRoutingModal.classList.remove('active');
}

function setRoutingSelection(type) {
    selectedRoutingType = type;
    if (type === 'stock') {
        if (btnRouteStock) btnRouteStock.classList.add('active');
        if (btnRouteDirect) btnRouteDirect.classList.remove('active');
        if (routerVendorGroup) routerVendorGroup.classList.remove('active');
    } else {
        if (btnRouteStock) btnRouteStock.classList.remove('active');
        if (btnRouteDirect) btnRouteDirect.classList.add('active');
        if (routerVendorGroup) routerVendorGroup.classList.add('active');
    }
}

function executeRoutingAutopilot() {
    closeContextRouter();
    
    const customerId = erpCustomerId ? erpCustomerId.textContent : 'C-1001';
    
    const payload = {
        isQuote: true,
        customerId: customerId,
        po: `PO-${selectedRoutingType.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        routingType: selectedRoutingType,
        vendor: routerVendor ? routerVendor.value : 'VNDR-824',
        items: parsedQuoteData ? parsedQuoteData.items.map(x => ({ sku: x.sku, qty: x.qty })) : []
    };
    
    setView('erp');
    
    const profile = erpConnector.getProfile();
    const isDemoMode = erpConnector.isDemoMode();
    
    if (isDemoMode && profile && profile.supportsPostMessage) {
        // Demo mode: call visual order entry directly (inlined, same document)
        setTimeout(() => {
            if (typeof window.startVisualOrderEntry === 'function') {
                console.log("Calling startVisualOrderEntry directly:", payload);
                window.startVisualOrderEntry(payload);
            } else {
                console.error("startVisualOrderEntry not available — ERP module may not have loaded");
            }
        }, 500);
    } else {
        // External ERP: queue order for server-side Playwright agent
        const profileName = profile ? profile.name : 'Unknown ERP';
        showToast('Order Queued', `Order dispatched to ${profileName} via Backfeed Agent. Payload logged to ERP terminal.`, 'success');
        
        // Log to the ERP terminal panel
        const terminal = document.getElementById('app-erp-cli-terminal');
        if (terminal) {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const logLine = document.createElement('div');
            logLine.className = 'cli-line';
            logLine.style.color = '#f59e0b';
            logLine.innerHTML = `[${now}] AGENT-DISPATCH → ${profileName} | PO: ${payload.po} | Items: ${payload.items.length} | Route: ${payload.routingType}`;
            terminal.insertBefore(logLine, terminal.lastElementChild);
        }
    }
}

// Custom text parser toggle
btnOpenTextParser.addEventListener('click', () => {
    customParseBox.style.display = customParseBox.style.display === 'none' ? 'block' : 'none';
});


btnParseSelected.addEventListener('click', () => {
    let mail = mailItems.find(m => m.id === activeMailId);
    if (!mail) mail = sentMailItems.find(m => m.id === activeMailId);
    if (mail) {
        executeRFQParse(mail.body, mail.id);
    } else {
        showToast('Error', 'No email selected to parse.', 'error');
    }
});

btnExecuteCustomParse.addEventListener('click', () => {
    const text = rfqTextInput.value.trim();
    if (text) {
        executeRFQParse(text, 'custom');
        customParseBox.style.display = 'none';
    } else {
        showToast('Warning', 'Please enter some text to parse.', 'warning');
    }
});

function executeRFQParse(text, mailId) {
    laserScanBox.style.display = 'block';
    
    // Simulate AI parsing latency
    setTimeout(() => {
        laserScanBox.style.display = 'none';
        
        const results = parseRFQLines(text);
        parsedQuoteData = {
            mailId: mailId,
            items: results.items,
            total: results.total,
            consolidated: false
        };

        renderParsedResults();
        showToast('RFQ Mapped Successfully', `Extracted ${results.items.length} items. Mapped to specialists.`, 'success');
        
        // Update ERP panel with new quote calculation
        let mail = mailItems.find(m => m.id === mailId);
        if (!mail) mail = sentMailItems.find(m => m.id === mailId);
        if (mail) {
            updateERPPane(mail);
        } else if (mailId === 'custom') {
            updateERPPane({ senderEmail: 'unregistered@lead.com', senderName: 'External Lead', riskScore: 0, body: text });
        }

        // Auto open the doc briefing tab to show the agent note-taking!
        openCopilotTab('doc');
        triggerDocBriefingForMail(mailId || 'fallback-id');
        
        // Flash stats update
        let cur = parseInt(statQuotes.textContent);
        statQuotes.textContent = cur + 1;
        
    }, 1500);
}


function parseRFQLines(text) {
    const lines = text.split('\n');
    const results = [];
    let totalPrice = 0;
    
    lines.forEach(line => {
        const qtyMatch = line.match(/(\d[\d,]*)\s*(?:ft|pieces|pcs|feet|units|fuses|plates|connectors|boxes|sticks|spools|ea)?/i);
        if (!qtyMatch) return;
        const qty = parseInt(qtyMatch[1].replace(/,/g, ''));
        if (isNaN(qty) || qty <= 0) return;

        const lineUpper = line.toUpperCase();
        let matchedProduct = null;
        
        // Try exact SKU match
        for (const prod of PRODUCT_CATALOG) {
            if (lineUpper.includes(prod.sku)) {
                matchedProduct = prod;
                break;
            }
        }
        
        // Try keyword match
        if (!matchedProduct) {
            for (const prod of PRODUCT_CATALOG) {
                if (prod.keywords.some(kw => lineUpper.includes(kw.toUpperCase()))) {
                    matchedProduct = prod;
                    break;
                }
            }
        }
        
        if (matchedProduct) {
            const matchedBrand = lineCardBrands.find(b => b.id === matchedProduct.brandId);
            if (matchedBrand) {
                let unitPrice = matchedProduct.price;
                
                // Price lock override for WIR-THHN12 if sender is Client Company
                let isTriState = text.toUpperCase().includes('CLIENT COMPANY');
                if (matchedProduct.sku === 'WIR-THHN12' && isTriState) {
                    unitPrice = 0.31;
                }
                
                const itemPrice = qty * unitPrice;
                totalPrice += itemPrice;
                
                results.push({
                    sku: matchedProduct.sku,
                    qty: qty,
                    origText: matchedProduct.desc,
                    brandId: matchedBrand.id,
                    brandName: matchedBrand.name,
                    category: matchedBrand.category,
                    insideRep: matchedBrand.insideRep,
                    prepaid: matchedBrand.prepaid,
                    prepaidValue: matchedBrand.prepaidValue,
                    price: itemPrice,
                    weight: qty * matchedProduct.weight
                });
            }
        }
    });
    
    return {
        items: results,
        total: totalPrice
    };
}

function renderParsedResults() {
    parsedItemsContainer.innerHTML = '';
    
    if (!parsedQuoteData || parsedQuoteData.items.length === 0) {
        parsedItemsContainer.innerHTML = `
            <div class="parsed-placeholder">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <p>Select an RFQ email and click "Auto-Parse Email" to extract line items.</p>
            </div>
        `;
        if (btnAgentEnterErp) btnAgentEnterErp.style.display = 'none';
        return;
    }

    parsedQuoteData.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'parsed-item-row';
        row.innerHTML = `
            <div class="parsed-item-qty">${item.qty}</div>
            <div class="parsed-item-details">
                <div class="parsed-item-name">${item.origText}</div>
                <div class="parsed-item-spec">Spec: <strong>${item.insideRep}</strong> | Min: ${item.prepaid}</div>
            </div>
            <span class="parsed-item-status" style="background: rgba(46,196,182,0.1); border: 1px solid rgba(46,196,182,0.3); color: var(--accent-cyan); font-weight: bold;">
                Mapped
            </span>
        `;
        parsedItemsContainer.appendChild(row);
    });

    if (btnAgentEnterErp) btnAgentEnterErp.style.display = 'block';
}

function resetCopilotParser() {
    parsedQuoteData = null;
    renderParsedResults();
    renderFreightCalculator();
    if (btnAgentEnterErp) btnAgentEnterErp.style.display = 'none';
}

// ==========================================
// 10. BACKFEED ADD-IN: FREIGHT & CONSOLIDATION
// ==========================================

function renderFreightCalculator() {
    if (!parsedQuoteData) {
        calcTotalWeight.textContent = '0 lbs';
        calcTotalPrice.textContent = '$0.00';
        calcShippingCapacity.textContent = '0%';
        calcCapacityBar.style.width = '0%';
        freightBrandsBreakdownList.innerHTML = '<div style="font-size: 11px; color: var(--text-light); text-align: center; padding: 10px 0;">No active calculation data. Mapped RFQ first.</div>';
        consolidationRecommendationBox.style.display = 'none';
        return;
    }

    // Group items by brand
    const groups = {};
    let totalWeight = 0;
    
    parsedQuoteData.items.forEach(item => {
        if (!groups[item.brandId]) {
            groups[item.brandId] = {
                brandName: item.brandName,
                prepaidValue: item.prepaidValue,
                prepaidText: item.prepaid,
                totalPrice: 0,
                totalWeight: 0
            };
        }
        groups[item.brandId].totalPrice += item.price;
        groups[item.brandId].totalWeight += item.weight;
        totalWeight += item.weight;
    });

    calcTotalWeight.textContent = `${totalWeight.toLocaleString([], {maximumFractionDigits: 0})} lbs`;
    calcTotalPrice.textContent = `$${parsedQuoteData.total.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Truck capacity math
    const truckLimit = 24000; // standard flatbed capacity (lbs)
    let percentCapacity = (totalWeight / truckLimit) * 100;
    if (percentCapacity > 100) percentCapacity = 100;
    calcShippingCapacity.textContent = `${percentCapacity.toFixed(1)}%`;
    calcCapacityBar.style.width = `${percentCapacity}%`;

    // Render breakdowns
    freightBrandsBreakdownList.innerHTML = '';
    let hasConsolidationChance = false;
    let consolidationBrandId = '';
    let targetFreightSaving = 0;

    Object.keys(groups).forEach(bId => {
        const g = groups[bId];
        const isPrepaidMet = g.totalPrice >= g.prepaidValue;
        
        let prepaidClass = isPrepaidMet ? 'yes' : 'no';
        let prepaidText = isPrepaidMet ? 'FREE FREIGHT' : 'Freight Add-on';
        
        if (!isPrepaidMet) {
            hasConsolidationChance = true;
            consolidationBrandId = bId;
            targetFreightSaving += 350; // standard flatbed carrier charge per line
        }

        const el = document.createElement('div');
        el.className = 'freight-brand-item';
        el.innerHTML = `
            <div class="freight-brand-header">
                <span>${g.brandName}</span>
                <span class="freight-prepaid-status ${prepaidClass}">${prepaidText}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary); margin-top: 2px;">
                <span>Value: $${g.totalPrice.toLocaleString([], {maximumFractionDigits: 0})} / Min: ${g.prepaidText}</span>
                <span>Weight: ${g.totalWeight.toLocaleString([], {maximumFractionDigits: 0})} lbs</span>
            </div>
        `;
        freightBrandsBreakdownList.appendChild(el);
    });

    // Check consolidation recommendations
    // If we have parsed quote items and some brands haven't met freight minimum, but we have a heavy copper wire order
    if (hasConsolidationChance && parsedQuoteData.items.some(i => i.brandId === 'liberty-copper') && !parsedQuoteData.consolidated) {
        consolidationRecommendationBox.style.display = 'block';
        const lackingAmt = groups[consolidationBrandId].prepaidValue - groups[consolidationBrandId].totalPrice;
        consolidationAlertText.innerHTML = `
            <strong>Freight Savings Opportunity:</strong> Mapped items for <em>${groups[consolidationBrandId].brandName}</em> lack $${lackingAmt.toLocaleString([], {maximumFractionDigits: 0})} to reach free freight. 
            However, we can group this order with the heavy <strong>Liberty Copper Wire</strong> order on <strong>Flatbed Truck #03</strong> to consolidate the freight drop-off and bypass the $${targetFreightSaving} shipping fee!
        `;
    } else {
        consolidationRecommendationBox.style.display = 'none';
    }
}

// Execute 1-click consolidation
btnExecuteConsolidation.addEventListener('click', () => {
    if (parsedQuoteData) {
        parsedQuoteData.consolidated = true;
        
        // Log activity
        addActivityItem('Consolidated shipping drops: Grouped fittings orders with Liberty Copper wire flatbed dispatch.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('Freight Consolidated', 'Consolidated fittings with wire shipment reel on Truck #03. Shipping cost set to $0!', 'success');
        
        // Refresh calc view
        renderFreightCalculator();
    }
});

// Generate quote proposal to reply
btnDispatchQuote.addEventListener('click', () => {
    if (!parsedQuoteData) {
        showToast('Error', 'Please parse an RFQ first to generate a quote.', 'error');
        return;
    }

    let mail = mailItems.find(m => m.id === parsedQuoteData.mailId);
    if (!mail) return;

    let attachmentLabel = "ERP_Quote_Proposal.xlsx";
    let freightMessage = parsedQuoteData.consolidated ? 
        "Good news: We have consolidated your fittings items onto our scheduled Liberty Copper Flatbed delivery, setting your freight cost to $0.00." : 
        "Please note standard freight minimums apply. We suggest bundling items to achieve prepaid terms.";

    const replyBody = `Hello Client,

Thank you for requesting a quote from ERP Distribution. Please find the compiled pricing structure attached:

- Titan B-Line Strut Channel: Mapped and quoted.
- Matrix Fittings EMT: Mapped and quoted.
- Liberty Copper Cable THHN: Mapped and quoted.

Total Mapped Quote Value: $${parsedQuoteData.total.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}
${freightMessage}

Please review the attached Excel worksheet (ERP_Quote_Proposal.xlsx) and submit your purchase order to verify loading scheduling.

Best regards,
Sales Desk
ERP Distribution`;

    openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, attachmentLabel);
});

// ==========================================
// 11. BACKFEED ADD-IN: SMART-CUT CNC CALCULATIONS
// ==========================================

function calculateReelSpecs() {
    const legs = parseInt(wireLegsSelect.value);
    const length = parseInt(cutLengthInput.value) || 0;
    const isLiberty = wireBrandSelect.value.includes('Liberty');
    
    // Weight constants based on wire size
    const gauge = wireGaugeSelect.value;
    let lbsPer1000 = 800; // 4/0 AWG default
    if (gauge === '350') lbsPer1000 = 1200;
    if (gauge === '500') lbsPer1000 = 1750;
    if (gauge === '1/0') lbsPer1000 = 420;

    const copperWeight = (length * legs * lbsPer1000) / 1000;
    const reelWeight = 85; // Wooden master reel weight
    const totalWeight = copperWeight + reelWeight;

    outWeight.textContent = `Calculated Staging Weight: ${totalWeight.toFixed(0)} lbs`;
    
    // Animate visual capacity indicator
    const maxCapacity = 5000; // lbs limit
    let fillPct = (totalWeight / maxCapacity) * 88; // 88 is the dasharray length
    if (fillPct > 88) fillPct = 88;
    visualWireFill.style.strokeDashoffset = 88 - fillPct;

    const outWeightPct = document.getElementById('out-weight-pct');
    if (outWeightPct) {
        const pct = Math.min(100, Math.round((totalWeight / maxCapacity) * 100));
        outWeightPct.textContent = `${pct}%`;
    }

    if (totalWeight > 4200) {
        visualWireFill.style.stroke = 'var(--color-danger)';
        showToast('Weight Warning', 'Calculated staging weight exceeds standard flatbed capacity (4,200 lbs). Consider staging across multiple flatbeds.', 'warning');
    } else {
        visualWireFill.style.stroke = 'var(--accent-electric)';
    }

    return {
        legs: legs,
        length: length,
        weight: totalWeight,
        gauge: gauge,
        brand: wireBrandSelect.value
    };
}

[wireBrandSelect, wireGaugeSelect, wireLegsSelect, cutLengthInput, serviceTypeSelect].forEach(el => {
    el.addEventListener('change', calculateReelSpecs);
    el.addEventListener('input', calculateReelSpecs);
});

startCutBtn.addEventListener('click', () => {
    const specs = calculateReelSpecs();
    
    startCutBtn.disabled = true;
    startCutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Stacking & Packing Pallets...';

    setTimeout(() => {
        startCutBtn.disabled = false;
        startCutBtn.innerHTML = '<i class="fa-solid fa-play"></i> Dispatch Task to Warehouse Floor';
        
        // Log action
        addActivityItem(`Pallet Staging: Staged ${specs.length} cu ft of ${specs.brand} materials. Total weight: ${specs.weight.toFixed(0)} lbs.`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('Logistics Queue updated', `Freight packaging plan successfully sent to staging area #02.`, 'success');
        
        // Flash stats
        let cur = parseInt(statCuts.textContent);
        statCuts.textContent = cur + 1;
        
    }, 1800);
});

// ==========================================
// 12. OTHER TABS (INVENTORY, LINE CARDS)
// ==========================================

function renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';

    const searchVal = document.getElementById('inv-search').value.toLowerCase();
    const activeWh = window.currentInventoryWarehouseFilter || 'all';

    // Filter items first
    const filteredItems = mockInventory.filter(item => {
        if (searchVal && !item.sku.toLowerCase().includes(searchVal) && 
            !item.desc.toLowerCase().includes(searchVal) && 
            !item.brand.toLowerCase().includes(searchVal)) {
            return false;
        }
        return true;
    });

    // Ensure summary container exists
    let summaryContainer = document.getElementById('inv-summary-container');
    if (!summaryContainer) {
        const invView = document.getElementById('inventory-view');
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'inv-summary-container';
        summaryContainer.style.display = 'grid';
        summaryContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
        summaryContainer.style.gap = '16px';
        summaryContainer.style.marginBottom = '20px';
        
        const titleBlock = invView.firstElementChild;
        invView.insertBefore(summaryContainer, titleBlock.nextElementSibling);
    }

    // Ensure warehouse filter selector exists
    let filterBar = document.getElementById('inv-warehouse-filter');
    if (!filterBar) {
        const invView = document.getElementById('inventory-view');
        filterBar = document.createElement('div');
        filterBar.id = 'inv-warehouse-filter';
        filterBar.style.display = 'flex';
        filterBar.style.gap = '8px';
        filterBar.style.marginBottom = '16px';
        filterBar.style.borderBottom = '1px solid #edebe9';
        filterBar.style.paddingBottom = '8px';

        const warehouses = [
            { id: 'all', name: 'All Locations' },
            { id: 'WD-01', name: 'West Deptford (WD-01)' },
            { id: 'HB-02', name: 'Harrisburg (HB-02)' },
            { id: 'NK-03', name: 'Newark (NK-03)' }
        ];

        warehouses.forEach(wh => {
            const btn = document.createElement('button');
            btn.textContent = wh.name;
            btn.dataset.wh = wh.id;
            btn.style.padding = '6px 12px';
            btn.style.fontSize = '12px';
            btn.style.fontWeight = '500';
            btn.style.borderRadius = '6px';
            btn.style.border = '1px solid #edebe9';
            btn.style.background = wh.id === 'all' ? 'rgba(56, 189, 248, 0.1)' : '#ffffff';
            btn.style.color = wh.id === 'all' ? 'var(--outlook-blue)' : 'var(--text-secondary)';
            btn.style.cursor = 'pointer';
            btn.style.outline = 'none';

            btn.addEventListener('click', () => {
                window.currentInventoryWarehouseFilter = wh.id;
                filterBar.querySelectorAll('button').forEach(b => {
                    const isActive = b.dataset.wh === wh.id;
                    b.style.background = isActive ? 'rgba(56, 189, 248, 0.1)' : '#ffffff';
                    b.style.color = isActive ? 'var(--outlook-blue)' : 'var(--text-secondary)';
                    b.style.borderColor = isActive ? 'rgba(56, 189, 248, 0.2)' : '#edebe9';
                });
                renderInventoryTable();
            });

            filterBar.appendChild(btn);
        });

        summaryContainer.after(filterBar);
    }

    // Compute stats
    let totalStock = 0;
    let outOfStock = 0;
    let lowStock = 0;

    filteredItems.forEach(item => {
        // Deterministic warehouse breakdown
        const wdQty = Math.round(item.qty * 0.5);
        const hbQty = Math.round(item.qty * 0.3);
        const nkQty = item.qty - wdQty - hbQty;

        let qty = item.qty;
        if (activeWh === 'WD-01') qty = wdQty;
        else if (activeWh === 'HB-02') qty = hbQty;
        else if (activeWh === 'NK-03') qty = nkQty;

        totalStock += qty;
        if (qty === 0) outOfStock++;
        else if (qty < 100) lowStock++;
    });

    summaryContainer.innerHTML = `
        <div style="background: #ffffff; padding: 14px 18px; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Total Stock Volume</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${totalStock.toLocaleString()}</div>
        </div>
        <div style="background: #ffffff; padding: 14px 18px; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">Active SKUs</div>
            <div style="font-size: 22px; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${filteredItems.length}</div>
        </div>
        <div style="background: #ffffff; padding: 14px 18px; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="font-size: 11px; font-weight: 600; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px;">Low Stock Items</div>
            <div style="font-size: 22px; font-weight: 700; color: #d97706; margin-top: 4px;">${lowStock}</div>
        </div>
        <div style="background: #ffffff; padding: 14px 18px; border: 1px solid #edebe9; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <div style="font-size: 11px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">Out of Stock</div>
            <div style="font-size: 22px; font-weight: 700; color: #dc2626; margin-top: 4px;">${outOfStock}</div>
        </div>
    `;

    filteredItems.forEach(item => {
        const wdQty = Math.round(item.qty * 0.5);
        const hbQty = Math.round(item.qty * 0.3);
        const nkQty = item.qty - wdQty - hbQty;

        let qty = item.qty;
        let bin = item.bin;
        if (activeWh === 'WD-01') { qty = wdQty; bin = 'A-' + bin.split('-').slice(1).join('-'); }
        else if (activeWh === 'HB-02') { qty = hbQty; bin = 'B-' + bin.split('-').slice(1).join('-'); }
        else if (activeWh === 'NK-03') { qty = nkQty; bin = 'C-' + bin.split('-').slice(1).join('-'); }

        const committed = Math.round(qty * 0.15);
        const available = qty - committed;

        let badgeBg = 'rgba(34,197,94,0.1)';
        let badgeColor = '#22c55e';
        let badgeText = 'In Stock';
        let lead = 'Same Day';

        if (available <= 0) {
            badgeBg = 'rgba(239,68,68,0.1)';
            badgeColor = '#ef4444';
            badgeText = 'Out of Stock';
            lead = item.leadTime !== 'Stock' ? item.leadTime : '3-5 Days';
        } else if (available < 50) {
            badgeBg = 'rgba(245,158,11,0.1)';
            badgeColor = '#f59e0b';
            badgeText = 'Low Stock';
            lead = '1-2 Days';
        } else if (available > 2000) {
            badgeBg = 'rgba(59,130,246,0.1)';
            badgeColor = '#3b82f6';
            badgeText = 'High Volume';
            lead = 'Same Day';
        }

        const breakdown = `WD: <b>${wdQty}</b> | HB: <b>${hbQty}</b> | NK: <b>${nkQty}</b>`;

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #edebe9';
        row.style.transition = 'background 0.2s';
        row.addEventListener('mouseenter', () => row.style.background = '#f8fafc');
        row.addEventListener('mouseleave', () => row.style.background = 'transparent');

        row.innerHTML = `
            <td style="padding: 12px 16px; font-family: var(--font-mono); font-weight: 600; color: var(--outlook-blue);">${item.sku}</td>
            <td style="padding: 12px 16px;">
                <div style="font-weight: 500; color: var(--text-primary);">${item.desc}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${breakdown}</div>
            </td>
            <td style="padding: 12px 16px; color: var(--text-secondary);">${item.brand}</td>
            <td style="padding: 12px 16px; text-align: right;">
                <div style="font-weight: 700; color: var(--text-primary);">${available.toLocaleString()}</div>
                <div style="font-size: 11px; color: var(--text-light);">${committed} committed</div>
            </td>
            <td style="padding: 12px 16px; font-family: var(--font-mono); color: var(--text-secondary);">${bin}</td>
            <td style="padding: 12px 16px; text-align: right;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${badgeBg}; color: ${badgeColor}; margin-bottom: 4px;">${badgeText}</span>
                <div style="font-size: 10px; color: var(--text-light);">${lead}</div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Inventory search filter
document.getElementById('inv-search').addEventListener('input', renderInventoryTable);

function renderLineCards() {
    const container = document.getElementById('brand-grid-container');
    container.innerHTML = '';

    const query = document.getElementById('line-search').value.toLowerCase();
    
    const filtered = lineCardBrands.filter(b => {
        const matchesQuery = b.name.toLowerCase().includes(query) || b.desc.toLowerCase().includes(query);
        const matchesFilter = activeCategoryFilter === 'all' || b.category === activeCategoryFilter;
        return matchesQuery && matchesFilter;
    });

    filtered.forEach(b => {
        const card = document.createElement('div');
        card.className = 'brand-card';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h3 style="color: var(--outlook-blue);">${b.name}</h3>
                <span class="folder-badge" style="background: rgba(0,120,212,0.1); color: var(--outlook-blue); font-size: 9px; font-weight: bold;">${b.prepaid}</span>
            </div>
            <p>${b.desc}</p>
            <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid var(--outlook-border); font-size: 10.5px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span>Inside Specialist: <strong>${b.insideRep}</strong></span>
                <a href="mailto:${b.email}" style="color: var(--outlook-blue); text-decoration: none;"><i class="fa-solid fa-envelope"></i> Email</a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Line card search & filter chips bindings
document.getElementById('line-search').addEventListener('input', renderLineCards);
document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategoryFilter = chip.getAttribute('data-filter');
        renderLineCards();
    });
});

// ==========================================
// 13. REAL-TIME MARKET TICKERS (COMMODITIES & NEWS)
// ==========================================

let currentCommodities = null;

function useMockCommodities() {
    if (!currentCommodities) {
        currentCommodities = {
            "Copper": { price: 6.48, pct: -0.01 },
            "Aluminum": { price: 2540.0, pct: -0.45 },
            "Crude Oil": { price: 78.45, pct: 1.6 },
            "Natural Gas": { price: 2.84, pct: -1.7 },
            "Steel HRC": { price: 810.0, pct: 1.6 },
            "PVC Resin": { price: 0.92, pct: 1.6 }
        };
    } else {
        Object.keys(currentCommodities).forEach(name => {
            const item = currentCommodities[name];
            const change = (Math.random() - 0.5) * 0.1;
            item.price = item.price * (1 + change / 100);
            item.pct = (item.pct || 0) + change;
        });
    }
    renderCommodities(currentCommodities);
}

function pollCommoditiesData() {
    // Once we know there's no backend, just animate the demo ticker — no network call.
    if (backendOffline) { useMockCommodities(); return; }
    fetch('/api/commodities')
    .then(res => res.json())
    .then(data => {
        renderCommodities(data);
    })
    .catch(err => {
        backendOffline = true;
        useMockCommodities();
    });
}

function renderCommodities(data) {
    const container = document.getElementById('commodities-container');
    if (!container) return;
    container.innerHTML = '';
    
    Object.keys(data).forEach(name => {
        const item = data[name];
        const chgVal = item.pctChange !== undefined ? item.pctChange : (item.pct !== undefined ? item.pct : 0);
        const dirClass = chgVal >= 0 ? 'up' : 'down';
        const sign = chgVal >= 0 ? '+' : '';
        
        // Format price cleanly
        let priceText = `$${item.price.toFixed(2)}`;
        if (name === 'Copper' || name === 'PVC Resin') priceText = `$${item.price.toFixed(4)}/lb`;
        if (name === 'Steel HRC') priceText = `$${item.price.toFixed(0)}/ton`;
        if (name === 'Aluminum') priceText = `$${item.price.toFixed(0)}/ton`;
        if (name === 'Crude Oil') priceText = `$${item.price.toFixed(2)}/bbl`;
        if (name === 'Natural Gas') priceText = `$${item.price.toFixed(2)}/MMBtu`;

        const el = document.createElement('div');
        el.className = 'ticker-item';
        el.innerHTML = `
            <span class="ticker-label">${name}</span>
            <span class="ticker-val">${priceText}</span>
            <span class="ticker-chg ${dirClass}">${sign}${chgVal.toFixed(2)}%</span>
        `;
        container.appendChild(el);
    });
}

const mockNews = [
    { title: "Hyperscalers expand East Coast capacity by 450MW; wire demand surges." },
    { title: "LME Copper futures rise 1.8% amid supply chain logistics bottlenecks." },
    { title: "ERP Distribution launches Backfeed operations automation pipeline." },
    { title: "Steel HRC prices stabilize at $810/ton after surcharge adjustments." },
    { title: "PVC Conduit inventory tightens due to Gulf Coast chemical feed shortages." },
    { title: "Specialist A reports record framing strut shipments to Virginia server farms." }
];

function pollNewsData() {
    if (backendOffline) { renderNews(mockNews); return; }
    fetch('/api/news')
    .then(res => res.json())
    .then(data => {
        renderNews(data);
    })
    .catch(err => {
        backendOffline = true;
        renderNews(mockNews);
    });
}

function renderNews(data) {
    const marquee = document.getElementById('news-marquee');
    if (!marquee) return;
    const headlineText = data.map(item => `â€¢  ${item.title}`).join('     ');
    marquee.textContent = headlineText;
}

// Initial fetch & loop intervals
function initMarketTickers() {
    pollCommoditiesData();
    pollNewsData();
    
    // Refresh commodities every 15 seconds
    setInterval(pollCommoditiesData, 15000);
    // Refresh news headlines every 2 minutes
    setInterval(pollNewsData, 120000);
}

// ==========================================
// 14. DEMO INTERACTIVE EVENT INJECTION
// ==========================================

btnInjectRFQ.addEventListener('click', () => {
    const newMail = {
        id: `mail-injected-${Date.now()}`,
        senderName: 'Operations (Client D)',
        senderEmail: 'operations@redwood-electric.com',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: 'RFQ Request: Core Fittings Consolidation - Urgent PO release',
        snippet: 'Hi there, we need pricing details and delivery scheduling confirmation for 8,000 pcs PVC schedule 40...',
        body: `Hi there,

We need pricing details and delivery scheduling confirmation for:
- 8,000 ft DuraPVC Fittings Schedule 40 Coupling 2"
- 2,500 pcs Matrix Fittings EMT Compression Connector 1/2"

We want to consolidating these drop-offs if possible out of West Deptford HQ to save freight. Let us know.

Client D Operations
Redwood Electric Operations Desk`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 4,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    };

    mailItems.unshift(newMail);
    updateUnreadCount();
    showToast('New Email Injected', 'From: Operations (Client D) - Mapped to Inbox', 'success');

    if (vacationAutopilotActive) {
        handleAutopilotIncomingMail(newMail);
    } else {
        if (activeView === 'mail' && activeFolder === 'inbox') {
            renderMailList();
            selectMail(newMail.id);
        }
    }
});

btnInjectPhish.addEventListener('click', () => {
    const threatMail = {
        id: `mail-threat-${Date.now()}`,
        senderName: 'Specialist A (ERP Specialist)',
        senderEmail: 'specialist.a@erp-executives.top',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: 'URGENT: Review updated wire pricing list.pdf.exe',
        snippet: 'Hi there, please open this attachment immediately to review the pricing sheet changes...',
        body: `Hi there,

I made changes to the wiring pricing sheets. Please download and execute the attached statement to update the local databases for:
- 5,000 ft THHN 12 AWG Solid Copper Black (WIR-THHN12)
- 3,000 ft THHN 10 AWG Stranded Copper Black (WIR-THHN10)

This needs to be done before we send quotes today.

Specialist A
Inside Sales Specialist`,
        folder: 'inbox',
        unread: true,
        hasAttachment: true,
        attachmentName: 'wire_pricing_list_update.pdf.exe',
        riskScore: 95,
        riskLabel: 'DANGER',
        riskColor: 'var(--color-danger)',
        warningBanner: {
            class: 'red',
            icon: 'fa-solid fa-virus',
            text: '<strong>Malicious Attachment Alert:</strong> Suspicious executable double extension (.pdf.exe) detected. detouring to virtual sandbox detonator room. Action recommended: Hard Delete.',
            actions: [
                { label: 'Hard Delete', action: 'delete' },
                { label: 'Ignore Warning', action: 'ignore' }
            ]
        }
    };

    mailItems.unshift(threatMail);
    updateUnreadCount();
    showToast('Critical Security Threat Detected', 'Sentinel Gateway quarantined message from typosquatted domain!', 'error');

    if (vacationAutopilotActive) {
        handleAutopilotIncomingMail(threatMail);
    } else {
        if (activeView === 'mail') {
            activeFolder = 'quarantine';
            // Update active class in folder list UI to reflect Quarantine being selected
            document.querySelectorAll('.folder-item').forEach(i => {
                if (i.getAttribute('data-folder') === 'quarantine') {
                    i.classList.add('active');
                } else {
                    i.classList.remove('active');
                }
            });
            renderMailList();
            selectMail(threatMail.id);
        }
    }
});

btnInjectPriceUpdate.addEventListener('click', () => {
    const updateMail = {
        id: `mail-update-${Date.now()}`,
        senderName: 'Liberty Wire Sales Desk',
        senderEmail: 'sales@libertywire-mock.com',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: 'LME Copper Surcharge Pricing Update',
        snippet: 'Dear Partner, due to the LME copper commodity index jumping 1.5% this morning, please note copper building wire pricing...',
        body: `Dear Partner,

Due to the LME copper commodity index jumping 1.5% this morning (now trading at $4.59/lb), please note copper building wire pricing will face a +3.2% surcharge starting tomorrow. 

Ensure all open quotes are reviewed and processed before closing tonight.

Best regards,
Liberty Wire Sales Desk`,
        folder: 'inbox',
        unread: true,
        hasAttachment: false,
        attachmentName: '',
        riskScore: 8,
        riskLabel: 'SAFE',
        riskColor: 'var(--color-safe)'
    };

    mailItems.unshift(updateMail);
    updateUnreadCount();
    showToast('Vendor Bulletin Mapped', 'From: Liberty Wire - Copper Surcharge Alert', 'success');

    if (activeView === 'mail' && activeFolder === 'inbox') {
        renderMailList();
        selectMail(updateMail.id);
    }
});

btnInjectStochastic.addEventListener('click', () => {
    showToast('Injecting Shock', 'Applying Merton Jump-Diffusion model price shock...', 'info');
    
    // Call server API locally
    fetch('/api/inject-stochastic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast('Merton Shock Active', 'Discontinuous price surge applied to commodities.', 'error');
            addActivityItem('ERP System: Injected Merton stochastic price shock. Commodities surged +8% to +15%.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            
            // Immediately refetch commodities to show updated tickers
            pollCommoditiesData();
            
            // Trigger inbox refresh to fetch the alert email
            const refreshBtn = document.getElementById('btn-refresh-mail');
            if (refreshBtn) {
                refreshBtn.click();
            }
        } else {
            showToast('Shock Failed', 'Merton simulation error.', 'error');
        }
    })
    .catch(err => {
        console.error(err);
        showToast('Shock Error', 'Could not connect to stochastic simulation server.', 'error');
    });
});

if (btnRunAutoDemo) {
    btnRunAutoDemo.addEventListener('click', () => {
        const scenarioSelect = document.getElementById('sel-demo-scenario');
        const scenario = scenarioSelect ? scenarioSelect.value : 'happy-path';
        startAutomatedDemo(scenario);
    });
}

let currentDemoTimeoutIds = [];
function clearAllDemoTimeouts() {
    currentDemoTimeoutIds.forEach(id => clearTimeout(id));
    currentDemoTimeoutIds = [];
}

function startAutomatedDemo(scenario) {
    clearAllDemoTimeouts();
    
    // Hide composer if open
    if (composeModal) composeModal.style.display = 'none';
    resetCopilotParser();
    
    // Create floating status banner
    let demoBanner = document.getElementById('demo-running-banner');
    if (!demoBanner) {
        demoBanner = document.createElement('div');
        demoBanner.id = 'demo-running-banner';
        demoBanner.style = `
            position: fixed;
            top: 55px;
            left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: #38bdf8;
            border: 1px solid #0284c7;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 11px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
            z-index: 9999;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(demoBanner);
    }
    
    function updateBanner(text, isComplete = false) {
        if (isComplete) {
            demoBanner.style.background = '#0f172a';
            demoBanner.style.color = '#4ade80';
            demoBanner.style.borderColor = '#22c55e';
            demoBanner.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${text}</span>`;
            setTimeout(() => {
                demoBanner.style.opacity = '0';
                demoBanner.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => demoBanner.remove(), 400);
            }, 3500);
        } else {
            demoBanner.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #38bdf8;"></i> <span>${text}</span>`;
        }
    }
    
    const schedule = (fn, ms) => {
        const id = setTimeout(fn, ms);
        currentDemoTimeoutIds.push(id);
    };

    if (scenario === 'happy-path') {
        // SCENARIO 1: Happy Path (RFQ to Sales Order)
        updateBanner("Scenario 1: Selecting Vanguard RFQ email...");
        selectMail('mail-1');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 1: Running AI Speed-Quote parsing...");
            const mail = mailItems.find(m => m.id === 'mail-1');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 1: Checking freight terms & truck capacities...");
                openCopilotTab('freight');
                
                schedule(() => {
                    updateBanner("Scenario 1: Consolidating fittings with cable reels on flatbed...");
                    if (btnExecuteConsolidation) btnExecuteConsolidation.click();
                    
                    schedule(() => {
                        updateBanner("Scenario 1: Verifying ERP account profiles & credit limits...");
                        openCopilotTab('erp');
                        
                        schedule(() => {
                            updateBanner("Scenario 1: Compiling Excel quote proposals...");
                            const mail = mailItems.find(m => m.id === 'mail-1');
                            if (mail && parsedQuoteData) {
                                let attachmentLabel = "ERP_Quote_Proposal.xlsx";
                                let freightMessage = parsedQuoteData.consolidated ? 
                                    "Good news: We have consolidated your fittings items onto our scheduled Liberty Copper Flatbed delivery, setting your freight cost to $0.00." : 
                                    "Please note standard freight minimums apply. We suggest bundling items to achieve prepaid terms.";
                                const replyBody = `Hello Client,

Thank you for requesting a quote from ERP Distribution. Please find the compiled pricing structure attached:

- Titan B-Line Strut Channel: Mapped and quoted.
- Matrix Fittings EMT: Mapped and quoted.
- Liberty Copper Cable THHN: Mapped and quoted.

Total Mapped Quote Value: $${parsedQuoteData.total.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}
${freightMessage}

Please review the attached Excel worksheet (ERP_Quote_Proposal.xlsx) and submit your purchase order to verify loading scheduling.

Best regards,
Sales Desk
ERP Distribution`;
                                openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, attachmentLabel, true, () => {
                                    updateBanner("Scenario 1: Dispatching proposal email (logs order in ERP)...");
                                    schedule(() => {
                                        if (btnSendMail) btnSendMail.click();
                                        schedule(() => {
                                            updateBanner("Scenario 1: Staging complete. Waiting for customer response...");
                                            schedule(() => {
                                                updateBanner("Scenario 1 Completed!", true);
                                                if (!multiScenarioRunning) addToBackfeedMemory('happy-path');
                                            }, 4000);
                                        }, 6500);
                                    }, 1000);
                                });
                            }
                        }, 2500);
                    }, 2000);
                }, 2000);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'security-path') {
        // SCENARIO 2: Phishing Spoof Audit & SecOps Block
        updateBanner("Scenario 2: Injecting look-alike typosquatted executive email...");
        const btnInjectPhish = document.getElementById('btn-inject-phish');
        if (btnInjectPhish) btnInjectPhish.click();
        
        schedule(() => {
            updateBanner("Scenario 2: Inspecting message headers in Security Audit tab...");
            openCopilotTab('erp');
            
            schedule(() => {
                updateBanner("Scenario 2: Warning banner flags SPF/DKIM failures. Quarantining...");
                const reportBtn = document.querySelector('.outlook-warning-banner .banner-btn:first-child');
                if (reportBtn) {
                    reportBtn.click();
                } else {
                    executeBannerAction(activeMailId, 'quarantine');
                }
                
                schedule(() => {
                    updateBanner("Scenario 2 Completed! Phishing email blocked.", true);
                    if (!multiScenarioRunning) addToBackfeedMemory('security-path');
                }, 2500);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'credit-path') {
        // SCENARIO 3: Credit Risk (Credit Limit Hold)
        updateBanner("Scenario 3: Selecting Beacon Electric Supply RFQ (Gym Refit)...");
        selectMail('mail-5');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 3: Parsing Gym Refit RFQ fixtures list...");
            const mail = mailItems.find(m => m.id === 'mail-5');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 3: Checking ERP account standings...");
                openCopilotTab('erp');
                
                schedule(() => {
                    updateBanner("Scenario 3: Balance due ($74.2k) near limit ($75k). System flags CREDIT HOLD!");
                    
                    schedule(() => {
                        updateBanner("Scenario 3: Dispatching reply notifying of Credit Application/Hold...");
                        const mail = mailItems.find(m => m.id === 'mail-5');
                        if (mail) {
                            const creditHoldBody = `Hello Client,

Thank you for your RFQ. Please note that order entry has triggered a temporary Credit Hold on your account as it exceeds your available credit line by $13,000.

Please submit a 50% deposit payment ($6,900) or contact Credit Desk in credit department to clear the release.

Best,
Sales Desk
ERP Credit Desk`;
                            openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, creditHoldBody, null, true, () => {
                                updateBanner("Scenario 3: Sending email (Order registered with HOLD status)...");
                                schedule(() => {
                                    if (btnSendMail) btnSendMail.click();
                                    schedule(() => {
                                        updateBanner("Scenario 3 Completed! Credit risk handled safely.", true);
                                        if (!multiScenarioRunning) addToBackfeedMemory('credit-path');
                                    }, 3000);
                                }, 1000);
                            });
                        }
                    }, 3000);
                }, 4000);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'pricing-path') {
        // SCENARIO 4: Price Update (Vendor Bulletin Audit)
        updateBanner("Scenario 4: Selecting Apex Electrical Distributors feeder wire RFQ...");
        selectMail('mail-4');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 4: Parsing 3,000 ft Aluminum feeder reel quote...");
            const mail = mailItems.find(m => m.id === 'mail-4');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 4: Inspecting raw pricing data (Aluminum: $2.10/ft)...");
                openCopilotTab('freight');
                
                schedule(() => {
                    updateBanner("Scenario 4: Injecting vendor price surcharge notification...");
                    const btnInjectPrice = document.getElementById('btn-inject-price-update');
                    if (btnInjectPrice) btnInjectPrice.click();
                    
                    schedule(() => {
                        updateBanner("Scenario 4: Auditing vendor surcharge bulletin...");
                        
                        schedule(() => {
                            updateBanner("Scenario 4: Updating system copper/aluminum multiplier matrix...");
                            representedBrandPricing['liberty-copper'] = 4.95;
                            showToast('Multiplier Update', 'Liberty Copper base rate adjusted to $4.95/ft (+3.2% surcharge)', 'info');
                            addActivityItem('ERP System Surcharge update: Adjusted copper pricing sheet margins (+3.2%)', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                            
                            schedule(() => {
                                updateBanner("Scenario 4: Selecting Client A Estimator RFQ to re-parse with surcharge...");
                                selectMail('mail-1');
                                openCopilotTab('rfq');
                                
                                schedule(() => {
                                    updateBanner("Scenario 4: Re-parsing Client A Estimator RFQ (Copper calculated at new surcharge)...");
                                    const mail = mailItems.find(m => m.id === 'mail-1');
                                    if (mail) executeRFQParse(mail.body, mail.id);
                                    
                                    schedule(() => {
                                        updateBanner("Scenario 4 Completed! Pricing sheets successfully updated.", true);
                                        if (!multiScenarioRunning) addToBackfeedMemory('pricing-path');
                                    }, 3000);
                                }, 2500);
                            }, 3000);
                        }, 2500);
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 2000);
    } else if (scenario === 'intercept-path') {
        // SCENARIO 5: Competitor Brand Intercept (Steer to Commission Line)
        updateBanner("Scenario 5: Selecting Client Company RFQ (Quadra Brand Specified)...");
        selectMail('mail-intercept');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 5: Running Brand Interceptor. Mapped Quadra & Union to represented lines...");
            const mail = mailItems.find(m => m.id === 'mail-intercept');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 5: Opening ERP tab to inspect commission-yielding line-card equivalents...");
                openCopilotTab('erp');
                
                schedule(() => {
                    updateBanner("Scenario 5: Drafting response steering to Titan represented products...");
                    const mail = mailItems.find(m => m.id === 'mail-intercept');
                    if (mail && parsedQuoteData) {
                        const replyBody = `Hello Mark,

Thank you for your inquiry. While we do not represent Quadra Electric or Union Metal, Summit Electrical Sales is the exclusive regional representative for Titan. We have mapped your request to drop-in represented alternatives:

- 150 pcs Quadra Electric Q120 &rarr; Titan Wiring Devices BKR-1P20 ($8.50/ea)
- 1,000 ft Union Metal EMT 3/4" &rarr; Titan B-Line CON-EMT34 ($4.43/ea)

Total Mapped Quote Value: $1,718.00 (Commission eligible represented line items). Lead time: 2 business days.

Best regards,
Sales Desk
Summit Electrical Sales`;
                        openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, "Summit_Quote_Proposal.xlsx", true, () => {
                            updateBanner("Scenario 5: Sending quote with line-card replacements...");
                            schedule(() => {
                                if (btnSendMail) btnSendMail.click();
                                schedule(() => {
                                    updateBanner("Scenario 5 Completed! Competitor line intercepted and steered successfully.", true);
                                    if (!multiScenarioRunning) addToBackfeedMemory('intercept-path');
                                }, 3000);
                            }, 1000);
                        });
                    }
                }, 3500);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'arbitrage-path') {
        // SCENARIO 6: Retail Arbitrage Scan (Emergency Out-of-Stock)
        updateBanner("Scenario 6: Selecting Redwood Emergency RFQ (WTP Down)...");
        selectMail('mail-arbitrage');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 6: Checking warehouse stock status. Central stock is depleted...");
            const mail = mailItems.find(m => m.id === 'mail-arbitrage');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 6: Launching Stealth Recon Scraper to locate local retail stock...");
                openCopilotTab('freight');
                
                schedule(() => {
                    updateBanner("Scenario 6: Local stock found at Mega Builders Supply #6932 and Contractor Depot #1201...");
                    showToast('Arbitrage Stock Located', 'AeroTherm Heaters & Subpanels found at Runnemede (#6932) and Gloucester City (#1201) stores!', 'info');
                    addActivityItem('Stealth Recon Scraper: Located emergency stock of AeroTherm Heaters & Subpanels in local contractor stores.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    
                    schedule(() => {
                        updateBanner("Scenario 6: Staging courier pickup tickets for Runnemede & Gloucester City...");
                        addActivityItem('Logistics: Staged courier pickup for will-call emergency order.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        
                        schedule(() => {
                            updateBanner("Scenario 6: Drafting emergency delivery response...");
                            const mail = mailItems.find(m => m.id === 'mail-arbitrage');
                            if (mail) {
                                const replyBody = `Hi Gary,
                                
We checked our central warehouse and unfortunately, we are out of stock on AeroTherm heaters and subpanels at the West Deptford yard. 

However, our automated Sourcing Desk has located immediate local retail stock at Mega Builders Supply in Runnemede (Store #6932) and Contractor Depot in Gloucester City (Store #1201). We have locked in the inventory and staged a hot-shot courier to pick it up and deliver it directly to the Summit Valley Water Treatment Plant in under 3 hours.

Estimated total including emergency courier delivery: $1,280.00.

Please confirm if we should release the courier.

Best regards,
Sales Desk
Summit Electrical Sales`;
                                openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                                    updateBanner("Scenario 6: Sending courier staging confirmation...");
                                    schedule(() => {
                                        if (btnSendMail) btnSendMail.click();
                                        schedule(() => {
                                            updateBanner("Scenario 6 Completed! Emergency stock arbitrage resolved.", true);
                                            if (!multiScenarioRunning) addToBackfeedMemory('arbitrage-path');
                                        }, 3000);
                                    }, 1000);
                                });
                            }
                        }, 3000);
                    }, 3500);
                }, 3000);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'sizing-path') {
        // SCENARIO 7: NEC Conductor Sizing Sandbox (Copper to Aluminum)
        updateBanner("Scenario 7: Selecting Apex Distributors heavy copper RFQ...");
        selectMail('mail-sizing');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 7: Parsing 800 ft copper building wire request...");
            const mail = mailItems.find(m => m.id === 'mail-sizing');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 7: Opening Smart-Cut tab to run NEC Chapter 9 Table 8 Sizing Calculations...");
                openCopilotTab('smartcut');
                
                schedule(() => {
                    updateBanner("Scenario 7: Calculating aluminum conductor substitute options...");
                    serviceTypeSelect.value = 'parallel';
                    wireBrandSelect.value = 'Prime Aluminum Cable';
                    wireGaugeSelect.value = '4/0';
                    wireLegsSelect.value = '4';
                    cutLengthInput.value = '85';
                    calculateReelSpecs();
                    
                    schedule(() => {
                        updateBanner("Scenario 7: Aluminum yields 41.5% weight savings and compliant 2.54% voltage drop...");
                        showToast('NEC Sandbox Calculation', 'Conductor Sizing: Prime Aluminum 4/0 AWG Feeder mapped. Weight: 360 lbs vs Copper 616 lbs.', 'success');
                        
                        schedule(() => {
                            updateBanner("Scenario 7: Drafting proposal with NEC aluminum alternative to bypass copper backlog...");
                            const mail = mailItems.find(m => m.id === 'mail-sizing');
                            if (mail) {
                                const replyBody = `Hi Janet,

Regarding your request for 800 ft of THHN 4/0 AWG copper building wire, our copper inventory is currently backordered for 8 weeks due to commodity production backlogs.

To keep the Deptford Storage project on schedule, our engineering desk has calculated a code-compliant aluminum equivalent:
- Recommended alternative: Prime Aluminum 4/0 AWG Feeder (WIR-XHHW40)
- Calculated Voltage Drop: 2.54% (compliant under the NEC 3% threshold)
- Weight comparison: 360 lbs vs 616 lbs (41.5% logistics weight savings)
- Cost saving: $1,840.00 less than copper run.

We have this in stock and can dispatch tomorrow. Let us know if you approve this code-compliant sizing swap.

Best regards,
Sales Desk
Summit Electrical Sales`;
                                openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                                    updateBanner("Scenario 7: Dispatching quote with aluminum alternative...");
                                    schedule(() => {
                                        if (btnSendMail) btnSendMail.click();
                                        schedule(() => {
                                            updateBanner("Scenario 7 Completed! Conductor sizing sandbox audit complete.", true);
                                            if (!multiScenarioRunning) addToBackfeedMemory('sizing-path');
                                        }, 3000);
                                    }, 1000);
                                });
                            }
                        }, 3500);
                    }, 3500);
                }, 3000);
            }, 3000);
        }, 2000);
    } else if (scenario === 'weg-path') {
        // SCENARIO 8: Industrial Motor RFQ Intercept (VEG/Thomas Foods)
        updateBanner("Scenario 8: Selecting Wegman RFQ email...");
        selectMail('mail-weg');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 8: Running RFQ parser. Primary Wegman motor is backordered 12 weeks...");
            const mail = mailItems.find(m => m.id === 'mail-weg');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 8: Querying stock alternatives database for drop-in equivalents...");
                openCopilotTab('erp');
                
                schedule(() => {
                    updateBanner("Scenario 8: Found drop-in alternative: Apex Motors 20HP (MOT-APX-20HP)...");
                    showToast('Drop-in Stock Found', 'Apex Motors 20HP (MOT-APX-20HP) equivalent is in stock at West Deptford yard!', 'success');
                    addActivityItem('Sourcing: Mapped backordered Wegman motor to drop-in Apex Motors 20HP.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    
                    schedule(() => {
                        updateBanner("Scenario 8: Drafting proposal with Apex alternative to avoid 12-week downtime...");
                        const mail = mailItems.find(m => m.id === 'mail-weg');
                        if (mail) {
                            const replyBody = `Hi Carlos,

Regarding your request for the Wegman 20HP Flaker Motor (02012ET3E286T-W22G), the factory lead time is currently 12 weeks.

To restore your flaker line immediately, our sourcing engine has mapped a drop-in represented alternative:
- Alternative: Apex Motors 20HP Industrial Motor (MOT-APX-20HP)
- Status: In Stock (West Deptford Yard)
- Net Price: $1,450.00 each
- Lead time: Same-day shipment / 1-day delivery

Please advise if we should release this represented alternative to clear your downtime.

Best regards,
Sales Desk
Oddball Sourcing`;
                            openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                                updateBanner("Scenario 8: Dispatching alternative motor quote...");
                                schedule(() => {
                                    if (btnSendMail) btnSendMail.click();
                                    schedule(() => {
                                        updateBanner("Scenario 8 Completed! Backlogged motor steered to stock equivalent.", true);
                                        if (!multiScenarioRunning) addToBackfeedMemory('weg-path');
                                    }, 3000);
                                }, 1000);
                            });
                        }
                    }, 3500);
                }, 3500);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'mersen-path') {
        // SCENARIO 9: Min-Order Threshold Resolution (Meridian/National Rail)
        updateBanner("Scenario 9: Selecting Meridian release request...");
        selectMail('mail-mersen');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 9: Evaluating order threshold. Total is $130.88, below vendor $150 minimum...");
            const mail = mailItems.find(m => m.id === 'mail-mersen');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 9: Running Threshold Analyzer to identify compatible accessory add-ons...");
                openCopilotTab('erp');
                
                schedule(() => {
                    updateBanner("Scenario 9: Adding 8 pcs Meridian Anchors ($20.00) to clear the $150 limit...");
                    showToast('Threshold Resolved', 'Added 8 pcs Meridian Anchors (FSEA) to clear the $150 minimum order threshold.', 'success');
                    addActivityItem('Threshold Analyzer: Added 8 anchors to release Meridian blocks order.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    
                    schedule(() => {
                        updateBanner("Scenario 9: Drafting release confirmation email...");
                        const mail = mailItems.find(m => m.id === 'mail-mersen');
                        if (mail) {
                            const replyBody = `Hi T. Zellers,

We have processed your release request for the 8 pcs Meridian Power Distribution Blocks. 

To bypass the manufacturer's $150 minimum order threshold and avoid delivery holds, we have added:
- 8 pcs Meridian Anchors (MPN: FSEA / SKU: ACC-MER-ANCHOR) @ $2.50/ea (Total: $20.00)

This brings your order total to $150.88, successfully releasing the blocks. The anchors are in stock, and the distribution blocks are scheduled on a 6-10 week factory lead time.

Best regards,
Sales Desk
Oddball Sourcing`;
                            openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                                updateBanner("Scenario 9: Sending order release confirmation...");
                                schedule(() => {
                                    if (btnSendMail) btnSendMail.click();
                                    schedule(() => {
                                        updateBanner("Scenario 9 Completed! Minimum order hold bypassed successfully.", true);
                                        if (!multiScenarioRunning) addToBackfeedMemory('mersen-path');
                                    }, 3000);
                                }, 1000);
                            });
                        }
                    }, 3500);
                }, 3500);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'duraline-path') {
        // SCENARIO 10: High-Stakes Conduit Status Check (Duraflow/National Rail)
        updateBanner("Scenario 10: Selecting Duraflow conduit status email...");
        selectMail('mail-duraline');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 10: Querying ERP status for HDPE Conduit order S144745017...");
            const mail = mailItems.find(m => m.id === 'mail-duraline');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 10: Verification completed. Estimated Ship Date is confirmed...");
                addActivityItem('ERP Query: Confirmed Duraflow HDPE conduit S144745017 is on schedule for 5/29.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                
                schedule(() => {
                    updateBanner("Scenario 10: Drafting status confirmation update...");
                    const mail = mailItems.find(m => m.id === 'mail-duraline');
                    if (mail) {
                        const replyBody = `Hi T. Zellers,

We have checked the status of your order S144745017 for the 4" HDPE Conduit.

The factory confirms the Estimated Ship Date remains on track for this Friday, May 29, 2026. We will monitor the shipment and forward carrier tracking details as soon as they are uploaded.

Best regards,
Sales Desk
Oddball Sourcing`;
                        openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                            updateBanner("Scenario 10: Sending status update to buyer...");
                            schedule(() => {
                                if (btnSendMail) btnSendMail.click();
                                schedule(() => {
                                    updateBanner("Scenario 10 Completed! Conduit status check resolved.", true);
                                    if (!multiScenarioRunning) addToBackfeedMemory('duraline-path');
                                }, 3000);
                            }, 1000);
                        });
                    }
                }, 3500);
            }, 3000);
        }, 2000);
    } else if (scenario === 'storm-path') {
        // SCENARIO 11: Emergency Storm Grid Restoration (Substation Outage Priority Conflict)
        updateBanner("Scenario 11: Selecting Mid-Atlantic storm restoration emergency email...");
        selectMail('mail-storm');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 11: Parsing 1,500 ft copper XHHW 6 AWG wire request. Lead time is tight...");
            const mail = mailItems.find(m => m.id === 'mail-storm');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 11: Stock check: 1,500 ft WIR-XHHW6 is pre-sold to Client Company. ALLOCATION BLOCK!");
                showToast('Allocation Conflict', 'Required stock is pre-allocated to Client Company (SO-98441).', 'warning');
                
                schedule(() => {
                    updateBanner("Scenario 11: Overriding allocation block in ERP... Re-routing copper to emergency hospital job...");
                    addActivityItem('ERP Logistics: Overrode allocation block. Mapped 1,500 ft WIR-XHHW6 to Mid-Atlantic Power.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    addActivityItem('Logistics: Scheduled Hot-Shot Express courier for immediate hospital substation drop.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    
                    schedule(() => {
                        updateBanner("Scenario 11: Steering Client Company to Prime Aluminum 4/0 AWG equivalent with 40% cost saving...");
                        showToast('Client Steered', 'Client Company project coordinator notified of code-compliant aluminum equivalent to prevent delay.', 'info');
                        addActivityItem('Sourcing: Re-allocated Client Company to Prime Aluminum 4/0 (WIR-XHHW40) at $1,800 savings.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        
                        schedule(() => {
                            updateBanner("Scenario 11: Drafting response to Janet Chen at Mid-Atlantic Power...");
                            const mail = mailItems.find(m => m.id === 'mail-storm');
                            if (mail) {
                                const replyBody = `Hi Janet,
                                
We received your emergency RFQ for the Mercy General Hospital grid restoration. 

Our logistics desk has overridden our standard allocation queue, diverted 1,500 ft of XHHW-2 6 AWG Stranded Copper wire from our warehouse yard, and loaded it onto a Hot-Shot Express courier. 

The courier is dispatched and en route to your substation location now. Estimated delivery time is under 1.5 hours (well before the 8:00 PM generator deadline).

Order SO-99401 has been registered in the ERP as RELEASED. Total net price: $2,160.00.

We are contacting the other contractor to steer them to an in-stock aluminum equivalent so no jobs are delayed.

Best regards,
Sales Desk
Oddball Sourcing`;
                                openComposeMail(mail.senderEmail, `RE: ${mail.subject}`, replyBody, null, true, () => {
                                    updateBanner("Scenario 11: Dispatching emergency release confirmation...");
                                    schedule(() => {
                                        if (btnSendMail) btnSendMail.click();
                                        schedule(() => {
                                            updateBanner("Scenario 11 Completed! Emergency storm restoration resolved.", true);
                                            if (!multiScenarioRunning) addToBackfeedMemory('storm-path');
                                        }, 3000);
                                    }, 1000);
                                });
                            }
                        }, 3500);
                    }, 3500);
                }, 3500);
            }, 3000);
        }, 2000);
        
    } else if (scenario === 'bid-path') {
        // SCENARIO 12: Bid Deadline & Credit Hold Escalation (Contradictory Instructions & Price Lock)
        updateBanner("Scenario 12: Selecting Keystone Electric urgent bid email...");
        selectMail('mail-bid');
        openCopilotTab('rfq');
        
        schedule(() => {
            updateBanner("Scenario 12: Running RFQ parser. Mismatch: 15% manufacturer surcharge active on PNL-200A...");
            const mail = mailItems.find(m => m.id === 'mail-bid');
            if (mail) executeRFQParse(mail.body, mail.id);
            
            schedule(() => {
                updateBanner("Scenario 12: Credit Check: Keystone is $12,000 over limit. CREDIT BLOCK ENGAGED!");
                showToast('Credit Hold Engaged', 'Keystone Electric account is currently over limit. Quote release suspended.', 'danger');
                
                schedule(() => {
                    updateBanner("Scenario 12: Escalate credit hold to Credit Manager...");
                    addActivityItem('Credit Escalation: Order SO-99411 escalated to Credit Manager for urgent over-limit approval ($12,000 over).', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    
                    schedule(() => {
                        updateBanner("Scenario 12: Applying price lock matrix to waive 15% surcharge...");
                        showToast('Price Override Applied', 'Applied manager-approved price lock of $172.84 on PNL-200A and $32.40 on BKR-GFCI.', 'success');
                        addActivityItem('Pricing Engine: Applied price lock key to override 15% surcharge.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                        
                        schedule(() => {
                            updateBanner("Scenario 12: Drafting urgent credit escalation email to Credit Manager...");
                            const mail = mailItems.find(m => m.id === 'mail-bid');
                            if (mail) {
                                const escalationBody = `Hi Credit Team,

We have an urgent credit exception request for Keystone Electric (Account C-1006). They are submitting a bid for the City Transit Authority project closing at 3:00 PM today.

The quote total is $15,122.00, which exceeds their available credit limit by $12,122.00. 

To meet their strict deadline, we have already applied the manager price lock matrix to waive the 15% manufacturer surcharge. Can you please review their profile and authorize a temporary credit limit extension to release order SO-99411?

Best regards,
Sales Desk
Oddball Sourcing`;
                                openComposeMail('credit.manager@erpdistribution.com', `URGENT CREDIT OVERRIDE: Keystone Electric (C-1006) - Bid Deadline 3:00 PM`, escalationBody, null, true, () => {
                                    updateBanner("Scenario 12: Dispatching credit escalation email to Credit Manager...");
                                    schedule(() => {
                                        if (btnSendMail) btnSendMail.click();
                                        schedule(() => {
                                            updateBanner("Scenario 12 Completed! Price locked and credit hold escalated to Credit Manager.", true);
                                            if (!multiScenarioRunning) addToBackfeedMemory('bid-path');
                                        }, 3000);
                                    }, 1000);
                                });
                            }
                        }, 3500);
                    }, 3500);
                }, 3500);
            }, 3000);
        }, 2000);
    }
}

if (btnToggleAutopilot) {
    btnToggleAutopilot.addEventListener('click', toggleVacationAutopilot);
}
if (btnDirectorAutopilot) {
    btnDirectorAutopilot.addEventListener('click', toggleVacationAutopilot);
}

function scanAndProcessUnreadEmails() {
    if (!vacationAutopilotActive) return;
    
    const unreadMails = mailItems.filter(m => m.unread && m.folder === 'inbox' && !m.autopilotProcessing);
    if (unreadMails.length === 0) return;
    
    let delay = 0;
    unreadMails.forEach((mail) => {
        mail.autopilotProcessing = true;
        setTimeout(() => {
            if (vacationAutopilotActive) {
                handleAutopilotIncomingMail(mail);
            }
            delete mail.autopilotProcessing;
        }, delay);
        delay += 3000;
    });
}

function toggleVacationAutopilot() {
    vacationAutopilotActive = !vacationAutopilotActive;
    
    const btnText = vacationAutopilotActive ? 
        '<i class="fa-solid fa-plane-arrival"></i> Autopilot OOO' : 
        '<i class="fa-solid fa-plane"></i> Autopilot';
    
    if (btnToggleAutopilot) {
        btnToggleAutopilot.innerHTML = btnText;
        if (vacationAutopilotActive) {
            btnToggleAutopilot.style.background = '#eff6ff';
            btnToggleAutopilot.style.color = '#1d4ed8';
            btnToggleAutopilot.style.borderColor = '#bfdbfe';
        } else {
            btnToggleAutopilot.style.background = '#f3f2f1';
            btnToggleAutopilot.style.color = 'var(--text-secondary)';
            btnToggleAutopilot.style.borderColor = 'var(--outlook-border)';
        }
    }
    
    if (btnDirectorAutopilot) {
        if (vacationAutopilotActive) {
            btnDirectorAutopilot.style.background = 'rgba(239, 68, 68, 0.2)';
            btnDirectorAutopilot.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            btnDirectorAutopilot.style.color = '#f87171';
            btnDirectorAutopilot.innerHTML = '<i class="fa-solid fa-plane-slash"></i> Turn Autopilot Off';
        } else {
            btnDirectorAutopilot.style.background = 'rgba(34, 197, 94, 0.15)';
            btnDirectorAutopilot.style.borderColor = 'rgba(34, 197, 94, 0.3)';
            btnDirectorAutopilot.style.color = '#4ade80';
            btnDirectorAutopilot.innerHTML = '<i class="fa-solid fa-plane"></i> Toggle Vacation Autopilot';
        }
    }
    
    if (copilotStatusBadge) {
        if (vacationAutopilotActive) {
            copilotStatusBadge.innerHTML = '<i class="fa-solid fa-plane fa-spin" style="color: #1d4ed8;"></i> AUTOPILOT ACTIVE';
            copilotStatusBadge.style.background = '#eff6ff';
            copilotStatusBadge.style.color = '#1d4ed8';
            copilotStatusBadge.style.borderColor = '#bfdbfe';
            copilotStatusBadge.style.padding = '1px 6px';
            copilotStatusBadge.style.borderRadius = '12px';
            copilotStatusBadge.style.border = '1px solid #bfdbfe';
            copilotStatusBadge.style.fontSize = '8px';
            copilotStatusBadge.style.fontWeight = 'bold';
        } else {
            copilotStatusBadge.innerHTML = '<i class="fa-solid fa-circle"></i> Active';
            copilotStatusBadge.style.background = '';
            copilotStatusBadge.style.color = '';
            copilotStatusBadge.style.borderColor = '';
            copilotStatusBadge.style.padding = '';
            copilotStatusBadge.style.borderRadius = '';
            copilotStatusBadge.style.border = '';
            copilotStatusBadge.style.fontSize = '';
            copilotStatusBadge.style.fontWeight = '';
        }
    }
    
    if (vacationAutopilotActive) {
        showToast('Vacation Autopilot Active', 'Out-Of-Office automatic agent active. Handover report sent to team.', 'info');
        addActivityItem('Vacation Autopilot engaged: Set user state to OOO and CC-ed inside specialists.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        sendOOOHandoverReport();
        scanAndProcessUnreadEmails();
    } else {
        showToast('Vacation Autopilot Disabled', 'Reverted back to manual sales coordinator mode.', 'info');
        addActivityItem('Vacation Autopilot disengaged: Sales coordinator back online.', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
}

function sendOOOHandoverReport() {
    const reportMail = {
        id: `sent-ooo-${Date.now()}`,
        senderName: 'Sales Desk',
        senderEmail: 'sales@erpdistribution.com',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        subject: 'HANDOVER SUMMARY: Vacation Autopilot Activated - Operator OOO',
        snippet: 'Team, I am out of office on vacation. Autopilot has been engaged to auto-respond to incoming contractor RFQs...',
        body: `Hi Team,

I am currently out of office on vacation. Backfeed Autopilot has been engaged to handle routine customer RFQs, freight math, and warehouse pallet staging while I am away.

Here is the active operational status handover:

1. STAGED LOGISTICS PALLETS:
   - Truck #03 is loading custom pallets (Vanguard Deptford Storage job).
   - Zone C has stages ready for Apex Electric orders.

2. CREDIT RISK WATCH:
   - Beacon Electric Supply (CUST-BC-481) is currently on CREDIT HOLD due to order value exceeding their $75k credit limit. Deposit request dispatch was handled automatically.

3. SENDER AUTHENTICATION CHECKS:
   - Sentinel Threat Gateway has quarantined one typosquatted threat from erp-executives.top. SPF/DKIM validation failed.

Autopilot will continue to auto-respond to incoming contractor RFQs and CC the assigned inside specialist.

Best regards,
Sales Desk (Autopilot Agent)`,
        folder: 'sent',
        unread: false,
        recipient: 'team@erpdistribution.com',
        hasAttachment: false,
        attachmentName: '',
        riskScore: 0
    };

    sentMailItems.unshift(reportMail);
    addActivityItem('Autopilot: Sent Vacation Operations Handover Report to team@erpdistribution.com', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    if (activeView === 'mail' && activeFolder === 'sent') {
        renderMailList();
    }
}

function handleAutopilotIncomingMail(mail) {
    if (!vacationAutopilotActive) return;
    
    if (mail.riskScore >= 75) {
        showToast('Autopilot Security Block', `Identified spoof email from ${mail.senderEmail}. Automatically quarantining.`, 'warning');
        addActivityItem(`Autopilot Security Action: Blocked spoof threat from ${mail.senderEmail} and moved to Quarantine.`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        
        mail.folder = 'quarantine';
        mail.unread = false;
        
        fetch('/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: mail.subject,
                decision: 'AUTOPILOT QUARANTINE & BLOCK SOURCE',
                reasoning: `Autopilot blocked spoof alert: SPF/DKIM failed on ${mail.senderEmail}.`,
                logs: ['Autopilot agent triggered automatic security quarantine checklist.']
            })
        }).catch(err => console.error(err));
        
        if (activeView === 'mail') {
            activeFolder = 'quarantine';
            document.querySelectorAll('.folder-item').forEach(i => {
                if (i.getAttribute('data-folder') === 'quarantine') {
                    i.classList.add('active');
                } else {
                    i.classList.remove('active');
                }
            });
            renderMailList();
            selectMail(mail.id);
        }
        return;
    }
    
    const isRFQ = mail.subject.toLowerCase().includes('rfq') || mail.body.toLowerCase().includes('quote') || mail.body.toLowerCase().includes('wire') || mail.body.toLowerCase().includes('strut') || mail.subject.toLowerCase().includes('discrepancy') || mail.subject.toLowerCase().includes('variance');
    
    if (isRFQ) {
        showToast('Autopilot Processing', `Auto-parsing incoming mail from ${mail.senderName}...`, 'info');
        
        setTimeout(() => {
            selectMail(mail.id);
            
            if (mail.id === 'mail-9' || mail.id === 'mail-10') {
                openCopilotTab('doc');
                triggerDocBriefingForMail(mail.id);
                
                const isMail9 = mail.id === 'mail-9';
                const orderRef = isMail9 ? 'SO-99180' : 'SO-99222';
                const poRef = isMail9 ? 'PO-99180' : 'PO-99200';
                const varAmt = isMail9 ? '+$140.00 (Matrix Fittings)' : '+$1,300.00 (DuraPVC)';
                
                const oooSubject = `Automatic Out-of-Office Reply: RE: ${mail.subject}`;
                const oooReplyBody = `Hello AP Team,\n\nI am currently out of office on vacation. My Backfeed Autopilot agent has received your variance inquiry for ${orderRef} and logged it in the billing reconciliation queue.\n\nSummary of logged action:\n- Order Reference: ${orderRef} / ${poRef}\n- Variance amount: ${varAmt}\n- Action: Logged in ERP Billing Resolution Queue and assigned to Specialist A.\n\nBest regards,\nSales Desk (Autopilot Agent)`;
                
                const autoReply = {
                    id: `sent-auto-${Date.now()}`,
                    senderName: 'Sales Desk',
                    senderEmail: 'sales@erpdistribution.com',
                    date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
                    subject: oooSubject,
                    snippet: oooReplyBody.substring(0, 60) + '...',
                    body: oooReplyBody,
                    folder: 'sent',
                    unread: false,
                    recipient: mail.senderEmail,
                    hasAttachment: false,
                    riskScore: 0
                };
                
                sentMailItems.unshift(autoReply);
                showToast('Autopilot Mail Sent', `Dispatched OOO reply to AP`, 'success');
                
                renderMailList();
                updateUnreadCount();
                selectMail(mail.id);
                updateERPPane(mail);
                return;
            }
            
            const results = parseRFQLines(mail.body);
            
            // Auto open the doc briefing tab and type notes
            openCopilotTab('doc');
            triggerDocBriefingForMail(mail.id);
            
            const total = results.total;
            const emailLower = mail.senderEmail.toLowerCase();
            const account = erpCustomerAccounts[emailLower];
            
            let oooReplyBody = '';
            let oooSubject = `Automatic Out-of-Office Reply: RE: ${mail.subject}`;
            
            if (account) {
                let weight = results.items.reduce((sum, item) => sum + item.weight, 0);
                let isPrepaid = total >= 3000 || (weight > 1000);
                let freightNotice = isPrepaid ? 
                    "Prepaid freight minimums met. Delivery will be staged out of West Deptford HQ." : 
                    "Standard freight terms apply. We suggest coordinating with inside specialists to consolidate shipping drops.";
                
                const availableCredit = account.creditLimit - account.balanceDue;
                if (total > availableCredit) {
                    oooReplyBody = `Hello ${mail.senderName},\n\nI am currently out of the office on vacation. My Backfeed Autopilot agent has received your RFQ and processed the details.\n\nWARNING: Order value ($${total.toLocaleString()}) exceeds your account available credit line ($${availableCredit.toLocaleString()}). The order has been automatically placed on Credit Hold.\n\nPlease reply with a 50% deposit release or contact credit department to authorize release.\n\nInside Representative assigned: ${results.items[0] ? results.items[0].insideRep : 'Credit Desk'}.\n\nBest regards,\nSales Desk (Autopilot Agent)`;
                    
                    lastOrderId++;
                    const orderId = `SO-${lastOrderId}`;
                    if (!customerOrdersDatabase[account.customerId]) {
                        customerOrdersDatabase[account.customerId] = [];
                    }
                    customerOrdersDatabase[account.customerId].unshift({
                        orderId: orderId,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        items: results.items.map(it => `${it.qty} ${it.brandName}`).join(', ').substring(0, 57) + '...',
                        price: total,
                        status: 'Hold'
                    });
                    account.balanceDue += total;
                    addActivityItem(`Autopilot Action: Flagged Credit Hold order ${orderId} for ${account.company} ($${total.toLocaleString()})`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                } else {
                    oooReplyBody = `Hello ${mail.senderName},\n\nI am currently out of office on vacation. My Backfeed Autopilot agent has successfully received and parsed your RFQ.\n\nYour quote has been approved (fits in credit limit) and logged in our system. Here are the quote specifications:\n- Total Price Quoted: $${total.toLocaleString()}\n- Estimated Shipping Weight: ${weight.toFixed(0)} lbs\n- ${freightNotice}\n\nInside Representative CC-ed for dispatch scheduling: ${results.items[0] ? results.items[0].insideRep : 'Specialist A'}.\n\nBest regards,\nSales Desk (Autopilot Agent)`;
                    
                    lastOrderId++;
                    const orderId = `SO-${lastOrderId}`;
                    if (!customerOrdersDatabase[account.customerId]) {
                        customerOrdersDatabase[account.customerId] = [];
                    }
                    customerOrdersDatabase[account.customerId].unshift({
                        orderId: orderId,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        items: results.items.map(it => `${it.qty} ${it.brandName}`).join(', ').substring(0, 57) + '...',
                        price: total,
                        status: 'Processing'
                    });
                    account.balanceDue += total;
                    addActivityItem(`Autopilot Action: Automatically entered Sales Order ${orderId} for ${account.company} ($${total.toLocaleString()})`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                }
            } else {
                oooReplyBody = `Hello,\n\nI am currently out of office on vacation. My Backfeed Autopilot agent has parsed your RFQ. Since your account is not yet registered in our ERP systems, the quote proposal has been routed to our credit desk for review.\n\nInside Representative assigned: Sales Coordinator.\n\nBest regards,\nSales Desk (Autopilot Agent)`;
            }
            
            const autoReply = {
                id: `sent-auto-${Date.now()}`,
                senderName: 'Sales Desk',
                senderEmail: 'sales@erpdistribution.com',
                date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
                subject: oooSubject,
                snippet: oooReplyBody.substring(0, 60) + '...',
                body: oooReplyBody,
                folder: 'sent',
                unread: false,
                recipient: mail.senderEmail,
                hasAttachment: true,
                attachmentName: 'ERP_Quote_Proposal.xlsx',
                riskScore: 0
            };
            
            sentMailItems.unshift(autoReply);
            showToast('Autopilot Mail Sent', `Dispatched OOO auto-quote reply to ${mail.senderEmail}`, 'success');
            
            renderMailList();
            updateUnreadCount();
            selectMail(mail.id);
            updateERPPane(mail);

            // Auto-trigger visual order entry inside ERP iframe after 3 seconds for valid RFQs
            const isTriState = mail.body.toUpperCase().includes('CLIENT COMPANY') || mail.subject.toUpperCase().includes('CLIENT COMPANY');
            if (isTriState && !mail.warningBanner) {
                setTimeout(() => {
                    if (!vacationAutopilotActive) return;
                    
                    const routingType = (mail.id === 'mail-1' || mail.id === 'mail-3') ? 'direct' : 'stock';
                    const vendor = routingType === 'direct' ? 'VNDR-711' : 'VNDR-824';
                    
                    const payload = {
                        isQuote: true,
                        customerId: account ? account.customerId : 'C-1001',
                        po: `PO-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
                        routingType: routingType,
                        vendor: vendor,
                        items: results.items.map(x => ({ sku: x.sku, qty: x.qty }))
                    };
                    
                    console.log("Autopilot auto-triggering visual order entry:", payload);
                    setView('erp');
                    
                    if (erpConnector.isDemoMode()) {
                        setTimeout(() => {
                            if (typeof window.startVisualOrderEntry === 'function') {
                                window.startVisualOrderEntry(payload);
                            }
                        }, 500);
                    } else {
                        const profileName = erpConnector.getProfile() ? erpConnector.getProfile().name : 'External ERP';
                        showToast('Agent Dispatch', `Autopilot queued order to ${profileName} via Backfeed Agent.`, 'success');
                        const terminal = document.getElementById('app-erp-cli-terminal');
                        if (terminal) {
                            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            const logLine = document.createElement('div');
                            logLine.className = 'cli-line';
                            logLine.style.color = '#4ade80';
                            logLine.innerHTML = `[${now}] AUTOPILOT-DISPATCH → ${profileName} | PO: ${payload.po} | Items: ${payload.items.length}`;
                            terminal.insertBefore(logLine, terminal.lastElementChild);
                        }
                    }
                }, 3000);
            }
        }, 1500);
    }
}

// ==========================================
// 15. CAPACITY VIEW & LOGISTICS LOGS
// ==========================================

function updateLogisticsView() {
    activityLogContainer.innerHTML = '';
    seedActivities.forEach(act => {
        addActivityItem(act.text, act.time, false);
    });
}

function addActivityItem(text, time, prepend = true) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <div class="activity-icon"><i class="fa-solid fa-bolt"></i></div>
        <div class="activity-info">
            <div class="activity-desc">${text}</div>
            <div class="activity-time">${time}</div>
        </div>
    `;
    
    if (prepend && activityLogContainer.querySelector('.parsed-placeholder')) {
        activityLogContainer.innerHTML = '';
    }

    if (prepend) {
        activityLogContainer.insertBefore(item, activityLogContainer.firstChild);
    } else {
        activityLogContainer.appendChild(item);
    }
}

clearActivityBtn.addEventListener('click', () => {
    activityLogContainer.innerHTML = `
        <div class="parsed-placeholder">
            <i class="fa-solid fa-square-poll-horizontal"></i>
            <p>Log queue cleared. New dispatches will print here.</p>
        </div>
    `;
    showToast('Logs Cleared', 'Logistics activity log cleared.', 'info');
});
// ==========================================
// 15b. BACKFEED MEMORY LEDGER
// ==========================================

function addToBackfeedMemory(scenarioKey) {
    const data = scenarioMemoryData[scenarioKey];
    if (!data) return;

    const totalValue = data.skus.reduce((sum, s) => sum + (s.qty * s.unitPrice), 0);

    const entry = {
        id: `MEM-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        scenarioId: data.scenarioId,
        scenarioName: data.scenarioName,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        customerAccount: data.customerAccount,
        jobName: data.jobName,
        jobNumber: data.jobNumber,
        skus: data.skus,
        totalValue: totalValue,
        decisionType: data.decisionType,
        statusClass: data.statusClass,
        freightMethod: data.freightMethod,
        creditStatus: data.creditStatus
    };

    backfeedMemoryLedger.unshift(entry);
    renderBackfeedMemory();

    // Flash the Memory tab to draw attention
    const memoryTab = document.querySelector('.copilot-tab[data-tab="memory"]');
    if (memoryTab && activeCopilotTab !== 'memory') {
        memoryTab.style.background = 'rgba(0, 120, 212, 0.15)';
        memoryTab.style.color = '#0078d4';
        setTimeout(() => {
            if (activeCopilotTab !== 'memory') {
                memoryTab.style.background = '';
                memoryTab.style.color = '';
            }
        }, 3000);
    }

    showToast('Memory Stored', `${data.scenarioName} → ${data.orderNumber} logged to Backfeed Memory.`, 'success');
}

function renderBackfeedMemory() {
    const scrollContainer = document.getElementById('memory-ledger-scroll');
    const emptyState = document.getElementById('memory-empty-state');
    const totalCountEl = document.getElementById('memory-total-count');
    const totalOrdersEl = document.getElementById('memory-total-orders');
    const totalRevenueEl = document.getElementById('memory-total-revenue');

    if (!scrollContainer) return;

    // Update totals
    const totalEntries = backfeedMemoryLedger.length;
    const totalOrders = backfeedMemoryLedger.filter(e => e.orderNumber !== '—').length;
    const totalRevenue = backfeedMemoryLedger.reduce((sum, e) => sum + e.totalValue, 0);

    if (totalCountEl) totalCountEl.textContent = totalEntries;
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (totalRevenueEl) totalRevenueEl.textContent = `$${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

    if (totalEntries === 0) {
        scrollContainer.innerHTML = `
            <div class="memory-empty-state" id="memory-empty-state">
                <i class="fa-solid fa-brain"></i>
                <p>No memories stored yet. Run a scenario to begin building Backfeed's institutional memory.</p>
            </div>
        `;
        return;
    }

    // Render entries
    let html = '';
    backfeedMemoryLedger.forEach((entry, idx) => {
        const isNew = idx === 0 && (Date.now() - parseInt(entry.id.split('-')[1])) < 5000;
        const skuLines = entry.skus.map(s => {
            const lineTotal = s.qty * s.unitPrice;
            return `<div class="memory-sku-line">
                <span><span class="sku-code">${s.sku}</span> ${s.desc}</span>
                <span>${s.qty} × $${s.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} = $${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>`;
        }).join('');

        html += `
        <div class="memory-entry ${isNew ? 'just-added' : ''}">
            <div class="memory-entry-header">
                <span class="memory-entry-order">${entry.orderNumber}</span>
                <span class="memory-entry-scenario">S${entry.scenarioId}</span>
            </div>
            <div class="memory-entry-body">
                <div class="memory-entry-row">
                    <span class="mem-label">Customer</span>
                    <span class="mem-value">${entry.customerName}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Job</span>
                    <span class="mem-value">${entry.jobName}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Job #</span>
                    <span class="mem-value">${entry.jobNumber}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Total</span>
                    <span class="mem-value">$${entry.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Decision</span>
                    <span class="memory-status-badge status-${entry.statusClass}">${entry.decisionType}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Freight</span>
                    <span class="mem-value" style="font-size: 9px;">${entry.freightMethod}</span>
                </div>
                <div class="memory-entry-row">
                    <span class="mem-label">Credit</span>
                    <span class="mem-value" style="font-size: 9px;">${entry.creditStatus}</span>
                </div>
                <div class="memory-entry-skus">
                    ${skuLines}
                </div>
            </div>
        </div>`;
    });

    scrollContainer.innerHTML = html;
}

function clearBackfeedMemory() {
    backfeedMemoryLedger = [];
    renderBackfeedMemory();
    showToast('Memory Cleared', 'Backfeed Memory Ledger has been reset.', 'info');
}

// ==========================================
// 15c. MULTI-SCENARIO RUNNER
// ==========================================

let multiScenarioQueue = [];
let multiScenarioRunning = false;
let multiScenarioTotal = 0;
let multiScenarioIndex = 0;

const DEMO_SUITE_SCENARIOS = [
    'happy-path',      // S1: Baseline RFQ
    'security-path',   // S2: Threat Detection
    'credit-path',     // S3: Financial Governance
    'intercept-path',  // S5: Revenue Optimization
    'storm-path',      // S11: Mission-Critical Prioritization
    'bid-path'         // S12: Deadline Pressure
];

const ALL_SCENARIOS = [
    'happy-path', 'security-path', 'credit-path', 'pricing-path',
    'intercept-path', 'arbitrage-path', 'sizing-path', 'weg-path',
    'mersen-path', 'duraline-path', 'storm-path', 'bid-path'
];

function runDemoSuite() {
    if (multiScenarioRunning) {
        showToast('Already Running', 'A multi-scenario run is in progress. Wait for completion.', 'warning');
        return;
    }
    runScenarioQueue(DEMO_SUITE_SCENARIOS, 'Demo Suite');
}

function runAllScenarios() {
    if (multiScenarioRunning) {
        showToast('Already Running', 'A multi-scenario run is in progress. Wait for completion.', 'warning');
        return;
    }
    runScenarioQueue(ALL_SCENARIOS, 'Full Suite');
}

function runScenarioQueue(scenarios, suiteName) {
    multiScenarioQueue = [...scenarios];
    multiScenarioTotal = scenarios.length;
    multiScenarioIndex = 0;
    multiScenarioRunning = true;

    // Create a persistent multi-scenario progress banner
    let multiBanner = document.getElementById('multi-scenario-banner');
    if (!multiBanner) {
        multiBanner = document.createElement('div');
        multiBanner.id = 'multi-scenario-banner';
        multiBanner.style = `
            position: fixed;
            top: 12px;
            right: 20px;
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: #c7d2fe;
            border: 1px solid #6366f1;
            border-radius: 12px;
            padding: 10px 16px;
            font-size: 10px;
            font-weight: 600;
            display: flex;
            flex-direction: column;
            gap: 4px;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
            z-index: 10000;
            min-width: 220px;
        `;
        document.body.appendChild(multiBanner);
    }

    function updateMultiBanner(text, progress) {
        multiBanner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-layer-group" style="color: #818cf8;"></i>
                <span style="color: #e0e7ff; font-weight: 700;">${suiteName}</span>
            </div>
            <div style="font-size: 9px; color: #a5b4fc;">${text}</div>
            <div style="background: rgba(255,255,255,0.1); border-radius: 4px; height: 4px; overflow: hidden; margin-top: 2px;">
                <div style="height: 100%; background: linear-gradient(90deg, #818cf8, #6366f1); width: ${progress}%; transition: width 0.5s ease;"></div>
            </div>
            <div style="font-size: 8px; color: #818cf8; text-align: right;">${multiScenarioIndex} / ${multiScenarioTotal}</div>
        `;
    }

    function runNext() {
        if (multiScenarioQueue.length === 0) {
            // All done — show completion
            multiScenarioRunning = false;
            const totalRevenue = backfeedMemoryLedger.reduce((sum, e) => sum + e.totalValue, 0);
            updateMultiBanner(`✓ Complete! ${multiScenarioTotal} scenarios processed.`, 100);
            multiBanner.style.borderColor = '#22c55e';
            multiBanner.style.background = 'linear-gradient(135deg, #052e16, #14532d)';
            multiBanner.querySelector('div > span').style.color = '#86efac';

            showToast(`${suiteName} Complete`, `Processed ${multiScenarioTotal} scenarios. Total revenue: $${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}. Memory Ledger updated.`, 'success');

            // Auto-switch to Memory tab
            openCopilotTab('memory');

            setTimeout(() => {
                multiBanner.style.opacity = '0';
                multiBanner.style.transition = 'opacity 1s ease';
                setTimeout(() => { if (multiBanner.parentNode) multiBanner.parentNode.removeChild(multiBanner); }, 1000);
            }, 8000);
            return;
        }

        const nextScenario = multiScenarioQueue.shift();
        multiScenarioIndex++;
        const progress = Math.round((multiScenarioIndex / multiScenarioTotal) * 100);
        const data = scenarioMemoryData[nextScenario];
        updateMultiBanner(`Running S${data.scenarioId}: ${data.scenarioName}...`, progress - Math.round(100 / multiScenarioTotal));

        // Run the scenario
        startAutomatedDemo(nextScenario);

        // Wait for this scenario to finish, then log to memory and run next
        // Each scenario takes roughly 15-25 seconds depending on steps
        const scenarioTime = getScenarioEstimatedTime(nextScenario);
        setTimeout(() => {
            addToBackfeedMemory(nextScenario);
            updateMultiBanner(`S${data.scenarioId} complete. Loading next...`, progress);
            setTimeout(runNext, 2000);
        }, scenarioTime);
    }

    updateMultiBanner('Initializing scenario queue...', 0);
    setTimeout(runNext, 1500);
}

function getScenarioEstimatedTime(scenario) {
    // Estimated runtimes in ms based on the setTimeout chains in each scenario
    const times = {
        'happy-path': 28000,
        'security-path': 14000,
        'credit-path': 24000,
        'pricing-path': 26000,
        'intercept-path': 22000,
        'arbitrage-path': 24000,
        'sizing-path': 24000,
        'weg-path': 18000,
        'mersen-path': 18000,
        'duraline-path': 14000,
        'storm-path': 24000,
        'bid-path': 24000
    };
    return times[scenario] || 20000;
}

// ── Event Listeners for Multi-Scenario Runner & Memory ──

const btnRunDemoSuite = document.getElementById('btn-run-demo-suite');
const btnRunAllScenarios = document.getElementById('btn-run-all-scenarios');
const btnClearMemory = document.getElementById('btn-clear-memory');

if (btnRunDemoSuite) {
    btnRunDemoSuite.addEventListener('click', runDemoSuite);
}
if (btnRunAllScenarios) {
    btnRunAllScenarios.addEventListener('click', runAllScenarios);
}
if (btnClearMemory) {
    btnClearMemory.addEventListener('click', clearBackfeedMemory);
}

// ==========================================
// 16. SYSTEM INITIALIZATION
// ==========================================

function init() {
    initSettings();
    initNavigation();
    initMarketTickers();
    updateUnreadCount();
    initWordDocAssistant();
    initSlideBuilder();
    initWillCall();
    initScratchExplorer();
    
    // Set starting active email
    selectMail('mail-1');
    
    // Set default view to ERP
    setView('erp');

    // Auto-sync mailbox silently on startup
    setTimeout(() => {
        syncOutlookMailbox(true);
    }, 800);
}

// Boot operations on DOM load
window.addEventListener('DOMContentLoaded', () => {
    init();
});

// ==========================================
// 15. MICROSOFT WORD ADD-IN & NOTES ASSISTANT
// ==========================================

const wordDocumentStore = {};
let currentTypingInterval = null;

// Initialize event listeners for the Doc Briefing tab and mini ribbon
function initWordDocAssistant() {
    const docContainer = document.getElementById('word-doc-content');
    if (!docContainer) return;
    
    // Clear placeholder on focus
    docContainer.addEventListener('focus', () => {
        const placeholder = docContainer.querySelector('.word-doc-placeholder');
        if (placeholder) {
            docContainer.innerHTML = '';
            updateWordCount();
        }
    });

    // Restore placeholder if empty on blur
    docContainer.addEventListener('blur', () => {
        if (!docContainer.innerText.trim()) {
            docContainer.innerHTML = `<p style="color: #888888; font-style: italic; font-size: 11px;" class="word-doc-placeholder">Select an email and click "Auto-Parse Email" (or run a scenario) to watch the AI write the briefing. Click here to add your own notes...</p>`;
            updateWordCount();
        }
    });
    
    // Save content as the user types
    docContainer.addEventListener('input', () => {
        wordDocumentStore[activeMailId] = docContainer.innerHTML;
        updateWordCount();
    });

    // Make Ribbon Buttons active/functional
    document.querySelectorAll('.word-ribbon-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('title').toLowerCase();
            
            // Temporary focus back to document so command runs on selection
            docContainer.focus();
            
            if (action === 'bold') {
                document.execCommand('bold', false, null);
                btn.classList.toggle('active');
            } else if (action === 'italic') {
                document.execCommand('italic', false, null);
                btn.classList.toggle('active');
            } else if (action === 'underline') {
                document.execCommand('underline', false, null);
                btn.classList.toggle('active');
            } else if (action === 'bullets') {
                document.execCommand('insertUnorderedList', false, null);
            } else if (action === 'numbers') {
                document.execCommand('insertOrderedList', false, null);
            } else if (action === 'align left') {
                document.execCommand('justifyLeft', false, null);
            } else if (action === 'undo') {
                document.execCommand('undo', false, null);
            } else if (action === 'redo') {
                document.execCommand('redo', false, null);
            }
            
            // Update store
            wordDocumentStore[activeMailId] = docContainer.innerHTML;
            updateWordCount();
        });
    });
}

function updateWordDocTabForSelectedMail(mailId) {
    const docContainer = document.getElementById('word-doc-content');
    if (!docContainer) return;
    
    // Clear any active typing interval
    if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
        currentTypingInterval = null;
    }
    
    if (wordDocumentStore[mailId]) {
        docContainer.innerHTML = wordDocumentStore[mailId];
        docContainer.setAttribute('contenteditable', 'true');
    } else {
        docContainer.innerHTML = `<p style="color: #888888; font-style: italic; font-size: 11px;" class="word-doc-placeholder">Select an email and click "Auto-Parse Email" (or run a scenario) to watch the AI write the briefing. Click here to add your own notes...</p>`;
        docContainer.setAttribute('contenteditable', 'true');
    }
    updateWordCount();
}

function typeWordDocument(htmlContent) {
    const docContainer = document.getElementById('word-doc-content');
    if (!docContainer) return;
    
    if (currentTypingInterval) {
        clearInterval(currentTypingInterval);
        currentTypingInterval = null;
    }
    
    docContainer.setAttribute('contenteditable', 'false');
    docContainer.innerHTML = '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const nodes = Array.from(tempDiv.childNodes);
    
    let nodeIndex = 0;
    let charIndex = 0;
    let currentElement = null;
    let textToType = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'word-cursor';
    cursor.innerHTML = '|';
    docContainer.appendChild(cursor);
    
    function typeNextChar() {
        if (nodeIndex >= nodes.length) {
            clearInterval(currentTypingInterval);
            currentTypingInterval = null;
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            docContainer.setAttribute('contenteditable', 'true');
            wordDocumentStore[activeMailId] = docContainer.innerHTML;
            updateWordCount();
            return;
        }
        
        const node = nodes[nodeIndex];
        
        if (node.nodeType === Node.TEXT_NODE) {
            if (charIndex === 0) {
                textToType = node.textContent;
                currentElement = document.createTextNode('');
                docContainer.insertBefore(currentElement, cursor);
            }
            
            if (charIndex < textToType.length) {
                currentElement.textContent += textToType[charIndex];
                charIndex++;
            } else {
                nodeIndex++;
                charIndex = 0;
                typeNextChar();
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (charIndex === 0) {
                currentElement = node.cloneNode(false);
                docContainer.insertBefore(currentElement, cursor);
                textToType = node.innerHTML;
            }
            
            if (charIndex < textToType.length) {
                if (textToType[charIndex] === '<') {
                    const endTag = textToType.indexOf('>', charIndex);
                    if (endTag !== -1) {
                        currentElement.innerHTML += textToType.slice(charIndex, endTag + 1);
                        charIndex = endTag + 1;
                    } else {
                        currentElement.innerHTML += textToType[charIndex];
                        charIndex++;
                    }
                } else if (textToType[charIndex] === '&') {
                    const endEntity = textToType.indexOf(';', charIndex);
                    if (endEntity !== -1 && (endEntity - charIndex) < 10) {
                        currentElement.innerHTML += textToType.slice(charIndex, endEntity + 1);
                        charIndex = endEntity + 1;
                    } else {
                        currentElement.innerHTML += textToType[charIndex];
                        charIndex++;
                    }
                } else {
                    currentElement.innerHTML += textToType[charIndex];
                    charIndex++;
                }
            } else {
                nodeIndex++;
                charIndex = 0;
                typeNextChar();
            }
        } else {
            nodeIndex++;
            typeNextChar();
        }
        
        // Autoscroll wrapper as text prints
        const canvasWrapper = document.querySelector('.word-canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.scrollTop = canvasWrapper.scrollHeight;
        }
        
        updateWordCount();
    }
    
    currentTypingInterval = setInterval(typeNextChar, 10);
}

function updateWordCount() {
    const docContainer = document.getElementById('word-doc-content');
    const wordCountEl = document.getElementById('word-word-count');
    if (docContainer && wordCountEl) {
        let text = docContainer.innerText.replace('|', '').trim();
        const placeholder = docContainer.querySelector('.word-doc-placeholder');
        if (placeholder) {
            text = '';
        }
        const words = text ? text.split(/\s+/).filter(w => w.trim().length > 0).length : 0;
        wordCountEl.textContent = words;
    }
}

function triggerDocBriefingForMail(mailId) {
    let briefHTML = '';
    const mail = mailItems.find(m => m.id === mailId) || sentMailItems.find(m => m.id === mailId);
    const sender = mail ? mail.senderName : 'Unknown';
    const subject = mail ? mail.subject : 'No Subject';
    
    if (mailId === 'mail-intercept') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">LINE-CARD COMPETITOR BRAND INTERCEPT</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-LC-707-E</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. DETECTED COMPETITOR ENVELOPE</h2>
            <p>The client (Client Company Solutions) requested <strong>150 pcs Quadra Electric Q120 20A breakers</strong> and <strong>1,000 ft Union Metal EMT Conduit 3/4"</strong>. These are competitor lines outside the active represented brand roster.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. REPRESENTED LINE CARD STEER</h2>
            <p>Backfeed Brand Interceptor automatically mapped competitor products to exact drop-in equivalents from represented commission-yielding manufacturers:</p>
            <ul>
                <li>Quadra Electric Q120 &rarr; <strong>Titan Wiring Devices BKR-1P20</strong> (Unit Price: $8.50)</li>
                <li>Union Metal EMT 3/4" &rarr; <strong>Titan B-Line CON-EMT34</strong> (Unit Price: $4.43)</li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. AGENCY REVENUE STRATEGY</h2>
            <p>By substituting these represented lines, the quote generates <strong>$1,385.00 in commissionable revenue</strong> for Summit Electrical Sales. The auto-drafted email notifies the estimator of the represented drop-in code-compliant swap.</p>
        `;
    } else if (mailId === 'mail-arbitrage') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #eab308; padding-bottom: 3px; color: #eab308; margin-bottom: 10px;">STEALTH RECON & EMERGENCY RETAIL ARBITRAGE</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-RA-802-A</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. WAREHOUSE STOCKOUT REGISTERED</h2>
            <p>Client requested <strong>4 pcs AeroTherm Electric Unit Heater 5kW</strong> and <strong>2 pcs 100A Main Lug Subpanels</strong> for an emergency outage at Summit Valley Water Treatment Plant. Central logistics reports <strong>ZERO STOCK</strong> at the West Deptford yard.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. NEIGHBORHOOD RETAIL SUPPLY SCAN</h2>
            <p>The Stealth Recon Scraper queried the inventory databases of nearby contractor retail centers:</p>
            <ul>
                <li><strong>Mega Builders Supply (Runnemede, NJ - Store #6932):</strong> 5 units of AeroTherm Unit Heaters in Aisle 14, Bay 3.</li>
                <li><strong>Contractor Depot (Gloucester City, NJ - Store #1201):</strong> 3 units of 100A Main Lug Subpanels in Aisle 8, Bay 12.</li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. DISPATCH INSTRUCTIONS</h2>
            <p>The system generated a will-call courier ticket to secure retail stock and auto-drafted a proposal offering immediate local delivery to the site in 3 hours, protecting client relationships and operations.</p>
        `;
    } else if (mailId === 'mail-sizing') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">NEC CONDUCTOR SIZING & ALTERNATIVES SANDBOX</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-NC-341-S</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. INQUIRY ANALYSIS</h2>
            <p>The client (Apex Electrical Distributors) requested 800 ft of copper building wire (THHN 4/0 AWG, total weight 616 lbs). Central copper inventories are backlogged for 8 weeks.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. NEC CHAPTER 9 VOLTAGE DROP CALCULATIONS</h2>
            <p>To keep the project moving, the Sizing Engine calculated a code-compliant aluminum equivalent run at 240V over 150ft at 40A. Results:</p>
            <ul>
                <li>Recommended: <strong>Prime Aluminum 4/0 AWG Feeder (WIR-XHHW40)</strong></li>
                <li>Calculated Voltage Drop: <strong>2.54%</strong> (well below the maximum 3.0% NEC limit)</li>
                <li>Weight Sizing comparison: 360 lbs vs 616 lbs (<strong>41.5% logistical weight reduction</strong>)</li>
                <li>Logistical Cost Savings: <strong>$1,840.00</strong> in raw material and freight charges.</li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. PROPOSED RESPONSE</h2>
            <p>The auto-drafted reply advises the estimator of the engineered aluminum substitution to bypass the copper backlog and secure immediate order booking.</p>
        `;
    } else if (mailId === 'mail-1') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">BACKFEED TRANSACTION REPORT & ORDER AUDIT</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-TX-992-A</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. CLIENT INQUIRY OVERVIEW</h2>
            <p>On this date, an incoming RFQ was received from <strong>Client A Estimator</strong> representing <strong>Vanguard Contractors LLC</strong> (Account Ref: VG-992). The email body was analyzed using natural language processing to extract bills of materials (BOM) automatically.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. BOM MATERIAL EXTRACTION</h2>
            <ul>
                <li>1,200 ft Strut Channel 12G Galv (Represented Line: Titan B-Line)</li>
                <li>500 ft THHN 10 AWG Copper Wire (Represented Line: Liberty Wire)</li>
                <li>200 pcs EMT Compression Connector 1/2" (Represented Line: Matrix Fittings)</li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. FREIGHT PREPAID AND LOGISTICS CONSOLIDATION</h2>
            <p>Total weight calculated: <strong>1,380 lbs</strong>. The fittings items ($80 order value) failed the manufacturer prepaid threshold. Backfeed Sales Copilot initiated logistics optimization: consolidated fittings into the Flatbed Truck #03 queue departing for West Deptford, saving <strong>$350.00</strong> in freight fees for the client.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">4. CREDIT AUDIT & ERP INVENTORY CLEARANCE</h2>
            <p>ERP check confirms Vanguard Contractors LLC is in ACTIVE standing with <strong>$37,550.00</strong> in available credit. Account approved for order entry. Inventory allocated in Bin B-12 and C-04.</p>
        `;
    } else if (mailId === 'mail-4') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">PRICING SURCHARGE & MULTIPLIER UPDATE</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-PX-802-C</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. INCIDENT ANALYSIS</h2>
            <p>An RFQ was submitted by <strong>Client B Purchasing</strong> (Apex Electrical Distributors) requesting 3,000 ft of Aluminum feeder wire reels. In parallel, a vendor pricing bulletin was received indicating a <strong>+3.2% copper and aluminum surcharge</strong> multiplier update.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. PRICING SHEET RE-CALCULATION</h2>
            <p>The pricing engine dynamically modified the active multiplier: adjusted Liberty Copper base rates to <strong>$4.95/ft</strong> in the ERP system. The Apex quote proposal was re-computed with updated margins to ensure price compliance and prevent loss of gross profit.</p>
        `;
    } else if (mailId === 'mail-5') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">CREDIT STANDING AUDIT BRIEF</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-CR-481-H</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. CLIENT RISK PROFILE</h2>
            <p>Client: <strong>Beacon Electric Supply</strong> (Account: CUST-BC-481) requested Nova LED fixture quote of $13,800.00. ERP audit shows client balance due of <strong>$74,200.00</strong> on a <strong>$75,000.00</strong> limit.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. MITIGATION COMPLIANCE STEPS</h2>
            <p>Credit Risk level: <strong>HIGH / CREDIT WARNING</strong>. Backfeed system automatically placed the transaction on <strong>CREDIT HOLD</strong> and issued a 50% deposit request letter to Client C Estimator before order release.</p>
        `;
    } else if (mailId === 'mail-2' || mailId.startsWith('mail-threat-')) {
        const fromEmail = mail ? mail.senderEmail : 'specialist.a@erp-executives.top';
        const fromName = mail ? mail.senderName : 'Specialist A';
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #ef4444; padding-bottom: 3px; color: #ef4444; margin-bottom: 10px;">SECOPS ALERT & QUARANTINE REPORT</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-SEC-042-X</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #ef4444; margin-top: 8px;">1. SECURITY INCIDENT DETECTED</h2>
            <p>Sentinel Mail Gateway intercepted an incoming transmission from <strong>${fromEmail}</strong> claiming to be ${fromName} requesting a review of updated wire pricing list (.pdf.exe payload).</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. METADATA REASONING AND AUDIT</h2>
            <ul>
                <li>SPF Verification: <strong>FAIL</strong> (IP 203.0.113.111 not in authorized envelope record)</li>
                <li>DKIM Alignment: <strong>FAIL</strong> (No matching keys)</li>
                <li>Lexical Threat Score: <strong>95%</strong> (Urgent wire file bypass triggers)</li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. MITIGATION REMEDIAL ACTIONS</h2>
            <p>Email blocked and routed to Quarantine folder. The malicious executable was detached. Auto-quarantine completed successfully.</p>
        `;
    } else if (mailId === 'mail-9') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #eab308; padding-bottom: 3px; color: #eab308; margin-bottom: 10px;">ACCOUNTS PAYABLE VARIANCE RECONCILIATION</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-AP-992-V</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. INVOICE VARIANCE ANALYSIS</h2>
            <p>Accounts Payable flagged a direct billing price discrepancy for Vanguard Contractors order <strong>SO-99180</strong> (PO-99180) dated May 28, 2026.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. RECONCILIATION DETAILS</h2>
            <ul>
                <li><strong>Item:</strong> 500 pcs Matrix Fittings EMT 1/2" (MAT-FIT-201)</li>
                <li><strong>ERP PO Unit Price:</strong> $3.50/pc (Total: $1,750.00)</li>
                <li><strong>Vendor Invoice Unit Price:</strong> $3.78/pc (Total: $1,890.00)</li>
                <li><strong>Total Price Variance:</strong> <span style="color: #ef4444; font-weight: bold;">+$140.00 (8.0% over ERP)</span></li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. RESOLUTION ACTIONS REQUIRED</h2>
            <p>Operations Specialist must verify direct billing authorization: check if price adjustment reflects standard distributor margin updates or requires invoice price matching to prevent ledger errors.</p>
        `;
    } else if (mailId === 'mail-10') {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #eab308; padding-bottom: 3px; color: #eab308; margin-bottom: 10px;">ACCOUNTS PAYABLE VARIANCE RECONCILIATION</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-AP-993-V</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. INVOICE VARIANCE ANALYSIS</h2>
            <p>Accounts Payable flagged a direct billing price discrepancy for Redwood Electric order <strong>SO-99222</strong> (PO-99200) dated June 7, 2026.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. RECONCILIATION DETAILS</h2>
            <ul>
                <li><strong>Item:</strong> 2,500 pcs PVC Male Adapter 1" (FIT-PVCC)</li>
                <li><strong>ERP PO Unit Price:</strong> $0.98/pc (Total: $2,450.00)</li>
                <li><strong>Vendor Invoice Unit Price:</strong> $1.50/pc (Total: $3,750.00)</li>
                <li><strong>Total Price Variance:</strong> <span style="color: #ef4444; font-weight: bold;">+$1,300.00 (53.0% over ERP)</span></li>
            </ul>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. RESOLUTION ACTIONS REQUIRED</h2>
            <p>AP requires verification of discount codes or price-matching approval for DuraPVC. Warehouse checklist: check if heavy-wall industrial scheduling was substituted in place of standard scheduler 40 adapters.</p>
        `;
    } else if (mailId.startsWith('mail-injected-')) {
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">INJECTED INQUIRY AUDIT BRIEF</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-INJ-102-Y</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. INCOMING TRANSACTION SUMMARY</h2>
            <p>Client D Operations (Redwood Electric Operations) requested pricing and delivery for fittings drop-offs. Items were parsed successfully by Backfeed Speed-Quote.</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. LOGISTICS ANALYSIS</h2>
            <ul>
                <li>8,000 ft DuraPVC fittings coupling (2")</li>
                <li>2,500 pcs Matrix EMT Compression connector (1/2")</li>
            </ul>
            <p>Calculations show flatbed weight at 960 lbs. Mapped to West Deptford shipping queues for consolidation.</p>
        `;
    } else {
        let bomItemsHtml = '';
        if (mail && mail.body) {
            const parsed = parseRFQLines(mail.body);
            if (parsed && parsed.items && parsed.items.length > 0) {
                bomItemsHtml = `<h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">2. BOM MATERIAL EXTRACTION</h2><ul>` + 
                    parsed.items.map(it => `<li>${it.qty} pcs ${it.brandName} (${it.origText})</li>`).join('') + 
                    `</ul>`;
            }
        }
        
        briefHTML = `
            <h1 style="font-size: 13px; border-bottom: 2px solid #185abd; padding-bottom: 3px; color: #185abd; margin-bottom: 10px;">INCOMING WORKFLOW AUDIT</h1>
            <p style="font-size: 9px; color: #666666; margin-bottom: 10px;">Date: ${new Date().toLocaleDateString()} | Document ID: BF-GEN-010-Z</p>
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">1. METADATA PROFILE</h2>
            <p>Processed email from <strong>${sender}</strong> regarding <em>"${subject}"</em>. AI checks indicate safe sender alignments.</p>
            
            ${bomItemsHtml}
            
            <h2 style="font-size: 10.5px; font-weight: bold; color: #185abd; margin-top: 8px;">3. TRANSACTION BRIEFING</h2>
            <p>Routine operations log registered. Document routed to active sales queues.</p>
        `;
    }
    
    typeWordDocument(briefHTML);
}

// Initialize event listeners for the Slide Builder tab and generator
function initSlideBuilder() {
    const btnGen = document.getElementById('btn-generate-pptx');
    const btnGenOpen = document.getElementById('btn-generate-open-pptx');
    const scanBox = document.getElementById('pptx-scan-box');
    
    if (!btnGen || !btnGenOpen) return;
    
    function buildConfig(launch) {
        const title = document.getElementById('slide-deck-title').value;
        const theme = document.getElementById('slide-theme-select').value;
        const custom_notes = document.getElementById('slide-custom-notes').value;
        
        const slides = {
            title: document.getElementById('slide-chk-title').checked,
            backfeed: document.getElementById('slide-chk-backfeed').checked,
            commodities: document.getElementById('slide-chk-commodities').checked,
            titan: document.getElementById('slide-chk-titan').checked,
            core: document.getElementById('slide-chk-core').checked,
            smartcut: document.getElementById('slide-chk-smartcut').checked,
            parser: document.getElementById('slide-chk-parser').checked,
            strategic: document.getElementById('slide-chk-strategic').checked
        };
        
        return {
            title,
            theme,
            slides,
            custom_notes,
            launch
        };
    }
    
    function sendGenerateRequest(config) {
        scanBox.style.display = 'block';
        btnGen.disabled = true;
        btnGenOpen.disabled = true;
        
        showToast('PPTX Compilation Started', 'Re-building sales operations presentation...', 'success');
        
        fetch('/api/generate-pptx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(res => res.json())
        .then(data => {
            scanBox.style.display = 'none';
            btnGen.disabled = false;
            btnGenOpen.disabled = false;
            
            if (data.status === 'success') {
                showToast('PPTX Compiled Successfully', 'Slide deck is ready in your workspace.', 'success');
                addActivityItem(`Slide Deck Compiled: "${config.title}" using theme "${config.theme}".`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                
                // If it was just generate (not launch), trigger a browser download
                if (!config.launch) {
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.href = 'ERP_Workflow_Concept.pptx';
                    downloadAnchor.download = 'ERP_Workflow_Concept.pptx';
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    document.body.removeChild(downloadAnchor);
                }
            } else {
                showToast('Compilation Error', data.message, 'error');
            }
        })
        .catch(err => {
            scanBox.style.display = 'none';
            btnGen.disabled = false;
            btnGenOpen.disabled = false;
            console.warn("Backend offline, running browser PowerPoint simulator instead.");
            runPptxSimulation(config);
        });
    }

    // PowerPoint Live Compiler Simulator
    const pptxSimModal = document.getElementById('pptx-sim-modal');
    const btnClosePptxSim = document.getElementById('btn-close-pptx-sim');
    const btnClosePptxSimBottom = document.getElementById('pptx-sim-close-bottom-btn');
    
    if (btnClosePptxSim) {
        btnClosePptxSim.addEventListener('click', () => {
            pptxSimModal.style.display = 'none';
        });
    }
    if (btnClosePptxSimBottom) {
        btnClosePptxSimBottom.addEventListener('click', () => {
            pptxSimModal.style.display = 'none';
        });
    }

    const slideContentEl = document.getElementById('pptx-sim-slide-content');
    const slideFrameEl = document.getElementById('pptx-sim-slide-frame');
    const slideAccentEl = document.getElementById('pptx-sim-slide-accent');
    const slideNumEl = document.getElementById('pptx-sim-slide-num');
    const stepsListEl = document.getElementById('pptx-sim-steps');
    const simActionsEl = document.getElementById('pptx-sim-actions');
    const statusTextEl = document.getElementById('pptx-sim-status-text');
    const statusIconEl = document.getElementById('pptx-sim-status-icon');

    const themeColors = {
        'forest-green': { accent: '#15803d', cardHeader: '#eab308', text: '#0f172a' },
        'midnight-slate': { accent: '#0f172a', cardHeader: '#64748b', text: '#0f172a' },
        'deep-indigo': { accent: '#4f46e5', cardHeader: '#db2777', text: '#0f172a' },
        'blue-amber': { accent: '#0284c7', cardHeader: '#d97706', text: '#0f172a' }
    };

    function runPptxSimulation(config) {
        pptxSimModal.style.display = 'flex';
        simActionsEl.style.display = 'none';
        statusTextEl.textContent = 'Compiler Active';
        statusIconEl.className = 'fa-solid fa-circle-notch fa-spin';
        statusIconEl.style.color = '#b7472a';
        stepsListEl.innerHTML = '';
        slideContentEl.innerHTML = '';
        slideNumEl.textContent = 'Preparing presentation...';

        const theme = config.theme || 'blue-amber';
        const colors = themeColors[theme] || themeColors['blue-amber'];
        slideAccentEl.style.background = colors.accent;

        const steps = [
            { id: 'init', label: 'Initializing PowerPoint Engine...' },
            { id: 'layout', label: 'Configuring widescreen layout (16:9)...' },
            { id: 'slide1', label: 'Creating Cover Slide...' },
            { id: 'slide2', label: 'Compiling Slide 2: Market Dynamics...' },
            { id: 'slide3', label: 'Compiling Slide 3: Inside Sales Bottlenecks...' },
            { id: 'slide4', label: 'Compiling Slide 4: Backfeed Solution...' },
            { id: 'slide5', label: 'Compiling Slide 5: Operations Dashboard...' },
            { id: 'finalize', label: 'Packing files and generating download...' }
        ];

        // Filter steps based on slide switches in config
        const finalSteps = steps.filter(step => {
            if (step.id.startsWith('slide')) {
                const num = step.id.replace('slide', '');
                const key = num === '1' ? 'title' : `slide${num}`;
                // If slide is disabled in config, skip it
                if (config.slides && config.slides[key] === false) return false;
            }
            return true;
        });

        // Add steps to UI
        finalSteps.forEach(step => {
            const li = document.createElement('li');
            li.id = `pptx-step-${step.id}`;
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '8px';
            li.style.color = '#8a8886';
            li.style.marginBottom = '8px';
            li.innerHTML = `<i class="fa-regular fa-circle" id="pptx-step-icon-${step.id}"></i> <span>${step.label}</span>`;
            stepsListEl.appendChild(li);
        });

        let currentStepIdx = 0;

        function nextStep() {
            if (currentStepIdx >= finalSteps.length) {
                // Done!
                statusTextEl.textContent = 'Compilation Complete';
                statusIconEl.className = 'fa-solid fa-circle-check';
                statusIconEl.style.color = '#22c55e';
                simActionsEl.style.display = 'flex';
                showToast('PPTX Compiled Successfully', 'Slide deck is ready in your workspace.', 'success');
                addActivityItem(`Slide Deck Compiled: "${config.title}" using theme "${config.theme}".`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                
                // Automatically download precompiled file if launch is false
                if (!config.launch) {
                    const downloadAnchor = document.getElementById('pptx-sim-download-btn');
                    if (downloadAnchor) downloadAnchor.click();
                } else {
                    showToast('PowerPoint Opened', 'Desktop integration simulated (static preview mode).', 'success');
                }
                return;
            }

            const step = finalSteps[currentStepIdx];
            const li = document.getElementById(`pptx-step-${step.id}`);
            const icon = document.getElementById(`pptx-step-icon-${step.id}`);
            
            if (li && icon) {
                li.style.color = '#323130';
                li.style.fontWeight = '600';
                icon.className = 'fa-solid fa-circle-notch fa-spin';
                icon.style.color = '#b7472a';
            }

            // Perform visual action based on step
            if (step.id === 'init' || step.id === 'layout') {
                slideContentEl.innerHTML = `
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #8a8886; font-size: 13px; font-family: sans-serif;">
                        <i class="fa-solid fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 10px; color: #b7472a;"></i>
                        <span>${step.label}</span>
                    </div>
                `;
                setTimeout(() => {
                    markStepDone(step.id);
                    currentStepIdx++;
                    nextStep();
                }, 1000);
            } else if (step.id === 'finalize') {
                slideContentEl.innerHTML = `
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #22c55e; font-size: 13px; font-family: sans-serif;">
                        <i class="fa-solid fa-file-powerpoint" style="font-size: 36px; margin-bottom: 10px; color: #b7472a;"></i>
                        <span style="font-weight: 600;">Packaging Presentation Slide Deck...</span>
                    </div>
                `;
                setTimeout(() => {
                    markStepDone(step.id);
                    currentStepIdx++;
                    nextStep();
                }, 1200);
            } else {
                // Render slide preview
                const slideNum = step.id.replace('slide', '');
                slideNumEl.textContent = `Slide ${slideNum} of 5`;
                renderSlidePreview(parseInt(slideNum), config, colors, () => {
                    markStepDone(step.id);
                    currentStepIdx++;
                    setTimeout(nextStep, 500); // Small gap between slides
                });
            }
        }

        function markStepDone(id) {
            const li = document.getElementById(`pptx-step-${id}`);
            const icon = document.getElementById(`pptx-step-icon-${id}`);
            if (li && icon) {
                li.style.color = '#605e5c';
                li.style.fontWeight = 'normal';
                icon.className = 'fa-solid fa-circle-check';
                icon.style.color = '#22c55e';
            }
        }

        nextStep();
    }

    function renderSlidePreview(num, config, colors, callback) {
        slideContentEl.innerHTML = '';

        if (num === 1) {
            // Cover Page
            slideContentEl.innerHTML = `
                <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; padding-left: 20px;">
                    <h1 id="sim-slide-title" style="font-size: 20px; font-weight: bold; color: ${colors.text}; line-height: 1.2; margin-bottom: 8px; font-family: Calibri, sans-serif; text-align: left;"></h1>
                    <p id="sim-slide-sub" style="font-size: 10px; color: #605e5c; margin: 0; font-weight: 600; font-family: Calibri, sans-serif; text-align: left;"></p>
                    <div style="border-top: 1px solid #edebe9; margin-top: 15px; padding-top: 8px; font-size: 8px; color: #8a8886; font-family: Calibri, sans-serif; text-align: left;">
                        Prepared for ERP Distribution â€¢ Operations Enablement
                    </div>
                </div>
            `;
            
            // Live Type Cover Title
            const titleText = config.title || "Summit Sales Operations & Cognitive Automation Strategy";
            const subText = "Operations Architecture & Cognitive Automation Strategy";
            
            typeWriterEffect('sim-slide-title', titleText, 15, () => {
                typeWriterEffect('sim-slide-sub', subText, 10, callback);
            });
        } else if (num === 2) {
            // Market Dynamics
            slideContentEl.innerHTML = `
                <div style="font-size: 8px; font-weight: bold; color: ${colors.accent}; margin-bottom: 2px; text-align: left;">COGNITIVE OPERATIONS COMMAND</div>
                <h2 style="font-size: 14px; font-weight: bold; color: ${colors.text}; margin: 0 0 10px 0; text-align: left;">Market Dynamics & Price Volatility</h2>
                
                <div style="display: flex; gap: 15px; flex: 1;">
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.cardHeader}; margin: 0 0 6px 0;">Raw Materials Spot pricing</h4>
                        <ul id="sim-slide-list-1" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.accent}; margin: 0 0 6px 0;">Margin Erosion Vulnerability</h4>
                        <ul id="sim-slide-list-2" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                </div>
            `;

            const list1 = [
                "Base metal spot indices fluctuate on 24hr cycles.",
                "Copper building wire pricing changes dynamically.",
                "Strut channel steel surcharges require validation."
            ];
            const list2 = [
                "Static cost sheets lead to bidding discrepancies.",
                "Commercial contracts lock margins for 180+ days.",
                "Real-time indexing required to safeguard profits."
            ];

            typeListEffect('sim-slide-list-1', list1, () => {
                typeListEffect('sim-slide-list-2', list2, callback);
            });
        } else if (num === 3) {
            // Quoting Latency
            slideContentEl.innerHTML = `
                <div style="font-size: 8px; font-weight: bold; color: ${colors.accent}; margin-bottom: 2px; text-align: left;">COGNITIVE OPERATIONS COMMAND</div>
                <h2 style="font-size: 14px; font-weight: bold; color: ${colors.text}; margin: 0 0 10px 0; text-align: left;">Inside Sales & Quoting Latency</h2>
                
                <div style="display: flex; gap: 15px; flex: 1;">
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.cardHeader}; margin: 0 0 6px 0;">RFQ Intake Bottlenecks</h4>
                        <ul id="sim-slide-list-1" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.accent}; margin: 0 0 6px 0;">Logistics & Pallet Packing</h4>
                        <ul id="sim-slide-list-2" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                </div>
            `;

            const list1 = [
                "Sales reps spend hours manually keying in unstructured BOMs.",
                "Hand-off latency between strut specialists & wire specialists.",
                "Credit limit holds verified late in sales pipeline."
            ];
            const list2 = [
                "Manual volumetric calculations delay transport dispatch.",
                "Prepaid freight thresholds calculated manually.",
                "Risk of flatbed overload citations on state highways."
            ];

            typeListEffect('sim-slide-list-1', list1, () => {
                typeListEffect('sim-slide-list-2', list2, callback);
            });
        } else if (num === 4) {
            // Backfeed Automation
            slideContentEl.innerHTML = `
                <div style="font-size: 8px; font-weight: bold; color: ${colors.accent}; margin-bottom: 2px; text-align: left;">COGNITIVE OPERATIONS COMMAND</div>
                <h2 style="font-size: 14px; font-weight: bold; color: ${colors.text}; margin: 0 0 10px 0; text-align: left;">Backfeed Cognitive Automation</h2>
                
                <div style="display: flex; gap: 15px; flex: 1;">
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.cardHeader}; margin: 0 0 6px 0;">Unified Intake Engine</h4>
                        <ul id="sim-slide-list-1" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.accent}; margin: 0 0 6px 0;">Intelligent Guardrails</h4>
                        <ul id="sim-slide-list-2" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                </div>
            `;

            const list1 = [
                "BOM extraction completed in under 2.0 seconds.",
                "Automatic routing to designated line-card specialists.",
                "Dynamic pricing formulas linked to metal tickers."
            ];
            const list2 = [
                "ERP credit standing verified during email intake.",
                "Logistics simulator calculates load volume and pallet stacking.",
                "Automatic pallet staging layouts sent to warehouse staging area."
            ];

            typeListEffect('sim-slide-list-1', list1, () => {
                typeListEffect('sim-slide-list-2', list2, callback);
            });
        } else if (num === 5) {
            // Dashboard Metrics
            slideContentEl.innerHTML = `
                <div style="font-size: 8px; font-weight: bold; color: ${colors.accent}; margin-bottom: 2px; text-align: left;">COGNITIVE OPERATIONS COMMAND</div>
                <h2 style="font-size: 14px; font-weight: bold; color: ${colors.text}; margin: 0 0 10px 0; text-align: left;">Operations Control & Financial Impact</h2>
                
                <div style="display: flex; gap: 15px; flex: 1;">
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.cardHeader}; margin: 0 0 6px 0;">Operational Improvements</h4>
                        <ul id="sim-slide-list-1" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                    <div style="flex: 1; background: #faf9f8; border: 1px solid #edebe9; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; text-align: left;">
                        <h4 style="font-size: 9px; font-weight: bold; color: ${colors.accent}; margin: 0 0 6px 0;">Financial Acceleration</h4>
                        <ul id="sim-slide-list-2" style="font-size: 7.5px; padding-left: 12px; margin: 0; line-height: 1.4; color: #323130; text-align: left;"></ul>
                    </div>
                </div>
            `;

            const list1 = [
                "Surcharge updates propagated instantly across lines.",
                "98% accuracy in inventory weight estimation.",
                "Mitigation actions logged dynamically on invoice logs."
            ];
            const list2 = [
                "60% reduction in staging and loading labor.",
                "10x inside sales throughput speed.",
                "Protect margins on large-scale commercial bids."
            ];

            typeListEffect('sim-slide-list-1', list1, () => {
                typeListEffect('sim-slide-list-2', list2, callback);
            });
        }
    }

    function typeWriterEffect(elementId, text, speed, callback) {
        const el = document.getElementById(elementId);
        if (!el) {
            callback();
            return;
        }
        let i = 0;
        el.textContent = '';
        function type() {
            if (i < text.length) {
                el.textContent += text.substr(i, 2);
                i += 2;
                setTimeout(type, speed);
            } else {
                el.textContent = text;
                callback();
            }
        }
        type();
    }

    function typeListEffect(listId, items, callback) {
        const listEl = document.getElementById(listId);
        if (!listEl) {
            callback();
            return;
        }
        let currentItemIdx = 0;

        function typeNextItem() {
            if (currentItemIdx >= items.length) {
                callback();
                return;
            }
            const text = items[currentItemIdx];
            const li = document.createElement('li');
            li.style.marginBottom = '4px';
            li.style.textAlign = 'left';
            listEl.appendChild(li);

            let i = 0;
            function typeChar() {
                if (i < text.length) {
                    li.textContent += text.substr(i, 3);
                    i += 3;
                    setTimeout(typeChar, 8);
                } else {
                    li.textContent = text;
                    currentItemIdx++;
                    setTimeout(typeNextItem, 100);
                }
            }
            typeChar();
        }
        typeNextItem();
    }

    btnGen.addEventListener('click', () => {
        const config = buildConfig(false);
        sendGenerateRequest(config);
    });
    
    btnGenOpen.addEventListener('click', () => {
        const config = buildConfig(true);
        sendGenerateRequest(config);
    });
}

// ==========================================
// 17. WILL CALL STAGING QUEUE ENGINE
// ==========================================

const willCallTickets = [
    {
        id: 'WC-99234',
        customerName: 'Dave Anderson',
        company: 'Client Company Solutions (C-1001)',
        customerId: 'CUST-TS-1001',
        date: 'June 10, 2026',
        time: '08:02 AM',
        items: [
            { sku: 'CON-EMT34', qty: 200, desc: 'EMT Conduit 3/4" x 10\' Galvanized', price: 886.00 },
            { sku: 'FIT-EMTC', qty: 100, desc: 'EMT Compression Connector 3/4"', price: 74.00 },
            { sku: 'ACC-WNUT', qty: 10, desc: 'Wire Connectors Yellow Box/100', price: 98.60 }
        ],
        total: 1058.60,
        status: 'STAGED', // PICKING, STAGED, READY, DISPATCHED
        bin: 'Ewing Bin B-12',
        runnerName: 'Mark Patterson',
        notes: 'Dave Anderson requested will-call checkout. Runner on the way.'
    },
    {
        id: 'WC-99236',
        customerName: 'James Miller',
        company: 'Garden State Solar (C-1005)',
        customerId: 'CUST-GS-1005',
        date: 'June 9, 2026',
        time: '04:15 PM',
        items: [
            { sku: 'CON-PVC10', qty: 1000, desc: 'PVC Sch40 Conduit 1" x 10\' Grey', price: 3440.00 }
        ],
        total: 3440.00,
        status: 'PICKING',
        bin: 'Ewing Bin D-11',
        runnerName: 'Steve Smith',
        notes: 'Solar hookup project will call.'
    },
    {
        id: 'WC-99237',
        customerName: 'Chris Dominguez',
        company: 'Atlantic City Electric Svcs (C-1007)',
        customerId: 'CUST-AC-1007',
        date: 'June 8, 2026',
        time: '02:15 PM',
        items: [
            { sku: 'WIR-THHN12', qty: 2000, desc: 'THHN 12 AWG Solid Copper Green', price: 680.00 },
            { sku: 'DEV-R20A', qty: 100, desc: 'Duplex Receptacle 20A 125V White', price: 172.00 },
            { sku: 'ACC-TAPE', qty: 20, desc: 'Premium Black Electrical Tape', price: 62.00 }
        ],
        total: 914.00,
        status: 'READY',
        bin: 'Staging Pallet #2',
        runnerName: 'Luis Morales',
        notes: 'Boardwalk phase 2 refit items. Credit hold resolved.'
    }
];

let selectedWcTicketId = null;
let currentWcFilter = 'all';

function renderWillCallList() {
    if (!wcTicketsContainer) return;
    wcTicketsContainer.innerHTML = '';
    
    // Filter tickets
    let filtered = willCallTickets.filter(t => {
        const query = wcSearchInput.value.toLowerCase();
        const matchesQuery = t.id.toLowerCase().includes(query) || 
                             t.customerName.toLowerCase().includes(query) || 
                             t.company.toLowerCase().includes(query);
                             
        if (currentWcFilter === 'all') return matchesQuery;
        return t.status.toLowerCase() === currentWcFilter.toLowerCase() && matchesQuery;
    });
    
    if (filtered.length === 0) {
        wcTicketsContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 30px 0; font-style: italic; background: #ffffff; border: 1px dashed #edebe9; border-radius: 8px; font-size: 11px;">
                No tickets in this status.
            </div>
        `;
        return;
    }
    
    filtered.forEach(t => {
        const card = document.createElement('div');
        card.style.margin = '0';
        
        let statusColor = 'var(--text-secondary)';
        let statusBg = '#f3f2f1';
        let leftBorder = '4px solid #8a8886';
        
        if (t.status === 'PICKING') {
            statusColor = '#b45309';
            statusBg = '#fffbeb';
            leftBorder = '4px solid #b45309';
        } else if (t.status === 'STAGED') {
            statusColor = '#7c3aed';
            statusBg = '#f5f3ff';
            leftBorder = '4px solid #7c3aed';
        } else if (t.status === 'READY') {
            statusColor = '#15803d';
            statusBg = '#f0fdf4';
            leftBorder = '4px solid #15803d';
        } else if (t.status === 'DISPATCHED') {
            statusColor = '#4b5563';
            statusBg = '#f3f4f6';
            leftBorder = '4px solid #9ca3af';
        }
        
        const isActive = selectedWcTicketId === t.id;
        const activeShadow = isActive ? 'box-shadow: 0 0 0 2px var(--accent-electric);' : '';
        
        card.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 6px; background: #ffffff; border: 1px solid #edebe9; border-left: ${leftBorder}; cursor: pointer; transition: all 0.2s ease; ${activeShadow}" class="wc-item-hover">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: var(--text-primary); font-size: 12px;">${t.id}</span>
                    <span style="font-size: 9px; padding: 2px 6px; font-weight: bold; border-radius: 3px; background: ${statusBg}; color: ${statusColor};">${t.status}</span>
                </div>
                <div style="font-size: 11px; font-weight: 600; color: var(--text-primary);">${t.company}</div>
                <div style="font-size: 10px; color: var(--text-secondary); display: flex; justify-content: space-between;">
                    <span>Runner: ${t.runnerName || 'Pending'}</span>
                    <span>${t.time}</span>
                </div>
                <div style="font-size: 11px; font-weight: bold; color: var(--accent-electric); text-align: right; margin-top: 4px;">
                    $${t.total.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            selectedWcTicketId = t.id;
            renderWillCallList();
            showWillCallDetail(t);
        });
        
        wcTicketsContainer.appendChild(card);
    });
}

function showWillCallDetail(t) {
    if (!t) {
        wcDetailContent.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: 60px 0;">
                <i class="fa-solid fa-people-carry-box" style="font-size: 48px; color: #cbd5e1; margin-bottom: 15px;"></i>
                <p style="font-size: 14px; font-weight: 500;">Select a Will Call ticket to view details</p>
            </div>
        `;
        wcDetailActions.style.display = 'none';
        return;
    }
    
    wcDetailActions.style.display = 'flex';
    
    // Configure buttons state
    if (t.status === 'PICKING') {
        btnWcStage.disabled = false;
        btnWcReady.disabled = false;
        btnWcDispatch.disabled = true;
    } else if (t.status === 'STAGED') {
        btnWcStage.disabled = true;
        btnWcReady.disabled = false;
        btnWcDispatch.disabled = false;
    } else if (t.status === 'READY') {
        btnWcStage.disabled = true;
        btnWcReady.disabled = true;
        btnWcDispatch.disabled = false;
    } else if (t.status === 'DISPATCHED') {
        btnWcStage.disabled = true;
        btnWcReady.disabled = true;
        btnWcDispatch.disabled = true;
    }
    
    let itemsHtml = t.items.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 6px 0; border-bottom: 1px solid #edebe9;">
            <span><strong>${item.qty} pcs</strong> ${item.desc} (${item.sku})</span>
            <span style="font-weight: 600;">$${item.price.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
    `).join('');
    
    wcDetailContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #edebe9; padding-bottom: 12px;">
                <div>
                    <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0 0 4px 0;">Ticket ${t.id}</h3>
                    <span style="font-size: 11px; color: var(--text-secondary);">${t.date} at ${t.time}</span>
                </div>
                <span style="font-size: 10px; font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px;">CUSTOMER PICKUP</span>
            </div>
            
            <div>
                <h4 style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 6px 0;">Customer Details</h4>
                <div style="font-size: 13px; font-weight: bold; color: var(--text-primary);">${t.company}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Authorized Buyer: ${t.customerName}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">Runner Name: <strong>${t.runnerName || 'Pending / Unspecified'}</strong></div>
            </div>
            
            <div>
                <h4 style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 6px 0;">Staging Location</h4>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-location-dot" style="color: var(--accent-electric); font-size: 14px;"></i>
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${t.bin || 'NOT YET STAGED'}</span>
                </div>
            </div>
            
            <div>
                <h4 style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 6px 0; border-bottom: 1px solid #edebe9; padding-bottom: 4px;">Items to Pick</h4>
                <div style="display: flex; flex-direction: column; max-height: 120px; overflow-y: auto;">
                    ${itemsHtml}
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; margin-top: 10px; color: var(--text-primary);">
                    <span>Total Order Value:</span>
                    <span>$${t.total.toLocaleString([], {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
            </div>
            
            ${t.notes ? `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px;">
                <h4 style="font-size: 10px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin: 0 0 4px 0;">Special Instructions</h4>
                <p style="font-size: 11px; color: var(--text-primary); margin: 0;">${t.notes}</p>
            </div>
            ` : ''}
        </div>
    `;
}

function initWillCall() {
    if (!wcSearchInput) return; // Guard clause
    
    wcSearchInput.addEventListener('input', () => {
        renderWillCallList();
    });

    const filters = [
        { btn: wcFilterAll, val: 'all' },
        { btn: wcFilterPicking, val: 'picking' },
        { btn: wcFilterStaged, val: 'staged' },
        { btn: wcFilterReady, val: 'ready' }
    ];

    filters.forEach(f => {
        if (f.btn) {
            f.btn.addEventListener('click', () => {
                filters.forEach(x => { if (x.btn) x.btn.classList.remove('active'); });
                f.btn.classList.add('active');
                currentWcFilter = f.val;
                renderWillCallList();
            });
        }
    });

    if (btnCreateWcTicket) {
        btnCreateWcTicket.addEventListener('click', () => {
            const nextIdNum = willCallTickets.length + 235;
            const newId = `WC-99${nextIdNum}`;
            const newTicket = {
                id: newId,
                customerName: 'Estimator (Client A)',
                company: 'Vanguard Contractors LLC',
                customerId: 'CUST-VG-992',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                items: [
                    { sku: 'FIT-EMTS', qty: 200, desc: 'EMT Set Screw Coupling 3/4"', price: 150.00 },
                    { sku: 'BOX-4SQR', qty: 50, desc: '4" Square Metal Box 1-1/2" Deep', price: 110.00 }
                ],
                total: 260.00,
                status: 'PICKING',
                bin: 'Ewing Bin A-10',
                runnerName: 'Frank Jones',
                notes: 'Urgent pick ticket generated from counter walk-in.'
            };
            willCallTickets.unshift(newTicket);
            selectedWcTicketId = newId;
            renderWillCallList();
            showWillCallDetail(newTicket);
            showToast('Ticket Created', `Generated pick ticket ${newId}.`, 'success');
        });
    }

    if (btnWcStage) {
        btnWcStage.addEventListener('click', () => {
            if (!selectedWcTicketId) return;
            const t = willCallTickets.find(x => x.id === selectedWcTicketId);
            if (t && t.status === 'PICKING') {
                t.status = 'STAGED';
                t.bin = 'Ewing Bin B-12';
                addActivityItem(`Will call ticket ${t.id} staged at ${t.bin} for ${t.company}.`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                showToast('Staged', `Ticket ${t.id} marked as STAGED.`, 'success');
                renderWillCallList();
                showWillCallDetail(t);
            }
        });
    }

    if (btnWcReady) {
        btnWcReady.addEventListener('click', () => {
            if (!selectedWcTicketId) return;
            const t = willCallTickets.find(x => x.id === selectedWcTicketId);
            if (t && (t.status === 'PICKING' || t.status === 'STAGED')) {
                t.status = 'READY';
                addActivityItem(`Will call ticket ${t.id} marked READY for customer pickup at counter.`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                showToast('Ready for Pickup', `Ticket ${t.id} is ready at counter.`, 'success');
                renderWillCallList();
                showWillCallDetail(t);
            }
        });
    }

    if (btnWcDispatch) {
        btnWcDispatch.addEventListener('click', () => {
            if (!selectedWcTicketId) return;
            const t = willCallTickets.find(x => x.id === selectedWcTicketId);
            if (t && t.status !== 'DISPATCHED') {
                t.status = 'DISPATCHED';
                addActivityItem(`Counter runner ${t.runnerName || 'Buyer'} checked out will-call ticket ${t.id}. Handed off items.`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                showToast('Dispatched', `Ticket ${t.id} closed and items handed off to customer.`, 'success');
                renderWillCallList();
                showWillCallDetail(t);
            }
        });
    }
}

// Window Message event listener for parent portal order synchronization
window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data) return;
    
    if (data.type === 'AUTO_CREATE_ORDER') {
        const order = data.order;
        if (!order) return;
        
        const customerId = order.customerId || 'CUST-VG-992';
        if (!customerOrdersDatabase[customerId]) {
            customerOrdersDatabase[customerId] = [];
        }
        
        const orderId = order.orderId || `SO-${lastOrderId + 1}`;
        if (order.orderId) {
            const numPart = parseInt(orderId.replace('SO-', ''));
            if (!isNaN(numPart) && numPart > lastOrderId) lastOrderId = numPart;
        } else {
            lastOrderId++;
        }
        
        const isWillCall = order.shippingMethod === 'willcall' || order.shippingMethod === 'Will Call' || (order.notes && order.notes.toLowerCase().includes('will call'));
        
        const newOrder = {
            orderId: orderId,
            date: order.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            items: order.items || 'Electrical Staging Materials',
            price: order.price || order.total || 0,
            status: isWillCall ? 'Hold' : 'Processing'
        };
        
        customerOrdersDatabase[customerId].unshift(newOrder);
        
        if (isWillCall) {
            const nextIdNum = willCallTickets.length + 235;
            const newWcId = `WC-99${nextIdNum}`;
            
            let wcItems = [];
            if (Array.isArray(order.itemLines)) {
                wcItems = order.itemLines.map(x => ({
                    sku: x.sku || 'ACC-TAPE',
                    qty: x.qty || 1,
                    desc: x.desc || x.sku || 'Staged Item',
                    price: x.price || 0
                }));
            } else {
                wcItems = [{ sku: 'ACC-TAPE', qty: 1, desc: order.items, price: order.price }];
            }
            
            const newWcTicket = {
                id: newWcId,
                customerName: order.buyerName || 'Counter Buyer',
                company: order.company || 'Distributor Customer',
                customerId: customerId,
                date: newOrder.date,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                items: wcItems,
                total: newOrder.price,
                status: 'PICKING',
                bin: 'Ewing Bin B-10',
                runnerName: order.runnerName || order.buyerName || 'Runner',
                notes: order.notes || 'Automated voice order mapped for Ewing will-call.'
            };
            
            willCallTickets.unshift(newWcTicket);
            
            addActivityItem(`AUTO-SYNC: Voice will-call order ${newWcTicket.id} received. Staged picking ticket in Ewing warehouse zone.`, newWcTicket.time);
            
            if (activeView === 'willcall') {
                renderWillCallList();
            }
        }
        
        const activeMail = mailItems.find(m => m.id === activeMailId);
        if (activeMail) {
            updateERPPane(activeMail);
        }
    }
});

// Stochastic Email Generator for "Craziness" without Demo Scenario
function startStochasticMockEmails() {
    function scheduleNextEmail() {
        // Stochastic interval: exponential distribution with mean 30 seconds
        // Using Math.random(), mean = 30000ms. Range: 15s to 60s
        const lambda = 1 / 30000;
        const delay = Math.max(10000, Math.min(60000, -Math.log(Math.random()) / lambda));
        
        setTimeout(() => {
            generateStochasticEmail();
            scheduleNextEmail();
        }, delay);
    }
    
    function generateStochasticEmail() {
        const senders = [
            { email: 'sales@libertywire-mock.com', name: 'Liberty Wire Sales' },
            { email: 'orders@matrixfittings-mock.com', name: 'Matrix Fittings' },
            { email: 'client.a@vanguard-mock.com', name: 'Client A Estimator' },
            { email: 'purchasing@beaconelectric-mock.com', name: 'Beacon Purchasing' },
            { email: 'unknown@external-typo-mock.com', name: 'External Lead' }
        ];
        
        const subjects = [
            "Urgent RFQ - Yard Expansion",
            "Quote Needed: THHN Wire & EMT",
            "Discrepancy on Invoice #4991",
            "Pricing Inquiry - Q3 Projects",
            "Emergency Restock: Connectors & Strut"
        ];
        
        const bodies = [
            "We need a quote for 5000 ft of 4/0 Copper wire, direct-ship.",
            "Please price out 200 sticks of 1-inch EMT and 150 compression fittings.",
            "I noticed a variance on the last invoice. ERP shows $3.50 but we were billed $4.00.",
            "Looking to get your best multiplier on Liberty cable for an upcoming bid.",
            "Can you quote 10 boxes of yellow wire nuts and 50 GFCI receptacles?"
        ];
        
        const sender = senders[Math.floor(Math.random() * senders.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const body = bodies[Math.floor(Math.random() * bodies.length)];
        
        const mockMail = {
            id: `stochastic-${Date.now()}`,
            senderName: sender.name,
            senderEmail: sender.email,
            date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            subject: subject,
            snippet: body.substring(0, 60) + '...',
            body: body,
            folder: 'inbox',
            unread: true,
            hasAttachment: false,
            attachmentName: '',
            riskScore: sender.email.includes('typo') ? 85 : 0 // Trigger security block occasionally
        };
        
        mailItems.unshift(mockMail);
        updateUnreadCount();
        addActivityItem(`New incoming email from ${sender.name}: "${subject}"`, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('New Message Received', `From: ${sender.name} - ${subject}`, 'info');
        
        if (activeView === 'mail' && activeFolder === 'inbox') {
            renderMailList();
        }
        
        if (typeof vacationAutopilotActive !== 'undefined' && vacationAutopilotActive) {
            // Autopilot will handle it immediately
            setTimeout(() => {
                if (typeof handleAutopilotIncomingMail === 'function') {
                    handleAutopilotIncomingMail(mockMail);
                }
            }, 2500);
        }
    }
    
    // Start loop
    scheduleNextEmail();
}

// Automatically start pulling mock emails via stochastic formula
startStochasticMockEmails();

// ==========================================
// SCRATCH FILES EXPLORER ENGINE
// ==========================================

function loadScratchFiles() {
    scratchFileList.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-light); font-size: 12px;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 18px; margin-bottom: 8px;"></i>
            <p>Loading files list...</p>
        </div>
    `;
    
    fetch('/api/scratch/list')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const workspace = scratchWorkspaceSelect.value;
            const files = data[workspace] || [];
            
            if (files.length === 0) {
                scratchFileList.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: var(--text-light); font-size: 12px;">
                        <i class="fa-regular fa-folder-open" style="font-size: 18px; margin-bottom: 8px;"></i>
                        <p>No scratch files found in this workspace.</p>
                    </div>
                `;
                return;
            }
            
            scratchFileList.innerHTML = '';
            files.forEach(file => {
                const item = document.createElement('div');
                item.style.padding = '8px 12px';
                item.style.borderRadius = '6px';
                item.style.cursor = 'pointer';
                item.style.fontSize = '12px';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.gap = '2px';
                item.style.transition = 'all 0.2s';
                item.style.border = '1px solid transparent';
                item.className = 'scratch-file-item';
                
                // Style hover effect
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--outlook-bg-hover)';
                });
                item.addEventListener('mouseleave', () => {
                    if (!item.classList.contains('selected')) {
                        item.style.backgroundColor = 'transparent';
                    }
                });
                
                // Calculate size in KB
                const sizeKB = (file.size / 1024).toFixed(1);
                
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span style="font-weight: 600; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 190px;"><i class="fa-regular fa-file-code" style="margin-right: 6px; color: var(--text-secondary);"></i>${file.name}</span>
                        <span style="font-size: 10px; color: var(--text-light);">${sizeKB} KB</span>
                    </div>
                    <span style="font-size: 10px; color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${file.desc}</span>
                `;
                
                item.addEventListener('click', () => {
                    // Remove active state from other items
                    document.querySelectorAll('.scratch-file-item').forEach(el => {
                        el.classList.remove('selected');
                        el.style.backgroundColor = 'transparent';
                        el.style.borderColor = 'transparent';
                    });
                    item.classList.add('selected');
                    item.style.backgroundColor = 'rgba(0, 120, 212, 0.05)';
                    item.style.borderColor = 'rgba(0, 120, 212, 0.15)';
                    
                    viewScratchFile(workspace, file.name, file.size);
                });
                
                scratchFileList.appendChild(item);
            });
        })
        .catch(err => {
            console.error('Error loading scratch list:', err);
            scratchFileList.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--color-danger); font-size: 12px;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 18px; margin-bottom: 8px;"></i>
                    <p>Failed to load files list.</p>
                </div>
            `;
        });
}

function viewScratchFile(workspace, filename, size) {
    scratchViewerFilename.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 6px; color: var(--outlook-blue);"></i> Loading ${filename}...`;
    scratchViewerSize.textContent = '';
    scratchCodeDisplay.textContent = 'Fetching file contents...';
    scratchCodeDisplay.style.color = '#cbd5e1';
    
    const sizeKB = (size / 1024).toFixed(1);
    
    fetch(`/api/scratch/view?workspace=${workspace}&file=${encodeURIComponent(filename)}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(content => {
            scratchViewerFilename.innerHTML = `<i class="fa-solid fa-file-code" style="color: var(--outlook-blue); margin-right: 6px;"></i> ${filename}`;
            scratchViewerSize.textContent = `${sizeKB} KB`;
            scratchCodeDisplay.textContent = content;
            scratchCodeDisplay.style.color = '#cbd5e1';
        })
        .catch(err => {
            console.error('Error viewing scratch file:', err);
            scratchViewerFilename.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: var(--color-danger); margin-right: 6px;"></i> Error`;
            scratchViewerSize.textContent = '';
            scratchCodeDisplay.textContent = `Failed to load file contents: ${err.message}`;
            scratchCodeDisplay.style.color = '#ef4444';
        });
}

function initScratchExplorer() {
    if (scratchWorkspaceSelect) {
        scratchWorkspaceSelect.addEventListener('change', () => {
            loadScratchFiles();
            scratchViewerFilename.innerHTML = `<i class="fa-solid fa-file-lines" style="color: var(--outlook-blue); margin-right: 6px;"></i> Select a file to inspect`;
            scratchViewerSize.textContent = '';
            scratchCodeDisplay.textContent = 'Select a scratch file from the list to display its source contents.';
        });
    }
    
    if (btnRefreshScratch) {
        btnRefreshScratch.addEventListener('click', () => {
            loadScratchFiles();
        });
    }
}

// ==========================================
// PORTAL PERSONALIZATION SETTINGS
// ==========================================

const settingsModal = document.getElementById('settings-modal');
const btnOpenSettings = document.getElementById('btn-open-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnSaveSettings = document.getElementById('btn-save-settings');

const themeColorPicker = document.getElementById('theme-color-picker');
const themeColorText = document.getElementById('theme-color-text');
const desktopColorPicker = document.getElementById('desktop-color-picker');
const desktopColorText = document.getElementById('desktop-color-text');

function initSettings() {
    if (!btnOpenSettings) return;

    // Load saved settings from localStorage
    const savedTheme = localStorage.getItem('portal-theme-color') || '#0078d4';
    const savedDesktop = localStorage.getItem('portal-desktop-color') || '#f3f2f1';

    applyThemeColor(savedTheme);
    applyDesktopColor(savedDesktop);

    // Sync input values
    themeColorPicker.value = savedTheme;
    themeColorText.value = savedTheme;
    desktopColorPicker.value = savedDesktop;
    desktopColorText.value = savedDesktop;

    // Open Settings Modal
    btnOpenSettings.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        // Highlight active dots
        updatePaletteHighlights(themeColorPicker.value, 'theme');
        updatePaletteHighlights(desktopColorPicker.value, 'desktop');
    });

    // Close Modal
    btnCloseSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Color Pickers input sync
    themeColorPicker.addEventListener('input', (e) => {
        const val = e.target.value;
        themeColorText.value = val;
        updatePaletteHighlights(val, 'theme');
    });

    themeColorText.addEventListener('input', (e) => {
        const val = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            themeColorPicker.value = val;
            updatePaletteHighlights(val, 'theme');
        }
    });

    desktopColorPicker.addEventListener('input', (e) => {
        const val = e.target.value;
        desktopColorText.value = val;
        updatePaletteHighlights(val, 'desktop');
    });

    desktopColorText.addEventListener('input', (e) => {
        const val = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            desktopColorPicker.value = val;
            updatePaletteHighlights(val, 'desktop');
        }
    });

    // Palette Dot Clicks
    document.querySelectorAll('.theme-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const col = dot.getAttribute('data-color');
            themeColorPicker.value = col;
            themeColorText.value = col;
            updatePaletteHighlights(col, 'theme');
        });
    });

    document.querySelectorAll('.desktop-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const col = dot.getAttribute('data-color');
            desktopColorPicker.value = col;
            desktopColorText.value = col;
            updatePaletteHighlights(col, 'desktop');
        });
    });

    // Save & Apply
    btnSaveSettings.addEventListener('click', () => {
        const themeCol = themeColorText.value;
        const desktopCol = desktopColorText.value;

        if (/^#[0-9A-F]{6}$/i.test(themeCol) && /^#[0-9A-F]{6}$/i.test(desktopCol)) {
            applyThemeColor(themeCol);
            applyDesktopColor(desktopCol);

            localStorage.setItem('portal-theme-color', themeCol);
            localStorage.setItem('portal-desktop-color', desktopCol);

            // Save ERP profile settings
            if (settingsErpProfile) {
                const selectedProfile = settingsErpProfile.value;
                const customUrl = settingsErpUrl ? settingsErpUrl.value.trim() : '';
                setERPProfile(selectedProfile, customUrl);
            }

            settingsModal.style.display = 'none';
            showToast('Settings Saved', 'Theme, desktop, and ERP connection settings applied.', 'success');
        } else {
            showToast('Invalid Colors', 'Please check HEX color values format.', 'warning');
        }
    });

    // ERP Profile dropdown change handler
    if (settingsErpProfile) {
        settingsErpProfile.addEventListener('change', () => {
            const profileId = settingsErpProfile.value;
            const profile = window.getERPProfile ? window.getERPProfile(profileId) : null;
            const isExternal = profile && profile.type === 'external';
            if (settingsErpUrlGroup) settingsErpUrlGroup.style.display = isExternal ? 'block' : 'none';
            if (settingsErpStatusText) {
                settingsErpStatusText.textContent = profile
                    ? profile.name + ' — ' + (isExternal ? 'Enter Portal URL' : 'Ready')
                    : 'Unknown';
            }
        });
    }

    // Configure button handlers
    if (btnErpConfigure) {
        btnErpConfigure.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
            updatePaletteHighlights(themeColorPicker.value, 'theme');
            updatePaletteHighlights(desktopColorPicker.value, 'desktop');
        });
    }
    if (btnErpEmptyConfigure) {
        btnErpEmptyConfigure.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
            updatePaletteHighlights(themeColorPicker.value, 'theme');
            updatePaletteHighlights(desktopColorPicker.value, 'desktop');
        });
    }

    // Initialize ERP connector UI on load
    syncERPConnectorUI();
}

function applyThemeColor(color) {
    document.documentElement.style.setProperty('--outlook-blue', color);
    
    // Also compute a darker hover color
    const darkColor = adjustColorBrightness(color, -15);
    document.documentElement.style.setProperty('--outlook-blue-hover', darkColor);
    
    // Update any dynamically styled borders or backgrounds if needed
    const modalHeaders = document.querySelectorAll('#settings-modal .compose-header, #compose-modal .compose-header, #pptx-sim-modal .compose-header');
    modalHeaders.forEach(el => {
        el.style.backgroundColor = color;
    });
}

function applyDesktopColor(color) {
    document.documentElement.style.setProperty('--desktop-color', color);
}

function updatePaletteHighlights(color, type) {
    if (type === 'theme') {
        document.querySelectorAll('.theme-color-dot').forEach(dot => {
            if (dot.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
                dot.style.borderColor = 'var(--text-primary)';
                dot.style.transform = 'scale(1.15)';
            } else {
                dot.style.borderColor = 'transparent';
                dot.style.transform = 'none';
            }
        });
    } else if (type === 'desktop') {
        document.querySelectorAll('.desktop-color-dot').forEach(dot => {
            if (dot.getAttribute('data-color').toLowerCase() === color.toLowerCase()) {
                dot.style.borderColor = 'var(--outlook-blue)';
                dot.style.borderWidth = '2px';
                dot.style.transform = 'scale(1.15)';
            } else {
                dot.style.borderColor = '#edebe9';
                dot.style.borderWidth = '1px';
                dot.style.transform = 'none';
            }
        });
    }
}

// Utility function to darken color for hover states
function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = (R > 0) ? R : 0;
    G = (G > 0) ? G : 0;
    B = (B > 0) ? B : 0;

    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}
