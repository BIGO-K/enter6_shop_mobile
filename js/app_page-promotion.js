/**
** 기획전
**/

$(function() {
	
	var $header = $('.mm_header');
	var $anchor = $('.m-popup-promo-anchor');
	var $option = $anchor.find('option');
	var $list = $('.m-popup-promo-list');
	var _classSticky = '__anchor-sticky';
	
	// 스크롤 구간 상품섹션 변경
	mm.getScroller().on('load scroll', function() {
		
		var _scrollTop = $(this).scrollTop();

		if (_scrollTop >= mm.element.position($anchor).top - $header.outerHeight() - $header.position().top) $anchor.addClass(_classSticky);
		else $anchor.removeClass(_classSticky);
		
		$list.each(function(__i) {
			
			var _space = $(window).height() * 0.67;
			if (_scrollTop > mm.element.position(this).top - _space && (_scrollTop <= mm.element.position($(this).next()).top - _space || __i == $list.length - 1)) {
				$option.prop({ 'selected': false }).eq(__i).prop({ 'selected': true });
			}
		
		});
	
	});
	
});

// 상품 앵커
function changeProductAnchor() {
	
	var _marginY = $('.m-popup-promo-anchor').outerHeight() + $('.mm_header').outerHeight();
	mm.anchor('#' + $('option:selected').val(), { _time: 0, _margin: -_marginY, _isFocus: false });
	
}
