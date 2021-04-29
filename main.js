/* RESPONSIVE MENU CLOSE (BLANK FUNCTION) */
function responsive_cat_menu(){}

/* DATA SCROLL DOWN */
function scrollToElement(element,offset,scrollIn,container) {
    var $offset = offset || 10;
    var $scrollIn, $scrollTop, $offsetFull, $container, $window, $element;
    if ( scrollIn === undefined ) {
        $element = $(element);
        $scrollIn = 'html,body';
        $offsetFull = $offset + getHeaderHeight();
        $scrollTop = $element.offset().top;
    } else {
        $offsetFull = 0;
        $scrollIn = $(scrollIn);
        $container = $(container);
        $window = $(window);
        $element = $(element);
        $scrollTop = $element.offset().top - $window.scrollTop() + $scrollIn.scrollTop() - (($window.height() - $container.height())/2);
    }
    $($scrollIn).animate({ scrollTop: $scrollTop - $offsetFull }, 'slow');
}

(function() {
    if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
        $('html').addClass('ie');
    }
})();

/* Business logic to handle hover behaviour on one product element */
function altPicHover() {
    var item = $(this);

    /* Get the main image */
    var mainPic = item.find(".js-main-img");
    var mainPicSrc = mainPic.attr("data-src-orig");
    var mainPicSrcSet = mainPic.attr("data-srcset-orig");
    if (mainPicSrcSet==undefined) mainPicSrcSet="";

    /* Get the alt image wrappers */
    var altPics = item.find(".js-alt-img-wrap");

    /* Business logic to handle swapping of the main img and one alt img */
    function handleSwap() {
        var $this = $(this);

        /* When hovering over the alt img swap it with the main img */
        $this.mouseover(function() {
            var currentAltPicSrc = $(this)
                .find("img")
                .attr("data-src-orig");
            mainPic.attr("src", currentAltPicSrc);

            var currentAltPicSrcSet = $(this)
                .find("img")
                .attr("data-srcset-orig");
            if (currentAltPicSrcSet==undefined) currentAltPicSrcSet="";
            mainPic.attr("srcset", currentAltPicSrcSet);
        });
    }

    item.find('.js-alt-images').mouseleave(function() {
        mainPic.attr("src", mainPicSrc);
        mainPic.attr("srcset", mainPicSrcSet);
    });

    /* Call the handleSwap fn on all alt imgs */
    altPics.each(handleSwap);
}

function altPicChangeOnClick(){
    var $thisThumb = $(this); /*this alt img*/
    $thisThumb.on('click', function() {
        var $mainImg = $thisThumb.closest('.js-mobile-img-wrap').find('.js-mobile-main-img');
        var $mainImgSrc = $mainImg.attr('src');                         /* main img src-je */
        var $mainImgSrcSet = $mainImg.attr('srcset');                   /* main img retina src-je */
        var $mainImgSrcOrig = $mainImg.attr('data-src-orig');           /* main img thumbnail src-je */
        var $mainImgSrcSetOrig = $mainImg.attr('data-srcset-orig');     /* main img thumbnail retina src-je */

        if ($mainImgSrcSet == undefined) $mainImgSrcSet = $mainImgSrc;
        if ($mainImgSrcSetOrig == undefined) $mainImgSrcSetOrig = $mainImgSrcOrig;
        var $thisThumbSrc = $thisThumb.attr('src');                     /* akt thumbnail img src-je */
        var $thisThumbRetinaSrc = $thisThumb.attr('srcset');            /* akt thumbnail img retina src-je */
        var $thisOrigSrc = $thisThumb.attr('data-src-orig');            /* akt thumbnail img orig méretű src-je */
        var $thisOrigRetinaSrc = $thisThumb.attr('data-srcset-orig');   /* akt thumbnail img orig méretű retina src-je */

        if ($thisOrigRetinaSrc == undefined) $thisOrigRetinaSrc = $thisOrigSrc;
        if ($thisThumbRetinaSrc == undefined) $thisThumbRetinaSrc = $thisThumbSrc;
        /* Fő kép attribútumainak cseréje az aktuálisan rákattintott thumbnail attribútumaival */
        $mainImg.attr({'src': $thisOrigSrc, 'srcset': $thisOrigRetinaSrc, 'data-src-orig': $thisThumbSrc, 'data-srcset-orig': $thisThumbRetinaSrc});
        /* Az aktuálisan rákattintott thumbnail attribútumaihoz beírjuk a fő kép attribútumait */
        $thisThumb.attr({'src': $mainImgSrcOrig, 'srcset': $mainImgSrcSetOrig, 'data-src-orig': $mainImgSrc, 'data-srcset-orig': $mainImgSrcSet});
    });
    $thisThumb.addClass('is-processed');
}
/* CHECK SEARCH INPUT CONTENT  */
function checkForInput(element) {
    var tmpval = $(element).val();
    $(element).toggleClass('not-empty', tmpval.length >= 1);
    $(element).toggleClass('search-enable', tmpval.length >= 3);
}

