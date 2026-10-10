/**
 * N6 shared UI — Sidebar
 *
 * Komponen sidebar terpusat untuk semua tier. Menggantikan duplikat
 * openSidebar/closeSidebar/switchPanel yang sebelumnya ada di setiap
 * js/modules/<role>/bootstrap.js dan markup nav di js/views/<role>.js.
 *
 * Kompatibel classic-script (IIFE): menempel ke window.N6UI.
 * Tidak memakai ES import agar bisa digabung via tools/build.sh.
 *
 * Penggunaan:
 *   N6UI.renderSidebar(document.getElementById('sidebar'), {
 *     brand: { title: 'NUMBER SIX', subtitle: 'Owner · All Akses' },
 *     menus: N6_MENUS.owner,   // [{id, label, svg, badge}]
 *     active: 'home',
 *     onSelect: (id) => switchPanel(id),
 *   });
 *   N6UI.bindSidebar(); // pasang open/close overlay + tombol
 */

(function () {
  window.N6UI = window.N6UI || {};

  var LOGO_HTML =
    '<div class="brand-logo">' +
    '<img alt="Logo NUMBER SIX" class="logo-white" src="assets/img/logo-white.png"/>' +
    '<img alt="Logo NUMBER SIX" class="logo-black" src="assets/img/logo-black.png"/>' +
    '</div>';

  var CLOSE_SVG =
    '<svg fill="none" height="18" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="18">' +
    '<path d="M18 6L6 18M6 6l12 12"></path></svg>';

  /**
   * Render sidebar ke elemen mount.
   * @param {HTMLElement} mount  elemen <aside class="sidebar">
   * @param {Object} cfg  {brand:{title,subtitle}, menus:[{id,label,svg,badge}], active, onSelect}
   */
  function renderSidebar(mount, cfg) {
    if (!mount || !cfg) return;
    cfg = cfg || {};
    var brand = cfg.brand || {};
    var menus = cfg.menus || [];
    var active = cfg.active || (menus[0] && menus[0].id) || '';
    var onSelect = typeof cfg.onSelect === 'function' ? cfg.onSelect : function () {};

    var html = '';
    html += '<div class="side-brand">';
    html += LOGO_HTML;
    html += '<div class="txt"><b>' + escapeHtml(brand.title || 'NUMBER SIX') + '</b>' +
            '<span>' + escapeHtml(brand.subtitle || '') + '</span></div>';
    html += '<button aria-label="Tutup menu" class="sidebar-close" id="sidebarClose">' + CLOSE_SVG + '</button>';
    html += '</div>';
    html += '<nav class="side-nav" id="sideNav">';

    menus.forEach(function (m) {
      var cls = m.id === active ? ' class="active"' : '';
      html += '<button' + cls + ' data-panel="' + escapeAttr(m.id) + '">';
      if (m.svg) html += m.svg;
      html += escapeHtml(m.label || m.id);
      if (m.badge) {
        html += ' <span class="nav-dot" id="navDot' + capitalize(m.id) + '" hidden></span>';
      }
      html += '</button>';
    });

    html += '</nav>';
    mount.innerHTML = html;

    // wire klik -> onSelect + toggle active
    var buttons = mount.querySelectorAll('.side-nav button[data-panel]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        onSelect(btn.getAttribute('data-panel'));
        closeSidebar();
      });
    });

    // wire tombol close
    var closeBtn = mount.querySelector('#sidebarClose');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  }

  /** Tandai menu aktif tanpa render ulang. */
  function setActive(panelId) {
    document.querySelectorAll('.side-nav button[data-panel]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-panel') === panelId);
    });
    document.querySelectorAll('.bottom-nav button[data-panel]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-panel') === panelId);
    });
  }

  function openSidebar() {
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('sidebarOverlay');
    if (sb) sb.classList.add('open');
    if (ov) ov.classList.add('show');
  }

  function closeSidebar() {
    var sb = document.getElementById('sidebar');
    var ov = document.getElementById('sidebarOverlay');
    if (sb) sb.classList.remove('open');
    if (ov) ov.classList.remove('show');
  }

  /** Pasang handler overlay + tombol hamburger global (id: sidebarToggle). */
  function bindSidebar() {
    var ov = document.getElementById('sidebarOverlay');
    if (ov && !ov.dataset.n6bound) {
      ov.dataset.n6bound = '1';
      ov.addEventListener('click', closeSidebar);
    }
    document.querySelectorAll('#sidebarToggle').forEach(function (t) {
      if (!t.dataset.n6bound) {
        t.dataset.n6bound = '1';
        t.addEventListener('click', openSidebar);
      }
    });
    // expose global agar onclick="..." lama tetap jalan
    window.openSidebar = openSidebar;
    window.closeSidebar = closeSidebar;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }
  function capitalize(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1); }

  window.N6UI.renderSidebar = renderSidebar;
  window.N6UI.setSidebarActive = setActive;
  window.N6UI.openSidebar = openSidebar;
  window.N6UI.closeSidebar = closeSidebar;
  window.N6UI.bindSidebar = bindSidebar;
})();
