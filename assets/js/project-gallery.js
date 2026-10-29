function initProjectGallery(root) {
  if (!root || root.getAttribute("data-gallery-initialized") === "true") return;

  var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-gallery-thumb]"));
  var frame = root.querySelector("[data-gallery-frame]");
  var photoA = root.querySelector("[data-gallery-a]");
  var photoB = root.querySelector("[data-gallery-b]");
  var strip = root.querySelector("[data-gallery-thumbs]");
  var indexEl = root.querySelector("[data-gallery-index]");
  var totalEl = root.querySelector("[data-gallery-total]");
  var progress = root.querySelector("[data-gallery-progress]");
  var openButton = root.querySelector("[data-gallery-open]");
  if (!thumbs.length || !photoA || !photoB) return;

  root.setAttribute("data-gallery-initialized", "true");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;
  var front = photoA;
  var back = photoB;
  var lightbox = null;
  var lightboxPhoto = null;
  var lightboxCount = null;
  var lastFocus = null;
  var dragged = false;
  var token = 0;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateMeta() {
    var current = thumbs[index];
    indexEl.textContent = pad(index + 1);
    totalEl.textContent = pad(thumbs.length);
    progress.style.width = ((index + 1) / thumbs.length) * 100 + "%";
    openButton.setAttribute(
      "aria-label",
      "View full size: " + (current.getAttribute("data-alt") || "photograph")
    );
    thumbs.forEach(function (thumb, i) {
      var active = i === index;
      thumb.classList.toggle("is-active", active);
      if (active) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
    if (!strip) return;
    var left = current.offsetLeft - (strip.clientWidth - current.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
  }

  function paintLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    var current = thumbs[index];
    var src = current.getAttribute("data-src");
    var alt = current.getAttribute("data-alt") || "";
    lightboxCount.textContent = pad(index + 1) + "  /  " + pad(thumbs.length);
    if (lightboxPhoto.getAttribute("src") === src) {
      lightboxPhoto.classList.remove("is-loading");
      lightboxPhoto.alt = alt;
      return;
    }
    lightboxPhoto.classList.add("is-loading");
    lightboxPhoto.alt = alt;
    lightboxPhoto.onload = function () {
      lightboxPhoto.classList.remove("is-loading");
    };
    lightboxPhoto.src = src;
  }

  function show(next) {
    var target = (next + thumbs.length) % thumbs.length;
    if (target === index && front.getAttribute("src")) {
      updateMeta();
      paintLightbox();
      return;
    }
    index = target;
    var current = thumbs[index];
    var src = current.getAttribute("data-src");
    var alt = current.getAttribute("data-alt") || "";
    var currentToken = ++token;
    updateMeta();
    paintLightbox();

    function reveal() {
      if (currentToken !== token) return;
      back.classList.add("is-front");
      front.classList.remove("is-front");
      var swap = front;
      front = back;
      back = swap;
    }

    if (reduceMotion || back.getAttribute("src") === src) {
      back.src = src;
      back.alt = alt;
      reveal();
      return;
    }

    back.alt = alt;
    back.onload = function () {
      back.onload = null;
      reveal();
    };
    back.src = src;
  }

  function buildLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "project-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Project gallery");
    lightbox.innerHTML =
      '<button type="button" class="project-lightbox-close" data-lightbox-close aria-label="Close">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>' +
      "</button>" +
      '<button type="button" class="project-lightbox-arrow project-lightbox-arrow-prev" data-lightbox-prev aria-label="Previous photograph">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<figure class="project-lightbox-figure">' +
      '<img class="project-lightbox-photo" alt="" />' +
      '<div class="project-lightbox-count"></div>' +
      "</figure>" +
      '<button type="button" class="project-lightbox-arrow project-lightbox-arrow-next" data-lightbox-next aria-label="Next photograph">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>";
    document.body.appendChild(lightbox);
    lightboxPhoto = lightbox.querySelector(".project-lightbox-photo");
    lightboxCount = lightbox.querySelector(".project-lightbox-count");

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () {
      show(index - 1);
    });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () {
      show(index + 1);
    });
    bindSwipe(lightbox, function (direction) {
      show(index + direction);
    });
  }

  function focusable() {
    return Array.prototype.slice.call(
      lightbox.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
    );
  }

  function openLightbox() {
    if (!lightbox) buildLightbox();
    lastFocus = document.activeElement;
    document.documentElement.classList.add("project-lightbox-lock");
    lightbox.classList.add("is-open");
    paintLightbox();
    lightbox.querySelector("[data-lightbox-close]").focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.documentElement.classList.remove("project-lightbox-lock");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function bindSwipe(target, onSwipe) {
    var startX = 0;
    var startY = 0;
    var tracking = false;

    target.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      tracking = true;
      dragged = false;
      startX = event.clientX;
      startY = event.clientY;
    });

    target.addEventListener("pointermove", function (event) {
      if (!tracking) return;
      if (Math.abs(event.clientX - startX) > 12) dragged = true;
    });

    target.addEventListener("pointerup", function (event) {
      if (!tracking) return;
      tracking = false;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      onSwipe(dx < 0 ? 1 : -1);
    });

    target.addEventListener("pointercancel", function () {
      tracking = false;
    });
  }

  root.querySelector("[data-gallery-prev]").addEventListener("click", function () {
    show(index - 1);
  });
  root.querySelector("[data-gallery-next]").addEventListener("click", function () {
    show(index + 1);
  });

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener("click", function () {
      show(i);
    });
  });

  openButton.addEventListener("click", function () {
    if (dragged) {
      dragged = false;
      return;
    }
    openLightbox();
  });

  bindSwipe(frame, function (direction) {
    show(index + direction);
  });

  document.addEventListener("keydown", function (event) {
    var open = lightbox && lightbox.classList.contains("is-open");
    if (!open) {
      if (!root.contains(document.activeElement)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
      return;
    }
    if (event.key !== "Tab") return;

    var items = focusable();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  updateMeta();
}

window.CivilMercProjectGallery = { init: initProjectGallery };

document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-project-gallery]:not([data-cms-defer])");
  if (root) initProjectGallery(root);
});
