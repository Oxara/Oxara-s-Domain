/* ============================================================
   OXARA'S DOMAIN — js/scenes/interiors.js

   Bölge iç mekan tanımları. Her nesne şu arayüzü uygular:
     build()          → string  — Sahneye ait HTML'i döner
     particleConfig   → Object  — makeParticleSystem'e geçilecek config
     init?()                    — Yükleme sonrası ek davranışlar (opsiyonel)

   Tüm interiorlar loadInterior() tarafından tüketilir.
   ============================================================ */

import { buildInteriorHTML, initHandbookLinks } from '../ui/interior-builder.js';

/* ── Crystal Spires ─────────────────────────────────────────
   Arşiv kütüphanesi: büyücü sprite + parşömen handbook listesi. */
export const INTERIOR_CRYSTAL = {
    build() {
        return `
        <div class="interior-container"
             style="background-image: url('Assets/Interior/CrystalSpires/bg.png');">

            <div id="closeInterior" class="close-btn">X</div>

            <canvas id="interiorCanvas"
                    style="position:absolute; top:0; left:0;
                           width:100%; height:100%;
                           pointer-events:none; z-index:5;"></canvas>

            <div class="sprite-wrapper sprite-bottom-left"
                 style="animation:float 10s ease-in-out infinite;">
                <img src="Assets/Interior/CrystalSpires/archmage.png"
                     class="sprite-img" style="image-rendering:pixelated;">
                <div id="anchor-interior"
                     style="position:absolute; top:12%; left:12%;"></div>
            </div>

            <div class="scroll-panel">
                <img src="Assets/Interior/CrystalSpires/scroll.png"
                     class="scroll-bg-img" alt="">
                <div class="scroll-content">
                    <h2 class="scroll-title">THE ARCHIVES</h2>
                    <p class="scroll-subtitle">— Handbooks of the Crystal Spires —</p>
                    <ul class="handbook-list">
                        <li><a class="handbook-link"
                               href="https://oxara.github.io/efcore-handbook/"
                               data-name="EF Core">⬡ EF Core</a></li>
                        <li><a class="handbook-link"
                               href="https://oxara.github.io/redis-handbook/"
                               data-name="Redis">⬡ Redis</a></li>
                        <li><a class="handbook-link"
                               href="https://oxara.github.io/rabbitmq-handbook/"
                               data-name="RabbitMQ">⬡ RabbitMQ</a></li>
                        <li><a class="handbook-link"
                               href="https://oxara.github.io/elasticsearch-handbook/"
                               data-name="Elasticsearch">⬡ Elasticsearch</a></li>
                        <li><a class="handbook-link"
                               href="https://oxara.github.io/hangfire-handbook/"
                               data-name="Hangfire">⬡ Hangfire</a></li>
                    </ul>
                </div>
            </div>

            <div class="dialog-box">
                "Hoş geldin gezgin... Arşivler seni bekliyor."
            </div>

            <div id="portalExitOverlay" class="portal-exit-overlay" aria-hidden="true">
                <div class="portal-exit-box">
                    <p class="portal-exit-line1">Diyarımızdan ayrılıyorsun...</p>
                    <p class="portal-exit-line2" id="portalExitName"></p>
                    <p class="portal-exit-line3">Portal açılıyor ✦</p>
                </div>
            </div>
        </div>`;
    },

    init() { initHandbookLinks(); },

    particleConfig: {
        anchorId    : 'anchor-interior',
        ambientCount: 15,
        activeCount : 25,
        spawn(W, H, aX, aY) {
            return {
                x   : aX + (Math.random() - 0.5) * 200,
                y   : aY + (Math.random() - 0.5) * 200,
                vx  : (Math.random() - 0.5) * 0.5,
                vy  : -(0.5 + Math.random() * 0.5),
                life: 1.0,
                maxL: 1.0,
                size: 2,
                hue : 270 + Math.random() * 30,
            };
        },
        update(p) { p.x += p.vx; p.y += p.vy; p.life -= 0.02; },
        draw(ctx, p) {
            const a = Math.max(0, p.life);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${a})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
            ctx.fill();
        },
    },
};

/* ── Iron Caldera ────────────────────────────────────────────
   Demirci atölyesi: örs kıvılcımları. */
