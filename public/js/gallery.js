
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
        loadResult($theImage);
    }, delay)
}

function loadResult($theImage){
   $('#loading').hide();
   if($('#wrapper').find('img').length) return;

   current++;

   /*
   After it's loaded we hide the loading icon
   and resize the image, given the window size;
   then we append the image to the wrapper
   */
   resize($theImage);

   $('#wrapper').append($theImage);

   /* make its opacity animate */
   $theImage.fadeIn(800);
   
   /* and finally slide up the panel */
   $('#panel').animate({'height':'100%'},speed,function(){
       /*
       if the picture has a description,
       it's stored in the title attribute of the thumb;
       show it if it's not empty
           */
       var title = $theImage.attr('title');
       if(title != '') 
           $('#description').html(title).show();
       else 
           $('#description').empty().hide();
       
       /*
       if our picture is the first one,
       don't show the "previous button"
       for the slideshow navigation;
       if our picture is the last one,
       don't show the "next button"
       for the slideshow navigation
           */
       if(current == 0)
           $('#prev').hide();
       else
           $('#prev').fadeIn();
       if(current==parseInt(totalpictures-1))
           $('#next').hide();
       else
           $('#next').fadeIn();
       /*
       we set the z-index and height of the thumbs wrapper 
       to 0, because we want to slide it up afterwards,
       when the user clicks the large image
           */
       $('#thumbsWrapper').css({'z-index':'0','height':'0px'});
   });
}

function callResize(){
    var $picture = $('#wrapper').find('img');
    if($picture.length > 0) resize($picture);
}

function navigate($nextimage, dir, nextCurrent){
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
    navigate($nextimage,'right', (current + 1));
}

function navigatePrev(evt){
    var $this           = $(evt.target);
    var $previmage 		= $('#content img:nth-child('+parseInt(current)+')');
    navigate($previmage,'left', (current - 1));
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
            $('#prev').hide();
        else
            $('#prev').show();
        if(current==parseInt(totalpictures-1))
            $('#next').hide();
        else
            $('#next').show();
    });
    /*
    increase or decrease the current variable
        */
    if(dir=='right')
        ++current;
    else if(dir=='left')
        --current;
}

function toggleGalleryState(evt){
    var $this = $(evt.target);
    $('#description').empty().hide();
    
    $('#thumbsWrapper').css('z-index','10')
    .stop()
    .animate({'height':'100%'},speed,function(){
        var $theWrapper = $(this);
        $('#panel').css('height','0px');
        $theWrapper.css('z-index','0');
        /* 
        remove the large image element
        and the navigation buttons
         */
        $this.remove();
        $('#prev').hide();
        $('#next').hide();
    });
}

function bindGalleryEvents(){
    $(window).on('resize', callResize);

    $('#content > img').on('click', function(evt){ toggleGallerySource(evt); });
    
    $('#content > img').hover(function () {
        var $this   = $(this);
        $this.stop().animate({'opacity':'1.0'},200);
    },function () {
        var $this   = $(this);
        $this.stop().animate({'opacity':'0.4'},200);
    });

    $('#wrapper > img').on('click', function(evt){ toggleGalleryState(evt); });
    $('#next').on('click', function(evt){ navigateNext(evt) });
    $('#prev').on('click', function(evt){ navigatePrev(evt) });
}

function initGallery(){
    $('#content').show();
    bindGalleryEvents();
}

//Kickoff
$(document).ready(function($){
    initGallery();
});