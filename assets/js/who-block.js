(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var block = document.querySelector("[data-who-block]");
  if (!block) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(block, { autoAlpha: 1, x: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.fromTo(block, { autoAlpha: 0, x: 72 }, {
      autoAlpha: 1,
      x: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: block,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });

  var why = document.querySelector("[data-why-block]");
  if (!why) return;

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(why.querySelectorAll(".subtitle, .heading, .paragraph, .button"), { autoAlpha: 1, x: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var title = why.querySelectorAll(".subtitle, .heading");
    var body = why.querySelectorAll(".paragraph, .button");

    gsap.set(title, { autoAlpha: 0, x: 72 });
    gsap.set(body, { autoAlpha: 0, x: 72 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: why,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    });

    tl.to(title, { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" })
      .to(body, { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" }, "-=0.35");
  });

  var featured = document.querySelector("[data-featured-intro]");
  if (!featured) return;

  var line = featured.querySelector(".line-subtitle");
  var label = featured.querySelector(".text-subtitle");
  var heading = featured.querySelector(".heading");
  var lead = featured.querySelector(".featured-rail-hook");
  var parts = [label, heading, lead].filter(Boolean);
  if (!line || !parts.length) return;

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(line, { scaleX: 1 });
    gsap.set(parts, { autoAlpha: 1, y: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(parts, { autoAlpha: 0, y: 32 });

    var intro = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: featured,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    intro.to(line, { scaleX: 1, duration: 0.55, ease: "power2.inOut" });
    if (label) intro.to(label, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.2");
    if (heading) intro.to(heading, { autoAlpha: 1, y: 0, duration: 0.85 }, "-=0.25");
    if (lead) intro.to(lead, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5");
  });
})();
