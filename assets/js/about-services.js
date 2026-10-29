(function (global) {
  var mm = null;

  function init() {
  if (!global.gsap || !global.ScrollTrigger) return;
  if (mm) {
    mm.revert();
    mm = null;
  }

  gsap.registerPlugin(ScrollTrigger);

  var grid = document.querySelector("[data-about-services]");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".services:not(.cms-about-service-skeleton)"));
  if (!cards.length) return;

  mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(cards, { autoAlpha: 1, x: 0 });
  });

  mm.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", function () {
    gsap.fromTo(cards, { autoAlpha: 0, x: -72 }, {
      autoAlpha: 1,
      x: 0,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 80%",
        toggleActions: "play reverse play reverse",
      },
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });

  mm.add("(max-width: 991px) and (prefers-reduced-motion: no-preference)", function () {
    var seen = [];
    var nextToPlay = 0;
    var playing = false;

    function resetFrom(index) {
      playing = false;
      nextToPlay = Math.min(nextToPlay, index);
      for (var i = index; i < cards.length; i++) {
        seen[i] = false;
        gsap.killTweensOf(cards[i]);
        gsap.set(cards[i], { autoAlpha: 0, x: -72 });
      }
    }

    function playNext() {
      if (playing || nextToPlay >= cards.length || !seen[nextToPlay]) return;
      playing = true;
      var index = nextToPlay;
      gsap.fromTo(cards[index], { autoAlpha: 0, x: -72 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        onComplete: function () {
          nextToPlay = index + 1;
          playing = false;
          playNext();
        },
      });
    }

    gsap.set(cards, { autoAlpha: 0, x: -72 });

    cards.forEach(function (card, index) {
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        onEnter: function () {
          seen[index] = true;
          playNext();
        },
        onEnterBack: function () {
          seen[index] = true;
          playNext();
        },
        onLeaveBack: function () {
          resetFrom(index);
        },
      });
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
  }

  global.CivilMercAboutServices = { init: init };
  init();
})(window);
