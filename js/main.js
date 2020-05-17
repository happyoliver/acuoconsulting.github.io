var scroll_start = 0;
var startchange = $('#startchange');
var offset = startchange.offset();
var pastStartChange = false

$(document).ready(function(){
    scroll_start = 0;
    startchange = $('#startchange');
    offset = startchange.offset();
});

$(document).scroll(function() {
    scroll_start = $(this).scrollTop();
    console.log(scroll_start)
    console.log(offset.top)
    console.log(pastStartChange)
    if(scroll_start > offset.top && !pastStartChange) {
        anime({
            targets:'.navbar',
            backgroundColor: '#4d4d4d'
        });
        pastStartChange = true
    } else if(scroll_start < offset.top && pastStartChange){
        anime({
            targets:'.navbar',
            backgroundColor: 'rgba(0,0,0,0)'
        });
        pastStartChange = false
    }
});

// handle links with @href started with '#' only
$(document).on('click', 'a[href^="#"]', function(e) {
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $id.offset().top;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});