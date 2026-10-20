/* js/core/derived.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { COACHES } from './constants.js';
import { MONTHS, TODAY, addD, dIdx, esc, fmtD, hhmm, iso, parseDate, sum } from './helpers.js';
import { findClientById, findProgramById, getClientStatus, store } from './store.js';
import { activePrograms, perRange, pill } from '../ui/components.js';

const inRange=(k,days)=>{const d=parseDate(k);if(typeof days==='string'){const r=perRange();return d>=r.a&&d<=r.b}return d<=TODAY&&d>addD(TODAY,-days)};
const filterTransactions=(days,type)=>store.tx.filter(t=>(!type||t.type===type)&&inRange(t.date,days));
function monthly(){const o=[];for(let m=5;m>=0;m--){const b=new Date(TODAY.getFullYear(),TODAY.getMonth()-m,1),key=iso(b).slice(0,7);const inc=sum(store.tx.filter(t=>t.type==='in'&&t.date.startsWith(key)).map(t=>t.amt));const exp=sum(store.tx.filter(t=>t.type==='out'&&t.date.startsWith(key)).map(t=>t.amt));o.push({key,l:MONTHS[b.getMonth()],inc,exp})}return o}
const liveClients=()=>store.clients.filter(c=>!c.arch&&getClientStatus(c)!=='Selesai');
const hrZone=(hr,mx)=>{const p=hr/mx*100;return store.zones.find(z=>p>=z.lo&&p<z.hi)||(p<store.zones[0].lo?store.zones[0]:store.zones[store.zones.length-1])};
const offOn=(coach,k)=>store.reqs.some(r=>r.status==='Disetujui'&&['izin_coach','cuti','berhalangan'].includes(r.type)&&!r.t1&&r.who===coach&&k>=r.date&&k<=(r.date2||r.date));
const offSlot=(coach,k,t)=>store.reqs.some(r=>r.status==='Disetujui'&&r.type==='berhalangan'&&r.t1&&r.who===coach&&k>=r.date&&k<=(r.date2||r.date)&&t>=r.t1&&t<r.t2);
const offInfo=(coach,k)=>store.reqs.filter(r=>r.who===coach&&['izin_coach','cuti','berhalangan'].includes(r.type)&&['Menunggu','Disetujui'].includes(r.status)&&k>=r.date&&k<=(r.date2||r.date));
const offLbl=r=>r.type==='cuti'?'Cuti':r.type==='izin_coach'?'Izin':(r.t1?r.t1+'-'+r.t2:'Tidak mengajar');
const calCell=(c,i)=>{const d=addD(TODAY,i),k=iso(d),dd=dIdx(d),pat=store.pattern[c]||[],inf=offInfo(c,k),ap=offOn(c,k);
 const pend=!ap&&inf.some(r=>!r.t1&&r.status==='Menunggu'),part=inf.find(r=>r.t1);
 const free=ap?0:(pat[dd]||[]).filter(sl=>!offSlot(c,k,sl)&&!store.book.some(b=>b.coach===c&&b.day===dd&&b.time===sl)).length;
 const tip=inf.map(r=>offLbl(r)+' ('+r.status.toLowerCase()+')'+(r.detail?': '+r.detail:'')).join(' | ');
 const cls=ap?'off':pend?'pend':free>0?'hi':'';
 const line=ap?offLbl(inf.find(r=>r.status==='Disetujui'&&!r.t1)):pend?offLbl(inf.find(r=>!r.t1)):free+' kosong';
 return `<div class="cd ${cls} ${part?'part':''} ${i===0?'today':''}" ${tip?`title="${esc(tip)}"`:''}><b>${d.getDate()}${inf.length?'<i class="dot"></i>':''}</b><span>${esc(line)}</span>${part?`<em>${esc(part.t1+'-'+part.t2)}${part.status==='Menunggu'?' ?':''}</em>`:''}</div>`};
const offList=c=>{const t=iso(TODAY),a=store.reqs.filter(r=>r.who===c&&['izin_coach','cuti','berhalangan'].includes(r.type)&&['Menunggu','Disetujui'].includes(r.status)&&(r.date2||r.date)>=t).sort((x,y)=>x.date<y.date?-1:1);
 return a.length?`<div class="listv" style="margin-top:12px"><h4 style="margin:0;font-size:13px">Informasi coach tidak bisa mengajar</h4>${a.map(r=>`<div class="li"><div><b>${fmtD(parseDate(r.date))}${r.date2&&r.date2!==r.date?' - '+fmtD(parseDate(r.date2)):''} · ${esc(offLbl(r))}</b><small>${esc(r.detail||'')}</small></div>${pill(r.status==='Disetujui'?'Disetujui':'Menunggu',r.status==='Disetujui'?'good':'warn')}</div>`).join('')}</div>`:''};
function freeSlots(days,coachId){const out=[];const nowS=hhmm(new Date());for(let i=0;i<days;i++){const d=addD(TODAY,i),k=iso(d),di=dIdx(d);(coachId?[coachId]:COACHES).forEach(c=>{if(offOn(c,k))return;((store.pattern[c]||[])[di]||[]).forEach(t=>{if(i===0&&t<=nowS)return;if(offSlot(c,k,t))return;if(!store.book.some(b=>b.coach===c&&b.day===di&&b.time===t))out.push({d:k,di,t,c})})})}return out}
const getReportsOf=coachId=>store.reports.filter(r=>!r.missed&&(!coachId||findClientById(r.cid).coach===coachId));
const getPendingCorrections=coachId=>getReportsOf(coachId).filter(r=>!r.fix);
const holdOf=(cid,k)=>{const b=store.book.find(x=>x.client===cid&&x.day===dIdx(parseDate(k)));return !!(b&&b.hold)};
function getSessionAttendance(days,coach){
 const out=[];
 // Komisi dari absensi coach (attSlot): setiap slot yang dikonfirmasi Hadir.
 // F1.1: filter periode memakai inRange (sama seperti transaksi) — benar juga
 // untuk periode 'bulan'/'kustom', bukan hanya angka hari.
 // F1.3: satu entri PER KLIEN dalam slot (bukan booking pertama saja);
 // kehadiran klien tidak diperiksa (keputusan user 2026-10-20: pemicu komisi
 // adalah kehadiran coach; uang program klien sudah disetor).
 Object.keys(store.attSlot||{}).forEach(key=>{
  const rec=store.attSlot[key];
  if(!rec||rec.s!=='Hadir')return;
  const[k,coachId,time]=key.split('|');
  if(coach&&coachId!==coach)return;
  if(!inRange(k,days))return;
  const d=parseDate(k);
  // Semua booking yang cocok: coach + hari-dalam-seminggu + jam
  const bs=store.book.filter(x=>x.coach===coachId&&x.day===dIdx(d)&&x.time===time);
  if(!bs.length){out.push({date:k,cid:null,client:'-',coach:coachId,pid:null,fee:0});return}
  const seen=new Set();
  bs.forEach(b=>{
   const c=findClientById(b.client);
   if(!c||seen.has(c.id))return;
   seen.add(c.id);
   // Pengaman warisan: sesi sebelum tanggal mulai klien tidak dihitung untuknya
   if(c.start&&k<c.start)return;
   out.push({date:k,cid:c.id,client:c.name,coach:coachId,pid:c.pid,fee:(findProgramById(c.pid)||{}).fee||0});
  });
 });
 return out;
}
function getCommissionData(days){
 const ses=getSessionAttendance(days);
 const byCoach=COACHES.map(c=>{const sc=ses.filter(x=>x.coach===c),ks=sum(sc.map(x=>x.fee));return{c,kom:ks,komSes:ks,nSes:sc.length}});
 const byProg=activePrograms().map(p=>{const sp=ses.filter(x=>x.pid===p.id);return{p,kom:sum(sp.map(x=>x.fee)),nSes:sp.length}});
 // F1.2: baris per klien — klien aktif selalu tampil (walau belum ada sesi);
 // klien non-aktif (arsip/selesai) tampil bila punya sesi pada periode ini.
 const byClient=store.clients.map(cl=>{
  const sc=ses.filter(x=>x.cid===cl.id);
  const aktif=!cl.arch&&getClientStatus(cl)!=='Selesai';
  if(!aktif&&!sc.length)return null;
  return{cl,c:cl.id,coach:cl.coach,pid:cl.pid,nSes:sc.length,kom:sum(sc.map(x=>x.fee)),fee:(findProgramById(cl.pid)||{}).fee||0};
 }).filter(Boolean);
 return{byCoach,byProg,byClient}}
// F1.4: status bayar per KLIEN + label periode (bukan per coach lagi).
// Kunci peta store.paidByClient: '<client_id>|<label periode>' — label persis
// seperti perLbl() saat pembayaran dicatat. Record pembayaran tanpa client_id
// (legacy era per-coach) tidak masuk peta ini dan tidak menandai klien mana pun.
const payKey=(clientId,per)=>clientId+'|'+per;
const payOf=(clientId,per)=>(store.paidByClient||{})[payKey(clientId,per)]||null;

export { calCell, filterTransactions, freeSlots, getCommissionData, getPendingCorrections, getReportsOf, getSessionAttendance, holdOf, hrZone, inRange, liveClients, monthly, offInfo, offLbl, offList, offOn, offSlot, payKey, payOf };
