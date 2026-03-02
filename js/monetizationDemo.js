// ── MONETIZATION TERMINAL ANIMATION ──
function initMonoAnimation() {
  const lineIds = ['ml1', 'ml2', 'ml3', 'ml4', 'ml5'];
  let idx = 0;

  function animateLines() {
    lineIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    idx = 0;

    function next() {
      if (idx < lineIds.length) {
        const el = document.getElementById(lineIds[idx]);
        if (el) el.classList.add('active');
        idx++;
        setTimeout(next, 600);
      } else {
        setTimeout(animateLines, 1500);
      }
    }
    next();
  }

  // Start after a small delay
  setTimeout(animateLines, 1000);
}