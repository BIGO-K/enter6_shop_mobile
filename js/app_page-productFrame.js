/**
** 상품상세프레임
**/

// 아이프레임 리사이즈
$(function() {

	var $frame = $('.m-prodetail-frame');
	var _isProductInfo = !/m-prodetail-frame-review|m-prodetail-frame-qna/.test($frame.attr('class'));// 상품정보 프레임

	// 상품정보
	if (_isProductInfo) {
		var $preload = $frame.find('.mm_preload');

		// 사용자가 등록한 이미지 속성 제거
		$('img').each(function() {

			var $this = $(this);
			var attrs = [];

			$.each($this[0].attributes, function(__i, __key) {

				if (!/^id|^class|^src|^data|^alt/ig.test(__key.name)) attrs.push(__key.name)

			})
			if (attrs.length > 0) $this.removeAttr(attrs.join(' ')).css({ 'width': 'auto', 'max-width': '100%' });

		});

		// 프리로드
		$preload.each(function() {

			var datas = $(this).data('mm.preload');
			if (!datas) return;

			datas._isPass = false;
			datas._isErrorImage = false;
			datas.onComplete = mm.frameResize
			datas.onError = function() {

				$(this).closest('figure, li, i').remove();
				mm.frameResize();

			}

		});

		mm.preload.update($frame);
	}
	// 상품평, QnA
	else {
		// 게시판 아코디언 변경 시 리포지션
		$frame.find('.mm_dropdown').each(function() {

			var $this = $(this);
			var datas = $this.data('mm.dropdown');

			if (datas && datas._group) {
				datas.onChange = function() {

					mm.frameResize();

				};
			}

		});
	}

});
