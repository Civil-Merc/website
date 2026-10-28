(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var cards = document.querySelectorAll(".team-cards .team-card");
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(cards, { autoAlpha: 1, x: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    cards.forEach(function (card) {
      gsap.fromTo(card, { autoAlpha: 0, x: 72 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
