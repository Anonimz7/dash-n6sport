# Peta Button Aplikasi dash-n6sport

Dipetakan: 2026-10-11 | Untuk uji silang semua tier

## OWNER (11 panel)

### Navigasi
| Panel | ID |
|-------|-----|
| home | Beranda |
| klien | Klien |
| jadwal-klien | Jadwal Klien |
| jadwal-coach | Jadwal Coach |
| harga | Harga & Program |
| komisi | Performa & Komisi |
| keuangan | Keuangan |
| tiket | Tiket & Keluhan |
| chat | Pesan |
| akun | Kelola Anggota |
| sandi | Ganti Password |

### Aksi per Panel
**Beranda (home):**
- [ ] Ekspor CSV (analyticsExport)
- [ ] Batas Indikator (openKpiSettings) → Simpan batas / Kosongkan batas
- [ ] Lihat Performa Tim → switchPanel komisi
- [ ] Buka Jadwal Coach → switchPanel jadwal-coach
- [ ] Buka Semua Pesan → switchPanel chat

**Klien:**
- [ ] + Tambah Klien (btnTambahKlien) → form → Simpan
- [ ] Subtab: Klien Aktif / Arsip
- [ ] openClientDetail(id) → Detail → Edit / Hapus / Arsipkan
- [ ] restoreArchivedClient(id)
- [ ] deleteArchivedClient(id)
- [ ] downloadInvoice(id)
- [ ] copyClientLink(id)

**Jadwal Klien:**
- [ ] (kalender, tambah/edit/hapus jadwal)

**Jadwal Coach:**
- [ ] Perbarui Jadwal (n6SyncRefresh)
- [ ] Lihat keterangan (toggleCoachGuide)
- [ ] Subtab: Jadwal & Ketersediaan / Daftar Coach
- [ ] openSlotModal → tambah slot
- [ ] toggleCoachDayOff(coachId, date)
- [ ] editCoach / deleteCoach

**Harga & Program:**
- [ ] Tambah/edit/hapus paket harga
- [ ] openProgramForm

**Komisi:**
- [ ] reviseTeamPayment

**Keuangan:**
- [ ] Tambah pemasukan/pengeluaran
- [ ] deleteExpense

**Tiket:**
- [ ] convertAutoTicket
- [ ] Balas/tutup tiket

**Chat:**
- [ ] openChatModal → kirim pesan

**Kelola Anggota (akun):**
- [ ] Tambah anggota (pilih tier)
- [ ] Edit tier anggota
- [ ] Hapus anggota

**Ganti Password (sandi):**
- [ ] Form ganti password → Simpan

---

## ADMIN (8 panel)

### Navigasi
home, klien, jadwal-klien, jadwal-coach, harga, tiket, chat, sandi

### Aksi per Panel
**Beranda:** Ekspor CSV, Batas Indikator (n6TargetsBtn → n6SaveTargets)
**Klien:** + Tambah Klien, openClientDetail, restore/deleteArchivedClient, downloadInvoice, copyClientLink
**Jadwal Coach:** n6SyncRefresh, openSlotModal, toggleCoachDayOff, editCoach/deleteCoach
**Harga:** tambah/edit/hapus paket
**Tiket:** convertAutoTicket, balas/tutup
**Chat:** openChatModal
**Ganti Password:** form → simpan

---

## HEAD COACH (9 panel)

### Navigasi
home, klien, atlet, coach, koreksi, hcmanual, hcmonitor, chat, sandi

### Aksi per Panel
**Beranda:** Dark/Light toggle, Perbarui Data (hcRefresh), + Buat Program (hcGoBuilder)
**Klien:** openClientDetail, lihat progress
**Atlet:** openAthleteModal (tambah), deleteAthlete, viewAthleteAchievements, openAchievementModal, deleteAchievement
**Coach:** openCoachDetail, daftar coach
**Koreksi:** selectKoreksiDay, reviewSubmission, setRescheduleStatus
**Buat Program (hcmanual):** form program → Lanjut Susun Program, mReset, mPaceToggle (kalkulator pace), mPaceAddDistance, mPaceRun (Hitung 10 Baris), openTemplateModal, pickProgramTpl, applyTemplateToField, deleteTemplate
**Monitoring (hcmonitor):** selectTeamCalDay
**Chat:** kirim pesan
**Ganti Password:** form → simpan

---

## COACH (5 panel)

### Navigasi
home, klien, jadwal, info, sandi

### Aksi per Panel
**Beranda:** Dark/Light toggle, Keluar (coachLogoutBtn)
**Klien:**
- Subtab: Daftar Klien / Progress / Rapor / Log Latihan
- openClientHistory(name) → riwayat latihan
- downloadRaporBtn (Unduh Rapor PDF)
- Simpan Log (submit form log latihan)
**Jadwal:**
- selectCalDay, markAttendance (3x), removeUnavailable
- Subtab: Gaji / History / Rapor
- openGajiDetail (2x)
**Informasi (info):** renderHistory (timeline)
**Ganti Password:** form → simpan

---

## CLIENT

### Navigasi
(panel client - perlu cek views/client.js)

### Aksi
- [ ] Lihat program latihan
- [ ] Lihat jadwal
- [ ] Chat dengan coach
- [ ] Lihat laporan/progress
- [ ] Ganti password

---

## Prioritas Uji Silang

### Kritis (wajib)
1. Login semua tier
2. Tambah klien (owner) → terlihat di admin/headcoach/coach
3. Tambah anggota baru via Kelola Anggota (owner)
4. Kirim pesan antar tier (chat)
5. Ganti password

### Penting
6. Jadwal: tambah slot coach → terlihat di klien
7. Keuangan: tambah transaksi
8. Tiket: buat tiket → konversi → tutup
9. Harga: tambah paket
10. Absensi coach: markAttendance

### Tambahan
11. Export CSV/PDF
12. Koreksi & persetujuan headcoach
13. Buat program manual headcoach
