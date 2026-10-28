(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var grid = document.querySelector("[data-stats-cards]");
  if (!grid) return;

  var cards = grid.querySelectorAll(".stats");
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(cards, { autoAlpha: 1, x: 0 });
    gsap.set(grid.querySelectorAll(".icon-stats-block"), { scale: 1, rotation: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    cards.forEach(function (card) {
      var icon = card.querySelector(".icon-stats-block");
      var num = card.querySelector(".numbers-stats");
      var raw = num ? num.textContent.trim() : "";
      var suffix = raw.indexOf("%") === -1 ? "" : "%";
      var value = parseFloat(raw);
      var counter = { val: 0 };

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(card, { autoAlpha: 0, x: 72 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
      }, 0);

      if (icon) {
        tl.fromTo(icon, { scale: 0.55, rotation: -10 }, {
          scale: 1,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        }, 0.08);
      }

      if (num && !isNaN(value)) {
        tl.fromTo(counter, { val: 0 }, {
          val: value,
          duration: 1,
          ease: "power2.out",
          onUpdate: function () {
            num.textContent = Math.round(counter.val) + suffix;
          },
        }, 0.12);
      }
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
