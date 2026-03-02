// ── SCROLL REVEAL ──
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => observer.observe(r));
}

// ── NAVBAR SCROLL EFFECT ──
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(5,5,16,0.98)';
      nav.style.boxShadow = '0 2px 30px rgba(0,245,255,0.08)';
    } else {
      nav.style.background = 'rgba(5,5,16,0.85)';
      nav.style.boxShadow = 'none';
    }
  });
}