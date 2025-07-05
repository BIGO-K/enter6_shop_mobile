/**
** 상품 상세
**/

$(function() {

	var $doc = $(document);

	$('.btn_topmost').css({ 'bottom': '59px' });// 탑버튼 위치 이동

	/// 옵션선택
	(function() {

		var $buy = $('.m-prodetail-buy');
		var $option = $buy.find('.m--option-item');
		var $selected = $buy.find('.m--option-selected-list');

		var PROD_OPTION_NEXT = 'PROD_OPTION_NEXT';// 옵션선택(단계)
		var PROD_OPTION_SELECT = 'PROD_OPTION_SELECT';// 옵션선택(최종)
		var PROD_OPTION_QTY = 'PROD_OPTION_QTY';// 옵션수량변경
		var PROD_FRAME_OPTION_SELECT = 'PROD_FRAME_OPTION_SELECT';// 딜상품 아이프레임에서 옵션선택

		// 페이지 스크롤 시 옵션 닫기
		mm.getScroller().on('scroll', function(__e) {

			if ($buy.hasClass('__buy-on')) $('.btn_buy-close').trigger('click');

		});

		// 안드로이드에서 input 요소에 포커싱 될 때 스크롤 되면서 옵션이 닫히는 이슈로 예외 적용
		$('.form_text_word').on('focusin focusout', function(__e) {

			__e.stopPropagation();

		});

		$buy.on('touchmove', function(__e) {

			var $target = $(__e.target);
			var $scroller = $target.closest('.mm_scroller');

			if ($buy.find($scroller)[0]) {
				if ($scroller.children('ul').height() <= $scroller.height()) return false;
			}
			else {
				return false;
			}

		});

		// 구매패널 열기/닫기
		$buy.on('click', '.btn_buy-open, .btn_buy-close', function(__e, __isDealSelect) {

			__e.preventDefault();

			var _classOn = '__buy-on';

			if ($(this).hasClass('btn_buy-open')) {
				TweenMax.to($buy, mm.times._fast, { height: '55%', onStart: function() {

					// 선택옵션이 없으면 옵션선택 창 열림
					if (!$selected.hasClass('mm_scroller') || __isDealSelect) $('.btn_option-open').trigger('click');

				}, ease: Sine.easeOut });
				$buy.addClass(_classOn);
			}
			else {
				TweenMax.to($buy, mm.times._fast, { height: '0%', ease: Cubic.easeOut });
				$buy.removeClass(_classOn);
			}

			if ($buy.hasClass('__buy-option')) $buy.removeClass('__buy-option');

			$('.m--option-item').find('.__dropdown-on').each(function() {

				$(this).removeClass('__dropdown-on');

			});

		});
		//-- 구매패널 열기/닫기

		// 옵션 열기/닫기
		$buy.on('click', '.btn_option-open, .btn_option-close', function(__e) {

			var $dropdown = $option.children('.mm_dropdown');
			var $btnDropdown = $dropdown.find('.btn_dropdown');

			$dropdown.removeClass('__dropdown-on');
			$btnDropdown.removeClass('__option-select').find('.text_option').remove();
			if ($dropdown.length > 1) $btnDropdown.last().attr({ 'disabled': true });

			if ($(this).hasClass('btn_option-open')) $buy.addClass('__buy-option');
			else $buy.removeClass('__buy-option');

			mm.dropdown.close($dropdown);

		});
		//-- 옵션 열기/닫기

		$option.each(function(__i) {

			var $ui = $(this);
			var $list = $ui.find('.m--option-item-list');
			var $listItem = $list.find('li > a');
			var $formCheckSoldout = $ui.find('.form_check_soldout');
			var $formCheckWord = $ui.find('.form_check_word');
			var $formTextWord = $ui.find('.form_text_word');
			var $btnDropdown = $ui.find('.btn_dropdown');

			// 옵션패널 열기
			$ui.children('.mm_dropdown').data('mm.dropdown').onOpen = function() {

				$option.find('.mm_dropdown').not(this).removeClass('__dropdown-on');

				// 닫기
				// $doc.on('click', optionClose);

				// 초기화
				mm.form.update($formCheckWord.prop({ 'checked': false }));
				mm.form.update($formCheckSoldout.prop({ 'checked': false }));

			};
			//-- 옵션패널 열기

			// 옵션리스트 닫힘
			function optionClose(__e) {

				var $dropdown = $ui.children('.mm_dropdown');

				if (!__e || !$(__e.target).closest($dropdown)[0]) {
					mm.dropdown.close($dropdown);
					// $doc.off('click', optionClose);
				}

			}
			//-- 옵션리스트 닫힘

			// 옵션리스트확인
			function optionCheckVisible() {

				var $listUl = $list.find('ul');
				$listUl.show();

				if ($listItem.filter(':visible')[0]) {
					$listUl.next('.mm_text-none').remove();
				}
				else {
					$listUl.hide()
					.after(function() {

						return ($list.find('.mm_text-none')[0]) ? null : '<p class="mm_text-none">조건에 해당하는 옵션이 없습니다.</p>';

					});
				}

			}

			// 검색어찾기
			$formCheckWord.data('mm.check').onChange = function() {

				if (!$(this).is(':checked')) mm.form.update($formTextWord.val(''));

			};

			$formTextWord.on('keyup change', function() {

				var _word = $.trim($(this).val());
				var _classNone = '__none-word';

				$listItem.each(function() {

					var $item = $(this);
					var $textOption = $item.find('.text_option');
					var datas = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' '));

					if (_word.length == 0) $textOption.text(datas._name);
					else {
						$textOption.html(function() {

							return datas._name.replace(new RegExp(mm.escapeRegExp(_word), 'gi'), function(__text) {

								return '<em class="mm_text-secondary">' + __text + '</em>';

							});

						});
					}

					if ($textOption.find('.mm_text-secondary')[0] || _word.length == 0) $item.parent().removeClass(_classNone);
					else $item.parent().addClass(_classNone);

				});

				optionCheckVisible();

			});

			// 품절제외
			$formCheckSoldout.data('mm.check').onChange = function() {

				var $soldout = $listItem.filter('.__soldout');
				var _classNone = '__none-soldout';

				if ($(this).is(':checked')) $soldout.parent().addClass(_classNone);
				else $soldout.parent().removeClass(_classNone);

				optionCheckVisible();

			};

			// 리스트세팅, 선택
			$listItem.each(function() {

				var $item = $(this);
				var datas = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' '));

				if (datas._isSoldout == true) $item.addClass('__soldout');

				$item.not('.__soldout').on('click', function(__e) {

					var _classOn = '__option-select';

					TweenMax.to($buy, mm.times._fast, { height: '75%' });
					$('<span class="text_option" />').text(datas._name).prependTo($btnDropdown).siblings('.text_option').remove();
					$btnDropdown.addClass(_classOn);
					optionClose();

					if (__i < $option.length - 1) mm.observer.update(PROD_OPTION_NEXT, { datas: $.extend(true, datas, { _index: __i }) });// 옵션단계
					else mm.observer.update(PROD_OPTION_SELECT, { datas: $.extend(true, datas, { item: $item }) });// 최종옵션

				});

			});

			// 다음옵션세팅
			mm.observer.set($ui, PROD_OPTION_NEXT, function(__e, __datas) {

				if (__i != __datas._index + 1) return;

				var _classNone = '__none-group';

				$btnDropdown.attr({ 'disabled': false });
				$listItem.each(function() {

					var $item = $(this);
					var _groups = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' ')).groups.join('/');

					if (_groups.match(new RegExp(mm.escapeRegExp(__datas.groups.join('/')), 'i'))) $item.parent().removeClass(_classNone);
					else $item.parent().addClass(_classNone);

				});
				mm.instant(mm.dropdown.open, { args: [$ui.children('.mm_dropdown')] });

			});

			// 옵션초기화
			mm.observer.set($ui, PROD_OPTION_SELECT, function(__e, __datas) {

				if (__i > 0) $btnDropdown.attr({ 'disabled': true });
				$btnDropdown.find('.text_option').remove();

			});

		});

		// 선택한옵션 삭제
		$selected.on('click', '.btn_remove', function(__e) {

			var $li = $(this).closest('li');
			var _removeIndex = $li.index();

			mm.observer.update(PROD_OPTION_QTY, { datas: { element: null, _removeIndex: _removeIndex } });

		});

		// 선택한옵션 생성
		mm.observer.set($selected, PROD_OPTION_SELECT, function(__e, __datas) {

			$buy.removeClass('__buy-option');

			// 이미 있음
			if ($selected.find('li').is(function() {

				return $(this).find('.text_selected').text() == __datas.groups.join('/');

			})) {
				if ($('.__bom')[0]) return;
				else return mm.bom.alert('이미 선택된 옵션입니다.');
			}

			if (!$selected.find('.mm_scroller')[0]) $selected.addClass('mm_scroller');
			var $selectedList = ($selected.find('ul')[0]) ? $selected.find('ul') : $('<ul />').appendTo($selected);
			var $selectedItem = $(''
			+ '<li data-price="' + __datas._price + '" data-results="' + JSON.stringify(__datas.results).replace(/"/g, '\'') + '">'
				+ '<div class="m--option-selected-item">'
					+ '<p class="text_selected">' + __datas.groups.join('/') + '</p>'
					+ '<div class="mm_box-rside">'
						+ '<strong class="text_price">' + mm.numberComma(__datas._price) + '</strong>'
					+ '</div>'
					+ '<div class="mm_stepper" data-stepper="' + JSON.stringify({ _max: __datas._max }).replace(/"/g, '\'') + '">'
						+ '<div class="mm_form-text">'
							+ '<label>'
								+ '<input type="text" class="textfield product_cnt"><i class="bg_text"></i>'
								+ '<span class="text_placeholder mm_ir-blind">수량</span>'
							+ '</label>'
						+ '</div>'
						+ '<button type="button" class="btn_stepper-subtract"><i class="mco_stepper-subtract"></i><span class="mm_ir-blind">수량 빼기</span></button>'
						+ '<button type="button" class="btn_stepper-add"><i class="mco_stepper-add"></i><span class="mm_ir-blind">수량 더하기</span></button>'
					+ '</div>'
					+ '<button type="button" class="btn_remove"><i class="mco_trash"></i><span class="mm_ir-blind">선택 삭제</span></button>'
				+ '</div>'
			+ '</li>'
			+ '').prependTo($selectedList);

			$selectedItem.on('change', '.textfield', function() {

				var $this = $(this);
				mm.observer.update(PROD_OPTION_QTY, { datas: { element: $this } });

			});

			mm.preload.update();
			mm.form.update($selectedItem);

		});

		// 수량, 합계
		mm.observer.set($buy, PROD_OPTION_QTY, function(__e, __datas) {

			mm.instant(function() {

				var _totalPrice = 0;
				var _totalQty = 0;

				$selected.find('li').each(function(__i) {

					var $this = $(this);

					if (__datas.element && __i == __datas.element.closest('li').index()) mm.stepper.update($this.find('.textfield').val(__datas.element.val()));
					if (__datas._removeIndex != null && __i == __datas._removeIndex) {
						$this.off().remove();
						if ($selected.find('li').length == 0) $selected.removeClass('mm_scroller');
						return;
					}

					var _qty = parseFloat($this.find('.mm_stepper .textfield').val());
					var _price = parseFloat($this.data('price')) * _qty;
					_totalQty += _qty;
					_totalPrice += _price;

					$this.find('.text_price').text(mm.numberComma(_price));

				});

				$('.text_sumprice').text(mm.numberComma(_totalPrice));
				$('.text_sumqty').text(_totalQty);

			})

		});

		// 딜상품 옵션선택
		mm.observer.set($buy, PROD_FRAME_OPTION_SELECT, function(__e, __datas) {

			$('.btn_buy-open').trigger('click', true);

			// 옵션 창이 열리는 타이밍 이슈로 적용
			setTimeout(function() {

				$('[data-optid="' + __datas._id + '"]').trigger('click');

			}, 10);

		});

	})();
	///-- 옵션선택

	/// 탭메뉴
	(function() {

		var $tab = $('.m-prodetail-tab');
		var $tabmenu = $tab.find('.mm_tabmenu');
		var $header = $('.mm_header');

		var _classSticky = '__tab-sticky';

		function tabReposition() {

			var scrollTop = mm.getScroller().scrollTop();
			if (scrollTop >= mm.element.position($tab).top - $header.outerHeight() - $header.position().top) $tab.addClass(_classSticky);
			else $tab.removeClass(_classSticky);

		}

		// 스크롤
		mm.getScroller().on('load scroll', tabReposition);
		tabReposition();

		// 탭변경
		$tab.data('mm.tab').onChange = function() {

			mm.frameResize($tab.find('.mm_tab-item.__tab-on iframe'));
			tabReposition();

			if ($tab.hasClass(_classSticky)) mm.anchor($tab, { _time: 0, _margin: -$header.outerHeight() - $header.offset().top });

		};

	})();
	///-- 탭메뉴

});
