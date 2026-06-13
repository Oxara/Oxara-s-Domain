# OXARA'S DOMAIN — Agent Kural Seti

Bu belge, proje üzerinde çalışacak her agentın uyması gereken kuralları tanımlar.
Kural setleri birbirinden bağımsız okunabilir; her kural **neden** var olduğunu da açıklar.

---

## 1. PROJE HARİTASI (Değiştirme, Doğrula)

Herhangi bir dosyaya dokunmadan önce bu yapıyı zihinsel model olarak kullan:

```
oxara/
├── index.html               ← Tek HTML; sadece import noktası
├── script.js                ← Sadece import + INTERIOR_MAP + DOMContentLoaded
├── style.css                ← Sadece @import satırları; buraya CSS yazma
│
├── css/
│   ├── tokens.css           ← Tüm CSS değişkenleri BURADA; başka yere yazma
│   ├── base.css             ← Reset
│   ├── title-screen.css     ← Sadece giriş ekranı
│   ├── map.css              ← Sadece harita + hotspot + tooltip
│   ├── interior.css         ← Sadece iç mekan + sprite maskeleri
│   ├── scroll-panel.css     ← Sadece parşömen + handbook
│   └── portal-exit.css      ← Sadece çıkış animasyonu
│
└── js/
    ├── utils/
    │   ├── math.js          ← DOM'suz saf fonksiyonlar
    │   └── canvas.js        ← Canvas boyut ve koordinat yardımcıları
    ├── engine/
    │   ├── particles.js     ← Fabrika; config alır, { setActive } döner
    │   ├── particle-configs.js ← Harita bölgesi config'leri
    │   └── shooting-stars.js   ← Yıldız animasyon motoru
    ├── ui/
    │   ├── portal.js        ← portalTransition() tek fonksiyon
    │   ├── map-interactions.js ← Hotspot listener'ları
    │   └── interior-builder.js ← buildInteriorHTML() + initHandbookLinks()
    └── scenes/
        ├── title-screen.js  ← initTitleScreen()
        ├── interiors.js     ← INTERIOR_* nesneleri
        └── interior-loader.js ← loadInterior()
```

---

## 2. DEĞİŞMEZ KURALLAR

Bu kurallar asla ihlal edilmez. Tek istisna yoktur.

### K-01 · Tek Sorumluluk — Her Dosya Bir İş Yapar
Her modül yalnızca kendi katmanının işini yapar. Sınırlar:

| Dosya | Yapabilir | Yapamaz |
|---|---|---|
| `utils/math.js` | Hesaplar, değer döner | `document` okur, canvas çizer |
| `utils/canvas.js` | Canvas API çağırır | DOM sorgusu yapar |
| `engine/particles.js` | Partikül döngüsü yönetir | Bölge rengini hard-code yazar |
| `ui/portal.js` | `#portalOverlay` yönetir | Sahne yükler, partikül başlatır |
| `scenes/interiors.js` | İç mekan HTML + config döner | DOM'u doğrudan değiştirir |

**İhlal örneği:** `particles.js` içine `document.getElementById('mapSection')` yazmak → **YASAK**.

---

### K-02 · CSS Renk ve Token Yasağı
`tokens.css` dışında hiçbir dosyaya ham renk, font adı, z-index sayısı veya süre (ms/s) yazılmaz.

```css
/* ✗ YANLIŞ — tokens.css dışında */
color: #00ffff;
z-index: 20;
transition: 0.3s ease;

/* ✓ DOĞRU */
color: var(--color-text-accent);
z-index: var(--z-tooltip);
transition: var(--dur-normal) ease;
```

**Neden:** Renk değişikliği isteklerinde tek dosya değişir; tutarsızlık oluşmaz.

---

### K-03 · ES Modül Sistemi — Import/Export Zorunlu
Tüm JS dosyaları `import`/`export` kullanır. `window.` global'leri, `<script>` tag'ı içine gömülü kod veya `var` ile global tanım yasaktır.

