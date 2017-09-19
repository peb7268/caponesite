
(function($){
    $('document').ready(function($){ init() });
})(jQuery)


function init(){
    bootstrapSlider();
    bindEvents();
}

function bindEvents(){
    $('.nav li a').on('click', scrollToElem);
    $('.btt').on('click', scrollToTop);

    //only run this on desktop
    $(window).scroll(() => { 
        fixElemToContainer('.home-sidebar', '.testimonials'); 
    }).trigger('scroll');
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
        }, 300);
    }
}

function bootstrapSlider(){
    $('.folio').slick({
        infinite: true,
        slidesToShow: 4
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