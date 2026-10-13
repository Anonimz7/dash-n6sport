/* js/actions.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { canAccess } from './core/access.js';
import { ROLE_USER_IDS } from './core/constants.js';
import { ACT, CONF } from './core/registry.js';
import { appState } from './core/store.js';
import { navigateTo, render, toast } from './ui/shell.js';

function savePreferences(){try{localStorage.setItem('gf-prefs',JSON.stringify({role:appState.role,theme:appState.theme}));localStorage.setItem('nsr-theme',appState.theme)}catch(e){}}
function applyTheme(){const r=document.documentElement;if(appState.theme==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',appState.theme)}
function ensurePage(){if(!(canAccess(appState.page)||appState.page==='setting'))appState.page='beranda'}
Object.assign(ACT,{
 nav:t=>navigateTo(t.dataset.v),
 menu:()=>{appState.nav=!appState.nav;render()},
 role:t=>{appState.role=t.dataset.v;ensurePage();appState.tab=0;appState.modal=null;appState.nav=false;appState.q='';if(appState.role==='coach'){appState.sched=ROLE_USER_IDS.coach;appState.cal=ROLE_USER_IDS.coach;appState.share=ROLE_USER_IDS.coach;appState.kcoach='all'}savePreferences();render(false)},
 enter:t=>{appState.gate=false;ACT.role(t)},
 logout:()=>{appState.gate=true;appState.nav=false;render(false)},
 tab:t=>{appState.tab=+t.dataset.v;appState.editfix=null;render()},
 tp:t=>{appState.tp=t.dataset.v;render()},
 theme:t=>{appState.theme=t.dataset.v;applyTheme();savePreferences();render()},
 modal:t=>{appState.modal={k:t.dataset.v,id:t.dataset.id||null};render()},
 close:()=>{appState.modal=null;render()},
 yes:()=>{const m=appState.modal;if(m&&CONF[m.yes])CONF[m.yes](m.arg);appState.modal=null;toast('Selesai');render()}
});

export { applyTheme, ensurePage, savePreferences };
