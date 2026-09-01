// ============================================================
// PRODUCT DATA
// ============================================================
const PRODUCTS = [
  { id: 'gs-101', name: 'Field Shell Jacket', cat: 'Outerwear', price: 148, was: null, tag: 'new', sku: 'GS-101-OLV', desc: 'A weatherproof shell built from a matte ripstop, cut generous over layers. Storm flap, two chest pockets, adjustable hem.', sizes: ['S', 'M', 'L', 'XL'], art: 'jacket', tone: '#5B6146' },
  { id: 'gs-102', name: 'Canvas Work Coat', cat: 'Outerwear', price: 168, was: 198, tag: 'sale', sku: 'GS-102-BLK', desc: 'Heavyweight 12oz cotton canvas, corduroy collar, blanket lining through the body for cold-morning starts.', sizes: ['S', 'M', 'L', 'XL'], art: 'coat', tone: '#2B2D30' },
  { id: 'gs-103', name: 'Insulated Vest', cat: 'Outerwear', price: 98, was: null, tag: 'restock', sku: 'GS-103-RST', desc: 'Lightweight synthetic fill, quilted through the body, brushed collar. Layers under the Field Shell without bulk.', sizes: ['S', 'M', 'L'], art: 'vest', tone: '#A6532E' },
  { id: 'gs-104', name: 'Waxed Trucker', cat: 'Outerwear', price: 138, was: null, tag: null, sku: 'GS-104-TAN', desc: 'Waxed cotton trucker jacket that softens and patinas with wear. Corduroy collar, brass hardware.', sizes: ['S', 'M', 'L', 'XL'], art: 'trucker', tone: '#B79463' },

  { id: 'gs-201', name: 'Heavyweight Tee', cat: 'Tops', price: 38, was: null, tag: null, sku: 'GS-201-STN', desc: '7oz combed cotton, boxy fit, taped shoulder seam for a garment that holds its shape wash after wash.', sizes: ['XS', 'S', 'M', 'L', 'XL'], art: 'tee', tone: '#8B8478' },
  { id: 'gs-202', name: 'Flannel Overshirt', cat: 'Tops', price: 78, was: null, tag: 'new', sku: 'GS-202-RED', desc: 'Brushed flannel in a small check, worn open as a layer or buttoned as a shirt. Double chest pockets.', sizes: ['S', 'M', 'L', 'XL'], art: 'overshirt', tone: '#8B2E24' },
  { id: 'gs-203', name: 'Crewneck Sweatshirt', cat: 'Tops', price: 64, was: 78, tag: 'sale', sku: 'GS-203-GRY', desc: 'Mid-weight loopback cotton, garment-dyed for a soft worn-in hand from the first wear.', sizes: ['XS', 'S', 'M', 'L', 'XL'], art: 'sweatshirt', tone: '#6E7378' },
  { id: 'gs-204', name: 'Oxford Work Shirt', cat: 'Tops', price: 58, was: null, tag: null, sku: 'GS-204-BLU', desc: 'Sturdy oxford cloth, reinforced elbow panels, single chest pocket with a hidden pencil slot.', sizes: ['S', 'M', 'L', 'XL'], art: 'shirt', tone: '#34506B' },

  { id: 'gs-301', name: 'Utility Cargo Pant', cat: 'Bottoms', price: 92, was: null, tag: 'new', sku: 'GS-301-OLV', desc: 'Straight leg cargo in a brushed twill, bellowed side pockets, reinforced knee panels.', sizes: ['28', '30', '32', '34', '36'], art: 'cargo', tone: '#5B6146' },
  { id: 'gs-302', name: 'Selvedge Straight Jean', cat: 'Bottoms', price: 118, was: null, tag: 'restock', sku: 'GS-302-IND', desc: 'Rigid 13oz selvedge denim, straight through the leg, built to break in around your own wear pattern.', sizes: ['28', '30', '32', '34', '36'], art: 'jean', tone: '#2B3A55' },
  { id: 'gs-303', name: 'Canvas Work Pant', cat: 'Bottoms', price: 84, was: 98, tag: 'sale', sku: 'GS-303-TAN', desc: 'Double-knee canvas trouser with a triple-stitched seat, built for a full day on your feet.', sizes: ['28', '30', '32', '34', '36'], art: 'pant', tone: '#B79463' },

  { id: 'gs-401', name: 'Canvas Tool Roll', cat: 'Accessories', price: 48, was: null, tag: null, sku: 'GS-401-TAN', desc: 'Waxed canvas roll with six tool loops and a brass buckle closure. Fits most hand-tool kits.', sizes: ['One Size'], art: 'toolroll', tone: '#B79463' },
  { id: 'gs-402', name: 'Wool Watch Cap', cat: 'Accessories', price: 32, was: null, tag: 'new', sku: 'GS-402-CHR', desc: 'Merino wool knit, unlined, ribbed through the whole cap for a close, warm fit.', sizes: ['One Size'], art: 'cap', tone: '#3A3D3F' }
];

