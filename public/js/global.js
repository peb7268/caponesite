
(function($){
    $('document').ready(function($){ init() });
})(jQuery)


var testimonials = [
    {quote: 'We hired them to do a privacy fence, and they were very responsive and had it up within a week of booking the job.'},
    {quote: 'It was also a pleasure to work through Ovi who responded to all our calls, emails and worries.'},
    {quote: 'We contacted 4th Generation Construction as part of a 3 bid review process for a new fence, patio extension and pergola.'},
    {quote: 'Fantastic service and quality! Ovi is vey helpful and explains eveything. We had our roofdeck built which was a difficult job that his team finished up in a couple days. Very happy with it and highly reccommend using them.'}
]

function init(){
    window.isMobile = false;
    bootstrapSlider();
    bindEvents();
    collapseLogo();
    resumeNav();
    rotateTestimonials(testimonials);
}

function getRandomNumber(previousNumber, floor, ceil){
    if(previousNumber == null) return Math.floor(Math.random() * ceil);
    var randomIdx = Math.floor(Math.random() * ceil);

    if(randomIdx === previousNumber) {
        return getRandomNumber(previousNumber, floor, ceil);
    }
    
    return randomIdx;
}

function rotateTestimonials(testimonials){
    var $container = $('.testimonials .container');
    if($container.length == 0) return;

    var testimonialIdx = getRandomNumber(null, 0, testimonials.length);
    $container.html(testimonials[testimonialIdx].quote);

    window.setInterval(() => {
        changeTestimonial($container, testimonials, testimonialIdx)
    }, 5500);
}

function changeTestimonial($container, testimonials, testimonialIdx){
    $container.fadeOut(250, () => {
        $container.html('');
        var newTestimonialIdx = getRandomNumber(testimonialIdx, 0, testimonials.length);
        
        $container.html(testimonials[newTestimonialIdx].quote);
        $container.fadeIn(250);
     });
}

function bindEvents(){
    $(window).on('resize', toggleCapabilities);
    $('.nav li a, .cta-btn').on('click', function(evt){
        evt.preventDefault();
        navigate(evt);
    });
    $('.nav-toggle').on('click', toggleNav);
    $('.btt').on('click', scrollToTop);

    if(isMobile === false) bindScrollEvents();
    $(window).trigger('resize');
    $('form').on('submit', postFormData);
}

function postFormData(evt){
    evt.preventDefault();
    $.post('/contact', {
        data: {data: $(evt.target).serialize()}
    })
    .done(function(resp){
        $('form').fadeOut(250, function(evt){
            $(this).addClass('success').html('Your message has been submitted. We\'ll be in touch soon!');
            $(this).fadeIn(250);
        });
    })
    .fail(function(){
        $('form').fadeOut(250, function(evt){
            $(this).addClass('error').html('Oops there was an error, please submit your message to ovi@4gconline.com');
            $(this).fadeIn(250);
        });
    });
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
    }, 7000);
}

function toggleNav(evt){
    if(typeof evt !== 'undefined') evt.preventDefault();
    $('.nav').toggleClass('active');
}

function rearrangeHeader(sel, scrollTop){    
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

function navigate(evt){
    evt.preventDefault();
    if(window.location.href.indexOf('gallery') > -1) {
        var href = evt.target.getAttribute('href').split('#')[1];
        window.location.href = `${window.location.protocol}//${window.location.host}/?loc=${href}`;
    }
    scrollToElem(evt);
}

function resumeNav(){
    var anchors = ['about', 'services', 'contact']; 
    var params  = window.location.search.split('=');
    params.splice(0, 1);
    var target = params[0];

    if(anchors.includes(target)) {
        var evt = {};
        evt.preventDefault = function(){};
        evt.target = {'href': target};
        evt.target.getAttribute = function(){ return `#${this.href}`; }
        navigate(evt);
    }
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