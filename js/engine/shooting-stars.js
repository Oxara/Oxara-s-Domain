/* ============================================================
   OXARA'S DOMAIN — js/engine/shooting-stars.js

   Başlangıç ekranındaki #starCanvas üzerinde çalışan
   kayan yıldız animasyon motoru.
   ============================================================ */

import { createShootingStarState, calcStarOpacity } from '../utils/math.js';
import { resizeCanvas } from '../utils/canvas.js';

const STAR_COUNT = 3;

/**
 * Kayan yıldız canvas'ını başlatır.
 * @returns {{ stop: () => void }}
 */
export function initShootingStars() {
    const canvas = document.getElementById('starCanvas');
    const ctx    = canvas.getContext('2d');
    const stars  = [];
    let   rafId  = null;

    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));

    function spawn() {
        return createShootingStarState(canvas.width, canvas.height);
    }

    // İlk yıldızları birbirinden farklı gecikmelerle sıraya al
    for (let i = 0; i < STAR_COUNT; i++) {
        const s   = spawn();
        s.delay   = i * (5000 + Math.random() * 3000);
        stars.push(s);
    }

    function drawStar(s) {
        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tailX = s.x - (s.vx / speed) * s.tailLen;
        const tailY = s.y - (s.vy / speed) * s.tailLen;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0,   'rgba(255,255,255,0)');
        grad.addColorStop(0.7, `rgba(180,220,255,${s.opacity * 0.5})`);
        grad.addColorStop(1,   `rgba(255,255,255,${s.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
    }

    function animate(now) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            if (now - s.born < s.delay) continue;

            s.x        += s.vx;
            s.y        += s.vy;
            s.traveled += Math.sqrt(s.vx * s.vx + s.vy * s.vy);
            s.opacity   = Math.max(0, Math.min(1, calcStarOpacity(s.traveled, s.distance)));

            drawStar(s);

            if (s.traveled >= s.distance) {
                stars[i]       = spawn();
                stars[i].delay = 1000 + Math.random() * 5000;
            }
        }

        rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return { stop: () => cancelAnimationFrame(rafId) };
}
