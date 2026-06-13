/* ============================================================
   OXARA'S DOMAIN — js/engine/particle-configs.js

   Harita bölgelerine ait partikül config nesneleri.
   makeParticleSystem(canvasId, config) çağrısına geçilir.

   Ortak draw yardımcısı (drawGlowDot) tekrar eden radial
   gradient + fillRect kalıbını tek yerden sağlar.
   ============================================================ */

/**
 * Piksel kare + çevresinde radial glow çizer.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size      — kare boyutu (px)
 * @param {number} glowRadius— glow yarıçapı (px)
 * @param {number} hue       — HSL ton (0–360)
 * @param {number} alpha     — opaklık (0–1)
 * @param {number} [innerL=90]  — iç renk açıklık
 * @param {number} [outerL=60]  — dış renk açıklık
 */
function drawGlowDot(ctx, x, y, size, glowRadius, hue, alpha, innerL = 90, outerL = 60) {
    ctx.fillStyle = `hsla(${hue}, 90%, ${(innerL + outerL) / 2}%, ${alpha})`;
    ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(size), Math.ceil(size));

    const g = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
    g.addColorStop(0, `hsla(${hue}, 100%, ${innerL}%, ${alpha * 0.5})`);
    g.addColorStop(1, `hsla(${hue},  80%, ${outerL}%, 0)`);
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
}

/**
 * Parçacığın ömür oranına göre alpha üretir.
 * Doğuş ve ölüm geçişleri yumuşatılır.
 * @param {number} life
 * @param {number} maxL
 * @param {number} [fadeIn=0.2]  — fade-in bitiş eşiği (0–1)
 * @param {number} [baseAlpha=0.55]
 */
function lifeAlpha(life, maxL, fadeIn = 0.2, baseAlpha = 0.55) {
    const t = life / maxL;
    return (t < fadeIn ? t / fadeIn : t) * baseAlpha;
}

/* ── Crystal Spires ─────────────────────────────────────────
   Camgöbeği/mor kristal parıltılar; sinüs dalgasıyla salınır. */
export const PARTICLE_CONFIG_CRYSTAL = {
    anchorId    : 'anchor-crystal',
    ambientCount: 3,
    activeCount : 18,
    spawn(W, H, aX, aY) {
        return {
            x    : aX + (Math.random() - 0.5) * (W * 0.8),
            y    : aY + (Math.random() - 0.5) * (H * 0.5),
            vx   : (Math.random() - 0.5) * 0.25,
            vy   : -(0.25 + Math.random() * 0.45),
            life : 1.2 + Math.random() * 1.0,
            maxL : 1.2 + Math.random() * 1.0,
            size : 1   + Math.random() * 1.5,
            hue  : 195 + Math.random() * 40,
            pulse: Math.random() * Math.PI * 2,
        };
    },
    update(p) {
        p.x    += p.vx + Math.sin(p.pulse) * 0.2;
        p.y    += p.vy;
        p.pulse += 0.03;
        p.life  -= 0.005;
    },
    draw(ctx, p) {
        drawGlowDot(ctx, p.x, p.y, p.size, p.size * 3, p.hue, lifeAlpha(p.life, p.maxL));
    },
};

/* ── Iron Caldera ────────────────────────────────────────────
   Turuncu/kırmızı kor parçacıklar; yerçekimiyle eğri çizer,
   renk soğuyarak koyulaşır. */
export const PARTICLE_CONFIG_CALDERA = {
    anchorId    : 'anchor-caldera',
    ambientCount: 5,
    activeCount : 25,
    spawn(W, H, aX, aY) {
        return {
            x   : aX + (Math.random() - 0.5) * (W * 0.5),
            y   : aY + (Math.random() - 0.5) * (H * 0.5),
            vx  : (Math.random() - 0.5) * 0.7,
            vy  : -(0.5 + Math.random() * 1.0),
            life: 0.8 + Math.random() * 0.8,
            maxL: 0.8 + Math.random() * 0.8,
            size: 1   + Math.random() * 1.5,
            hue : 15  + Math.random() * 25,
            grav: 0.025 + Math.random() * 0.02,
        };
    },
    update(p) {
        p.x   += p.vx; p.y += p.vy;
        p.vy  += p.grav; p.vx *= 0.99;
        p.life -= 0.008;
        p.hue  = Math.max(5, p.hue - 0.2);
    },
    draw(ctx, p) {
        drawGlowDot(ctx, p.x, p.y, p.size, p.size * 4, p.hue,
                    lifeAlpha(p.life, p.maxL, 0.15, 0.6), 80, 40);
    },
};