function checkLogged(profile_btn_id) {
    if ($('#container').hasClass('logged-in')) {
        location.href = $('#' + profile_btn_id).data('orders');
    } else {
        location.href = $('#' + profile_btn_id).data('login');
    }
}

function getHeaderHeight() {
    return $('.js-header').height();
}
function getScrollTop() {
    return $(window).scrollTop();
}
function getWindowWidth() {
    return $(window).width();
}
function getMenuWidth(){
    /* 976px a maximális mérete a menünek (scrollbar megjelenés miatt kellett, hogy ne villogjon) */
    if ($('.header-menus').width() > 976){
        return 976;
    }else{
        return $('.header-menus').width();
    }
}

function orderModsChangeShipping(money_type){
    if ($('#page_order_mods_shipping .order-mods__item input[type=radio]:checked').length>0) {
        var $this = $('#page_order_mods_shipping .order-mods__item input[type=radio]:checked');
        var $shipping_mod_id = $this.prop('id').substr(9,$this.prop('id').length-6);
        var $selector = '#page_order_mods_shipping #szall_mod_'+$shipping_mod_id+'.order-mods__item .order-mods__shipping-cost';
        var $selector2 = '#page_order_mods_shipping #szall_mod_'+$shipping_mod_id+'.order-mods__item .order-mods__shipping-cost-hidden';

        var $total = parseFloat($('.order-mods__total_price_hidden').text());
        var $shipping_cost = parseFloat($($selector2).text());
        var $total_price_output = number_format(($total+$shipping_cost).toFixed(money_len),money_len,money_dec,money_thousend);

        if(price_decimal_sup===1) {
            if($total_price_output.indexOf(".") >= 0) $total_price_output = $total_price_output.replace('.','<sup>')+"</sup>";
            if($total_price_output.indexOf(",") >= 0) $total_price_output = $total_price_output.replace(',','<sup>')+"</sup>";
        }

        $('.js-total-price').html($total_price_output+" "+money_type);
        $('.js-shipping-cost').html($($selector).html());
    } else {
        $('.js-total-price').html(number_format((parseFloat($('.order-mods__total_price_hidden').text())).toFixed(money_len),money_len,money_dec,money_thousend)+" "+money_type);
        $('.js-shipping-cost').html("-");
    }
}

function productListOpenFilter($elem){
    $($elem).toggleClass('is-active');
    $('.product-list__filter-content').slideToggle(500);
}

