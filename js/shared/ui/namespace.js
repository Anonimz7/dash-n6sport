/**
 * N6 shared UI — Namespace guard
 *
 * Mengatasi polusi window global: semua fungsi yang harus diakses dari
 * atribut onclick HTML didaftarkan via N6UI.define() alih-alih
 * `window.X = ...` langsung.
 *
 * - Menempel ke window agar onclick="..." tetap jalan (kompatibilitas).
 * - console.warn jika nama yang sama didaftar ulang dengan implementasi
 *   BERBEDA (indikasi konflik copy-paste yang sebelumnya diam-diam menang).
 * - Idempoten: pendaftaran ulang dengan fungsi identik tidak memicu warn.
 *
 * Kompatibel classic-script (IIFE): menempel ke window.N6UI.
 *
 * Penggunaan:
 *   N6UI.define('openClientDetail', openClientDetail);
 *   // alih-alih: window.openClientDetail = openClientDetail;
 */

(function () {
  window.N6UI = window.N6UI || {};

  var registry = {};

  /**
   * Daftarkan fungsi global dengan guard konflik.
   * @param {string} name  nama global (mis. 'openClientDetail')
   * @param {Function} fn  implementasi
   * @param {string} [src]  sumber untuk pesan debug (mis. 'owner/klien.js')
   */
  function define(name, fn, src) {
    if (typeof fn !== 'function') return;
    var prev = registry[name];
    var sig = fn.toString().replace(/\s+/g, ' ');
    if (prev && prev.sig !== sig) {
      // Konflik nyata: implementasi berbeda, yang lama tertimpa diam-diam sebelumnya.
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          '[N6UI] window.' + name + ' ditimpa oleh ' + (src || '?') +
          ' (sebelumnya dari ' + prev.src + '). Periksa duplikasi.'
        );
      }
    }
    registry[name] = { sig: sig, src: src || '?' };
    window[name] = fn;
    // juga simpan di namespace agar bisa diakses tanpa window
    window.N6UI[name] = fn;
  }

  /**
   * Ambil fungsi terdaftar (atau undefined).
   */
  function get(name) {
    return registry[name] ? window[name] : undefined;
  }

  window.N6UI.define = define;
  window.N6UI.get = get;
})();
