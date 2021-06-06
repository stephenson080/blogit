window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementsByClassName("navbar")[0].style.padding = "10px 10px";
    document.getElementById("logo").style.fontSize = "25px";
  } else {
    document.getElementsByClassName("navbar")[0].style.padding = "25px 10px";
    document.getElementById("logo").style.fontSize = "25px";
  }
}