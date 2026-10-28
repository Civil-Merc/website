(function () {
  if (!window.gsap) return;

  var title = document.querySelector(
    ".services-page-title, .team-page-title, .projects-page-title, .contact-intro"
  );
  if (!title) return;

  var line = title.querySelector(".line-subtitle");
  var label = title.querySelector(".text-subtitle");
  var heading = title.querySelector(".heading-hero");
  var lead = title.querySelector(".team-page-lead") || title.querySelector(".block-heading-text > p, .content > p, p");
  var parts = [label, heading, lead].filter(Boolean);
  if (!line || !parts.length) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(line, { scaleX: 1 });
    gsap.set(parts, { autoAlpha: 1, y: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(parts, { autoAlpha: 0, y: 32 });

    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.to(line, { scaleX: 1, duration: 0.55, ease: "power2.inOut" });
    if (label) intro.to(label, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.2");
    if (heading) intro.to(heading, { autoAlpha: 1, y: 0, duration: 0.85 }, "-=0.25");
    if (lead) intro.to(lead, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5");
  });
})();