function visibilityCheck(){
    (function($) {
        $.fn.visible = function(partial) {
            var $t            = $(this),
                $w            = $(window),
                viewTop       = $w.scrollTop(),
                viewBottom    = viewTop + $w.height(),
                _top          = $t.offset().top,
                _bottom       = _top + $t.height(),
                compareTop    = partial === true ? _bottom : _top,
                compareBottom = partial === true ? _top : _bottom;
            return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
        };
    })(jQuery);

    var win = $(window);
    var selector = $(".js-animate-title-dots");

    win.scroll(function() {
        selector.each(function(i, elem) {
            elem = $(elem);
            if (elem.visible(true)) {
                elem.addClass("loaded");
            }
            else{
                elem.removeClass("loaded");
            }
        });
    });
    selector.each(function(i, elem) {
        elem = $(elem);
        if (elem.visible(true)) {
            elem.addClass("loaded");
        }
        else{
            elem.removeClass("loaded");
        }
    });
}
var $headerHeight = getHeaderHeight();
var $position = getScrollTop();

$(document).ready(function() {
    $headerHeight = getHeaderHeight();
    $position = getScrollTop();
    var $header = $('.js-header');
    var $content = $('.js-content');
    var $navbar = $('.js-details-navbar');
    var $marginTop = 0;

    $header.addClass('is-fixed');
    $navbar.addClass('with-header');
    if($(window).width() < 1199 && $('.total-box.js-total-box-sticky').length>0){
        $marginTop = $headerHeight + $('.js-total-box-sticky').height();
    }else{
        $marginTop = $headerHeight;
    }

    $content.css('margin-top',$marginTop);

    $(window).on('resize',function(){
        $headerHeight = getHeaderHeight();
        if ($header.is('.is-fixed.is-visible')) {
            if($(window).width() < 1199 && $('.total-box.js-total-box-sticky').length>0){
                $('.total-box.js-total-box-sticky').css('top',$headerHeight+'px');
                $marginTop = $headerHeight + $('.js-total-box-sticky').height();
            }else{
                $marginTop = $headerHeight;
            }
        }else{
            if($(window).width() < 1199 && $('.total-box.js-total-box-sticky').length>0){
                $('.total-box.js-total-box-sticky').css('top','0px');
                $marginTop = $headerHeight + $('.js-total-box-sticky').height();
            }else{
                $marginTop = $headerHeight;
            }
        }
        $content.css('margin-top',$marginTop);
    });

    var didScroll;
    var lastScrollTop = 0;
    var delta = 1;

    $(window).scroll(function(){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        if (getWindowWidth() > 992) $('.dropdown--btn').removeClass('is-active');
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > $headerHeight){
            // Scroll Down
            if(!$('body').hasClass('megamenu-opened') && $('.js-dropdown--btn.is-active').length < 1) {
                $header.removeClass('is-visible').addClass('is-hidden');
                if ($('.artdet--type-1').length > 0) {
                    $navbar.removeClass('with-header');
                    fixingNavbar();
                }
                if ($('.total-box.js-total-box-sticky').length > 0) {
                    $('.total-box.js-total-box-sticky').css('top', '0px');
                }
            }
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $header.addClass('is-visible').removeClass('is-hidden');

                if($('.artdet--type-1').length>0) {
                    $navbar.addClass('with-header');
                    fixingNavbar();
                }
                if($('.total-box.js-total-box-sticky').length>0){
                    $('.total-box.js-total-box-sticky').css('top',$headerHeight+'px');
                }

            }
        }
        lastScrollTop = st;
    }

    if ($('.js-side-box').children().length == 0 ) {
        $content.addClass('no-aside');
    }

    /* MONEY AND LANG */
    if($(".currency__content").html()!="") {
        $('.js-lang-and-cur').addClass('has-currency');
    }

    if($(".lang__content").html()!="") {
        $('.js-lang-and-cur').addClass('has-lang');
    }

    /* COMPARE POPUP OPENED */
    $(document).on('popupOpen', function(event, array){
        if (array['popupId'] === 'compare') {
            setTimeout(
                function() {
                    $('table.compare_list_table tbody').width($('.shop_popup_compare').width());
                }, 400
            );
        }
    });

    /* BACk TO TOP */
    var offset = 220;
    var duration = 500;
    $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
            $('.back_to_top').fadeIn(duration);
        } else {
            $('.back_to_top').fadeOut(duration);
        }
    });
    $('.back_to_top').click(function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, duration);
        return false;
    });

    /* FILTER TITLE CLOSE */
    $('#reload1_box_filter_content .product_filter_title').addClass('filter_opened');
    $('#box_filter_content .product_filter_title:first-child').addClass('filter_opened');
    $('.product_filter_title').click(
        function () {
            if(getWindowWidth()<576){
                $(this).toggleClass('filter_opened');
                $(this).next('.product_filter_content').stop().slideToggle(400);
            }
        }
    );

    /* add class to .js-content element, if it has not any children */
    /* when .js-content class added: */
    /* - make main element to full width */
    /* - make product elements wider */

    /*Check the user agent string*/
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('html').addClass('prel-touch-device');
    }
    /* IS TOUCH DEVICE */
    $(document).on('touchstart', function() {
        $('html').removeClass('prel-touch-device').addClass('touch-device');
    });
    /* DROPDOWN BUTTONS */
    $('.js-dropdown-container').on('click', '.js-dropdown--btn', function(e) {
        var $thisBtn = $(this);

        if ($thisBtn.next('.js-dropdown--content').length > 0 ) {
            if ($thisBtn.hasClass('is-active')) {
                if (!$thisBtn.hasClass('click-close-forbidden')) {
                    $('body').removeClass('overflow-hidden-up-lg');
                    $thisBtn.removeClass('is-active');
                }
            } else {
                $('.js-dropdown--btn').removeClass('is-active');
                if(getWindowWidth() < 992){
                    $('body').addClass('overflow-hidden-up-lg');
                }
                $thisBtn.addClass('is-active');
                if ($thisBtn.hasClass('search__btn')) {
                    $('#box_search_input').focus();
                }
            }
        }
        e.stopPropagation();
    });

    $(".js-header").on("click",".js-dropdown--btn-close, .responsive_menu_close", function(e){
        var $this = $(this);
        var $closestBtn = $this.closest('.js-dropdown-container').find('.js-dropdown--btn');

        if ($closestBtn.hasClass('is-active')) {
            $closestBtn.removeClass('is-active');
        }
        $('body').removeClass('overflow-hidden-up-lg');
        e.stopPropagation();

    });

    /* CHECK SEARCH INPUT CONTENT  */
    $('#box_search_inputs').on('blur change keyup', function() {
        checkForInput(this);
    });

    /* REMOVE is-active CLASS FROM DROPDOWN WHEN CLICKED OUTSIDE */
    $(document).click(function(e) {
        if ($('.js-dropdown--btn').hasClass('is-active') && !$('.js-dropdown--btn').hasClass('click-close-forbidden')) {
            if (!$(e.target).closest('.js-dropdown--btn').length && !$(e.target).closest('.js-dropdown--content').length) {
                $('.js-dropdown--btn, .js-dropdown--content').removeClass('is-active');
                $('body').removeClass('overflow-hidden-up-lg');
            }
        }
        if ($('.js-filter-btn').hasClass('is-active') && !$(e.target).closest('.js-filter-box').length && !$(e.target).closest('.filter--top').length){
            $('.js-filter-btn').toggleClass('is-active');
            $('.product-list__filter-content').slideToggle(500);
        }
    });

    /* DATA SCROLL DOWN */
    $('.js-scroll-down').click(function() {
        var $this = $(this);
        var $offset = 10;

        $('html,body').animate({
                scrollTop: $('.' + $this.attr('data-scroll')).offset().top - $offset - $headerHeight},
            'slow');
    });

    /* CAT BOX */
    $('.header-menus > .cat-menu.has-child').hoverIntent({
        over: function () {
            if($(this).parents('.header-menus').length) {
                $(this).addClass('open');
                $('body').addClass('megamenu-opened');
            }
        },
        out: function () {
            $( this ).removeClass('open');
            $('body').removeClass('megamenu-opened');
        },
        interval: 100,
        sensitivity: 10,
        timeout: 0
    });
    /* PLUS MENU */
    $(".header-menus > .plus-menu.has-child").hoverIntent({
        over: function () {
            if($(this).parents('.header-menus').length) {
                $(this).addClass('open');
                $('body').addClass('megamenu-opened');
            }
        },
        out: function () {
            $( '.plus-menu.has-child' ).removeClass('open');
            $('body').removeClass('megamenu-opened');
        },
        interval: 100,
        sensitivity: 10,
        timeout: 0
    });
    $(".header-menus > .plus-menu.has-child .plus-menu.has-child").hoverIntent({
        over: function () {
            $(this).addClass('open');
        },
        out: function () {
        },
        interval: 100,
        sensitivity: 10,
        timeout: 0
    });
});
$(document).ready(function(){
    visibilityCheck();
});
$(document).bind('ajaxStop ajaxComplete', function(){
    visibilityCheck();
});

