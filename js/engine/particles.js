/* ============================================================
   OXARA'S DOMAIN — js/engine/particles.js

   Evrensel partikül sistemi fabrikası.
   Bir canvas ID'si ve config nesnesi alır; { setActive } döner.

   Config arayüzü:
     anchorId?    : string        — spawn merkezi DOM id'si
     ambientCount : number        — pasif maks parçacık sayısı
     activeCount  : number        — hover maks parçacık sayısı
     spawn(W,H,aX,aY) → Object   — yeni parçacık state'i üretir
     update(p,aX,aY)             — parçacığı her kare günceller
     draw(ctx,p,aX,aY)           — parçacığı canvas'a çizer
     globalDraw?  : Function      — arka plan glow efekti (opsiyonel)
   ============================================================ */

import { resizeCanvas, getAnchorPos } from '../utils/canvas.js';

/**
 * @param {string} canvasId
 * @param {Object} config
 * @returns {{ setActive: (v: boolean) => void }}
 */
export function makeParticleSystem(canvasId, config) {
    const canvasEl = document.getElementById(canvasId);
    const ctx      = canvasEl.getContext('2d');
    const anchorEl = config.anchorId
        ? document.getElementById(config.anchorId)
        : null;

    let particles  = [];
    let active     = false;
    let globalFade = 0;

    resizeCanvas(canvasEl);
    window.addEventListener('resize', () => resizeCanvas(canvasEl));

    function spawnOne() {
        const pos = getAnchorPos(canvasEl, anchorEl);
        return config.spawn(canvasEl.width, canvasEl.height, pos.x, pos.y);
    }

    // Ambient partikülleri dağıtık ömür offset'iyle önceden doldur
    for (let i = 0; i < config.ambientCount; i++) {
        const p = spawnOne();
        p.life  = Math.random() * p.life;
        particles.push(p);
    }

    function tick() {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        const pos = getAnchorPos(canvasEl, anchorEl);

        // Aktif/pasif geçiş yumuşatma
        globalFade = active
            ? Math.min(1, globalFade + 0.05)
            : Math.max(0, globalFade - 0.02);

        if (config.globalDraw && globalFade > 0) {
            config.globalDraw(ctx, canvasEl.width, canvasEl.height, globalFade, pos.x, pos.y);
        }

        // Kademeli ekleme — her kare max 1 parçacık
        const target = active ? config.activeCount : config.ambientCount;
        if (particles.length < target) particles.push(spawnOne());

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            if (config.update) config.update(p, pos.x, pos.y);
            config.draw(ctx, p, pos.x, pos.y);
            if (p.life <= 0) particles.splice(i, 1);
        }

        requestAnimationFrame(tick);
    }
    tick();

    return {
        /** @param {boolean} v */
        setActive: (v) => { active = v; },
    };
}
