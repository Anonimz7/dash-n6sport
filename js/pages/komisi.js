/* js/pages/komisi.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { logAct, meId, money, perm } from '../core/access.js';
import { getCommissionData } from '../core/derived.js';
import { MASK, TODAY, esc, first, fmtD, iso, num, parseDate, sum } from '../core/helpers.js';
import { icon } from '../core/icons.js';
import { ACT, CONF, FORMS, MODALS, PAGES } from '../core/registry.js';
import { locOf } from '../core/shared.js';
import { appState, findProgramById, getClientStatus, getMemberName, store } from '../core/store.js';
import { apiDel, apiSaveProgram, isApiMode } from '../core/api.js';
import { activePrograms, banner, kpi, maskNote, perBar, perLbl, pill, sheet, tabsBar } from '../ui/components.js';
import { copyToClipboard, render, toast } from '../ui/shell.js';

const progPrice=p=>appState.role==='coach'?MASK:money(p.price,'komisi');
PAGES.komisi=()=>{
 const tabs=['Ringkasan','Performa & pembayaran','Harga program & komisi'],t=Math.min(appState.tab,2),k=getCommissionData(appState.per),mine=appState.role==='coach';
 const coaches=mine?k.byCoach.filter(x=>x.c===meId()):k.byCoach;
 const tot=sum(coaches.map(x=>x.kom)),nses=sum(coaches.map(x=>x.nSes)),paid=sum(coaches.filter(x=>store.paid[x.c]).map(x=>x.kom));
 const M=v=>money(v,'komisi');let body='';
 if(t===0){
  body=`<div class="toolbar">${perBar()}<span class="sp"></span><button class="btn" data-act="copykom">${icon('copy',15)} Salin laporan</button></div>
  <div class="kpis">${kpi('Sesi hadir',nses,perLbl())}${kpi('Total komisi',M(tot),'dibayarkan ke coach')}${kpi('Sudah dibayar',M(paid),'periode berjalan')}${kpi('Belum dibayar',M(tot-paid),'menunggu pembayaran')}</div>
  <div class="tw"><table><thead><tr><th>Program</th>${mine?'':'<th class="n">Harga program</th>'}<th class="n">Komisi per sesi hadir</th><th class="n">Sesi hadir</th><th class="n">Total komisi</th></tr></thead><tbody>${k.byProg.map(x=>`<tr><td>${esc(x.p.name)}</td>${mine?'':`<td class="n">${progPrice(x.p)}</td>`}<td class="n">${M(x.p.fee)}</td><td class="n">${x.nSes}</td><td class="n">${M(x.kom)}</td></tr>`).join('')}</tbody></table></div>`}
 if(t===1){
  body=`<div class="toolbar">${perBar()}</div><div class="tw"><table><thead><tr><th>Coach</th><th class="n">Klien aktif</th><th class="n">Sesi hadir</th><th class="n">Total komisi</th><th>Pembayaran</th>${mine?'':'<th>Aksi</th>'}</tr></thead><tbody>${coaches.map(x=>`<tr><td><b>${esc(getMemberName(x.c))}</b></td><td class="n">${store.clients.filter(c=>c.coach===x.c&&!c.arch&&getClientStatus(c)!=='Selesai').length}</td><td class="n">${x.nSes}</td><td class="n"><b>${M(x.kom)}</b></td><td>${store.paid[x.c]?pill('Dibayar','good')+(store.payInfo[x.c]?`<small class="sub" style="display:block;margin-top:4px">${fmtD(parseDate(store.payInfo[x.c].date))} · ${esc(store.payInfo[x.c].method)}</small>`:''):pill('Belum dibayar','warn')}</td>${mine?'':`<td>${perm('komisi')==='full'?`${store.paid[x.c]?`<button class="btn sm" data-act="paid" data-v="${x.c}">Batalkan</button>`:`<button class="btn sm primary" style="white-space:nowrap" data-act="modal" data-v="bayar" data-id="${x.c}">Bayar komisi</button>`}`:'-'}</td>`}</tr>`).join('')}</tbody></table></div>`}
 if(t===2){
  const ed=appState.role==='owner';
  body=`${banner('Komisi per sesi hadir dihitung otomatis: setiap klien yang diabsen Hadir oleh coach menambah komisi coach sebesar nominal di kartu program. Tidak ada komisi penjualan program.','info')}${ed?banner('Harga dan komisi bebas Anda atur. Tekan Edit pada baris program untuk mengubah nama, harga, komisi, dan durasinya di jendela pop up.'):banner('Tambah, ubah, dan hapus program hanya dapat dilakukan oleh Pemilik.')}
  <div class="toolbar"><h3 style="font-size:16px">Daftar program</h3><span class="sub">${activePrograms().length} program</span><span class="sp"></span>${ed?`<button class="btn primary" data-act="modal" data-v="prog">${icon('plus',15)} Tambah program</button>`:''}</div>
  <div class="tw dt"><table><thead><tr><th>Nama program</th><th>Durasi</th>${appState.role==='coach'?'':'<th class="n">Harga program</th>'}<th class="n">Komisi per sesi hadir</th><th class="n">Klien aktif</th>${ed?'<th>Aksi</th>':''}</tr></thead><tbody>${activePrograms().map(p=>{const n=store.clients.filter(c=>!c.arch&&c.pid===p.id&&getClientStatus(c)!=='Selesai').length;
   return `<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.unit||'-')}</td>${appState.role==='coach'?'':`<td class="n mono">${progPrice(p)}</td>`}<td class="n mono">${money(p.fee,'komisi')}</td><td class="n">${n}</td>${ed?`<td><div class="acts"><button class="btn sm" data-act="modal" data-v="prog" data-id="${p.id}">${icon('edit',14)} Edit</button><button class="btn sm danger" data-act="askprog" data-v="${p.id}">${icon('trash',14)} Hapus</button></div></td>`:''}</tr>`}).join('')}</tbody></table></div>
  <div class="mlist">${activePrograms().map(p=>{const n=store.clients.filter(c=>!c.arch&&c.pid===p.id&&getClientStatus(c)!=='Selesai').length;
   return `<div class="li" style="align-items:flex-start"><div style="flex:1"><b>${esc(p.name)}</b><small>Durasi: ${esc(p.unit||'-')}</small>${appState.role==='coach'?'':`<small>Harga program: <span class="mono">${progPrice(p)}</span></small>`}<small>Komisi per sesi hadir: <span class="mono">${money(p.fee,'komisi')}</span></small></div>${pill(n+' klien aktif','info')}${ed?`<div style="width:100%"><div class="acts"><button class="btn sm" data-act="modal" data-v="prog" data-id="${p.id}">${icon('edit',14)} Edit</button><button class="btn sm danger" data-act="askprog" data-v="${p.id}">${icon('trash',14)} Hapus</button></div></div>`:''}</div>`}).join('')}</div>`}
 return `<div class="stackv">${maskNote('komisi')}${tabsBar(tabs)}${body}</div>`};
MODALS.prog=m=>{
 const p=m.id?findProgramById(m.id):{name:'',price:'',unit:'',fee:60000};if(!p)return '';
 return sheet(m.id?'Ubah program':'Tambah program',`<form data-form="prog" class="fg"><input type="hidden" name="id" value="${m.id||''}">
 <label class="field full"><span>Nama program</span><input id="f-pgn" name="name" required value="${esc(p.name)}" placeholder="Contoh: Marathon 16 Minggu"></label>
 <label class="field"><span>Harga (Rp)</span><input id="f-pgp" name="price" type="number" min="0" step="any" required value="${p.price}"></label>
 <label class="field"><span>Durasi</span><input id="f-pgu" name="unit" value="${esc(p.unit||'')}" placeholder="Contoh: 16 minggu, per bulan"></label>
  <label class="field"><span>Komisi per sesi hadir (Rp)</span><input id="f-pgf" name="fee" type="number" min="0" step="any" required value="${p.fee}"></label>
  <label class="field"><span>Jumlah peserta</span><select name="peserta"><option value="1" ${+p.peserta===2?'':'selected'}>1 orang (individu)</option><option value="2" ${+p.peserta===2?'selected':''}>2 orang (paket, satu pembayaran)</option></select></label>
 <div class="row full"><button class="btn primary" type="submit">Simpan</button><button class="btn" type="button" data-act="close">Batal</button></div></form>`)};
FORMS.prog=async f=>{
 if(appState.role!=='owner')return;
 const id=f.get('id'),name=f.get('name').trim();if(!name){toast('Nama program wajib diisi');return}
 const data={name,price:num(f.get('price')),unit:f.get('unit').trim(),fee:num(f.get('fee')),peserta:+f.get('peserta')===2?2:1,wk:4,lvl:.7};
 const mm=data.unit.match(/(\d+)\s*(minggu|mgg)/i);data.wk=mm?+mm[1]:4;
 let p;
 if(isApiMode()){
   try{p=await apiSaveProgram(id?{...data,id}:data)}
   catch(e){toast('Gagal simpan: '+e.message);return}
 }else{
   p=id&&findProgramById(id);if(!p){p={id:'p'+Date.now(),lvl:.7};store.programs.push(p)}
   Object.assign(p,data);delete p.del;
 }
 appState.syncAt=new Date();
 logAct((id?'mengubah program ':'menambah program ')+p.name);appState.modal=null;toast(id?'Program diperbarui':'Program ditambahkan');render()};
CONF.delprog=async id=>{const p=findProgramById(id);if(isApiMode()){try{await apiDel('/programs/'+id)}catch(e){toast('Gagal hapus: '+e.message);return}}p.del=true;appState.syncAt=new Date();logAct('menghapus program '+(p?p.name:id))};
MODALS.bayar=m=>{
 const c=m.id,k=getCommissionData(appState.per),x=k.byCoach.find(y=>y.c===c);if(!x||perm('komisi')!=='full')return '';
 const M=v=>money(v,'komisi'),row=(a,b,bold)=>`<tr><td>${a}</td><td class="n">${bold?'<b>'+b+'</b>':b}</td></tr>`;
 const nAkt=store.clients.filter(z=>z.coach===c&&!z.arch&&getClientStatus(z)!=='Selesai').length;
 return sheet('Pembayaran komisi coach',`<div class="idcard"><b>${esc(getMemberName(c))}</b><small>Periode ${esc(perLbl())}</small><small>Lokasi: ${esc(locOf(c))}</small></div>
 <div class="tw" style="margin-top:12px"><table><tbody>${row('Klien aktif',nAkt)}${row('Sesi hadir',x.nSes+' sesi')}${row('Total komisi dibayarkan',M(x.kom),true)}</tbody></table></div>
 <form data-form="bayar" class="fg" style="margin-top:12px"><input type="hidden" name="c" value="${c}">
 <label class="field"><span>Tanggal pembayaran</span><input id="f-paydate" name="date" type="date" required value="${iso(TODAY)}" max="${iso(TODAY)}"></label>
 <label class="field"><span>Metode pembayaran</span><select name="method"><option>Transfer bank</option><option>Tunai</option><option>E-wallet</option></select></label>
 <label class="field full"><span>Catatan (opsional)</span><input id="f-paynote" name="note" placeholder="Contoh: transfer BCA, bukti dikirim via WhatsApp"></label>
 <label class="chk full"><input type="checkbox" name="ok" required><span><b>Saya sudah memeriksa rincian komisi</b><small>Setelah dikonfirmasi, status coach berubah menjadi Dibayar dan tercatat di log.</small></span></label>
 <div class="row full"><button class="btn primary" type="submit">Konfirmasi pembayaran</button><button class="btn" type="button" data-act="close">Batal</button></div></form>`)};
FORMS.bayar=f=>{const c=f.get('c'),x=getCommissionData(appState.per).byCoach.find(y=>y.c===c);if(!x||perm('komisi')!=='full')return;
 store.paid[c]=true;store.payInfo[c]={date:f.get('date'),method:f.get('method'),note:(f.get('note')||'').trim(),amt:x.kom,per:perLbl()};
 logAct('membayar komisi '+getMemberName(c)+' ('+money(x.kom,'komisi')+', '+f.get('method')+')');appState.modal=null;toast('Pembayaran komisi '+first(getMemberName(c))+' dicatat');render()};
Object.assign(ACT,{
 askprog:t=>{const p=findProgramById(t.dataset.v),n=store.clients.filter(c=>!c.arch&&c.pid===p.id&&getClientStatus(c)!=='Selesai').length;if(n){toast(n+' klien aktif masih memakai program ini');return}appState.modal={k:'confirm',text:'Hapus program '+p.name+'? Riwayat transaksi lama tetap tersimpan.',yes:'delprog',arg:p.id,label:'Hapus program'};render()},
 per:t=>{const v=t.dataset.v;appState.per=/^\d+$/.test(v)?+v:v;render()},
 paid:t=>{const c=t.dataset.v;if(!store.paid[c]){appState.modal={k:'bayar',id:c};render();return}store.paid[c]=false;delete store.payInfo[c];logAct('membatalkan pembayaran komisi '+getMemberName(c));toast('Pembayaran dibatalkan');render()},
 copykom:()=>{const k=getCommissionData(appState.per);copyToClipboard(`Laporan komisi ${perLbl()}\n`+k.byCoach.map(x=>`${getMemberName(x.c)}: ${x.nSes} sesi hadir, komisi ${money(x.kom,'komisi')}`).join('\n'),'Laporan komisi tersalin')}
});

export { progPrice };
