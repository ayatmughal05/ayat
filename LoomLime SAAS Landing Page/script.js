// ============================================================
// HERO 3D — floating roadmap card cluster
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
  const camera = new THREE.PerspectiveCamera(38, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
  camera.position.set(0, 0.6, 7.2);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(4, 6, 5);
  scene.add(key);
  const violet = new THREE.DirectionalLight(0x5b5fef, 0.5);
  violet.position.set(-4, -2, 3);
  scene.add(violet);

  const group = new THREE.Group();

  const statusColors = [0x5b5fef, 0xe4a527, 0x17b897];
  const cardCount = 9;
  const cards = [];

  for (let i = 0; i < cardCount; i++) {
    const color = statusColors[i % statusColors.length];
    const cardGeo = new THREE.BoxGeometry(1.5, 0.9, 0.06);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.05 });
    const card = new THREE.Mesh(cardGeo, cardMat);

    const stripeGeo = new THREE.BoxGeometry(1.5, 0.14, 0.07);
    const stripeMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.32, 0.005);
    card.add(stripe);

    const dotGeo = new THREE.CircleGeometry(0.05, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(-0.6, -0.18, 0.035);
    card.add(dot);

    const angle = (i / cardCount) * Math.PI * 2;
    const radius = 2.1 + (i % 3) * 0.35;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle * 1.3) * 1.1;
    const z = Math.sin(angle) * radius * 0.6;
    card.position.set(x, y, z);
    card.rotation.set((Math.random() - 0.5) * 0.3, angle * 0.4, (Math.random() - 0.5) * 0.15);
    card.userData.floatOffset = Math.random() * Math.PI * 2;
    card.userData.baseY = y;

    group.add(card);
    cards.push(card);
  }

  scene.add(group);

  let targetRotY = 0, targetRotX = 0, baseRotY = 0, t = 0;
  let dragging = false;

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !dragging) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 0.9;
    targetRotX = y * -0.35;
  });
  container.addEventListener('pointerdown', (e) => { dragging = true; container.setPointerCapture(e.pointerId); });
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointerleave', () => { if (!dragging) { targetRotY = 0; targetRotX = 0; } });

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    if (!prefersReduced) { baseRotY += 0.0018; t += 0.01; }
    group.rotation.y += ((baseRotY + targetRotY) - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;

    if (!prefersReduced) {
      cards.forEach((card) => {
        card.position.y = card.userData.baseY + Math.sin(t + card.userData.floatOffset) * 0.12;
      });
    }

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
// PRICING TOGGLE
// ============================================================
function initPricingToggle() {
  const toggle = document.getElementById('billing-toggle');
  if (!toggle) return;
  const monthlyLabel = document.getElementById('label-monthly');
  const annualLabel = document.getElementById('label-annual');

  toggle.addEventListener('click', () => {
    const isAnnual = toggle.classList.toggle('on');
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);

    document.querySelectorAll('[data-monthly]').forEach((el) => {
      const monthly = el.getAttribute('data-monthly');
      const annual = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annual : monthly;
    });
    document.querySelectorAll('.price-billed').forEach((el) => {
      el.textContent = isAnnual ? 'billed annually' : 'billed monthly';
    });
  });
}

// ============================================================
// FAQ ACCORDION
// ============================================================
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ============================================================
// TILT (precise pointers only)
// ============================================================
function initTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;
  document.querySelectorAll('.tilt').forEach((el) => {
    let raf = null;
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 6;
      const rotX = (py - 0.5) * -6;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initPricingToggle();
  initFAQ();
  initTilt();

  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }
});
