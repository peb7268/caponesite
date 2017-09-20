
(function($){
    $('document').ready(function($){ init() });
})(jQuery)


function init(){
    window.isMobile = false;
    bootstrapSlider();
    bindEvents();
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
    $(window).scroll(() => {
        //rearrangeHeader('.header-wrapper', $(window).scrollTop());
        fixElemToContainer('.home-sidebar', '.testimonials'); 
    }).trigger('scroll');
}

function toggleNav(evt){
    evt.preventDefault();
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
    var offset      = $(relativeToSel).offset().top - ($('.header-wrapper').outerHeight() - 80);   //account for fixed header
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
    $(this).parent().parent().find('li a.active').removeClass('active');
    $(this).addClass('active');

    var $elem = $(evt.target.getAttribute('href'));
    $(window).scrollTo($elem, 800, {
        onAfter: showBttBtn,
        offset: -145
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