(function () {
  if (!window.gsap) return;

  var hero = document.querySelector(".section-hero-a");
  if (!hero) return;

  var image = hero.querySelector(".about-hero-image");
  var block = hero.querySelector(".block-hero-a");
  var copy = hero.querySelector(".hero-a");
  if (!image || !block || !copy) return;

  var mm = gsap.matchMedia();

  function settledHeight() {
    var previousHero = hero.style.height;
    var previousBlock = block.style.height;
    hero.style.height = "auto";
    block.style.height = "auto";
    var height = hero.offsetHeight;
    hero.style.height = previousHero;
    block.style.height = previousBlock;
    return height;
  }

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set([image, block], { opacity: 1 });
    gsap.set(copy, { y: 0 });
    gsap.set(hero, { height: "auto" });
    gsap.set(block, { height: "auto" });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.set(hero, { height: "97vh" });
    gsap.set(image, { opacity: 0 });
    gsap.set(block, { opacity: 0 });
    gsap.set(copy, { y: 40 });

    gsap.to(image, {
      opacity: 1,
      duration: 0.7,
      delay: 0.2,
      ease: "power1.inOut",
    });

    gsap.to(block, {
      opacity: 1,
      duration: 0.7,
      delay: 0.85,
      ease: "power1.inOut",
    });

    gsap.to(copy, {
      y: 0,
      duration: 1,
      delay: 0.85,
      ease: "power1.inOut",
    });

    gsap.to(hero, {
      height: settledHeight(),
      duration: 0.7,
      delay: 0.85,
      ease: "power1.inOut",
      onComplete: function () {
        gsap.set(hero, { height: "auto" });
        gsap.set(block, { height: "auto" });
      },
    });
  });
})();
