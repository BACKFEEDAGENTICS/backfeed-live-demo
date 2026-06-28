/* ============================================================
   Backfeed — Universal ERP Connector Profiles
   Defines pluggable ERP system configurations for the portal.
   Each profile contains metadata, connection config, field
   mapping schema, and typing cadence parameters.
   ============================================================ */

window.ERP_PROFILES = {

  /* ── Backfeed ERP — Built-In Demo ──────────────────────────── */
  'eclipse-demo': {
    id: 'eclipse-demo',
    name: 'Backfeed ERP',
    vendor: 'Backfeed',
    type: 'demo',
    icon: 'fa-solid fa-terminal',
    color: '#38bdf8',
    badgeLabel: 'Demo',
    description: 'Built-in ERP simulation for electrical distribution. Full visual autopilot supported.',
    portalUrl: '',
    authType: 'none',
    supportsPostMessage: true,
    fieldMap: {
      orderType:    '#oe-order-type',
      vendor:       '#oe-vendor',
      customerId:   '#oe-customer-id',
      po:           '#oe-po',
      addLineBtn:   '#oe-add-line',
      submitBtn:    '#oe-submit',
      convertBtn:   '#oe-convert',
      skuInput:     '.sku-input',
      qtyInput:     '.qty-input',
      linesBody:    '#oe-lines-body'
    },
    typingCadence: {
      charDelayMin: 35,
      charDelayMax: 85,
      fieldPauseMin: 300,
      fieldPauseMax: 700,
      jitterRange: 0.25
    }
  },

  /* ── SAP Business One — Web Client ────────────────────────── */
  'sap-b1': {
    id: 'sap-b1',
    name: 'SAP Business One',
    vendor: 'SAP',
    type: 'external',
    icon: 'fa-solid fa-cube',
    color: '#0070f2',
    badgeLabel: 'Web Client',
    description: 'SAP Business One web client. Requires server-side Playwright agent for automated entry.',
    portalUrl: '',
    authType: 'sso',
    supportsPostMessage: false,
    fieldMap: {
      orderType:    '[data-field="DocType"]',
      vendor:       '[data-field="CardCode"]',
      customerId:   '[data-field="CardCode"]',
      po:           '[data-field="NumAtCard"]',
      addLineBtn:   '.btn-add-row',
      submitBtn:    '.btn-add',
      skuInput:     '[data-field="ItemCode"]',
      qtyInput:     '[data-field="Quantity"]',
      linesBody:    '.matrix-body'
    },
    typingCadence: {
      charDelayMin: 40,
      charDelayMax: 110,
      fieldPauseMin: 400,
      fieldPauseMax: 900,
      jitterRange: 0.30
    }
  },

  /* ── Oracle NetSuite — SuiteCloud ─────────────────────────── */
  'netsuite': {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    vendor: 'Oracle',
    type: 'external',
    icon: 'fa-solid fa-cloud',
    color: '#e85d04',
    badgeLabel: 'SuiteCloud',
    description: 'Oracle NetSuite SuiteCloud web portal. Requires server-side Playwright agent for automated entry.',
    portalUrl: '',
    authType: 'oauth',
    supportsPostMessage: false,
    fieldMap: {
      orderType:    '#custbody_ordertype',
      vendor:       '#entity',
      customerId:   '#entity',
      po:           '#otherrefnum',
      addLineBtn:   '#item_addedit',
      submitBtn:    '#submitter',
      skuInput:     '#item_item_display',
      qtyInput:     '#item_quantity',
      linesBody:    '#item_splits'
    },
    typingCadence: {
      charDelayMin: 50,
      charDelayMax: 120,
      fieldPauseMin: 500,
      fieldPauseMax: 1000,
      jitterRange: 0.35
    }
  },

  /* ── Prophet 21 (Epicor) — Web Portal ─────────────────────── */
  'prophet21': {
    id: 'prophet21',
    name: 'Prophet 21',
    vendor: 'Epicor',
    type: 'external',
    icon: 'fa-solid fa-server',
    color: '#7c3aed',
    badgeLabel: 'Web Portal',
    description: 'Epicor Prophet 21 distribution ERP. Requires server-side Playwright agent for automated entry.',
    portalUrl: '',
    authType: 'basic',
    supportsPostMessage: false,
    fieldMap: {
      orderType:    '#orderType',
      vendor:       '#vendorCode',
      customerId:   '#customerNumber',
      po:           '#poNumber',
      addLineBtn:   '.add-line-item',
      submitBtn:    '.submit-order',
      skuInput:     '.item-number',
      qtyInput:     '.quantity',
      linesBody:    '.order-lines-grid'
    },
    typingCadence: {
      charDelayMin: 45,
      charDelayMax: 100,
      fieldPauseMin: 350,
      fieldPauseMax: 800,
      jitterRange: 0.28
    }
  },

  /* ── Infor CloudSuite Distribution ────────────────────────── */
  'infor-csd': {
    id: 'infor-csd',
    name: 'Infor CloudSuite',
    vendor: 'Infor',
    type: 'external',
    icon: 'fa-solid fa-cloud-arrow-up',
    color: '#00a3e0',
    badgeLabel: 'Cloud',
    description: 'Infor CloudSuite Distribution (SX.e). Requires server-side Playwright agent for automated entry.',
    portalUrl: '',
    authType: 'sso',
    supportsPostMessage: false,
    fieldMap: {
      orderType:    '[name="ordertype"]',
      vendor:       '[name="vendno"]',
      customerId:   '[name="custno"]',
      po:           '[name="pession"]',
      addLineBtn:   '.btn-add-line',
      submitBtn:    '.btn-submit-order',
      skuInput:     '[name="shipprod"]',
      qtyInput:     '[name="qtyord"]',
      linesBody:    '.grid-lines'
    },
    typingCadence: {
      charDelayMin: 45,
      charDelayMax: 105,
      fieldPauseMin: 400,
      fieldPauseMax: 850,
      jitterRange: 0.30
    }
  },

  /* ── Custom / Other — User Configurable ───────────────────── */
  'custom': {
    id: 'custom',
    name: 'Custom ERP',
    vendor: 'User-Defined',
    type: 'external',
    icon: 'fa-solid fa-puzzle-piece',
    color: '#64748b',
    badgeLabel: 'Custom',
    description: 'Connect to any web-based ERP system by providing the portal URL and CSS field selectors.',
    portalUrl: '',
    authType: 'custom',
    supportsPostMessage: false,
    fieldMap: {
      orderType:    '',
      vendor:       '',
      customerId:   '',
      po:           '',
      addLineBtn:   '',
      submitBtn:    '',
      skuInput:     '',
      qtyInput:     '',
      linesBody:    ''
    },
    typingCadence: {
      charDelayMin: 50,
      charDelayMax: 120,
      fieldPauseMin: 500,
      fieldPauseMax: 1000,
      jitterRange: 0.30
    }
  }
};

/* ── Helper: Get profile by ID ──────────────────────────────── */
window.getERPProfile = function(profileId) {
  return window.ERP_PROFILES[profileId] || window.ERP_PROFILES['eclipse-demo'];
};

/* ── Helper: Get all profile IDs ────────────────────────────── */
window.getERPProfileList = function() {
  return Object.values(window.ERP_PROFILES).map(p => ({
    id: p.id,
    name: p.name,
    vendor: p.vendor,
    icon: p.icon,
    color: p.color,
    type: p.type,
    badgeLabel: p.badgeLabel
  }));
};
