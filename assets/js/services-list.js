(function () {
  var list = document.querySelector("[data-cms-services-list]");
  if (!list || !window.CivilMercCMS) return;

  var status = document.querySelector("[data-cms-services-status]");

  var arrows =
    '<div class="icon-arrow"><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617a08f1807f21412455cd30_arrow_1.svg" loading="lazy" alt="" class="icon-arrow-a" /><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617a08f108641eeb9551068a_arrow_2.svg" loading="lazy" alt="" class="icon-arrow-b" /></div>';

  function setStatus(message) {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function serviceHref(id) {
    return "/services/service?id=" + encodeURIComponent(id);
  }

  function buildPanel(service) {
    var href = serviceHref(service.id);
    var title = service.title || "Untitled service";
    var imageSrc = service.imageSrc || "";
    var imageName = service.imageName || title;
    var link = document.createElement("a");
    link.href = href;
    link.className = "link-hero-b w-inline-block";
    link.innerHTML =
      '<div class="block-hero-b">' +
      '<div class="hero-b">' +
      '<h2 class="heading-hero size-vw">' + escapeHtml(title) + "</h2>" +
      '<div class="block-hero-service"><div class="hero-service"><div class="text-hero-service">Learn More</div>' +
      arrows +
      "</div>" +
      '<div class="line-block"><div class="line-full"></div><div class="line-1px"></div></div>' +
      "</div></div>" +
      (imageSrc
        ? '<img src="' + escapeHtml(imageSrc) + '" loading="lazy" decoding="async" alt="' + escapeHtml(imageName) + '" class="image-hero-b" />'
        : "") +
      "</div>";
    return link;
  }

  CivilMercCMS.getServices()
    .then(function (payload) {
      var services = (payload && payload.services) || [];
      list.innerHTML = "";
      if (!services.length) {
        setStatus("No services published yet.");
        return;
      }
      setStatus("");
      services.forEach(function (service) {
        list.appendChild(buildPanel(service));
      });
      if (window.CivilMercServicesMotion) CivilMercServicesMotion.init();
    })
    .catch(function (err) {
      list.innerHTML = "";
      setStatus(err && err.message ? err.message : "Could not load services.");
    });
})();