/*** MAINMENU SIZING ***/
function mainmenu_elements_gets_size(){
    $('.header-menus > *').each(function(i){
        var thisMenu = $(this);
        thisMenu.data('width',thisMenu.width());
    });
}
function mainmenu_sizing(isDocready){
    var $sumwidth = 0;
    var $this = '';
    var $filled = false;

    $('.header-menus > *, .header-menus-more__container > *').each(function(){
        $sumwidth += $(this).data('width');
    });

    if($sumwidth > $menuWidth-40){
        var $actual_width = $('.header-menus-more').addClass('is-visible').width();
        $('.header-menus > *').each(function(){
            $this = $(this);
            if($filled === false){
                if($menuWidth >= ($actual_width+$this.data('width'))){
                    $actual_width += $this.data('width');
                }else{
                    $filled = true;
                    if(isDocready){
                        $('.header-menus-more__container').append($this);
                    }else{
                        $('.header-menus-more__container').prepend($this);
                    }
                }
            }else{
                if(isDocready){
                    $('.header-menus-more__container').append($this);
                }else{
                    $('.header-menus-more__container').prepend($this);
                }
            }
        });
        if($filled === false){
            $('.header-menus-more__container > *').each(function(){
                $this = $(this);
                if($filled === false){
                    if($menuWidth >= ($actual_width+$this.data('width'))){
                        $actual_width += $this.data('width');
                        $('.header-menus').append($this);
                    }else{
                        $filled = true;
                    }
                }
            });
        }
    }else{
        $('.header-menus-more__container > *').each(function(){
            $('.header-menus').append($(this));
        });
        $('.header-menus-more').removeClass('is-visible');
    }
    $('.header-bottom__right-side').addClass('is-calculated');
}
var $menuWidth = 0;
$(document).ready(function(){
    $menuWidth = getMenuWidth();
    mainmenu_elements_gets_size();
    mainmenu_sizing(true);

    $(window).on('resize', function(){
        if($menuWidth != getMenuWidth()){
            $menuWidth = getMenuWidth();
            mainmenu_sizing();
        }
    });
});

