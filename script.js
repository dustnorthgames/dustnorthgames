const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const progress = document.querySelector('.scroll-progress');
const cursorGlow = document.querySelector('.cursor-glow');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('.page-loader')?.classList.add('hidden'), 350);
});

function updatePage() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

  if (!reduceMotion) {
    document.querySelectorAll('.parallax').forEach(el => {
      const speed = Number(el.dataset.speed || 0.05);
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        el.style.transform = `translate3d(0, ${-rect.top * speed}px, 0)`;
      }
    });
  }
}

function setMenu(open) {
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  const bars = menuButton.querySelectorAll('span');
  bars[0].style.transform = open ? 'translateY(8px) rotate(45deg)' : '';
  bars[1].style.opacity = open ? '0' : '1';
  bars[2].style.transform = open ? 'translateY(-8px) rotate(-45deg)' : '';
}

menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('scroll', updatePage, { passive: true });
updatePage();

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.desktop-nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

function updateCountdown() {
  const box = document.querySelector('[data-countdown]');
  if (!box) return;
  const target = new Date(box.dataset.countdown).getTime();
  const remaining = Math.max(0, target - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  box.querySelector('[data-days]').textContent = String(days).padStart(3, '0');
  box.querySelector('[data-hours]').textContent = String(hours).padStart(2, '0');
  box.querySelector('[data-minutes]').textContent = String(minutes).padStart(2, '0');
  box.querySelector('[data-seconds]').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const trailer = document.querySelector('.trailer-modal');
document.querySelector('[data-open-trailer]')?.addEventListener('click', () => trailer.showModal());
document.querySelector('[data-close-trailer]')?.addEventListener('click', () => trailer.close());
trailer?.addEventListener('click', event => { if (event.target === trailer) trailer.close(); });

if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', event => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', event => {
      const r = card.getBoundingClientRect();
      const rx = ((event.clientY - r.top) / r.height - .5) * -2.5;
      const ry = ((event.clientX - r.left) / r.width - .5) * 2.5;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', event => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(event.clientX-r.left-r.width/2)*.09}px, ${(event.clientY-r.top-r.height/2)*.09}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}