```js
// ✗ YANLIŞ
window.loadInterior = function() { ... }

// ✓ DOĞRU
export function loadInterior(interiorDef) { ... }
```

**Neden:** `script.js` `type="module"` olarak yükleniyor; global namespace kirlenmesi silentfailure'a yol açar.

---

### K-04 · HTML Üretimi Sadece `build()` İçinde
Dinamik HTML üreten tüm kod `interiors.js` içindeki `build()` metodlarına veya `buildInteriorHTML()` yardımcısına aittir. Başka hiçbir yerde `innerHTML` ile içerik yazılmaz.

```js
// ✗ YANLIŞ — interior-loader.js içinde
interiorSection.innerHTML = `<div class="interior-container">...`;

// ✓ DOĞRU
interiorSection.innerHTML = interiorDef.build();
```

---

### K-05 · Partikül Konfigürasyonu Arayüzü
Her partikül config nesnesi şu alanları içermek zorundadır:

```js
{
  anchorId     : string | undefined,  // spawn merkezi DOM id; yoksa canvas merkezi
  ambientCount : number,              // pasif modda max parçacık (0 olabilir)
  activeCount  : number,              // hover/aktif modda max parçacık
  spawn(W, H, aX, aY) { return { x, y, vx, vy, life, maxL, size, hue, ...özel } },
  update(p, aX, aY) { /* p.life azaltılmalı */ },
  draw(ctx, p, aX, aY) { /* ctx.clearRect ÇAĞIRMA */ },
  globalDraw?  : Function             // arka plan efekti, opsiyonel
}
```

**Kritik:** `update()` içinde `p.life` her karede azaltılmalıdır; aksi hâlde parçacık asla ölmez ve `particles` dizisi sınırsız büyür.

---

### K-06 · İç Mekan Tanımı Arayüzü
Her `INTERIOR_*` nesnesi şu arayüzü uygular:

```js
{
  build()         : () => string,   // zorunlu — sahne HTML'i
  particleConfig  : Object,         // zorunlu — K-05 arayüzüne uygun
  init?()         : () => void,     // opsiyonel — DOM hazır sonrası
}
```

`init()` yalnızca `interiorSection.innerHTML` doldurulduktan sonra çağrılır (`loadInterior` bunu garanti eder). `init()` içinde `document.querySelector` kullanmak güvenlidir.

---

### K-07 · Yeni Bölge Ekleme Protokolü
Yeni bir harita bölgesi eklenirken değiştirilmesi gereken dosyalar sırayla şunlardır:

1. `index.html` — `.region-hotspot` div'i ekle, `data-title` / `data-desc` yaz
2. `css/map.css` — `.yeni-bolge { top/left/width/height }` koordinat kuralı
3. `js/engine/particle-configs.js` — `PARTICLE_CONFIG_YENI` ekle
4. `js/scenes/interiors.js` — `INTERIOR_YENI` ekle
5. `script.js` — `INTERIOR_MAP` nesnesine ve `mapParticleSystems` objesine satır ekle

Başka dosyaya dokunma. Eğer dokunman gerekiyorsa, ya yanlış katmana yazıyorsundur ya da ortak bir şey refactor edilmesi gerekiyordur.

---

## 3. KOD YAZIM KURALLARI

### K-08 · Fonksiyon Dokümantasyonu Zorunlu
Her export edilen fonksiyon JSDoc bloğuna sahip olmalıdır. Minimum:

```js
/**
 * Kısa açıklama — ne yapar, ne döner.
 * @param {tip} paramAdı — ne anlama gelir, değiştirilince ne olur
 * @returns {tip}
 */
export function ornekFonksiyon(paramAdı) { ... }
```

Matematiksel hesaplama içeren her satır yanına ne hesaplandığını açıklayan bir yorum eklenir:

```js
// progress: [0,1] aralığında kat edilen mesafe oranı
const progress = traveled / distance;

// İlk %15'te lineer fade-in; son %25'te lineer fade-out
if (progress < 0.15) return progress / 0.15;
```

---

### K-09 · Değişken İsimlendirme Standartları

