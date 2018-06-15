/* Author: Cameron Little

*/

$(document).ready(function(){
	
	var bladeOpen = false,
	    $lightsaber = $('.lightsaber'),
	    $hilt = $('.hilt'),
	    $blade = $('.blade'),
	    transform,
	    rand = 0,
	    boxshadow = "inset 0px 0px 5px #5fb5ff, 0px 0px 5px #84ceff, 0px 0px 10px #84ceff, 0px 0px 25px #84ceff, 0px 0px 25px #84ceff, 0px 0px 40px #84ceff, 0px 0px 100px #84ceff";
	    windowHeight = window.innerHeight,
	    windowWidth = window.innerWidth,
	    current = 0;
	var curMousePosX,
	    curMousePosY,
	    difX,
	    difY,
	    quadrant,
	    rotate,
	    audio,
	    hover,
	    audioPlaying = false;


	$('#main').css('height', windowHeight);
	$lightsaber
	.eq(current)
	.addClass('selected')
	.end()
	.css({
		top: (windowHeight - $lightsaber.height()) / 2,
		left: (windowWidth - $lightsaber.width()) / 2
	})
	.show('500');
	for (i = 0; i < $lightsaber.length; i++) {
		$lightsaber
		.not('.selected')
		.eq(i)
		.animate({
			left: '-=' + ((i + 1) * 200) + 'px'
		});
	}

  if (document.addEventListener != null) {
  	// e.g. Firefox, Opera, Safari
		document.addEventListener("mousemove", mouseMove, true);
		document.addEventListener('keydown', keyPress, true);
	} else {
		// e.g. Internet Explorer (also would work on Opera)
		document.attachEvent("onmousemove", mouseMove);
		document.attachEvent('onkeydown', keyPress, true);
	}
	
	function mouseMove(event) {
		curMousePosX = event.clientX;
		curMousePosY = event.clientY;
		difX = curMousePosX - (windowWidth * 0.5);
		difY = curMousePosY - (windowHeight * 0.5);
		if (difX < 0 && difY > 0) {
			quadrant = 1;
		} else if (difX > 0 && difY > 0) {
			quadrant = 2;
		} else if (difX > 0 && difY < 0) {
			quadrant = 3;
		} else if (difX < 0 && difY < 0) {
			quadrant = 4;
		}
		// swing lightsaber
		rotate = Math.atan((difX/difY)) * -1;
		if (quadrant == 1 || quadrant == 2) {
			rotate -= 3.14159265;
		}
		transform = 'rotate(' + rotate + 'rad)';
		if (!hover) {
			$('.lightsaber.selected').css('-webkit-transform', transform);
		}
		// sounds on movement
		if (bladeOpen && !audioPlaying) {
			audio = $('.s' + (Math.round(Math.random() * $('.swing').size())));
			audio.get(0).play();
			audioPlaying = true;
			setTimeout(function() {
				audioPlaying = false;
			}, 1000);
		}
	}
	
	function keyPress(event) {
		switch (event.keyCode)	{
			case 32: // space
				bladeSwitch();
				break;
			case 39: // right arrow
				nextRight();
				break;
			case 37: // left arrow
				nextLeft();
				break;
		}
	}
	
	$('.on-off').click(function() {
		bladeSwitch();
	});
	$('#controls').not('.on-off').hover(
		function() {
			$lightsaber.css('-webkit-transform', 'rotate(0deg)');
			hover = true;
		},
		function() {
			$lightsaber.css('-webkit-transform', 'rotate(0deg)');
			hover = false;
		}
	);
	$('#controls .right').click(function() {
		nextRight();
	});
	$('#controls .left').click(function() {
		nextLeft();
	});
  
  function bladeSwitch() {
		// close lightsaber
		if (bladeOpen) {
			bladeOpen = false;
			$('#close').get(0).play();
			$('.lightsaber.selected').animate({
				top: '+=1150',
			}, 500)
			.toggleClass('open')
			.toggleClass('closed')
			.find('.blade')
			.slideToggle(500);
			$('#hum').get(0).pause();
			$lightsaber.not('.selected').animate({
				opacity: '0.5'
			});
			$('.on-off').html('open').animate({
				opacity: '1'
			});
			$('.lr').animate({
				opacity: '1'
			});
		// open lightsaber
		} else {
			bladeOpen = true;
			$('.lightsaber.selected').animate({
				top: '-=1150',
			}, 300)
			.toggleClass('open')
			.toggleClass('closed')
			.find('.blade')
			.slideToggle(300);
			$('#hum').get(0).play();
			$('#open').get(0).play();
			$lightsaber.not('.selected').animate({
				opacity: '0'
			});
			$('.on-off').html('close').animate({
				opacity: '0.5'
			});
			$('.lr').animate({
				opacity: '0'
			});
		}
	}
	
	function nextLeft() {
		if (!bladeOpen) {
			current += 1;
			if (current > 2) {
				current = 0;
			}
			$lightsaber
			.removeClass('selected')
			.animate({
				left: '+=200px',
				opacity: 0.5
			}).css('-webkit-transform', 'rotate(0deg)')
			.eq(current)
			.addClass('selected')
			.animate({
				left: (windowWidth - $lightsaber.width()) / 2,
				opacity: 1
			});;
		}
	}
	
	function nextRight() {
		if (!bladeOpen) {
			current -= 1;
			if (current < 0) {
				current = 2;
			}
			$lightsaber
			.removeClass('selected')
			.animate({
				left: '-=200px',
				opacity: 0.5
			}).css('-webkit-transform', 'rotate(0deg)')
			.eq(current)
			.addClass('selected')
			.animate({
				left: (windowWidth - $lightsaber.width()) / 2,
				opacity: 1
			});;
		}
	}
  
});

setInterval( "boxShadow()", 15 );

function boxShadow() {
	$('.currentVal').html(current);
	if ($('.lightsaber.selected').hasClass('vader')) {
		boxshadow = "inset 0px 0px 5px #ff4b4e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 5px #ff6c6e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 10px #ff6c6e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #ff6c6e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #ff6c6e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 40px #ff6c6e, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 100px #ff6c6e";
	} else if ($('.lightsaber.selected').hasClass('skywalker')) {
		boxshadow = "inset 0px 0px 5px #5fb5ff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 5px #84ceff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 10px #84ceff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #84ceff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #84ceff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 40px #84ceff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 100px #84ceff";
	} else if ($('.lightsaber.selected').hasClass('windu')) {
		boxshadow = "inset 0px 0px 5px #a200ff, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 5px #A045D0, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 10px #A045D0, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #A045D0, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 25px #A045D0, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 40px #A045D0, "
		          + ((Math.round(Math.random() * 8) / 5) - 1) + "px 0px 100px #A045D0";
	}
	$('.selected .blade').css('box-shadow', boxshadow);
}