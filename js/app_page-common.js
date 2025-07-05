/**
** 페이지 공통
**/

/// 웹폰드 로드
// var _fontUrl = (mm._isPublish) ? '../css/fonts.css' : '/pc/css/fonts.css';// 실서버 폰트 경로 분기
// WebFont.load({
// 	custom: {
// 		families: ['Fontello', 'GothicA1', 'Jalnan'/*, 'NotoSansKR', 'Roboto', 'Ebrima'*/],
// 		urls: [_fontUrl]
// 	}
// });

// CDN 사용으로 폰트 전체 로드
var $linkFont = $('link.link_font');
if ($linkFont.attr('resource')) $linkFont.after($linkFont[0].outerHTML.replace('resource', 'href')).remove();
$('html').addClass('__font');
// $linkFont.attr({ 'href': $linkFont.attr('resource') }).removeAttr('resource');// attr 변경 시 ie에서 로드 안되는 경우 발생
///-- 웹폰드 로드

/// 모바일
if (mm.is.mobile()) {
	// 터치이벤트 확인
	// iframe은 인식 안됨(내부 스크립트 추가 필요)
	$(document).on('touchstart touchend', '*', function(__e) {

		switch (__e.type) {
			case 'touchstart':
				mm._isTouch = true;
			break;
			case 'touchend':
				mm._isTouch = false;
			break;
		}

	});

	// 모바일 로테이션
	$(window).on('orientationchange', function() {

		// if (!mm.is.mobile('app')) location.reload();// 히스토리 이슈로 새로고침 잠시 적용 안함

	});
}
///-- 모바일

/// 아이폰 이슈
if (mm.is.mobile('ios')) {
	// 아이폰 위/아래 스크롤 막기
	var _touchCount = 0;
	var _touchBefore = 0;

	$('.mm_app').on('touchstart touchend touchcancel touchmove', function(__e) {

		if (!__e.cancelable || mm._isFrame) return;// 캔슬이 불가능하거나 자동높이 조절되는 iframe 내부에서는 캔슬

		var $scroller = $(__e.target).closest('.mm_scroller');
		var touches = (__e.type == 'touchend') ? __e.originalEvent.changedTouches[0] : __e.originalEvent.touches[0];

		switch (__e.type) {
			case 'touchstart':
				_touchBefore = touches.pageY;
				_touchCount = 0;
			break;
			case 'touchend':
			case 'touchcancel':
				//
			break;
			case 'touchmove':
				var _touchMove = touches.pageY;
				if (_touchMove - _touchBefore < 0) {// 위로 스크롤
					if (_touchCount < 0) _touchCount = 0;
					_touchCount++;
				}
				if (_touchMove - _touchBefore > 0) {// 아래로 스크롤
					if (_touchCount > 0) _touchCount = 0;
					_touchCount--;
				}
				_touchBefore = _touchMove;
			break;
		}

		// 스크롤 바가 없는 영역에서 드래그 하면 캔슬(고정영역)
		if (!$scroller[0]) {
			if (Math.abs(_touchCount) > 0) __e.preventDefault();
			return;
		}

		var _scrollHeight = $scroller[0].scrollHeight - $scroller.outerHeight();

		// 스크롤 상/하단에서 영역을 넘겨 드래그하면 캔슬
		// if (!__e.cancelable && (($scroller.scrollTop() < 1 && _touchCount < 0) || ($scroller.scrollTop() > _scrollHeight - 1 && _touchCount > 0))) {
		if (($scroller.scrollTop() < 1 && _touchCount < 0) || ($scroller.scrollTop() > _scrollHeight - 1 && _touchCount > 0)) {
			__e.preventDefault();
		}

	});
}
///-- 아이폰 이슈

/// 팝업
if (mm._isPopup) {
	var states = top.history.state;
	var _popupIndex = (states) ? top.history.state._popupIndex : 0;
	if (_popupIndex > 0) {
		$('[data-href*="back"]').show();
	}
}
///-- 팝업

/// 컨텐츠 iframe 리사이즈
mm.frameResize = function(__iframe) {

	var $frameDocument = ($(__iframe).is('iframe')) ? $(__iframe).contents()[0] : null;

	// 아이프레임 외부에서 __iframe 요소를 선택
	if ($frameDocument) {
		var frameWindow = $frameDocument.defaultView || $frameDocument.parentWindonw;
		frameWindow.mm.frameResize();
	}
	// 아이프레임 내부에서 실행
	else {
		var _frameHeight = $('.mm_page-content').height();
		$(frameElement).css({ 'height': _frameHeight });
	}

}
if (mm._isFrame && document.getElementsByClassName('__mm_main__').length == 0) {// 메인이 아닐 때만 적용
	// iframe에서는 history.state가 다른 주소로 인식됨
	// if (history.state) frameElement.style.height = history.state._frameHeight + 'px';// 아이프레임 높이 적용

	$(function() {

		mm.frameResize();
		$(window).on('load', mm.frameResize);

		// delegate 적용이 필요할 경우 mm.observer 활용하여 수정 필요
		$('.mm_dropdown, .mm_tab').each(function() {

			var $this = $(this);
			var datas = $this.data('mm.dropdown') || $this.data('mm.tab');
			var onChangeOld = (datas) ? datas.onChange : null;

			datas.onChange = function() {

				if (onChangeOld) onChangeOld();
				mm.instant(mm.frameResize);

			};

		});

		$('[type=radio]', '[type=checkbox]').each(function() {

			$(this).on('update change', function() {

				mm.instant(mm.frameResize);

			});

		});

		// mm_toggle도 연결 필요??

	});
}
///-- 컨텐츠 iframe 리사이즈

