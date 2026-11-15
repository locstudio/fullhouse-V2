/* Full House v2 · 공통 스크립트 (모바일 메뉴, 공간 서비스 탭, 프로젝트 필터) */
(function () {
  'use strict';

  /* 모바일 메뉴 */
  var menuBtn = document.querySelector('.menu-btn');
  var panel = document.getElementById('nav-panel');
  if (menuBtn && panel) {
    var setMenu = function (open) {
      panel.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? '닫기' : '메뉴';
    };
    menuBtn.addEventListener('click', function () { setMenu(!panel.classList.contains('is-open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width:861px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* 공간 서비스 탭: 선택한 탭만 펼치고, 데스크톱에서는 왼쪽 사진을 함께 바꿉니다 */
  var tabs = document.querySelectorAll('.tab');
  var stageImgs = document.querySelectorAll('.stage img');
  if (tabs.length) {
    var pick = function (i) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.classList.toggle('is-active', on);
        t.querySelector('.tab-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
        if (stageImgs[n]) stageImgs[n].classList.toggle('is-active', on);
      });
    };
    tabs.forEach(function (t, i) {
      t.querySelector('.tab-btn').addEventListener('click', function () { pick(i); });
    });
  }

  /* 프로젝트 필터 */
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.proj');
  var live = document.getElementById('filter-live');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        cards.forEach(function (card) {
          card.classList.toggle('is-hidden', key !== 'all' && card.getAttribute('data-type') !== key);
        });
        if (live) live.textContent = chip.textContent + ' 유형을 선택했습니다.';
      });
    });
  }
})();
