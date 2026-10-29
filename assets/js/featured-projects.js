/**
 * Homepage featured rail from GET /public/projects.
 */
(function () {
  var track = document.querySelector("[data-featured-track]");
  if (!track || !window.CivilMercCMS) return;

  var arrows =
    '<div class="icon-arrow"><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617c896e532593afd4582c7e_arrow_4.svg" loading="lazy" alt="" class="icon-arrow-a" /><img src="https://cdn.prod.website-files.com/6175e5f51349efa3b3120baa/617c896e1b0e087871032673_arrow_3.svg" loading="lazy" alt="" class="icon-arrow-b" /></div>';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function projectHref(id) {
    return "/projects/project?id=" + encodeURIComponent(id);
  }

  function buildCard(project) {
    var href = projectHref(project.id);
    var title = project.title || "Untitled project";
    var description = project.description || "";
    var imageSrc = project.imageSrc || "";
    var item = document.createElement("div");
    item.setAttribute("role", "listitem");
    item.className = "collection-item-project w-dyn-item";
    item.innerHTML =
      '<a href="' + href + '" class="link-image-project w-inline-block">' +
      (imageSrc
        ? '<img src="' + escapeHtml(imageSrc) + '" loading="lazy" decoding="async" alt="' + escapeHtml(title) + '" class="image-project" />'
        : "") +
      "</a>" +
      (description ? '<div class="text-project-type">' + escapeHtml(description) + "</div>" : "") +
      '<a href="' + href + '" class="link-block-project w-inline-block">' +
      '<div class="block-project"><h5 class="heading-project">' + escapeHtml(title) + "</h5>" +
      arrows +
      "</div></a>";
    return item;
  }

  function refreshRail() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  CivilMercCMS.getProjects()
    .then(function (payload) {
      var projects = (payload && payload.projects) || [];
      if (!projects.length) return;
      track.innerHTML = "";
      projects.forEach(function (project) {
        track.appendChild(buildCard(project));
      });
      refreshRail();
      track.querySelectorAll("img").forEach(function (img) {
        if (!img.complete) img.addEventListener("load", refreshRail);
      });
    })
    .catch(function () {});
})();
