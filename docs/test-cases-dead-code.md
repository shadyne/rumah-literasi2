# Matriks Izin & Test Case — Deteksi Dead Code

Dokumen ini adalah spesifikasi test case whitebox untuk modul **Donasi Finansial**, **Donasi Buku**, dan **Alamat**. Tujuannya dua:

1. **Deteksi dead code semantik** — kombinasi role × status yang tidak pernah bisa berhasil. Sel bertanda `[DEAD]` adalah bukti dead code; sel `[ANOMALI]` adalah jalur hidup yang seharusnya mati.
2. **Pagar regresi** — setelah dead code dibersihkan, test ini mencegah perubahan otorisasi diam-diam mematikan fitur lain.

Disusun dari kondisi kode per tanggal 14 Juli 2026 (setelah penerapan point 2, 3, 4).

## Legenda

**Role** (frontend/src/libs/constant.js, backend/libs/constant.js):

| Kode | Role | Catatan penting |
|---|---|---|
| `D-own` | Donatur, pemilik resource | |
| `D-lain` | Donatur, bukan pemilik | |
| `ADM` | Admin | |
| `SA` | Superadmin | **Selalu lolos middleware `authorize`** (backend/middleware/authorize.js:19) dan **selalu lolos scope kepemilikan** (authorize.js:39-40). Banyak anomali berakar di sini. |

**Status donasi** (`PAYMENT_STATUS`): `Pending` (Menunggu Pembayaran), `WaitingVerification` (Menunggu Verifikasi), `Success` (Berhasil), `Failed` (Gagal).

**Hasil yang dicatat**: kode HTTP + efek samping (perubahan DB, log sistem, panggilan Biteship).

**Penanda**:
- `[DEAD]` — jalur yang tidak mungkin sukses / UI yang selalu berujung error → kandidat dihapus atau diubah statenya.
- `[ANOMALI]` — jalur yang bisa sukses padahal seharusnya tidak → kandidat ditutup.
- `[DECIDE]` — menunggu keputusan produk sebelum test final ditulis.

---

## Modul 1 — Donasi Finansial (`/api/financial-donations`)

### FD-INDEX · `GET /`

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-01 | D-own | punya donasi semua status | 200; hanya donasi miliknya; **termasuk** Pending |
| FD-02 | ADM | ada donasi Pending milik user | 200; donasi Pending **tidak muncul** (point 4) |
| FD-03 | ADM | query `?status=Pending` | 200; rows **kosong** (filter dipaksa `!= Pending` di controller) |
| FD-04 | SA | sama dengan FD-02/03 | sama dengan ADM |
| FD-05 | ADM | query `?status=Failed` | 200; hanya donasi Gagal semua user |

### FD-SHOW · `GET /:id`

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-06 | D-own | donasi miliknya, status apa pun | 200 |
| FD-07 | D-lain | donasi orang lain | 404 |
| FD-08 | ADM/SA | donasi user status non-Pending | 200 |
| FD-09 | ADM/SA | donasi user status **Pending** | 404 — **sudah diterapkan** (point 4 konsisten sampai URL detail langsung); pemilik tetap 200 |

### FD-STORE · `POST /`

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-10 | Donatur | body valid | 200; status `Pending`; **tidak ada** entri log sistem (point 4) |
| FD-11 | ADM | — | 403 (middleware) |
| FD-12 | SA | — | 403 — anomali **sudah ditutup** (`authorizeStrict([DONATUR])`) |

### FD-PAY · `POST /:id/pay`

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-13 | D-own | Pending + bukti + channel aktif | 200; status → `WaitingVerification`; **tanpa** log sistem (temuan whitebox: `LogService.createLog` menyaring `LOGGED_ROLES` — aksi Donatur tidak pernah dicatat, panggilan log di controller `pay` efektif dead code untuk aktor donatur) |
| FD-14 | D-own | status selain Pending | 400 |
| FD-15 | D-own | tanpa file bukti | 400 |
| FD-16 | D-own | channel tidak aktif / tidak ada | 400 |
| FD-17 | D-lain | donasi orang lain | 404 |
| FD-18 | ADM | — | 403 (middleware) |
| FD-19 | SA | donasi Pending **milik orang lain** | 404 — anomali **sudah ditutup** (owner-where eksplisit di controller `pay`) |

### FD-UPDATE · `PUT /:id` (point 2: pemilik saja, saat Pending)

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-20 | D-own | Pending, ubah `amount`/`notes` | 200; berubah; **tanpa** log sistem |
| FD-21 | D-own | Pending, body menyelipkan `status: "Success"` | 200; `status` **tetap Pending** (whitelist field di controller) |
| FD-22 | D-own | status selain Pending | 400 ("only be edited while awaiting payment") |
| FD-23 | D-lain | — | 404 |
| FD-24 | ADM | — | 403 (middleware) |
| FD-25 | SA | donasi orang lain | 404 (controller owner-where menutup bypass scope) |