// ============================================================
// PRODUCT ART — original line-art illustrations (no external
// images / no third-party product photos; drawn to match the
// site's ink + signal-yellow workwear-flat-sketch aesthetic)
// ============================================================
const SIGNAL = '#E8B923';

function svgWrap(inner, tone) {
  return `<svg class="product-art" viewBox="0 0 200 240" preserveAspectRatio="xMidYMid meet" style="--art-tone:${tone}" aria-hidden="true">
    <rect x="1" y="1" width="198" height="238" rx="4" fill="none" stroke="${tone}" stroke-opacity="0.18" stroke-width="1"/>
    ${inner}
  </svg>`;
}

const GARMENT_ART = {
  jacket: (t) => `
    <path d="M60 46 L82 32 L100 46 L118 32 L140 46 L152 70 L138 82 L134 200 L66 200 L62 82 L48 70 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M82 32 L100 60 L118 32" fill="none" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="100" y1="60" x2="100" y2="196" stroke="${t}" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
    <rect x="74" y="104" width="22" height="16" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <rect x="104" y="104" width="22" height="16" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="100" cy="60" r="3.5" fill="${SIGNAL}"/>`,
  coat: (t) => `
    <path d="M58 50 L82 30 L100 46 L118 30 L142 50 L150 78 L136 88 L132 214 L68 214 L64 88 L50 78 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M82 30 L70 66 L100 58 L130 66 L118 30" fill="none" stroke="${t}" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="70" y1="52" x2="130" y2="52" stroke="${t}" stroke-width="1.5" stroke-opacity="0.5"/>
    <line x1="72" y1="59" x2="128" y2="59" stroke="${t}" stroke-width="1.5" stroke-opacity="0.5"/>
    <rect x="72" y="140" width="24" height="20" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <rect x="104" y="140" width="24" height="20" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="100" cy="78" r="3.5" fill="${SIGNAL}"/>
    <circle cx="100" cy="104" r="3.5" fill="${SIGNAL}"/>`,
  vest: (t) => `
    <path d="M70 44 L100 60 L130 44 L142 72 L128 84 L126 196 L74 196 L72 84 L58 72 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M70 44 L86 96 L100 60 L114 96 L130 44" fill="none" stroke="${t}" stroke-width="2" stroke-opacity="0.55"/>
    <line x1="100" y1="60" x2="100" y2="192" stroke="${t}" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
    <path d="M76 110 L94 118 M76 128 L94 136 M106 118 L124 110 M106 136 L124 128" stroke="${t}" stroke-width="1.4" stroke-opacity="0.4"/>
    <circle cx="100" cy="60" r="3.5" fill="${SIGNAL}"/>`,
  trucker: (t) => `
    <path d="M62 48 L84 32 L100 44 L116 32 L138 48 L148 74 L134 84 L130 164 L70 164 L66 84 L52 74 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="70" y1="150" x2="130" y2="150" stroke="${t}" stroke-width="2.5" stroke-opacity="0.6"/>
    <rect x="78" y="98" width="20" height="15" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <rect x="102" y="98" width="20" height="15" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="88" cy="106" r="2" fill="${SIGNAL}"/>
    <circle cx="112" cy="106" r="2" fill="${SIGNAL}"/>`,
  tee: (t) => `
    <path d="M70 58 L44 74 L54 96 L70 88 L70 196 L130 196 L130 88 L146 96 L156 74 L130 58 L112 68 L88 68 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M88 68 Q100 82 112 68" fill="none" stroke="${t}" stroke-width="2.5"/>
    <circle cx="100" cy="75" r="3" fill="${SIGNAL}"/>`,
  overshirt: (t) => `
    <path d="M64 50 L86 32 L100 48 L114 32 L136 50 L146 76 L132 86 L128 198 L72 198 L68 86 L54 76 Z" fill="${t}" fill-opacity="0.1" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M86 32 L96 74 L86 200 M114 32 L104 74 L114 200" fill="none" stroke="${t}" stroke-width="2" stroke-opacity="0.55"/>
    <circle cx="100" cy="86" r="2" fill="${t}" fill-opacity="0.6"/>
    <circle cx="100" cy="108" r="2" fill="${t}" fill-opacity="0.6"/>
    <circle cx="100" cy="130" r="2" fill="${t}" fill-opacity="0.6"/>
    <circle cx="100" cy="152" r="2" fill="${t}" fill-opacity="0.6"/>
    <rect x="76" y="94" width="18" height="14" rx="1.5" fill="none" stroke="${t}" stroke-width="2"/>
    <rect x="106" y="94" width="18" height="14" rx="1.5" fill="none" stroke="${t}" stroke-width="2"/>
    <circle cx="100" cy="48" r="3.5" fill="${SIGNAL}"/>`,
  sweatshirt: (t) => `
    <path d="M66 62 L46 78 L58 100 L70 92 L70 200 L130 200 L130 92 L142 100 L154 78 L134 62 L112 70 L88 70 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M86 70 Q100 84 114 70" fill="none" stroke="${t}" stroke-width="3"/>
    <line x1="70" y1="188" x2="130" y2="188" stroke="${t}" stroke-width="2.5" stroke-opacity="0.6"/>
    <line x1="58" y1="98" x2="70" y2="92" stroke="${t}" stroke-width="2.5" stroke-opacity="0.6"/>
    <line x1="142" y1="98" x2="130" y2="92" stroke="${t}" stroke-width="2.5" stroke-opacity="0.6"/>
    <circle cx="100" cy="78" r="3" fill="${SIGNAL}"/>`,
  shirt: (t) => `
    <path d="M68 50 L90 34 L100 46 L110 34 L132 50 L142 74 L128 84 L124 196 L76 196 L72 84 L58 74 Z" fill="${t}" fill-opacity="0.1" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M90 34 L100 60 L110 34" fill="none" stroke="${t}" stroke-width="2.5"/>
    <line x1="100" y1="60" x2="100" y2="192" stroke="${t}" stroke-width="2" stroke-opacity="0.5" stroke-dasharray="1 6"/>
    <circle cx="100" cy="76" r="1.8" fill="${t}" fill-opacity="0.6"/>
    <circle cx="100" cy="96" r="1.8" fill="${t}" fill-opacity="0.6"/>
    <circle cx="100" cy="116" r="1.8" fill="${t}" fill-opacity="0.6"/>
    <rect x="80" y="96" width="18" height="14" rx="1.5" fill="none" stroke="${t}" stroke-width="2"/>
    <circle cx="100" cy="60" r="3.5" fill="${SIGNAL}"/>`,
  cargo: (t) => `
    <path d="M72 38 L128 38 L132 74 L118 214 L100 214 L98 130 L96 214 L78 214 L68 74 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="72" y1="52" x2="128" y2="52" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <rect x="104" y="120" width="24" height="26" rx="2" fill="none" stroke="${t}" stroke-width="2.5"/>
    <line x1="104" y1="132" x2="128" y2="132" stroke="${t}" stroke-width="1.6" stroke-opacity="0.55"/>
    <circle cx="116" cy="122" r="2" fill="${SIGNAL}"/>`,
  jean: (t) => `
    <path d="M72 38 L128 38 L132 74 L118 214 L100 214 L98 130 L96 214 L78 214 L68 74 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M76 42 Q88 56 76 74" fill="none" stroke="${SIGNAL}" stroke-width="2" stroke-opacity="0.8"/>
    <rect x="106" y="52" width="16" height="14" rx="1.5" fill="none" stroke="${t}" stroke-width="2"/>
    <line x1="72" y1="52" x2="128" y2="52" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <line x1="80" y1="90" x2="76" y2="200" stroke="${SIGNAL}" stroke-width="1.6" stroke-opacity="0.6" stroke-dasharray="2 5"/>
    <line x1="120" y1="90" x2="124" y2="200" stroke="${SIGNAL}" stroke-width="1.6" stroke-opacity="0.6" stroke-dasharray="2 5"/>`,
  pant: (t) => `
    <path d="M72 38 L128 38 L132 74 L118 214 L100 214 L98 130 L96 214 L78 214 L68 74 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="72" y1="52" x2="128" y2="52" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <line x1="78" y1="128" x2="98" y2="128" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <line x1="102" y1="128" x2="122" y2="128" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <line x1="78" y1="152" x2="98" y2="152" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <line x1="102" y1="152" x2="122" y2="152" stroke="${t}" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="75" cy="44" r="2" fill="${SIGNAL}"/>
    <circle cx="125" cy="44" r="2" fill="${SIGNAL}"/>`,
  toolroll: (t) => `
    <path d="M40 90 Q40 66 64 66 L150 66 Q160 66 160 76 L160 148 Q160 158 150 158 L64 158 Q40 158 40 134 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="52" cy="112" rx="12" ry="46" fill="${t}" fill-opacity="0.16" stroke="${t}" stroke-width="3"/>
    <line x1="76" y1="70" x2="76" y2="154" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="96" y1="70" x2="96" y2="154" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="116" y1="70" x2="116" y2="154" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="136" y1="70" x2="136" y2="154" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <path d="M150 100 L172 100 L172 124 L150 124" fill="none" stroke="${SIGNAL}" stroke-width="3" stroke-linecap="round"/>`,
  cap: (t) => `
    <path d="M60 130 Q60 62 100 56 Q140 62 140 130 Z" fill="${t}" fill-opacity="0.12" stroke="${t}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="56" y="128" width="88" height="26" rx="6" fill="${t}" fill-opacity="0.18" stroke="${t}" stroke-width="3"/>
    <line x1="70" y1="72" x2="70" y2="128" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="86" y1="62" x2="86" y2="128" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="100" y1="58" x2="100" y2="128" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="114" y1="62" x2="114" y2="128" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <line x1="130" y1="72" x2="130" y2="128" stroke="${t}" stroke-width="1.6" stroke-opacity="0.5"/>
    <circle cx="100" cy="58" r="3.5" fill="${SIGNAL}"/>`
};

