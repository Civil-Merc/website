/**
 * CivilMerc public CMS client (read-only).
 * API docs: public-cms-api.md
 *
 * Override base for local dev, e.g. before this script loads:
 *   window.CIVILMERC_CMS_API_BASE = "http://127.0.0.1:3001/api";
 */
(function (global) {
  var DEFAULT_BASE = "https://cms.civilmerc.com/api";

  function apiBase() {
    var base = global.CIVILMERC_CMS_API_BASE || DEFAULT_BASE;
    return String(base).replace(/\/$/, "");
  }

  function url(path) {
    return apiBase() + (path.charAt(0) === "/" ? path : "/" + path);
  }

  var contactPageRequest = null;

  function fetchPublic(path) {
    return fetch(url(path), { method: "GET", credentials: "omit" }).then(function (res) {
      if (res.ok) return res.json();
      return res
        .json()
        .catch(function () {
          return {};
        })
        .then(function (body) {
          var message = body.error || res.statusText || "Request failed";
          var err = new Error(message);
          err.status = res.status;
          throw err;
        });
    });
  }

  global.CivilMercCMS = {
    get baseUrl() {
      return apiBase();
    },
    fetchPublic: fetchPublic,
    getProjects: function () {
      return fetchPublic("/public/projects");
    },
    getProject: function (id) {
      return fetchPublic("/public/projects/" + encodeURIComponent(id));
    },
    getServices: function () {
      return fetchPublic("/public/services");
    },
    getService: function (id) {
      return fetchPublic("/public/services/" + encodeURIComponent(id));
    },
    getAboutPage: function () {
      return fetchPublic("/public/pages/about");
    },
    getContactPage: function () {
      if (!contactPageRequest) {
        contactPageRequest = fetchPublic("/public/pages/contact");
      }
      return contactPageRequest;
    },
  };
})(window);
