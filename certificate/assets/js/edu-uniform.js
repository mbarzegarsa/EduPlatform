/* ============================================================
 * EduPlatform Uniform Layer JS v1.0.0
 * فقط ظاهر یکسان: فوتر قبلی/بعدی در صفحات فاقد آن + استاندارد هدر
 * هیچ منطق دانلود/محاسبه/چاپ دستکاری نشده است.
 * ============================================================ */
(function () {
  'use strict';

  function tabOrder() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.sidebar-nav .nav-item[data-tab]'));
    return items.map(function (el) { return el.getAttribute('data-tab'); });
  }

  function activeTab(order) {
    var activeBtn = document.querySelector('.sidebar-nav .nav-item[data-tab].active');
    if (activeBtn) return activeBtn.getAttribute('data-tab');
    for (var i = 0; i < order.length; i++) {
      var pane1 = document.getElementById('tab-' + order[i]);
      var pane2 = document.getElementById(order[i]);
      if ((pane1 && pane1.classList.contains('active')) || (pane2 && pane2.classList.contains('active'))) return order[i];
    }
    return order[0] || null;
  }

  function goTab(name) {
    if (!name) return;
    var btn = document.querySelector('.sidebar-nav .nav-item[data-tab="' + name + '"]');
    if (btn) { btn.click(); return; }
    // fallback: فعال‌سازی دستی بدون دخالت در منطق ذخیره‌سازی اپ
    var order = tabOrder();
    document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === name);
    });
    document.querySelectorAll('.tab-pane, .tab-content').forEach(function (p) { p.classList.remove('active'); });
    var t1 = document.getElementById('tab-' + name);
    var t2 = document.getElementById(name);
    if (t1) t1.classList.add('active');
    if (t2) t2.classList.add('active');
    void order;
  }

  function step(dir) {
    var order = tabOrder();
    if (!order.length) return;
    var cur = activeTab(order);
    var idx = order.indexOf(cur);
    if (idx < 0) idx = 0;
    var next = idx + dir;
    if (next < 0) next = 0;
    if (next >= order.length) next = order.length - 1;
    if (next !== idx) {
      goTab(order[next]);
      var area = document.querySelector('.content-area');
      if (area) area.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  function ensureFooterNav() {
    var footer = document.querySelector('.content-footer');
    if (!footer) return;
    var prev = document.getElementById('prevTabBtn');
    var next = document.getElementById('nextTabBtn');
    // دکمه‌هایی که خود اپ از قبل داشته (certificate/gpa) دست نخورده می‌مانند.
    // فقط دکمه‌های ساخته‌شده توسط لایه یکسان یا دارای data-edu-uniform سیم‌کشی می‌شوند.
    function needsBind(el) {
      return el && el.hasAttribute('data-edu-uniform') && !el.dataset.eduUniformBound;
    }
    if (!prev || !next) {
      var actions = footer.querySelector('.footer-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'footer-actions';
        footer.insertBefore(actions, footer.firstChild);
      }
      var nav = actions.querySelector('.navigation-buttons');
      if (!nav) {
        nav = document.createElement('div');
        nav.className = 'navigation-buttons';
        actions.insertBefore(nav, actions.firstChild);
      }
      if (!prev) {
        prev = document.createElement('button');
        prev.className = 'btn btn-outline';
        prev.id = 'prevTabBtn';
        prev.type = 'button';
        prev.setAttribute('data-edu-uniform', '1');
        prev.innerHTML = '<i class="fas fa-arrow-right"></i> قبلی';
        nav.appendChild(prev);
      }
      if (!next) {
        next = document.createElement('button');
        next.className = 'btn btn-primary';
        next.id = 'nextTabBtn';
        next.type = 'button';
        next.setAttribute('data-edu-uniform', '1');
        next.innerHTML = 'بعدی <i class="fas fa-arrow-left"></i>';
        nav.appendChild(next);
      }
    }
    if (needsBind(prev)) {
      prev.dataset.eduUniformBound = '1';
      prev.addEventListener('click', function () { step(-1); });
    }
    if (needsBind(next)) {
      next.dataset.eduUniformBound = '1';
      next.addEventListener('click', function () { step(1); });
    }
  }

  function syncNavDisabled() {
    var order = tabOrder();
    if (!order.length) return;
    var prev = document.getElementById('prevTabBtn');
    var next = document.getElementById('nextTabBtn');
    if (!prev || !next) return;
    // فقط دکمه‌های ساخته‌شده توسط لایه یکسان مدیریت شوند؛ دکمه‌های خود اپ دست نخورده می‌مانند
    if (!prev.hasAttribute('data-edu-uniform') || !next.hasAttribute('data-edu-uniform')) return;
    var cur = activeTab(order);
    var idx = order.indexOf(cur);
    prev.toggleAttribute('disabled', idx <= 0);
    next.toggleAttribute('disabled', idx >= order.length - 1);
  }

  document.addEventListener('click', function (e) {
    var navBtn = e.target.closest ? e.target.closest('.sidebar-nav .nav-item[data-tab]') : null;
    if (navBtn) setTimeout(syncNavDisabled, 50);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { ensureFooterNav(); syncNavDisabled(); });
  } else {
    ensureFooterNav(); syncNavDisabled();
  }
})();
