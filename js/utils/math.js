/* ============================================================
   OXARA'S DOMAIN — js/utils/math.js
   Saf yardımcı fonksiyonlar. DOM'a dokunmaz, test edilebilir.
   ============================================================ */

/**
 * Değeri [min, max] aralığına sıkıştırır.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

/**
 * Scroll miktarına göre başlangıç ekranının parallax CSS değerlerini hesaplar.
 * @param {number} scrollY - window.pageYOffset
 * @returns {{ bgBrightness, bgTranslateY, textTranslateY, textOpacity }}
 */
export function calcScrollVisuals(scrollY) {
    return {
        bgBrightness  : clamp(0.75 - scrollY / 1000, 0, 1),
        bgTranslateY  : scrollY * 0.75,
        textTranslateY: scrollY * 0.8,
        textOpacity   : clamp(1 - scrollY / 400, 0, 1),
    };
}

/**
 * Yıldızın kat ettiği mesafeye göre fade-in / fade-out opaklığını hesaplar.
 * @param {number} traveled - Kat edilen mesafe
 * @param {number} distance - Toplam mesafe
 * @returns {number} 0–1 arası opaklık değeri
 */
export function calcStarOpacity(traveled, distance) {
    const progress = traveled / distance;
    if      (progress < 0.15) return progress / 0.15;
    else if (progress > 0.75) return 1 - (progress - 0.75) / 0.25;
    return 1;
}

/**
 * Kayan yıldız için rastgele fiziksel özellikler üretir.
 * @param {number} W - Canvas genişliği
 * @param {number} H - Canvas yüksekliği
 * @returns {Object} Yıldız state nesnesi
 */
export function createShootingStarState(W, H) {
    const SKY_LIMIT = H * 0.25;
    const angleDeg  = 8 + Math.random() * 20;
    const angleRad  = (angleDeg * Math.PI) / 180;
    const speed     = 3 + Math.random() * 4;

    return {
        x       : W * 0.05 + Math.random() * W * 0.6,
        y       : H * 0.02 + Math.random() * SKY_LIMIT * 0.6,
        vx      : Math.cos(angleRad) * speed,
        vy      : Math.sin(angleRad) * speed,
        tailLen : 35 + Math.random() * 55,
        traveled: 0,
        distance: W * (0.25 + Math.random() * 0.25),
        opacity : 0,
        born    : performance.now(),
        delay   : 5000 + Math.random() * 7000,
    };
}
