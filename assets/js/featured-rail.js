(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var root = document.querySelector("[data-featured-rail]");
  if (!root) return;

  var pin = root.querySelector("[data-featured-pin]");
  var viewport = root.querySelector("[data-featured-viewport]");
  var track = root.querySelector("[data-featured-track]");
  if (!pin || !viewport || !track) return;

  function navOffset() {
    var nav = document.querySelector(".navbar");
    return nav ? Math.ceil(nav.getBoundingClientRect().height) + 16 : 16;
  }

  function distance() {
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var cards = track.children;
    var total = 0;
    for (var i = 0; i < cards.length; i++) total += cards[i].offsetWidth;
    if (cards.length > 1) total += gap * (cards.length - 1);
    var available = Math.min(viewport.clientWidth, window.innerWidth - 80);
    return Math.max(0, total - available);
  }

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(track, { x: 0 });
    root.style.height = "auto";
    pin.style.position = "relative";
    viewport.style.overflowX = "auto";
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    function fit() {
      pin.style.position = "sticky";
      pin.style.top = navOffset() + "px";
      root.style.height = "auto";
      var extra = distance();
      var hold = Math.round(window.innerHeight * 0.45);
      root.style.height = pin.offsetHeight + extra + hold + "px";
    }

    fit();

    var rail = gsap.timeline({
      scrollTrigger: {
        trigger: viewport,
        start: "top 70%",
        endTrigger: root,
        end: "bottom bottom",
        scrub: 0.35,
        invalidateOnRefresh: true,
      },
    });

    rail.to(track, { x: 0, ease: "none", duration: 0.55 });
    rail.to(track, {
      x: function () {
        return -distance();
      },
      ease: "none",
      duration: 1,
    });

    ScrollTrigger.addEventListener("refreshInit", fit);

    window.addEventListener("load", function () {
      fit();
      ScrollTrigger.refresh();
    });

    return function () {
      ScrollTrigger.removeEventListener("refreshInit", fit);
      root.style.height = "auto";
    };
  });
})();