function productArt(p, size) {
  const draw = GARMENT_ART[p.art];
  if (!draw) return '';
  const svg = svgWrap(draw(p.tone), p.tone);
  return `<div class="art-frame ${size || ''}">${svg}</div>`;
}

const CATEGORY_LABELS = { All: 'All', Outerwear: 'Outerwear', Tops: 'Tops', Bottoms: 'Bottoms', Accessories: 'Accessories' };
const SHIPPING_FLAT = 8;
const FREE_SHIP_THRESHOLD = 150;
const TAX_RATE = 0.0825;

// ============================================================
// STATE
// ============================================================
const state = {
  category: 'All',
  sort: 'featured',
  cart: [] // { id, size, qty }
};

function money(n) { return '$' + n.toFixed(2); }
function findProduct(id) { return PRODUCTS.find(p => p.id === id); }

// ============================================================
// PRODUCT GRID
// ============================================================
function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('result-count');
  if (!grid) return;

  let list = state.category === 'All' ? PRODUCTS.slice() : PRODUCTS.filter(p => p.cat === state.category);

  if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (state.sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));

  grid.innerHTML = list.map(p => `
    <article class="product-card tilt" data-id="${p.id}">
      <span class="punch-hole"></span>
      ${p.tag ? `<span class="card-tag ${p.tag}">${p.tag}</span>` : ''}
      <div class="card-media" data-open-quickview="${p.id}">
        ${productArt(p, 'card')}
        <span class="media-cat mono">${p.cat}</span>
        <span class="quick-view-hint">Quick view</span>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <span class="card-sku mono">SKU ${p.sku}</span>
        <div class="barcode" aria-hidden="true"></div>
        <div class="card-foot">
          <span class="price">${p.was ? `<span class="was">${money(p.was)}</span>` : ''}${money(p.price)}</span>
          <button class="add-btn" data-quick-add="${p.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');

  if (countEl) countEl.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;

  grid.querySelectorAll('[data-open-quickview]').forEach(el => {
    el.addEventListener('click', () => openQuickView(el.getAttribute('data-open-quickview')));
  });
  grid.querySelectorAll('[data-quick-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = findProduct(btn.getAttribute('data-quick-add'));
      addToCart(product.id, product.sizes[0]);
      btn.textContent = 'Added';
      btn.classList.add('added');
      setTimeout(() => { btn.textContent = '+ Add'; btn.classList.remove('added'); }, 1100);
    });
  });

  initTilt(grid);
}

function initFilterBar() {
  const chipRow = document.getElementById('chip-row');
  if (!chipRow) return;
  chipRow.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chipRow.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.category = chip.getAttribute('data-cat');
      renderProductGrid();
    });
  });
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      renderProductGrid();
    });
  }
}

// ============================================================
// QUICK VIEW MODAL
// ============================================================
let quickViewSize = null;

function openQuickView(id) {
  const p = findProduct(id);
  if (!p) return;
  quickViewSize = p.sizes[0];

  document.getElementById('qv-title').textContent = p.name;
  document.getElementById('qv-cat').textContent = p.cat;
  document.getElementById('qv-sku').textContent = 'SKU ' + p.sku;
  document.getElementById('qv-price').innerHTML = (p.was ? `<span class="was">${money(p.was)}</span>` : '') + money(p.price);
  document.getElementById('qv-desc').textContent = p.desc;
  document.getElementById('qv-media-mark').innerHTML = productArt(p, 'modal');

  const sizeRow = document.getElementById('qv-sizes');
  sizeRow.innerHTML = p.sizes.map((s, i) => `<button class="size-opt${i === 0 ? ' selected' : ''}" data-size="${s}">${s}</button>`).join('');
  sizeRow.querySelectorAll('.size-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeRow.querySelectorAll('.size-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      quickViewSize = btn.getAttribute('data-size');
    });
  });

  const addBtn = document.getElementById('qv-add');
  addBtn.onclick = () => {
    addToCart(p.id, quickViewSize);
    addBtn.textContent = 'Added to cart';
    setTimeout(() => { addBtn.textContent = 'Add to cart'; closeQuickView(); }, 700);
  };

  document.getElementById('modal-backdrop').classList.add('open');
}

function closeQuickView() {
  document.getElementById('modal-backdrop').classList.remove('open');
}

// ============================================================
// CART
// ============================================================
function addToCart(id, size) {
  const existing = state.cart.find(l => l.id === id && l.size === size);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, size, qty: 1 });
  renderCart();
  openCart();
}

function changeQty(id, size, delta) {
  const line = state.cart.find(l => l.id === id && l.size === size);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) state.cart = state.cart.filter(l => !(l.id === id && l.size === size));
  renderCart();
}

function removeLine(id, size) {
  state.cart = state.cart.filter(l => !(l.id === id && l.size === size));
  renderCart();
}

function cartTotals() {
  const subtotal = state.cart.reduce((sum, l) => sum + (findProduct(l.id).price * l.qty), 0);
  const shipping = state.cart.length === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const countEls = document.querySelectorAll('.cart-count');
  const totalQty = state.cart.reduce((n, l) => n + l.qty, 0);
  countEls.forEach(el => { el.textContent = totalQty; el.style.display = totalQty > 0 ? 'inline-flex' : 'none'; });

  if (!itemsEl) return;

  if (state.cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Nothing on the packing slip yet.</div>';
  } else {
    itemsEl.innerHTML = state.cart.map(l => {
      const p = findProduct(l.id);
      return `
        <div class="cart-line">
          <div class="thumb">${p.cat}</div>
          <div>
            <div class="name">${p.name}</div>
            <div class="meta mono">SIZE ${l.size} · ${money(p.price)}</div>
            <div class="qty-row">
              <button class="qty-btn" data-qty-down="${p.id}|${l.size}">−</button>
              <span class="qty-val mono">${l.qty}</span>
              <button class="qty-btn" data-qty-up="${p.id}|${l.size}">+</button>
            </div>
            <button class="remove-btn" data-remove="${p.id}|${l.size}">Remove</button>
          </div>
          <div class="line-price">${money(p.price * l.qty)}</div>
        </div>
      `;
    }).join('');

    itemsEl.querySelectorAll('[data-qty-up]').forEach(b => b.addEventListener('click', () => {
      const [id, size] = b.getAttribute('data-qty-up').split('|'); changeQty(id, size, 1);
    }));
    itemsEl.querySelectorAll('[data-qty-down]').forEach(b => b.addEventListener('click', () => {
      const [id, size] = b.getAttribute('data-qty-down').split('|'); changeQty(id, size, -1);
    }));
    itemsEl.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      const [id, size] = b.getAttribute('data-remove').split('|'); removeLine(id, size);
    }));
  }

  const { subtotal, shipping, tax, total } = cartTotals();
  const subEl = document.getElementById('cart-subtotal');
  const shipEl = document.getElementById('cart-shipping');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');
  if (subEl) subEl.textContent = money(subtotal);
  if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : money(shipping);
  if (taxEl) taxEl.textContent = money(tax);
  if (totalEl) totalEl.textContent = money(total);

  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) checkoutBtn.disabled = state.cart.length === 0;

  renderCheckoutSummary();
}

function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-backdrop').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-backdrop').classList.remove('open');
}

// ============================================================
// VIEW SWITCHING (shop / checkout / confirm) — all one page,
// so cart state survives without any browser storage
// ============================================================
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkout-summary-lines');
  if (!el) return;
  el.innerHTML = state.cart.map(l => {
    const p = findProduct(l.id);
    return `<div class="order-line"><span>${p.name} (${l.size}) × ${l.qty}</span><span>${money(p.price * l.qty)}</span></div>`;
  }).join('') || '<div class="order-line"><span>No items</span><span>—</span></div>';

  const { subtotal, shipping, tax, total } = cartTotals();
  document.getElementById('co-subtotal').textContent = money(subtotal);
  document.getElementById('co-shipping').textContent = shipping === 0 ? 'FREE' : money(shipping);
  document.getElementById('co-tax').textContent = money(tax);
  document.getElementById('co-total').textContent = money(total);
}

// ============================================================
// CHECKOUT FORM VALIDATION
// ============================================================
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const validators = {
    fullName: v => v.trim().length >= 2 || 'Enter your full name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    address: v => v.trim().length >= 5 || 'Enter your street address.',
    city: v => v.trim().length >= 2 || 'Enter your city.',
    state: v => v.trim().length === 2 || 'Use a 2-letter state code.',
    zip: v => /^\d{5}(-\d{4})?$/.test(v.trim()) || 'Enter a valid ZIP code.',
    cardNumber: v => v.replace(/\s/g, '').length === 16 && /^\d+$/.test(v.replace(/\s/g, '')) || 'Enter a 16-digit card number.',
    cardExpiry: v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim()) || 'Use MM/YY format.',
    cardCvc: v => /^\d{3,4}$/.test(v.trim()) || 'Enter a valid CVC.'
  };

  const setState = (el, valid, msg) => {
    const wrap = el.closest('.field');
    if (valid) wrap.classList.remove('invalid');
    else { wrap.classList.add('invalid'); wrap.querySelector('.err').textContent = msg; }
  };
  const validateField = (el) => {
    const rule = validators[el.name];
    if (!rule) return true;
    const result = rule(el.value);
    const valid = result === true;
    setState(el, valid, valid ? '' : result);
    return valid;
  };

  Object.keys(validators).forEach(name => {
    const el = form.elements[name];
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) validateField(el); });
  });

  const cardNumberEl = form.elements['cardNumber'];
  if (cardNumberEl) {
    cardNumberEl.addEventListener('input', () => {
      let digits = cardNumberEl.value.replace(/\D/g, '').slice(0, 16);
      cardNumberEl.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
  }
  const expiryEl = form.elements['cardExpiry'];
  if (expiryEl) {
    expiryEl.addEventListener('input', () => {
      let digits = expiryEl.value.replace(/\D/g, '').slice(0, 4);
      if (digits.length >= 3) digits = digits.slice(0, 2) + '/' + digits.slice(2);
      expiryEl.value = digits;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.cart.length === 0) return;
    let allValid = true;
    Object.keys(validators).forEach(name => {
      const el = form.elements[name];
      if (el && !validateField(el)) allValid = false;
    });
    if (!allValid) return;

    const orderNum = 'GS' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('order-number').textContent = orderNum;
    state.cart = [];
    renderCart();
    form.reset();
    showView('confirm');
  });
}

// ============================================================
// HERO 3D — rotating hang tag
// ============================================================
function initHero3D() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;
  if (typeof THREE === 'undefined') { container.classList.add('no-webgl'); return; }

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { container.classList.add('no-webgl'); return; }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
  camera.position.set(0, 0.4, 6.2);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(4, 5, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe8b923, 0.5);
  fill.position.set(-3, -1, 3);
  scene.add(fill);

  const group = new THREE.Group();

  // Tag body — flat box with a punch hole notch (approximated as a ring)
  const tagShape = new THREE.Shape();
  const w = 1.7, h = 2.4, r = 0.18;
  tagShape.moveTo(-w / 2 + r, -h / 2);
  tagShape.lineTo(w / 2 - r, -h / 2);
  tagShape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  tagShape.lineTo(w / 2, h / 2 - r);
  tagShape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  tagShape.lineTo(-w / 2 + r, h / 2);
  tagShape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  tagShape.lineTo(-w / 2, -h / 2 + r);
  tagShape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const hole = new THREE.Path();
  hole.absarc(0, h / 2 - 0.32, 0.09, 0, Math.PI * 2, false);
  tagShape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(tagShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({ color: 0xf3f2ee, roughness: 0.85, metalness: 0.02 });
  const tag = new THREE.Mesh(geo, mat);
  group.add(tag);

  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x17181a, transparent: true, opacity: 0.4 }));
  group.add(line);

  // Signal-yellow stripe block near the bottom of the tag
  const stripeGeo = new THREE.BoxGeometry(w - 0.3, 0.32, 0.09);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe8b923, roughness: 0.7 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, -h / 2 + 0.5, 0.01);
  group.add(stripe);

  // String loop through the hole
  const loopCurve = new THREE.EllipseCurve(0, h / 2 - 0.32 + 0.28, 0.22, 0.3, 0, Math.PI * 2, false, 0);
  const loopPoints = loopCurve.getPoints(32).map(p => new THREE.Vector3(p.x, p.y, 0));
  const loopGeo = new THREE.BufferGeometry().setFromPoints(loopPoints);
  const loopLine = new THREE.LineLoop(loopGeo, new THREE.LineBasicMaterial({ color: 0x6e7378 }));
  group.add(loopLine);

  scene.add(group);

  let targetRotY = 0, targetRotX = 0, baseRotY = 0, swing = 0;
  let dragging = false;

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !dragging) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 1.1;
    targetRotX = y * -0.4;
  });
  container.addEventListener('pointerdown', (e) => { dragging = true; container.setPointerCapture(e.pointerId); });
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointerleave', () => { if (!dragging) { targetRotY = 0; targetRotX = 0; } });

  function resize() {
    const w2 = container.clientWidth, h2 = container.clientHeight;
    if (!w2 || !h2) return;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    if (!prefersReduced) swing += 0.02;
    const idleSwing = Math.sin(swing) * 0.12;
    group.rotation.y += ((baseRotY + targetRotY + idleSwing) - group.rotation.y) * 0.07;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.07;
    group.rotation.z = Math.sin(swing * 0.6) * 0.04;
    renderer.render(scene, camera);
  }
  animate();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        else if (entry.isIntersecting && !raf) animate();
      });
    }, { threshold: 0.05 });
    io.observe(container);
  }
}

// ============================================================
// TILT (desktop / precise pointers only)
// ============================================================
function initTilt(scope) {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;
  const root = scope || document;
  root.querySelectorAll('.tilt').forEach(el => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    let raf = null;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 7;
      const rotX = (py - 0.5) * -7;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  renderProductGrid();
  initFilterBar();
  renderCart();
  initCheckoutForm();

  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', openCart));
  const cartClose = document.getElementById('cart-close');
  if (cartClose) cartClose.addEventListener('click', closeCart);
  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', closeQuickView);
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeQuickView(); });

  const goCheckout = document.getElementById('cart-checkout-btn');
  if (goCheckout) goCheckout.addEventListener('click', () => { closeCart(); showView('checkout'); });

  const backToShop = document.getElementById('back-to-shop');
  if (backToShop) backToShop.addEventListener('click', () => showView('shop'));

  const continueShoppingBtn = document.getElementById('continue-shopping');
  if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', () => showView('shop'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); closeQuickView(); }
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
});
