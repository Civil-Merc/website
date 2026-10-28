(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  var root = document.querySelector("[data-ceo-note]");
  if (!root) return;

  gsap.registerPlugin(ScrollTrigger);

  var lines = root.querySelectorAll(".line-subtitle");
  var label = root.querySelector(".text-subtitle");
  var quote = root.querySelector(".ceo-quote");
  var photo = root.querySelector(".ceo-photo");
  var name = root.querySelector(".ceo-name");
  var role = root.querySelector(".ceo-role");

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set([lines, label, quote, photo, name, role], { autoAlpha: 1, y: 0, scale: 1, scaleX: 1 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.set(lines, { scaleX: 0, transformOrigin: "center center" });
    gsap.set(label, { autoAlpha: 0, y: 12 });
    gsap.set(quote, { autoAlpha: 0, y: 24 });
    gsap.set(photo, { autoAlpha: 0, scale: 0.82 });
    gsap.set([name, role], { autoAlpha: 0, y: 14 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
      },
      defaults: { ease: "power3.out" },
    });

    tl.to(lines, { scaleX: 1, duration: 0.45, stagger: 0.08, ease: "power2.inOut" })
      .to(label, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.2")
      .to(quote, { autoAlpha: 1, y: 0, duration: 0.75 }, "-=0.15")
      .to(photo, { autoAlpha: 1, scale: 1, duration: 0.65, ease: "back.out(1.6)" }, "-=0.35")
      .to(name, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.35")
      .to(role, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.25");
  });
})();
