/* ----- Counting up numbers ----- */

var $length = $('#length');
var lengthMax = parseInt($length.attr('data-max'), 10);
var current = 0;

var updateLength = function () {
  current += 99135710;
  $length.html(current.toLocaleString() + ' km');
  updateTick();
};

var updateTick = function () {
  if (current < lengthMax) {
    requestAnimationFrame(updateLength);
  } else {
    $length.html(lengthMax.toLocaleString() + ' km');
  }
};

updateLength();


/* ----- Navigation ----- */

var $navWrap = $('.nav-wrap');
var $navBtn = $('.nav-btn');
var $nav = $('.nav');

$nav.find('a').attr('tabindex', -1);

$navBtn.on('click', function () {
  if ($navWrap.hasClass('is-open')) {
    $navWrap.removeClass('is-open');
    $nav.attr('aria-hidden', true);
    $navBtn.attr('aria-expanded', false);
    $nav.find('a').attr('tabindex', -1);
  } else {
    $navWrap.addClass('is-open');
    $navWrap.addClass('is-fixed');
    $navBtn.addClass('is-active');
    $nav.attr('aria-hidden', false);
    $navBtn.attr('aria-expanded', true);
    $nav.find('a').attr('tabindex', 0);
  }
});

$navWrap.on('transitionend', function () {
  if (!$navWrap.hasClass('is-open')) {
    $navWrap.removeClass('is-fixed');
    $navBtn.removeClass('is-active');
  }
});

$navWrap.on('keypress', function (e) {
  switch (e.keyCode) {
    case 27:
      $navWrap.removeClass('is-open');
      $nav.attr('aria-hidden', true);
      $navBtn.attr('aria-expanded', false);
      $nav.find('a').attr('tabindex', -1);
      $navBtn.focus();
      break;
  }
});

/* ----- Tabs ----- */

var $tabs = $('.tabs');
var $panels = $('.tab-panel');

$tabs.on('click', 'a', function (e) {
  e.preventDefault();

  var id = $(this).attr('href');

  $panels.filter('[aria-hidden="false"]').attr('aria-hidden', true);
  $tabs.find('[aria-selected="true"]').attr('aria-selected', false);

  $(this).attr('aria-selected', true);
  $(id).attr('aria-hidden', false);
});
