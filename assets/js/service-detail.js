/**
 * Service detail page, laid out like the real-estate service page.
 */
(function () {
  var page = document.querySelector("[data-cms-service-page]");
  if (!page || !window.CivilMercCMS) return;

  var params = new URLSearchParams(window.location.search);
  var serviceId = params.get("id");
  var statusEl = document.querySelector("[data-cms-service-status]");
  var UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function setStatus(message) {
    clearSkeleton();
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = !message;
  }

  function clearSkeleton() {
    var titleSkeleton = document.querySelector("[data-cms-service-title-skeleton]");
    var copySkeleton = document.querySelector("[data-cms-service-skeleton]");
    var heroSection = document.querySelector("[data-cms-service-hero-section]");
    var hero = document.querySelector("[data-cms-service-hero]");
    if (titleSkeleton) titleSkeleton.remove();
    if (copySkeleton) copySkeleton.remove();
    if (hero && !hero.getAttribute("src")) {
      hero.classList.remove("cms-pending");
      if (heroSection) heroSection.classList.remove("cms-pending");
    }
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

  function photoLabel(name, fallback) {
    var label = tidyText(name).replace(/\.(jpe?g|png|webp|gif)$/i, "");
    if (!label || /^[0-9a-f-]{8,}$/i.test(label) || /^\d/.test(label) || /^pasted\b/i.test(label)) {
      return fallback;
    }
    return label;
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

    return wrap;
  }

  function appendGallery(wrap, service) {
    var seen = {};
    Array.prototype.forEach.call(wrap.querySelectorAll("img"), function (img) {
      if (img.getAttribute("src")) seen[img.getAttribute("src")] = true;
    });
    if (service.imageSrc) seen[service.imageSrc] = true;

    (service.gallery || []).forEach(function (item, index) {
      if (!item || !item.src || seen[item.src]) return;
      seen[item.src] = true;
      var figure = document.createElement("figure");
      figure.className = "w-richtext-align-fullwidth w-richtext-figure-type-image";
      var frame = document.createElement("div");
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = photoLabel(item.name, tidyText(service.title) || "Service photograph " + (index + 1));
      img.loading = "lazy";
      img.decoding = "async";
      frame.appendChild(img);
      figure.appendChild(frame);
      wrap.appendChild(figure);
    });
  }

  function showHero(src, alt) {
    var hero = document.querySelector("[data-cms-service-hero]");
    var section = document.querySelector("[data-cms-service-hero-section]");
    if (!hero) return;
    if (!src) {
      hero.remove();
      if (section) section.classList.remove("cms-pending");
      return;
    }
    hero.alt = alt;
    function reveal() {
      hero.classList.remove("cms-pending");
      if (section) section.classList.remove("cms-pending");
    }
    hero.addEventListener("load", reveal);
    hero.addEventListener("error", reveal);
    hero.src = src;
  }

  function render(service) {
    var title = tidyText(service.title) || "Service";
    var description = tidyText(service.description);
    var heading = document.querySelector("[data-cms-service-title]");
    var content = document.querySelector("[data-cms-service-content]");
    var pageTitle = title + " | CivilMerc";

    document.title = pageTitle;
    setMeta("description", description || title);
    setMetaProperty("og:title", pageTitle);
    setMetaProperty("og:description", description || title);
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", description || title);
    if (service.imageSrc) {
      setMetaProperty("og:image", service.imageSrc);
      setMeta("twitter:image", service.imageSrc);
    }

    if (heading) heading.textContent = title;
    showHero(service.imageSrc, photoLabel(service.imageName, title));

    if (content) {
      var body = prepareContent(service.content);
      if (!tidyText(body.textContent) && !body.querySelector("img") && description) {
        var lead = document.createElement("p");
        lead.textContent = description;
        body.appendChild(lead);
      }
      appendGallery(body, service);
      content.innerHTML = body.innerHTML;
    }

    clearSkeleton();
    setStatus("");
  }

  if (!serviceId) {
    setStatus("Service not found.");
    return;
  }

  if (!UUID_RE.test(serviceId)) {
    setStatus("Invalid service link.");
    return;
  }

  CivilMercCMS.getService(serviceId)
    .then(function (payload) {
      var service = payload && payload.service;
      if (!service) throw new Error("Service not found.");
      render(service);
    })
    .catch(function (err) {
      setStatus(err && err.message ? err.message : "Could not load service.");
    });
})();
