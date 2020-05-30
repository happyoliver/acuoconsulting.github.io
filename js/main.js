var scroll_start = 0;
var startchange = $('#startchange');
var offset = startchange.offset();
var pastStartChange = false

$(document).ready(function () {
    scroll_start = 0;
    startchange = $('#startchange');
    offset = startchange.offset();
});


$(document).scroll(function () {
    scroll_start = $(this).scrollTop();
    if (scroll_start > offset.top && !pastStartChange) {
        anime({
            targets: '.navbar',
            backgroundColor: '#4d4d4d'
        });
        pastStartChange = true
    } else if (scroll_start < offset.top && pastStartChange) {
        anime({
            targets: '.navbar',
            backgroundColor: 'rgba(0,0,0,0)'
        });
        pastStartChange = false
    }
});


function flipchevron(id) {
    if (document.getElementById(id).innerText === '›') {
        document.getElementById(id).innerText = '⌄'
    } else {
        document.getElementById(id).innerText = '›'
    }
}

function flipchevronClass(cssClass) {
    chevronList = document.getElementsByClassName(cssClass)

    if (chevronList[0].innerText === '›') {
        for(chevron in chevronList){
            chevronList[chevron].innerText = '⌄'
        }
    } else {
        for(chevron in chevronList){
            chevronList[chevron].innerText = '›'
        }
    }
}

var lastScrollTop = 0;
$(window).scroll(function () {
    var st = $(this).scrollTop();
    var banner = $('.navbar');
    setTimeout(function () {
        if (st > lastScrollTop) {
            banner.addClass('hide');
        } else {
            banner.removeClass('hide');
        }
        lastScrollTop = st;
    }, 100);
});