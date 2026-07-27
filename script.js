const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(!mobileMenu.classList.contains('open'));
});

mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
