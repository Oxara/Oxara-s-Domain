/* ============================================================
   OXARA'S DOMAIN — script.js  (ana giriş noktası)

   Modül ağacı:
     utils/
       math.js          — Saf hesaplama yardımcıları
       canvas.js        — Canvas boyutlandırma & koordinat dönüşümü
     engine/
       particles.js     — Evrensel partikül sistemi fabrikası
       particle-configs.js — Harita bölgesi partikül tanımları
       shooting-stars.js — Başlangıç ekranı yıldız animasyonu
     ui/
       portal.js        — Ekran geçiş (fade) yardımcısı
       map-interactions.js — Hotspot hover/click yönetimi
       interior-builder.js — HTML şablonu & handbook init
     scenes/
       title-screen.js  — Parallax scroll davranışı
       interiors.js     — Bölge iç mekan tanımları
       interior-loader.js — İç mekan render & partikül başlatma
   ============================================================ */

import { initTitleScreen }    from './js/scenes/title-screen.js';
import { initShootingStars }  from './js/engine/shooting-stars.js';
import { makeParticleSystem } from './js/engine/particles.js';
import {
    PARTICLE_CONFIG_CRYSTAL,
    PARTICLE_CONFIG_CALDERA,
    PARTICLE_CONFIG_VAULT,
    PARTICLE_CONFIG_GROVE,
} from './js/engine/particle-configs.js';
import { initMapInteractions } from './js/ui/map-interactions.js';
import { loadInterior }        from './js/scenes/interior-loader.js';
import {
    INTERIOR_CRYSTAL,
    INTERIOR_CALDERA,
    INTERIOR_VAULT,
    INTERIOR_GROVE,
} from './js/scenes/interiors.js';

/* Bölge başlığı → iç mekan tanımı eşlemesi.
   Yeni bölge eklemek için sadece buraya bir satır eklemek yeterli. */
const INTERIOR_MAP = {
    'The Crystal Spires' : INTERIOR_CRYSTAL,
    'The Iron Caldera'   : INTERIOR_CALDERA,
    'The Forgotten Vault': INTERIOR_VAULT,
    'The Silver Grove'   : INTERIOR_GROVE,
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. Başlangıç ekranı parallax scroll
    initTitleScreen();

    // 2. Kayan yıldız animasyonu
    initShootingStars();

    // 3. Harita partikül sistemleri
    // CSS sınıf adı → sistem eşlemesi; initMapInteractions'a geçilir.
    const mapParticleSystems = {
        'crystal-spires' : makeParticleSystem('crystalCanvas',  PARTICLE_CONFIG_CRYSTAL),
        'iron-caldera'   : makeParticleSystem('calderaCanvas',  PARTICLE_CONFIG_CALDERA),
        'forgotten-vault': makeParticleSystem('vaultCanvas',    PARTICLE_CONFIG_VAULT),
        'silver-grove'   : makeParticleSystem('fireflyCanvas',  PARTICLE_CONFIG_GROVE),
    };

    // 4. Harita hover / click etkileşimleri
    initMapInteractions(mapParticleSystems, INTERIOR_MAP, loadInterior);
});
