// ── SECTION SNAP + GLITCH WIPE ──
function initCubeTransition() {

  const sectionIds = [
    '#hero', '#about', '#education', '#experience',
    '#skills', '#projects', '#monetization', '#contact'
  ];

  const sectionLabels = [
    'HERO', 'ABOUT', 'EDUCATION', 'EXPERIENCE',
    'SKILLS', 'PROJECTS', 'SYSTEM', 'CONTACT'
  ];

  let snapMode       = false;
  let currentIndex   = 0;
  let isTransitioning = false;
  const COOLDOWN     = 900;
  let lastScrollTime = 0;

  // ── GLITCH OVERLAY ──
  const overlay = document.createElement('div');
  overlay.id = 'glitchOverlay';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9997;
    pointer-events:none; overflow:hidden; opacity:0;
  `;
  document.body.appendChild(overlay);

  // ── SECTION DOTS ──
  const dots = document.createElement('div');
  dots.className = 'section-dots';
  sectionIds.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'section-dot' + (i === 0 ? ' active' : '');
    dot.title = sectionLabels[i];
    dot.addEventListener('click', () => goToSection(i));
    dots.appendChild(dot);
  });
  document.body.appendChild(dots);

  function updateDots() {
    document.querySelectorAll('.section-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  // ── TOGGLE ──
  const toggleBtn  = document.getElementById('cubeToggle');
  const toggleIcon = document.getElementById('cubeToggleIcon');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      snapMode = !snapMode;
      toggleBtn.classList.toggle('active', snapMode);
      if (toggleIcon) toggleIcon.textContent = snapMode ? '⚡' : '⬜';
      dots.classList.toggle('visible', snapMode);
      if (snapMode) {
        currentIndex = getCurrentSectionIndex();
        updateDots();
        document.querySelector(sectionIds[currentIndex])
          ?.scrollIntoView({ behavior: 'instant' });
      }
    });
  }

  function getCurrentSectionIndex() {
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.querySelector(sectionIds[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) return i;
    }
    return 0;
  }

  // ── GLITCH WIPE ──
  function runGlitch(direction, onMidpoint) {
    overlay.innerHTML = '';
    overlay.style.opacity = '1';

    // Directional scan line
    const scan = document.createElement('div');
    scan.className = direction === 'down' ? 'glitch-scan-down' : 'glitch-scan-up';
    overlay.appendChild(scan);

    // Random horizontal noise bars
    const count = 7 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const bar      = document.createElement('div');
      const top      = Math.random() * 96;
      const h        = 1 + Math.random() * 9;
      const delay    = Math.random() * 260;
      const dur      = 70 + Math.random() * 130;
      const cyan     = Math.random() > 0.38;
      const opacity  = 0.07 + Math.random() * 0.2;
      const shiftX   = (Math.random() - 0.5) * 24;
      bar.style.cssText = `
        position:absolute; left:0; right:0;
        top:${top}%; height:${h}px;
        background:${cyan
          ? `rgba(0,245,255,${opacity})`
          : `rgba(255,0,255,${opacity})`};
        transform:translateX(${shiftX}px);
        animation:glitchBar ${dur}ms ${delay}ms ease both;
      `;
      overlay.appendChild(bar);
    }

    // Mid-point: scroll instantly
    setTimeout(onMidpoint, 230);

    // Fade out
    setTimeout(() => {
      overlay.style.transition = 'opacity 0.18s ease';
      overlay.style.opacity = '0';
    }, 490);

    // Cleanup
    setTimeout(() => {
      overlay.style.transition = '';
      overlay.innerHTML = '';
    }, 700);
  }

  function goToSection(toIndex) {
    if (!snapMode || isTransitioning) return;
    if (toIndex < 0 || toIndex >= sectionIds.length) return;
    if (toIndex === currentIndex) return;

    const now = Date.now();
    if (now - lastScrollTime < COOLDOWN) return;
    lastScrollTime  = now;
    isTransitioning = true;

    const direction = toIndex > currentIndex ? 'down' : 'up';

    runGlitch(direction, () => {
      document.querySelector(sectionIds[toIndex])
        ?.scrollIntoView({ behavior: 'instant' });
      currentIndex = toIndex;
      updateDots();
    });

    setTimeout(() => { isTransitioning = false; }, 900);
  }

  // ── WHEEL ──
  let wheelAccum = 0;
  let wheelTimer  = null;

  window.addEventListener('wheel', (e) => {
    if (!snapMode) return;
    e.preventDefault();
    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      if      (wheelAccum >  50) goToSection(currentIndex + 1);
      else if (wheelAccum < -50) goToSection(currentIndex - 1);
      wheelAccum = 0;
    }, 60);
  }, { passive: false });

  // ── TOUCH ──
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (!snapMode) return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!snapMode || isTransitioning) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;
    currentIndex = getCurrentSectionIndex();
    goToSection(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });

  // ── KEYBOARD ──
  window.addEventListener('keydown', (e) => {
    if (!snapMode) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSection(currentIndex + 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goToSection(currentIndex - 1);
  });

  // ── NAV LINKS ──
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!snapMode) return;
      const href = link.getAttribute('href');
      const idx  = sectionIds.indexOf(href);
      if (idx !== -1) { e.preventDefault(); goToSection(idx); }
    });
  });
}
