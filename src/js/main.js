(function(){
  window.JCA = window.JCA || {};
   
  window.JCA.loader = () => {
    document.addEventListener("DOMContentLoaded", function() {
      var loader =  document.querySelectorAll("[data-body='loader']")[0];
      var content = document.querySelectorAll("[data-body='content']")[0];
      var footer = document.querySelectorAll("[data-body='footer']")[0];

      if (loader) {
        loader.classList.add("d-none");
      }

      if (content) {
        content.classList.remove("d-none");
      }

      if (footer) {
        footer.classList.remove("d-none");
      }
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

  window.JCA.setVersion = () =>  {
    const version = require("../../package.json").version;
    const elements = document.querySelectorAll("[data-version]");
    elements.forEach((el) => {
      el.innerHTML = `v${version}`;
    });
    
  };

  window.JCA.initializeScrollbar = () => {
    const mainContentArea = document.querySelectorAll("[data-scrollbar]")[0];
    new GeminiScrollbar({
      element: mainContentArea
    }).create();
  };

  window.JCA.intializeDatatable = () => {
    $('[data-datatable="myDataTable"]').DataTable({
      "ajax": '../data/datatable.json',
      "columns": require('../data/datatable.json').columns
    });
  };

  window.JCA.loader();
  window.JCA.inputMasks();
  window.JCA.setVersion();
  window.JCA.initializeScrollbar();
  window.JCA.intializeDatatable();
}());
