(function(){
  document.addEventListener("DOMContentLoaded", function(event) {
    var loader = document.querySelector(".jca-loader");
    var content = document.querySelector(".jca-layout");

    loader.classList.add("d-none");
    content.classList.remove("d-none");
  });
}());
