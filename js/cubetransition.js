// ── CUBE SCROLL TRANSITION ──
function initCubeTransition() {

  const sectionIds = [
    '#hero',
    '#about',
    '#education',
    '#experience',
    '#skills',
    '#projects',
    '#contact'
  ];

  const sectionLabels = [
    'HERO', 'ABOUT', 'EDUCATION',
    'EXPERIENCE', 'SKILLS', 'PROJECTS', 'CONTACT'
  ];

  let cubeMode      = false;
  let currentIndex  = 0;
  let isTransitioning = false;
  const COOLDOWN    = 1300;
  let lastScrollTime = 0;

  // ── CREATE OVERLAY ──
  const overlay = document.createElement('div');
  overlay.className = 'cube-transition-overlay';
  overlay.innerHTML = `
    <div class="cube-transition-panel" id="cubePanel">
      <div class="cube-panel-current" id="cubeCurrent"></div>
      <div class="cube-panel-next"    id="cubeNext"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── CREATE DOTS ──
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

  // ── TOGGLE BUTTON ──
  const toggleBtn = document.getElementById('cubeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      cubeMode = !cubeMode;
      toggleBtn.classList.toggle('active', cubeMode);
      toggleBtn.innerHTML = cubeMode
        ? '⬛ CUBE ON'
        : '⬜ CUBE OFF';
      dots.classList.toggle('visible', cubeMode);

      if (cubeMode) {
        // Snap to nearest section when enabling
        currentIndex = getCurrentSectionIndex();
        updateDots();
        document.querySelector(sectionIds[currentIndex])
          .scrollIntoView({ behavior: 'instant' });
      }
    });
  }

  // ── GET CURRENT SECTION ──
  function getCurrentSectionIndex() {
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.querySelector(sectionIds[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) return i;
    }
    return 0;
  }

  // ── CUBE TRANSITION ──
  function goToSection(toIndex) {
    if (!cubeMode) return;
    if (isTransitioning) return;
    if (toIndex < 0 || toIndex >= sectionIds.length) return;
    if (toIndex === currentIndex) return;

    const now = Date.now();
    if (now - lastScrollTime < COOLDOWN) return;
    lastScrollTime = now;

    isTransitioning = true;

    const direction = toIndex > currentIndex ? 'down' : 'up';

    // Show overlay
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';

    const panel   = document.getElementById('cubePanel');
    const current = document.getElementById('cubeCurrent');
    const next    = document.getElementById('cubeNext');

    // Reset
    panel.style.transition = 'none';
    current.style.transition = 'none';
    next.style.transition = 'none';

    current.style.transform = 'rotateX(0deg)';
    current.style.transformOrigin = direction === 'down' ? 'center bottom' : 'center top';

    next.style.transform = direction === 'down' ? 'rotateX(-90deg)' : 'rotateX(90deg)';
    next.style.transformOrigin = direction === 'down' ? 'center top' : 'center bottom';
    next.style.borderTop = direction === 'down' ? '2px solid rgba(0,245,255,0.4)' : 'none';
    next.style.borderBottom = direction === 'up' ? '2px solid rgba(0,245,255,0.4)' : 'none';

    // Force reflow
    panel.offsetHeight;

    // Animate current folding away
    current.style.transition = 'transform 0.65s cubic-bezier(0.77,0,0.18,1)';
    next.style.transition    = 'transform 0.65s cubic-bezier(0.77,0,0.18,1)';

    current.style.transform = direction === 'down' ? 'rotateX(90deg)' : 'rotateX(-90deg)';
    next.style.transform    = 'rotateX(0deg)';

    // Midpoint — scroll to section
    setTimeout(() => {
      const target = document.querySelector(sectionIds[toIndex]);
      if (target) target.scrollIntoView({ behavior: 'instant' });
      currentIndex = toIndex;
      updateDots();
    }, 400);

    // Fade out overlay
    setTimeout(() => {
      overlay.style.transition = 'opacity 0.35s ease';
      overlay.style.opacity = '0';
    }, 650);

    // Cleanup
    setTimeout(() => {
      overlay.style.pointerEvents = 'none';
      overlay.style.transition = 'none';
      isTransitioning = false;
    }, 1050);
  }

  // ── WHEEL ──
  let wheelAccum = 0;
  let wheelTimer = null;

  window.addEventListener('wheel', (e) => {
    if (!cubeMode) return;
    e.preventDefault();

    wheelAccum += e.deltaY;
    clearTimeout(wheelTimer);

    wheelTimer = setTimeout(() => {
      if (wheelAccum > 50)       goToSection(currentIndex + 1);
      else if (wheelAccum < -50) goToSection(currentIndex - 1);
      wheelAccum = 0;
    }, 60);

  }, { passive: false });

  // ── TOUCH SWIPE ──
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    if (!cubeMode) return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!cubeMode || isTransitioning) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) < 50) return;
    currentIndex = getCurrentSectionIndex();
    goToSection(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }, { passive: true });

  // ── KEYBOARD ──
  window.addEventListener('keydown', (e) => {
    if (!cubeMode) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSection(currentIndex + 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goToSection(currentIndex - 1);
  });

  // ── NAVBAR LINKS ──
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!cubeMode) return;
      const href = link.getAttribute('href');
      const idx  = sectionIds.indexOf(href);
      if (idx !== -1) { e.preventDefault(); goToSection(idx); }
    });
  });
}