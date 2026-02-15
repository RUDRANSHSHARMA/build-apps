const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.fade-up, .stagger').forEach((el) => observer.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number(entry.target.dataset.count);
        const duration = 1200;
        const start = performance.now();
        const update = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          entry.target.textContent = Math.floor(progress * target).toLocaleString('en-IN');
          if (progress < 1) {
            requestAnimationFrame(update);
          }
        };
        requestAnimationFrame(update);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

counters.forEach((el) => counterObserver.observe(el));

const mobileToggle = document.querySelector('[data-mobile-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('[data-category]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    portfolioItems.forEach((item) => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = document.querySelector('[data-lightbox-img]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
if (lightbox) {
  document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightboxImg.src = trigger.dataset.image;
      lightboxTitle.textContent = trigger.dataset.title;
      lightbox.classList.remove('hidden');
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });
}

const testimonials = document.querySelectorAll('[data-testimonial]');
let testimonialIndex = 0;
if (testimonials.length) {
  setInterval(() => {
    testimonials.forEach((item, idx) => item.classList.toggle('hidden', idx !== testimonialIndex));
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  }, 5000);
}

const scrollTopBtn = document.querySelector('[data-scroll-top]');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 300);
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    try {
      const payload = Object.fromEntries(new FormData(contactForm));
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      showToast('Message sent successfully!', 'success');
      contactForm.reset();
    } catch (error) {
      showToast('Unable to send message. Try again.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  });
}

function showToast(message, type) {
  const toastContainer = document.querySelector('[data-toast-container]');
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast show mb-2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
