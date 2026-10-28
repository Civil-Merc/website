(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var section = document.querySelector(".section.clients");
  if (!section) return;

  var line = section.querySelector(".line-subtitle");
  var copy = section.querySelectorAll(".text-subtitle, .heading");
  var logos = section.querySelectorAll(".client-logos img");
  if (!logos.length) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    if (line) gsap.set(line, { scaleX: 1 });
    gsap.set(copy, { autoAlpha: 1, y: 0 });
    gsap.set(logos, { autoAlpha: 1, y: 0, scale: 1 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    if (line) gsap.set(line, { scaleX: 1 });
    gsap.set(section.querySelectorAll(".text-subtitle, .heading"), { autoAlpha: 1, y: 0 });

    gsap.fromTo(logos, { autoAlpha: 0, y: 22, scale: 0.92 }, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.38,
      ease: "power3.out",
      stagger: 0.14,
      scrollTrigger: {
        trigger: section.querySelector(".client-logos") || section,
        start: "top 82%",
        toggleActions: "play reverse play reverse",
      },
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
