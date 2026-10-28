(function () {
  var mount = document.getElementById("site-footer");
  if (!mount) return;

  fetch("/components/footer.html?v=8", { cache: "no-store" })
    .then(function (response) {
      if (!response.ok) throw new Error("Footer failed to load");
      return response.text();
    })
    .then(function (html) {
      mount.outerHTML = html.trim();
      markCurrentLink();
    })
    .catch(function () {});

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
