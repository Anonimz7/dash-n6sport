/**
 * N6 - generated asset manifest
 *
 * GENERATED FILE - do not edit by hand.
 *
 * MANUAL ADDENDUM: 'js/account-ui.js' (Kelola Anggota & Ganti Password)
 * ditambahkan ke tiap role di bawah; tidak menyentuh bundle dist/.
 * Rebuilt by tools/build.ps1 from css/<role>/ORDER.txt and the contents of
 * js/modules/<role>/. Keeping the order here is what guarantees that the
 * split application renders exactly like the five original single files.
 */

export const ROLE_ASSETS = {
  owner : {
    css: ['css/shared/tokens.css', 'css/shared/base.css', 'css/shared/layout.css', 'css/shared/ui.css', 'css/owner/modules/harga.css', 'css/owner/modules/tiket.css', 'css/owner/modules/pesan.css', 'css/owner/modules/jadwal.css', 'css/owner/components.css', 'css/owner/themes.css', 'css/owner/modules/extras.css', 'css/owner/polish/password-field.css', 'css/owner/polish/quick-actions.css', 'css/owner/polish/analytics-controls.css', 'css/owner/polish/coach-requests.css', 'css/owner/polish/report-tools.css'],
    scripts: ['js/shared/ui/namespace.js', 'js/shared/menus.js', 'js/dist/owner.js', 'js/modules/owner/theme.js', 'js/modules/owner/api-config.js', 'js/modules/owner/kpi-limits.js', 'js/shared/coach-requests.js', 'js/shared/n6-monthly-pdf-reports.js', 'js/account-ui.js'],
  },
  admin : {
    css: ['css/shared/tokens.css', 'css/shared/base.css', 'css/shared/layout.css', 'css/shared/ui.css', 'css/admin/modules/harga.css', 'css/admin/modules/tiket.css', 'css/admin/modules/pesan.css', 'css/admin/modules/jadwal.css', 'css/admin/components.css', 'css/admin/themes.css', 'css/admin/polish/sidebar-brand.css', 'css/admin/polish/coach-requests.css', 'css/admin/polish/report-tools.css'],
    scripts: ['js/shared/ui/namespace.js', 'js/shared/menus.js', 'js/dist/admin.js', 'js/modules/admin/schedule-refresh.js', 'js/shared/coach-requests.js', 'js/shared/n6-monthly-pdf-reports.js', 'js/account-ui.js'],
  },
  headcoach : {
    css: ['css/shared/tokens.css', 'css/headcoach/base.css', 'css/headcoach/layout.css', 'css/headcoach/components.css', 'css/headcoach/modules/laporan.css', 'css/headcoach/modules/jadwal.css', 'css/headcoach/modules/extras.css', 'css/headcoach/modules/keuangan.css', 'css/headcoach/modules/periode.css', 'css/headcoach/modules/monitoring.css', 'css/headcoach/modules/koreksi.css', 'css/headcoach/modules/pesan.css', 'css/headcoach/modules/program.css', 'css/headcoach/themes.css', 'css/headcoach/polish/intensity-calc.css', 'css/headcoach/polish/brand-layout.css', 'css/headcoach/polish/manual-builder.css', 'css/headcoach/polish/message-controls.css', 'css/headcoach/polish/sidebar-brand.css', 'css/headcoach/polish/sidebar-nav.css', 'css/headcoach/polish/brand-transparent.css', 'css/headcoach/polish/pace-cards.css', 'css/headcoach/polish/pace-table.css'],
    scripts: ['js/shared/ui/namespace.js', 'js/shared/menus.js', 'js/dist/headcoach.js', 'js/modules/headcoach/pro-engine.js', 'js/modules/headcoach/print-helpers.js', 'js/modules/headcoach/weekly-builder.js', 'js/modules/headcoach/coach-requests-ui.js', 'js/modules/headcoach/manual-builder.js', 'js/account-ui.js'],
  },
  coach : {
    css: ['css/shared/tokens.css', 'css/coach/base.css', 'css/coach/layout.css', 'css/coach/components.css', 'css/coach/modules/laporan.css', 'css/coach/modules/jadwal.css', 'css/coach/modules/extras.css', 'css/coach/modules/keuangan.css', 'css/coach/modules/periode.css', 'css/coach/themes.css'],
    scripts: ['js/shared/ui/namespace.js', 'js/shared/menus.js', 'js/dist/coach.js', 'js/modules/coach/theme.js', 'js/modules/coach/account-dropdown.js', 'js/account-ui.js'],
  },
  client : {
    css: ['css/client/tokens.css', 'css/client/base.css', 'css/client/modules/extras.css', 'css/client/layout.css', 'css/client/modules/pesan.css', 'css/client/print.css'],
    scripts: ['js/shared/ui/namespace.js', 'js/shared/menus.js', 'js/dist/client.js', 'js/account-ui.js'],
  }
};

export default ROLE_ASSETS;