/*** FILTER BADGES ***/
$(document).ready(function(){
    checkSelectedFilters();
});
$(document).on('filterProductlistRefreshing', function(){
    checkSelectedFilters();
});
function checkSelectedFilters(){
    addParameterToSelecteds();
    $('.js-remove-slider-filter').bind('click', function(){
        $(this).remove();
        resetSliderFilter($('#param_'+$(this).data('id')+'_group .ui-slider'));
    });
}
function addParameterToSelecteds(){
    var title = "";
    var dataId = "";
    $('.js-selected-filters').empty();
    $('.js-product-list__filter-content .product_filter_group_checked').each(function(){
        var $this = $(this);
        if($this.hasClass('filter-type--checkbox')){
            $('.product_filter_checked label, .product_filter_icon_checked label', $this).each(function(){
                $(this).clone().appendTo('.js-selected-filters');
            });
        }else{
            title = $('.product_filter_title', $this);
            dataId = $this.attr('data-id');
            $('.js-selected-filters').append('<label class="js-remove-slider-filter product_filter_link mb-0" data-id="'+dataId+'">'+title.clone().children().remove().end().text().trim()+'</label>');
        }
    });
}
function resetSliderFilter(obj){
    var min = obj.slider("option", "min");
    var max = obj.slider("option", "max");
    obj.parent().find('.akt_min').val(min);
    obj.parent().find('.akt_max').val(max);
    obj.slider("values", [min, max]);

    var text_before = obj.parent().find('.text_before').val();
    var text_after = obj.parent().find('.text_after').val();
    text = text_before+String(min).replace(".",money_dec)+text_after+" - "+text_before+String(max).replace(".",money_dec)+text_after;
    obj.parent().find('.product_filter_num_text').html(text);
    obj.parents(".product_filter_content").removeClass("product_filter_content_checked");
    obj.parents(".product_filter_group").removeClass("product_filter_group_checked");

    var prefix = $('.js-filter-box').data('prefix');
    filter_activate_delay(prefix);
}

