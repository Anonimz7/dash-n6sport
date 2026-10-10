/**
 * N6 shared UI — Header / Topbar
 *
 * Komponen header terpusat untuk semua tier. Menggantikan duplikat
 * markup header yang sebelumnya tersebar di js/views/<role>.js.
 *
 * Kompatibel classic-script (IIFE): menempel ke window.N6UI.
 *
 * Penggunaan:
 *   N6UI.renderHeader(document.getElementById('topbar'), {
 *     title: 'Dashboard',
 *     onMenu: () => N6UI.openSidebar(),
 *     actions: '<button ...>...</button>', // HTML tambahan opsional
 *   });
 */

(function () {
  window.N6UI = window.N6UI || {};

  var MENU_SVG =
    '<svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20">' +
    '<path d="M3 6h18M3 12h18M3 18h18"></path></svg>';

  /**
   * Render header ke elemen mount.
   * @param {HTMLElement} mount  elemen <header class="topbar">
   * @param {Object} cfg  {title, subtitle, onMenu, actions}
   */
  function renderHeader(mount, cfg) {
    if (!mount) return;
    cfg = cfg || {};

    var html = '';
    html += '<button class="topbar-menu" id="sidebarToggle" aria-label="Buka menu">' + MENU_SVG + '</button>';
    html += '<div class="topbar-title"><b>' + escapeHtml(cfg.title || '') + '</b>';
    if (cfg.subtitle) html += '<span>' + escapeHtml(cfg.subtitle) + '</span>';
    html += '</div>';
    html += '<div class="topbar-actions">' + (cfg.actions || '') + '</div>';

    mount.innerHTML = html;
    mount.classList.add('topbar');

    var toggle = mount.querySelector('#sidebarToggle');
    if (toggle) {
      var onMenu = typeof cfg.onMenu === 'function' ? cfg.onMenu : function () {
        if (window.N6UI && window.N6UI.openSidebar) window.N6UI.openSidebar();
      };
      toggle.addEventListener('click', onMenu);
    }
  }

  /** Update judul header tanpa render ulang. */
  function setHeaderTitle(title, subtitle) {
    var t = document.querySelector('.topbar .topbar-title b');
    var s = document.querySelector('.topbar .topbar-title span');
    if (t && title !== undefined) t.textContent = title;
    if (s && subtitle !== undefined) s.textContent = subtitle;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  window.N6UI.renderHeader = renderHeader;
  window.N6UI.setHeaderTitle = setHeaderTitle;
})();
