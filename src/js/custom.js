import { version } from "../../version.json";
import "./vendor/jquery.datatables.net.min.js";

(function(){
  const JCA = {};
  
  JCA.intializeDatatable = function() {
    const columns = [
      { data: "name" },
      { data: "position" },
      { data: "office" },
      { data: "extn" },
      { data: "start_date" },
      { data: "salary" }
    ];

    $("[data-datatable='myDataTable']").DataTable({
      ajax: "../data/datatable.json",
      columns,
      language: {
        lengthMenu: "_MENU_ records per page",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        searchPlaceholder: "Search",
        search: ""
      }
    });
  };

  JCA.setVersion = function() {
    const elements = document.querySelectorAll("[data-version]");
    elements.forEach((el) => {
      el.innerHTML = `v${version}`;
    });
  };

  JCA.setDate = function() {
    const elements = document.querySelectorAll("[data-date]");
    const today = new Date();
    const date = `${today.getUTCDate()} ${JCA._months(today.getUTCMonth())}, ${today.getUTCFullYear()}`;

    elements.forEach((el) => {
      el.innerHTML = date;
    });
  };

  JCA._months = (value) => {
    return {
      0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
      6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec" 
    }[value];
  };

  document.addEventListener("DOMContentLoaded", function() {
    JCA.intializeDatatable();
    JCA.setVersion();
    JCA.setDate();
  });
}());
