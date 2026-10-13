/* js/pages/klien.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { canAccess, logAct, scope } from '../core/access.js';
import { COACHES, CONDC, ROLE_USER_IDS } from '../core/constants.js';
import { TODAY, addD, esc, first, fmtD, formatRupiah, hhmm, iso, parseDate, slug } from '../core/helpers.js';
import { icon } from '../core/icons.js';
import { ACT, CONF, FORMS, MODALS, PAGES } from '../core/registry.js';
import { appState, findClientById, findProgramById, getClientEndDate, getClientStatus, getMemberName, nextClientUid, store } from '../core/store.js';
import { cdashBody } from '../portal/cdash.js';
import { clientUrl, isValidShareUrl } from '../portal/links.js';
import { activePrograms, banner, pill, sheet, statusPill, tabsBar } from '../ui/components.js';
import { awaitLogo, logoImg } from '../ui/pdf.js';
import { copyToClipboard, render, toast } from '../ui/shell.js';

const kact=(c,arch)=>appState.role==='coach'?'':`<div class="acts"><button class="btn sm" data-act="clink" data-v="${c.id}">${icon('link',14)} Link</button>${arch?`<button class="btn sm" data-act="restore" data-v="${c.id}">Pulihkan</button><button class="btn sm danger" data-act="askdel" data-v="${c.id}">Hapus</button>`:`<button class="btn sm" data-act="modal" data-v="cdash" data-id="${c.id}">${icon('klien',14)} Dashboard</button><button class="btn sm" data-act="modal" data-v="client" data-id="${c.id}">${icon('edit',14)} Edit</button><button class="btn sm" data-act="archive" data-v="${c.id}">Arsipkan</button><button class="btn sm danger" data-act="askdel" data-v="${c.id}">${icon('trash',14)} Hapus</button>`}</div>`;
PAGES.klien=()=>{
 const arch=appState.tab===1,q=appState.q.toLowerCase();
 const all=scope(store.clients),list=all.map((c,i)=>({c,i})).filter(x=>!!x.c.arch===arch&&x.c.name.toLowerCase().includes(q)&&(arch||appState.cf==='all'||getClientStatus(x.c)===appState.cf)).sort((a,b)=>((b.c.reg||0)-(a.c.reg||0))||(a.c.start<b.c.start?1:a.c.start>b.c.start?-1:0)||(b.i-a.i)).map(x=>x.c);
 const canEdit=appState.role!=='coach';
 const rows=list.map(c=>{
  const p=findProgramById(c.pid),left=c.arch?7-Math.round((TODAY-parseDate(c.arch))/864e5):0;
  return `<tr><td><b>${esc(c.name)}</b><small class="mono">${esc(c.uid)} <button class="btn sm ghost" data-act="copyuid" data-v="${c.uid}" aria-label="Salin ID ${esc(c.name)}">${icon('copy',13)}</button></small><small><i class="cdot" style="background:var(${CONDC[c.cond]})"></i> ${c.cond}</small></td><td>${esc(p.name)}</td><td class="mono">${fmtD(c.start)} - ${fmtD(getClientEndDate(c))}</td><td>${esc(first(getMemberName(c.coach)))}</td><td>${arch?pill('Hapus dalam '+Math.max(0,left)+' hari','warn'):statusPill(getClientStatus(c))}</td>
  ${canEdit?`<td>${kact(c,arch)}</td>`:''}</tr>`}).join('');
 const mlist=list.map(c=>{const p=findProgramById(c.pid),left=c.arch?7-Math.round((TODAY-parseDate(c.arch))/864e5):0;return `<div class="li" style="align-items:flex-start"><div style="flex:1"><b>${esc(c.name)}</b><small class="mono">${esc(c.uid)} <button class="btn sm ghost" data-act="copyuid" data-v="${c.uid}" aria-label="Salin ID ${esc(c.name)}">${icon('copy',13)}</button></small><small>${esc(p.name)}</small><small class="mono">${fmtD(c.start)} - ${fmtD(getClientEndDate(c))} · ${esc(first(getMemberName(c.coach)))}</small></div>${arch?pill('Hapus dalam '+Math.max(0,left)+' hari','warn'):statusPill(getClientStatus(c))}${canEdit?`<div style="width:100%">${kact(c,arch)}</div>`:''}</div>`}).join('');
 return `<div class="stackv">${tabsBar(['Daftar klien','Arsip'])}
 ${arch?banner('Klien yang diarsipkan dihapus permanen setelah 7 hari. Pulihkan sebelum batas waktu.'):''}
 <div class="toolbar"><input id="q" data-q type="search" placeholder="Cari nama klien" value="${esc(appState.q)}" aria-label="Cari klien">${arch?'':`<select data-f="cf" aria-label="Filter status"><option value="all">Semua status</option>${['Aktif','Segera berakhir','Jeda','Selesai'].map(s=>`<option ${appState.cf===s?'selected':''}>${s}</option>`).join('')}</select>`}<span class="sp"></span>${canEdit&&!arch?`<button class="btn primary" data-act="modal" data-v="client">${icon('plus',15)} Tambah klien</button>`:''}</div>
 <div class="tw dt"><table><thead><tr><th>Nama</th><th>Paket</th><th>Mulai - selesai</th><th>Coach</th><th>Status</th>${canEdit?'<th>Aksi</th>':''}</tr></thead><tbody>${rows||`<tr><td colspan="${canEdit?6:5}" class="sub">Tidak ada klien yang cocok.</td></tr>`}</tbody></table></div><div class="mlist">${mlist||'<p class="sub">Tidak ada klien yang cocok.</p>'}</div></div>`};
MODALS.client=m=>{
 const c=m.id?findClientById(m.id):{name:'',pid:activePrograms()[0].id,start:iso(TODAY),pbNow:'',pbTarget:''};
 const programOrDefault=findProgramById(c.pid)||activePrograms()[0],endV=c.end||iso(addD(parseDate(c.start),programOrDefault.wk*7));
 return sheet(m.id?'Ubah klien':'Tambah klien',`<form data-form="client" class="fg"><input type="hidden" name="id" value="${m.id||''}">
 <label class="field full"><span>Nama klien</span><input id="f-cname" name="name" required value="${esc(c.name)}"></label>
 <label class="field full"><span>Pilih program</span><select name="pid" data-cform>${activePrograms().map(p=>`<option value="${p.id}" ${p.id===c.pid?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>
 <div class="idcard full"><small>Harga program</small><b id="pricebox" class="mono" style="font-size:20px">${formatRupiah(programOrDefault.price)}</b><small id="priceunit">${esc(programOrDefault.unit||'')}</small></div>
 <label class="field"><span>Tanggal mulai</span><input name="start" type="date" required value="${c.start}" data-cform></label>
 <label class="field"><span>Tanggal selesai</span><input name="end" type="date" required value="${endV}" data-cform ${c.end?'data-touched="1"':''}></label>
 <label class="field"><span>PB awal (mm:ss atau j:mm:ss)</span><input id="f-pbawal" name="pbNow" value="${esc(c.pbNow||'')}" placeholder="Contoh: 4:25:00"></label>
 <label class="field"><span>PB akhir / target</span><input id="f-pbakhir" name="pbTarget" value="${esc(c.pbTarget||'')}" placeholder="Contoh: 4:00:00"></label>
 <label class="field full"><span>Link smartwatch klien (opsional)</span><input id="f-csw" name="sw" type="url" value="${esc(c.sw||'')}" placeholder="https://..."></label>
 <div class="row full"><button class="btn primary" type="submit">Simpan</button><button class="btn" type="button" data-act="dlinvoice">${icon('download',15)} Cetak invoice (JPG)</button><button class="btn" type="button" data-act="close">Batal</button></div></form>`)};
function clientFormSync(t){
 const f=t.closest('form');if(!f)return;const p=findProgramById(f.elements.pid.value);if(!p)return;
 const pb=f.querySelector('#pricebox'),pu=f.querySelector('#priceunit');if(pb)pb.textContent=formatRupiah(p.price);if(pu)pu.textContent=p.unit||'';
 if(t.name==='end'){t.dataset.touched='1';return}
 if(t.name==='pid'||t.name==='start'){const st=f.elements.start.value,en=f.elements.end;if(st&&!en.dataset.touched)en.value=iso(addD(parseDate(st),p.wk*7))}
}
FORMS.client=f=>{
 const id=f.get('id'),start=f.get('start'),end=f.get('end');
 if(end<start){toast('Tanggal selesai tidak boleh sebelum tanggal mulai');return}
 const swv=(f.get('sw')||'').trim();if(swv&&!isValidShareUrl(swv)){toast('Link smartwatch harus diawali http:// atau https://');return}
 let c;
 if(id){c=findClientById(id)}else{c={id:'cl'+(store.clients.length+1+Math.floor(Math.random()*900)),uid:nextClientUid(),hrmax:188,mp:360,renew:false,arch:null,reg:Date.now(),cond:'Prima',coach:appState.role==='coach'?ROLE_USER_IDS.coach:COACHES[0]};store.clients.push(c)}
 c.name=f.get('name').trim();c.pid=f.get('pid');c.start=start;c.end=end;c.pbNow=(f.get('pbNow')||'').trim();c.pbTarget=(f.get('pbTarget')||'').trim();c.sw=swv;
 if(appState.role==='coach')c.coach=ROLE_USER_IDS.coach;
 /* pemasukan otomatis: klien baru = transaksi masuk sebesar harga program (tercatat hari ini) */
 const pg=findProgramById(c.pid);let inc='';
 if(pg){
  if(!id){store.tx.push({id:'t'+Date.now(),date:iso(TODAY),type:'in',pid:pg.id,cat:pg.name,coach:c.coach,desc:c.name,amt:pg.price,cid:c.id});inc=' Pemasukan program tercatat di Keuangan.'}
  else{const x=store.tx.find(t=>t.cid===c.id);if(x){x.desc=c.name;x.coach=c.coach;if(x.pid!==pg.id){x.pid=pg.id;x.cat=pg.name;x.amt=pg.price;inc=' Pemasukan di Keuangan ikut diperbarui.'}}}
 }
 logAct((id?'memperbarui klien ':'menambah klien ')+c.name);appState.modal=null;toast('Klien disimpan dan tersinkron.'+inc);render()};
