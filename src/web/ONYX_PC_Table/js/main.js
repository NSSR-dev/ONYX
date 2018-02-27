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







/*
var slider = document.getElementById("led-red-slider");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
*/

/*
var featured = document.getElementById("led-red-slider");
if( "ontouchstart" in window ) {
    var touchStart = function(evt) {
        var startTime = (new Date()).getTime();
        var startX = evt.changedTouches[0].pageX;
        var touchEnd = function(evt) {
            document.removeEventListener("touchend", touchEnd);
            var diffX = evt.changedTouches[0].pageX - startX;
            var elapsed = (new Date()).getTime() - startTime;
            console.log( "Swiped " + diffX + " pixels in " + elapsed + " milliseconds" );
            if( elapsed < 200 && Math.abs(diffX) > 50 ) {
                ( diffX < 0 ) ? slideright() : slideleft();
            }
        }
        document.addEventListener("touchend", touchEnd);
    };
    featured.addEventListener("touchstart", touchStart);
}
*/

var range = document.getElementById('led-red-slider');

range.style.height = '5vw';
range.style.width = '60vw';
range.style.margin = '10vw 10vw 30px';

noUiSlider.create(range, {
	start: [ 0 ], // 1 handle, starting at...
	margin: 0, // Handles must be at least 300 apart
	connect: true, // Display a colored bar between the handles
	direction: 'ltr', // Put '0' at the bottom of the slider
	orientation: 'horizontal', 
	behaviour: 'tap-drag', // Move handle on tap, bar is draggable
	step: 1,
	tooltips: true,
	format: wNumb({
		decimals: 0
	}),
	range: {
		'min': 0,
		'max': 255
	},
	pips: { // Show a scale with the slider
		mode: 'range',
		stepped: true,
		density: 5
	}
});

