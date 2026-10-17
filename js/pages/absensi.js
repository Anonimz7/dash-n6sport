/* js/pages/absensi.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { logAct, meId, meUser, scope } from '../core/access.js';
import { apiSaveAttendance, isApiMode } from '../core/api.js';
import { COACHES, REQUEST_TYPE_KEYS, REQUEST_TYPE_LABELS, ROLE_USER_IDS } from '../core/constants.js';
import { liveClients } from '../core/derived.js';
import { TODAY, esc, first, fmtD, hhmm, iso, parseDate } from '../core/helpers.js';
import { icon } from '../core/icons.js';
import { ACT, FORMS, MODALS, PAGES } from '../core/registry.js';
import { ATT_MIN, attOpen, attOpenAt, locOf, sessionsOn } from '../core/shared.js';
import { appState, findClientById, findProgramById, getMemberName, store } from '../core/store.js';
import { banner, kpi, pill, sheet, tabsBar } from '../ui/components.js';
import { render, toast } from '../ui/shell.js';

const whoName=r=>r.type==='izin_client'?(findClientById(r.who)?.name||'-'):getMemberName(r.who);
function attList(){
 const isC=appState.role==='coach',sel=isC?meId():(appState.acoach||COACHES[0]),all=!isC&&sel==='all';
 const cos=all?COACHES.slice():[sel];
 let dk=appState.adate||iso(TODAY);if(parseDate(dk)>TODAY)dk=iso(TODAY);
 store.attSlot=store.attSlot||{};
 const per=cos.map(co=>{
  const by={};sessionsOn(co,parseDate(dk)).forEach(r=>{(by[r.time]=by[r.time]||[]).push(r.c.name+' ('+((findProgramById(r.c.pid)||{}).name||'-')+')')});
  return{co,slots:Object.keys(by).sort().map(t=>({co,t,names:by[t],rec:store.attSlot[dk+'|'+co+'|'+t]||null,ok:attOpen(dk,t)}))}});
 const all_=[].concat(...per.map(x=>x.slots));
 const done=all_.filter(x=>x.rec).length,open=all_.filter(x=>!x.rec&&x.ok).length,lock=all_.filter(x=>!x.rec&&!x.ok).length;
 const item=x=>{
  const co=x.co,st=x.rec?x.rec.s:null,end=hhmm(attOpenAt(dk,x.t));
  const btns=[['Hadir','Konfirmasi hadir'],['Tidak hadir','Tidak hadir']].map(([v,l])=>`<button class="btn sm ${st===v?'primary':''}" data-act="cattset" data-d="${dk}" data-co="${co}" data-t="${x.t}" data-s="${v}" ${x.ok?'':'disabled'} aria-pressed="${st===v}">${l}</button>`).join('');
  const info=st?pill(st==='Hadir'?'Hadir':'Tidak hadir',st==='Hadir'?'good':'bad'):(x.ok?pill('Menunggu konfirmasi','warn'):pill('Terkunci sampai '+end,'info'));
  const body=appState.attCompact
   ?`<div style="flex:1;min-width:200px"><b>${x.t} - ${end} WIB</b><small>${all?esc(first(getMemberName(co)))+' · ':''}${esc(locOf(co))} · ${x.names.map(n=>esc(n.slice(0,n.lastIndexOf(' (')))).join(', ')}</small></div>`
   :`<div style="flex:1;min-width:220px"><small style="color:${x.rec?'var(--good)':'var(--warn)'};font-weight:700">${x.rec?esc(getMemberName(co))+', absensi jadwal ini sudah dikonfirmasi.':(isC?esc(getMemberName(co))+', kamu memiliki jadwal absensi yang harus kamu konfirmasi.':esc(getMemberName(co))+' memiliki jadwal absensi yang harus dikonfirmasi.')}</small><b>Jadwal melatih ${x.t} - ${end} WIB</b><small><b>Coach:</b> ${esc(getMemberName(co))}</small><small><b>Lokasi melatih:</b> ${esc(locOf(co))}</small><small><b>Klien yang dilatih:</b> ${x.names.map(esc).join('; ')}</small><small><b>Absensi bisa diisi:</b> mulai pukul ${end} (setelah jadwal selesai)</small>${x.rec?`<small><b>Status:</b> ${x.rec.s==='Hadir'?'Coach hadir melatih':'Coach tidak hadir'}, dikonfirmasi oleh ${esc(x.rec.by)} pukul ${x.rec.at}</small>`:''}</div>`;
  return `<div class="li" style="align-items:flex-start;flex-wrap:wrap;gap:8px">${body}<div class="acts">${info}${btns}</div></div>`};
 const list=all
  ?per.map(x=>`<div class="listv"><h4 style="margin:6px 0 0;font-size:14px">${esc(getMemberName(x.co))} <span class="sub">· ${esc(locOf(x.co))} · ${x.slots.length} jadwal</span></h4>${x.slots.map(item).join('')||'<p class="sub" style="margin:0">Tidak ada jadwal melatih pada tanggal ini.</p>'}</div>`).join('')
  :(all_.map(item).join('')||'<section class="card"><p class="sub">Tidak ada jadwal melatih pada tanggal ini.</p></section>');
 const picker=isC?'':`<label class="field" style="max-width:260px"><span>Coach</span><select data-f="acoach"><option value="all" ${all?'selected':''}>Semua coach</option>${COACHES.map(c=>`<option value="${c}" ${sel===c?'selected':''}>${esc(getMemberName(c))}</option>`).join('')}</select></label>`;
 return `<div class="toolbar">${picker}<label class="field" style="max-width:200px"><span>Tanggal melatih</span><input type="date" data-f="adate" max="${iso(TODAY)}" value="${dk}"></label><span class="sp"></span><div class="row"><span class="sub" id="lb-cmp">Ringkas keterangan</span><button type="button" class="swt" role="switch" aria-checked="${!!appState.attCompact}" aria-labelledby="lb-cmp" data-act="attcompact"><i></i></button></div></div>
 <div class="kpis">${kpi('Jadwal melatih',all_.length,all?cos.length+' coach':esc(locOf(sel)))}${kpi('Sudah dikonfirmasi',done,'')}${kpi('Siap dikonfirmasi',open,'jadwal sudah lewat')}${kpi('Terkunci',lock,'belum waktunya')}</div>
 ${banner('Absensi coach hanya bisa dikonfirmasi setelah jadwal melatih selesai, yaitu '+ATT_MIN+' menit setelah jam mulai. Tombol aktif otomatis saat waktunya tiba. Konfirmasi Hadir langsung tampil di dashboard Pemilik.','info')}
 <div class="listv">${list}</div>`}
PAGES.absensi=()=>{
 const t=Math.min(appState.tab,6);
 if(t===0){return `<div class="stackv">${tabsBar(['Daftar Hadir'].concat(REQUEST_TYPE_KEYS.map(k=>REQUEST_TYPE_LABELS[k])))}${attList()}</div>`}
 const type=REQUEST_TYPE_KEYS[t-1];
 let list=store.reqs.filter(r=>r.type===type);
 if(appState.role==='coach')list=list.filter(r=>type==='izin_client'?findClientById(r.who)?.coach===meId():r.who===meId());
 const mine=appState.role==='coach',all=store.reqs.filter(r=>!mine||(r.type==='izin_client'?findClientById(r.who)?.coach===meId():r.who===meId()));
 return `<div class="stackv"><div class="kpis">${kpi('Menunggu keputusan',all.filter(r=>r.status==='Menunggu').length,'semua jenis')}${kpi('Disetujui',all.filter(r=>r.status==='Disetujui').length,'memengaruhi kalender')}${kpi('Ditolak',all.filter(r=>r.status==='Ditolak').length,'')}</div>
 ${tabsBar(['Daftar Hadir'].concat(REQUEST_TYPE_KEYS.map(k=>REQUEST_TYPE_LABELS[k])))}
 <div class="toolbar"><span class="sub">${list.length} pengajuan</span><span class="sp"></span><button class="btn primary" data-act="modal" data-v="req">${icon('plus',15)} ${type==='masalah'?'Laporkan masalah':'Ajukan '+REQUEST_TYPE_LABELS[type].toLowerCase()}</button></div>
 <div class="listv">${list.sort((a,b)=>b.at-a.at).map(r=>`<div class="li"><div><b>${esc(whoName(r))} ${r.sev?pill(r.sev,r.sev==='Tinggi'?'bad':'warn'):''}</b><small>${r.type==='masalah'?'':fmtD(r.date)+(r.date2&&r.date2!==r.date?' - '+fmtD(r.date2)+' · ':' · ')}${esc(r.detail)}</small></div><div class="acts">${pill(r.status,{Menunggu:'warn',Disetujui:'good',Ditolak:'bad',Selesai:'good'}[r.status])}${!mine&&r.status==='Menunggu'?(r.type==='masalah'?`<button class="btn sm" data-act="reqset" data-v="${r.id}" data-s="Selesai">Tandai selesai</button>`:`<button class="btn sm primary" data-act="reqset" data-v="${r.id}" data-s="Disetujui">Setujui</button><button class="btn sm" data-act="reqset" data-v="${r.id}" data-s="Ditolak">Tolak</button>`):''}</div></div>`).join('')||'<section class="card"><p class="sub">Belum ada pengajuan pada kategori ini.</p></section>'}</div></div>`};
MODALS.req=()=>{
 const type=REQUEST_TYPE_KEYS[Math.max(0,Math.min(appState.tab,6)-1)],mine=appState.role==='coach';
 const whoOpts=type==='izin_client'?scope(liveClients()).map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join(''):(mine?`<option value="${meId()}">${esc(getMemberName(meId()))}</option>`:COACHES.map(c=>`<option value="${c}">${esc(getMemberName(c))}</option>`).join(''));
 const rs=type==='reschedule';
 return sheet(type==='masalah'?'Laporkan masalah':'Ajukan '+REQUEST_TYPE_LABELS[type].toLowerCase(),`<form data-form="req" class="fg"><input type="hidden" name="type" value="${type}">
 <label class="field"><span>${type==='izin_client'?'Klien':type==='masalah'?'Pelapor':'Coach'}</span><select name="who" ${mine&&type!=='izin_client'?'disabled':''}>${type==='masalah'?`<option value="${meId()}">${esc(meUser().name)}</option>`:whoOpts}</select></label>
 ${type==='masalah'?`<label class="field"><span>Tingkat</span><select name="sev"><option>Rendah</option><option selected>Sedang</option><option>Tinggi</option></select></label>`:`<label class="field"><span>${rs?'Jadwal lama (tanggal)':'Tanggal mulai'}</span><input id="f-rd1" name="date" type="date" value="${iso(TODAY)}" required></label><label class="field"><span>${rs?'Jadwal baru (tanggal)':'Tanggal selesai'}</span><input id="f-rd2" name="date2" type="date" value="${iso(TODAY)}" required></label>`}
 <label class="field full"><span>${type==='masalah'?'Jelaskan masalah':rs?'Detail sesi dan alasan':'Alasan'}</span><textarea id="f-rdet" name="detail" required placeholder="Tulis dengan singkat dan jelas"></textarea></label>
 <div class="row full"><button class="btn primary" type="submit">Kirim</button><button class="btn" type="button" data-act="close">Batal</button></div></form>`)};
FORMS.req=f=>{const type=f.get('type'),who=appState.role==='coach'&&type!=='izin_client'?meId():f.get('who');store.reqs.push({id:'r'+Date.now(),type,who:type==='masalah'?meId():who,date:f.get('date')||iso(TODAY),date2:f.get('date2')||f.get('date')||iso(TODAY),detail:f.get('detail').trim(),sev:f.get('sev')||undefined,status:'Menunggu',at:new Date()});logAct('mengajukan '+REQUEST_TYPE_LABELS[type].toLowerCase());appState.modal=null;toast('Terkirim dan langsung tampil di portal Pemilik');render()};
ACT.attcompact=()=>{appState.attCompact=!appState.attCompact;render()};
ACT.cattset=async t=>{
 const k=t.dataset.d,co=t.dataset.co,tm=t.dataset.t,v=t.dataset.s;
 if(!['Hadir','Tidak hadir'].includes(v)||!COACHES.includes(co))return;
 if(appState.role==='coach'&&co!==meId()){toast('Hanya bisa mengisi absensi Anda sendiri');return}
 if(parseDate(k)>TODAY||!attOpen(k,tm)){toast('Belum bisa diisi. Terbuka pukul '+hhmm(attOpenAt(k,tm))+' (jadwal selesai)');render();return}
 store.attSlot=store.attSlot||{};
 store.attSlot[k+'|'+co+'|'+tm]={s:v,by:meUser().name,at:hhmm(new Date())};
 if(isApiMode()){try{await apiSaveAttendance(k,co,tm,v,meUser().name,hhmm(new Date()))}catch(e){console.error('Gagal simpan absensi:',e)}}
 /* sinkron ke absensi harian coach (dipakai dashboard) */
 const recs=Object.keys(store.attSlot).filter(x=>x.startsWith(k+'|'+co+'|')).map(x=>({t:x.split('|')[2],s:store.attSlot[x].s}));
 const hd=recs.filter(r=>r.s==='Hadir').map(r=>r.t).sort();
 store.attCoach[co]=store.attCoach[co]||{};
 if(hd.length){const end=hhmm(attOpenAt(k,hd[hd.length-1]));store.attCoach[co][k]={in:hd[0],out:end}}
 else store.attCoach[co][k]={status:'Alpha'};
 logAct('mengonfirmasi absensi coach '+getMemberName(co)+' ('+v+') '+tm);
 toast('Absensi '+first(getMemberName(co))+' jam '+tm+': '+v);render()};
ACT.reqset=t=>{const r=store.reqs.find(x=>x.id===t.dataset.v);r.status=t.dataset.s;logAct((r.status==='Disetujui'?'menyetujui ':r.status==='Ditolak'?'menolak ':'menyelesaikan ')+REQUEST_TYPE_LABELS[r.type].toLowerCase()+' '+whoName(r));toast(['izin_coach','cuti','berhalangan'].includes(r.type)&&r.status==='Disetujui'?'Disetujui. Kalender coach diperbarui':'Status diperbarui');render()};

export { attList, whoName };
