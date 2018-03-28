console.log('working')

let hamburger = document.querySelector('.nav-items-right');
let dropDown = document.querySelector('.drop-down')

let open = false;

$('#hamburger').on('click', function(){
    $('.drop-down').slideToggle('1000')
})

