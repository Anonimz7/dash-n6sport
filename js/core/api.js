/* js/core/api.js — SATU-SATUNYA modul yang boleh fetch().
   Fase B: baca dari mock API. Ganti API_BASE ke backend asli nanti;
   translasi bentuk API -> bentuk store terpusat di sini. */
import { buildSessionLogs } from './shared.js';
import { store } from './store.js';

// Basis URL backend.
const API_BASE = 'https://api.denisbergkam.com/api/dbn6sport/v1';

// Token JWT disimpan di localStorage (bertahan antar refresh).
const TOKEN_KEY = 'n6r-token';
let apiToken = null;
try { apiToken = localStorage.getItem(TOKEN_KEY) || null; } catch (e) {}
let apiMode = false;
const isApiMode = () => apiMode;
const hasToken = () => !!apiToken;

// Login: kirim kredensial, simpan token + info user.
async function apiLogin(login_id, password) {
  const login = await req('POST', '/auth/login', { login_id, password });
  apiToken = login.token;
  try {
    localStorage.setItem(TOKEN_KEY, apiToken);
    if (login.user) localStorage.setItem('n6r-user', JSON.stringify(login.user));
  } catch (e) {}
  return login;
}
// Logout: hapus token + info user.
function apiLogout() {
  apiToken = null;
  apiMode = false;
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('n6r-user'); } catch (e) {}
}
// Info user yang login (dari backend).
function apiUser() {
  try { return JSON.parse(localStorage.getItem('n6r-user') || 'null'); } catch (e) { return null; }
}

