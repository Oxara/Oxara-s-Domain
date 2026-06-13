/* ============================================================
   OXARA'S DOMAIN — js/scenes/interior-loader.js

   Haritayı gizleyip iç mekanı render eden, partikül sistemini
   başlatan ve X butonuna çıkış davranışı bağlayan yükleyici.
   ============================================================ */

import { makeParticleSystem } from '../engine/particles.js';
import { portalTransition }   from '../ui/portal.js';

/**
 * @param {{ build: () => string, particleConfig: Object, init?: () => void }} interiorDef
 */
export function loadInterior(interiorDef) {
    const mapSection      = document.getElementById('mapSection');
    const interiorSection = document.getElementById('interiorSection');

    mapSection.style.display      = 'none';
    interiorSection.style.display = 'block';
    interiorSection.innerHTML     = interiorDef.build();

    const particleSystem = makeParticleSystem('interiorCanvas', interiorDef.particleConfig);
    particleSystem.setActive(true);

    interiorDef.init?.();

    document.getElementById('closeInterior').addEventListener('click', () => {
        portalTransition(() => {
            particleSystem.setActive(false);
            interiorSection.style.display = 'none';
            interiorSection.innerHTML     = '';
            mapSection.style.display      = 'flex';
        });
    });
}
