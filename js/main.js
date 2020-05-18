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
                opacity: 0,
                easing: 'easeInOutExpo'
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
                opacity: 1,
                easing: 'easeInOutExpo'
            })
        } catch (e) {

        }
    }
}

$('.qualifications').hover(
    async function () {
        $('.qualifications').off('mouseover')
        console.log("hover")
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
            // transparentChildren(c3[i])
        }

        const result = await anime({
            targets: c3,
            translateX: 0,
            width: '100%',
            duration: 500,
            easing: 'easeInOutExpo'
        }).finished

        object = this
        left = []
        right = []
        found = false
        index = -1
        for (child in c3) {
            if (this.classList.toString() === c3[child].classList.toString()) {
                found = true
                index = child
            } else if (!found) {
                left.push(c3[child])
            } else {
                right.push(c3[child])
            }
        }

        focuswidth = 2
        slimwidth = ((c3.length - focuswidth)/(c3.length - 1))
        regularWidth = this.offsetWidth
        if (index === '0') {
        anime({
            targets: this,
            width: (focuswidth * 100).toString() + '%',
            easing: 'easeInOutExpo'
        })
        } else if (index === (c3.length - 1).toString()) {
            anime({
                targets: this,
                translateX: -1 * regularWidth,
                width: (focuswidth * 100).toString() + '%',
                easing: 'easeInOutExpo'
            })
        } else {
            anime({
                targets: this,
                translateX: (1 - focuswidth) * regularWidth + slimwidth * regularWidth * index,
                width: (focuswidth * 100).toString() + '%',
                easing: 'easeInOutExpo'
            })
        }

        for (child in left) {
            if(child === '0'){
                anime({
                    targets: left[child],
                    width: (slimwidth * 100).toString() + '%',
                    easing: 'easeInOutExpo'
                })
            }else{
                await anime({
                    targets: left[child],
                    translateX: -(focuswidth - 1) * regularWidth + ((left.length - child) * slimwidth * regularWidth),
                    width: (slimwidth * 100).toString() + '%',
                    easing: 'easeInOutExpo'
                })
            }

        }
        for (child in right) {
            if(child === (right.length - 1).toString()){
                await anime({
                    targets: right[child],
                    translateX: (focuswidth - 1) * regularWidth - (slimwidth * regularWidth),
                    width: (slimwidth * 100).toString() + '%',
                    easing: 'easeInOutExpo'
                })
            }else{
                anime({
                    targets: right[child],
                    translateX: (focuswidth - 1) * regularWidth - ((child) * slimwidth * regularWidth),
                    width: (slimwidth * 100).toString() + '%',
                    easing: 'easeInOutExpo'
                })
            }
        }
        c4 = Array.from(this.childNodes[1].childNodes);
        console.log(c4)
        c4 = c4.filter(function (item) {
            return item.nodeName === "DIV"
        })
        await anime({
            targets: this,
            height: '150%'
        }).finished.then(function () {
            $('.qualifications').on('mouseover')
        })
        for(child in c4){
            if(c4[child].classList.contains("hidden")){
                c4[child].classList.remove("hidden")
                anime.set(c4[child],{
                    opacity: 0
                })
                anime({
                    targets: c4[child],
                    opacity: 1
                })
            }
        }


    },
    async function () {
        $('.qualifications').off('mouseout');
        console.log("unhover")

        c4 = Array.from(this.childNodes[1].childNodes);
        console.log(c4)
        c4 = c4.filter(function (item) {
            return item.nodeName === "DIV"
        })


        for(child in c4){
            if(c4[child].classList.contains("hide")){
                await anime({
                    targets: c4[child],
                    opacity: 0
                }).finished
                await c4[child].classList.add("hidden")
            }
        }


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

        await anime({
            targets: c3,
            translateX: 0,
            width: '100%'
        }).finished.then(function () {
            $('.qualifications').on('mouseout')
        })
    });

function flipchevron(id) {
    if(document.getElementById(id).innerText === '›'){
        document.getElementById(id).innerText = '⌄'
    }else{
        document.getElementById(id).innerText = '›'
    }
}