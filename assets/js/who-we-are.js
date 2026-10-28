(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var story = document.querySelector("[data-who-we-are-story]");
  if (!story) return;

  var paragraphs = story.querySelectorAll(".who-we-are-paragraph");
  var words = [];

  paragraphs.forEach(function (paragraph) {
    var parts = paragraph.textContent.split(/(\s+)/);
    paragraph.textContent = "";
    parts.forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        paragraph.appendChild(document.createTextNode(part));
        return;
      }
      var span = document.createElement("span");
      span.className = "who-we-are-word";
      span.textContent = part;
      paragraph.appendChild(span);
      words.push(span);
    });
  });

  if (!words.length) return;

  var muted = "#a8b2b8";
  var ink = "#101b22";
  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", function () {
    gsap.set(words, { color: ink, opacity: 1 });
  });

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    gsap.set(words, { color: muted, opacity: 0.42 });

    gsap.to(words, {
      color: ink,
      opacity: 1,
      ease: "none",
      duration: 0.35,
      stagger: 0.12,
      scrollTrigger: {
        trigger: story,
        start: function () {
          var paragraph = story.querySelector(".who-we-are-paragraph") || story;
          var styles = window.getComputedStyle(paragraph);
          var lineHeight = parseFloat(styles.lineHeight);
          if (!lineHeight || lineHeight < 8) {
            lineHeight = parseFloat(styles.fontSize) * 1.36;
          }
          return "top bottom-=" + Math.round(lineHeight * 3.15);
        },
        end: "center center",
        scrub: 0.45,
      },
    });

    window.addEventListener("load", function () {
      ScrollTrigger.refresh();
    });
  });
})();