| Tür | Kural | Örnek |
|---|---|---|
| Export edilen sabitler | `BÜYÜK_YILAN` | `PARTICLE_CONFIG_CRYSTAL` |
| Fonksiyonlar | `camelCase` fiil | `makeParticleSystem`, `loadInterior` |
| DOM elementleri | `...El` soneki | `canvasEl`, `anchorEl` |
| Canvas context | `ctx` | `const ctx = canvas.getContext('2d')` |
| Partikül nesnesi | `p` | `config.update(p, aX, aY)` |
| Anchor koordinatı | `aX`, `aY` | `getAnchorPos()` dönüş değerleri |
| Genişlik/yükseklik | `W`, `H` | `spawn(W, H, aX, aY)` |
| Açı (radyan) | `...Rad` | `angleRad` |
| Açı (derece) | `...Deg` | `angleDeg` |

**Özellikle yasak isimler:** `data`, `temp`, `val`, `obj`, `arr`, `x1`, `y1` (bağlam dışı tek harfler).

---

### K-10 · Canvas Çizim Kuralları
- `ctx.clearRect()` yalnızca `particles.js` `tick()` içinde çağrılır. Config'lerin `draw()` metodları temizlik yapmaz.
- `ctx.shadowBlur` sıfırlanmadan bırakılmaz — kullandıktan hemen sonra `ctx.shadowBlur = 0` yaz.
- Koordinatlar piksel hizalaması için `Math.round()` ile yuvarlanır: `ctx.fillRect(Math.round(x), ...)`.

---

### K-11 · CSS Sınıf İsimlendirme
- BEM değil, bileşen-prefix yaklaşımı kullanılır.
- Yeni bileşen → yeni CSS dosyası → `style.css`'e `@import` satırı eklenir.
- Inline `style=""` attribute'u yalnızca JS tarafından dinamik olarak atanan değerler (arka plan görseli URL'si, animasyon başlangıç ofseti) için kullanılır.
- Statik görsel stil asla inline yazılmaz.

```html
<!-- ✗ YANLIŞ — statik stil inline -->
<div style="font-family: 'Press Start 2P'; color: #00ffff;">

<!-- ✓ DOĞRU — dinamik değer inline -->
<div class="interior-container"
     style="background-image: url('${config.bgImage}');">
```

---

## 4. MİMARİ KARARLAR

### K-12 · `clamp()` Kullanım Zorunluluğu
`Math.min(max, Math.max(min, val))` kalıbı yerine `utils/math.js` içindeki `clamp()` fonksiyonu kullanılır.

```js
// ✗ YANLIŞ
const alpha = Math.min(1, Math.max(0, someValue));

// ✓ DOĞRU
import { clamp } from '../utils/math.js';
const alpha = clamp(someValue, 0, 1);
```

---

### K-13 · `portalTransition()` Geçiş Zorunluluğu
Sahne geçişlerinde (harita → iç mekan, iç mekan → harita) `display` değişikliği doğrudan yapılmaz; her zaman `portalTransition()` sarmalayıcısı kullanılır.

```js
// ✗ YANLIŞ
mapSection.style.display = 'none';
interiorSection.style.display = 'block';

// ✓ DOĞRU
portalTransition(() => {
    mapSection.style.display = 'none';
    interiorSection.style.display = 'block';
});
```

**Neden:** Kullanıcı ani siyah flash yaşamaz; geçiş süresi tek yerden kontrol edilir.

---

### K-14 · `resize` Listener Yönetimi
Canvas boyutlandırması `resizeCanvas(canvas)` çağrısıyla yapılır ve her canvas için window'a **bir kez** eklenir. Çoklu listener eklenmez.

```js
// ✓ DOĞRU — her sistem kendi canvas'ı için bir kez ekler
resizeCanvas(canvasEl);
window.addEventListener('resize', () => resizeCanvas(canvasEl));
```

---

