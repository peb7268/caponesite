
(function($){
    $('document').ready(function($){ init() });
})(jQuery)


function init(){
    window.isMobile = false;
    bootstrapSlider();
    bindEvents();
    collapseLogo();
}

function bindEvents(){
    $(window).on('resize', toggleCapabilities);
    $('.nav li a').on('click', scrollToElem);
    $('.nav-toggle').on('click', toggleNav);
    $('.btt').on('click', scrollToTop);

    if(isMobile === false) bindScrollEvents();
    $(window).trigger('resize');
}

function bindScrollEvents(){
    if($('.home-sidebar').length == 0) return;
    $(window).scroll(() => {
        //rearrangeHeader('.header-wrapper', $(window).scrollTop());
        fixElemToContainer('.home-sidebar', '.testimonials'); 
    }).trigger('scroll');
}

function collapseLogo(){
    window.setTimeout(()=> {
        $('.logo h1 span').addClass('collapsed');
    }, 1500);
}

function toggleNav(evt){
    if(typeof evt !== 'undefined') evt.preventDefault();
    $('.nav').toggleClass('active');
}

function rearrangeHeader(sel, scrollTop){
    console.log(scrollTop);    
    if(scrollTop > 200) return $(sel).addClass('rearrange');
    $(sel).removeClass('rearrange');
}

function toggleCapabilities(evt){
    var outerWidth    = $(window).outerWidth();
    var touchDetected = (Modernizr.touchevents);
    var _isMobile     = (outerWidth < 960 || touchDetected);

    window.isMobile = (_isMobile) ? true : false;
    
    if(_isMobile){ activateMobile(); } else { deactivateMobile(); }
}

function activateMobile(){
    $(window).off('scroll');
    $('.home-sidebar').removeAttr('style');
    $('.header-wrapper').addClass('mobile');
}

function deactivateMobile(){
    $('.header-wrapper').removeClass('mobile');
    $(window).off('scroll');
    $('.home-sidebar').removeAttr('style');
    bindScrollEvents();
}

function fixElemToContainer(sel, relativeToSel){
    var $elem       = $(sel);
    var offset      = $(relativeToSel).offset().top - ($('.header-wrapper').outerHeight() - 40);   //account for fixed header
    var scrollPos   = $(window).scrollTop() - offset;
    var toTop       = $(window).scrollTop();
    
        
    if(toTop >= offset){ 
        window.setTimeout(() => {
            $elem.animate({
                'top': scrollPos
            }, 25); 
        }, 150);
    }
}

function bootstrapSlider(){
    if($('.folio').length === 0) return;

    $('.folio').slick({
        infinite: true,
        slidesToShow: 4,
        responsive: [
            {
              breakpoint: 960,
              settings: {
                slidesToShow: 3,
                infinite: true
              }
            },
            {
              breakpoint: 745,
              settings: {
                slidesToShow: 2
              }
            },
            {
                breakpoint: 450,
                settings: {
                  slidesToShow: 1
                }
              },
        ]
      });
}

function scrollToElem(evt){
    evt.preventDefault();
    if(evt.target.href.indexOf('gallery') > -1) {
        window.location.href = evt.target.getAttribute('href');
        return false;
    }

    toggleNav();
    $(this).parent().parent().find('li a.active').removeClass('active');
    $(this).addClass('active');
    var offset = -($('.header-wrapper').outerHeight());

    var $elem = $(evt.target.getAttribute('href'));
    $(window).scrollTo($elem, 800, {
        onAfter: showBttBtn,
        'offset': offset
    });
}

function scrollToTop(evt){
    evt.preventDefault();
    $('.nav li a.active').removeClass('active');
    
    $(window).scrollTo(0, 800, {
        onAfter: hideBttBtn
    });
}

function showBttBtn(target, settings){
    $('.btt').fadeIn(250);
}

function hideBttBtn(){
    $('.btt').fadeOut(250);
}