/*** PRODUCT VARIANT CHANGE AND ERROR HANDLING ***/
function changeVariant(el) {
    var $thisSelect = $(el);
    var $thisSelectWrap = $thisSelect.closest('.js-variant-wrap');

    if (!$thisSelect.hasClass('is-selected')) {
        $thisSelect.addClass('is-selected');
        $thisSelectWrap.removeClass('has-fault');
    }
    checkVariants(el, true)
}
var $faultInVariants;
function checkVariants(el, onlyCheck) {
    $faultInVariants = false;
    var $thisProduct = $(el).closest('.js-product');
    var $variantSelectWraps = $('.js-variant-wrap', $thisProduct);

    $variantSelectWraps.each( function() {
        var selectWrap = $(this);
        var selectItem = $(selectWrap).find('select');

        if (!selectItem.hasClass('is-selected')) {
            if (!onlyCheck) selectWrap.addClass('has-fault');
            $faultInVariants = true;
        } else {
            if (!onlyCheck) selectWrap.removeClass('has-fault');
        }
    });
    if (!$faultInVariants) {
        $thisProduct.removeClass('has-unselected-variant');
        $thisProduct.addClass('all-variant-selected');
    } else {
        $thisProduct.addClass('has-unselected-variant');
        $thisProduct.removeClass('all-variant-selected');
    }
}
function inputsErrorHandling(isTooltip) {
    /*check error in spec params inputs*/
    var faultInInputs = check_cust_input();
    /*check error in variant inputs*/
    var faultInVariant = $faultInVariants;
    /* IS not select onchange fn call (it runs only when clicked on btn), is a text input param, is artdet */

    if (faultInInputs === 1 || faultInVariant === true) {
        if (faultInVariant === true) {
            if ( isTooltip !== 1 ) {
                overlay_load("warning",lang_text_warning,lang_text_required_fields_missing);
                scrollToElement('.product-variants',0);
            } else {
                scrollToElement('.product-tooltip__variants',0,'.product-tooltip__datas','#page_PopupContainer_tooltip_inner');
            }
        } else {
            if ( isTooltip !== 1 ) {
                overlay_load("warning",lang_text_warning,lang_text_required_fields_missing);
                scrollToElement('.artdet__spec-params',0);
            } else {
                scrollToElement('.product-tooltip__spec-params',0,'.product-tooltip__datas','#page_PopupContainer_tooltip_inner');
            }
        }
    }else{
        var cartadd = $('.js-main-product-cart-btn').data("cartadd");
        eval(cartadd);
    }
}
function closeVariantsOverlay(el) {
    var $thisCloseBtn = $(el);
    $thisCloseBtn.closest('.js-product').find('.js-variants').slideUp('slow', function() {
        $thisCloseBtn.closest('.js-product').removeClass('is-variants-opened');
    });
}

