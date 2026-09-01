// ============================================================
// HERO 3D — rotating plate with rising steam
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
  const camera = new THREE.PerspectiveCamera(32, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
  camera.position.set(0, 3.6, 4.6);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xfff2df, 1.0);
  key.position.set(4, 6, 4);
  scene.add(key);
  const warm = new THREE.DirectionalLight(0xc98a2c, 0.4);
  warm.position.set(-3, 2, -2);
  scene.add(warm);

  const group = new THREE.Group();

  const plateMat = new THREE.MeshStandardMaterial({ color: 0xfaf6ee, roughness: 0.5, metalness: 0.05 });
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x2f4a3d, roughness: 0.5 });
  const foodMat = new THREE.MeshStandardMaterial({ color: 0xc98a2c, roughness: 0.7 });
  const garnishMat = new THREE.MeshStandardMaterial({ color: 0xd98b7c, roughness: 0.6 });

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.9, 0.15, 48), plateMat);
  group.add(plate);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.05, 12, 48), rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.08;
  group.add(rim);

  const foodMound = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), foodMat);
  foodMound.position.y = 0.08;
  foodMound.scale.set(1, 0.55, 1);
  group.add(foodMound);

  for (let i = 0; i < 5; i++) {
    const garnish = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 6), garnishMat);
    const angle = (i / 5) * Math.PI * 2;
    garnish.position.set(Math.cos(angle) * 0.55, 0.5, Math.sin(angle) * 0.55);
    garnish.rotation.z = Math.random() * 0.6 - 0.3;
    group.add(garnish);
  }

  scene.add(group);

  // Rising steam particles
  const steamCount = 60;
  const steamGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(steamCount * 3);
  const speeds = new Float32Array(steamCount);
  for (let i = 0; i < steamCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 2;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
    speeds[i] = 0.006 + Math.random() * 0.008;
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const steamMat = new THREE.PointsMaterial({ color: 0xfaf6ee, size: 0.05, transparent: true, opacity: 0.35, depthWrite: false });
  const steam = new THREE.Points(steamGeo, steamMat);
  scene.add(steam);

  let targetRotY = 0, baseRotY = 0;
  let dragging = false;

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !dragging) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    targetRotY = x * 1.0;
  });
  container.addEventListener('pointerdown', (e) => { dragging = true; container.setPointerCapture(e.pointerId); });
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointerleave', () => { if (!dragging) targetRotY = 0; });

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
    if (!prefersReduced) baseRotY += 0.0022;
    group.rotation.y += ((baseRotY + targetRotY) - group.rotation.y) * 0.06;

    if (!prefersReduced) {
      const posAttr = steam.geometry.attributes.position;
      for (let i = 0; i < steamCount; i++) {
        posAttr.array[i * 3 + 1] += speeds[i];
        if (posAttr.array[i * 3 + 1] > 2.4) posAttr.array[i * 3 + 1] = 0;
      }
      posAttr.needsUpdate = true;
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
// MENU TABS
// ============================================================
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(tab.getAttribute('data-panel'));
      if (panel) panel.classList.add('active');
    });
  });
}

// ============================================================
// GALLERY LIGHTBOX
// ============================================================
function initLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;
  const backdrop = document.getElementById('lightbox-backdrop');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  let current = 0;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    imgEl.src = item.querySelector('img').src;
    imgEl.alt = item.querySelector('img').alt;
    captionEl.textContent = item.getAttribute('data-caption') || '';
    backdrop.classList.add('open');
  }
  function close() { backdrop.classList.remove('open'); }

  items.forEach((item, i) => item.addEventListener('click', () => show(i)));
  document.getElementById('lightbox-close').addEventListener('click', close);
  document.getElementById('lightbox-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('lightbox-next').addEventListener('click', () => show(current + 1));
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
}

// ============================================================
// RESERVATION FORM
// ============================================================
function initReservationForm() {
  const form = document.getElementById('reservation-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  const dateEl = form.elements['date'];
  if (dateEl) {
    const today = new Date();
    dateEl.min = today.toISOString().split('T')[0];
  }

  const validators = {
    name: v => v.trim().length >= 2 || 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    phone: v => /^[\d\s\-()+]{7,}$/.test(v.trim()) || 'Enter a valid phone number.',
    date: v => v !== '' || 'Choose a date.',
    time: v => v !== '' || 'Choose a time.',
    party: v => v !== '' || 'Select a party size.'
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
    el.addEventListener('change', () => { if (el.closest('.field').classList.contains('invalid')) validateField(el); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    Object.keys(validators).forEach(name => {
      const el = form.elements[name];
      if (el && !validateField(el)) allValid = false;
    });

    status.classList.remove('error');
    if (!allValid) {
      status.textContent = 'A few fields need a second look before this can be sent.';
      status.classList.add('show', 'error');
      return;
    }

    const date = new Date(form.elements['date'].value + 'T00:00:00');
    const formatted = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    status.textContent = `Request received for ${formatted} at ${form.elements['time'].value} — we'll confirm by email within a few hours.`;
    status.classList.add('show');
    form.reset();
  });
}

// ============================================================
// TILT (precise pointers only)
// ============================================================
function initTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;
  document.querySelectorAll('.tilt, .dish-tile').forEach((el) => {
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
  initMenuTabs();
  initLightbox();
  initReservationForm();
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