export const INTERIOR_CALDERA = {
    build() {
        return buildInteriorHTML({
            bgImage     : 'Assets/Interior/IronCaldera/bg.png',
            canvasId    : 'interiorCanvas',
            canvasZIndex: 2,
            dialogText  : '"Demir ateşle, kod sabırla dövülür... Atölyeye hoş geldin."',
            spriteContent: `
                <div class="sprite-wrapper sprite-bottom-right">
                    <img src="Assets/Interior/IronCaldera/blacksmith.png"
                         class="sprite-img" style="image-rendering:pixelated;">
                    <div id="anchor-interior"
                         style="position:absolute; top:60%; left:60%;
                                width:10px; height:10px;"></div>
                </div>`,
        });
    },
    particleConfig: {
        anchorId    : 'anchor-interior',
        ambientCount: 0,
        activeCount : 35,
        spawn(W, H, aX, aY) {
            return {
                x   : aX + (Math.random() - 0.5) * 200,
                y   : aY + (Math.random() - 0.5) * 200,
                vx  : (Math.random() - 0.5) * 8,
                vy  : -(3 + Math.random() * 4),
                life: 1.0,
                maxL: 1.0,
                size: 2 + Math.random() * 2,
                hue : 15 + Math.random() * 20,
                grav: 0.25,
            };
        },
        update(p) { p.x += p.vx; p.y += p.vy; p.vy += p.grav; p.life -= 0.02; },
        draw(ctx, p) {
            const a = Math.max(0, p.life);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${a})`;
            ctx.fillRect(Math.round(p.x), Math.round(p.y),
                         Math.round(p.size), Math.round(p.size));
        },
    },
};

/* ── Forgotten Vault ─────────────────────────────────────────
   Arşiv odası: masa + parşömen görseli, orbital mor/altın toz. */
export const INTERIOR_VAULT = {
    build() {
        return buildInteriorHTML({
            bgImage     : 'Assets/Interior/ForgottenVault/bg.png',
            canvasId    : 'interiorCanvas',
            canvasZIndex: 2,
            dialogText  : '"Unutulmuş düşünceler ve eski arşivler... The Forgotten Vault\'a hoş geldin."',
            spriteContent: `
                <div style="position:absolute; bottom:5vh; left:50%;
                            transform:translateX(-50%);
                            width:60vw; max-width:700px; z-index:4;">
                    <img src="Assets/Interior/ForgottenVault/table.png"
                         style="width:100%; display:block;
                                mix-blend-mode:screen; image-rendering:pixelated;">
                    <img src="Assets/Interior/ForgottenVault/scrollpile.png"
                         style="position:absolute; top:-40%; left:15%; width:70%;
                                mix-blend-mode:screen; image-rendering:pixelated;
                                animation:float 6s ease-in-out infinite;">
                    <div id="anchor-interior"
                         style="position:absolute; top:20%; left:50%;
                                width:10px; height:10px;"></div>
                </div>`,
        });
    },
    particleConfig: {
        anchorId    : 'anchor-interior',
        ambientCount: 20,
        activeCount : 45,
        spawn(W, H, aX, aY) {
            const angle = Math.random() * Math.PI * 2;
            const r     = 50 + Math.random() * 200;
            return {
                x    : aX + Math.cos(angle) * r,
                y    : aY + Math.sin(angle) * r * 0.5 - 100,
                vx   : (Math.random() - 0.5) * 0.8,
                vy   : -(0.2 + Math.random() * 1.2),
                life : 1.0 + Math.random() * 1.5,
                maxL : 2.5,
                size : 1.5 + Math.random() * 2,
                hue  : Math.random() > 0.5 ? 260 + Math.random() * 30 : 40 + Math.random() * 20,
                drift: (Math.random() - 0.5) * 0.02,
            };
        },
        update(p) { p.x += p.vx; p.y += p.vy; p.vx += p.drift; p.life -= 0.01; },
        draw(ctx, p) {
            const t     = Math.max(0, p.life / p.maxL);
            const alpha = t > 0.8 ? (1 - t) * 5 : t;
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        },
    },
};

/* ── Silver Grove ────────────────────────────────────────────
   Orman koruluğu: ateşböceği parıltıları. */
export const INTERIOR_GROVE = {
    build() {
        return buildInteriorHTML({
            bgImage     : 'Assets/Interior/SilverGrove/bg.png',
            canvasId    : 'interiorCanvas',
            canvasZIndex: 2,
            dialogText  : '"Doğanın fısıltısı, kodun sessizliğinde saklıdır... Koruluğa hoş geldin."',
            spriteContent: `
                <div class="sprite-wrapper sprite-bottom-left developer">
                    <img src="Assets/Interior/SilverGrove/developer.png"
                         class="sprite-img developer" style="image-rendering:pixelated;">
                    <div id="anchor-interior"
                         style="position:absolute; top:30%; left:50%;
                                width:10px; height:10px;"></div>
                </div>`,
        });
    },
    particleConfig: {
        anchorId    : 'anchor-interior',
        ambientCount: 20,
        activeCount : 60,
        spawn(W, H, aX, aY) {
            return {
                x    : Math.random() * W,
                y    : Math.random() * H,
                vx   : (Math.random() - 0.5) * 0.5,
                vy   : (Math.random() - 0.5) * 0.5,
                life : 1.0 + Math.random() * 1.5,
                maxL : 2.5,
                size : 1 + Math.random() * 2,
                hue  : 100 + Math.random() * 80,
                drift: (Math.random() - 0.5) * 0.01,
            };
        },
        update(p) { p.x += p.vx; p.y += p.vy; p.vx += p.drift; p.life -= 0.005; },
        draw(ctx, p) {
            const alpha = Math.sin((p.life / p.maxL) * Math.PI);
            ctx.shadowBlur  = 8;
            ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 0.6)`;
            ctx.fillStyle   = `hsla(${p.hue}, 100%, 75%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur  = 0;
        },
    },
};
