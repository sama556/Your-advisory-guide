
    (function () {
      var cards = document.querySelectorAll(".consultant-card-wrap");
      var noResults = document.getElementById("noResults");

      function filterList() {
        var kw = (document.getElementById("searchKeywords").value || "").toLowerCase().trim();
        var spec = (document.getElementById("filterSpecialty").value || "").toLowerCase();
        var exp = parseInt(document.getElementById("filterExperience").value || "0", 10);
        var visible = 0;
        cards.forEach(function (el) {
          var cardSpec = (el.getAttribute("data-specialty") || "").toLowerCase();
          var cardExp = parseInt(el.getAttribute("data-experience") || "0", 10);
          var searchText = (el.getAttribute("data-search") || "").toLowerCase();
          var matchSpec = !spec || cardSpec === spec;
          var matchExp = !exp || cardExp >= exp;
          var matchKw = !kw || searchText.indexOf(kw) !== -1;
          var show = matchSpec && matchExp && matchKw;
          el.style.display = show ? "" : "none";
          if (show) visible++;
        });
        noResults.classList.toggle("d-none", visible > 0);
      }

      document.getElementById("btnSearch").addEventListener("click", filterList);
      document.getElementById("searchKeywords").addEventListener("keypress", function (e) { if (e.key === "Enter") { e.preventDefault(); filterList(); } });
      document.getElementById("filterSpecialty").addEventListener("change", filterList);
      document.getElementById("filterExperience").addEventListener("change", filterList);

      AOS.init({ duration: 500, once: true });
    })();
  