function invoiceCanvas(d){
 const W=1080,SC=2,H=1180,tx=60,tw=960,cv=document.createElement('canvas');cv.width=W*SC;cv.height=H*SC;const g=cv.getContext('2d');g.scale(SC,SC);
 const F=(w,z)=>w+' '+z+'px Montserrat, Arial, sans-serif',rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
 const card=(x,y,w,h,r)=>{g.save();g.shadowColor='rgba(11,22,48,.10)';g.shadowBlur=26;g.shadowOffsetY=8;g.fillStyle='#fff';rr(x,y,w,h,r);g.fill();g.restore()};
 const ls=v=>{try{g.letterSpacing=v}catch(e){}};
 const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#F3F6FD');bg.addColorStop(.6,'#F8F9FD');bg.addColorStop(1,'#FFF4EA');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.textBaseline='alphabetic';g.textAlign='left';
 card(tx,36,tw,118,28);
 const im=logoImg(),lh=60,lw=lh*1393/657;
 if(im&&im.complete&&im.naturalWidth){const lt=document.createElement('canvas');lt.width=im.naturalWidth;lt.height=im.naturalHeight;const lg=lt.getContext('2d');lg.drawImage(im,0,0);lg.globalCompositeOperation='source-in';lg.fillStyle='#0B1630';lg.fillRect(0,0,lt.width,lt.height);g.drawImage(lt,tx+28,36+(118-lh)/2,lw,lh)}
 else{g.fillStyle='#0B1630';g.font='italic 800 56px Montserrat, Arial, sans-serif';g.fillText('N6',tx+28,112)}
 const hx=tx+28+lw+26;g.fillStyle='#E3E8F2';g.fillRect(hx-14,62,2,66);
 g.fillStyle='#0B1630';g.font=F(800,25);ls('0.5px');g.fillText('NUMBER SIX - RUNNING',hx+4,92);ls('0px');
 g.fillStyle='#6B778C';g.font=F(600,15);ls('2px');g.fillText('COACHING LARI',hx+4,120);ls('0px');
 g.textAlign='right';g.fillStyle='#FF6A13';g.font=F(800,34);ls('3px');g.fillText('INVOICE',tx+tw-28,104);ls('0px');g.textAlign='left';
 let y=214;
 g.fillStyle='#6B778C';g.font=F(700,14);ls('2px');g.fillText('DITAGIHKAN KEPADA',tx,y);g.textAlign='right';g.fillText('NO. INVOICE',tx+tw,y);ls('0px');g.textAlign='left';
 g.fillStyle='#0B1630';g.font=F(800,40);g.fillText(d.name,tx,y+52);
 g.textAlign='right';g.font=F(800,26);g.fillText(d.no,tx+tw,y+46);g.fillStyle='#55637E';g.font=F(600,18);g.fillText('Terbit '+fmtD(TODAY)+' '+TODAY.getFullYear(),tx+tw,y+78);g.textAlign='left';
 g.fillStyle='#55637E';g.font=F(600,18);g.fillText('ID klien '+d.uid,tx,y+84);
 y=372;card(tx,y,tw,330,28);
 g.fillStyle='#0B1630';rr(tx+24,y+24,tw-48,46,12);g.fill();g.fillStyle='#fff';g.font=F(700,14);ls('1px');g.fillText('PROGRAM',tx+44,y+53);g.textAlign='right';g.fillText('HARGA',tx+tw-44,y+53);ls('0px');g.textAlign='left';
 g.fillStyle='#0B1630';g.font=F(800,28);g.fillText(d.prog,tx+44,y+120);
 g.fillStyle='#55637E';g.font=F(600,18);g.fillText(d.unit||'',tx+44,y+150);
 g.fillText('Periode: '+fmtD(d.start)+' '+parseDate(d.start).getFullYear()+' - '+fmtD(d.end)+' '+parseDate(d.end).getFullYear(),tx+44,y+182);
 g.textAlign='right';g.fillStyle='#0B1630';g.font=F(800,28);g.fillText(formatRupiah(d.price),tx+tw-44,y+120);g.textAlign='left';
 g.fillStyle='#E3E8F2';g.fillRect(tx+44,y+212,tw-88,2);
 g.fillStyle='#55637E';g.font=F(600,18);g.fillText('Personal Best (PB)',tx+44,y+252);g.fillStyle='#0B1630';g.font=F(700,20);
 g.fillText((d.pbNow||'-')+'  →  '+(d.pbTarget||'-'),tx+44,y+286);
 y=738;const kg=g.createLinearGradient(tx,0,tx+tw,0);kg.addColorStop(0,'#FF6A13');kg.addColorStop(1,'#FFA24A');
 g.save();g.shadowColor='rgba(255,106,19,.35)';g.shadowBlur=24;g.shadowOffsetY=10;g.fillStyle=kg;rr(tx,y,tw,130,28);g.fill();g.restore();
 g.fillStyle='#fff';g.font=F(700,20);ls('2px');g.fillText('TOTAL TAGIHAN',tx+40,y+54);ls('0px');g.font=F(800,50);g.textAlign='right';g.fillText(formatRupiah(d.price),tx+tw-40,y+88);g.textAlign='left';
 y=906;card(tx,y,tw,150,28);
 g.fillStyle='#0B1630';g.font=F(800,22);g.fillText('Informasi pembayaran',tx+36,y+52);
 g.fillStyle='#55637E';g.font=F(500,18);g.fillText('Mohon konfirmasi pembayaran ke admin Number Six Running.',tx+36,y+90);g.fillText('Terima kasih sudah berlatih bersama kami.',tx+36,y+120);
 g.textAlign='center';g.fillStyle='#8592A8';g.font=F(500,14);g.fillText('Invoice ini dibuat otomatis pada '+fmtD(TODAY)+' '+hhmm(new Date()),W/2,H-40);
 return cv}
