
import * as $ from 'jquery';
import * as GeminiScrollbar from 'gemini-scrollbar';
import 'imask';
import 'datatables.net';
import 'prismjs';
import 'clipboard';


(function(){
  const JCA = {};
    
  JCA.loader = () => {
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
  };

  JCA.inputMasks = () => {
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

  JCA.initializeScrollbar = () => {
    const mainContentArea = document.querySelectorAll("[data-scrollbar]")[0];
    new GeminiScrollbar({
      element: mainContentArea
    }).create();
  };

  JCA.initializeConversations = () => {
    $('.jca-conversation__input textarea')
      .focus((context) => {
        $(context.currentTarget)
          .closest('.jca-conversation__viewport')
          .addClass('jca-conversation--reply-mode');
      });

    $('[data-reply-mode="cancel"')
      .click((context) => {
        $(context.currentTarget)
          .closest('.jca-conversation__viewport')
          .removeClass('jca-conversation--reply-mode');
      });

  };

  document.addEventListener("DOMContentLoaded", function() {
    JCA.loader();
    JCA.inputMasks();
    JCA.initializeScrollbar();
    JCA.initializeConversations();
  });
}());