function openVariantsOverlay(el) {
    var $thisOpenBtn = $(el);
    if($thisOpenBtn.closest('.js-product').is('.all-variant-selected.is-variants-opened') || $thisOpenBtn.closest('.js-product').is('.all-variant-selected.artlist-col--2') ){
        var cartadd = $thisOpenBtn.data("cartadd");
        eval(cartadd);
        return;
    }
    if(!$thisOpenBtn.closest('.js-product').hasClass('is-variants-opened') && !$thisOpenBtn.closest('.js-product').hasClass('artlist-col--2')){
        $thisOpenBtn.closest('.js-product').find('.js-variants').slideDown('slow', function(){
            $thisOpenBtn.closest('.js-product').addClass('is-variants-opened');
        });
    }else{
        checkVariants(el);
    }
}
$(window).bind("pageshow", function() {
    $('.js-variant-wrap').each(function () {
        $('select option', this).each(function () {
            if (this.defaultSelected) {
                this.selected = true;
                return false;
            }
        });
    });
    $('.cust_input_select').each(function () {
        $('option', this).each(function () {
            if (this.defaultSelected) {
                this.selected = true;
                return false;
            }
        });
    });
    $('.cust_input_file, .cust_input_text').each(function () {
        var $this = $(this);
        if (!$this.hasClass('param_cust_input_save')) {
            $this.val("");
        }
        if ($this.hasClass('cust_input_file')) {
            $this.siblings(".file-name").html($this.siblings(".file-name").attr('data-empty'));
        }
    });

});

/**** FILE INPUT CUSTOMIZATION ****/
function file_input_filname_change(el){
    var fileName = $(el).val().split("\\").pop();
    $("#"+$(el).attr("id")+"-filename").val(fileName);
}

/**** ORDER MODS TERMS ONCHANGE ****/
function order_mods_terms_change(el){
    $this = $(el);
    if($this.is(':checked')){
        $this.closest('.js-terms-validation').removeClass('has-fault');
    }else{
        $this.closest('.js-terms-validation').addClass('has-fault');
    }
}

/*** ORDER MODS DELIVERY POINTS ONCHANGE ***/
$(document).on('deliveryPointSelected', function() {
    temp_id = document.form_order.szall_id.value;
    $("#szall_mod_" + temp_id + " .js-delivery-point-validation .order-mods__delivery-point-selects").removeClass('has-fault');
});

/*** FLOATING LABELS FOR IE AND EDGE ***/
$(document).ready(function(){
    $('.form-label-group .form-control').each(function(){
        if ($(this).val()!="") {
            $(this).addClass('placeholder-hide');
        } else {
            $(this).removeClass('placeholder-hide');
        }
    });
    $(document).on('change', '.form-label-group .form-control', function () {
        if ($(this).val()!="") {
            $(this).addClass('placeholder-hide');
        } else {
            $(this).removeClass('placeholder-hide');
        }
    });
});

/*** STICKY SUM BOX (cart, order_mods, order_control) ***/
function isTheItemVisible(item) {
    var $item = $(item);
    var itemHeight = $item.height();
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var itemTop = $item.offset().top;
    var itemBottom = itemTop + itemHeight;
    return ((itemBottom <= docViewBottom + itemHeight) && (itemTop + itemHeight >= docViewTop));
}
function setStickyPosition(addClassTo) {
    if (!isTheItemVisible($itemVisibilityCheck)) {
        if (!$(addClassTo).hasClass('has-fixed')) {
            $(addClassTo).addClass('has-fixed');
            $(addClassTo).find('.js-total-box-sticky').css('top',$headerHeight+'px');
        }
    } else {
        if ($(addClassTo).hasClass('has-fixed')) {
            $(addClassTo).removeClass('has-fixed');
            $(addClassTo).find('.js-total-box-sticky').css('top','0px');
        }
    }
}