ACT.dlinvoice=async()=>{
 const f=document.querySelector('.sheet form[data-form="client"]');if(!f)return;
 if(!f.reportValidity())return;
 try{
  const fd=new FormData(f),p=findProgramById(fd.get('pid')),id=fd.get('id'),k=id?findClientById(id):null,uid=k?k.uid:nextClientUid();
  const d={name:fd.get('name').trim(),uid,no:'INV-'+iso(TODAY).replace(/-/g,'')+'-'+uid.replace('N6-',''),prog:p.name,unit:p.unit,price:p.price,start:fd.get('start'),end:fd.get('end'),pbNow:(fd.get('pbNow')||'').trim(),pbTarget:(fd.get('pbTarget')||'').trim()};
  try{await Promise.all(['500','600','700','800'].map(w=>document.fonts.load(w+' 20px Montserrat')))}catch(e){}await awaitLogo();
  const cv=invoiceCanvas(d),a=document.createElement('a');a.href=cv.toDataURL('image/jpeg',.92);a.download='invoice-'+slug(d.name)+'-'+iso(TODAY)+'.jpg';document.body.appendChild(a);a.click();a.remove();
  logAct('mencetak invoice '+d.name);toast('Invoice diunduh sebagai JPG');
 }catch(e){console.error(e);toast('Gagal membuat invoice')}
};
Object.assign(ACT,{
 clink:t=>{const c=findClientById(t.dataset.v);copyToClipboard(clientUrl(c),'Link dashboard klien tersalin')},
 archive:t=>{const c=findClientById(t.dataset.v);c.arch=iso(TODAY);logAct('mengarsipkan klien '+c.name);toast(c.name+' dipindah ke arsip');render()},
 restore:t=>{const c=findClientById(t.dataset.v);c.arch=null;logAct('memulihkan klien '+c.name);toast('Klien dipulihkan');render()},
 askdel:t=>{appState.modal={k:'confirm',text:'Hapus permanen '+findClientById(t.dataset.v).name+'? Data klien tidak dapat dikembalikan.',yes:'delcl',arg:t.dataset.v,label:'Hapus permanen'};render()}
});
CONF.delcl=id=>{const c=findClientById(id);store.clients=store.clients.filter(x=>x.id!==id);store.book=store.book.filter(b=>b.client!==id);store.reports=store.reports.filter(r=>r.cid!==id);logAct('menghapus klien '+c.name)};
MODALS.cdash=m=>{const c=findClientById(m.id);return c?sheet('Dashboard klien',cdashBody(c)):''};
FORMS.cdash=f=>{
 const c=findClientById(f.get('cid')),u=(f.get('url')||'').trim(),dt=f.get('date')||'';
 if(!c)return;
 if(!isValidShareUrl(u)){toast('Link harus diawali http:// atau https://');return}
 if(!/^\d{4}-\d\d-\d\d$/.test(dt)||parseDate(dt)>TODAY||dt<c.start){toast('Pilih tanggal latihan dari tanggal mulai program sampai hari ini');return}
 store.swLinks=store.swLinks||[];const i=store.swLinks.findIndex(x=>x.cid===c.id&&x.date===dt),rec={cid:c.id,date:dt,url:u,at:new Date()};
 if(i>=0)store.swLinks[i]=rec;else store.swLinks.push(rec);
 if(f.get('reg'))c.sw=u;
 const has=store.reports.some(r=>r.cid===c.id&&r.date===dt&&!r.missed);
 logAct('menerima link hasil latihan '+c.name+' ('+fmtD(dt)+')');
 toast(has?'Link tanggal '+fmtD(dt)+' terkirim ke coach':'Link tersimpan. Belum ada laporan latihan tanggal '+fmtD(dt)+', link tampil di Koreksi saat laporan masuk');
 appState.modal=appState.cview?null:{k:'cdash',id:c.id};render()};
