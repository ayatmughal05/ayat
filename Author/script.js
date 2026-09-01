// ============================================================
// HERO 3D — rotating signet crest (crossed blades over a ring)
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
  camera.position.set(0, 0.3, 6.4);
  camera.lookAt(0, 0, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 5, 6);
  scene.add(key);
  const warm = new THREE.DirectionalLight(0xc9a227, 0.7);
  warm.position.set(-3, -2, 4);
  scene.add(warm);
  const bloodGlow = new THREE.PointLight(0x9b1b30, 0.6, 8);
  bloodGlow.position.set(0, 0, 2);
  scene.add(bloodGlow);

  // Ember / dust particles drifting around the crest
  const emberCount = 90;
  const emberGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(emberCount * 3);
  const speeds = new Float32Array(emberCount);
  for (let i = 0; i < emberCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    speeds[i] = 0.002 + Math.random() * 0.004;
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const emberMat = new THREE.PointsMaterial({ color: 0xc9a227, size: 0.035, transparent: true, opacity: 0.55, depthWrite: false });
  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  const group = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.35, metalness: 0.75 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x14100f, roughness: 0.6, metalness: 0.2 });
  const bloodMat = new THREE.MeshStandardMaterial({ color: 0x9b1b30, roughness: 0.3, metalness: 0.5, emissive: 0x4a0d15, emissiveIntensity: 0.4 });

  // Outer ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.13, 20, 80), goldMat);
  group.add(ring);

  // Inner face (signet disc)
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 0.1, 64), darkMat);
  disc.rotation.x = Math.PI / 2;
  group.add(disc);

  // Crossed blades
  const bladeGeo = new THREE.BoxGeometry(1.7, 0.13, 0.05);
  const blade1 = new THREE.Mesh(bladeGeo, goldMat);
  blade1.rotation.z = Math.PI / 4;
  blade1.position.z = 0.09;
  group.add(blade1);
  const blade2 = new THREE.Mesh(bladeGeo, goldMat);
  blade2.rotation.z = -Math.PI / 4;
  blade2.position.z = 0.09;
  group.add(blade2);

  // Center gem
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), bloodMat);
  gem.position.z = 0.16;
  group.add(gem);

  scene.add(group);

  let targetRotY = 0, targetRotX = 0, baseRotY = 0;
  let dragging = false;

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !dragging) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 1.0;
    targetRotX = y * -0.4;
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
    if (!prefersReduced) baseRotY += 0.0028;
    group.rotation.y += ((baseRotY + targetRotY) - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
    gem.rotation.y += 0.01;

    if (!prefersReduced) {
      const posAttr = embers.geometry.attributes.position;
      for (let i = 0; i < emberCount; i++) {
        posAttr.array[i * 3 + 1] += speeds[i];
        if (posAttr.array[i * 3 + 1] > 3.2) posAttr.array[i * 3 + 1] = -3.2;
      }
      posAttr.needsUpdate = true;
      embers.rotation.y += 0.0006;
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
// DOSSIER CARDS — click / keyboard 3D flip
// ============================================================
function initDossierCards() {
  document.querySelectorAll('.dossier-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    const front = card.querySelector('.dossier-front h3');
    if (front) card.setAttribute('aria-label', 'View dossier for ' + front.textContent);

    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

// ============================================================
// TILT (used sparingly, precise pointers only)
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
// CURSOR SPOTLIGHT (desktop only)
// ============================================================
function initSpotlight() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;
  const spot = document.querySelector('.spotlight');
  if (!spot) return;
  document.addEventListener('pointermove', (e) => {
    spot.style.setProperty('--mx', e.clientX + 'px');
    spot.style.setProperty('--my', e.clientY + 'px');
  });
}

// ============================================================
// SCROLL PARALLAX (desktop only, reduced-motion safe)
// ============================================================
function initParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('[data-speed]');
  if (!els.length || prefersReduced) return;
  let ticking = false;
  function update() {
    const vh = window.innerHeight;
    els.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  }
  document.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initDossierCards();
  initTilt();
  initSpotlight();
  initParallax();

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
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const validators = {
      name: v => v.trim().length >= 2 || 'Enter your name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      reason: v => v !== '' || 'Select a reason for reaching out.',
      message: v => v.trim().length >= 15 || 'Say a little more — at least 15 characters.'
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
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(validators).forEach(name => {
        const el = form.elements[name];
        if (el && !validateField(el)) allValid = false;
      });
      if (!allValid) {
        status.textContent = 'A few fields need a second look before this can be sent.';
        status.classList.add('show');
        status.style.borderColor = 'var(--blood-bright)';
        status.style.background = 'rgba(155,27,48,0.1)';
        return;
      }
      status.textContent = 'Message received — thank you for writing in. A reply usually comes within a few days.';
      status.classList.add('show');
      status.style.borderColor = 'var(--gold)';
      status.style.background = 'rgba(201,162,39,0.08)';
      form.reset();
    });
  }
});
