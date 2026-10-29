(function () {
  var page = document.querySelector("[data-cms-detail], [data-cms-project-page]");
  if (!page || !window.CivilMercCMS) return;

  var kind = page.getAttribute("data-cms-detail") || "project";
  var noun = kind === "service" ? "Service" : "Project";

  var params = new URLSearchParams(window.location.search);
  var projectId = params.get("id");
  var statusEl = document.querySelector("[data-cms-project-status]");
  var gallerySection = document.querySelector("[data-project-gallery]");

  var UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function setStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = !message;
    var skeleton = page.querySelector("[data-cms-detail-skeleton]");
    if (skeleton) skeleton.remove();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute("content", content);
  }

  function setMetaProperty(property, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute("content", content);
  }

  function tidyText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function photoLabel(name, index) {
    var label = tidyText(name).replace(/\.(jpe?g|png|webp|gif)$/i, "");
    if (!label || /^[0-9a-f-]{8,}$/i.test(label) || /^\d/.test(label)) {
      return "Photograph " + (index + 1);
    }
    return label;
  }

  function collectPhotos(project) {
    var photos = [];
    var seen = {};
    var cover = project.imageSrc || "";

    (project.gallery || []).forEach(function (item, index) {
      if (!item || !item.src || item.src === cover || seen[item.src]) return;
      seen[item.src] = true;
      photos.push({ src: item.src, alt: photoLabel(item.name, photos.length) });
    });

    return photos;
  }

  function prepareContent(html) {
    var wrap = document.createElement("div");
    wrap.innerHTML = html || "";

    var walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, null);
    var textNode;
    while ((textNode = walker.nextNode())) {
      textNode.nodeValue = textNode.nodeValue.replace(/\u00a0/g, " ");
    }

    Array.prototype.forEach.call(wrap.querySelectorAll("h1"), function (heading) {
      heading.parentNode.removeChild(heading);
    });

    Array.prototype.forEach.call(wrap.querySelectorAll("h2, h3, h4, p, li, blockquote"), function (el) {
      if (!tidyText(el.textContent) && !el.querySelector("img")) el.parentNode.removeChild(el);
    });

    Array.prototype.forEach.call(wrap.querySelectorAll("img"), function (img) {
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      if (!img.getAttribute("alt")) img.setAttribute("alt", "");
      if (img.closest("figure")) return;

      var figure = document.createElement("figure");
      figure.className = "w-richtext-align-fullwidth w-richtext-figure-type-image";
      var frame = document.createElement("div");
      var parent = img.parentNode;
      if (parent && parent.tagName === "P" && tidyText(parent.textContent) === "") {
        parent.parentNode.insertBefore(figure, parent);
        parent.parentNode.removeChild(parent);
      } else {
        parent.insertBefore(figure, img);
      }
      frame.appendChild(img);
      figure.appendChild(frame);
    });

    return wrap.innerHTML.trim();
  }

  function buildGallery(photos) {
    if (!gallerySection || !photos.length) {
      if (gallerySection) gallerySection.hidden = true;
      return;
    }

    gallerySection.hidden = false;
    gallerySection.style.setProperty("--gallery-thumbs", String(photos.length));

    var thumbs = gallerySection.querySelector("[data-gallery-thumbs]");
    var photoA = gallerySection.querySelector("[data-gallery-a]");
    var totalEl = gallerySection.querySelector("[data-gallery-total]");
    if (!thumbs || !photoA || !totalEl) return;

    photoA.src = photos[0].src;
    photoA.alt = photos[0].alt;
    totalEl.textContent = String(photos.length).padStart(2, "0");

    thumbs.innerHTML = photos
      .map(function (photo, index) {
        var label = "Photograph " + (index + 1);
        var active = index === 0 ? ' class="is-active" aria-current="true"' : "";
        return (
          '<button type="button" data-gallery-thumb aria-label="' +
          escapeHtml(label) +
          '"' +
          active +
          ' data-src="' +
          escapeHtml(photo.src) +
          '" data-alt="' +
          escapeHtml(photo.alt) +
          '">' +
          '<img src="' +
          escapeHtml(photo.src) +
          '" loading="lazy" decoding="async" alt="" />' +
          "</button>"
        );
      })
      .join("");

    gallerySection.removeAttribute("data-cms-defer");
    if (window.CivilMercProjectGallery) {
      CivilMercProjectGallery.init(gallerySection);
    }
  }

  function render(project) {
    var title = tidyText(project.title) || "Project";
    var description = tidyText(project.description);
    var hero = page.querySelector("[data-cms-project-hero]");
    var heading = page.querySelector("[data-cms-project-title]");
    var lead = page.querySelector("[data-cms-project-lead]");
    var content = page.querySelector("[data-cms-project-content]");

    document.title = title + " | CivilMerc";
    setMeta("description", description || title);
    setMetaProperty("og:title", title + " | CivilMerc");
    setMetaProperty("og:description", description || title);
    setMetaProperty("twitter:title", title + " | CivilMerc");
    setMetaProperty("twitter:description", description || title);
    if (project.imageSrc) {
      setMetaProperty("og:image", project.imageSrc);
      setMeta("twitter:image", project.imageSrc);
    }

    if (hero) {
      hero.classList.remove("cms-pending");
      if (project.imageSrc) {
        hero.src = project.imageSrc;
        hero.alt = photoLabel(project.imageName, 0) === "Photograph 1" ? title : tidyText(project.imageName) || title;
      } else {
        hero.alt = title;
      }
    }

    if (heading) heading.textContent = title;

    if (lead) {
      var showLead = description && description.toLowerCase() !== title.toLowerCase();
      lead.textContent = showLead ? description : "";
      lead.hidden = !showLead;
    }

    if (content) content.innerHTML = prepareContent(project.content);

    buildGallery(collectPhotos(project));
    setStatus("");
  }

  if (!projectId) {
    setStatus(noun + " not found.");
    if (gallerySection) gallerySection.hidden = true;
    return;
  }

  if (!UUID_RE.test(projectId)) {
    setStatus("Invalid " + noun.toLowerCase() + " link.");
    if (gallerySection) gallerySection.hidden = true;
    return;
  }

  var request = kind === "service" ? CivilMercCMS.getService(projectId) : CivilMercCMS.getProject(projectId);

  request
    .then(function (payload) {
      var entry = payload && (payload.service || payload.project);
      if (!entry) throw new Error(noun + " not found.");
      render(entry);
    })
    .catch(function (err) {
      setStatus(err && err.message ? err.message : "Could not load " + noun.toLowerCase() + ".");
      if (gallerySection) gallerySection.hidden = true;
    });
})();
