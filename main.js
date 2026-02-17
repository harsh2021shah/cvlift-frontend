// =============================================
// 1. NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// =============================================
// 2. MOBILE MENU
// =============================================
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  const mobileLinks = mobileMenu.querySelectorAll('a');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Change icon to X or back
    hamburger.textContent = isOpen ? '✕' : '☰'; 
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.textContent = '☰';
    });
  });
}

// =============================================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// =============================================
const animateElements = document.querySelectorAll('[data-animate]');
if (animateElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => observer.observe(el));
}

// =============================================
// 4. HERO ENTRANCE (runs on page load)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('[data-hero-animate]');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('hero-visible'), i * 150);
  });
});

// =============================================
// 5. FAQ ACCORDION
// =============================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// =============================================
// 6. PRICING TOGGLE (Monthly / Yearly)
// =============================================
const billingToggle = document.getElementById('billingToggle');
if (billingToggle) {
  let isYearly = false;

  billingToggle.addEventListener('click', () => {
    isYearly = !isYearly;
    billingToggle.classList.toggle('active', isYearly);
    
    document.querySelectorAll('.price-monthly').forEach(el => {
      el.style.display = isYearly ? 'none' : 'block';
    });
    document.querySelectorAll('.price-yearly').forEach(el => {
      el.style.display = isYearly ? 'block' : 'none';
    });
    
    const labelYearly = document.getElementById('label-yearly');
    const labelMonthly = document.getElementById('label-monthly');
    if (labelYearly) labelYearly.classList.toggle('active', isYearly);
    if (labelMonthly) labelMonthly.classList.toggle('active', !isYearly);
  });
}

// =============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =============================================
// 8. PREFERS REDUCED MOTION
// =============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--animation-duration', '0.001ms');
}

// =============================================
// 9. HELP PAGE COPY FUNCTIONALITY
// =============================================
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = 'support@cvlift.me';
    navigator.clipboard.writeText(email).then(() => {
      const originalText = copyEmailBtn.innerHTML;
      copyEmailBtn.innerHTML = 'Copied! ✓';
      setTimeout(() => {
        copyEmailBtn.innerHTML = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
}
