// function myFunction() {
//   const mobileNav = document.querySelector('.mobile-nav .links')
//   if (mobileNav.style.display === 'block') {
//     mobileNav.style.display = 'none'
//   } else {
//     mobileNav.style.display = 'block'
//     mobileNav.style.width = '100%'
//   }

// }

// const mobileNav = document.getElementsByClassName('menu-icon-con')[0]
// mobileNav.addEventListener("click", myFunction)

// const images = ['jess-bailey-q10VITrVYUM-unsplash.jpg', 'luca-bravo-9l_326FISzk-unsplash.jpg', , 'scott-graham-5fNmWej4tAA-unsplash.jpg']
// let i = 1;
// function changeCoverImage() {
//   if (i == 2) {
//     i = 0
//   }
//   const image = document.querySelector('.cover-page')
//   image.style.background = 'url(../img/' + images[i] + ');'
//   i++
// }

// setInterval(changeCoverImage, 1000)

document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.dropdown-trigger');
  const instances = M.Dropdown.init(elems);
  instances.open()
});


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  instances.open()
});


var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 4000); // Change image every 2 seconds
}

