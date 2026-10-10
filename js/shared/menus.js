/**
 * N6 shared — Menu Registry (kanonis)
 *
 * Satu-satunya sumber kebenaran struktur menu per tier.
 * ID panel TERSTANDARDISASI lintas tier:
 *   home  (dulu: beranda, hub)
 *   chat  (dulu: pesan, hcclientchat)
 *   jadwal-coach (dulu: jadwalcoach) — owner/admin
 *   jadwal (coach, fitur absensi — beda)
 *   jadwal-klien (dulu: jadwalklien)
 *
 * Kompatibel classic-script (IIFE): menempel ke window.N6_MENUS.
 * Dipakai oleh N6UI.renderSidebar().
 */

(function () {
  window.N6_MENUS = window.N6_MENUS || {};

  window.N6_BRANDS = {
    owner: { title: "NUMBER SIX", subtitle: "Owner \u00b7 All Akses" },
    admin: { title: "NUMBER SIX", subtitle: "Admin" },
    headcoach: { title: "NUMBER SIX", subtitle: "Head Coach" },
    coach: { title: "NUMBER SIX", subtitle: "Coach" },
    client: { title: "NUMBER SIX", subtitle: "Client" },
  };

  window.N6_MENUS.owner = [
    { id: "home", label: "Beranda",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 12l9-9 9 9\"></path><path d=\"M5 10v10h14V10\"></path></svg>",
      badge: false },
    { id: "klien", label: "Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg>",
      badge: false },
    { id: "jadwal-klien", label: "Jadwal Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect height=\"18\" rx=\"2\" width=\"18\" x=\"3\" y=\"4\"></rect><path d=\"M16 2v4M8 2v4M3 10h18\"></path></svg>",
      badge: false },
    { id: "jadwal-coach", label: "Jadwal Coach",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 7v5l3 3\"></path></svg>",
      badge: false },
    { id: "harga", label: "Harga &amp; Program",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      badge: false },
    { id: "komisi", label: "Performa &amp; Komisi",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M20 12V8H6a2 2 0 0 1 0-4h12v4\"></path><path d=\"M4 6v12a2 2 0 0 0 2 2h14v-4\"></path><path d=\"M18 12a2 2 0 0 0 0 4h4v-4z\"></path></svg>",
      badge: false },
    { id: "keuangan", label: "Keuangan",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      badge: false },
    { id: "tiket", label: "Tiket &amp; Keluhan 0",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 1 0 4v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1a2 2 0 0 1 0-4z\"></path></svg>",
      badge: true },
    { id: "chat", label: "Pesan 0",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M21 12c0 4.4-4 8-9 8-1.2 0-2.3-.2-3.3-.6L3 20l1-4.2C3.4 14.5 3 13.3 3 12c0-4.4 4-8 9-8s9 3.6 9 8z\"></path></svg>",
      badge: true },
    { id: "akun", label: "Kelola Anggota",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg>",
      badge: false },
    { id: "sandi", label: "Ganti Password",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>",
      badge: false },
  ];

  window.N6_MENUS.admin = [
    { id: "home", label: "Beranda",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 12l9-9 9 9\"></path><path d=\"M5 10v10h14V10\"></path></svg>",
      badge: false },
    { id: "klien", label: "Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg>",
      badge: false },
    { id: "jadwal-klien", label: "Jadwal Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect height=\"18\" rx=\"2\" width=\"18\" x=\"3\" y=\"4\"></rect><path d=\"M16 2v4M8 2v4M3 10h18\"></path></svg>",
      badge: false },
    { id: "jadwal-coach", label: "Jadwal Coach",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"M12 7v5l3 3\"></path></svg>",
      badge: false },
    { id: "harga", label: "Daftar Harga",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"></path></svg>",
      badge: false },
    { id: "tiket", label: "Tiket &amp; Keluhan 0",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 1 0 4v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1a2 2 0 0 1 0-4z\"></path></svg>",
      badge: true },
    { id: "chat", label: "Pesan 0",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M21 12c0 4.4-4 8-9 8-1.2 0-2.3-.2-3.3-.6L3 20l1-4.2C3.4 14.5 3 13.3 3 12c0-4.4 4-8 9-8s9 3.6 9 8z\"></path></svg>",
      badge: true },
    { id: "sandi", label: "Ganti Password",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>",
      badge: false },
  ];

  window.N6_MENUS.headcoach = [
    { id: "home", label: "\u25eb Beranda",
      svg: "",
      badge: false },
    { id: "hcmanual", label: "\u25a4 Buat Program",
      svg: "",
      badge: false },
    { id: "hcmonitor", label: "\u25c9 Monitoring Klien",
      svg: "",
      badge: false },
    { id: "chat", label: "\u2709 Pesan",
      svg: "",
      badge: false },
    { id: "coach", label: "Coach",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M20.5 9.5 12 4 3.5 9.5 12 15l8.5-5.5z\"></path><path d=\"M7 12.5V17c0 1.5 2.2 3 5 3s5-1.5 5-3v-4.5\"></path></svg>",
      badge: false },
    { id: "klien", label: "Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg>",
      badge: false },
    { id: "koreksi", label: "Koreksi",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M9 11l3 3L22 4\"></path><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path></svg>",
      badge: false },
    { id: "atlet", label: "Atlet Binaan",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z\"></path><path d=\"M17 5h3a2 2 0 0 1-2 4h-1M7 5H4a2 2 0 0 0 2 4h1\"></path></svg>",
      badge: false },
    { id: "sandi", label: "Ganti Password",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>",
      badge: false },
  ];

  window.N6_MENUS.coach = [
    { id: "home", label: "Beranda",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M3 12l9-9 9 9\"></path><path d=\"M5 10v10h14V10\"></path></svg>",
      badge: false },
    { id: "klien", label: "Klien",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path></svg>",
      badge: false },
    { id: "info", label: "Informasi",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4M12 8h.01\"></path></svg>",
      badge: false },
    { id: "jadwal", label: "Absensi",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect height=\"18\" rx=\"2\" width=\"18\" x=\"3\" y=\"4\"></rect><path d=\"M16 2v4M8 2v4M3 10h18\"></path><path d=\"M9 16l2 2 4-4\"></path></svg>",
      badge: false },
    { id: "sandi", label: "Ganti Password",
      svg: "<svg class=\"ic\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" viewbox=\"0 0 24 24\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path></svg>",
      badge: false },
  ];

  /** Peta migrasi: panel id lama -> kanonis (untuk referensi). */
  window.N6_PANEL_MIGRATION = {
    'beranda': 'home',
    'hub': 'home',
    'pesan': 'chat',
    'hcclientchat': 'chat',
    'jadwalcoach': 'jadwal-coach',
    'jadwalklien': 'jadwal-klien',
  };
})();