FORMS.cdmsg=f=>{
 const c=findClientById(f.get('cid')),t=(f.get('text')||'').trim();if(!c||!t)return;
 (store.msgs.dm[c.id]=store.msgs.dm[c.id]||[]).push({w:c.id,text:t,t:new Date()});
 logAct('menerima pesan dari klien '+c.name);toast('Pesan terkirim ke tim');appState.focus={id:'f-cdmsg',pos:0};appState.modal=appState.cview?null:{k:'cdash',id:c.id};render()};
ACT.cdtab=t=>{appState.cdTab=+t.dataset.v;render()};
ACT.cdday=t=>{const i=document.getElementById('f-cddate');if(i){const c=findClientById(appState.cview)||null,v=iso(addD(TODAY,-(+t.dataset.v)));i.value=c&&v<c.start?c.start:v}};
ACT.cdpaste=async()=>{const i=document.getElementById('f-cdurl');try{const v=(await navigator.clipboard.readText()||'').trim();if(i&&v){i.value=v;toast('Link ditempel')}else toast('Clipboard kosong')}catch(e){toast('Tempel manual: tekan lama di kolom link')}};
ACT.openchat=t=>{if(!canAccess('pesan'))return;appState.chat=t.dataset.v;appState.page='pesan';appState.tab=1;appState.modal=null;appState.nav=false;render(false)};
MODALS.confirm=m=>sheet('Konfirmasi',`<p>${esc(m.text)}</p><div class="row"><button class="btn primary" data-act="yes">${esc(m.label||'Ya, lanjutkan')}</button><button class="btn" data-act="close">Batal</button></div>`);

export { clientFormSync, invoiceCanvas, kact };
