(function () {
  var list = document.querySelector("[data-cms-projects-list]");
  if (!list || !window.CivilMercCMS) return;

  var status = document.querySelector("[data-cms-projects-status]");

  function setStatus(message) {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
  }

  function projectHref(id) {
    return "/projects/project?id=" + encodeURIComponent(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildCard(project) {
    var href = projectHref(project.id);
    var title = project.title || "Untitled project";
    var meta = project.description || "";
    var imageSrc = project.imageSrc || "";
    var imageName = project.imageName || title;
    var item = document.createElement("div");
    item.setAttribute("role", "listitem");
    item.className = "collection-item-project w-dyn-item cms-project-card";
    item.innerHTML =
      '<a href="' +
      escapeHtml(href) +
      '" class="link-image-project w-inline-block">' +
      (imageSrc
        ? '<img src="' +
          escapeHtml(imageSrc) +
          '" loading="lazy" decoding="async" alt="' +
          escapeHtml(imageName) +
          '" class="image-project" />'
        : "") +
      "</a>" +
      (meta ? '<div class="text-project-type">' + escapeHtml(meta) + "</div>" : "") +
      '<a href="' +
      escapeHtml(href) +
      '" class="link-block-project w-inline-block">' +
      '<div class="block-project"><h5 class="heading-project">' +
      escapeHtml(title) +
      "</h5></div>" +
      '<div class="line-block"><div class="line-full dark"></div><div class="line-1px dark"></div></div>' +
      "</a>";
    return item;
  }

  function animateCards(cards) {
    if (!window.gsap || !cards.length) return;

    var mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", function () {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
    });
    mm.add("(prefers-reduced-motion: no-preference)", function () {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.05,
        }
      );
    });
  }

  CivilMercCMS.getProjects()
    .then(function (payload) {
      var projects = (payload && payload.projects) || [];
      list.innerHTML = "";

      if (!projects.length) {
        setStatus("No projects published yet.");
        return;
      }

      setStatus("");
      var cards = projects.map(function (project) {
        var card = buildCard(project);
        list.appendChild(card);
        return card;
      });
      animateCards(cards);
    })
    .catch(function (err) {
      list.innerHTML = "";
      setStatus(err && err.message ? err.message : "Could not load projects.");
    });
})();
