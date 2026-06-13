/* ============================================================
   OXARA'S DOMAIN — js/ui/map-interactions.js

   Harita hotspot'larına tooltip ve partikül etkileşimlerini
   bağlar. Bölge tıklamalarında portal geçişini tetikler.
   ============================================================ */

import { portalTransition } from './portal.js';

/**
 * Tooltip içeriğini günceller.
 * @param {string} title
 * @param {string} desc
 */
function updateTooltip(title, desc) {
    document.getElementById('tooltipTitle').innerText = title;
    document.getElementById('tooltipDesc').innerText  = desc;
}

/**
 * Tüm harita hotspot'larına etkileşim listener'larını bağlar.
 *
 * @param {{ [cssClass: string]: { setActive: Function } }} particleSystems
 *   — CSS sınıf adı → partikül sistem eşlemesi
 * @param {{ [title: string]: Object }} interiorMap
 *   — Bölge başlığı → iç mekan tanımı eşlemesi
 * @param {Function} loadInterior — İç mekan yükleyici fonksiyon
 */
export function initMapInteractions(particleSystems, interiorMap, loadInterior) {
    const hotspots = document.querySelectorAll('.region-hotspot');
    const tooltip  = document.getElementById('mapTooltip');

    hotspots.forEach(spot => {
        const title = spot.getAttribute('data-title');
        const desc  = spot.getAttribute('data-desc');

        // CSS sınıflarından partikül sistemine karşılık geleni bul
        function getSystem() {
            const cls = [...spot.classList].find(c => particleSystems[c]);
            return cls ? particleSystems[cls] : null;
        }

        spot.addEventListener('mouseenter', () => {
            updateTooltip(title, desc);
            tooltip.classList.add('visible');
            getSystem()?.setActive(true);
        });

        spot.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            getSystem()?.setActive(false);
        });

        spot.addEventListener('click', () => {
            const interior = interiorMap[title];
            if (!interior) return;
            portalTransition(() => loadInterior(interior));
        });
    });
}
