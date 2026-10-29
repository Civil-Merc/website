(function () {
  var mount = document.getElementById("site-footer");
  if (!mount) return;

  fetch("/components/footer.html?v=9", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Footer failed to load");
      return response.text();
    })
    .then(function (html) {
      mount.outerHTML = html.trim();
      markCurrentLink();
      return loadContactDetails();
    })
    .catch(function () {});

  function ensureScript(src, ready) {
    if (ready()) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = function () {
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadContactDetails() {
    var contact = document.querySelector(".footer-contact");
    if (!contact) return Promise.resolve();
    return ensureScript("/assets/js/cms.js", function () {
      return !!window.CivilMercCMS;
    })
      .then(function () {
        return ensureScript("/assets/js/contact-details.js", function () {
          return !!window.CivilMercContactDetails;
        });
      })
      .then(function () {
        return window.CivilMercContactDetails.load(contact);
      })
      .catch(function () {});
  }

  function markCurrentLink() {
    var path = location.pathname.replace(/\/index\.html$/, "").replace(/\.html$/, "").replace(/\/$/, "") || "/";
    var links = document.querySelectorAll(".section-footer a.link-footer");

    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "/") return;
      var target = href.replace(/\/$/, "") || "/";
      var current = path === target || (target !== "/" && path.indexOf(target + "/") === 0);
      if (!current) return;
      link.classList.add("w--current");
      link.setAttribute("aria-current", "page");
    });
  }
})();
