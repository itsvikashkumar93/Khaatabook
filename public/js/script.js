var ham = document.querySelector(".hamburger");
var hamClose = document.querySelector(".hamClose");

ham.addEventListener("click", function () {
  document.querySelector(".menu").style.display = "flex";
});

hamClose.addEventListener("click", function () {
  document.querySelector(".menu").style.display = "none";
});
