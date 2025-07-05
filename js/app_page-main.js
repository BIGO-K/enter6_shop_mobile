/**
** 메인페이지
**/

$(function() {

	var datas = $('.m-main > .mm_swiper').data('mm.swiper');
	if (!datas || !datas.Swiper) return;
	
	var swiper = datas.Swiper;
	var gnbSwiper = $('.mm_gnb .mm_swiper').data('mm.swiper').Swiper;
	var gnbSlides = gnbSwiper.slides;

	// swiper 변경
	function swiperChange(__swiper, __index, __currentGnbSlide) {

		__swiper.slideTo(__index);

		$(gnbSlides).children().removeClass('__on').attr({ 'title': '' });
		$(__currentGnbSlide).children().addClass('__on').attr({ 'title': '선택됨' });

		var $iframe = $(swiper.slides).filter('[data-swiper-slide-index=' + __index + ']').find('iframe');
		if ($iframe[0]) $iframe[0].contentWindow.mm.getScroller().trigger('main_update');// 헤더위치 변경

	}

	// 슬라이드 이동 후 리포지션
	datas.onChangeEnd = function() {

		swiper.slideToLoop(swiper.realIndex, 0);

	}

	// 슬라이드 iframe
	$('.m-main-slideframe').each(function() {

		var datas = $(this).data('mm.preload');

		// iframe 로드 후 적용
		datas.onComplete = function() {

			var $this = $(this);
			var starts = { _x: null, _y: null, _rectX: null, _time: null };
			var _direction = null;

			$this[0].contentWindow.mm.getScroller().on('touchstart touchend touchmove', function(__e) {

				// if (swiper.animating) return;
				// if (!__e.cancelable) return;

				var touches = (__e.type == 'touchend') ? __e.originalEvent.changedTouches[0] : __e.originalEvent.touches[0];
				var rects = $this[0].getBoundingClientRect();

				if (__e.type != 'touchstart') {
					var compareX = touches.clientX - starts._x;
					if (_direction == null) {
						var compareY = touches.clientY - starts._y;
						_direction = (Math.abs(compareX) > Math.abs(compareY)) ? 'horizontal' : 'vertical';
					}
				}

				switch(__e.type) {
					case 'touchstart':
						starts = {
							_x: touches.clientX,
							_y: touches.clientY,
							_rectX: rects.x,
							_time: __e.originalEvent.timeStamp,
						};
					break;
					case 'touchend':
						var _speed = __e.originalEvent.timeStamp - starts._time;
						var _count = (rects.x < starts._rectX) ? 1 : (rects.x > starts._rectX) ? -1 : 0;

						// 빠르게 이동(변경)
						if (_speed < 300) {
							swiper.slideTo(swiper.activeIndex + _count);
						}
						// 위치에 따른 변경 적용
						else {
							// 변경
							if (Math.abs(rects.x) > $(window).width() / 2) {
								swiper.slideTo(swiper.activeIndex + _count);
							}
							// 원위치
							else {
								swiper.translate = swiper.translate + compareX + rects.x;
								swiper.slideTo(swiper.activeIndex);
							}
						}

						// 슬라이드 gnb
						swiperChange(gnbSwiper, swiper.realIndex, gnbSlides.eq(swiper.realIndex));

						starts = {};
						_direction = null;
					break;
					case 'touchmove':
						if (_direction == 'horizontal') {
							__e.preventDefault();
							var _moveX = swiper.translate + compareX + rects.x;
							if (/translate3d/i.test(swiper.$wrapperEl.attr('style'))) swiper.$wrapperEl.css({ 'transform': 'translate3d(' + _moveX + 'px, 0, 0)' });
							else swiper.$wrapperEl.css({ 'transform': 'translateX(' + _moveX + 'px' });
						}
					break;
				}

			});

		}

	});

	// gnb 클릭 시 페이지 이동
	gnbSlides.on('click', function(__e) {

		__e.preventDefault();

		var _index = $(this).index() + 1;

		swiperChange(swiper, _index, this);
		gnbSwiper.slideTo(_index);

	});

});
