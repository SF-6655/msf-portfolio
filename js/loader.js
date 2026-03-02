// Loads all HTML components into their containers
const components = [
  { id: 'navbar-container',       file: 'components/navbar.html' },
  { id: 'hero-container',         file: 'components/hero.html' },
  { id: 'about-container',        file: 'components/about.html' },
  { id: 'education-container',    file: 'components/education.html' },
  { id: 'experience-container',   file: 'components/experience.html' },
  { id: 'skills-container',       file: 'components/skills.html' },
  { id: 'projects-container',     file: 'components/projects.html' },
  { id: 'monetization-container', file: 'components/monetization.html' },
  { id: 'contact-container',      file: 'components/contact.html' },
  { id: 'footer-container',       file: 'components/footer.html' },
];

async function loadComponents() {
  for (const component of components) {
    const res = await fetch(component.file);
    const html = await res.text();
    document.getElementById(component.id).innerHTML = html;
  }
  // After all components loaded, init everything
  initTypewriter();
  initScrollReveal();
  initNavbarScroll();
  initMonoAnimation();
}

// Page loader fade out
window.addEventListener('load', () => {
  loadComponents().then(() => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.style.transition = 'opacity 0.6s';
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 600);
    }, 2300);
  });
});