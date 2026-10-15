/* js/app.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { applyTheme, ensurePage } from './actions.js';
import { ROLE, ROLE_USER_IDS } from './core/constants.js';
import { TODAY, num, parseDate } from './core/helpers.js';
import { ACT, FORMS, HOOK } from './core/registry.js';
import { appState, fillTemplate, findClientById, findClientByUid, store } from './core/store.js';
import { syncBoot, syncListen } from './core/sync.js';
import { idPreview } from './pages/coach.js';
import { clientFormSync } from './pages/klien.js';
import { navigateTo, render, setPath, toast } from './ui/shell.js';
import { apiBoot, apiLog, isApiMode, hasToken, apiLogin, apiLogout } from './core/api.js';
import { setLogSink } from './core/access.js';

// Handler logout: hapus token, kembali ke layar login
ACT.logout = () => { apiLogout(); location.reload(); };
setLogSink(t => { if (isApiMode()) apiLog(t); });

import './portal/cdash.js';
import './portal/links.js';
import './portal/client-portal.js';
import './pages/beranda.js';
import './pages/klien.js';
import './pages/coach.js';
import './pages/komisi.js';
import './pages/keuangan.js';
import './pages/koreksi.js';
import './pages/program.js';
import './pages/pesan.js';
import './pages/laporan.js';
import './pages/absensi.js';
import './pages/anggota.js';
import './pages/setting.js';
import './pages/progress.js';
import './actions.js';

document.addEventListener('click',e=>{
 const sc=e.target.closest('.scrim');if(sc&&e.target===sc){appState.modal=null;render();return}
 const t=e.target.closest('[data-act]');if(!t||t.disabled)return;
 const f=ACT[t.dataset.act];if(f)f(t,e);
});
document.addEventListener('submit',e=>{
 const f=e.target.closest('form[data-form]');if(!f)return;
 e.preventDefault();const h=FORMS[f.dataset.form];
 if(h)Promise.resolve(h(new FormData(f),f)).catch(err=>{console.error(err);toast('Gagal menyimpan: '+((err&&err.message)||err))});
});
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.hasAttribute&&t.hasAttribute('data-idl')){const p=document.getElementById('idprev');if(p)p.innerHTML=idPreview(t.value,t.dataset.coach);return}
 if(t.hasAttribute&&t.hasAttribute('data-qm')){appState.mq=t.value;appState.focus={id:t.id,pos:t.selectionStart};render();return}
 if(t.hasAttribute&&t.hasAttribute('data-q')){appState.q=t.value;appState.focus={id:t.id,pos:t.selectionStart};render()}
});
document.addEventListener('change',e=>{
 const t=e.target;if(!t.dataset)return;
 if(t.hasAttribute('data-cform')){clientFormSync(t);return}
 if(t.hasAttribute('data-tsel')){const w=document.getElementById('ctw');if(w)w.hidden=t.value!=='custom';return}
 if(t.dataset.f){appState[t.dataset.f]=t.hasAttribute('data-n')?+t.value:t.value;render();return}
 if(t.hasAttribute('data-tpl')){
  const form=t.closest('form'),r=store.reports.find(x=>x.id===form.dataset.id),tp=store.tpl.find(x=>x.id===t.value);
  if(r&&tp){form.querySelector('textarea').value=fillTemplate(tp.text,findClientById(r.cid).name,r.type)}
  return}
 if(t.hasAttribute('data-apply')){ACT.applyps(t);return}
 if(t.dataset.set){
  const p=t.dataset.set;let v=t.value;
  if(t.type==='checkbox')v=t.checked;
  else if(t.hasAttribute('data-num'))v=num(v);
  setPath(p,v);if(HOOK[p])HOOK[p]();
  if(t.hasAttribute('data-unitwk')){const mm=String(v).match(/(\d+)\s*(minggu|mgg)/i);if(mm)store.programs[+p.split('.')[2]].wk=+mm[1]}
  if(p.startsWith('store.programs')||p.startsWith('store.targets'))appState.syncAt=new Date();
  appState.focus=null;render();
 }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&appState.modal){appState.modal=null;render()}});
(function boot(){
 try{const v=JSON.parse(localStorage.getItem('gf-prefs')||'{}');if(v.role&&ROLE[v.role])appState.role=v.role;if(v.theme==='light'||v.theme==='dark')appState.theme=v.theme}catch(e){}
 try{const th=localStorage.getItem('nsr-theme');if(th==='light'||th==='dark'||th==='system')appState.theme=th}catch(e){}
 if(appState.role==='coach'){appState.sched=ROLE_USER_IDS.coach;appState.cal=ROLE_USER_IDS.coach;appState.share=ROLE_USER_IDS.coach}
 const hm=location.hash.match(/^#c=([A-Za-z0-9-]+)/);
 window.addEventListener('hashchange',()=>{try{location.reload()}catch(e){}});
 const appEl=document.getElementById('app');
 if(appEl)appEl.innerHTML='<p class="sub" style="padding:48px;text-align:center">Memuat data…</p>';
 // Belum login -> tampilkan layar login
 if(!hasToken()){ renderLogin(); return; }
 bootData();
})();

function bootData(){
 // Fase B: coba muat dari API (mock); gagal -> fallback seed lokal
 apiBoot().then(fromApi=>{
  if(!fromApi)syncBoot();
  syncListen(()=>{try{ensurePage()}catch(e){}const a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)){a.addEventListener('blur',()=>render(),{once:true})}else{render()}toast('Data diperbarui dari portal lain')});
  store.clients=store.clients.filter(c=>!c.arch||(TODAY-parseDate(c.arch))/864e5<7);
  if(hm){const k=findClientByUid(hm[1]);appState.cview=k?k.id:'x'}
  applyTheme();ensurePage();render(false);
 });
}

// Layar login
function renderLogin(){
 const appEl=document.getElementById('app');
 appEl.innerHTML=`<div style="min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px">
 <form id="login-form" style="width:100%;max-width:340px" autocomplete="off">
 <h1 style="font-size:22px;margin:0 0 4px">Number Six Running</h1>
 <p class="sub" style="margin:0 0 20px">Masuk untuk mengelola</p>
 <label class="sub" style="display:block;margin-bottom:4px">ID Login</label>
 <input name="login_id" required autofocus style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg2);color:inherit;margin-bottom:12px" />
 <label class="sub" style="display:block;margin-bottom:4px">Kata sandi</label>
 <input name="password" type="password" required style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg2);color:inherit;margin-bottom:16px" />
 <p id="login-err" class="sub" style="color:#e5484d;min-height:20px;margin:0 0 8px"></p>
 <button type="submit" style="width:100%;padding:12px;border:0;border-radius:12px;background:var(--accent);color:#fff;font-weight:700;font-size:15px">Masuk</button>
 </form></div>`;
 const f=document.getElementById('login-form');
 f.addEventListener('submit',async ev=>{
  ev.preventDefault();
  const err=document.getElementById('login-err');
  err.textContent='';
  const fd=new FormData(f);
  try{
   await apiLogin(String(fd.get('login_id')).trim(), String(fd.get('password')));
   location.reload();
  }catch(e){
   const m=String((e&&e.message)||e);
   let t;
   if(/Failed to fetch|NetworkError|Load failed/i.test(m)) t='Tidak dapat terhubung ke server. Periksa koneksi internet.';
   else if(/tidak ditemukan/i.test(m)) t='ID login tidak ditemukan.';
   else if(/password salah/i.test(m)) t='Kata sandi salah.';
   else t='Login gagal: '+m;
   err.textContent=t;
  }
 });
}

// handle debug (dipakai test browser)
window.N6 = { navigateTo, setPath, render, version: '4.0.0-modular' };
