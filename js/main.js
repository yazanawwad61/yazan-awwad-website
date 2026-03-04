/* ─────────────────────────────────────────────────────
   YAZAN AWWAD — Main JavaScript
   ───────────────────────────────────────────────────── */



/* ── 2. Nav: scroll effect ──────────────────────────── */
var nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', function () {
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
  navLinks.forEach(function (link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    if (link.classList.contains('nav-active')) a.classList.add('nav-active');
    a.addEventListener('click', closeMenu);
    mobileMenu.appendChild(a);
  });

  document.body.appendChild(mobileMenu);

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ── 4. Scroll reveal ───────────────────────────────── */
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObs.observe(el);
});

/* ── 5. Timeline stagger ────────────────────────────── */
var tlObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      tlObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-entry').forEach(function (el, i) {
  el.style.transitionDelay = (i * 0.12) + 's';
  tlObs.observe(el);
});

/* ── 6. Hero reveal on load ─────────────────────────── */
window.addEventListener('load', function () {
  setTimeout(function () {
    document.querySelectorAll('#hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 80);
});

/* ── 7. Active nav link on scroll (homepage) ────────── */
var sections = document.querySelectorAll('section[id]');
if (sections.length > 0) {
  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    sections.forEach(function (section) {
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
