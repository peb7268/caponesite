
//Some Settings
var current         = -1;                           /* this is the index of the last clicked picture */
var totalpictures   = $('#content img').length;     /* number of pictures */
var speed 	        = 500;                          /* speed to animate the panel and the thumbs wrapper */
var delay           = 250;

function resize($image){
    var windowH      = $(window).height()-100;
    var windowW      = $(window).width()-80;
    var theImage     = new Image();
    theImage.src     = $image.attr("src");
    var imgwidth     = theImage.width;
    var imgheight    = theImage.height;

    if((imgwidth > windowW)||(imgheight > windowH)){
        if(imgwidth > imgheight){
            var newwidth = windowW;
            var ratio = imgwidth / windowW;
            var newheight = imgheight / ratio;
            theImage.height = newheight;
            theImage.width= newwidth;
            if(newheight>windowH){
                var newnewheight = windowH;
                var newratio = newheight/windowH;
                var newnewwidth =newwidth/newratio;
                theImage.width = newnewwidth;
                theImage.height= newnewheight;
            }
        }
        else{
            var newheight = windowH;
            var ratio = imgheight / windowH;
            var newwidth = imgwidth / ratio;
            theImage.height = newheight;
            theImage.width= newwidth;
            if(newwidth>windowW){
                var newnewwidth = windowW;
                var newratio = newwidth/windowW;
                var newnewheight =newheight/newratio;
                theImage.height = newnewheight;
                theImage.width= newnewwidth;
            }
        }
    }
    $image.css({'width':theImage.width+'px','height':theImage.height+'px'});
}

function toggleGallerySource(evt){
    var $this   = $(evt.target);
    
    /* shows the loading icon */
    $('#loading').show();

    var $theImage = $('<img/>');
    $theImage.attr('src', $this.attr('alt'));

    window.setTimeout(() => {
        loadResult($theImage, $this);
    }, delay)
}

function toggleGalleryState(evt){
    var $activeImg = $('#wrapper > img');
    if($activeImg.length > 0){
        $activeImg.addClass('dormant');
        window.setTimeout(()=>{
            $activeImg.remove();
        }, 300);
    }
    $('#thumbsWrapper, #panel, .infobar, .infobar .close').toggleClass('active');
    $('#description').empty();
    $('#prev, #next').hide();
    current = 0;
}

//Load's the result of clicking on the img thumb
function loadResult($theImage, $target){
   $('#loading').hide();
   if($('#wrapper').find('img').length) return;

   current = ($target.index() > -1) ? $target.index() : 0;

   resize($theImage);
   $('#wrapper').append($theImage);
   $theImage.fadeIn(250);
   
   $('#panel, .infobar, .infobar .close').addClass('active'); //activate the elements (slide up and fade in stuff)
   
    //Add the caption to the infobar
    var title = $target.attr('title');
    if(title != '') 
        $('#description').html(title).show();
    else 
        $('#description').empty().hide();
    
    //Nav Controls
    toggleNavControls(current, totalpictures);
    
    //slide the thumbs wrapper up
    $('#thumbsWrapper').addClass('dormant');
}

function toggleNavControls(current, totalpictures){
    if(current == 0) {
        hideBtn($('#prev'));
    } else {
        showBtn($('#prev'));
    }

    if(current === parseInt(totalpictures-1)){
        hideBtn($('#next'));
    } else {
        showBtn($('#next'));
    }
}

function callResize(){
    var $picture = $('#wrapper').find('img');
    if($picture.length > 0) resize($picture);
}

function navigateGallery($nextimage, dir, nextCurrent){
    if(dir=='left' && current==0) return;
    if(dir=='right' && current==parseInt(totalpictures-1)) return;

    $('#loading').show();
   
    var $img = $('<img/>');
    $img.on(transitionImage($img, $nextimage, dir));
    $img.attr('src', $nextimage.attr('alt'));

    current = nextCurrent;
}

function navigateNext(evt){
    var $this           = $(evt.target);
    var $nextimage 		= $('#content img').eq((current + 1));
    navigateGallery($nextimage,'right', (current + 1));
}

function navigatePrev(evt){
    var $this           = $(evt.target);
    var $previmage 		= $('#content img:nth-child('+parseInt(current)+')');
    navigateGallery($previmage,'left', (current - 1));
}

function transitionImage(evt, $nextimage, dir){
    var $theImage = $(evt);
    $('#loading').hide();
    $('#description').empty().fadeOut();
        
    $('#wrapper img').stop().fadeOut(500,function(){
        var $this = $(this);
        
        $this.remove();
        resize($theImage);
        
        $('#wrapper').append($theImage.show());
        $theImage.stop().fadeIn(800);

        var title = $nextimage.attr('title');
        if(title != ''){
            $('#description').html(title).show();
        }
        else
            $('#description').empty().hide();

        if(current==0)
            hideBtn($('#prev'));
        else
            showBtn($('#prev'));
        if(current==parseInt(totalpictures-1))
            hideBtn($('#next'));
        else
            showBtn($('#next'));
    });
    /*
    increase or decrease the current variable
        */
    if(dir=='right')
        ++current;
    else if(dir=='left')
        --current;
}

function hideBtn($btn){
    $btn
    .css("display", "flex")
    .hide();
}

function showBtn($btn){
    $btn
    .css({
        "visibility": "none",
        "display":"flex"
    })
    .show();
}

function bindGalleryEvents(){
    $(document).on('keyup', (evt)=> {
        if(evt.which !== 27) return;
        toggleGalleryState(evt);
    });

    $(window).on('resize', callResize);

    $('#content > img').on('click', function(evt){ toggleGallerySource(evt); });
    
    $('#content > img').hover(function () {
        var $this   = $(this);
        $this.stop().animate({'opacity':'1.0'},200);
    },function () {
        var $this   = $(this);
        $this.stop().animate({'opacity':'0.4'},200);
    });

    $('.close').on('click', toggleGalleryState);
    $('#next').on('click', function(evt){ navigateNext(evt) });
    $('#prev').on('click', function(evt){ navigatePrev(evt) });
}

function initGallery(){
    $('#content').css({
        'visibility': 'none',
        'display': 'flex'
    }).show();
    bindGalleryEvents();
}

//Kickoff
$(document).ready(function($){
    initGallery();
});