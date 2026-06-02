document.documentElement.classList.add('js-ready');

// Loader
function hideLoader() {
  document.getElementById('loader')?.classList.add('hidden');
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(hideLoader, 700);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 700), { once: true });
}
window.addEventListener('load', () => setTimeout(hideLoader, 700), { once: true });
setTimeout(hideLoader, 3000);

// Custom cursor removed for reliable native cursor behavior.

// Navbar scroll
const navbar = document.querySelector('.navbar-custom');
const pageLinks = {
  home: 'index.html',
  about: 'about.html',
  portfolio: 'portfolio.html',
  resume: 'resume.html',
  contact: 'contact.html'
};

function setActivePageLink() {
  const current = pageLinks[document.body.dataset.page];
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
  setActivePageLink();
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Scroll Reveal
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = `${bar.dataset.width}%`;
        });
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// Skill bars
const skillBars = document.querySelectorAll('.skill-fill');
if ('IntersectionObserver' in window) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = `${e.target.dataset.width}%`;
      }
    });
  }, { threshold: 0.2 });
  skillBars.forEach(bar => skillObserver.observe(bar));
} else {
  skillBars.forEach(bar => {
    bar.style.width = `${bar.dataset.width}%`;
  });
}

// Counter Animation
const counters = document.querySelectorAll('.counter');

function runCounter(counter) {
  const target = Number(counter.dataset.target || 0);
  let cur = 0;
  const inc = target / 40;
  const update = () => {
    cur = Math.min(cur + inc, target);
    counter.textContent = Math.ceil(cur);
    if (cur < target) requestAnimationFrame(update);
  };
  setTimeout(update, 400);
}

if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
} else {
  counters.forEach(runCounter);
}

// Filter Tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const selected = this.textContent.trim().toLowerCase();
    document.querySelectorAll('.project-card').forEach(card => {
      const category = card.querySelector('.project-cat')?.textContent.trim().toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.project-tag'))
        .map(tag => tag.textContent.trim().toLowerCase());
      const shouldShow = selected === 'all' || category === selected || tags.includes(selected);

      card.hidden = !shouldShow;
      if (!shouldShow) return;

      card.style.opacity = '0.65';
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, 200);
    });
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Lightbox
(function(){
  let ov = document.getElementById('lb-overlay');
  if (!ov && document.querySelector('.project-thumb[data-lb-type]')) {
    ov = document.createElement('div');
    ov.id = 'lb-overlay';
    ov.innerHTML = '<button id="lb-close" type="button" aria-label="Close lightbox">x</button><div id="lb-inner"><img id="lb-img" alt=""><video id="lb-vid" controls playsinline></video></div><div id="lb-caption"></div>';
    document.body.appendChild(ov);
  }
  if (!ov) return;

  const img = document.getElementById('lb-img');
  const vid = document.getElementById('lb-vid');
  const cap = document.getElementById('lb-caption');
  const btn = document.getElementById('lb-close');
  const blobUrls = {};

  function base64ToBlobUrl(key) {
    if (blobUrls[key]) return blobUrls[key];
    const chunks = (window.__portfolioVideoParts && window.__portfolioVideoParts[key]) || [];
    const b64 = chunks.join('');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    blobUrls[key] = URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
    return blobUrls[key];
  }

  function open(type, src, caption) {
    if (!img || !vid || !cap || !src) return;
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    cap.textContent = caption || '';

    if (type === 'image') {
      img.src = src;
      img.style.display = 'block';
      vid.style.display = 'none';
      vid.src = '';
    } else {
      vid.src = src;
      vid.style.display = 'block';
      img.style.display = 'none';
      img.src = '';
      vid.play().catch(() => {});
    }
  }

  function close() {
    if (!img || !vid) return;
    ov.classList.remove('open');
    document.body.style.overflow = '';
    vid.pause();
    vid.src = '';
    img.src = '';
  }

  btn?.addEventListener('click', close);
  ov.addEventListener('click', e => {
    if (e.target === ov) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  document.querySelectorAll('.project-thumb[data-lb-type]').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.lbParts ? base64ToBlobUrl(el.dataset.lbParts) : el.dataset.lbSrc;
      open(el.dataset.lbType, src, el.dataset.lbCaption);
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  setActivePageLink();
});
