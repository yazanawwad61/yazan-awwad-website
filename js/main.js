/* ─────────────────────────────────────────────────────
   YAZAN AWWAD — Main JavaScript
   ───────────────────────────────────────────────────── */

/* ── 1. Custom cursor (dot only, no ring) ───────────── */
(function() {
  var dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'width:7px', 'height:7px',
    'border-radius:50%',
    'background:#C4714A',
    'pointer-events:none',
    'z-index:9999',
    'transform:translate(-50%,-50%)',
    'transition:transform 0.15s, opacity 0.2s',
    'opacity:0'
  ].join(';');
  document.body.appendChild(dot);

  document.addEventListener('mousemove', function(e) {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    dot.style.opacity = '1';
  });

  // Shrink on links/buttons
  document.querySelectorAll('a, button, input, textarea, select').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      dot.style.transform = 'translate(-50%,-50%) scale(0)';
    });
    el.addEventListener('mouseleave', function() {
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', function() { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', function() { dot.style.opacity = '1'; });
})();

/* ── 2. Nav: scroll effect ──────────────────────────── */
var nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── 3. Mobile hamburger menu ───────────────────────── */
var hamburger = document.getElementById('hamburger');
if (hamburger) {
  // Build mobile menu dynamically from nav links
  var mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';

  var navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function(link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    if (link.classList.contains('nav-active')) a.classList.add('nav-active');
    a.addEventListener('click', closeMenu);
    mobileMenu.appendChild(a);
  });

  document.body.appendChild(mobileMenu);

  hamburger.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ── 4. Scroll reveal ───────────────────────────────── */
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObs.observe(el);
});

/* ── 5. Timeline stagger ────────────────────────────── */
var tlObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      tlObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-entry').forEach(function(el, i) {
  el.style.transitionDelay = (i * 0.12) + 's';
  tlObs.observe(el);
});

/* ── 6. Hero reveal on load ─────────────────────────── */
window.addEventListener('load', function() {
  setTimeout(function() {
    document.querySelectorAll('#hero .reveal').forEach(function(el) {
      el.classList.add('visible');
    });
  }, 80);
});

/* ── 7. Active nav link on scroll (homepage) ────────── */
var sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    sections.forEach(function(section) {
      var top = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        link.classList.toggle('nav-active', scrollY >= top && scrollY < bottom);
      }
    });
  }, { passive: true });
}