/* ── Forgotten Vault ─────────────────────────────────────────
   Mor/altın orbital toz; anchor etrafında eliptik yörüngede döner. */
export const PARTICLE_CONFIG_VAULT = {
    anchorId    : 'anchor-vault',
    ambientCount: 5,
    activeCount : 50,
    spawn(W, H, aX, aY) {
        const angle = Math.random() * Math.PI * 2;
        const r     = 15 + Math.random() * 40;
        return {
            x    : aX + Math.cos(angle) * r * 4,
            y    : aY + Math.sin(angle) * r * 2,
            vx   : Math.cos(angle + Math.PI / 2) * (0.2 + Math.random() * 0.35),
            vy   : Math.sin(angle + Math.PI / 2) * (0.2 + Math.random() * 0.35) - 0.2,
            life : 1.5 + Math.random() * 1.2,
            maxL : 1.5 + Math.random() * 1.2,
            size : 1   + Math.random() * 1.5,
            hue  : 260 + Math.random() * 40,
            drift: (Math.random() - 0.5) * 0.015,
            angle: angle,
        };
    },
    update(p) {
        p.angle += p.drift;
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.985; p.vy *= 0.985;
        p.life -= 0.005;
    },
    draw(ctx, p) {
        drawGlowDot(ctx, p.x, p.y, p.size, p.size * 5, p.hue,
                    lifeAlpha(p.life, p.maxL, 0.2, 0.5), 80, 50);
    },
};

/* ── Silver Grove ────────────────────────────────────────────
   Mavi/camgöbeği ateşböcekleri; bağımsız eliptik yörünge +
   sinüs drift + nabız efekti.
   globalDraw: hover'da anchor merkezinde yumuşak mavi ambient glow. */
export const PARTICLE_CONFIG_GROVE = {
    anchorId    : 'anchor-tree',
    ambientCount: 12,
    activeCount : 42,
    spawn(W, H, aX, aY) {
        return {
            orbitAngle : Math.random() * Math.PI * 2,
            orbitRadius: 100 * (0.25 + Math.random() * 0.75),
            orbitSpeed : (0.002 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
            driftAngle : Math.random() * Math.PI * 2,
            driftSpeed : 0.006 + Math.random() * 0.010,
            driftAmp   : 6    + Math.random() * 16,
            pulseOffset: Math.random() * Math.PI * 2,
            pulseSpeed : 0.018 + Math.random() * 0.028,
            hue        : 190  + Math.random() * 50,
            life       : 1.5  + Math.random() * 1.5,
            maxL       : 3.0,
        };
    },
    update(p) {
        p.orbitAngle  += p.orbitSpeed;
        p.driftAngle  += p.driftSpeed;
        p.pulseOffset += p.pulseSpeed;
        p.life        -= 0.005;
    },
    globalDraw(ctx, W, H, fade, aX, aY) {
        const glow = ctx.createRadialGradient(aX, aY, 0, aX, aY, 165);
        glow.addColorStop(0,   `rgba(80, 160, 255, ${0.06 * fade})`);
        glow.addColorStop(0.5, `rgba(40, 100, 220, ${0.03 * fade})`);
        glow.addColorStop(1,   'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(aX, aY, 165, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
    },
    draw(ctx, p, aX, aY) {
        const x = aX + Math.cos(p.orbitAngle) * p.orbitRadius
                     + Math.cos(p.driftAngle * 1.3) * p.driftAmp;
        const y = aY + Math.sin(p.orbitAngle) * p.orbitRadius * 0.5
                     + Math.sin(p.driftAngle) * p.driftAmp * 0.5;

        const pulse     = (Math.sin(p.pulseOffset) + 1) / 2;
        const t         = p.life / p.maxL;
        const lifeA     = t < 0.2 ? t / 0.2 : t;
        const alpha     = (0.12 + pulse * 0.78) * lifeA;

        ctx.fillStyle = `hsla(${p.hue}, 85%, 80%, ${alpha})`;
        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);

        const r     = 5 + pulse * 5;
        const glowR = ctx.createRadialGradient(x, y, 0, x, y, r);
        glowR.addColorStop(0,   `hsla(${p.hue}, 100%, 85%, ${alpha * 0.9})`);
        glowR.addColorStop(0.4, `hsla(${p.hue},  90%, 65%, ${alpha * 0.3})`);
        glowR.addColorStop(1,   `hsla(${p.hue},  80%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = glowR;
        ctx.fill();
    },
};
