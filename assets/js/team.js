(function () {
  var people = {
    ceo: {
      name: "Engr. Mohammed Lukman Sadings",
      role: "Founder & Chief Executive Officer",
      photo: "/assets/brand/team/mohammed-lukman-sadings.jpg?v=3",
      email: "civilmercltd@gmail.com",
      paragraphs: [
        "Mohammed founded Civil Merc and still sets the standard the company is judged by: work you can see, and a handover the client can trust.",
        "He leads the practice across civil engineering and real estate in Abuja, from the first client conversation through to a finished building or a completed road. The quality policy he signs asks for a zero-defect handover, checked against local codes, Eurocodes, and ASTM.",
        "Clients who stay with Civil Merc do so because the reporting is clear and the finished work matches what was promised. That is the bar he holds the rest of the team to."
      ]
    },
    coo: {
      name: "Muhammad Sadiq Kanar",
      role: "Chief Operations Officer",
      photo: "/assets/brand/team/muhammad-sadiq-kanar.jpg",
      email: "civilmercltd@gmail.com",
      paragraphs: [
        "Sadiq keeps the work moving. As chief operations officer he turns a signed brief into a site that has people, materials, and a programme that actually holds.",
        "On Civil Merc jobs that means coordinating design, procurement, and site teams so a residential block in Asokoro or a road in Karshi does not stall between drawings and concrete.",
        "He is the person who makes the weekly picture honest: what is done, what is late, and what has to change before the next pour."
      ]
    },
    pm: {
      name: "Engr. Abubakar Abbas Abashe",
      role: "Project Manager",
      photo: "/assets/brand/team/abubakar-abbas-abashe.jpg",
      email: "civilmercltd@gmail.com",
      paragraphs: [
        "Abubakar runs the job on the ground. He takes a project from the agreed scope through supervision, quality checks, and handover.",
        "That covers the work Civil Merc is known for in Abuja: bridges, culverts, and roads such as Gidan Daya in Karshi, and residential blocks the company delivers for private clients.",
        "Safety on his sites is not a poster. Civil Merc works to a zero-tolerance rule on accidents, and Abubakar is the one who keeps that rule in the daily sequence of the job."
      ]
    },
    architect: {
      name: "Arc. Bashir Majiyebo Umar",
      role: "Lead Architect",
      photo: "/assets/brand/team/bashir-majiyebo-umar.jpg",
      email: "civilmercltd@gmail.com",
      paragraphs: [
        "Bashir leads the architectural side of Civil Merc’s real estate work: how a building sits on its plot, how it is planned, and how it will be lived in.",
        "The practice’s residential work in Asokoro, Wuse, and Jahi starts with that drawing set. His role is to keep the design buildable, so the engineer and the site team are working from the same intent.",
        "He also watches the longer life of the building: daylight, materials, and a plan that still makes sense after the keys are handed over."
      ]
    }
  };

  var overlay = document.getElementById("team-overlay");
  var photo = document.getElementById("team-panel-photo");
  var role = document.getElementById("team-panel-role");
  var nameEl = document.getElementById("team-panel-name");
  var copy = document.getElementById("team-panel-copy");
  var contact = document.getElementById("team-panel-contact");
  var closeBtn = document.getElementById("team-close");
  var lastTrigger = null;

  function openMember(id, trigger) {
    var person = people[id];
    if (!person) return;
    lastTrigger = trigger || null;
    photo.src = person.photo;
    photo.alt = person.name;
    role.textContent = person.role;
    nameEl.textContent = person.name;
    copy.innerHTML = person.paragraphs.map(function (p) {
      return "<p>" + p + "</p>";
    }).join("");
    contact.innerHTML =
      '<div class="team-contact-label">Company email</div>' +
      '<a href="mailto:' + person.email + '">' + person.email + "</a>" +
      '<div class="team-contact-label">Phone</div>' +
      '<a href="tel:+2348138232570">0813 823 2570</a>' +
      '<a href="tel:+2348068432080">0806 843 2080</a>';
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closePanel() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      if (!overlay.classList.contains("is-open")) overlay.hidden = true;
    }, 450);
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll(".team-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openMember(card.getAttribute("data-member"), card);
    });
  });

  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closePanel();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closePanel();
  });
})();
