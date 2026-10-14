/* js/core/access.js — diekstrak otomatis dari index.html (fase 4 refactor) */
import { ROLE_USER_IDS } from './constants.js';
import { MASK, formatJuta, formatRupiah } from './helpers.js';
import { appState, store } from './store.js';

const perm=m=>appState.role==='owner'?'full':((store.acl[appState.role]||{})[m]||'none');
const canAccess=m=>perm(m)!=='none';
const money=(n,m='keuangan')=>perm(m)==='full'?formatRupiah(n):MASK;
const moneyJt=(n,m='keuangan')=>perm(m)==='full'?formatJuta(n):MASK;
const meId=()=>ROLE_USER_IDS[appState.role];
const meUser=()=>store.members.find(m=>m.id===meId());
const scope=a=>appState.role==='coach'?a.filter(c=>c.coach===ROLE_USER_IDS.coach):a;
const logAct=text=>{store.log.unshift({t:new Date(),who:meUser().name,text});store.log=store.log.slice(0,30);appState.syncAt=new Date();try{if(logSink)logSink(text)}catch(e){}};
let logSink=null;
const setLogSink=fn=>{logSink=fn};

export { canAccess, logAct, meId, meUser, money, moneyJt, perm, scope, setLogSink };
