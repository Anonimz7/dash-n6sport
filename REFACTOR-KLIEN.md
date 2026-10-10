# Refactoring Path: klien.js Duplication

## Temuan

`js/modules/owner/klien.js` (336 baris) dan `js/modules/admin/klien.js` (464 baris)
memiliki **290 baris identik (86%)**. 10 fungsi duplikat persis:

- `computeConfigPrice`, `flashCopied`, `full`, `populateFormSelects`
- `renderArchive`, `renderClientList`, `renderProgramFields`
- `saveClientForm`, `search`, `updateConfigPriceBox`

## Mengapa Belum Diekstrak

Fungsi-fungsi tersebut tercampur dengan kode spesifik-tier dalam unit
`/*__N6_UNIT__*/` yang sama. Ekstraksi otomatis berisiko memecah dependensi
implisit (variabel `clients`, `catalogById`, dll. yang di-share via scope IIFE).

## Rencana Refactoring (manual, aman)

1. Buat `js/shared/klien-ui.js` berisi 10 fungsi di atas (copy-paste manual,
   verifikasi satu per satu).
2. Salin ke `js/modules/owner/_klien-shared.js` dan
   `js/modules/admin/_klien-shared.js` (ikuti pola `tools/sync-shared.sh`).
3. Hapus definisi duplikat dari `klien.js` masing-masing tier.
4. Tambahkan `['_klien-shared', N]` ke manifest owner & admin
   (sebelum `['klien', ...]`).
5. `tools/build.sh` + `tools/smoke-test.sh`.

## Estimasi

~128 baris kode duplikat dapat dihapus (admin/klien.js menyusut ~28%).

## Infrastruktur Pendukung (sudah ada)

- `tools/sync-shared.sh` — pola sync fragmen shared ke tier
- `js/shared/ui/namespace.js` — `N6UI.define()` untuk guard konflik
- `tools/build.sh` — mendukung fragmen `_shared` via manifest
