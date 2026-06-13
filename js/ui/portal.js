/* ============================================================
   OXARA'S DOMAIN — js/ui/portal.js

   #portalOverlay üzerinden fade-out → callback → fade-in
   geçişi yapan yardımcı. Harita → iç mekan ve geri dönüş
   geçişlerinde kullanılır.
   ============================================================ */

/**
 * @param {Function} onDark     — Ekran tamamen karardığında çağrılır
 * @param {number}   [duration=1000] — Karartma süresi (ms)
 */
export function portalTransition(onDark, duration = 1000) {
    const overlay = document.getElementById('portalOverlay');
    overlay.style.opacity = '1';
    setTimeout(() => {
        onDark();
        overlay.style.opacity = '0';
    }, duration);
}
