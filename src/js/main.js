(function(){
  window.JCA = window.JCA || {};
   
  window.JCA.loader = () => {
    document.addEventListener("DOMContentLoaded", function(event) {
      var loader = document.querySelector(".jca-loader");
      var content = document.querySelector(".jca-layout");
  
      loader.classList.add("d-none");
      content.classList.remove("d-none");
    });
  };

  window.JCA.inputMasks = () => {
    const visaInputs = document.querySelectorAll("[data-mask='visa'");
    const masterCardInputs = document.querySelectorAll("[data-mask='mastercard'");
    const cvvInputs = document.querySelectorAll("[data-mask='cvv'");

    visaInputs.forEach((element) => {
      new IMask(element, {
        mask: "4000 0000 0000 0000"
      });
    });

    masterCardInputs.forEach((element) => {
      new IMask(element, {
        mask: "5000 0000 0000 0000"
      });
    });

    cvvInputs.forEach((element) => {
      new IMask(element, {
        mask: "000"
      });
    });
  };

  window.JCA.loader();
  window.JCA.inputMasks();
}());
