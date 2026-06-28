/* ============================================================
   Eclipse ERP — Application Logic
   Faithful recreation of Epicor Eclipse for electrical distribution
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     APPLICATION STATE
  ---------------------------------------------------------- */
  window.ECLIPSE_APP = {
    tabs: [],
    activeTabId: null,
    tabCounter: 0,
    menuOpen: null,
    scenarioActive: null,
    scenarioStartTime: null,
    scenarioTimerInterval: null,
    nextOrderNum: 910,
    nextQuoteNum: 130,
    clockInterval: null,
    sessionTimeout: null,
    orderStates: {},
    quoteStates: {},
  };

  const APP = window.ECLIPSE_APP;

  /* ----------------------------------------------------------
     INITIALIZATION
  ---------------------------------------------------------- */
  function init() {
    waitForData(() => {
      startClock();
      bindMenuBar();
      bindToolbar();
      bindFunctionKeys();
      bindKeyboard();
      bindScenarioPanel();
      bindModalClose();
      openTab('dashboard', 'Dashboard', renderDashboard);
      simulateConnection();
      scheduleSessionTimeout();
    });
  }

  function waitForData(cb) {
    if (window.BACKFEED_DATA && window.SCENARIO_ENGINE) {
      cb();
    } else {
      setStatusMessage('Loading data modules...');
      const check = setInterval(() => {
        if (window.BACKFEED_DATA && window.SCENARIO_ENGINE) {
          clearInterval(check);
          cb();
        }
      }, 100);
    }
  }

  function simulateConnection() {
    setStatusMessage('Connecting to server...');
    const connEl = document.getElementById('status-connection');
    setTimeout(() => {
      connEl.innerHTML = '<span class="conn-dot connected"></span><span>Connected</span>';
      setStatusMessage('Ready');
    }, 1500);
  }

  function scheduleSessionTimeout() {
    clearTimeout(APP.sessionTimeout);
    APP.sessionTimeout = setTimeout(() => {
      showModal(
        'Session Timeout Warning',
        '<i class="fa-solid fa-clock modal-icon-large warning"></i>Your session will timeout in <b>5 minutes</b>. Please save your work to avoid data loss.',
        [{ label: 'OK', className: 'modal-btn primary', action: () => { closeModal(); scheduleSessionTimeout(); } }],
        'warning'
      );
    }, 300000);
  }

  /* ----------------------------------------------------------
     CLOCK
  ---------------------------------------------------------- */
  function startClock() {
    const el = document.getElementById('status-clock');
    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tick();
    APP.clockInterval = setInterval(tick, 1000);
  }

  /* ----------------------------------------------------------
     STATUS BAR
  ---------------------------------------------------------- */
  function setStatusMessage(msg) {
    const el = document.getElementById('status-message');
    if (el) el.innerHTML = '<span>' + escapeHtml(msg) + '</span>';
  }

  /* ----------------------------------------------------------
     TAB SYSTEM
  ---------------------------------------------------------- */
  function openTab(type, title, renderer, data) {
    const existingTab = APP.tabs.find(t => t.type === type && JSON.stringify(t.data) === JSON.stringify(data));
    if (existingTab) {
      activateTab(existingTab.id);
      return existingTab.id;
    }

    APP.tabCounter++;
    const tabId = 'tab-' + APP.tabCounter;

    const tab = { id: tabId, type, title, renderer, data: data || null };
    APP.tabs.push(tab);

    const tabBar = document.getElementById('tab-bar');
    const tabEl = document.createElement('div');
    tabEl.className = 'tab-item';
    tabEl.dataset.tabId = tabId;
    tabEl.innerHTML = '<span class="tab-title">' + escapeHtml(title) + '</span>' +
      (type !== 'dashboard' ? '<span class="tab-close" title="Close"><i class="fa-solid fa-xmark"></i></span>' : '');
    tabEl.addEventListener('click', (e) => {
      if (e.target.closest('.tab-close')) {
        closeTab(tabId);
      } else {
        activateTab(tabId);
      }
    });
    tabBar.appendChild(tabEl);

    const contentArea = document.getElementById('tab-content');
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = tabId + '-panel';
    contentArea.appendChild(panel);

    renderer(panel, data);
    activateTab(tabId);
    return tabId;
  }

  function activateTab(tabId) {
    APP.activeTabId = tabId;

    document.querySelectorAll('.tab-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tabId === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(el => {
      el.classList.toggle('active', el.id === tabId + '-panel');
    });

    const tab = APP.tabs.find(t => t.id === tabId);
    if (tab) setStatusMessage(tab.title);
  }

  function closeTab(tabId) {
    const idx = APP.tabs.findIndex(t => t.id === tabId);
    if (idx === -1) return;

    APP.tabs.splice(idx, 1);

    const tabEl = document.querySelector('.tab-item[data-tab-id="' + tabId + '"]');
    if (tabEl) tabEl.remove();

    const panel = document.getElementById(tabId + '-panel');
    if (panel) panel.remove();

    delete APP.orderStates[tabId];
    delete APP.quoteStates[tabId];

    if (APP.activeTabId === tabId) {
      const next = APP.tabs[Math.min(idx, APP.tabs.length - 1)];
      if (next) activateTab(next.id);
    }
  }

  function getActiveTab() {
    return APP.tabs.find(t => t.id === APP.activeTabId) || null;
  }

  /* ----------------------------------------------------------
     MENU BAR
  ---------------------------------------------------------- */
  function bindMenuBar() {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        closeAllMenus();
        if (!isOpen) {
          item.classList.add('open');
          APP.menuOpen = item;
        }
      });
      item.addEventListener('mouseenter', () => {
        if (APP.menuOpen && APP.menuOpen !== item) {
          closeAllMenus();
          item.classList.add('open');
          APP.menuOpen = item;
        }
      });
    });

    document.querySelectorAll('.menu-dropdown li[data-action]').forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = li.dataset.action;
        closeAllMenus();
        handleAction(action);
      });
    });

    document.addEventListener('click', () => closeAllMenus());
  }

  function closeAllMenus() {
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('open'));
    APP.menuOpen = null;
  }

  /* ----------------------------------------------------------
     TOOLBAR
  ---------------------------------------------------------- */
  function bindToolbar() {
    document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => handleAction(btn.dataset.action));
    });
  }

  /* ----------------------------------------------------------
     FUNCTION KEYS
  ---------------------------------------------------------- */
  function bindFunctionKeys() {
    document.querySelectorAll('.fkey-btn[data-fkey]').forEach(btn => {
      btn.addEventListener('click', () => handleFKey(btn.dataset.fkey));
    });
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key.match(/^F[1-9]$|^F10$/)) {
        e.preventDefault();
        handleFKey(e.key);
      }
    });
  }

  function handleFKey(key) {
    switch (key) {
      case 'F1': handleAction('help-contents'); break;
      case 'F2': handleAction('new-order'); break;
      case 'F3': handleAction('open-customer-search'); break;
      case 'F5': handleAction('refresh'); break;
      case 'F6': handleAction('print'); break;
      case 'F7': handleAction('save'); break;
      case 'F10': {
        const tab = getActiveTab();
        if (tab && tab.type !== 'dashboard') closeTab(tab.id);
        break;
      }
    }
  }

  /* ----------------------------------------------------------
     ACTION DISPATCHER
  ---------------------------------------------------------- */
  function handleAction(action) {
    switch (action) {
      case 'new-order':
        openTab('order-entry', 'Order Entry — New', renderOrderEntry, { mode: 'order' });
        break;
      case 'new-quote':
        openTab('order-entry', 'Quote Entry — New', renderOrderEntry, { mode: 'quote' });
        break;
      case 'open-customer-search':
        openTab('customer-search', 'Customer Lookup', renderCustomerSearch);
        break;
      case 'open-inventory':
        openTab('inventory', 'Inventory Inquiry', renderInventoryInquiry);
        break;
      case 'open-price-lookup':
        openTab('price-lookup', 'Price Lookup', renderPriceLookup);
        break;
      case 'open-dashboard':
        openTab('dashboard', 'Dashboard', renderDashboard);
        break;
      case 'refresh': {
        const tab = getActiveTab();
        if (tab && tab.renderer) {
          const panel = document.getElementById(tab.id + '-panel');
          if (panel) { panel.innerHTML = ''; tab.renderer(panel, tab.data); }
          setStatusMessage('Refreshed');
        }
        break;
      }
      case 'save':
        handleSave();
        break;
      case 'print':
        showModal('Print', '<i class="fa-solid fa-print modal-icon-large info"></i>Print preview is not available in this session. Use <b>Ctrl+P</b> for browser print.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'info');
        break;
      case 'exit':
        showModal('Exit Eclipse', '<i class="fa-solid fa-right-from-bracket modal-icon-large warning"></i>Are you sure you want to exit Eclipse ERP? Unsaved changes will be lost.', [
          { label: 'Yes', className: 'modal-btn danger', action: () => { closeModal(); document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1e1e2e;color:#888;font-family:Segoe UI;font-size:16px;">Eclipse ERP session ended. Refresh to restart.</div>'; } },
          { label: 'No', className: 'modal-btn', action: closeModal }
        ], 'warning');
        break;
      case 'help-contents':
        showModal('Eclipse ERP Help', '<i class="fa-solid fa-circle-question modal-icon-large info"></i><b>Eclipse ERP v9.2.4</b><br>Epicor Eclipse for Electrical Distribution<br><br>For support, contact IT Help Desk:<br>Internal ext. 100 | help@summitelectrical.com<br><br><small>Keyboard: F2=New Order, F3=Search, F5=Refresh, F7=Save, F10=Close Tab</small>', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'info');
        break;
      case 'about':
        showModal('About Eclipse ERP', '<div style="text-align:center"><i class="fa-solid fa-bolt" style="font-size:32px;color:#ffd700;margin-bottom:8px;display:block;"></i><b>Eclipse ERP</b><br>Version 9.2.4 Build 20260415<br><br>© 2026 Epicor Software Corporation<br>Licensed to: Summit Electrical Sales<br>West Deptford, NJ<br><br><small>Terminal T4 | Database: SUMMIT_PROD</small></div>', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'info');
        break;
      default:
        setStatusMessage('Action: ' + action);
    }
  }

  function handleSave() {
    const tab = getActiveTab();
    if (!tab) return;
    if (tab.type === 'order-entry') {
      const state = APP.orderStates[tab.id] || APP.quoteStates[tab.id];
      if (state) {
        setStatusMessage('Saving...');
        setTimeout(() => {
          showModal('Saved', '<i class="fa-solid fa-check-circle modal-icon-large success"></i>Record saved successfully.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'success');
          setStatusMessage('Saved');
        }, 500);
      }
    } else {
      setStatusMessage('Nothing to save');
    }
  }

  /* ----------------------------------------------------------
     MODAL SYSTEM
  ---------------------------------------------------------- */
  function showModal(title, bodyHtml, buttons, type) {
    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const footerEl = document.getElementById('modal-footer');
    const iconEl = document.getElementById('modal-icon');

    const iconMap = { error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info', success: 'fa-circle-check' };
    iconEl.innerHTML = '<i class="fa-solid ' + (iconMap[type] || 'fa-circle-exclamation') + '"></i>';
    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;

    footerEl.innerHTML = '';
    (buttons || []).forEach(btn => {
      const b = document.createElement('button');
      b.className = btn.className || 'modal-btn';
      b.textContent = btn.label;
      b.addEventListener('click', btn.action);
      footerEl.appendChild(b);
    });

    overlay.classList.remove('hidden');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  }

  function bindModalClose() {
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  /* ----------------------------------------------------------
     SCENARIO PANEL
  ---------------------------------------------------------- */
  function bindScenarioPanel() {
    const toggle = document.getElementById('scenario-toggle');
    const panel = document.getElementById('scenario-panel');
    const closeBtn = document.getElementById('scenario-panel-close');
    const clearBtn = document.getElementById('scenario-clear');

    toggle.addEventListener('click', () => panel.classList.toggle('hidden'));
    closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
    clearBtn.addEventListener('click', () => {
      APP.scenarioActive = null;
      stopScenarioTimer();
      document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
      setStatusMessage('Scenario cleared');
    });

    renderScenarioList();
  }

  function renderScenarioList() {
    const container = document.getElementById('scenario-list');
    const scenarios = window.SCENARIO_ENGINE?.scenarios || [];
    container.innerHTML = '';

    scenarios.forEach(s => {
      const card = document.createElement('div');
      card.className = 'scenario-card';
      card.dataset.scenarioId = s.id;
      card.innerHTML = '<div class="scenario-card-title"><span class="scenario-num">#' + s.id + '</span>' + escapeHtml(s.title) + '</div>' +
        '<div class="scenario-card-desc">' + escapeHtml(s.description) + '</div>';
      card.addEventListener('click', () => activateScenario(s.id));
      container.appendChild(card);
    });
  }

  function activateScenario(id) {
    const scenario = window.SCENARIO_ENGINE.getScenario(id);
    if (!scenario) return;

    APP.scenarioActive = scenario;
    document.querySelectorAll('.scenario-card').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.scenarioId) === id);
    });

    startScenarioTimer();

    switch (id) {
      case 1: case 2: case 4: case 5: case 7: {
        const mode = 'order';
        const tabId = openTab('order-entry', 'Order Entry — S' + id, renderOrderEntry, { mode, scenarioId: id });
        break;
      }
      case 3: {
        openTab('order-entry', 'Quote → Order — S3', renderOrderEntry, { mode: 'quote-convert', scenarioId: id, quoteId: scenario.quoteId });
        break;
      }
      case 6: case 10:
        if (scenario.searchSku) {
          openTab('inventory', 'Inventory — S' + id, renderInventoryInquiry, { searchSku: scenario.searchSku });
        }
        break;
      case 8:
        openTab('customer-detail', scenario.customer, renderCustomerDetail, { customerId: scenario.customer, focusTab: 'credit' });
        break;
      case 9:
        openTab('customer-search', 'Customer Lookup — S9', renderCustomerSearch, { searchTerm: scenario.searchTerm });
        break;
    }
    setStatusMessage('Scenario ' + id + ': ' + scenario.title);
  }

  function startScenarioTimer() {
    stopScenarioTimer();
    APP.scenarioStartTime = Date.now();
    const timerEl = document.getElementById('scenario-timer');
    const section = document.getElementById('status-scenario');
    section.style.display = 'flex';
    APP.scenarioTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - APP.scenarioStartTime) / 1000);
      const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const secs = (elapsed % 60).toString().padStart(2, '0');
      timerEl.textContent = mins + ':' + secs;
    }, 1000);
  }

  function stopScenarioTimer() {
    clearInterval(APP.scenarioTimerInterval);
    document.getElementById('status-scenario').style.display = 'none';
    document.getElementById('scenario-timer').textContent = '00:00';
  }

  /* ----------------------------------------------------------
     SCREEN: DASHBOARD
  ---------------------------------------------------------- */
  function renderDashboard(panel) {
    const data = window.BACKFEED_DATA;
    const activity = data.recentActivity || [];
    const openOrders = data.customers.reduce((n, c) => n + c.orders.filter(o => o.status === 'Open' || o.status === 'Partial Ship').length, 0);
    const pendingQuotes = (data.quotes || []).filter(q => q.status === 'Pending').length;
    const backorders = 3;
    const creditHolds = data.customers.reduce((n, c) => n + c.orders.filter(o => o.status === 'Credit Hold').length, 0);

    panel.innerHTML = `
      <div class="dashboard-container">
        <div class="dashboard-welcome">
          <i class="fa-solid fa-bolt"></i>
          <div>
            <h2>Welcome to Eclipse ERP</h2>
            <p>Summit Electrical Sales — West Deptford, NJ | User: G. Miller | ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-value">${openOrders}</div>
            <div class="stat-label">Open Orders</div>
          </div>
          <div class="stat-card">
            <div class="stat-value warning">${pendingQuotes}</div>
            <div class="stat-label">Pending Quotes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value warning">${backorders}</div>
            <div class="stat-label">Items on Backorder</div>
          </div>
          <div class="stat-card">
            <div class="stat-value danger">${creditHolds}</div>
            <div class="stat-label">Credits on Hold</div>
          </div>
        </div>

        <div class="dashboard-lower">
          <div class="dashboard-section">
            <div class="dashboard-section-title"><i class="fa-solid fa-clock-rotate-left"></i> Recent Activity</div>
            <div class="activity-list">
              ${activity.map(a => `
                <div class="activity-item">
                  <span class="activity-time">${escapeHtml(a.time)}</span>
                  <span class="activity-event">${escapeHtml(a.event)}</span>
                  <span class="activity-user">${escapeHtml(a.user)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="dashboard-section">
            <div class="dashboard-section-title"><i class="fa-solid fa-bolt"></i> Quick Actions</div>
            <div class="quick-actions">
              <button class="quick-action-btn" data-action="new-order"><i class="fa-solid fa-file-circle-plus"></i> New Order (F2)</button>
              <button class="quick-action-btn" data-action="open-customer-search"><i class="fa-solid fa-users"></i> Customer Search (F3)</button>
              <button class="quick-action-btn" data-action="open-inventory"><i class="fa-solid fa-warehouse"></i> Inventory Lookup</button>
              <button class="quick-action-btn" data-action="new-quote"><i class="fa-solid fa-file-lines"></i> New Quote</button>
              <button class="quick-action-btn" data-action="open-price-lookup"><i class="fa-solid fa-dollar-sign"></i> Price Lookup</button>
            </div>
          </div>
        </div>
      </div>
    `;

    panel.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAction(btn.dataset.action));
    });
  }

  /* ----------------------------------------------------------
     SCREEN: CUSTOMER SEARCH
  ---------------------------------------------------------- */
  function renderCustomerSearch(panel, data) {
    const searchTerm = data?.searchTerm || '';

    panel.innerHTML = `
      <div class="search-container">
        <div class="form-section-title"><i class="fa-solid fa-users"></i> Customer Lookup</div>
        <div class="search-form">
          <div class="form-group">
            <label>Customer #</label>
            <input type="text" class="form-control" id="cust-search-id" style="width:100px;">
          </div>
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" class="form-control" id="cust-search-name" style="width:200px;" value="${escapeHtml(searchTerm)}">
          </div>
          <div class="form-group">
            <label>Contact Name</label>
            <input type="text" class="form-control" id="cust-search-contact" style="width:160px;">
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" class="form-control" id="cust-search-phone" style="width:140px;">
          </div>
          <div class="form-group">
            <label>City</label>
            <input type="text" class="form-control" id="cust-search-city" style="width:140px;">
          </div>
          <button class="btn btn-primary" id="cust-search-btn"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
          <button class="btn" id="cust-search-clear">Clear</button>
        </div>
        <div class="search-results-info" id="cust-results-info"></div>
        <div class="search-results">
          <div class="data-grid-container" id="cust-results-grid"></div>
        </div>
      </div>
    `;

    const searchBtn = panel.querySelector('#cust-search-btn');
    const clearBtn = panel.querySelector('#cust-search-clear');

    const doSearch = () => {
      const filters = {
        id: panel.querySelector('#cust-search-id').value.trim().toUpperCase(),
        name: panel.querySelector('#cust-search-name').value.trim().toLowerCase(),
        contact: panel.querySelector('#cust-search-contact').value.trim().toLowerCase(),
        phone: panel.querySelector('#cust-search-phone').value.trim(),
        city: panel.querySelector('#cust-search-city').value.trim().toLowerCase()
      };

      let results = window.BACKFEED_DATA.customers;

      if (filters.id) results = results.filter(c => c.id.includes(filters.id));
      if (filters.name) results = results.filter(c => c.name.toLowerCase().includes(filters.name));
      if (filters.contact) results = results.filter(c => c.contacts.some(ct => ct.name.toLowerCase().includes(filters.contact)));
      if (filters.phone) results = results.filter(c => c.phone.includes(filters.phone));
      if (filters.city) results = results.filter(c => c.address.toLowerCase().includes(filters.city));

      renderCustomerResults(panel, results);
    };

    searchBtn.addEventListener('click', doSearch);
    clearBtn.addEventListener('click', () => {
      panel.querySelectorAll('.search-form input').forEach(i => i.value = '');
      panel.querySelector('#cust-results-grid').innerHTML = '';
      panel.querySelector('#cust-results-info').textContent = '';
    });

    panel.querySelectorAll('.search-form input').forEach(input => {
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    });

    if (searchTerm) {
      setTimeout(doSearch, 100);
    }
  }

  function renderCustomerResults(panel, results) {
    const info = panel.querySelector('#cust-results-info');
    const grid = panel.querySelector('#cust-results-grid');

    info.textContent = results.length + ' record(s) found';

    const primaryContact = (c) => {
      const p = c.contacts.find(ct => ct.primary);
      return p ? p.name : (c.contacts[0]?.name || '—');
    };

    const primaryPhone = (c) => {
      const p = c.contacts.find(ct => ct.primary);
      return p ? p.phone : c.phone;
    };

    grid.innerHTML = `
      <table class="data-grid">
        <thead>
          <tr>
            <th class="sortable" style="width:80px;">Cust # <span class="sort-arrow">▼</span></th>
            <th class="sortable">Company Name <span class="sort-arrow">▼</span></th>
            <th>Contact</th>
            <th>Phone</th>
            <th>Status</th>
            <th class="numeric">Credit Limit</th>
            <th class="numeric">Balance</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(c => `
            <tr data-customer-id="${c.id}" class="customer-row">
              <td>${escapeHtml(c.id)}</td>
              <td>${escapeHtml(c.name)}</td>
              <td>${escapeHtml(primaryContact(c))}</td>
              <td>${escapeHtml(primaryPhone(c))}</td>
              <td><span class="status-badge ${c.status.toLowerCase()}">${escapeHtml(c.status)}</span></td>
              <td class="numeric">${formatCurrency(c.credit.limit)}</td>
              <td class="numeric">${formatCurrency(c.credit.balance)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    grid.querySelectorAll('.customer-row').forEach(row => {
      row.addEventListener('dblclick', () => {
        const custId = row.dataset.customerId;
        openTab('customer-detail', custId, renderCustomerDetail, { customerId: custId });
      });
      row.addEventListener('click', () => {
        grid.querySelectorAll('.customer-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const custId = row.dataset.customerId;
          openTab('customer-detail', custId, renderCustomerDetail, { customerId: custId });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     SCREEN: CUSTOMER DETAIL
  ---------------------------------------------------------- */
  function renderCustomerDetail(panel, data) {
    const custId = data?.customerId;
    const focusTab = data?.focusTab || 'general';
    const customer = window.BACKFEED_DATA.customers.find(c => c.id === custId);
    if (!customer) {
      panel.innerHTML = '<div class="form-section"><p class="error-text">Customer not found: ' + escapeHtml(custId) + '</p></div>';
      return;
    }

    const tabConfig = [
      { key: 'general', label: 'General' },
      { key: 'contacts', label: 'Contacts' },
      { key: 'shipto', label: 'Ship-To' },
      { key: 'credit', label: 'Credit' },
      { key: 'history', label: 'Order History' },
      { key: 'notes', label: 'Notes' }
    ];

    panel.innerHTML = `
      <div class="customer-detail-container">
        <div class="customer-detail-header">
          <div>
            <h2>${escapeHtml(customer.name)}</h2>
            <span style="font-size:11px;color:#666;">${escapeHtml(customer.address)}</span>
          </div>
          <div style="text-align:right;">
            <span class="customer-id">${escapeHtml(customer.id)}</span><br>
            <span class="status-badge ${customer.status.toLowerCase()}">${escapeHtml(customer.status)}</span>
          </div>
        </div>
        <div class="sub-tabs" id="cust-sub-tabs">
          ${tabConfig.map(t => `<div class="sub-tab${t.key === focusTab ? ' active' : ''}" data-tab="${t.key}">${t.label}</div>`).join('')}
        </div>
        <div class="customer-detail-body" id="cust-detail-body">
          ${renderCustTabContent(customer, focusTab)}
        </div>
      </div>
    `;

    panel.querySelectorAll('.sub-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panel.querySelector('#cust-detail-body').innerHTML = renderCustTabContent(customer, tab.dataset.tab);
        bindCustTabEvents(panel, customer, tab.dataset.tab);
      });
    });

    bindCustTabEvents(panel, customer, focusTab);
  }

  function renderCustTabContent(customer, tabKey) {
    switch (tabKey) {
      case 'general':
        return `
          <div class="form-section">
            <div class="form-grid" style="grid-template-columns: repeat(3, 1fr);">
              <div class="form-group"><label>Company Name</label><input type="text" class="form-control" value="${escapeHtml(customer.name)}" readonly></div>
              <div class="form-group"><label>Address</label><input type="text" class="form-control" value="${escapeHtml(customer.address)}" readonly></div>
              <div class="form-group"><label>Phone</label><input type="text" class="form-control" value="${escapeHtml(customer.phone)}" readonly></div>
              <div class="form-group"><label>Fax</label><input type="text" class="form-control" value="${escapeHtml(customer.fax || '—')}" readonly></div>
              <div class="form-group"><label>Email</label><input type="text" class="form-control" value="${escapeHtml(customer.email)}" readonly></div>
              <div class="form-group"><label>Website</label><input type="text" class="form-control" value="${escapeHtml(customer.website || '—')}" readonly></div>
              <div class="form-group"><label>Tax ID</label><input type="text" class="form-control" value="${escapeHtml(customer.taxId)}" readonly></div>
              <div class="form-group"><label>Territory</label><input type="text" class="form-control" value="${escapeHtml(customer.territory)}" readonly></div>
              <div class="form-group"><label>Status</label><input type="text" class="form-control" value="${escapeHtml(customer.status)}" readonly></div>
            </div>
          </div>`;

      case 'contacts':
        return `
          <div class="form-section">
            <div class="data-grid-container" style="max-height:300px;">
              <table class="data-grid">
                <thead><tr><th>Name</th><th>Title</th><th>Phone</th><th>Email</th><th style="width:60px;">Primary</th></tr></thead>
                <tbody>
                  ${customer.contacts.map(ct => `
                    <tr>
                      <td>${escapeHtml(ct.name)}</td>
                      <td>${escapeHtml(ct.title)}</td>
                      <td>${escapeHtml(ct.phone)}</td>
                      <td>${escapeHtml(ct.email)}</td>
                      <td class="center">${ct.primary ? '<i class="fa-solid fa-check" style="color:#2e7d32;"></i>' : ''}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>`;

      case 'shipto':
        return `
          <div class="form-section">
            <div class="data-grid-container" style="max-height:300px;">
              <table class="data-grid">
                <thead><tr><th style="width:60px;">Code</th><th>Name</th><th>Address</th></tr></thead>
                <tbody>
                  ${customer.shipTos.map(s => `
                    <tr><td>${escapeHtml(s.code)}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.address)}</td></tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>`;

      case 'credit': {
        const cr = customer.credit;
        const ag = cr.aging;
        const limitPct = cr.limit > 0 ? Math.round((cr.balance / cr.limit) * 100) : 0;
        const statusClass = cr.status === 'Hold' ? 'danger' : cr.status === 'Watch' ? 'warning' : '';
        return `
          <div class="form-section">
            <div class="credit-overview">
              <div class="credit-card"><div class="credit-value">${formatCurrency(cr.limit)}</div><div class="credit-label">Credit Limit</div></div>
              <div class="credit-card ${statusClass}"><div class="credit-value">${formatCurrency(cr.balance)}</div><div class="credit-label">Balance Due (${limitPct}% used)</div></div>
              <div class="credit-card"><div class="credit-value">${formatCurrency(cr.available)}</div><div class="credit-label">Available Credit</div></div>
            </div>
            <div class="form-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom:16px;">
              <div class="form-group"><label>Terms</label><input type="text" class="form-control readonly" value="${escapeHtml(cr.terms)}" readonly></div>
              <div class="form-group"><label>Last Payment</label><input type="text" class="form-control readonly" value="${escapeHtml(cr.lastPayment || '—')}" readonly></div>
              <div class="form-group"><label>Credit Status</label><span class="status-badge ${cr.status.toLowerCase()}" style="margin-top:4px;">${escapeHtml(cr.status)}</span></div>
            </div>
            <h4 style="font-size:12px;font-weight:700;margin-bottom:8px;">Aging Summary</h4>
            <div class="aging-buckets">
              <div class="aging-bucket current"><div class="bucket-label">Current</div><div class="bucket-value">${formatCurrency(ag.current)}</div></div>
              <div class="aging-bucket ${ag.days30 > 0 ? 'overdue' : ''}"><div class="bucket-label">31-60 Days</div><div class="bucket-value">${formatCurrency(ag.days30)}</div></div>
              <div class="aging-bucket ${ag.days60 > 0 ? 'overdue' : ''}"><div class="bucket-label">61-90 Days</div><div class="bucket-value">${formatCurrency(ag.days60)}</div></div>
              <div class="aging-bucket ${ag.days90 > 0 ? 'overdue' : ''}"><div class="bucket-label">91-120 Days</div><div class="bucket-value">${formatCurrency(ag.days90)}</div></div>
              <div class="aging-bucket ${ag.days120 > 0 ? 'overdue' : ''}"><div class="bucket-label">120+ Days</div><div class="bucket-value">${formatCurrency(ag.days120)}</div></div>
            </div>
          </div>`;
      }

      case 'history':
        return `
          <div class="form-section">
            <div class="data-grid-container" style="max-height:300px;">
              <table class="data-grid">
                <thead><tr><th>Order #</th><th>Date</th><th>PO #</th><th>Ship-To</th><th class="numeric">Total</th><th>Status</th></tr></thead>
                <tbody>
                  ${customer.orders.map(o => {
                    const statusClass = o.status.toLowerCase().replace(/\s+/g, '-');
                    return `<tr>
                      <td>${escapeHtml(o.id)}</td>
                      <td>${escapeHtml(o.date)}</td>
                      <td>${escapeHtml(o.po)}</td>
                      <td>${escapeHtml(o.shipTo)}</td>
                      <td class="numeric">${formatCurrency(o.total)}</td>
                      <td><span class="status-badge ${statusClass}">${escapeHtml(o.status)}</span></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>`;

      case 'notes':
        return `
          <div class="form-section">
            <div class="notes-list">
              ${customer.notes.length === 0 ? '<p style="color:#999;font-size:11px;">No notes on file.</p>' :
                customer.notes.map(n => `
                  <div class="note-item">
                    <div class="note-meta">${escapeHtml(n.date)} — ${escapeHtml(n.user)}</div>
                    <div class="note-text">${escapeHtml(n.text)}</div>
                  </div>
                `).join('')}
            </div>
            <div style="border-top:1px solid #c0c0c0;padding-top:8px;">
              <label style="font-size:11px;font-weight:600;display:block;margin-bottom:4px;">Add Note:</label>
              <textarea class="form-control" id="new-note-text" style="width:100%;min-height:60px;" placeholder="Enter note text..."></textarea>
              <button class="btn btn-primary" id="add-note-btn" style="margin-top:6px;"><i class="fa-solid fa-plus"></i> Add Note</button>
            </div>
          </div>`;

      default:
        return '<div class="form-section"><p>Tab content not available.</p></div>';
    }
  }

  function bindCustTabEvents(panel, customer, tabKey) {
    if (tabKey === 'notes') {
      const addBtn = panel.querySelector('#add-note-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          const textEl = panel.querySelector('#new-note-text');
          const text = textEl?.value.trim();
          if (!text) return;
          customer.notes.unshift({ date: new Date().toISOString().slice(0, 10), user: 'G.Miller', text });
          panel.querySelector('#cust-detail-body').innerHTML = renderCustTabContent(customer, 'notes');
          bindCustTabEvents(panel, customer, 'notes');
          setStatusMessage('Note added');
        });
      }
    }
  }

  /* ----------------------------------------------------------
     SCREEN: ORDER ENTRY / QUOTE ENTRY
  ---------------------------------------------------------- */
  function renderOrderEntry(panel, data) {
    const mode = data?.mode || 'order';
    const scenarioId = data?.scenarioId || null;
    const scenario = scenarioId ? window.SCENARIO_ENGINE.getScenario(scenarioId) : null;
    const isQuote = mode === 'quote';
    const isConvert = mode === 'quote-convert';

    const tabObj = APP.tabs.find(t => document.getElementById(t.id + '-panel') === panel);
    const tabId = tabObj ? tabObj.id : 'tab-0';

    let quoteData = null;
    if (isConvert && data?.quoteId) {
      quoteData = (window.BACKFEED_DATA.quotes || []).find(q => q.id === data.quoteId);
    }

    const defaultCustomer = window.BACKFEED_DATA.customers[0];
    const customer = scenario ? window.SCENARIO_ENGINE.getCustomerForScenario(scenarioId) :
                     (quoteData ? window.BACKFEED_DATA.customers.find(c => c.id === quoteData.customer) :
                     (data?.customerId ? window.BACKFEED_DATA.customers.find(c => c.id === data.customerId) : defaultCustomer));

    const orderNum = isQuote ? 'QT-24-0' + APP.nextQuoteNum++ : 'SO-24-0' + APP.nextOrderNum++;
    const today = new Date().toISOString().slice(0, 10);
    const reqDate = new Date(Date.now() + 7 * 24 * 3600000).toISOString().slice(0, 10);

    const warehouses = window.BACKFEED_DATA.warehouses;
    const salespeople = window.BACKFEED_DATA.salespeople;

    const state = {
      orderNum,
      mode,
      customerId: customer?.id || '',
      customerName: customer?.name || '',
      po: scenario?.po || (quoteData ? 'CONV-' + quoteData.id : ''),
      orderDate: today,
      reqDate: reqDate,
      shipTo: scenario?.shipTo || (customer?.shipTos?.[0]?.code || ''),
      warehouse: scenario?.warehouse || 'WD-01',
      shipVia: scenario?.shipVia || 'Our Truck',
      terms: customer?.credit?.terms || '',
      salesperson: salespeople[0]?.id || 'GM',
      routingType: data?.routingType || scenario?.routingType || 'stock',
      vendor: data?.vendor || scenario?.vendor || '',
      lines: [],
      nextLine: 1
    };

    if (quoteData) {
      state.lines = quoteData.lines.map((l, i) => ({
        lineNum: i + 1,
        sku: l.sku,
        desc: l.desc,
        qty: l.qty,
        uom: l.uom,
        listPrice: l.listPrice,
        mult: l.mult,
        netPrice: l.netPrice,
        extended: l.extended,
        warehouse: state.warehouse,
        status: 'Open'
      }));
      state.nextLine = state.lines.length + 1;
    }

    if (mode === 'order') {
      APP.orderStates[tabId] = state;
    } else {
      APP.quoteStates[tabId] = state;
    }

    const shipToOptions = customer ? customer.shipTos.map(s => `<option value="${s.code}" ${s.code === state.shipTo ? 'selected' : ''}>${s.code} — ${escapeHtml(s.name)}</option>`).join('') : '<option value="">—</option>';

    panel.innerHTML = `
      <div class="order-entry-container">
        <!-- Human-In-The-Loop Warning Banner -->
        <div id="oe-hitl-banner" style="display: none; background: #fffbeb; border-left: 4px solid #d97706; padding: 10px 14px; margin-bottom: 12px; border-radius: 4px; font-family: var(--font-primary); font-size: 11px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #d97706; font-size: 14px;"></i>
                    <div>
                        <strong style="color: #b45309; font-size: 12px;">HUMAN-IN-THE-LOOP INTERVENTION REQUIRED</strong>
                        <div id="oe-hitl-message" style="color: var(--text-secondary); margin-top: 2px;">Autopilot is waiting for human action...</div>
                    </div>
                </div>
                <div style="display: flex; gap: 6px;" id="oe-hitl-actions"></div>
            </div>
        </div>

        <div class="order-header">
          <!-- First Row: Order #, Status, Order Type, Vendor, PO # -->
          <div class="order-header-row">
            <div class="form-group narrow">
              <label>${isQuote ? 'Quote' : 'Order'} # </label>
              <input type="text" class="form-control readonly" value="${orderNum}" readonly style="width: 80px;">
            </div>
            <div class="form-group narrow">
              <label>Status</label>
              <span class="status-badge ${isQuote ? 'quote' : 'open'}" style="margin-top:4px;">${isQuote || isConvert ? 'Quote' : 'New'}</span>
            </div>
            <div class="form-group medium">
              <label>Order Type</label>
              <select class="form-control" id="oe-order-type" style="width: 120px;">
                <option value="stock" ${state.routingType === 'stock' ? 'selected' : ''}>Stock (DC)</option>
                <option value="direct" ${state.routingType === 'direct' ? 'selected' : ''}>Direct (Drop Ship)</option>
              </select>
            </div>
            <div class="form-group medium" id="oe-vendor-group" style="${state.routingType === 'direct' ? '' : 'display:none;'}">
              <label>Vendor</label>
              <select class="form-control" id="oe-vendor" style="width: 160px;">
                <option value="VNDR-824" ${state.vendor === 'VNDR-824' ? 'selected' : ''}>VNDR-824 Liberty Wire</option>
                <option value="VNDR-711" ${state.vendor === 'VNDR-711' ? 'selected' : ''}>VNDR-711 Titan Devices</option>
                <option value="VNDR-310" ${state.vendor === 'VNDR-310' ? 'selected' : ''}>VNDR-310 Dura-Line PVC</option>
              </select>
            </div>
            <div class="form-group wide">
              <label>Customer <span class="required">*</span></label>
              <div class="form-inline">
                <select class="form-control" id="oe-customer-id" style="min-width:320px; flex: 1;">
                  ${window.BACKFEED_DATA.customers.map(c => `<option value="${c.id}" ${c.id === state.customerId ? 'selected' : ''}>${escapeHtml(c.name)} (${c.id})</option>`).join('')}
                </select>
                <button class="btn-icon" id="oe-customer-lookup" title="Lookup (F3)"><i class="fa-solid fa-magnifying-glass"></i></button>
              </div>
            </div>
            <div class="form-group medium" style="display:none;">
              <label>Customer Name</label>
              <input type="text" class="form-control readonly" id="oe-customer-name" value="${escapeHtml(state.customerName)}" readonly>
            </div>
            <div class="form-group medium">
              <label>PO # <span class="required">*</span></label>
              <input type="text" class="form-control" id="oe-po" value="${escapeHtml(state.po)}">
            </div>
          </div>
          <div class="order-header-row">
            <div class="form-group narrow">
              <label>Order Date</label>
              <input type="date" class="form-control" id="oe-order-date" value="${state.orderDate}">
            </div>
            <div class="form-group narrow">
              <label>Required Date</label>
              <input type="date" class="form-control" id="oe-req-date" value="${state.reqDate}">
            </div>
            <div class="form-group medium">
              <label>Ship-To</label>
              <select class="form-control" id="oe-ship-to">${shipToOptions}</select>
            </div>
            <div class="form-group narrow">
              <label>Warehouse</label>
              <select class="form-control" id="oe-warehouse">
                ${warehouses.map(w => `<option value="${w.code}" ${w.code === state.warehouse ? 'selected' : ''}>${w.code}</option>`).join('')}
              </select>
            </div>
            <div class="form-group medium">
              <label>Ship Via</label>
              <select class="form-control" id="oe-ship-via">
                <option ${state.shipVia === 'Our Truck' ? 'selected' : ''}>Our Truck</option>
                <option ${state.shipVia === 'UPS Ground' ? 'selected' : ''}>UPS Ground</option>
                <option ${state.shipVia === 'UPS Next Day' ? 'selected' : ''}>UPS Next Day</option>
                <option ${state.shipVia === 'FedEx Ground' ? 'selected' : ''}>FedEx Ground</option>
                <option ${state.shipVia === 'Will Call' ? 'selected' : ''}>Will Call</option>
                <option ${state.shipVia === 'Common Carrier' ? 'selected' : ''}>Common Carrier</option>
              </select>
            </div>
            <div class="form-group narrow">
              <label>Terms</label>
              <input type="text" class="form-control readonly" id="oe-terms" value="${escapeHtml(state.terms)}" readonly>
            </div>
            <div class="form-group narrow">
              <label>Salesperson</label>
              <select class="form-control" id="oe-salesperson">
                ${salespeople.map(sp => `<option value="${sp.id}" ${sp.id === state.salesperson ? 'selected' : ''}>${sp.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="order-lines-section">
          <div class="order-lines-header">
            <h3><i class="fa-solid fa-list"></i> Line Items</h3>
            <button class="btn btn-small" id="oe-add-line"><i class="fa-solid fa-plus"></i> Add Line</button>
          </div>
          <div class="order-grid-wrap">
            <table class="data-grid" id="oe-lines-grid">
              <thead>
                <tr>
                  <th style="width:40px;">Line#</th>
                  <th style="width:110px;">SKU</th>
                  <th>Description</th>
                  <th style="width:50px;">Qty</th>
                  <th style="width:40px;">UOM</th>
                  <th style="width:75px;" class="numeric">List Price</th>
                  <th style="width:50px;" class="numeric">Mult</th>
                  <th style="width:80px;" class="numeric">Net Price</th>
                  <th style="width:90px;" class="numeric">Extended</th>
                  <th style="width:55px;">WH</th>
                  <th style="width:65px;">Status</th>
                  <th style="width:30px;"></th>
                </tr>
              </thead>
              <tbody id="oe-lines-body"></tbody>
            </table>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-totals" id="oe-totals">
            <span class="total-label">Subtotal:</span><span class="total-value" id="oe-subtotal">$0.00</span>
            <span class="total-label">Tax (7%):</span><span class="total-value" id="oe-tax">$0.00</span>
            <span class="total-label">Freight:</span><span class="total-value" id="oe-freight">$0.00</span>
            <div class="grand-total" style="display:contents;">
              <span class="total-label">Total:</span><span class="total-value" id="oe-total">$0.00</span>
            </div>
          </div>
          <div class="order-actions">
            <button class="btn" id="oe-clear"><i class="fa-solid fa-eraser"></i> Clear</button>
            <button class="btn" id="oe-print-preview"><i class="fa-solid fa-print"></i> Print Preview</button>
            <button class="btn btn-primary" id="oe-save-draft"><i class="fa-solid fa-floppy-disk"></i> Save Draft</button>
            ${isConvert ? '<button class="btn btn-success" id="oe-convert"><i class="fa-solid fa-arrow-right"></i> Convert to Order</button>' :
              `<button class="btn btn-success" id="oe-submit"><i class="fa-solid fa-check"></i> ${isQuote ? 'Save Quote' : 'Submit Order'}</button>`}
          </div>
        </div>
      </div>
    `;

    // Bind customer lookup
    panel.querySelector('#oe-customer-lookup').addEventListener('click', () => {
      handleAction('open-customer-search');
    });

    panel.querySelector('#oe-customer-id').addEventListener('change', (e) => {
      const val = e.target.value.trim().toUpperCase();
      const cust = window.BACKFEED_DATA.customers.find(c => c.id === val);
      if (cust) {
        state.customerId = cust.id;
        state.customerName = cust.name;
        state.terms = cust.credit.terms;
        panel.querySelector('#oe-customer-name').value = cust.name;
        panel.querySelector('#oe-terms').value = cust.credit.terms;
        const shipToSel = panel.querySelector('#oe-ship-to');
        shipToSel.innerHTML = cust.shipTos.map(s => `<option value="${s.code}">${s.code} — ${escapeHtml(s.name)}</option>`).join('');
        setStatusMessage('Customer loaded: ' + cust.name);
      } else if (val) {
        panel.querySelector('#oe-customer-name').value = '';
        showModal('Customer Not Found', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>Customer <b>' + escapeHtml(val) + '</b> not found in the system. Use F3 to search.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
      }
    });

    // Add line
    panel.querySelector('#oe-add-line').addEventListener('click', () => {
      addOrderLine(panel, state, tabId);
    });

    // Clear
    panel.querySelector('#oe-clear').addEventListener('click', () => {
      state.lines = [];
      state.nextLine = 1;
      refreshOrderGrid(panel, state, tabId);
    });

    // Print preview
    panel.querySelector('#oe-print-preview').addEventListener('click', () => {
      showModal('Print Preview', '<i class="fa-solid fa-print modal-icon-large info"></i>Print preview is not available in this session.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'info');
    });

    // Save draft
    panel.querySelector('#oe-save-draft').addEventListener('click', () => {
      if (!state.customerId) {
        showModal('Validation Error', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>Customer # is required.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
        return;
      }
      setStatusMessage('Saving draft...');
      setTimeout(() => {
        showModal('Draft Saved', '<i class="fa-solid fa-check-circle modal-icon-large success"></i>' + (isQuote ? 'Quote' : 'Order') + ' <b>' + state.orderNum + '</b> saved as draft.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'success');
        setStatusMessage('Draft saved');
      }, 400);
    });

    // Submit/Convert
    const submitBtn = panel.querySelector('#oe-submit') || panel.querySelector('#oe-convert');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!state.customerId) {
          showModal('Validation Error', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>Customer # is required.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
          return;
        }
        if (state.lines.length === 0) {
          showModal('Validation Error', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>Order must have at least one line item.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
          return;
        }
        if (!panel.querySelector('#oe-po').value.trim()) {
          showModal('Validation Error', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>PO # is required.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
          return;
        }

        // Credit check
        const cust = window.BACKFEED_DATA.customers.find(c => c.id === state.customerId);
        if (cust && !isQuote) {
          const orderTotal = calcOrderTotal(state);
          if (cust.credit.status === 'Hold') {
            showModal('CREDIT HOLD', '<i class="fa-solid fa-hand modal-icon-large error"></i><b>CREDIT HOLD — Order Blocked</b><br><br>Customer <b>' + escapeHtml(cust.name) + '</b> (' + cust.id + ') is on credit hold.<br><br>Balance: ' + formatCurrency(cust.credit.balance) + '<br>Limit: ' + formatCurrency(cust.credit.limit) + '<br>Available: ' + formatCurrency(cust.credit.available) + '<br><br>Contact Credit Manager at <b>ext. 204</b> for authorization.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
            return;
          }
          if (orderTotal > cust.credit.available) {
            showModal('Credit Limit Exceeded', '<i class="fa-solid fa-triangle-exclamation modal-icon-large warning"></i><b>Credit limit will be exceeded.</b><br><br>Order Total: ' + formatCurrency(orderTotal) + '<br>Available Credit: ' + formatCurrency(cust.credit.available) + '<br>Over by: ' + formatCurrency(orderTotal - cust.credit.available) + '<br><br>Contact Credit Manager at <b>ext. 204</b> to approve.', [
              { label: 'Place on Hold', className: 'modal-btn', action: () => {
                closeModal();
                showModal('Order Held', '<i class="fa-solid fa-clock modal-icon-large warning"></i>Order <b>' + state.orderNum + '</b> placed on credit hold pending approval.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'warning');
              }},
              { label: 'Cancel', className: 'modal-btn', action: closeModal }
            ], 'warning');
            return;
          }

          // Check for backorder items (scenario 4)
          if (scenarioId === 4) {
            const strutLine = state.lines.find(l => l.sku === 'CON-STRUT');
            if (strutLine) {
              const product = window.BACKFEED_DATA.products.find(p => p.sku === 'CON-STRUT');
              const totalAvail = product ? product.warehouses.reduce((s, w) => s + w.qtyAvailable, 0) : 0;
              if (strutLine.qty > totalAvail) {
                const boQty = strutLine.qty - totalAvail;
                showModal('Backorder Created', '<i class="fa-solid fa-boxes-stacked modal-icon-large warning"></i><b>Backorder Required</b><br><br>SKU: <b>CON-STRUT</b> — Strut Channel<br>Ordered: ' + strutLine.qty + '<br>Available: ' + totalAvail + '<br>Backorder: <b>' + boQty + '</b><br><br>Notify customer?', [
                  { label: 'Yes', className: 'modal-btn primary', action: () => { closeModal(); submitOrderFinal(state, panel); }},
                  { label: 'No', className: 'modal-btn', action: () => { closeModal(); submitOrderFinal(state, panel); }}
                ], 'warning');
                return;
              }
            }
          }

          // Check for price override (scenario 5)
          if (scenarioId === 5) {
            showModal('Price Override Required', '<i class="fa-solid fa-lock modal-icon-large warning"></i><b>Price override requires authorization.</b><br><br>Enter manager authorization code to apply special pricing on this order.<br><br><input type="password" class="form-control" id="auth-code-input" placeholder="Auth Code" style="width:200px;margin-top:8px;">', [
              { label: 'Authorize', className: 'modal-btn primary', action: () => {
                const code = document.getElementById('auth-code-input')?.value;
                if (code) {
                  closeModal();
                  submitOrderFinal(state, panel);
                } else {
                  showModal('Error', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i>Invalid authorization code.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
                }
              }},
              { label: 'Cancel', className: 'modal-btn', action: closeModal }
            ], 'warning');
            return;
          }
        }

        submitOrderFinal(state, panel);
      });
    }

    // Pre-populate lines for scenarios
    if (scenario && scenario.lines && !isConvert) {
      const lines = window.SCENARIO_ENGINE.getScenarioLines(scenarioId);
      lines.forEach(line => {
        state.lines.push({
          lineNum: state.nextLine++,
          sku: line.sku,
          desc: line.desc,
          qty: line.qty,
          uom: line.uom,
          listPrice: line.listPrice,
          mult: line.mult,
          netPrice: line.netPrice,
          extended: line.extended,
          warehouse: line.shipTo ? '' : state.warehouse,
          status: 'Open'
        });
      });
    }

    refreshOrderGrid(panel, state, tabId);

    // Bind Order Type and Vendor dropdowns
    const orderTypeSel = panel.querySelector('#oe-order-type');
    const vendorSel = panel.querySelector('#oe-vendor');
    const vendorGrp = panel.querySelector('#oe-vendor-group');
    
    if (orderTypeSel) {
      orderTypeSel.addEventListener('change', (e) => {
        state.routingType = e.target.value;
        if (state.routingType === 'direct') {
          if (vendorGrp) vendorGrp.style.display = 'block';
          state.vendor = vendorSel ? vendorSel.value : 'VNDR-824';
        } else {
          if (vendorGrp) vendorGrp.style.display = 'none';
          state.vendor = '';
        }
        setStatusMessage('Order type changed to: ' + e.target.value);
      });
    }
    
    if (vendorSel) {
      vendorSel.addEventListener('change', (e) => {
        state.vendor = e.target.value;
        setStatusMessage('Vendor changed to: ' + e.target.value);
      });
    }

    // Record locked simulation for scenario 2
    if (scenarioId === 2) {
      setTimeout(() => {
        showModal('Record Locked', '<i class="fa-solid fa-lock modal-icon-large warning"></i><b>Record locked by user DRUSSON on Terminal 2</b><br><br>Customer <b>C-1007 — Atlantic City Electric Svcs</b> is currently being edited by another user.<br><br>You may view the record in read-only mode or try again later.', [
          { label: 'View Read-Only', className: 'modal-btn primary', action: closeModal },
          { label: 'Retry', className: 'modal-btn', action: closeModal }
        ], 'warning');
      }, 3000);
    }
  }

  function submitOrderFinal(state, panel) {
    setStatusMessage('Submitting...');
    
    // Prepare the order payload for the shared server state
    const orderData = {
      orderId: state.orderNum,
      company: state.customerName || 'Unknown Customer',
      items: state.lines.map(l => `${l.qty} ${l.uom} of ${l.sku}`).join(', '),
      price: calcOrderTotal(state),
      status: state.mode === 'quote' ? 'Quote' : 'Processing',
      po: state.po || 'PO-ONLINE',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    fetch('/api/erp/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'new_order',
        data: orderData
      })
    })
    .then(res => res.json())
    .then(result => {
      console.log('Order registered on server:', result);
    })
    .catch(err => {
      console.error('Error registering order on server:', err);
    });

    setTimeout(() => {
      showModal('Order Submitted', '<i class="fa-solid fa-check-circle modal-icon-large success"></i>' +
        (state.mode === 'quote' ? 'Quote' : 'Order') + ' <b>' + state.orderNum + '</b> has been submitted successfully.' +
        '<br><br>Customer: ' + escapeHtml(state.customerName) +
        '<br>Total: ' + formatCurrency(calcOrderTotal(state)) +
        '<br>Lines: ' + state.lines.length,
        [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'success');
      setStatusMessage((state.mode === 'quote' ? 'Quote submitted: ' : 'Order submitted: ') + state.orderNum);
    }, 600);
  }

  function addOrderLine(panel, state, tabId) {
    state.lines.push({
      lineNum: state.nextLine++,
      sku: '',
      desc: '',
      qty: 0,
      uom: 'EA',
      listPrice: 0,
      mult: 1.00,
      netPrice: 0,
      extended: 0,
      warehouse: state.warehouse,
      status: 'Open'
    });
    refreshOrderGrid(panel, state, tabId);

    // Focus the new SKU field
    setTimeout(() => {
      const lastSkuInput = panel.querySelector('#oe-lines-body tr:last-child .sku-input');
      if (lastSkuInput) lastSkuInput.focus();
    }, 50);
  }

  function refreshOrderGrid(panel, state, tabId) {
    const tbody = panel.querySelector('#oe-lines-body');
    if (!tbody) return;

    tbody.innerHTML = state.lines.map((line, idx) => `
      <tr data-line-idx="${idx}">
        <td class="center">${line.lineNum}</td>
        <td><input type="text" class="inline-input sku-input" value="${escapeHtml(line.sku)}" data-idx="${idx}" placeholder="Enter SKU..." style="width:100px;"></td>
        <td style="font-family:var(--font-primary);max-width:200px;">${escapeHtml(line.desc)}</td>
        <td><input type="number" class="inline-input qty-input" value="${line.qty || ''}" data-idx="${idx}" min="0" style="width:50px;text-align:right;"></td>
        <td class="center">${escapeHtml(line.uom)}</td>
        <td class="numeric">${line.listPrice ? formatCurrency(line.listPrice) : ''}</td>
        <td class="numeric">${line.mult ? line.mult.toFixed(2) : ''}</td>
        <td class="numeric">${line.netPrice ? formatCurrency(line.netPrice) : ''}</td>
        <td class="numeric" style="font-weight:600;">${line.extended ? formatCurrency(line.extended) : ''}</td>
        <td class="center">${escapeHtml(line.warehouse)}</td>
        <td><span class="status-badge open">${line.status}</span></td>
        <td class="center"><button class="btn-small" style="color:#c62828;border:none;background:none;cursor:pointer;" data-remove="${idx}" title="Remove"><i class="fa-solid fa-trash-can"></i></button></td>
      </tr>
    `).join('');

    // Bind SKU inputs
    tbody.querySelectorAll('.sku-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        const skuVal = e.target.value.trim().toUpperCase();
        e.target.value = skuVal;
        const line = state.lines[idx];
        line.sku = skuVal;

        const product = window.BACKFEED_DATA.products.find(p => p.sku === skuVal);
        if (product) {
          line.desc = product.desc;
          line.uom = product.uom;
          line.listPrice = product.listPrice;
          line.mult = product.mult;
          line.netPrice = product.netPrice;
          line.extended = parseFloat((line.qty * line.netPrice).toFixed(2));
          refreshOrderGrid(panel, state, tabId);
          setStatusMessage('SKU found: ' + product.desc);
          // Focus qty field
          setTimeout(() => {
            const qtyInput = tbody.querySelector('.qty-input[data-idx="' + idx + '"]');
            if (qtyInput) qtyInput.focus();
          }, 50);
        } else if (skuVal) {
          line.desc = '';
          line.uom = 'EA';
          line.listPrice = 0;
          line.mult = 1;
          line.netPrice = 0;
          line.extended = 0;
          refreshOrderGrid(panel, state, tabId);
          showModal('SKU Not Found', '<i class="fa-solid fa-circle-xmark modal-icon-large error"></i><b>SKU NOT FOUND</b><br><br>SKU <b>' + escapeHtml(skuVal) + '</b> is not in the product catalog.<br><br>Verify the SKU and try again, or use inventory search to look up the correct SKU.', [{ label: 'OK', className: 'modal-btn primary', action: closeModal }], 'error');
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          const idx = parseInt(e.target.dataset.idx);
          const skuVal = e.target.value.trim().toUpperCase();
          if (skuVal && !state.lines[idx].desc) {
            e.target.dispatchEvent(new Event('change'));
          }
        }
      });
    });

    // Bind qty inputs
    tbody.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        const qty = parseInt(e.target.value) || 0;
        state.lines[idx].qty = qty;
        state.lines[idx].extended = parseFloat((qty * state.lines[idx].netPrice).toFixed(2));
        refreshOrderGrid(panel, state, tabId);
      });
    });

    // Bind remove buttons
    tbody.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.remove);
        state.lines.splice(idx, 1);
        state.lines.forEach((l, i) => l.lineNum = i + 1);
        refreshOrderGrid(panel, state, tabId);
      });
    });

    updateOrderTotals(panel, state);
  }

  function updateOrderTotals(panel, state) {
    const subtotal = state.lines.reduce((s, l) => s + (l.extended || 0), 0);
    const tax = subtotal * 0.07;
    const freight = 0;
    const total = subtotal + tax + freight;

    const subEl = panel.querySelector('#oe-subtotal');
    const taxEl = panel.querySelector('#oe-tax');
    const freightEl = panel.querySelector('#oe-freight');
    const totalEl = panel.querySelector('#oe-total');

    if (subEl) subEl.textContent = formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (freightEl) freightEl.textContent = formatCurrency(freight);
    if (totalEl) totalEl.textContent = formatCurrency(total);
  }

  function calcOrderTotal(state) {
    const subtotal = state.lines.reduce((s, l) => s + (l.extended || 0), 0);
    return subtotal * 1.07;
  }

  /* ----------------------------------------------------------
     SCREEN: INVENTORY INQUIRY
  ---------------------------------------------------------- */
  function renderInventoryInquiry(panel, data) {
    const searchSku = data?.searchSku || '';
    const products = window.BACKFEED_DATA.products;
    const categories = [...new Set(products.map(p => p.category))].sort();
    const warehouses = window.BACKFEED_DATA.warehouses;

    panel.innerHTML = `
      <div class="search-container">
        <div class="form-section-title"><i class="fa-solid fa-warehouse"></i> Inventory Inquiry</div>
        <div class="search-form">
          <div class="form-group">
            <label>SKU</label>
            <input type="text" class="form-control" id="inv-search-sku" style="width:120px;" value="${escapeHtml(searchSku)}">
          </div>
          <div class="form-group">
            <label>Description</label>
            <input type="text" class="form-control" id="inv-search-desc" style="width:200px;">
          </div>
          <div class="form-group">
            <label>Category</label>
            <select class="form-control" id="inv-search-cat" style="width:140px;">
              <option value="">All Categories</option>
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Warehouse</label>
            <select class="form-control" id="inv-search-wh" style="width:120px;">
              <option value="">All</option>
              ${warehouses.map(w => `<option value="${w.code}">${w.code} — ${w.name}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" id="inv-search-btn"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
          <button class="btn" id="inv-clear-btn">Clear</button>
        </div>
        <div class="search-results-info" id="inv-results-info"></div>
        <div class="search-results" style="flex:1;display:flex;flex-direction:column;">
          <div class="data-grid-container" id="inv-results-grid" style="flex:1;"></div>
          <div id="inv-detail-area"></div>
        </div>
      </div>
    `;

    const doSearch = () => {
      const sku = panel.querySelector('#inv-search-sku').value.trim().toUpperCase();
      const desc = panel.querySelector('#inv-search-desc').value.trim().toLowerCase();
      const cat = panel.querySelector('#inv-search-cat').value;
      const wh = panel.querySelector('#inv-search-wh').value;

      let results = products;
      if (sku) results = results.filter(p => p.sku.includes(sku));
      if (desc) results = results.filter(p => p.desc.toLowerCase().includes(desc));
      if (cat) results = results.filter(p => p.category === cat);
      if (wh) results = results.filter(p => p.warehouses.some(w => w.code === wh));

      renderInventoryResults(panel, results, wh);
    };

    panel.querySelector('#inv-search-btn').addEventListener('click', doSearch);
    panel.querySelector('#inv-clear-btn').addEventListener('click', () => {
      panel.querySelectorAll('.search-form input').forEach(i => i.value = '');
      panel.querySelectorAll('.search-form select').forEach(s => s.selectedIndex = 0);
      panel.querySelector('#inv-results-grid').innerHTML = '';
      panel.querySelector('#inv-results-info').textContent = '';
      panel.querySelector('#inv-detail-area').innerHTML = '';
    });

    panel.querySelectorAll('.search-form input').forEach(input => {
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    });

    if (searchSku) setTimeout(doSearch, 100);
  }

  function renderInventoryResults(panel, results, whFilter) {
    const info = panel.querySelector('#inv-results-info');
    const grid = panel.querySelector('#inv-results-grid');
    const detail = panel.querySelector('#inv-detail-area');

    info.textContent = results.length + ' item(s) found';
    detail.innerHTML = '';

    grid.innerHTML = `
      <table class="data-grid">
        <thead>
          <tr>
            <th class="sortable">SKU <span class="sort-arrow">▼</span></th>
            <th class="sortable">Description <span class="sort-arrow">▼</span></th>
            <th>UOM</th>
            <th>Category</th>
            <th class="numeric">On Hand</th>
            <th class="numeric">Committed</th>
            <th class="numeric">Available</th>
            <th>Bin</th>
            <th>Last Received</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(p => {
            const whs = whFilter ? p.warehouses.filter(w => w.code === whFilter) : p.warehouses;
            return whs.map(w => `
              <tr class="inv-row" data-sku="${p.sku}">
                <td>${escapeHtml(p.sku)}</td>
                <td style="font-family:var(--font-primary);">${escapeHtml(p.desc)}</td>
                <td class="center">${escapeHtml(p.uom)}</td>
                <td>${escapeHtml(p.category)}</td>
                <td class="numeric">${w.qtyOnHand.toLocaleString()}</td>
                <td class="numeric">${w.qtyCommitted.toLocaleString()}</td>
                <td class="numeric" style="font-weight:600;${w.qtyAvailable < 100 ? 'color:#c62828;' : ''}">${w.qtyAvailable.toLocaleString()}</td>
                <td>${escapeHtml(w.bin)}</td>
                <td>${escapeHtml(w.lastReceived)}</td>
              </tr>
            `).join('');
          }).join('')}
        </tbody>
      </table>
    `;

    grid.querySelectorAll('.inv-row').forEach(row => {
      row.addEventListener('click', () => {
        grid.querySelectorAll('.inv-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        showInventoryDetail(panel, row.dataset.sku);
      });
    });
  }

  function showInventoryDetail(panel, sku) {
    const product = window.BACKFEED_DATA.products.find(p => p.sku === sku);
    if (!product) return;

    const detail = panel.querySelector('#inv-detail-area');
    detail.innerHTML = `
      <div class="inventory-detail-panel">
        <h4><i class="fa-solid fa-boxes-stacked"></i> ${escapeHtml(product.sku)} — ${escapeHtml(product.desc)}</h4>
        <div style="display:flex;gap:16px;margin-bottom:8px;font-size:11px;">
          <span><b>Category:</b> ${product.category}</span>
          <span><b>UOM:</b> ${product.uom}</span>
          <span><b>List Price:</b> ${formatCurrency(product.listPrice)}</span>
          <span><b>Mult:</b> ${product.mult.toFixed(2)}</span>
          <span><b>Net Price:</b> ${formatCurrency(product.netPrice)}</span>
          <span><b>Last Updated:</b> ${product.lastUpdated}</span>
        </div>
        <div class="warehouse-grid">
          ${product.warehouses.map(w => {
            const whInfo = window.BACKFEED_DATA.warehouses.find(wh => wh.code === w.code);
            return `
              <div class="warehouse-card">
                <div class="wh-name">${w.code} — ${whInfo?.name || ''}</div>
                <div class="wh-row"><span class="wh-label">On Hand:</span><span class="wh-value">${w.qtyOnHand.toLocaleString()}</span></div>
                <div class="wh-row"><span class="wh-label">Committed:</span><span class="wh-value">${w.qtyCommitted.toLocaleString()}</span></div>
                <div class="wh-row"><span class="wh-label">Available:</span><span class="wh-value" style="${w.qtyAvailable < 100 ? 'color:#c62828;' : 'color:#2e7d32;'}">${w.qtyAvailable.toLocaleString()}</span></div>
                <div class="wh-row"><span class="wh-label">Bin:</span><span class="wh-value">${w.bin}</span></div>
                <div class="wh-row"><span class="wh-label">Last Recv:</span><span class="wh-value">${w.lastReceived}</span></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------------
     SCREEN: PRICE LOOKUP
  ---------------------------------------------------------- */
  function renderPriceLookup(panel) {
    const products = window.BACKFEED_DATA.products;

    panel.innerHTML = `
      <div class="search-container">
        <div class="form-section-title"><i class="fa-solid fa-dollar-sign"></i> Price Lookup</div>
        <div class="stale-warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span><b>Notice:</b> Prices are from the static price book. No live commodity feed available. Last full update: <b>May 20, 2026</b>. Prices may not reflect current market conditions.</span>
        </div>
        <div class="search-form">
          <div class="form-group">
            <label>SKU</label>
            <input type="text" class="form-control" id="price-search-sku" style="width:140px;">
          </div>
          <div class="form-group">
            <label>Description</label>
            <input type="text" class="form-control" id="price-search-desc" style="width:240px;">
          </div>
          <button class="btn btn-primary" id="price-search-btn"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
          <button class="btn" id="price-show-all">Show All</button>
        </div>
        <div class="search-results-info" id="price-results-info"></div>
        <div class="search-results">
          <div class="data-grid-container" id="price-results-grid"></div>
        </div>
      </div>
    `;

    const doSearch = () => {
      const sku = panel.querySelector('#price-search-sku').value.trim().toUpperCase();
      const desc = panel.querySelector('#price-search-desc').value.trim().toLowerCase();

      let results = products;
      if (sku) results = results.filter(p => p.sku.includes(sku));
      if (desc) results = results.filter(p => p.desc.toLowerCase().includes(desc));

      renderPriceResults(panel, results);
    };

    panel.querySelector('#price-search-btn').addEventListener('click', doSearch);
    panel.querySelector('#price-show-all').addEventListener('click', () => renderPriceResults(panel, products));

    panel.querySelectorAll('.search-form input').forEach(input => {
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
    });
  }

  function renderPriceResults(panel, results) {
    const info = panel.querySelector('#price-results-info');
    const grid = panel.querySelector('#price-results-grid');

    info.textContent = results.length + ' item(s)';

    grid.innerHTML = `
      <table class="data-grid">
        <thead>
          <tr>
            <th class="sortable">SKU <span class="sort-arrow">▼</span></th>
            <th class="sortable">Description <span class="sort-arrow">▼</span></th>
            <th>UOM</th>
            <th>Category</th>
            <th class="numeric">List Price</th>
            <th class="numeric">Multiplier</th>
            <th class="numeric">Net Price</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(p => {
            const stale = isStale(p.lastUpdated);
            return `
              <tr>
                <td>${escapeHtml(p.sku)}</td>
                <td style="font-family:var(--font-primary);">${escapeHtml(p.desc)}</td>
                <td class="center">${escapeHtml(p.uom)}</td>
                <td>${escapeHtml(p.category)}</td>
                <td class="numeric">${formatCurrency(p.listPrice)}</td>
                <td class="numeric">${p.mult.toFixed(2)}</td>
                <td class="numeric" style="font-weight:600;">${formatCurrency(p.netPrice)}</td>
                <td style="${stale ? 'color:#c62828;font-weight:600;' : ''}">${escapeHtml(p.lastUpdated)}${stale ? ' ⚠' : ''}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  function isStale(dateStr) {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = (now - d) / (1000 * 60 * 60 * 24);
    return diffDays > 14;
  }

  /* ----------------------------------------------------------
     UTILITY FUNCTIONS
  ---------------------------------------------------------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatCurrency(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }


  // Typing simulation helpers
  function typeValue(inputElement, value, callback) {
    if (!inputElement) {
      if (callback) callback();
      return;
    }
    let index = 0;
    inputElement.value = '';
    inputElement.focus();
    
    function nextChar() {
      if (index < value.length) {
        inputElement.value += value.charAt(index);
        index++;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        setTimeout(nextChar, 50); // 50ms character typing delay
      } else {
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        if (callback) callback();
      }
    }
    nextChar();
  }

  function selectDropdownValue(selectElement, value, callback) {
    if (!selectElement) {
      if (callback) callback();
      return;
    }
    selectElement.focus();
    setTimeout(() => {
      selectElement.value = value;
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      if (callback) callback();
    }, 400);
  }

  // Visual Order Entry Sequencer
  function startVisualOrderEntry(payload) {
    APP.visualOrderEntryActive = true;
    const isQuote = payload.isQuote;
    const customerId = payload.customerId || 'C-1001';
    const po = payload.po || 'PO-AUTO-9104';
    const routingType = payload.routingType || 'stock'; // 'stock' or 'direct'
    const items = payload.items || [];
    
    const mode = isQuote ? 'quote' : 'order';
    const tabTitle = isQuote ? 'Quote Entry — Autopilot' : 'Order Entry — Autopilot';
    
    // Determine scenario ID if applicable
    let scenarioId = null;
    if (po.includes('S3') || po.includes('Scenario 3')) scenarioId = 3;
    else if (po.includes('S4') || po.includes('Scenario 4')) scenarioId = 4;
    else if (po.includes('S5') || po.includes('Scenario 5') || po.includes('Override') || po.includes('Audit')) scenarioId = 5;

    // Open clean order entry screen
    const tabId = openTab('order-entry', tabTitle, renderOrderEntry, { 
      mode, 
      scenarioId,
      customerId,
      routingType
    });
    
    setTimeout(() => {
      const activeTab = APP.tabs.find(t => t.id === tabId);
      const panel = activeTab ? document.getElementById(activeTab.id + '-panel') : null;
      if (!panel) return;
      
      const orderTypeSel = panel.querySelector('#oe-order-type');
      const vendorSel = panel.querySelector('#oe-vendor');
      const customerIdSel = panel.querySelector('#oe-customer-id');
      const poInput = panel.querySelector('#oe-po');
      const addLineBtn = panel.querySelector('#oe-add-line');
      const submitBtn = panel.querySelector('#oe-submit') || panel.querySelector('#oe-convert');
      
      // Step 1: Select Order Type
      selectDropdownValue(orderTypeSel, routingType, () => {
        if (!APP.visualOrderEntryActive) return;
        
        // Step 2: Select Vendor if direct
        const nextStep = () => {
          if (!APP.visualOrderEntryActive) return;
          
          // Step 3: Select Customer
          selectDropdownValue(customerIdSel, customerId, () => {
            if (!APP.visualOrderEntryActive) return;
            
            // Step 4: Type PO #
            typeValue(poInput, po, () => {
              if (!APP.visualOrderEntryActive) return;
              
              // Step 5: Type Items
              let itemIndex = 0;
              function enterNextItem() {
                if (!APP.visualOrderEntryActive) return;
                
                if (itemIndex < items.length) {
                  const item = items[itemIndex];
                  addLineBtn.click();
                  
                  setTimeout(() => {
                    if (!APP.visualOrderEntryActive) return;
                    
                    const rows = panel.querySelectorAll('#oe-lines-body tr');
                    const lastRow = rows[rows.length - 1];
                    const skuInput = lastRow.querySelector('.sku-input');
                    const qtyInput = lastRow.querySelector('.qty-input');
                    
                    typeValue(skuInput, item.sku, () => {
                      if (!APP.visualOrderEntryActive) return;
                      
                      setTimeout(() => {
                        if (!APP.visualOrderEntryActive) return;
                        
                        typeValue(qtyInput, String(item.qty), () => {
                          itemIndex++;
                          setTimeout(enterNextItem, 500);
                        });
                      }, 500);
                    });
                  }, 200);
                } else {
                  // Step 6: Submit Order
                  setStatusMessage('Autopilot: Submitting transaction to ledger...');
                  setTimeout(() => {
                    if (!APP.visualOrderEntryActive) return; // Blocked by HITL
                    
                    if (submitBtn) {
                      submitBtn.focus();
                      submitBtn.classList.add('active');
                      setTimeout(() => {
                        submitBtn.click();
                        
                        // If not blocked by a modal dialog, finish
                        setTimeout(() => {
                          const overlay = document.getElementById('modal-overlay');
                          if (overlay && overlay.classList.contains('hidden')) {
                            setStatusMessage('Autopilot completed order successfully.');
                            APP.visualOrderEntryActive = false;
                          }
                        }, 200);
                      }, 500);
                    }
                  }, 500);
                }
              }
              
              enterNextItem();
            });
          });
        };
        
        if (routingType === 'direct') {
          // Select VNDR-824 or map based on SKU
          let selectedVendor = 'VNDR-824';
          if (items.length > 0) {
            const firstSku = items[0].sku;
            if (firstSku.includes('STRUT') || firstSku.includes('TITAN')) {
              selectedVendor = 'VNDR-711';
            } else if (firstSku.includes('PVC') || firstSku.includes('DURA')) {
              selectedVendor = 'VNDR-310';
            }
          }
          selectDropdownValue(vendorSel, selectedVendor, nextStep);
        } else {
          nextStep();
        }
      });
    }, 800);
  }

})();
