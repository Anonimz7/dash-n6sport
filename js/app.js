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
 e.preventDefault();const h=FORMS[f.dataset.form];if(h)h(new FormData(f),f);
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
 syncBoot();
 syncListen(()=>{try{ensurePage()}catch(e){}const a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)){a.addEventListener('blur',()=>render(),{once:true})}else{render()}toast('Data diperbarui dari portal lain')});
 if(appState.role==='coach'){appState.sched=ROLE_USER_IDS.coach;appState.cal=ROLE_USER_IDS.coach;appState.share=ROLE_USER_IDS.coach}
 store.clients=store.clients.filter(c=>!c.arch||(TODAY-parseDate(c.arch))/864e5<7);
 const hm=location.hash.match(/^#c=([A-Za-z0-9-]+)/);if(hm){const k=findClientByUid(hm[1]);appState.cview=k?k.id:'x'}
 window.addEventListener('hashchange',()=>{try{location.reload()}catch(e){}});
 applyTheme();ensurePage();render(false);
})();

// handle debug (dipakai test browser)
window.N6 = { navigateTo, setPath, render, version: '4.0.0-modular' };