/// 페이지
mm.page = (function() {

	/// private
	(function() {

		var $html = $('html');
		var $view = $('.mm_view');

		// 인쇄화면
		// if ($('.__app_print__')[0]) {
		// 	$('html, body').css({ 'overflow': 'auto', 'min-width': 1000, 'height': 'auto' });
		// }

		// 아이프레임에서 필요없는 요소 제거, title 추가
		// if (mm._isIframe) {
		// 	$('.mm_toolbar, .mm_sidebar, .mm_popup, mm_cover, .mm_footer').remove();
		// 	$(frameElement).attr({ 'title': function(__i, __value) {
		//
		// 		return __value || $('title').text();
		//
		// 	} });
		// }
		
		if (mm._isIframe) top.mm.observer.update(mm.events.frame_ready);// iframe 내부 레디일 때 이벤트 전송

		/// 히스토리
		var states = history.state;
		if (states) {
			// 스크롤 이동
			if (states._scroll) {
				mm.anchor(states._scroll);
				delete states._scroll;// 기존 위치 삭제
			}

			// 내용 교체
			// delete history.state._html;
		}
		///-- 히스토리

		/// 로드완료
		$(window).on('load', function() {

			// 팝업 리사이즈
			if (mm._isPopup) mm.popup.resize();
			if (mm._isModal) mm.modal.resize();

		});
		///-- 로드완료

		// 현재 페이지 연결
		mm.component.update();

		// 익스/엣지 브라우저에서 새로고침 할 때 라디오/체크박스의 기존 선택을 물고있는거나 날려버리는 이슈가 있어 초기화 후 재연결
		if (mm.is.ie()) {
			$(window).on('load', function() {
				 mm.instant(mm.form.update, { args: [$('[checked]').prop({ 'checked': true })] });
			});
		}

		/// a 링크
		$(document).on('click', 'a[data-href]', function(__e) {

			if (/blank/i.test(this.target)) return;// target blank 제외

			// jQuery .data('mm.name')에 저장할 기본 값
			var defaults = {
				_type: null,// :string - 고정 값, anchor/link/reload/back/forward/popup/modal
				_frameId: null,// popup, modal에서 iframe으로 노출할 때 id속성 지정
				_frameName: null,// popup, modal에서 iframe으로 노출할 때 name속성 지정
				_isRoot: false,// :boolean - window.top에서 실행
				_isPopupClose: false,// :boolean - type 값이 link/popup일 때 현재 팝업 닫고 실행
				_step: 1,// mm.history.back(forward) 옵션 설정 가능
				// 그 외 mm.anchor 등 options에 전달할 변수 추가 가능
			};

			var $this = $(this);
			var datas = $this.data('mm.href') || mm.element.datas($this, 'data-href', defaults, true);
			var _attrHref = $this.attr('href');
			var _href = this.href;

			if (!datas._type) return false;
			if (datas._type == 'link') {
				if ($.trim(_attrHref.replace('#', '')).length == 0 || /javascript\:/i.test(_attrHref)) return false;

				if (_href.split('#')[0] == location.href.split('#')[0]) datas._type = 'reload';// 링크가 같으면 reload로 변경
				if (datas._type == 'reload' && /\#/.test(_href)) datas._type = 'anchor';// 링크가 같고 #이 있으면 anchor로 변경
			}

			__e.preventDefault();

			// 외부링크
			if (/link|popup/i.test(datas._type)) {
				if (_href.indexOf(location.host) < 0) {
					// mm.root('mm.popup.open', ['popup_externalLink.html?url=' + _href]);// 외부링크(https에서 외부 http 연결 안됨)
					window.open(_href);// 새 창 열림
					return false;
				}
			}

			switch (datas._type) {
				case 'reload':
					location.reload();// location.reload(true);
				break;
				case 'back':
					mm.history.back(datas._step);
				break;
				case 'forward':
					mm.history.forward(datas._step);
				break;
				case 'anchor':
					mm.anchor(_attrHref, datas);
				break;
				case 'modal':
				case 'popup':
					$.extend(true, datas, { openElement: this });
				case 'link':
				case 'home':
					if (mm._isMainFrame) parent.mm.link(_href, datas);
					else mm.link(_href, datas);
				break;
			}

		});

		/// 스크롤이벤트
		var _scrollBefore = 0;
		var _scrollCount = 0;
		var _scrollThreshold = 10;// 아이폰과 안드로이드 감도 조절 필요?

		mm.getScroller().on('scroll main_update', function(__e) {

			var $this = $(this);
			var $html = ($('.__mm_main__')[0]) ? $('html', top.document) : $('html');
			var $header = $html.find('.mm_header');
			var $btnTop = $('.btn_topmost');

			var _scroll = $this.scrollTop();
			var _classHide = '__header-hide';
			var _isHide = $html.hasClass(_classHide);
			var _direction = (_scroll - _scrollBefore > 0) ? 'down' : 'up';

			switch(__e.type) {
				case 'scroll':
					// 탑버튼은 화면높이만큼 스크롤이 넘어가면 노출
					if (_scroll > $(top.window).height()) $btnTop.addClass('__on');
					else $btnTop.removeClass('__on');

					// 헤더, GNB 숨김
					if ((_scrollCount > 0 && _direction == 'up') || (_scrollCount < 0 && _direction == 'down')) _scrollCount = 0;
					_scrollCount += (_direction == 'down') ? 1 : (_direction == 'up') ? -1 : 0;

					if (_scroll > $header.outerHeight() * 2) {
						if (Math.abs(_scrollCount) > _scrollThreshold) {
							if (!_isHide && _scrollCount > 0) $html.addClass(_classHide);
							if (_isHide && _scrollCount < 0) $html.removeClass(_classHide);
						}
					} else {
						if (_isHide) $html.removeClass(_classHide);
					}

					_scrollBefore = _scroll;
				break;
				case 'main_update':
					if (_isHide && _scroll <= $header.outerHeight() * 2) $html.removeClass(_classHide);
				break;
			}

			// mm.history.replace({ _scroll: $this.scrollTop() });// 무한 스크롤 시 보안오류 발생으로 mm.link가 실행될 때만 저장

		});
		///-- 스크롤이벤트

	})();

	/// public
	return {
		//
	};

})();
///-- 페이지

/// 사이드바
mm.sidebar = (function() {

	var $html = $('html');
	var $sidebar = $('.mm_sidebar');
	var _classOn = '__side';

	if (!$sidebar[0]) return;

	// 사이드바 열기
	function sidebarOpen() {

		$html.addClass(_classOn);

	}

	// 사이드바 닫기
	function sidebarClose() {

		$html.removeClass(_classOn);

	}

	/// private
	(function() {

		//

	})();

	/// public
	return {
		open: sidebarOpen,
		close: sidebarClose,
	};

})();
///-- 사이드바

/// 상세검색
mm.rescan = (function() {

	var $html = $('html');
	var $rescan = $('.mm_rescan');
	var _classOn = '__rescan';

	if (!$rescan[0]) return;

	// 상세검색 열기
	function rescanOpen() {

		$html.addClass(_classOn);

	}

	// 상세검색 닫기
	function rescanClose() {

		$html.removeClass(_classOn);

	}

	/// private
	(function() {

		var $category = $('.mm_rescan-category .mm_accordion');
		var $template = $category.find('[type="text/category-template"]');
		var $flagment = $($template.html());

		mm.dropdown.update($flagment);

		// 1뎁스 내용만 숨김
		$flagment.find('[data-dropdown*="category_depth1"]').each(function(__i) {

			var $this = $(this);
			var $content = $this.find('.mm_dropdown-item-inner > ul').eq(0).detach();
			var datas = $this.data('mm.dropdown');

			datas.onOpen = function() {

				$content.appendTo($this.find('.mm_dropdown-item-inner').eq(0));

			}

			datas.onClose = function() {

				$content.detach();

			}

		});

		$template.remove();
		$category.append($flagment);

	})();

	/// public
	return {
		open: rescanOpen,
		close: rescanClose,
		checkRadio: function() {

			$(this).find('> .btn_dropdown :radio').prop('checked', true);

		},
	};

})();
///-- 상세검색

/// 상품목록 스타일변경
function toggleProductStyle() {

	var $productList = $(this).closest('.mm_product-list');
	if (!$productList[0]) $productList = $('.mm_product-list');
	var $btnStyle = $(this);
	var _classOn = '__list-wide';

	$productList.toggleClass('__list-wide');

	if ($productList.hasClass(_classOn)) $btnStyle.attr('title', '2열로 보기').children('i').removeClass('mco_array-wide').addClass('mco_array-thumb');
	else $btnStyle.attr('title', '1열로 보기').children('i').removeClass('mco_array-thumb').addClass('mco_array-wide');

}
///-- 상품목록 스타일변경
