/**
 * N6 modules - headcoach / _shared
 *
 * GENERATED — disalin dari js/shared/core-helpers.js.
 * Jangan edit manual; jalankan tools/sync-shared.sh.
 */
//__N6_BODY__
/*__N6_UNIT__*/ const BLOCKS = [
    { key:'pagi', label:'Pagi', time:'06:00–09:00' },
    { key:'siang', label:'Siang', time:'09:00–12:00' },
    { key:'sore', label:'Sore', time:'15:00–18:00' },
    { key:'malam', label:'Malam', time:'18:00–21:00' }
  ];
/*__N6_UNIT__*/ const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
/**
 * KONVENSI TANGGAL N6:
 * - todayISO(): tanggal hari ini (zona lokal browser), format YYYY-MM-DD
 * - new Date(str): parsing tanggal dari string ISO
 * - daysBetween(): selisih hari kalender (bukan 24 jam persis)
 * Semua tanggal disimpan sebagai string ISO YYYY-MM-DD (tanpa waktu/timezone).
 */
/*__N6_UNIT__*/ function daysBetween(a, b){ return Math.round((new Date(b) - new Date(a)) / 86400000); }
/*__N6_UNIT__*/ function escapeHtml(s){ const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
/*__N6_UNIT__*/ function formatDateID(dateStr){
    if (!dateStr) return '-';
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const [y,m,d] = dateStr.split('-');
    return parseInt(d,10) + ' ' + bulan[parseInt(m,10)-1] + ' ' + y;
  }
/*__N6_UNIT__*/ function formatRupiah(n){ n = Number(n) || 0; return 'Rp' + n.toLocaleString('id-ID'); }
/*__N6_UNIT__*/ function showToast(msg){
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ================= STATE ================= */
/*__N6_UNIT__*/ function slugify(name){ return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
/*__N6_UNIT__*/ function todayDayName(){
    const jsDay = new Date().getDay(); // 0=Minggu
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    return DAYS[idx];
  }

  // Coach schedule is shared with Admin CS on the SAME browser origin.
  // Other Owner records stay in the Owner namespace; never overwrite Admin client records.
/*__N6_UNIT__*/ function todayISO(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
/*__N6_UNIT__*/ async function n6Api(path){
    const res = await fetch(n6ApiBase() + '/' + String(path).replace(/^\/+/, ''), {
      headers: { 'Authorization': 'Bearer ' + n6ApiToken() }
    });
    if (!res.ok) throw new Error('API ' + res.status + ' ' + path);
    return res.json();
  }
/*__N6_UNIT__*/ function n6ApiBase(){ return String(n6ApiCfg().base || 'https://api.denisbergkam.com/api/n6').replace(/\/+$/, ''); }
/*__N6_UNIT__*/ function n6ApiCfg(){ return window.N6_API || {}; }
/*__N6_UNIT__*/ function n6ApiReady(){ return n6ApiCfg().enabled === true && !!n6ApiToken(); }
/*__N6_UNIT__*/ function n6ApiToken(){
    try { return window.localStorage.getItem(n6ApiCfg().tokenKey || 'n6:api:token'); }
    catch(e){ return null; }
  }
/*__N6_UNIT__*/ const N6_API_KEYS = new Set(['clients','tickets','messages']);
/*__N6_UNIT__*/ function coachById(id){ return coachRoster.find(c => String(c.id) === String(id)); }
/*__N6_UNIT__*/ async function fetchCoachesFromApi(){
    try {
      const token = window.localStorage.getItem('n6:api:token');
      if (!token) return [];
      const res = await fetch('https://api.denisbergkam.com/api/n6/v1/accounts?tier=3&limit=200', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) return [];
      const page = await res.json();
      const items = (page && page.items) || [];
      return items.map(a => ({
        id: a.coach_id || a.id,
        accountId: a.id,
        name: a.full_name || a.username,
        username: a.username,
        phone: a.phone || '',
        email: a.email || '',
      }));
    } catch (e) { return []; }
  }

  /* ================= LOAD DATA ================= */
/*__N6_UNIT__*/ async function persistChat(id){ await storeSet('chat:' + id, JSON.stringify(chatCache[id] || [])); }
/*__N6_UNIT__*/ async function persistClients(){ await storeSet('clients', JSON.stringify(clients)); }
/*__N6_UNIT__*/ async function persistCoachDayOff(){ await storeSet('coachDayOff', JSON.stringify(coachDayOff)); }
/*__N6_UNIT__*/ async function persistCoachRoster(){ /* dihapus: coachRoster dari API Kelola Anggota */ }
/*__N6_UNIT__*/ async function persistCoachSchedule(){ await storeSet('coachSchedule', JSON.stringify(coachSchedule)); }
/*__N6_UNIT__*/ async function persistProgram(id){ await storeSet('program:' + id, JSON.stringify(programCache[id] || {})); }
/*__N6_UNIT__*/ async function persistTickets(){ await storeSet('tickets', JSON.stringify(tickets)); }

/*__N6_UNIT__*/  function panelId(name){ return 'panel-' + name; }
