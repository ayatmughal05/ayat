// ============================================================
// Hero 3D massing model (index.html only — element may not exist)
// ============================================================
function initHero3D() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    container.classList.add('no-webgl');
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    container.classList.add('no-webgl');
    return;
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, container.clientWidth / Math.max(container.clientHeight, 1), 0.1, 100);
  camera.position.set(4.6, 3.6, 5.6);
  camera.lookAt(0, 0.6, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const key = new THREE.DirectionalLight(0xffffff, 1.15);
  key.position.set(5, 6, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fb595, 0.55);
  fill.position.set(-4, 2, -3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const group = new THREE.Group();
  const colors = [0x576b4f, 0x9c5a3c, 0x2f4858, 0xa9a79c];
  const blocks = [
    { size: [2.2, 1.0, 1.6], pos: [0, 0.5, 0], color: colors[0] },
    { size: [1.1, 1.8, 1.1], pos: [1.15, 0.9, -0.6], color: colors[1] },
    { size: [1.4, 0.6, 1.9], pos: [-0.95, 0.3, 0.85], color: colors[3] },
    { size: [0.7, 2.4, 0.7], pos: [-1.3, 1.2, -0.9], color: colors[2] }
  ];

  blocks.forEach((b) => {
    const geo = new THREE.BoxGeometry(b.size[0], b.size[1], b.size[2]);
    const mat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.88, metalness: 0.04 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1b1d18, transparent: true, opacity: 0.32 }));
    line.position.copy(mesh.position);
    group.add(line);
  });

  const grid = new THREE.GridHelper(9, 18, 0xa9a79c, 0xa9a79c);
  grid.position.y = -0.01;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);
  scene.add(group);

  let targetRotY = 0;
  let targetRotX = 0;
  let baseRotY = 0.4;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const onMove = (clientX, clientY) => {
    const rect = container.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 0.7;
    targetRotX = y * -0.28;
  };

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && !dragging) return;
    onMove(e.clientX, e.clientY);
  });
  container.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    container.setPointerCapture(e.pointerId);
  });
  container.addEventListener('pointerup', () => { dragging = false; });
  container.addEventListener('pointerleave', () => {
    if (!dragging) { targetRotY = 0; targetRotX = 0; }
  });

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(container);
  }

  let raf = null;
  function animate() {
    raf = requestAnimationFrame(animate);
    if (!prefersReduced) baseRotY += 0.0022;
    group.rotation.y += (baseRotY + targetRotY - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;
    renderer.render(scene, camera);
  }
  animate();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        } else if (entry.isIntersecting && !raf) {
          animate();
        }
      });
    }, { threshold: 0.05 });
    io.observe(container);
  }
}

// ============================================================
// Pointer-driven 3D tilt for cards (desktop / precise pointers only)
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
      const rotY = (px - 0.5) * 9;
      const rotX = (py - 0.5) * -9;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  initTilt();

  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Contact form validation
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');

    const validators = {
      name: (v) => v.trim().length >= 2 || 'Enter your full name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
      projectType: (v) => v !== '' || 'Select a project type.',
      budget: (v) => v !== '' || 'Select a budget range.',
      message: (v) => v.trim().length >= 20 || 'Tell us a little more — at least 20 characters.'
    };

    const setFieldState = (fieldEl, valid, message) => {
      const wrap = fieldEl.closest('.field');
      const err = wrap.querySelector('.err');
      if (valid) {
        wrap.classList.remove('invalid');
      } else {
        wrap.classList.add('invalid');
        if (err) err.textContent = message;
      }
    };

    const validateField = (fieldEl) => {
      const name = fieldEl.name;
      const rule = validators[name];
      if (!rule) return true;
      const result = rule(fieldEl.value);
      const valid = result === true;
      setFieldState(fieldEl, valid, valid ? '' : result);
      return valid;
    };

    Object.keys(validators).forEach((name) => {
      const el = form.elements[name];
      if (el) {
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => {
          if (el.closest('.field').classList.contains('invalid')) validateField(el);
        });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(validators).forEach((name) => {
        const el = form.elements[name];
        if (el && !validateField(el)) allValid = false;
      });

      if (!allValid) {
        status.textContent = 'A few fields need a second look before we can send this.';
        status.classList.add('show');
        status.style.borderColor = 'var(--rust)';
        status.style.background = 'rgba(156, 90, 60, 0.08)';
        return;
      }

      status.textContent = 'Thank you — your inquiry has been received. We reply to every project within two business days.';
      status.classList.add('show');
      status.style.borderColor = 'var(--moss)';
      status.style.background = 'rgba(87, 107, 79, 0.08)';
      form.reset();
    });
  }
});
