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

// ── HAMBURGER MENU ──
function initBurger() {
  const burger = document.getElementById('navBurger');
  const links  = document.getElementById('navLinks');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.classList.toggle('active');
  });

  // Close menu when any nav link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}
// ── CONTACT FORM ──
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fieldName    = document.getElementById('fieldName');
  const fieldEmail   = document.getElementById('fieldEmail');
  const fieldMessage = document.getElementById('fieldMessage');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // ── VALIDATORS ──
  function validateName() {
    const val = fieldName.value.trim();
    const valid = /^[a-zA-Z\s]{2,}$/.test(val);
    fieldName.classList.toggle('invalid', !valid);
    fieldName.classList.toggle('valid', valid);
    nameError.style.display = valid ? 'none' : 'block';
    return valid;
  }

  function validateEmail() {
    const val = fieldEmail.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
    fieldEmail.classList.toggle('invalid', !valid);
    fieldEmail.classList.toggle('valid', valid);
    emailError.style.display = valid ? 'none' : 'block';
    return valid;
  }

  function validateMessage() {
    const val = fieldMessage.value.trim();
    const valid = val.length >= 20;
    fieldMessage.classList.toggle('invalid', !valid);
    fieldMessage.classList.toggle('valid', valid);
    messageError.style.display = valid ? 'none' : 'block';
    return valid;
  }

  // ── LIVE VALIDATION (on blur) ──
  fieldName.addEventListener('blur', validateName);
  fieldEmail.addEventListener('blur', validateEmail);
  fieldMessage.addEventListener('blur', validateMessage);

  // ── CLEAR ERROR ON FOCUS ──
  fieldName.addEventListener('focus', () => {
    fieldName.classList.remove('invalid');
    nameError.style.display = 'none';
  });
  fieldEmail.addEventListener('focus', () => {
    fieldEmail.classList.remove('invalid');
    emailError.style.display = 'none';
  });
  fieldMessage.addEventListener('focus', () => {
    fieldMessage.classList.remove('invalid');
    messageError.style.display = 'none';
  });

  // ── SUBMIT ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validName    = validateName();
    const validEmail   = validateEmail();
    const validMessage = validateMessage();

    if (!validName || !validEmail || !validMessage) return;

    const btn     = form.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');

    btn.textContent = 'TRANSMITTING...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // 10 second timeout
    const timeout = setTimeout(() => {
      error.style.display   = 'block';
      success.style.display = 'none';
      btn.textContent = 'TRANSMIT MESSAGE';
      btn.style.opacity = '1';
      btn.disabled = false;
    }, 10000);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeout);

      if (res.ok) {
        form.reset();
        // Clear valid states after reset
        [fieldName, fieldEmail, fieldMessage].forEach(f => f.classList.remove('valid'));
        success.style.display = 'block';
        error.style.display   = 'none';
        btn.textContent = '✓ TRANSMITTED';
        btn.style.borderColor = '#00f5ff';
        btn.style.opacity = '1';
      } else {
        throw new Error('Failed');
      }
    } catch {
      clearTimeout(timeout);
      error.style.display   = 'block';
      success.style.display = 'none';
      btn.textContent = 'TRANSMIT MESSAGE';
      btn.style.opacity = '1';
      btn.disabled = false;
    }
  });
}