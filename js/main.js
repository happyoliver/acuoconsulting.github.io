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