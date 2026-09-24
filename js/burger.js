(function () {
  'use strict';

  var MOBILE_MAX = 768; 

  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');

  if (!burger || !menu) return;

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
  }

  function isOpen() {
    return menu.classList.contains('open');
  }

  function open() {
    menu.hidden = false;
    menu.offsetHeight;
    menu.classList.add('open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    lockScroll();
  }

  function close() {
    menu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    unlockScroll();
  }

  function toggle() {
    if (isOpen()) {
      close();
    } else {
      open();
    }
  }

  burger.addEventListener('click', toggle);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      close();
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      close();
    }
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!isMobile() && isOpen()) {
        close();
      }
    }, 150);
  });
})();
