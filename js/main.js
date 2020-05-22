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

function getFormData(dom_query){
    var out = {};
    var s_data = $(dom_query).serializeArray();
    //transform into simple data/value object
    for(var i = 0; i<s_data.length; i++){
        var record = s_data[i];
        out[record.name] = record.value;
    }
    return out;
}

function validate_responses() {
    values = getFormData($('#registration_form'))
    console.log(values)
    invalid = []
    for (key in values) {
        console.log(values[key])
        if (!values[key] && key !== 'questions' && key !== 'resume') {
            $('#' + key).prev()[0].classList.add("warning-red");
            invalid.push(key)
        } else {
            $('#' + key).prev()[0].classList.remove("warning-red");
        }
    }
    if (!invalid.includes("email")) {
        $.ajax({
            type: "GET",
            url: "/valemail?email=" + values["email"],
            success: function (data) {
                $('#email').prev()[0].classList.add("warning-red");
                if (!data["format_valid"]) {
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        title: 'Invalid email format.',
                        showConfirmButton: false,
                        timer: 2000,
                        backdrop: false,
                        toast: true,
                        customClass: {
                            border: '5px solid black'
                        }
                    })
                } else if (!data["smtp_check"] || !data["mx_found"]) {
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        title: 'Email does not exist.',
                        showConfirmButton: false,
                        timer: 2000,
                        backdrop: false,
                        toast: true,
                        customClass: {
                            border: '5px solid black'
                        }
                    })
                } else {
                    $('#email').prev()[0].classList.remove("warning-red");
                }

            },
            contentType: "application/json; charset=utf-8"
        });
    }
    if (!invalid.includes("phone")) {
        $.ajax({
            type: "GET",
            url: "/valphone?phone=" + values["phone"],
            success: function (data) {
                $('#phone').prev()[0].classList.add("warning-red");
                if (!data["valid"]) {
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        title: 'Invalid phone number.',
                        showConfirmButton: false,
                        timer: 2000,
                        backdrop: false,
                        toast: true,
                        customClass: {
                            border: '5px solid black'
                        }
                    })
                } else {
                    $('#phone').prev()[0].classList.remove("warning-red");
                }

            },
            contentType: "application/json; charset=utf-8"
        });
    }
    if (values['resume']) {
        $('#resume').prev()[0].classList.add("warning-red");
        if (!validURL(values["resume"])) {
            Swal.fire({
                position: 'top',
                icon: 'error',
                title: 'Invalid URL for your resume.',
                showConfirmButton: false,
                timer: 2000,
                backdrop: false,
                toast: true,
                customClass: {
                    border: '5px solid black'
                }
            })
        } else {
            $('#resume').prev()[0].classList.remove("warning-red");
        }
    }

    return invalid.length === 0
}

function submit() {
    if (validate_responses()) {
        $.ajax({
            type: "POST",
            url: "/add",
            data: JSON.stringify($('#registration_form').serializeArray()),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: "Your response has been submitted successfully.",
                    html: '<span style="color: black">We\'ll get back to you in 1-3 business days.</span>',
                    footer: '<a href="/" style="color: dodgerblue">Go back to the home page</a>'
                })
            },
            error: function (xhr) {
                if(xhr.status === 422){
                    Swal.fire({
                    icon: 'error',
                    title: "One of your responses is invalid.",
                    html: '<span style="color: black">Double check your responses.</span>',
                    footer: '<a href="/" style="color: dodgerblue">Go back to the home page</a>'
                })
                }else{
                    Swal.fire({
                    icon: 'error',
                    title: "Something went wrong when submitting your response.",
                    html: '<span style="color: black">Try again in a few minutes, or email <a style="color: #00c49d" href="mailto:support@acuo.ca">support@acuo.ca</a>.</span>',
                    footer: '<a href="/" style="color: dodgerblue">Go back to the home page</a>'
                })
                }

            },
            contentType: "application/json; charset=utf-8"
        });
    }
}