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
    console.log(c3[0].offsetTop)
        object = this
        left = []
        right = []
        found = false
        index = -1
        console.log(this.classList.toString())
        for (child in c3) {
            console.log(child)
            console.log(c3[child].classList.toString())
            if (this.classList.toString() === c3[child].classList.toString()) {
                found = true
                index = child
            }else if(!found){
                left.push(c3[child])
            }else{
                right.push(c3[child])
            }
            console.log(found)
        }



        anime({
            targets: this,
            translateX: -100 * index,
            width: '150%'
        })


        for (child in left) {
            if(child !== '0'){
                anime({
                    targets: left[child],
                    translateX: -100 * (left.length - child),
                    width: '50%'
                })
            }else{
                anime({
                    targets: left[child],
                    width: '50%'
                })
            }
        }
        for (child in right) {
            if(child !== right.length.toString()){
                anime({
                    targets: right[child],
                    translateX: 100 * (right.length - child),
                    width: '50%'
                })
            }else{
                anime({
                    targets: right[child],
                    width: '50%'
                })
            }
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