async function req(method, path, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const r = await fetch(API_BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(apiToken ? { Authorization: 'Bearer ' + apiToken } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.detail || (j.error && j.error.message) || ('HTTP ' + r.status));
    return j;
  } catch (e) {
    if (e && e.name === 'AbortError') throw new Error('Timeout: server tidak merespons dalam 10 detik');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
const apiGet = p => req('GET', p).then(j => j.data);
const apiPost = (p, b) => req('POST', p, b).then(j => j.data);
const apiPatch = (p, b) => req('PATCH', p, b).then(j => j.data);
const apiDel = p => req('DELETE', p);

// ---------- translasi: bentuk API -> bentuk store frontend ----------
const D = s => (s ? new Date(s) : null);
const tClient = c => {
  const o = { ...c, pid: c.program_id, coach: c.coach_id, sw: c.share_url };
  delete o.program_id; delete o.coach_id; delete o.share_url;
  return o;
};
const tReport = (r, uidById) => {
  const o = { ...r, cid: r.client_id, plan: r.plan_km, fix: null };
  delete o.client_id; delete o.plan_km;
  if (r.correction) o.fix = { by: r.correction.by, text: r.correction.text, at: r.correction.at ? new Date(r.correction.at) : null };
  delete o.correction;
  if (!o.missed && uidById[o.cid]) o.sw = 'https://numbersix.example/sw/' + uidById[o.cid] + '/' + o.date;
  return o;
};
const tTx = t => {
  const o = { ...t, pid: t.program_id, cat: t.category, coach: t.coach_id, amt: t.amount };
  delete o.program_id; delete o.category; delete o.coach_id; delete o.amount;
  return o;
};
const tBooking = b => ({ id: b.id, coach: b.coach_id, client: b.client_id, day: b.day, time: b.time });
const tRequest = r => ({ ...r, at: D(r.date + 'T00:00:00') });
const tMsg = m => ({ ...m, t: D(m.t) });
const tActivity = a => ({ ...a, t: D(a.t) });

// ---------- boot: pakai token tersimpan; 401 -> butuh login ulang ----------
async function apiBoot() {
  if (!apiToken) { apiMode = false; return false; }
  try {
    const [members, programs, clients, tx, reqs, team, bcs, settings, tpl, activity, sched] = await Promise.all([
      apiGet('/members'),
      apiGet('/programs'),
      apiGet('/clients?status=semua'),
      apiGet('/transactions'),
      apiGet('/requests'),
      apiGet('/messages/team'),
      apiGet('/messages/broadcasts'),
      apiGet('/settings'),
      apiGet('/correction-templates'),
      apiGet('/activity'),
      req('GET', '/schedule'),
    ]);
    const repLists = await Promise.all(clients.map(c => apiGet('/clients/' + c.id + '/reports').catch(() => [])));
    const dmLists = await Promise.all(clients.map(c => apiGet('/messages/dm/' + c.id).catch(() => [])));
    // isi store (bentuk frontend)
    store.members = members;
    store.programs = programs;
    store.clients = clients.map(tClient);
    const uidById = {};
    store.clients.forEach(c => { uidById[c.id] = c.uid; });
    store.reports = repLists.flat().map(r => tReport(r, uidById));
    store.tx = tx.map(tTx);
    store.reqs = reqs.map(tRequest);
    const nAktif = store.clients.filter(c => !c.arch).length;
    store.msgs = {
      team: team.map(tMsg),
      dm: Object.fromEntries(clients.map((c, i) => [c.id, dmLists[i].map(tMsg)])),
      bc: bcs.map(b => ({ ...tMsg(b), n: b.n || nAktif })),
    };
    store.targets = settings.targets;
    store.acl = settings.acl;
    store.tpl = tpl;
    store.log = activity.map(tActivity);
    store.pattern = sched.patterns;
    store.book = (sched.bookings || []).map(tBooking);
    store.paid = {};
    store.payInfo = {};
    buildSessionLogs();
    apiMode = true;
    return true;
  } catch (e) {
    // token basi/invalid -> paksa login ulang
    if (String((e && e.message) || e).includes('401')) apiLogout();
    apiMode = false;
    try { window.__apiErr = String((e && e.message) || e); } catch (x) {}
    return false;
  }
}

export { API_BASE, apiBoot, apiDel, apiGet, apiPatch, apiPost, isApiMode, hasToken, apiLogin, apiLogout, apiUser,
  apiSaveClient, apiSaveTransaction, apiAddMember, apiSendTeamMessage, apiSendDm,
  apiSendBroadcast, apiSendPortalMessage, apiSubmitCorrection, apiLog };

// ---------- tulis (Fase C): panggil API lalu selaraskan store lokal ----------
function upsert(arr, o) {
  const i = arr.findIndex(x => x.id === o.id);
  if (i >= 0) arr[i] = o; else arr.push(o);
  return o;
}
// d: {id?, name, program_id, start, coach_id} -> client bentuk frontend (sudah di store)
async function apiSaveClient(d) {
  const body = { ...d };
  delete body.id;
  const raw = d.id ? await apiPatch('/clients/' + d.id, body) : await apiPost('/clients', body);
  return upsert(store.clients, tClient(raw));
}
// d: {date, type, category, amount, desc, program_id?, coach_id?} -> tx bentuk frontend
async function apiSaveTransaction(d) {
  const t = tTx(await apiPost('/transactions', d));
  return upsert(store.tx, t);
}
async function apiAddMember(d) {
  const m = await apiPost('/members', d);
  return upsert(store.members, m);
}
async function apiSendTeamMessage(text) {
  const m = tMsg(await apiPost('/messages/team', { text }));
  store.msgs.team.push(m);
  return m;
}
async function apiSendDm(cid, text, w) {
  const m = tMsg(await apiPost('/messages/dm/' + cid, { text }));
  (store.msgs.dm[cid] = store.msgs.dm[cid] || []).push(m);
  return m;
}
async function apiSendBroadcast(to, text, n) {
  const b = await apiPost('/messages/broadcasts', { to, text });
  const o = { ...tMsg(b), n: n || 0 };
  store.msgs.bc.unshift(o);
  return o;
}
// portal publik (tanpa token pun boleh)
async function apiSendPortalMessage(uid, cid, text) {
  const m = tMsg(await apiPost('/portal/' + uid + '/messages', { text }));
  (store.msgs.dm[cid] = store.msgs.dm[cid] || []).push(m);
  return m;
}
// -> {by, text, at:Date}
async function apiSubmitCorrection(reportId, text) {
  const r = await apiPost('/reports/' + reportId + '/correction', { text });
  const c = r.correction || {};
  return { by: c.by, text: c.text, at: c.at ? new Date(c.at) : new Date() };
}
// fire-and-forget (dipakai logAct)
function apiLog(text) {
  return apiPost('/activity', { text }).catch(() => null);
}
