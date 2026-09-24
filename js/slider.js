(function () {
  'use strict';

  var slider = document.getElementById('coffeeSlider');
  if (!slider) return;

  var track = document.getElementById('sliderTrack');
  var slides = track ? track.querySelectorAll('.slide') : [];
  var prevBtn = document.getElementById('sliderPrev');
  var nextBtn = document.getElementById('sliderNext');
  var dotsWrap = document.getElementById('sliderDots');
  var dots = dotsWrap ? dotsWrap.querySelectorAll('.slider-dot') : [];

  var count = slides.length;
  if (!track || count === 0) return;

  var current = 0;

  function render() {
    track.style.transform = 'translateX(' + -current * 100 + '%)';

    dots.forEach(function (dot, index) {
      var isActive = index === current;
      dot.classList.toggle('active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });
  }

  function goTo(index) {
    // Cyclic wrap-around.
    current = (index + count) % count;
    render();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      goTo(index);
    });
  });

  slider.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') next();
    if (event.key === 'ArrowLeft') prev();
  });

  render();
})();
