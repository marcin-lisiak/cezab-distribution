// ===== NAVBAR: hide on scroll down, show on scroll up =====
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }

  if (currentScrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = currentScrollY;
}, { passive: true });

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== INTERSECTION OBSERVER: fade-in on scroll =====
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .segment-card, .brand-tile, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Add visible class styles inline (since we set opacity via JS)
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
});

// Staggered animation for grid items
document.querySelectorAll('.features-grid, .segments-grid, .brands-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 80}ms`;
  });
});

// ===== HERO FULL-WIDTH SLIDER =====
(function() {
  const slides = document.querySelectorAll('.hero-slide-wrap');
  const navItems = document.querySelectorAll('.hero-nav-item');
  const textBlocks = document.querySelectorAll('.hero-content-block');
  
  if (!slides.length || !navItems.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Remove active classes
    slides[current].classList.remove('active');
    navItems[current].classList.remove('active');
    if (textBlocks[current]) textBlocks[current].classList.remove('active');
    
    current = index;
    
    // Add active classes
    slides[current].classList.add('active');
    navItems[current].classList.add('active');
    if (textBlocks[current]) textBlocks[current].classList.add('active');

    // Restart progress animation
    navItems.forEach(n => {
      const bar = n.querySelector('.circle');
      if (bar) { bar.style.animation = 'none'; bar.offsetHeight; bar.style.animation = ''; }
    });
    const activeBar = navItems[current].querySelector('.circle');
    if (activeBar) { activeBar.style.animation = 'none'; activeBar.offsetHeight; activeBar.style.animation = 'circleProgress 5s linear forwards'; }
  }

  function next() { goTo(current + 1); }

  function start() { timer = setInterval(next, 5000); }
  function reset() { clearInterval(timer); start(); }

  navItems.forEach((btn, i) => {
    btn.addEventListener('click', () => { goTo(i); reset(); });
  });

  // Init first bar
  const firstBar = navItems[0]?.querySelector('.circle');
  if (firstBar) firstBar.style.animation = 'circleProgress 5s linear forwards';

  start();
})();