/*** PRODUCT DETAILS SALE COUNTDOWN ***/
function startSaleCountdown($saleStart,$saleEnd,$textDay,$textHour,$textMin,$textSec,$animation){
    var countDownDate = new Date($saleEnd).getTime();
    var countStartDate = new Date($saleStart);
    var daysdiff = Math.floor((countDownDate - countStartDate) / (1000 * 60 * 60 * 24));

    setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hours = (hours < 10? "0": "") + hours;
        minutes = (minutes < 10? "0": "") + minutes;
        seconds = (seconds < 10? "0": "") + seconds;

        document.getElementById("cd_custom").innerHTML = "<div class='cd_day'><div class='cd_wrap d-flex flex-column align-items-center justify-content-center'><span class='text-cn font-weight-bold'>" + days + "</span><span class='cd_txt'>" + $textDay + "</span></div><div class='cd-layer'><div class='cd-inner-layer'></div></div></div><div class='cd_hour'><div class='cd_wrap d-flex flex-column align-items-center justify-content-center'><span class='text-cn font-weight-bold'>" + hours + "</span><span class='cd_txt'>" + $textHour + "</span></div><div class='cd-layer'><div class='cd-inner-layer'></div></div></div><div class='cd_min'><div class='cd_wrap d-flex flex-column align-items-center justify-content-center'><span class='text-cn font-weight-bold'>" + minutes + "</span><span class='cd_txt'>"+ $textMin +"</span></div><div class='cd-layer'><div class='cd-inner-layer'></div></div></div><div class='cd_sec'><div class='cd_wrap d-flex flex-column align-items-center justify-content-center'><span class='text-cn font-weight-bold'>" + seconds + "</span><span class='cd_txt'>" + $textSec + "</span></div><div class='cd-layer'><div class='cd-inner-layer'></div></div></div>";

        if($animation) {
            var dayB = $('.cd_day .cd-layer');
            var hourB = $('.cd_hour .cd-layer');
            var minB = $('.cd_min .cd-layer');
            var secB = $('.cd_sec .cd-layer');

            if (seconds > 59) seconds = 0;
            var degSec = 360 * (seconds / 60);
            secB.css('transform', 'rotate(' + degSec + 'deg)');

            if (minutes > 59) minutes = 0;
            var degMin = 360 * (minutes / 60);
            minB.css('transform', 'rotate(' + degMin + 'deg)');

            if (hours > 23) hours = 0;
            var degHr = 360 * (hours / 24);
            hourB.css('transform', 'rotate(' + degHr + 'deg)');

            var degDay = 360 * (days / daysdiff);
            dayB.css('transform', 'rotate(' + degDay + 'deg)');
        }
    }, 1000);
}

/*** CUSTOM CONTENT/SHORT DESCRIPTION OPENER ***/
function readMoreOpener(){
    var $container = $(this);
    var $content = $('.read-more-content',this);
    var $button = $('+ .read-more-btn', $container);
    var short_height = $content.height();
    var max_height = 220;
    if ($container.data('max-height')!="" && $container.data('max-height') != undefined) {
        max_height = $container.data('max-height');
    }
    if (short_height > max_height) {
        $button.addClass('is-visible');
        $container.css('max-height',max_height+'px');
    }
    $button.on('click', function() {
        if ($container.hasClass('is-opened')) {
            $container.css('max-height',$content.height()+'px');
            setTimeout(function(){
                $container.css('max-height',max_height+'px').removeClass('is-opened');
                $button.removeClass('is-active');
            }, 100);
        }
        else {
            $container.css('max-height',$content.height()+'px').addClass('is-opened');
            setTimeout(function(){$container.css('max-height','unset') }, 700);
            $button.addClass('is-active');
        }
    });
    $(this).addClass('is-processed');
}