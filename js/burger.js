/**
 * Burger menu logic, shared by both pages.
 *
 * - Opens/closes the mobile drawer with a sliding animation.
 * - Locks page scrolling while the menu is open.
 * - Switches the icon between burger and close (cross).
 * - Closes on link click and on Escape.
 * - Closes automatically when the viewport leaves the mobile width.
 */
(function () {
  'use strict';

  var MOBILE_MAX = 768; // keep in sync with css/responsive.css

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
    // Force a reflow so the transition runs from the hidden state.
    // eslint-disable-next-line no-unused-expressions
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

  // Close when a menu link is clicked.
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      close();
    });
  });

  // Close on Escape.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      close();
    }
  });

  // Close when the viewport leaves the mobile width.
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
