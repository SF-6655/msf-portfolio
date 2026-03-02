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