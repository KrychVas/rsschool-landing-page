(function () {
  'use strict';

  if (!window.productsData) return;

  var data = window.productsData;

  var MOBILE_MAX = 768;
  var MOBILE_PAGE_SIZE = 4;

  var grid = document.getElementById('menuGrid');
  var tabs = document.querySelectorAll('.menu-tabs .tab-item');
  var pagination = document.getElementById('pagination');
  var mobileMenu = document.getElementById('mobileMenu');
  var burger = document.getElementById('burgerBtn');

  var modal = document.getElementById('productModal');
  var modalBackdrop = document.getElementById('productModalBackdrop');
  var modalClose = document.getElementById('modalClose');
  var modalImg = document.getElementById('modalImg');
  var modalTitle = document.getElementById('modalTitle');
  var modalDesc = document.getElementById('modalDesc');
  var modalSizes = document.getElementById('modalSizes');
  var modalAdditives = document.getElementById('modalAdditives');
  var modalTotal = document.getElementById('modalTotal');

  var NO_IMAGE = 'assets/images/coffee-1.png';

  var currentCategory = 'coffee';
  var currentPage = 1;
  var activeProduct = null;
  var selectedSize = null;
  var selectedAdditives = [];

  function isMobile() {
    return window.innerWidth <= MOBILE_MAX;
  }

  function categories() {
    return Object.keys(data);
  }

  function categoryProducts(category) {
    return data[category] || [];
  }

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function pageSize() {
    return isMobile()
      ? MOBILE_PAGE_SIZE
      : categoryProducts(currentCategory).length;
  }

  function totalPages() {
    var size = pageSize();
    return Math.max(
      1,
      Math.ceil(categoryProducts(currentCategory).length / size),
    );
  }

  function createCard(product) {
    var card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Open ' + product.name);
    card.dataset.id = product.id;

    var imgWrap = document.createElement('div');
    imgWrap.className = 'product-card__img-wrap';

    var img = document.createElement('img');
    img.className = 'product-card__img';
    img.src = product.image;
    img.alt = product.name;
    img.onerror = function () {
      img.src = NO_IMAGE;
    };
    imgWrap.appendChild(img);

    var body = document.createElement('div');
    body.className = 'product-card__body';

    var title = document.createElement('div');
    title.className = 'product-card__title';

    var h3 = document.createElement('h3');
    h3.textContent = product.name;

    var p = document.createElement('p');
    p.textContent = product.description;

    title.appendChild(h3);
    title.appendChild(p);

    var price = document.createElement('p');
    price.className = 'product-card__price';
    price.textContent = formatPrice(product.price);

    body.appendChild(title);
    body.appendChild(price);

    card.appendChild(imgWrap);
    card.appendChild(body);

    card.addEventListener('click', function () {
      openModal(product);
    });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(product);
      }
    });

    return card;
  }

  function renderGrid() {
    var products = categoryProducts(currentCategory);
    var size = pageSize();
    var start = (currentPage - 1) * size;
    var pageItems = products.slice(start, start + size);

    grid.innerHTML = '';
    pageItems.forEach(function (product) {
      grid.appendChild(createCard(product));
    });
  }

  function renderPagination() {
    if (!pagination) return;

    var pages = totalPages();

    if (pages <= 1) {
      pagination.innerHTML = '';
      pagination.hidden = true;
      return;
    }

    pagination.hidden = false;
    pagination.innerHTML = '';

    for (var i = 1; i <= pages; i += 1) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pagination__btn' + (i === currentPage ? ' active' : '');
      btn.textContent = String(i);
      btn.setAttribute('aria-label', 'Go to page ' + i);
      if (i === currentPage) btn.setAttribute('aria-current', 'page');

      (function (page) {
        btn.addEventListener('click', function () {
          if (page === currentPage) return;
          currentPage = page;
          renderGrid();
          renderPagination();
        });
      })(i);

      pagination.appendChild(btn);
    }
  }

  function render() {
    renderGrid();
    renderPagination();
  }

  function tabCategory(tab, index) {
    return tab.dataset.category || categories()[index];
  }

  function selectCategory(category) {
    currentCategory = category;
    currentPage = 1;

    tabs.forEach(function (tab, index) {
      var isActive = tabCategory(tab, index) === category;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    render();
  }

  function initTabs() {
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        selectCategory(tabCategory(tab, index));
      });
    });
  }

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
  }

  function buildOptions(container, options, type) {
    container.innerHTML = '';

    options.forEach(function (option) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-item';
      btn.dataset.code = option.code;

      var icon = document.createElement('span');
      icon.className = 'tab-item__icon';
      icon.textContent = option.code;

      var label = document.createElement('span');
      label.textContent = option.label;

      btn.appendChild(icon);
      btn.appendChild(label);

      btn.addEventListener('click', function () {
        var value = btn.dataset.code;

        if (type === 'size') {
          selectedSize = value;
          container.querySelectorAll('.tab-item').forEach(function (b) {
            b.classList.toggle('active', b.dataset.code === value);
          });
        } else {
          btn.classList.toggle('active');
          selectedAdditives = Array.prototype.slice
            .call(container.querySelectorAll('.tab-item.active'))
            .map(function (b) {
              return b.dataset.code;
            });
        }

        updateTotal();
      });

      container.appendChild(btn);
    });
  }

  function updateTotal() {
    if (!activeProduct) return;

    var total = activeProduct.price;

    var size = activeProduct.sizes.find(function (s) {
      return s.code === selectedSize;
    });
    if (size) total += size.modifier;

    selectedAdditives.forEach(function (code) {
      var additive = activeProduct.additives.find(function (a) {
        return a.code === code;
      });
      if (additive) total += additive.price;
    });

    modalTotal.textContent = formatPrice(total);
  }

  function openModal(product) {
    activeProduct = product;

    selectedSize = product.sizes.length ? product.sizes[0].code : null;
    selectedAdditives = [];

    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalImg.onerror = function () {
      modalImg.src = NO_IMAGE;
    };
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.description;

    buildOptions(modalSizes, product.sizes, 'size');
    buildOptions(modalAdditives, product.additives, 'additive');

    modalSizes.querySelectorAll('.tab-item').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.code === selectedSize);
    });

    updateTotal();

    modal.hidden = false;
    lockScroll();
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    activeProduct = null;
    unlockScroll();
  }

  function initModal() {
    if (!modal) return;

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }


  function handleResize() {
    var pages = totalPages();
    if (currentPage > pages) currentPage = pages;

    if (!isMobile() && mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileMenu.hidden = true;
      if (burger) {
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
      unlockScroll();
    }

    render();
  }

  function init() {
    initTabs();
    initModal();
    selectCategory(categories()[0]);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    });
  }

  init();
})();
