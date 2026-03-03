// ── PARTICLE SYSTEM ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#ff00ff' : '#00f5ff';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = [];
for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── CURSOR TRAIL ──
const trailCanvas = document.createElement('canvas');
trailCanvas.style.cssText = `
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none; z-index: 9997;
`;
document.body.appendChild(trailCanvas);
const tCtx = trailCanvas.getContext('2d');

function resizeTrailCanvas() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrailCanvas();
window.addEventListener('resize', resizeTrailCanvas);

// Raw mouse position
let targetX = -9999, targetY = -9999;

// Smoothed position (lags behind)
let smoothX = -9999, smoothY = -9999;

const trail = [];
const TRAIL_LENGTH = 28;
const LERP_SPEED = 0.12; // lower = more delay (0.05 = very sluggish, 0.2 = snappy)

// How long after mouse stops before trail fades (ms)
let lastMoveTime = 0;
const FADE_AFTER_MS = 120;

window.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
  lastMoveTime = Date.now();
});

// ── Custom cursor dot ──
const cursorDot = document.createElement('div');
cursorDot.style.cssText = `
  position: fixed;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #bf00ff;
  box-shadow: 0 0 6px #bf00ff, 0 0 16px #bf00ff, 0 0 30px rgba(191,0,255,0.35);
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(cursorDot);

// ── Cursor ring (lags more) ──
const cursorRing = document.createElement('div');
cursorRing.style.cssText = `
  position: fixed;
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(191,0,255,0.45);
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
`;
document.body.appendChild(cursorRing);

// Ring tracks slightly behind dot
let ringX = -9999, ringY = -9999;

// Click pulse
window.addEventListener('mousedown', () => {
  cursorDot.style.boxShadow = '0 0 10px #ff00ff, 0 0 28px #ff00ff, 0 0 50px rgba(255,0,255,0.5)';
  cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
  cursorRing.style.borderColor = 'rgba(255,0,255,0.8)';
  cursorRing.style.transition = 'transform 0.15s, border-color 0.15s';
});
window.addEventListener('mouseup', () => {
  cursorDot.style.boxShadow = '0 0 6px #bf00ff, 0 0 16px #bf00ff, 0 0 30px rgba(191,0,255,0.35)';
  cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
  cursorRing.style.borderColor = 'rgba(191,0,255,0.45)';
});

function drawTrail() {
  const now = Date.now();
  const timeSinceMove = now - lastMoveTime;

  // Lerp smooth position toward target
  smoothX += (targetX - smoothX) * LERP_SPEED;
  smoothY += (targetY - smoothY) * LERP_SPEED;

  // Ring lags even more
  ringX += (smoothX - ringX) * 0.08;
  ringY += (smoothY - ringY) * 0.08;

  // Move cursor elements
  cursorDot.style.left = smoothX + 'px';
  cursorDot.style.top  = smoothY + 'px';
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  // Only record trail points when mouse is moving
  const isMoving = timeSinceMove < FADE_AFTER_MS;

  if (isMoving) {
    trail.push({ x: smoothX, y: smoothY, born: now });
  }

  // Age out old points
  const MAX_AGE = 380; // ms — how long each point lives
  while (trail.length > 0 && now - trail[0].born > MAX_AGE) {
    trail.shift();
  }

  // Cap length
  if (trail.length > TRAIL_LENGTH) trail.shift();

  // Draw
  tCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  for (let i = 1; i < trail.length; i++) {
    const t = i / trail.length; // 0 = tail, 1 = head

    // Age-based fade: newer points are more opaque
    const age = (now - trail[i].born) / MAX_AGE; // 0=new, 1=old
    const ageFade = Math.max(0, 1 - age);

    const alpha = t * ageFade * 0.9;
    if (alpha < 0.01) continue;

    const lineWidth = t * 2.8;

    // Violet → magenta gradient along trail
    const r = Math.round(100 + t * 155);
    const g = 0;
    const b = Math.round(200 + t * 55);

    tCtx.beginPath();
    tCtx.moveTo(trail[i - 1].x, trail[i - 1].y);
    tCtx.lineTo(trail[i].x, trail[i].y);
    tCtx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
    tCtx.lineWidth = lineWidth;
    tCtx.lineCap = 'round';
    tCtx.lineJoin = 'round';

    // Glow only near the head
    if (t > 0.75) {
      tCtx.shadowColor = `rgba(191,0,255,${alpha * 0.8})`;
      tCtx.shadowBlur = 10;
    } else {
      tCtx.shadowBlur = 0;
    }

    tCtx.stroke();
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();


// ── TYPEWRITER ──
function initTypewriter() {
  const roles = [
    'Flutter Developer',
    'Full Stack Engineer',
    'Co-Founder @ Phantom Tech',
    'Mobile App Builder'
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const tw = document.getElementById('typewriter');
  if (!tw) return;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      tw.textContent = '> ' + current.slice(0, charIdx++);
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      tw.textContent = '> ' + current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        charIdx = 0;
      }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 500);
}