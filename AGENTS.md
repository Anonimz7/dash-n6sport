
## Konvensi Penamaan Variabel (2026-10-11)
- `f` prefix = form field ID (fName, fCoach, fProgram). BUKAN function.
- `n6` prefix = global/shared N6 (n6Api, n6Bus). Untuk kode spesifik tier, hindari.
- `unsubscribe` (bukan `off`) untuk fungsi unsubscribe event bus.
- `isDayOff` (bukan `off`) untuk boolean status libur coach.
- Hindari 1 huruf kecuali loop (`i`,`j`) dan event (`e`).
- `data` harus spesifik: `clientData`, `scheduleData`, `commissionData`, dll.
- `client` (bukan `c`) untuk hasil pencarian klien.
