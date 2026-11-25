/* Full House v3 · 공통 스크립트 (모바일 메뉴, 공간 서비스 탭, 프로젝트 필터) */
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
  var cards = document.querySelectorAll('.hrow');
  var empty = document.getElementById('hist-empty');
  var live = document.getElementById('filter-live');
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        cards.forEach(function (card) {
          card.classList.toggle('is-hidden', key !== 'all' && card.getAttribute('data-type') !== key);
        });
        if (empty) empty.hidden = !!document.querySelector('.hrow:not(.is-hidden)');
        if (live) live.textContent = chip.textContent + ' 유형을 선택했습니다.';
      });
    });
  }

  /* URL 쿼리(?type=)로 프로젝트 필터 선택 */
  var q = /[?&]type=(residential|commercial|culture|landscape)/.exec(location.search);
  if (q && chips.length) {
    var target = document.querySelector('.chip[data-filter="' + q[1] + '"]');
    if (target) target.click();
  }

  /* 상담 문의: 입력값으로 이메일 본문 생성 */
  var fm = document.getElementById('fm');
  var pv = document.getElementById('pv');
  var send = document.getElementById('send');
  if (fm && pv && send) {
    var ids = ['f-type','f-loc','f-area','f-when','f-budget','f-tel','f-note'];
    var labels = ['공간 유형','위치','면적','희망 일정','예산 범위','연락처','추가 요청'];
    var el = function (id) { return document.getElementById(id); };
    var build = function () {
      var lines = ['안녕하세요. 풀하우스 상담을 문의드립니다.', ''];
      ids.forEach(function (id, i) { lines.push('- ' + labels[i] + ': ' + el(id).value.trim()); });
      var text = lines.join('\n');
      var type = el('f-type').value;
      var subject = '[풀하우스 상담 문의]' + (type ? ' ' + type : '');
      pv.value = text;
      send.href = 'mailto:byc7982@naver.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text.replace(/\n/g, '\r\n'));
    };
    fm.addEventListener('input', build);
    fm.addEventListener('change', build);
    var tq = /[?&]type=(residential|commercial|culture|landscape)/.exec(location.search);
    if (tq) el('f-type').value = {residential:'주거',commercial:'상업',culture:'전시문화',landscape:'토목조경'}[tq[1]];
    build();
    var copy = document.getElementById('copy');
    var live = document.getElementById('copy-live');
    if (copy) copy.addEventListener('click', function () {
      var done = function (ok) { if (live) live.textContent = ok ? '내용을 복사했습니다. 이메일에 붙여 넣어 주세요.' : '복사하지 못했습니다. 미리보기 내용을 직접 선택해 복사해 주세요.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pv.value).then(function () { done(true); }, function () { done(false); });
      } else { pv.select(); try { done(document.execCommand('copy')); } catch (e) { done(false); } }
    });
  }
})();
