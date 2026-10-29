/**
 * About page service cards from GET /public/services.
 */
(function () {
  var grid = document.querySelector("[data-about-services]");
  if (!grid || !window.CivilMercCMS) return;

  var status = document.querySelector("[data-about-services-status]");
  var arrows =
    '<div class="icon-arrow"><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617c896e532593afd4582c7e_arrow_4.svg" loading="lazy" alt="" class="icon-arrow-a" /><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617c896e1b0e087871032673_arrow_3.svg" loading="lazy" alt="" class="icon-arrow-b" /></div>';

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

  function buildCard(service) {
    var href = serviceHref(service.id);
    var title = service.title || "Untitled service";
    var description = service.description || "";
    var imageSrc = service.imageSrc || "";
    var card = document.createElement("div");
    card.className = "services";
    card.innerHTML =
      '<a href="' + href + '" class="link-image-services w-inline-block">' +
      (imageSrc
        ? '<img src="' + escapeHtml(imageSrc) + '" loading="lazy" decoding="async" alt="' + escapeHtml(title) + '" class="image-services" />'
        : "") +
      "</a>" +
      '<a href="' + href + '" class="link-block-services w-inline-block">' +
      '<div class="block-services"><h5 class="heading-services">' + escapeHtml(title) + "</h5>" +
      arrows +
      "</div>" +
      '<div class="line-block"><div class="line-full dark"></div><div class="line-1px dark"></div></div>' +
      "</a>" +
      (description ? '<p class="paragraph-summary">' + escapeHtml(description) + "</p>" : "");
    return card;
  }

  function animate() {
    if (window.CivilMercAboutServices) CivilMercAboutServices.init();
  }

  CivilMercCMS.getServices()
    .then(function (payload) {
      var services = (payload && payload.services) || [];
      grid.innerHTML = "";
      if (!services.length) {
        setStatus("No services published yet.");
        return;
      }
      setStatus("");
      services.forEach(function (service) {
        grid.appendChild(buildCard(service));
      });
      animate();
    })
    .catch(function (err) {
      grid.innerHTML = "";
      setStatus(err && err.message ? err.message : "Could not load services.");
    });
})();
