/**
 * Fills contact details from GET /public/pages/contact.
 * Static markup stays in place when the page is unpublished.
 */
(function (global) {
  function addressLines(address) {
    return String(address || "")
      .split(/\r?\n/)
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function telHref(phone) {
    return "tel:" + String(phone).replace(/[^\d+]/g, "");
  }

  function mapsQuery(address) {
    return encodeURIComponent(String(address).replace(/\s+/g, " ").trim());
  }

  function setText(node, value) {
    if (!node || node.textContent === value) return;
    node.textContent = value;
  }

  function fill(root, page) {
    if (!root || !page) return;
    var address = String(page.address || "").trim();
    var email = String(page.email || "").trim();
    var phones = Array.isArray(page.phones)
      ? page.phones
          .map(function (phone) {
            return String(phone || "").trim();
          })
          .filter(Boolean)
      : [];

    if (address) {
      var flat = addressLines(address).join(", ");
      root.querySelectorAll("[data-cms-contact-address]").forEach(function (node) {
        if (node.hasAttribute("data-cms-contact-address-lines")) {
          node.textContent = "";
          addressLines(address).forEach(function (line) {
            var paragraph = document.createElement("p");
            paragraph.className = "paragraph-footer";
            paragraph.textContent = line;
            node.appendChild(paragraph);
          });
          return;
        }
        setText(node, flat);
      });

      var query = mapsQuery(address);
      root.querySelectorAll("[data-cms-contact-map]").forEach(function (link) {
        link.href = "https://www.google.com/maps?q=" + query;
      });
      root.querySelectorAll("[data-cms-contact-map-frame]").forEach(function (frame) {
        frame.title = "Civil Merc office, " + flat;
        frame.src = "https://maps.google.com/maps?q=" + query + "&z=17&output=embed";
      });

      var lead = root.querySelector("[data-cms-contact-lead]");
      if (lead) {
        setText(lead, flat + ". Call or write, and we will set a time to walk through the project.");
      }
    }

    if (email) {
      root.querySelectorAll("[data-cms-contact-email]").forEach(function (node) {
        setText(node, email);
        var link = node.closest("a");
        if (link) link.href = "mailto:" + email;
      });
    }

    if (phones.length) {
      root.querySelectorAll("[data-cms-contact-phones]").forEach(function (node) {
        var footer = node.hasAttribute("data-cms-contact-phones-footer");
        node.textContent = "";
        phones.forEach(function (phone) {
          var link = document.createElement("a");
          link.href = telHref(phone);
          link.className = footer ? "link-footer" : "text-contact";
          link.textContent = phone;
          node.appendChild(link);
        });
      });
    }

    if (page.title && root.hasAttribute && root.hasAttribute("data-cms-contact-page")) {
      var title = page.title.indexOf("CivilMerc") === -1 ? page.title + " | CivilMerc" : page.title;
      document.title = title;
      ["og:title", "twitter:title"].forEach(function (key) {
        var meta = document.querySelector(
          key.indexOf("og:") === 0 ? 'meta[property="' + key + '"]' : 'meta[name="' + key + '"]'
        );
        if (meta) meta.setAttribute("content", title);
      });
    }
  }

  function load(root) {
    if (!root || !global.CivilMercCMS) return Promise.resolve();
    return global.CivilMercCMS.getContactPage()
      .then(function (payload) {
        fill(root, payload && payload.page);
      })
      .catch(function () {});
  }

  var page = document.querySelector("[data-cms-contact-page]");
  if (page) load(page);

  global.CivilMercContactDetails = { load: load };
})(window);
