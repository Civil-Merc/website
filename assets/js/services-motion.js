(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (!document.querySelector(".services-hero")) return;

  gsap.registerPlugin(ScrollTrigger);

  var hero = document.querySelector(".services-hero");
  var panels = gsap.utils.toArray(".services-hero .link-hero-b");
  if (!hero || !panels.length) return;

  panels.forEach(function (panel) {
    var image = panel.querySelector(".image-hero-b");
    if (!image || image.closest(".services-hero-frame")) return;
    var frame = document.createElement("div");
    var shift = document.createElement("div");
    frame.className = "services-hero-frame";
    shift.className = "services-hero-shift";
    image.parentNode.insertBefore(frame, image);
    frame.appendChild(shift);
    shift.appendChild(image);
  });

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(panels, { autoAlpha: 1, x: 0, y: 0 });
    gsap.set(".services-hero .image-hero-b", { scale: 1 });
    gsap.set(".services-hero .hero-b", { autoAlpha: 1, y: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    panels.forEach(function (panel) {
      var image = panel.querySelector(".image-hero-b");
      var copy = panel.querySelector(".hero-b");
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(panel, { autoAlpha: 0, x: 80 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
      }, 0);

      if (image) {
        tl.fromTo(image, { scale: 1.18 }, {
          scale: 1,
          duration: 1.25,
          ease: "power2.out",
        }, 0);
      }

      if (copy) {
        tl.fromTo(copy, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        }, 0.18);
      }
    });

    panels.forEach(function (panel) {
      gsap.fromTo(panel.querySelector(".services-hero-shift"), { yPercent: -7 }, {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