### K-15 · `requestAnimationFrame` Döngüsü Yönetimi
`makeParticleSystem` içindeki `tick()` kendi içinde `requestAnimationFrame(tick)` çağırır ve sonsuza çalışır. İç mekan çıkışında `setActive(false)` çağrılır ama döngü durdurulmaz — bu kasıtlıdır, ambient partiküller havada sönerken görsel geçiş doğal kalır.

Döngüyü durdurmak için `rafId` saklanması gerekiyorsa bunu `tick` döndüren bir yapı ile yap:

```js
// Döngüyü gerçekten durdurmak gerekirse
let rafId = requestAnimationFrame(tick);
return {
    setActive: (v) => { active = v; },
    stop: () => cancelAnimationFrame(rafId),
};
```

---

## 5. YASAK LİSTESİ

Aşağıdakiler hiçbir koşulda yapılmaz:

| # | Yasak | Alternatif |
|---|---|---|
| Y-01 | `script.js`'e iş mantığı yazmak | İlgili modüle taşı |
| Y-02 | `style.css`'e doğrudan CSS yazmak | İlgili bileşen dosyasına yaz |
| Y-03 | Ham renk kodu (`#rrggbb`) yazmak | `var(--color-*)` kullan |
| Y-04 | `window.addEventListener('resize', ...)` çoklu ekleme | Yalnızca init'te bir kez ekle |
| Y-05 | `p.life` azaltmadan `update()` bitirmek | Her update sonunda `p.life -= ...` |
| Y-06 | `ctx.shadowBlur` sıfırlamadan bırakmak | Kullanım sonrası `ctx.shadowBlur = 0` |
| Y-07 | `portalTransition` olmadan sahne geçişi | `portalTransition(() => { ... })` |
| Y-08 | `INTERIOR_MAP` dışında bölge-mekan bağlantısı | Sadece `script.js`'deki map'i düzenle |
| Y-09 | `build()` dışında dinamik HTML üretmek | `buildInteriorHTML()` veya `build()` |
| Y-10 | Statik stili inline `style=""` yazmak | CSS dosyasına sınıf yaz |

---

## 6. KONTROL LİSTESİ (Her Değişiklik Öncesi)

```
□ Değiştirdiğim dosya bu işi yapmak için doğru katmanda mı?
□ Yeni renk/boyut/süre değişkeni mi yazdım? → tokens.css'e taşı
□ Yeni export var mı? → JSDoc yorumu eklendi mi?
□ Matematiksel hesap var mı? → Açıklayıcı yorum var mı?
□ p.life her update'te azalıyor mu?
□ ctx.shadowBlur kullandıysam sıfırladım mı?
□ Sahne geçişi portalTransition ile mi sarmalandı?
□ window resize listener'ı bir kez mi ekleniyor?
□ Yeni bölge ekledim → K-07'deki 5 adımın hepsini yaptım mı?
```

---

## 7. HIZLI BAŞVURU — Hangi Dosyayı Değiştirirsin?

| İstek | Değiştirilen Dosya(lar) |
|---|---|
| Renk değiştir | `css/tokens.css` |
| Animasyon süresi değiştir | `css/tokens.css` |
| Harita bölge koordinatı değiştir | `css/map.css` |
| Tooltip konumu değiştir | `css/map.css` |
| Sprite kenar fade'ini ayarla | `css/interior.css` |
| Parşömen boyutunu değiştir | `css/scroll-panel.css` |
| Yeni handbook linki ekle | `js/scenes/interiors.js` → `INTERIOR_CRYSTAL.build()` |
| Partikül hızını değiştir | `js/engine/particle-configs.js` → ilgili `spawn()` |
| Partikül sayısını değiştir | `js/engine/particle-configs.js` → `activeCount` / `ambientCount` |
| Portal geçiş süresini değiştir | `js/ui/portal.js` → `duration` parametresi |
| Yıldız hızını değiştir | `js/utils/math.js` → `createShootingStarState()` |
| Parallax katsayısını değiştir | `js/utils/math.js` → `calcScrollVisuals()` |
| Yeni iç mekan ekle | `js/scenes/interiors.js` + `script.js` + `index.html` + `css/map.css` |
