(function () {
  'use strict';

  var STORAGE_KEY = 'coffee-house-theme';
  var root = document.documentElement;
  var toggles = document.querySelectorAll('.theme-switch');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
    var favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute(
        'href',
        theme === 'dark'
          ? 'assets/icons/logo-dark.svg'
          : 'assets/icons/logo-light.svg',
      );
    }
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
    }
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });
})();
