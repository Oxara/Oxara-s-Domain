/* ============================================================
   OXARA'S DOMAIN — js/ui/interior-builder.js

   İç mekan HTML'i üreten yardımcı fonksiyonlar.
   buildInteriorHTML → sprite tabanlı sahneler için şablon.
   initHandbookLinks → Crystal Spires portal çıkış davranışı.
   ============================================================ */

/**
 * Sprite tabanlı iç mekan HTML'i üretir.
 * @param {{
 *   bgImage: string,
 *   canvasId: string,
 *   canvasZIndex: number,
 *   dialogText: string,
 *   spriteContent: string
 * }} config
 * @returns {string}
 */
export function buildInteriorHTML(config) {
    return `
        <div class="interior-container"
             style="background-image: url('${config.bgImage}');">
            <div id="closeInterior" class="close-btn">X</div>
            <canvas id="${config.canvasId}"
                    style="position:absolute; top:0; left:0;
                           width:100%; height:100%;
                           pointer-events:none; z-index:${config.canvasZIndex};"></canvas>
            ${config.spriteContent}
            <div class="dialog-box">${config.dialogText}</div>
        </div>`;
}

/**
 * Crystal Spires handbook linklerine portal çıkış animasyonunu bağlar.
 * Tıklama → overlay görünür → yeni sekme açılır → overlay kapanır.
 */
export function initHandbookLinks() {
    document.querySelectorAll('.handbook-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href    = link.getAttribute('href');
            const name    = link.getAttribute('data-name');
            const overlay = document.getElementById('portalExitOverlay');
            const nameEl  = document.getElementById('portalExitName');

            nameEl.textContent = name;
            overlay.classList.add('visible');

            setTimeout(() => window.open(href, '_blank'), 1800);
            setTimeout(() => overlay.classList.remove('visible'), 2600);
        });
    });
}
