/* ============================================================
   OXARA'S DOMAIN — js/scenes/title-screen.js

   Başlangıç ekranı parallax scroll davranışı.
   50px scroll sonrası haritaya geçer ve başlık ekranını gizler.
   ============================================================ */

import { calcScrollVisuals } from '../utils/math.js';

/**
 * Parallax scroll listener'ını başlatır.
 * Haritaya geçildiğinde listener'ı kendiliğinden kaldırır.
 */
export function initTitleScreen() {
    function handleScroll() {
        const scrollY   = window.pageYOffset;
        const visuals   = calcScrollVisuals(scrollY);
        const bgLayer   = document.getElementById('bgLayer');
        const textLayer = document.getElementById('textLayer');

        bgLayer.style.filter      = `brightness(${visuals.bgBrightness})`;
        bgLayer.style.transform   = `translateY(${visuals.bgTranslateY}px)`;
        textLayer.style.transform = `translateY(${visuals.textTranslateY}px)`;
        textLayer.style.opacity   = String(visuals.textOpacity);

        if (scrollY > 50) {
            window.removeEventListener('scroll', handleScroll);
            const mapSec = document.getElementById('mapSection');
            mapSec.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.getElementById('titleScreen').style.display = 'none';
                mapSec.style.marginTop       = '0';
                mapSec.style.paddingTop      = '0';
                window.scrollTo(0, 0);
                document.body.style.overflow = 'hidden';
            }, 800);
        }
    }

    window.addEventListener('scroll', handleScroll);
}
