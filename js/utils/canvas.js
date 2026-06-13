/* ============================================================
   OXARA'S DOMAIN — js/utils/canvas.js
   Canvas boyutlandırma ve koordinat dönüşüm yardımcıları.
   ============================================================ */

/**
 * Canvas'ı offsetWidth/Height'a göre yeniden boyutlandırır.
 * window resize event'ine listener olarak da kullanılabilir.
 * @param {HTMLCanvasElement} canvas
 */
export function resizeCanvas(canvas) {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

/**
 * Anchor element'in canvas koordinat sistemindeki merkezini döner.
 * Anchor yoksa canvas'ın geometrik merkezi kullanılır.
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement|null}  anchor
 * @returns {{ x: number, y: number }}
 */
export function getAnchorPos(canvas, anchor) {
    if (!anchor) return { x: canvas.width / 2, y: canvas.height / 2 };
    const cRect = canvas.getBoundingClientRect();
    const aRect = anchor.getBoundingClientRect();
    return {
        x: aRect.left + aRect.width  / 2 - cRect.left,
        y: aRect.top  + aRect.height / 2 - cRect.top,
    };
}
