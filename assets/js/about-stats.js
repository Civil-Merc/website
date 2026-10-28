(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var grid = document.querySelector(".about-stats");
  if (!grid) return;

  var cards = grid.querySelectorAll(".stats.full");
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(cards, { autoAlpha: 1, y: 0 });
    gsap.set(grid.querySelectorAll(".icon-stats-block"), { scale: 1, rotation: 0 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var details = Array.prototype.map.call(cards, function (card) {
      var num = card.querySelector(".numbers-stats");
      var raw = num ? num.textContent.trim() : "";
      return {
        card: card,
        icon: card.querySelector(".icon-stats-block"),
        num: num,
        suffix: raw.indexOf("%") === -1 ? "" : "%",
        value: parseFloat(raw),
      };
    });

    gsap.set(cards, { autoAlpha: 0, y: -48 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: "top 90%",
        end: "center center",
        scrub: 0.35,
      },
    });

    details.forEach(function (item, index) {
      var counter = { val: 0 };
      var at = index * 0.18;

      tl.fromTo(item.card, { autoAlpha: 0, y: -48 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.35,
        ease: "none",
      }, at);

      if (item.icon) {
        tl.fromTo(item.icon, { scale: 0.7, rotation: 8 }, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "none",
        }, at);
      }

      if (item.num && !isNaN(item.value)) {
        tl.fromTo(counter, { val: 0 }, {
          val: item.value,
          duration: 0.35,
          ease: "none",
          onUpdate: function () {
            item.num.textContent = Math.round(counter.val) + item.suffix;
          },
        }, at);
      }
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