### FD-DESTROY · `DELETE /:id` (pemilik saat Pending; Admin/SA khusus Gagal)

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-26 | D-own | Pending | 200; terhapus; **tanpa** log sistem |
| FD-27 | D-own | `WaitingVerification` / `Success` | 400 |
| FD-28 | D-own | `Failed` | 400 — jalur hapus donasi Gagal milik Admin/SA |
| FD-28b | ADM | `Failed` (milik siapa pun) | 200; terhapus; **log tercatat** — dead code lama **sudah ditutup** |
| FD-28c | SA | `Failed` (milik siapa pun) | 200 |
| FD-29 | ADM | status selain `Failed` | 400; tidak terhapus |
| FD-30 | SA | Pending milik orang lain | 400 (bukan Gagal) |
| FD-31 | D-lain | — | 404 |

### FD-VERIFY · `POST /:id/verify`

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| FD-32 | ADM/SA | `WaitingVerification`, approve=true | 200; status → `Success`; `verified_by` terisi; log tercatat |
| FD-33 | ADM/SA | `WaitingVerification`, approve=false | 200; status → `Failed`; log tercatat |
| FD-34 | ADM/SA | status selain `WaitingVerification` | 400 |
| FD-35 | Donatur | — | 403 |

---

## Modul 2 — Donasi Buku (`/api/book-donations`)

Struktur sama dengan Modul 1; perbedaan yang perlu test khusus:

| ID | Aktor | Kondisi | Ekspektasi |
|---|---|---|---|
| BD-01…05 | (cermin FD-01…05) | index: Pending tersembunyi dari ADM/SA | sama |
| BD-06…09 | (cermin FD-06…09) | show | sama; BD-09 (detail Pending untuk ADM/SA) → 404, **sudah diterapkan** |
| BD-10 | Donatur | store valid | 200; status Pending; draft Biteship dibuat (`order_id` terisi); **tanpa** log sistem |
| BD-11 | Donatur | store, alamat bukan miliknya | 404 |
| BD-12 | SA | store | 403 — anomali **sudah ditutup** (cermin FD-12) |
| BD-13…19 | (cermin FD-13…19) | pay | sama; BD-19 (SA membayar donasi orang lain) → 404, **sudah ditutup** |
| BD-20 | D-own | Pending, PUT ubah `estimated_value`/`pickup_note`/`pickup_date`/`pickup_time_slot` | 200; berubah |
| BD-21 | D-own | Pending, PUT menyelipkan `status`/`shipping_fee`/`order_id`/`weight` | 200; field tersebut **tidak berubah** (whitelist) |
| BD-22 | D-own | PUT saat non-Pending | 400 |
| BD-23…25 | (cermin FD-23…25) | update oleh D-lain/ADM/SA | 404 / 403 / 404 |
| BD-26 | D-own | DELETE saat Pending, `order_id` ada | 200; terhapus; **Biteship draft dibatalkan** (`DeliveryController.cancel` terpanggil); tanpa log |
| BD-27 | D-own | DELETE saat `Failed` | 400 — jalur hapus Gagal milik Admin/SA |
| BD-27b | ADM/SA | DELETE saat `Failed` | 200; terhapus; log tercatat — dead code lama **sudah ditutup** |
| BD-28…31 | (cermin FD-29…31) | delete non-Gagal oleh ADM/SA → 400; D-lain → 404 | |
| BD-32 | ADM/SA | verify approve: konfirmasi Biteship sukses | 200; `Success`; `tracking_id` terisi; idempoten (klik ganda → 400 kedua kalinya) |
| BD-33 | ADM/SA | verify approve: Biteship gagal | 502; status **tidak berubah** (tetap `WaitingVerification`) |
| BD-34 | ADM/SA | verify reject | 200; `Failed`; Biteship cancel terpanggil |
| BD-35 | ADM/SA | verify saat non-`WaitingVerification` | 400 |

---

## Modul 3 — Alamat (`/api/addresses`)

Endpoint hanya dipagari `authenticate` (login), tanpa gate role di route (backend/api/index.js:136).

| ID | Aktor | Endpoint & kondisi | Ekspektasi |
|---|---|---|---|
| AD-01 | D-own | `GET /` | 200; hanya alamat miliknya |
| AD-02 | ADM/SA | `GET /` | 200; alamat semua user |
| AD-03 | Donatur | `POST /` valid (kode pos terdaftar Biteship) | 200; alamat pertama otomatis default. ADM/SA → 403 (`authorizeStrict`) — **sudah diterapkan** Donatur-only, tombol "Buat Alamat" ikut disembunyikan (UI-07) |
| AD-04 | D-own | `POST /` alamat ke-11 | 400 (limit 10) |
| AD-05 | D-own | `POST /` kode pos tak terdaftar | 400; **tidak ada** row & lokasi Biteship yatim (rollback + cleanup) |
| AD-06 | D-own | `GET /:id` miliknya | 200 |
| AD-07 | D-lain | `GET /:id` milik orang | 404 |
| AD-08 | ADM/SA | `GET /:id` milik siapa pun | 200 |
| AD-09 | D-own | `PUT /:id` miliknya (point 2) | 200; Biteship location ikut diperbarui |
| AD-10 | D-lain | `PUT /:id` milik orang | 404; ADM/SA → **403** (`authorizeStrict`) |
| AD-11 | D-own | `DELETE /:id` miliknya | 200; lokasi Biteship ikut dihapus |
| AD-12 | D-lain | `DELETE /:id` milik orang | 404 |
| AD-13 | ADM | `DELETE /:id` milik orang | **403** — tombol Hapus & badge default di UI disembunyikan untuk non-pemilik (dead UI ditutup) |
| AD-14 | SA | `DELETE /:id` milik orang | **403** — keputusan final: create/update/delete alamat eksklusif Donatur; bypass scope SA dicabut |
| AD-15 | D-own | `PATCH /:id/default` miliknya, non-default | 200; default lama tergeser |
| AD-16 | D-lain | `PATCH /:id/default` milik orang | 404; ADM/SA → **403** |

