/* ============================================================
   SCENARIO ENGINE — Drives demo workflows through Eclipse ERP
   ============================================================ */

window.SCENARIO_ENGINE = {

  scenarios: [
    {
      id: 1,
      title: 'Standard Order Entry',
      description: 'Enter a multi-line order for Client Company from a phone call. 8 line items, verify inventory, apply terms.',
      customer: 'C-1001',
      po: 'PO-TS-4445',
      shipTo: 'WHSE',
      warehouse: 'WD-01',
      shipVia: 'Our Truck',
      lines: [
        { sku: 'CON-EMT34', qty: 500 },
        { sku: 'CON-EMT10', qty: 300 },
        { sku: 'FIT-EMTC', qty: 600 },
        { sku: 'FIT-EMTS', qty: 400 },
        { sku: 'WIR-THHN12', qty: 5000 },
        { sku: 'WIR-THHN10', qty: 3000 },
        { sku: 'BOX-4SQR', qty: 200 },
        { sku: 'ACC-WNUT', qty: 30 }
      ],
      expectedTime: 480,
      painPoints: ['Manual line-by-line entry', 'Must tab through every field', 'No auto-fill from PO', 'No duplicate order detection']
    },
    {
      id: 2,
      title: 'Credit Hold Resolution',
      description: 'Atlantic City Electric Svcs placed an order but is on credit hold. Look up customer, review aging, attempt order.',
      customer: 'C-1007',
      po: 'PO-ACE-895',
      shipTo: 'MAIN',
      warehouse: 'WD-01',
      shipVia: 'Will Call',
      lines: [
        { sku: 'WIR-THHN12', qty: 2000 },
        { sku: 'DEV-R20A', qty: 100 },
        { sku: 'ACC-TAPE', qty: 20 }
      ],
      expectedTime: 600,
      painPoints: ['No visibility into payment history at order time', 'Must call Credit Mgr ext 204', 'Customer waits on hold', 'No automated escalation']
    },
    {
      id: 3,
      title: 'Quote to Order Conversion',
      description: 'Customer approved quote QT-24-0125 for Shore Point Electric. Convert to sales order.',
      customer: 'C-1010',
      quoteId: 'QT-24-0125',
      expectedTime: 300,
      painPoints: ['Must find quote first', 'Re-verify pricing hasn\'t changed', 'Manual conversion — no one-click']
    },
    {
      id: 4,
      title: 'Backorder Situation',
      description: 'Delaware Valley Contractors needs 800 strut channels but only 350 are available across all warehouses.',
      customer: 'C-1004',
      po: 'PO-DVC-1135',
      shipTo: 'JOB2',
      warehouse: 'WD-01',
      shipVia: 'Our Truck',
      lines: [
        { sku: 'CON-STRUT', qty: 800 },
        { sku: 'ACC-GROD', qty: 50 }
      ],
      expectedTime: 420,
      painPoints: ['No cross-warehouse availability at order entry', 'Must manually check each warehouse', 'Backorder notification is manual', 'No ETA visibility']
    },
    {
      id: 5,
      title: 'Price Override Required',
      description: 'Keystone Electric wants special pricing on a panel job. Need manager authorization code.',
      customer: 'C-1006',
      po: 'PO-KES-5610',
      shipTo: 'YORK',
      warehouse: 'HB-02',
      shipVia: 'UPS Ground',
      lines: [
        { sku: 'PNL-200A', qty: 10 },
        { sku: 'BKR-1P20', qty: 100 },
        { sku: 'BKR-1P15', qty: 100 },
        { sku: 'BKR-2P30', qty: 40 },
        { sku: 'BKR-GFCI', qty: 25 }
      ],
      expectedTime: 540,
      painPoints: ['Price override interrupts workflow', 'Must find a manager', 'Authorization code expires', 'No approval queue']
    },
    {
      id: 6,
      title: 'Inventory Lookup & Availability',
      description: 'Customer calls asking about LED high bay availability. Check stock across all warehouses.',
      customer: 'C-1003',
      searchSku: 'LTG-HBAY',
      expectedTime: 180,
      painPoints: ['Must navigate to separate screen', 'No quick-check from order entry', 'Warehouse data may be stale']
    },
    {
      id: 7,
      title: 'Multi-Ship-To Order',
      description: 'Mid-Atlantic Power needs items split between two locations. Must enter as separate line groups.',
      customer: 'C-1002',
      po: 'PO-MAP-7835',
      lines: [
        { sku: 'WIR-THHN10', qty: 10000, shipTo: 'MAIN' },
        { sku: 'WIR-THHN08', qty: 5000, shipTo: 'MAIN' },
        { sku: 'WIR-THHN10', qty: 8000, shipTo: 'YARD' },
        { sku: 'CBL-MC122', qty: 20, shipTo: 'YARD' }
      ],
      expectedTime: 600,
      painPoints: ['Eclipse handles one ship-to per order', 'Must create two separate orders', 'Doubled data entry time', 'Easy to put items on wrong order']
    },
    {
      id: 8,
      title: 'Customer Credit Review',
      description: 'Garden State Solar Systems is approaching credit limit. Review account before accepting new order.',
      customer: 'C-1005',
      expectedTime: 300,
      painPoints: ['Aging data requires navigating to credit tab', 'No dashboard alerts for at-risk accounts', 'Manual process to contact Credit Manager']
    },
    {
      id: 9,
      title: 'Duplicate Customer Check',
      description: 'New customer "Garden State Solar" calls — but we already have "Garden State Solar Systems" (C-1005) and an inactive duplicate (C-1009).',
      searchTerm: 'Garden State',
      expectedTime: 360,
      painPoints: ['No automatic duplicate detection', 'Inactive accounts still show in search', 'Risk of creating third duplicate', 'Must manually compare addresses']
    },
    {
      id: 10,
      title: 'Stale Pricing Concern',
      description: 'Customer questions conduit pricing — our price book was last updated 3 weeks ago. No live commodity feed.',
      searchSku: 'CON-EMT34',
      expectedTime: 240,
      painPoints: ['No commodity price integration', 'Price book updated manually', '"Last Updated" shows stale dates', 'Rep cannot verify current market price']
    },
    {
      id: 11,
      title: 'Industrial Motor RFQ Intercept',
      description: 'Crown Food Processing requests a Wegman 20HP flaker motor on 12-week backlog. Steer to drop-in in-stock Apex alternative.',
      customer: 'C-1021',
      lines: [{ sku: 'MOT-WEG-20HP', qty: 1 }],
      expectedTime: 300,
      painPoints: ['Backlogged manufacturer lines', 'Production line downtime of 12 weeks', 'No automatic cross-referencing for drop-in substitutes']
    },
    {
      id: 12,
      title: 'Min-Order Threshold Resolution',
      description: 'National Rail Service releases 8 Meridian power blocks. Total is below vendor $150 minimum. Auto-add compatible anchors to clear.',
      customer: 'C-1022',
      lines: [{ sku: 'PDB-MER-FSPDB3', qty: 8 }],
      expectedTime: 240,
      painPoints: ['Vendor minimum order policies', 'Delayed releases for minor shortfalls', 'Manual calculation of low-cost add-ons']
    },
    {
      id: 13,
      title: 'High-Stakes Conduit Status Check',
      description: 'Query status and confirm shipping tracking for National Rail substation HDPE conduit order.',
      customer: 'C-1022',
      lines: [{ sku: 'CON-HDPE-4', qty: 10 }],
      expectedTime: 180,
      painPoints: ['No proactive order status tracking', 'Critical project delay risks', 'Manual status checks with factory representatives']
    },
    {
      id: 14,
      title: 'Emergency Storm Grid Restoration',
      description: 'Mid-Atlantic Power substation failure under emergency state mandate (fines of $50,000/hr). Re-allocate pre-sold heavy copper wire from Client Company, override allocation lock, dispatch hot-shot courier, and steer Client Company to code-compliant aluminum equivalent.',
      customer: 'C-1002',
      po: 'PO-MAP-EMER-911',
      shipTo: 'WHSE',
      warehouse: 'WD-01',
      shipVia: 'Hot-Shot Courier',
      lines: [
        { sku: 'WIR-XHHW6', qty: 1500 }
      ],
      expectedTime: 360,
      painPoints: ['Severe state-mandated penalty ($50k/hr) on restoration', 'Pre-allocated stock conflict with high-value account', 'ERP allocation override required', 'High-pressure client steering for alternative code-compliant cable']
    },
    {
      id: 15,
      title: 'Bid Deadline & Credit Escalation',
      description: 'Keystone Electric bidding on city transit project closing in 15 minutes. Escalate credit hold to Credit Manager ($12k over limit), apply manager discount matrix to bypass new 15% surcharge, and dispatch quote to meet deadline.',
      customer: 'C-1006',
      po: 'PO-KES-BID-FAST',
      shipTo: 'YORK',
      warehouse: 'HB-02',
      shipVia: 'Next-Day Air',
      lines: [
        { sku: 'PNL-200A', qty: 50 },
        { sku: 'BKR-GFCI', qty: 200 }
      ],
      expectedTime: 300,
      painPoints: ['Strict 15-minute bid submission deadline', 'Credit hold blocking automated order release', 'Manager-level price override required to bypass new surcharge', 'Customer threat of total account cancellation']
    }
  ],

  /* ----------------------------------------------------------
     HELPER METHODS
  ---------------------------------------------------------- */

  getScenario(id) {
    return this.scenarios.find(s => s.id === id) || null;
  },

  getScenarioLines(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    if (!scenario || !scenario.lines) return [];
    const products = window.BACKFEED_DATA?.products || [];
    return scenario.lines.map(line => {
      const product = products.find(p => p.sku === line.sku);
      if (!product) return { ...line, desc: 'UNKNOWN', uom: 'EA', listPrice: 0, mult: 1, netPrice: 0, extended: 0 };
      return {
        sku: line.sku,
        desc: product.desc,
        qty: line.qty,
        uom: product.uom,
        listPrice: product.listPrice,
        mult: product.mult,
        netPrice: product.netPrice,
        extended: parseFloat((line.qty * product.netPrice).toFixed(2)),
        shipTo: line.shipTo || null
      };
    });
  },

  getCustomerForScenario(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    if (!scenario || !scenario.customer) return null;
    const customers = window.BACKFEED_DATA?.customers || [];
    return customers.find(c => c.id === scenario.customer) || null;
  }
};
