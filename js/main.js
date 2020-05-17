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

function transparentChildren(node) {
    children = node.childNodes
    for (var i = 0; i < children.length; i++) {
        try {
            anime({
                targets: node.childNodes[i],
                opacity: 0
            })
        } catch (e) {

        }
    }
}

function untransparentChildren(node) {
    children = node.childNodes

    for (var i = 0; i < children.length; i++) {
        try {
            anime({
                targets: node.childNodes[i],
                opacity: 1
            })
        } catch (e) {

        }
    }
}

$('.qualifications').hover(function () {
        c1 = this.parentNode.parentNode.childNodes
        c2 = []
        c3 = []

        for (child in c1) {
            try {
                if (c1[child].childNodes && c1[child].classList.contains("col")) {
                    c2.push(c1[child])
                }
            } catch (e) {

            }
        }
        for (child in c2) {
            try {
                if (c2[child].childNodes.length > 0) {
                    c3.push(c2[child].childNodes[1])
                }
            } catch (e) {

            }
        }

        for (var i = 0; i < c3.length; i++) {
            transparentChildren(c3[i])
        }

        object = this

        c3 = c3.filter(function (value, index, arr) {
            console.log(object.classList.toString())
            console.log(value.classList.toString())
            return object.classList.toString() !== value.classList.toString()
        })
        console.log(c3)
        anime({
            targets: this,
            width: '150%'
        })

        for (child in c3) {
            anime({
                targets: c3,
                translateX: 100,
                width: '50%'
            })
        }
    },
    function () {
        c1 = this.parentNode.parentNode.childNodes
        c2 = []
        c3 = []

        for (child in c1) {
            try {
                if (c1[child].childNodes && c1[child].classList.contains("col")) {
                    c2.push(c1[child])
                }
            } catch (e) {

            }
        }
        for (child in c2) {
            try {
                if (c2[child].childNodes.length > 0) {
                    c3.push(c2[child].childNodes[1])
                }
            } catch (e) {

            }
        }

        for (var i = 0; i < c3.length; i++) {
            untransparentChildren(c3[i])
        }

        anime({
            targets: c3,
            translateX: 0,
            width: '100%'
        })
    });
