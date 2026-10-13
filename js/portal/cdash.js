/* js/portal/cdash.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { canAccess } from '../core/access.js';
import { TODAY, esc, first, fmtD, fullD, hhmm, iso, parseDate } from '../core/helpers.js';
import { icon } from '../core/icons.js';
import { senderName } from '../core/shared.js';
import { appState, findProgramById, getClientEndDate, getClientStatus, getMemberName, store } from '../core/store.js';
import { clientUrl, shareLinkAnchor } from './links.js';
import { pill, statusPill } from '../ui/components.js';

const cdashBody=c=>{
 const sent={};store.reports.forEach(r=>{if(r.cid===c.id&&r.sw)sent[r.date]=r.sw});(store.swLinks||[]).forEach(x=>{if(x.cid===c.id)sent[x.date]=x.url});
 const sentL=Object.keys(sent).sort().reverse().slice(0,5);
 const inbox=store.reports.filter(r=>r.cid===c.id&&r.fix).sort((a,b)=>new Date(b.fix.at)-new Date(a.fix.at)).slice(0,6);
 const th=(store.msgs.dm[c.id]||[]).filter(x=>!String(x.text).startsWith('Koreksi '));
 const bub=th.map(x=>{const mine=x.w===c.id;return `<div class="bub ${mine?'me':''}"><small>${mine?'Anda':esc(senderName(x.w))} · ${hhmm(new Date(x.t))}</small>${esc(x.text)}</div>`}).join('')||'<p class="sub">Belum ada pesan.</p>';
 const ct=appState.cdTab||0;
 const tb=`<nav class="tabs cptabs" role="tablist" aria-label="Menu dashboard klien">${[['Setor Link',sentL.length],['Koreksi Coach',inbox.length],['Pesan',th.length]].map(([l,n],k)=>`<button role="tab" data-act="cdtab" data-v="${k}" aria-selected="${ct===k}">${l} <span class="pill info">${n}</span></button>`).join('')}</nav>`;
 return `${tb}
 <div class="cpinfo"><div class="cpn"><b>${esc(c.name)}</b><span>${esc(findProgramById(c.pid).name)}</span></div><div class="cpd"><div><small>Tanggal mulai</small><b>${fullD(c.start)}</b></div><div><small>Tanggal selesai</small><b>${fullD(getClientEndDate(c))}</b></div></div><div class="row">${statusPill(getClientStatus(c))}${getClientStatus(c)==='Aktif'||getClientStatus(c)==='Segera berakhir'?`<span class="sub">sisa ${Math.max(0,Math.round((parseDate(getClientEndDate(c))-TODAY)/864e5))} hari</span>`:''}<span class="sub">· Coach ${esc(first(getMemberName(c.coach)))}</span></div>${appState.cview?'':`<small class="mono" style="word-break:break-all">${esc(clientUrl(c))} <button class="btn sm ghost" data-act="clink" data-v="${c.id}" aria-label="Salin link dashboard">${icon('copy',13)}</button></small>`}</div>
 ${ct===0?`<section class="card"><header class="ch"><h3>Setor link hasil latihan</h3><span class="sub">Pilih tanggal latihan lalu tempel link smartwatch</span></header><form data-form="cdash" class="fg"><input type="hidden" name="cid" value="${c.id}">
 <div class="field full"><span>Tanggal latihan</span><input id="f-cddate" name="date" type="date" required value="${iso(TODAY)}" min="${c.start}" max="${iso(TODAY)}"><div class="row" style="margin-top:6px"><button type="button" class="btn sm" data-act="cdday" data-v="0">Hari ini</button><button type="button" class="btn sm" data-act="cdday" data-v="1">Kemarin</button></div></div>
 <div class="field full"><span>Link smartwatch</span><div class="row" style="flex-wrap:nowrap"><input id="f-cdurl" name="url" type="url" inputmode="url" autocapitalize="off" required placeholder="https://..."><button type="button" class="btn" data-act="cdpaste">Tempel</button></div></div>
 <label class="chk full"><input type="checkbox" name="reg" checked><span><b>Simpan juga sebagai link terdaftar</b><small>Tampil di profil klien pada menu Koreksi.</small></span></label>
 <div class="row full"><button class="btn primary cpbtn" type="submit">${icon('send',16)} Setor ke coach</button></div></form>
 ${sentL.length?`<div class="listv">${sentL.map(k=>`<div class="li"><div><b>${fmtD(k)}</b><small style="word-break:break-all">${shareLinkAnchor(sent[k])}</small></div>${pill('Terkirim','good')}</div>`).join('')}</div>`:''}</section>`:''}
 ${ct===1?`<section class="card"><header class="ch"><h3>Koreksi dari coach</h3><span class="sub">${inbox.length} terbaru</span></header><div class="listv">${inbox.map(r=>`<div class="li"><div><b>${esc(r.type)} · ${fmtD(r.date)}</b><small>${esc(r.fix.text)}</small><small class="mono">${esc(getMemberName(r.fix.by))} · ${fmtD(new Date(r.fix.at))} ${hhmm(new Date(r.fix.at))}</small></div></div>`).join('')||'<p class="sub">Belum ada koreksi.</p>'}</div></section>`:''}
 ${ct===2?`<section class="card"><header class="ch"><h3>Pesan</h3><span class="sub">Terhubung ke menu Pesan Pemilik, Admin, Head Coach, dan coach</span></header><div class="chat">${bub}</div>
 <form data-form="cdmsg" class="row cpsend" style="flex-wrap:nowrap"><input type="hidden" name="cid" value="${c.id}"><input id="f-cdmsg" name="text" required autocomplete="off" enterkeyhint="send" placeholder="Tulis pesan ke tim Number Six" aria-label="Tulis pesan"><button class="btn primary" type="submit" aria-label="Kirim">${icon('send',16)}</button></form>
 ${!appState.cview&&canAccess('pesan')?`<div class="row"><button class="btn sm" data-act="openchat" data-v="${c.id}">Buka di menu Pesan</button></div>`:''}</section>`:''}`};

export { cdashBody };
