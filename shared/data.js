/**
 * BACKFEED — Shared Business Data Layer
 * ======================================
 * All real business data for Summit Electrical Sales.
 * Consumed by both Eclipse ERP (localhost:3000) and Backfeed Portal (localhost:3001).
 *
 * Available as: window.BACKFEED_DATA
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════
  // SALES REPRESENTATIVES
  // ═══════════════════════════════════════════
  const reps = [
    { id: 'REP-001', name: 'Sales Desk', role: 'Inside Sales Specialist', email: 'sales.desk@summitsales.com', phone: '(856) 555-0101', territory: 'East' },
    { id: 'REP-002', name: 'Danielle Russo', role: 'Inside Sales Specialist', email: 'danielle.russo@summitsales.com', phone: '(856) 555-0102', territory: 'East' },
    { id: 'REP-003', name: 'Sarah Jenkins', role: 'Lighting Representative', email: 'sarah.jenkins@summitsales.com', phone: '(856) 555-0103', territory: 'East' },
    { id: 'REP-004', name: 'Todd Sterling', role: 'Territory Account Manager', email: 'todd.sterling@summitsales.com', phone: '(856) 555-0104', territory: 'East' },
  ];

  const salespeople = [
    { id: 'SP-01', name: 'Sales Desk', initials: 'SD' },
    { id: 'SP-02', name: 'Danielle Russo', initials: 'DR' },
    { id: 'SP-03', name: 'Sarah Jenkins', initials: 'SJ' },
    { id: 'SP-04', name: 'Todd Sterling', initials: 'TS' },
  ];

  // ═══════════════════════════════════════════
  // MANUFACTURER LINE CARDS (16 brands)
  // ═══════════════════════════════════════════
  const brands = [
    { name: 'Titan Wiring Devices', category: 'Titan Division', territory: 'East', prepaidThreshold: 1000, description: 'Commercial & residential dimmers, receptacles, switches, and WATERTIGHT plugs.', features: ['Switches', 'Dimmers', 'Plugs', 'USB Outlets'], repId: 'REP-002' },
    { name: 'Titan B-Line', category: 'Titan Division', territory: 'East', prepaidThreshold: 7500, description: 'Bolted framing, metal support strut systems, enclosures, cable trays, and spool racks.', features: ['Strut', 'Cable Tray', 'Enclosures', 'Spool Racks'], repId: 'REP-001' },
    { name: 'Titan Edison Fuses', category: 'Titan Division', territory: 'East', prepaidThreshold: 250, description: 'Circuit fuses, fuse holders, fuse blocks, and utility overcurrent protection.', features: ['Fuses', 'Fuse Blocks', 'Fuse Holders', 'Limits'], repId: 'REP-002' },
    { name: 'Titan Transformers', category: 'Titan Division', territory: 'East', prepaidThreshold: 5000, description: 'Dry-type ventilated distribution transformers, buck-boost modules, and step-ups.', features: ['Ventilated Transformers', 'Buck-Boost', 'Step-Up'], repId: 'REP-004' },
    { name: 'Titan Conduit Fittings', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 3500, description: 'Galvanized steel elbows, rigid couplings, nipples, and speed-couple configurations.', features: ['Steel Elbows', 'Rigid Couplings', 'Steel Nipples', 'Speed-Couple'], repId: 'REP-001' },
    { name: 'Nova LED Lighting', category: 'Lighting', territory: 'East', prepaidThreshold: 1500, description: 'High-efficiency LED fixtures with NovaControl wireless control systems.', features: ['LED Fixtures', 'Floodlights', 'Smart Control', 'Sensors'], repId: 'REP-003' },
    { name: 'AeroTherm Heat Systems', category: 'HVAC / Heat', territory: 'East', prepaidThreshold: 2500, description: 'AeroFlow and ThermGuard commercial unit heaters, baseboards, and draft barriers.', features: ['Unit Heaters', 'Baseboards', 'Wall Fans', 'Draft Barriers'], repId: 'REP-004' },
    { name: 'Matrix Fittings', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 1500, description: 'Zinc, copper, and non-metallic fittings, wire connectors, and home theater junction boxes.', features: ['Fittings', 'Box Connectors', 'Junction Boxes', 'In-Box Units'], repId: 'REP-002' },
    { name: 'Liberty Copper Cable', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 5000, description: 'Copper building wire manufactured in NY, including THHN, NM-B Cable, and MC Cable.', features: ['Copper Wire', 'THHN', 'NM-B Cable', 'Metal Clad (MC)'], repId: 'REP-001' },
    { name: 'DuraPVC Fittings', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 3000, description: 'Rigid PVC conduit couplings, fittings, elbows, access junctions, and switch boxes.', features: ['PVC Fittings', 'Elbows', 'Couplings', 'Junction Boxes'], repId: 'REP-002' },
    { name: 'StrongHold Fasteners', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 500, description: 'Screws, anchors, nuts, bolts, masonry fastens, and specialty drilling tools.', features: ['Screws', 'Wall Anchors', 'Bolts & Nuts', 'Drill Bits'], repId: 'REP-002' },
    { name: 'DuraConduit PVC', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 10000, description: 'Schedule 40 and 80 rigid PVC conduit pipes, duct lines, and underground piping.', features: ['PVC Conduit', 'Schedule 40', 'Schedule 80', 'Utility Ducts'], repId: 'REP-001' },
    { name: 'Prime Aluminum Cable', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 5000, description: 'Aluminum building wire, welding wire, ground cables, and industrial flexible spool cords.', features: ['Aluminum Wire', 'Service Entrance Cable', 'Flexible Cord'], repId: 'REP-001' },
    { name: 'WorkPro Electro-Tools', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 750, description: 'Worker-designed specialty tools, wire dispensers, tool bags, and hole saws.', features: ['Specialty Benders', 'Spool Dispensers', 'Heavy Duty Tool Bags'], repId: 'REP-002' },
    { name: 'EarthGround Systems', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 1000, description: 'Copper ground rods, clamps, exothermic welding molds, and bonding straps.', features: ['Ground Rods', 'Rod Clamps', 'Exothermic Weld Molds'], repId: 'REP-002' },
    { name: 'VEG Industrial Motors', category: 'Motors', territory: 'East', prepaidThreshold: 2000, description: 'Premium heavy duty electric motors, washdown series, and flaker line engines.', features: ['Industrial Motors', 'Washdown Motors', 'Flaker Motors'], repId: 'REP-001' },
    { name: 'Meridian Power', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 150, description: 'Power distribution blocks, anchors, and industrial terminal mounts.', features: ['Power Blocks', 'Terminal Mounts', 'Anchors'], repId: 'REP-002' },
    { name: 'Duraflow Conduit', category: 'Electrical Supply', territory: 'East', prepaidThreshold: 3000, description: 'High-density polyethylene (HDPE) conduit piping and utility underground raceways.', features: ['HDPE Conduit', 'Underground Duct'], repId: 'REP-001' },
  ];

  // ═══════════════════════════════════════════
  // SKU → BRAND MAPPING
  // ═══════════════════════════════════════════
  const skuBrandMap = {
    'CON-EMT34': 'Titan Conduit Fittings', 'CON-EMT10': 'Titan Conduit Fittings', 'CON-EMT12': 'Titan Conduit Fittings',
    'CON-RGD10': 'Titan Conduit Fittings',
    'CON-PVC10': 'DuraConduit PVC', 'CON-PVC20': 'DuraConduit PVC',
    'CON-FMC12': 'Matrix Fittings', 'CON-ENT12': 'Matrix Fittings',
    'CON-STRUT': 'Titan B-Line', 'CON-STRD': 'Titan B-Line',
    'WIR-THHN12': 'Liberty Copper Cable', 'WIR-THHN10': 'Liberty Copper Cable', 'WIR-THHN08': 'Liberty Copper Cable',
    'WIR-XHHW6': 'Liberty Copper Cable', 'WIR-XHHW40': 'Prime Aluminum Cable',
    'CBL-MC122': 'Liberty Copper Cable', 'CBL-MC103': 'Liberty Copper Cable',
    'CBL-NM142': 'Liberty Copper Cable', 'CBL-NM122': 'Liberty Copper Cable', 'CBL-CAT6': 'Liberty Copper Cable',
    'FIT-EMTC': 'Titan Conduit Fittings', 'FIT-EMTS': 'Titan Conduit Fittings',
    'FIT-PVCC': 'DuraPVC Fittings',
    'BOX-4SQR': 'Matrix Fittings', 'BOX-4OCT': 'Matrix Fittings', 'BOX-HNDY': 'Matrix Fittings',
    'BOX-N1PL': 'Matrix Fittings', 'BOX-N2PL': 'Matrix Fittings',
    'PNL-200A': 'Titan Wiring Devices', 'PNL-100A': 'Titan Wiring Devices',
    'BKR-1P20': 'Titan Edison Fuses', 'BKR-1P15': 'Titan Edison Fuses', 'BKR-2P30': 'Titan Edison Fuses',
    'BKR-2P50': 'Titan Edison Fuses', 'BKR-GFCI': 'Titan Edison Fuses', 'BKR-AFCI': 'Titan Edison Fuses',
    'DEV-R20A': 'Titan Wiring Devices', 'DEV-R15A': 'Titan Wiring Devices', 'DEV-GFCI': 'Titan Wiring Devices',
    'DEV-T15A': 'Titan Wiring Devices', 'DEV-D15A': 'Titan Wiring Devices',
    'DEV-WPCO': 'Matrix Fittings',
    'DEV-PL1G': 'Titan Wiring Devices', 'DEV-PL2G': 'Titan Wiring Devices',
    'LTG-TRF4': 'Nova LED Lighting', 'LTG-HBAY': 'Nova LED Lighting', 'LTG-EXIT': 'Nova LED Lighting',
    'LTG-DOWN': 'Nova LED Lighting', 'LTG-FLOOD': 'Nova LED Lighting',
    'ACC-WNUT': 'Matrix Fittings',
    'ACC-TAPE': 'StrongHold Fasteners',
    'ACC-GROD': 'EarthGround Systems',
    'MOT-WEG-20HP': 'VEG Industrial Motors', 'MOT-APX-20HP': 'VEG Industrial Motors',
    'PDB-MER-FSPDB3': 'Meridian Power', 'ACC-MER-ANCHOR': 'Meridian Power',
    'CON-HDPE-4': 'Duraflow Conduit',
  };

  // ═══════════════════════════════════════════
  // PRODUCTS (48 SKUs) — dual property names for both apps
  // ═══════════════════════════════════════════
  function makeProduct(sku, desc, uom, listPrice, mult, netPrice) {
    const brand = skuBrandMap[sku] || 'Unknown';
    // Random warehouse inventory
    const wd = Math.floor(Math.random() * 800) + 50;
    const hb = Math.floor(Math.random() * 400) + 20;
    const nk = Math.floor(Math.random() * 200) + 10;
    const bins = ['A1-01','A1-02','A2-05','A3-10','B1-03','B2-04','B3-06','C1-01','C1-08','C2-02','D1-12','D2-04','E1-07','E2-11'];
    const daysAgo = Math.floor(Math.random() * 28) + 5;
    const lastUpdated = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0,10);
    return {
      sku, desc, description: desc, uom, listPrice, mult, netPrice, currentNet: netPrice,
      brand, category: sku.split('-')[0],
      forecast90D: +(netPrice * (1 + Math.random()*0.02)).toFixed(2),
      forecast6M: +(netPrice * (1 + Math.random()*0.03)).toFixed(2),
      forecast12M: +(netPrice * (1 + Math.random()*0.04)).toFixed(2),
      forecast24M: +(netPrice * (1 + Math.random()*0.05)).toFixed(2),
      volatility: (27.5 + Math.random()*1.5).toFixed(1) + '%',
      lastUpdated,
      inventory: {
        'WD-01': { qty: wd, committed: Math.floor(wd * 0.2), available: wd - Math.floor(wd * 0.2), bin: bins[Math.floor(Math.random()*bins.length)], lastReceived: lastUpdated },
        'HB-02': { qty: hb, committed: Math.floor(hb * 0.15), available: hb - Math.floor(hb * 0.15), bin: bins[Math.floor(Math.random()*bins.length)], lastReceived: lastUpdated },
        'NK-03': { qty: nk, committed: Math.floor(nk * 0.1), available: nk - Math.floor(nk * 0.1), bin: bins[Math.floor(Math.random()*bins.length)], lastReceived: lastUpdated },
      }
    };
  }

  const products = [
    makeProduct('CON-EMT34', 'EMT Conduit 3/4" x 10\' Galvanized', 'EA', 6.82, 0.65, 4.43),
    makeProduct('CON-EMT10', 'EMT Conduit 1" x 10\' Galvanized', 'EA', 9.15, 0.65, 5.95),
    makeProduct('CON-EMT12', 'EMT Conduit 1-1/2" x 10\' Galv', 'EA', 16.40, 0.64, 10.50),
    makeProduct('CON-RGD10', 'Rigid Steel Conduit 1" x 10\' Heavy', 'EA', 24.45, 0.62, 15.16),
    makeProduct('CON-PVC10', 'PVC Sch40 Conduit 1" x 10\' Grey', 'EA', 4.92, 0.70, 3.44),
    makeProduct('CON-PVC20', 'PVC Sch40 Conduit 2" x 10\' Grey', 'EA', 8.90, 0.68, 6.05),
    makeProduct('CON-FMC12', 'Flex Metallic Conduit 1/2" 100\'', 'RL', 78.50, 0.72, 56.52),
    makeProduct('CON-ENT12', 'ENT Flex Conduit Blue 1/2" 200\'', 'RL', 112.00, 0.70, 78.40),
    makeProduct('CON-STRUT', 'Strut Channel 1-5/8" 12G 10\' Galv', 'EA', 28.50, 0.60, 17.10),
    makeProduct('CON-STRD', 'Strut Channel Deep Slotted 10\'', 'EA', 34.20, 0.60, 20.52),
    makeProduct('WIR-THHN12', 'THHN 12 AWG Solid Copper Black', 'FT', 0.47, 0.72, 0.34),
    makeProduct('WIR-THHN10', 'THHN 10 AWG Stranded Copper Black', 'FT', 0.72, 0.70, 0.50),
    makeProduct('WIR-THHN08', 'THHN 8 AWG Stranded Copper Green', 'FT', 1.15, 0.68, 0.78),
    makeProduct('WIR-XHHW6', 'XHHW-2 6 AWG Stranded Copper Blk', 'FT', 2.12, 0.68, 1.44),
    makeProduct('WIR-XHHW40', 'XHHW-2 4/0 AWG Alum Stranded Blk', 'FT', 3.85, 0.65, 2.50),
    makeProduct('CBL-MC122', 'MC Cable 12/2 w/ Ground 250\'', 'RL', 168.00, 0.75, 126.00),
    makeProduct('CBL-MC103', 'MC Cable 10/3 w/ Ground 250\'', 'RL', 285.00, 0.74, 210.90),
    makeProduct('CBL-NM142', 'NM-B 14/2 Solid Wire 250\' White', 'RL', 89.50, 0.78, 69.81),
    makeProduct('CBL-NM122', 'NM-B 12/2 Solid Wire 250\' Yellow', 'RL', 118.00, 0.76, 89.68),
    makeProduct('CBL-CAT6', 'CAT6 UTP Solid Copper CMR 1000\'', 'BX', 220.00, 0.70, 154.00),
    makeProduct('FIT-EMTC', 'EMT Compression Connector 3/4"', 'EA', 1.24, 0.60, 0.74),
    makeProduct('FIT-EMTS', 'EMT Set Screw Coupling 3/4"', 'EA', 0.88, 0.60, 0.53),
    makeProduct('FIT-PVCC', 'PVC Male Adapter 1"', 'EA', 0.65, 0.70, 0.46),
    makeProduct('BOX-4SQR', '4" Square Metal Box 1-1/2" Deep', 'EA', 3.85, 0.62, 2.39),
    makeProduct('BOX-4OCT', '4" Octagon Metal Box 1-1/2" Deep', 'EA', 3.60, 0.62, 2.23),
    makeProduct('BOX-HNDY', 'Handy Utility Box 4" x 2" Steel', 'EA', 2.35, 0.65, 1.53),
    makeProduct('BOX-N1PL', '1-Gang Plastic Nail-on Box 18ci', 'EA', 0.95, 0.75, 0.71),
    makeProduct('BOX-N2PL', '2-Gang Plastic Nail-on Box 32ci', 'EA', 1.95, 0.75, 1.46),
    makeProduct('PNL-200A', '200A Main Breaker Panel 42-Spc', 'EA', 298.00, 0.58, 172.84),
    makeProduct('PNL-100A', '100A Main Lug Subpanel 12-Spc', 'EA', 115.00, 0.58, 66.70),
    makeProduct('BKR-1P20', '20A Single Pole Circuit Breaker', 'EA', 9.95, 0.65, 6.47),
    makeProduct('BKR-1P15', '15A Single Pole Circuit Breaker', 'EA', 9.95, 0.65, 6.47),
    makeProduct('BKR-2P30', '30A Double Pole Circuit Breaker', 'EA', 28.50, 0.62, 17.67),
    makeProduct('BKR-2P50', '50A Double Pole Circuit Breaker', 'EA', 32.40, 0.62, 20.09),
    makeProduct('BKR-GFCI', '20A GFCI Protection Breaker 1P', 'EA', 54.00, 0.60, 32.40),
    makeProduct('BKR-AFCI', '15A Arc Fault combination Bkr', 'EA', 68.00, 0.60, 40.80),
    makeProduct('DEV-R20A', 'Duplex Receptacle 20A 125V White', 'EA', 2.45, 0.70, 1.72),
    makeProduct('DEV-R15A', 'Duplex Receptacle 15A 125V Ivory', 'EA', 1.95, 0.72, 1.40),
    makeProduct('DEV-GFCI', 'GFCI SmartGuard Receptacle 20A Wht', 'EA', 22.50, 0.65, 14.63),
    makeProduct('DEV-T15A', 'Toggle Switch 15A Single Pole', 'EA', 2.15, 0.72, 1.55),
    makeProduct('DEV-D15A', 'Decorator Switch 15A White Quiet', 'EA', 2.95, 0.70, 2.07),
    makeProduct('DEV-WPCO', 'Weatherproof In-Use Outlet Cover', 'EA', 9.80, 0.68, 6.66),
    makeProduct('DEV-PL1G', '1-Gang Plastic Wallplate White', 'EA', 0.48, 0.80, 0.38),
    makeProduct('DEV-PL2G', '2-Gang Plastic Wallplate White', 'EA', 0.95, 0.80, 0.76),
    makeProduct('LTG-TRF4', 'LED Troffer Panel 2x4 40W 5000K', 'EA', 98.00, 0.55, 53.90),
    makeProduct('LTG-HBAY', 'LED Linear High Bay 150W 22000LM', 'EA', 189.00, 0.52, 98.28),
    makeProduct('LTG-EXIT', 'LED Emergency Exit Sign Red Combo', 'EA', 38.50, 0.60, 23.10),
    makeProduct('LTG-DOWN', '6" Retrofit LED Downlight White', 'EA', 14.50, 0.58, 8.41),
    makeProduct('LTG-FLOOD', 'LED Outdoor Flood Light 50W Bronze', 'EA', 79.00, 0.55, 43.45),
    makeProduct('ACC-WNUT', 'Wire Connectors Yellow Box/100', 'BX', 14.50, 0.68, 9.86),
    makeProduct('ACC-TAPE', 'Premium Vinyl Elec Tape 3/4"x66\'', 'RL', 4.45, 0.72, 3.20),
    makeProduct('ACC-GROD', 'Grounding Copper Rod 5/8" x 8\'', 'EA', 19.80, 0.65, 12.87),
    makeProduct('MOT-WEG-20HP', 'VEG 20HP Flaker Motor W22G', 'EA', 1980.00, 0.73, 1450.00),
    makeProduct('MOT-APX-20HP', 'Apex Motors 20HP Industrial Motor Drop-in', 'EA', 1980.00, 0.73, 1450.00),
    makeProduct('PDB-MER-FSPDB3', 'Meridian 3-Pole Power Distribution Block', 'EA', 25.00, 0.65, 16.36),
    makeProduct('ACC-MER-ANCHOR', 'Meridian Anchor Block for Power Block', 'EA', 4.00, 0.62, 2.50),
    makeProduct('CON-HDPE-4', 'Duraflow 4" SDR11 HDPE Conduit Pipe 100ft', 'RL', 8.50, 0.70, 6.00),
  ];

  // ═══════════════════════════════════════════
  // CUSTOMERS (20) — Eclipse-compatible structure
  // Each has: id, name, contacts[], shipTos[], credit{}, orders[], notes[], address, phone, email, etc.
  // ═══════════════════════════════════════════
  function makeCust(id, name, addr, phone, fax, email, website, taxId, territory, contacts, shipTos, creditLimit, balance, creditStatus, terms, lastPay, orders, notes) {
    const status = creditStatus === 'Hold' ? 'CREDIT_HOLD' : creditStatus === 'Watch' ? 'CREDIT_WARNING' : creditStatus === 'Suspended' ? 'SUSPENDED' : creditStatus === 'New' ? 'NEW' : 'ACTIVE';
    return {
      id, name, address: addr, phone, fax: fax || '', email, website: website || '', taxId, territory,
      company: name, contact: contacts[0]?.name || '', accountStatus: status,
      contacts, shipTos,
      credit: {
        limit: creditLimit, balance, available: creditLimit - balance,
        status: creditStatus,
        terms, lastPayment: lastPay,
        aging: {
          current: Math.round(balance * 0.5),
          d30: Math.round(balance * 0.25),
          d60: Math.round(balance * 0.15),
          d90: Math.round(balance * 0.07),
          d120: Math.round(balance * 0.03)
        }
      },
      creditLimit, balanceDue: balance, paymentTerms: terms, lastPayment: lastPay,
      status, orders: orders || [], orderHistory: (orders || []).map(o => ({ orderId: o.id, date: o.date, total: o.total, status: o.status, items: o.desc })),
      notes: notes || []
    };
  }

  const customers = [
    makeCust('C-1001', 'Client Company Solutions', '1420 Industrial Pkwy, Ewing, NJ 08628', '(609) 555-3211', '(609) 555-3212', 'm.davis@clientelec.com', 'www.clientelec.com', '22-4456789', 'South Jersey',
      [{ name: 'Mark Davis', title: 'Purchasing Mgr', phone: '(609) 555-3211', email: 'm.davis@clientelec.com', primary: true },
       { name: 'Tom Albright', title: 'Project Estimator', phone: '(609) 555-3213', email: 't.albright@clientelec.com', primary: false }],
      [{ code: 'MAIN', name: 'Main Office', address: '1420 Industrial Pkwy, Ewing, NJ 08628' },
       { code: 'WHSE', name: 'Warehouse', address: '180 Commerce Blvd, Ewing, NJ 08628' },
       { code: 'JOB1', name: 'Job Site – Deptford', address: '100 Deptford Center Rd, Deptford, NJ 08096' }],
      75000, 28450, 'Good', 'Net 30', '2026-05-28',
      [{ id: 'SO-4421', date: '2026-05-15', total: 12840, status: 'Shipped', desc: 'Strut, EMT, Fittings', po: 'PO-TS-4420' },
       { id: 'SO-4389', date: '2026-04-22', total: 8650, status: 'Shipped', desc: 'MC Cable, Boxes', po: 'PO-TS-4385' },
       { id: 'SO-4290', date: '2026-03-10', total: 15200, status: 'Delivered', desc: 'THHN Wire, Panels', po: 'PO-TS-4288' }],
      [{ timestamp: '2026-05-28 09:15', user: 'Operator', text: 'Confirmed Net 30 terms for Q3.' }]),

    makeCust('C-1002', 'Mid-Atlantic Power Systems', '890 Market St, Suite 200, Philadelphia, PA 19107', '(215) 555-8844', '(215) 555-8845', 'j.chen@midatlanticpower.com', 'www.midatlanticpower.com', '23-5567890', 'Philadelphia',
      [{ name: 'Janet Chen', title: 'VP Operations', phone: '(215) 555-8844', email: 'j.chen@midatlanticpower.com', primary: true },
       { name: 'Steve Rawlings', title: 'Lead Estimator', phone: '(215) 555-8846', email: 's.rawlings@midatlanticpower.com', primary: false }],
      [{ code: 'MAIN', name: 'Main Office', address: '890 Market St, Suite 200, Philadelphia, PA 19107' },
       { code: 'YARD', name: 'Storage Yard', address: '1200 S Columbus Blvd, Philadelphia, PA 19147' }],
      120000, 43200, 'Good', 'Net 45', '2026-05-30',
      [{ id: 'SO-4418', date: '2026-05-12', total: 22100, status: 'Shipped', desc: 'Feeder Cable, Transformers', po: 'PO-MAP-7831' },
       { id: 'SO-4350', date: '2026-04-05', total: 18900, status: 'Delivered', desc: 'Panels, Breakers, Wire', po: 'PO-MAP-7820' }],
      []),

    makeCust('C-1003', 'Apex Lighting Contractors', '245 Haddon Ave, Camden, NJ 08103', '(856) 555-2290', '', 'r.torres@apexlighting.com', '', '22-9988776', 'South Jersey',
      [{ name: 'Robert Torres', title: 'Owner', phone: '(856) 555-2290', email: 'r.torres@apexlighting.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '245 Haddon Ave, Camden, NJ 08103' }],
      25000, 3200, 'New', 'Net 30', '2026-06-01',
      [{ id: 'SO-4445', date: '2026-06-01', total: 3200, status: 'Processing', desc: 'LED Troffers, Downlights', po: 'PO-ALC-100' }],
      [{ timestamp: '2026-06-01 14:20', user: 'S.Jenkins', text: 'New lighting account. First order placed.' }]),

    makeCust('C-1004', 'Delaware Valley Contractors', '55 Commerce Dr, New Castle, DE 19720', '(302) 555-1199', '', 'm.patterson@dvelectric.com', '', '51-2345678', 'Delaware',
      [{ name: 'Mike Patterson', title: 'Operations Mgr', phone: '(302) 555-1199', email: 'm.patterson@dvelectric.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '55 Commerce Dr, New Castle, DE 19720' },
       { code: 'JOB2', name: 'Job Site – Greenville', address: '420 Greenville Ave, Wilmington, DE 19805' }],
      50000, 12800, 'Good', 'Net 30', '2026-05-22',
      [{ id: 'SO-4415', date: '2026-05-10', total: 8900, status: 'Delivered', desc: 'EMT, Fittings, Boxes', po: 'PO-DVC-1130' },
       { id: 'SO-4370', date: '2026-04-12', total: 3900, status: 'Delivered', desc: 'Devices, Wallplates', po: 'PO-DVC-1125' }],
      []),

    makeCust('C-1005', 'Garden State Solar Systems', '88 Main St, Edison, NJ 08817', '(732) 555-3300', '', 't.gardella@gardenstate-e.com', '', '22-7654321', 'Central Jersey',
      [{ name: 'Tom Gardella', title: 'Purchasing', phone: '(732) 555-3300', email: 't.gardella@gardenstate-e.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '88 Main St, Edison, NJ 08817' }],
      40000, 38900, 'Watch', 'Net 30', '2026-04-01',
      [{ id: 'SO-4310', date: '2026-03-18', total: 22100, status: 'Delivered', desc: 'Wire, Cable', po: 'PO-GSS-440' }],
      [{ timestamp: '2026-04-10 11:00', user: 'D.Russo', text: 'Account nearing credit limit. Payment overdue 30+.' }]),

    makeCust('C-1006', 'Keystone Electrical Group', '1200 Paxton St, Harrisburg, PA 17104', '(717) 555-4456', '(717) 555-4457', 'l.morales@keystoneelec.com', 'www.keystoneelec.com', '23-1122334', 'Central PA',
      [{ name: 'Lisa Morales', title: 'Purchasing Director', phone: '(717) 555-4456', email: 'l.morales@keystoneelec.com', primary: true },
       { name: 'Brian Hayes', title: 'Estimator', phone: '(717) 555-4458', email: 'b.hayes@keystoneelec.com', primary: false }],
      [{ code: 'MAIN', name: 'Main Office', address: '1200 Paxton St, Harrisburg, PA 17104' },
       { code: 'YORK', name: 'York Branch', address: '340 Industrial Way, York, PA 17402' }],
      150000, 62300, 'Good', 'Net 45', '2026-05-25',
      [{ id: 'SO-4430', date: '2026-05-20', total: 35600, status: 'Shipped', desc: 'Bulk Wire, Conduit', po: 'PO-KES-5605' },
       { id: 'SO-4395', date: '2026-04-28', total: 26700, status: 'Delivered', desc: 'Lighting, Devices', po: 'PO-KES-5600' }],
      []),

    makeCust('C-1007', 'Atlantic City Electric Svcs', '2200 Pacific Ave, Atlantic City, NJ 08401', '(609) 555-9900', '', 'c.dominguez@atlanticcoastelec.com', '', '22-4455667', 'South Jersey',
      [{ name: 'Chris Dominguez', title: 'Owner', phone: '(609) 555-9900', email: 'c.dominguez@atlanticcoastelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '2200 Pacific Ave, Atlantic City, NJ 08401' }],
      60000, 58500, 'Hold', 'Net 30', '2026-03-30',
      [{ id: 'SO-4340', date: '2026-03-30', total: 28500, status: 'Credit Hold', desc: 'Lighting, Wire, Panels', po: 'PO-ACE-890' },
       { id: 'SO-4315', date: '2026-03-15', total: 30000, status: 'Delivered', desc: 'Cable, Conduit', po: 'PO-ACE-885' }],
      [{ timestamp: '2026-04-05 09:00', user: 'Operator', text: 'CREDIT HOLD placed. Balance at 97.5% of limit. Last payment 30+ days ago.' }]),

    makeCust('C-1008', 'Beacon Electric Supply', '310 Route 73 South, Marlton, NJ 08053', '(609) 555-7788', '', 'f.dimaggio@beaconelec.com', '', '22-9876543', 'South Jersey',
      [{ name: 'Frank DiMaggio', title: 'General Manager', phone: '(609) 555-7788', email: 'f.dimaggio@beaconelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '310 Route 73 South, Marlton, NJ 08053' }],
      75000, 74200, 'Watch', 'Net 30', '2026-04-15',
      [{ id: 'SO-4401', date: '2026-05-01', total: 31200, status: 'Shipped', desc: 'Wire, Cable, Conduit', po: 'PO-BES-660' },
       { id: 'SO-4380', date: '2026-04-18', total: 24800, status: 'Delivered', desc: 'Panels, Breakers', po: 'PO-BES-655' }],
      [{ timestamp: '2026-05-02 10:30', user: 'D.Russo', text: 'CREDIT WARNING: Balance $74,200 of $75,000 limit. Only $800 available.' }]),

    makeCust('C-1009', 'Garden State Solar (Inactive)', '88 Main St, Suite B, Edison, NJ 08817', '(732) 555-3302', '', 'thomas@gardenstate-electric.com', '', '22-7654322', 'Central Jersey',
      [{ name: 'Thomas Gardella', title: 'Owner', phone: '(732) 555-3302', email: 'thomas@gardenstate-electric.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '88 Main St, Suite B, Edison, NJ 08817' }],
      60000, 0, 'Suspended', 'COD', '2025-11-20',
      [],
      [{ timestamp: '2025-12-01 08:00', user: 'SYSTEM', text: 'Account suspended — duplicate of C-1005. Do not use.' }]),

    makeCust('C-1010', 'Shore Point Contractors', '401 Ocean Blvd, Long Branch, NJ 07740', '(732) 555-7700', '', 'd.vecchio@shorepoint.com', '', '22-1133557', 'Central Jersey',
      [{ name: 'Danny Vecchio', title: 'Owner', phone: '(732) 555-7700', email: 'd.vecchio@shorepoint.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '401 Ocean Blvd, Long Branch, NJ 07740' }],
      35000, 14200, 'Good', 'Net 30', '2026-05-28',
      [{ id: 'SO-4440', date: '2026-05-28', total: 9800, status: 'Shipped', desc: 'Lighting, Devices', po: 'PO-SPC-220' }],
      []),

    makeCust('C-1011', 'Capital City Electric', '320 N 2nd St, Harrisburg, PA 17101', '(717) 555-2200', '', 'a.washington@capitalcityelec.com', '', '23-8899001', 'Central PA',
      [{ name: 'Andrea Washington', title: 'VP Purchasing', phone: '(717) 555-2200', email: 'a.washington@capitalcityelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '320 N 2nd St, Harrisburg, PA 17101' }],
      90000, 31500, 'Good', 'Net 45', '2026-05-20',
      [{ id: 'SO-4435', date: '2026-05-25', total: 18400, status: 'Processing', desc: 'Bulk Wire, Strut', po: 'PO-CCE-310' }],
      []),

    makeCust('C-1012', 'Liberty Bell Power', '1500 Spring Garden St, Philadelphia, PA 19130', '(215) 555-1776', '', 'j.okafor@libertybellpower.com', 'www.libertybellpower.com', '23-6677889', 'Philadelphia',
      [{ name: 'James Okafor', title: 'Chief Electrician', phone: '(215) 555-1776', email: 'j.okafor@libertybellpower.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '1500 Spring Garden St, Philadelphia, PA 19130' }],
      200000, 87600, 'Good', 'Net 60', '2026-05-30',
      [{ id: 'SO-4442', date: '2026-05-30', total: 45200, status: 'Processing', desc: 'Feeder Cable, Panels, Transformers', po: 'PO-LBP-890' }],
      []),

    makeCust('C-1013', 'Pine Barrens Electric Co', '780 Route 206, Hammonton, NJ 08037', '(609) 555-4430', '', 's.mariano@pinebarrenselectric.com', '', '22-3344556', 'South Jersey',
      [{ name: 'Sal Mariano', title: 'Purchasing', phone: '(609) 555-4430', email: 's.mariano@pinebarrenselectric.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '780 Route 206, Hammonton, NJ 08037' }],
      30000, 29800, 'Hold', 'Net 30', '2026-02-10',
      [{ id: 'SO-4280', date: '2026-02-28', total: 15600, status: 'Delivered', desc: 'Wire, Fittings', po: 'PO-PBE-180' }],
      [{ timestamp: '2026-03-15 10:00', user: 'Operator', text: 'CREDIT HOLD — overdue 90+ days. Collections contacted.' }]),

    makeCust('C-1014', 'Brandywine Electric Services', '225 Kennett Pike, Chadds Ford, PA 19317', '(610) 555-8800', '', 'k.whitfield@brandywineelec.com', '', '23-2233445', 'Delaware Valley',
      [{ name: 'Karen Whitfield', title: 'Admin Manager', phone: '(610) 555-8800', email: 'k.whitfield@brandywineelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '225 Kennett Pike, Chadds Ford, PA 19317' }],
      45000, 8900, 'Good', 'Net 30', '2026-05-29',
      [{ id: 'SO-4438', date: '2026-05-29', total: 5600, status: 'Shipped', desc: 'Devices, Lighting', po: 'PO-BES-450' }],
      []),

    makeCust('C-1015', 'Iron Hill Electrical', '147 E Main St, Newark, DE 19711', '(302) 555-5500', '', 'b.kowalski@ironhillelec.com', '', '51-7788990', 'Delaware',
      [{ name: 'Brian Kowalski', title: 'Owner', phone: '(302) 555-5500', email: 'b.kowalski@ironhillelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '147 E Main St, Newark, DE 19711' }],
      55000, 22100, 'Good', 'Net 30', '2026-05-18',
      [{ id: 'SO-4428', date: '2026-05-18', total: 12400, status: 'Delivered', desc: 'Conduit, Wire, Strut', po: 'PO-IHE-320' }],
      []),

    makeCust('C-1016', 'Schuylkill Valley Contractors', '950 Penn Ave, Reading, PA 19601', '(610) 555-3300', '', 'd.patel@svcontractors.com', '', '23-5566778', 'Central PA',
      [{ name: 'Diane Patel', title: 'Purchasing Coordinator', phone: '(610) 555-3300', email: 'd.patel@svcontractors.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '950 Penn Ave, Reading, PA 19601' }],
      80000, 15600, 'Good', 'Net 45', '2026-05-27',
      [{ id: 'SO-4436', date: '2026-05-27', total: 15600, status: 'Processing', desc: 'Bulk Conduit, Strut', po: 'PO-SVC-505' }],
      []),

    makeCust('C-1017', 'Pocono Electric Supply', '310 Main St, Stroudsburg, PA 18360', '(570) 555-2100', '', 's.novak@poconoelec.com', '', '23-9900112', 'Northern PA',
      [{ name: 'Steve Novak', title: 'Branch Manager', phone: '(570) 555-2100', email: 's.novak@poconoelec.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '310 Main St, Stroudsburg, PA 18360' }],
      20000, 4500, 'Good', 'Net 30', '2026-05-20',
      [{ id: 'SO-4420', date: '2026-05-14', total: 4500, status: 'Shipped', desc: 'Devices, Wallplates, Tape', po: 'PO-PES-115' }],
      []),

    makeCust('C-1018', 'Camden Industrial Electric', '555 Federal St, Camden, NJ 08103', '(856) 555-6600', '', 'r.martinez@camdenind.com', '', '22-1122335', 'South Jersey',
      [{ name: 'Rosa Martinez', title: 'Operations Manager', phone: '(856) 555-6600', email: 'r.martinez@camdenind.com', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '555 Federal St, Camden, NJ 08103' }],
      100000, 41200, 'Good', 'Net 45', '2026-05-25',
      [{ id: 'SO-4432', date: '2026-05-22', total: 24800, status: 'Processing', desc: 'Wire, Conduit, Strut', po: 'PO-CIE-780' }],
      []),

    makeCust('C-1019', 'GS Electrical LLC', '90 Main Street, Edison, NJ 08817', '(732) 555-3301', '', 'tgardella@gselectrical.net', '', '22-7654323', 'Central Jersey',
      [{ name: 'Tom Gardella', title: 'Owner', phone: '(732) 555-3301', email: 'tgardella@gselectrical.net', primary: true }],
      [{ code: 'MAIN', name: 'Main Office', address: '90 Main Street, Edison, NJ 08817' }],
      25000, 6200, 'Good', 'Net 30', '2026-05-15',
      [{ id: 'SO-4425', date: '2026-05-15', total: 6200, status: 'Processing', desc: 'Conduit, Fittings', po: 'PO-GSE-099' }],
      [{ timestamp: '2026-05-16 09:00', user: 'D.Russo', text: 'Possible duplicate of C-1005 / C-1009. Same contact name.' }]),

    makeCust('C-1020', 'Lehigh Valley Power & Light', '2400 Hamilton Blvd, Allentown, PA 18104', '(610) 555-4800', '(610) 555-4801', 'a.dinardo@lvpowerlight.com', 'www.lvpowerlight.com', '23-4455667', 'Lehigh Valley',
      [{ name: 'Anthony DiNardo', title: 'Purchasing Director', phone: '(610) 555-4800', email: 'a.dinardo@lvpowerlight.com', primary: true },
       { name: 'Maria Salazar', title: 'AP Manager', phone: '(610) 555-4802', email: 'm.salazar@lvpowerlight.com', primary: false }],
      [{ code: 'MAIN', name: 'Main Office', address: '2400 Hamilton Blvd, Allentown, PA 18104' },
       { code: 'BTHM', name: 'Bethlehem Shop', address: '1800 Stefko Blvd, Bethlehem, PA 18017' }],
      175000, 68900, 'Good', 'Net 60', '2026-05-28',
      [{ id: 'SO-4441', date: '2026-05-28', total: 38200, status: 'Processing', desc: 'Bulk Wire, Transformers', po: 'PO-LVP-920' }],
      []),
    makeCust('C-1021', 'Crown Food Processing', '2900 Applegate Way, Runnemede, NJ 08078', '(856) 555-7100', '', 'c.hernandez@crown-food-processing.com', '', '22-9988123', 'South Jersey',
      [{ name: 'Carlos Hernandez', title: 'Plant Operations Mgr', phone: '(856) 555-7100', email: 'c.hernandez@crown-food-processing.com', primary: true }],
      [{ code: 'MAIN', name: 'Applegate Plant', address: '2900 Applegate Way, Runnemede, NJ 08078' }],
      80000, 14500, 'Good', 'Net 30', '2026-05-20',
      [],
      [{ timestamp: '2026-06-08 09:15', user: 'Operator', text: 'Crown Food Processing (fka Thomas Foods) setup complete.' }]),
    makeCust('C-1022', 'National Rail Service', '2955 Market St, 5th Floor, Philadelphia, PA 19104', '(215) 555-4500', '', 't.zellers@nationalrail.gov', 'www.nationalrail.gov', '23-8877112', 'Philadelphia',
      [{ name: 'T. Zellers', title: 'Lead Purchasing Agent', phone: '(215) 555-4500', email: 't.zellers@nationalrail.gov', primary: true }],
      [{ code: 'MAIN', name: 'Philadelphia HQ', address: '2955 Market St, 5th Floor, Philadelphia, PA 19104' },
       { code: 'SUB1', name: 'Northeast Substation', address: '3025 JFK Blvd, Philadelphia, PA 19104' }],
      150000, 31250, 'Good', 'Net 45', '2026-05-22',
      [],
      [{ timestamp: '2026-06-08 09:30', user: 'Operator', text: 'National Rail Service (fka Amtrak) setup complete.' }]),
  ];

  // ═══════════════════════════════════════════
  // QUOTES (for quote-to-order scenario)
  // ═══════════════════════════════════════════
  const quotes = [
    { id: 'QT-24-0125', customer: 'C-1010', date: '2026-05-28', status: 'Pending', total: 4820, salesperson: 'GM',
      lines: [
        { sku: 'DEV-R20A', qty: 200, netPrice: 1.72 },
        { sku: 'DEV-T15A', qty: 100, netPrice: 1.55 },
        { sku: 'BOX-N1PL', qty: 500, netPrice: 0.71 },
        { sku: 'DEV-PL1G', qty: 500, netPrice: 0.38 },
        { sku: 'LTG-DOWN', qty: 50, netPrice: 8.41 },
      ]
    },
    { id: 'QT-24-0128', customer: 'C-1001', date: '2026-06-02', status: 'Pending', total: 15430, salesperson: 'GM',
      lines: [
        { sku: 'WIR-THHN12', qty: 10000, netPrice: 0.34 },
        { sku: 'WIR-THHN10', qty: 5000, netPrice: 0.50 },
        { sku: 'CON-EMT34', qty: 800, netPrice: 4.43 },
        { sku: 'FIT-EMTC', qty: 1600, netPrice: 0.74 },
      ]
    },
  ];

  // ═══════════════════════════════════════════
  // RECENT ACTIVITY (for Eclipse dashboard)
  // ═══════════════════════════════════════════
  const recentActivity = [
    { time: '10:15 AM', event: 'Order SO-4445 created for Apex Lighting — $3,200.00', user: 'S.Jenkins' },
    { time: '10:02 AM', event: 'Customer C-1007 placed on CREDIT HOLD — balance $58,500/$60,000', user: 'SYSTEM' },
    { time: '09:48 AM', event: 'Quote QT-24-0128 sent to Client Company', user: 'Operator' },
    { time: '09:30 AM', event: 'Inventory received: 500x CON-EMT34 at WD-01', user: 'A.Pendelton' },
    { time: '09:15 AM', event: 'Price book updated — Titan Conduit Fittings effective 05/15', user: 'SYSTEM' },
    { time: '09:00 AM', event: 'CNC cut dispatched: 2,400ft THHN 4/0 for C-1001', user: 'Operator' },
    { time: '08:45 AM', event: 'Order SO-4440 shipped — Shore Point Contractors', user: 'J.Whitfield' },
    { time: '08:30 AM', event: 'Quote QT-24-0125 pending approval — Shore Point', user: 'Operator' },
    { time: '08:15 AM', event: 'Customer C-1008 credit warning — $800 available', user: 'SYSTEM' },
    { time: '08:00 AM', event: 'System startup — all modules loaded', user: 'SYSTEM' },
  ];

  // ═══════════════════════════════════════════
  // WAREHOUSES
  // ═══════════════════════════════════════════
  const warehouses = [
    { code: 'WD-01', name: 'West Deptford HQ', location: 'West Deptford, NJ', size: '51,000 sq ft', manager: 'Arthur Pendelton', status: 'Fully Operational', inventoryCount: 48200 },
    { code: 'HB-02', name: 'Harrisburg DC', location: 'Harrisburg, PA', size: '38,000 sq ft', manager: 'Carol Estevez', status: 'Fully Operational', inventoryCount: 31500 },
    { code: 'NK-03', name: 'Newark Satellite', location: 'Newark, NJ', size: '22,000 sq ft', manager: 'James Whitfield', status: 'Fully Operational', inventoryCount: 18800 },
  ];

  // ═══════════════════════════════════════════
  // COMMODITY PRICE SEEDS
  // ═══════════════════════════════════════════
  const commodities = {
    'Copper':      { price: 4.52, unit: '/lb',    change: 0.08, pct: 1.8 },
    'Aluminum':    { price: 1.18, unit: '/lb',    change: -0.02, pct: -1.7 },
    'Crude Oil':   { price: 78.45, unit: '/bbl',  change: 1.23, pct: 1.6 },
    'Natural Gas': { price: 2.84, unit: '/MMBtu', change: -0.05, pct: -1.7 },
    'Steel HRC':   { price: 810.00, unit: '/ton', change: 12.50, pct: 1.6 },
    'PVC Resin':   { price: 0.62, unit: '/lb',    change: 0.01, pct: 1.6 },
  };

  // ═══════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════

  function getProductBySku(sku) { return products.find(p => p.sku === sku) || null; }
  function getProductsByBrand(brandName) { return products.filter(p => p.brand === brandName); }
  function getBrandForSku(sku) { const bn = skuBrandMap[sku]; return bn ? brands.find(b => b.name === bn) : null; }
  function getRepForBrand(brandName) { const brand = brands.find(b => b.name === brandName); return brand ? reps.find(r => r.id === brand.repId) : null; }
  function getRepById(repId) { return reps.find(r => r.id === repId) || null; }
  function getCustomerById(id) { return customers.find(c => c.id === id) || null; }
  function getCustomersByStatus(status) { return customers.filter(c => c.status === status); }

  function searchCustomers(query) {
    const q = query.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.contacts.some(ct => ct.name.toLowerCase().includes(q)) ||
      c.id.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  function searchProducts(query) {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.sku.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  function calculateFreight(brandName, orderTotal) {
    const brand = brands.find(b => b.name === brandName);
    if (!brand) return { prepaidThreshold: 0, orderTotal, freightStatus: 'UNKNOWN', shortfall: 0 };
    const threshold = brand.prepaidThreshold;
    if (orderTotal >= threshold) return { prepaidThreshold: threshold, orderTotal, freightStatus: 'PREPAID', shortfall: 0, savings: 'Freight prepaid by manufacturer' };
    const shortfall = threshold - orderTotal;
    const nearThreshold = shortfall <= (threshold * 0.15);
    return { prepaidThreshold: threshold, orderTotal, freightStatus: nearThreshold ? 'NEAR_THRESHOLD' : 'COLLECT', shortfall: Math.round(shortfall * 100) / 100, suggestion: nearThreshold ? `Add $${shortfall.toFixed(2)} more to reach $${threshold.toLocaleString()} prepaid threshold` : null };
  }

  function checkCredit(customerId, orderAmount) {
    const customer = getCustomerById(customerId);
    if (!customer) return { approved: false, error: 'Customer not found' };
    const avail = customer.credit.available;
    const approved = orderAmount <= avail && customer.credit.status !== 'Hold' && customer.credit.status !== 'Suspended';
    return { approved, customerId: customer.id, company: customer.name, creditLimit: customer.credit.limit, balanceDue: customer.credit.balance, availableCredit: avail, orderAmount, shortfall: approved ? 0 : Math.max(0, orderAmount - avail), accountStatus: customer.status, paymentTerms: customer.credit.terms, suggestion: !approved && customer.credit.status === 'Watch' ? 'Consider COD terms or partial prepayment' : !approved && customer.credit.status === 'Hold' ? 'Contact Credit Manager ext. 204 for override' : null };
  }

  function formatCurrency(amount) { return '$' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function getProductCategories() {
    return { 'CON': 'Conduit & Raceway', 'WIR': 'Wire', 'CBL': 'Cable', 'FIT': 'Fittings', 'BOX': 'Boxes', 'PNL': 'Panels', 'BKR': 'Breakers', 'DEV': 'Devices', 'LTG': 'Lighting', 'ACC': 'Accessories' };
  }

  // ═══════════════════════════════════════════
  // EXPORT — window.BACKFEED_DATA
  // ═══════════════════════════════════════════
  window.BACKFEED_DATA = {
    reps, salespeople, brands, products, customers, warehouses, commodities, quotes, recentActivity,
    skuBrandMap,
    // Lookup functions
    getProductBySku, getProductsByBrand, getBrandForSku, getRepForBrand, getRepById,
    getCustomerById, getCustomersByStatus, searchCustomers, searchProducts,
    // Business logic
    calculateFreight, checkCredit,
    // Utility
    formatCurrency, getProductCategories,
  };

})();