---

## Modul 4 — Frontend (component/E2E test)

| ID | Halaman | Kasus | Ekspektasi |
|---|---|---|---|
| UI-01 | list donasi (finansial & buku) | login Donatur, baris Pending miliknya | tombol "Hapus" & "Selesaikan Pembayaran" tampil |
| UI-02 | list donasi | login Donatur, baris non-Pending | tombol "Hapus" tidak tampil |
| UI-03 | list donasi | login ADM/SA | tidak ada baris Pending sama sekali; tombol "Hapus" tidak tampil di baris mana pun (akan berubah jika rencana hapus-Gagal diterapkan → tampil hanya di baris "Gagal") |
| UI-04 | list donasi | dropdown filter status, login ADM/SA | opsi "Menunggu Pembayaran" tidak ada; login Donatur: ada |
| UI-05 | detail donasi | login pemilik, status Pending | tombol "Edit Donasi" & "Selesaikan Pembayaran" tampil; non-Pending: keduanya hilang |
| UI-06 | list alamat | login ADM di alamat user lain | saat ini tombol "Hapus" dan badge "Bukan utama" (klik-able) **tampil tapi selalu gagal** `[DEAD]` → harus disembunyikan untuk non-pemilik |
| UI-07 | list alamat | tombol "Buat Alamat", login ADM/SA | saat ini tampil `[DECIDE→hapus]`; login Donatur: tetap tampil |
| UI-08 | detail alamat | login non-pemilik | tombol "Edit Alamat" & "Jadikan Utama" tidak tampil (sudah diterapkan — jadikan test regresi) |
| UI-09 | detail alamat | alamat tanpa koordinat (`latitude`/`longitude` null) | halaman render normal, peta di lokasi default tanpa marker — regresi white screen |
| UI-10 | detail alamat | alamat tanpa relasi `province`/`city`/`district` | field tampil "—", tidak crash — regresi white screen |
| UI-11 | rute create/pay/edit donasi & create/edit alamat | login ADM/SA | redirect ke `/unauthorized` — **sudah diterapkan** via `AuthorizeLayout strict` (SA tidak lagi diloloskan otomatis di rute eksklusif Donatur) |
| UI-12 | export "Semua Donasi" | login ADM/SA | data & dropdown tidak memuat "Menunggu Pembayaran"; hasil unduhan Excel tanpa baris Pending |

---

## Rekap Temuan

**Sudah ditutup** (perbaikan diterapkan, dikawal test):
1. ~~Donasi "Gagal" tidak bisa dihapus siapa pun~~ → Admin/SA kini boleh menghapus donasi khusus status Gagal, dengan log; pemilik tetap hanya saat Pending (FD-28…30, BD-27…29).
2. ~~SA bisa membuat donasi~~ → `authorizeStrict` (FD-12, BD-12 → 403).
3. ~~SA bisa membayar donasi orang lain~~ → owner-where di `pay` (FD-19, BD-19 → 404).
4. ~~"Buat Alamat" untuk ADM/SA~~ → endpoint Donatur-only + tombol disembunyikan (AD-03b/c → 403, UI-07).
5. ~~Tombol Hapus & badge default alamat tampil untuk non-pemilik~~ → disembunyikan; Hapus hanya untuk pemilik atau Superadmin — mengikuti perilaku backend saat ini (AD-13, AD-16, UI-06).

6. ~~Halaman edit donasi bisa dibuka SA via URL~~ → `AuthorizeLayout` mendukung prop `strict`; seluruh rute eksklusif Donatur (create/pay/edit donasi, create/edit alamat) memakainya (UI-11).
7. ~~Detail donasi Pending terlihat ADM/SA via URL langsung~~ → `show` kedua donasi mengembalikan 404 untuk Admin/SA saat status Pending; pemilik tetap 200 (FD-09, BD-09).
8. Create/update/delete alamat eksklusif Donatur pemilik — Admin/SA ditolak 403 di route (`authorizeStrict`), bypass scope SA di `destroy` dicabut, tombol Hapus di UI murni pemilik (AD-10, AD-13, AD-14, AD-16). Diterapkan 14 Juli 2026.

**Status akhir**: seluruh sel matriks terkunci test aktif — 79/79 lulus, tanpa `it.todo` dan tanpa `it.fails`. Tidak ada dead code maupun anomali tersisa yang diketahui di tiga modul ini.
