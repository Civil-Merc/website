/**
 * Homepage hero service labels from GET /public/services.
 * Titles always; hover copy is the service description (shown on desktop by CSS).
 */
(function () {
  var grid = document.querySelector("[data-cms-hero-services]");
  if (!grid || !window.CivilMercCMS) return;

  function serviceHref(id) {
    return "/services/service?id=" + encodeURIComponent(id);
  }

  function fillLink(link, service) {
    link.href = serviceHref(service.id);
    var title = link.querySelector(".text-hero-service");
    var description = link.querySelector(".paragraph-description");
    if (title) title.textContent = service.title || "";
    if (description) description.textContent = service.description || "";
  }

  CivilMercCMS.getServices()
    .then(function (payload) {
      var services = (payload && payload.services) || [];
      var links = Array.prototype.slice.call(grid.querySelectorAll(":scope > .link-hero-service"));
      if (!services.length || !links.length) return;

      var template = links[0];
      while (links.length < services.length) {
        var clone = template.cloneNode(true);
        grid.appendChild(clone);
        links.push(clone);
      }

      services.forEach(function (service, index) {
        fillLink(links[index], service);
      });

      for (var i = services.length; i < links.length; i++) {
        links[i].remove();
      }
    })
    .catch(function () {});
})();
