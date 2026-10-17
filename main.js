/* Goinggly — tiny, dependency-free interactions */
(function () {
  // ---- CONFIG -------------------------------------------------------------
  // crmEndpoint: URL that receives every enquiry as a JSON POST (CRM webhook / web-to-lead proxy).
  // whatsapp: digits only with country code, e.g. "919876543210" (used only if crmEndpoint is empty).
  var CONFIG = { crmEndpoint: "", whatsapp: "", email: "info@goinggly.in" };

  // Destination -> cities. The form auto-selects the region + city of the page the visitor is on.
  var REGIONS = {
    "Thailand": ["Bangkok", "Pattaya", "Phuket", "Krabi"],
    "Himachal Pradesh": ["Shimla", "Manali"]
  };

  var d = document, w = window;

  // Header shadow + mobile menu
  var header = d.querySelector(".site-header");
  var burger = d.querySelector(".burger");
  var nav = d.querySelector(".nav");
  function onScroll() { header.classList.toggle("scrolled", w.scrollY > 10); }
  w.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  // Reveal on scroll
  var items = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
    items.forEach(function (el) {
      var p = el.parentElement;
      if (p && p.classList.contains("grid")) el.style.setProperty("--d", (Array.prototype.indexOf.call(p.children, el) % 4) * 0.08 + "s");
      io.observe(el);
    });
  } else { items.forEach(function (el) { el.classList.add("in"); }); }

  // Image placeholders: if the real file is missing, drop the <img> so the labelled placeholder shows
  d.querySelectorAll(".ph img").forEach(function (img) {
    function bad() { img.remove(); }
    img.addEventListener("error", bad);
    if (img.complete && img.naturalWidth === 0) bad();
  });

  // Page transition between pages of this site
  d.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || !a.href) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    e.preventDefault();
    d.body.classList.add("leaving");
    setTimeout(function () { location.href = a.href; }, 220);
  });
  w.addEventListener("pageshow", function () { d.body.classList.remove("leaving"); });

  // Ad tracking params carried into every enquiry
  var track = {};
  try {
    var q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(function (k) {
      if (q.get(k)) sessionStorage.setItem("gg_" + k, q.get(k));
      var v = sessionStorage.getItem("gg_" + k);
      if (v) track[k] = v;
    });
  } catch (e) {}

  // ---- Enquiry forms ------------------------------------------------------
  function el(tag, cls, html) { var n = d.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; }

  function renderChips(form, region, selected) {
    var box = form.querySelector(".chips");
    box.innerHTML = "";
    var cities = REGIONS[region] || [];
    if (!cities.length) { box.appendChild(el("span", "hint", "Pick a destination first")); return; }
    cities.forEach(function (c) {
      var l = el("label"), i = el("input"), s = el("span", "", c);
      i.type = "checkbox"; i.name = "cities"; i.value = c; i.checked = selected.indexOf(c) > -1;
      l.appendChild(i); l.appendChild(s); box.appendChild(l);
    });
  }

  d.querySelectorAll("form[data-enquiry]").forEach(function (form) {
    var regionSel = form.elements.region;
    var pre = (form.getAttribute("data-cities") || "").split(",").filter(Boolean);
    if (form.getAttribute("data-region")) regionSel.value = form.getAttribute("data-region");
    renderChips(form, regionSel.value, pre);
    regionSel.addEventListener("change", function () { renderChips(form, regionSel.value, []); });

    var date = form.elements.date;
    if (date) date.min = new Date().toISOString().slice(0, 10);

    var tag = form.querySelector(".pkgsel");
    form.addEventListener("click", function (e) {
      if (e.target.matches(".pkgsel button")) { form.elements.package.value = ""; tag.classList.remove("on"); }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phone = form.elements.phone.value.replace(/[^\d]/g, "");
      var ok = true;
      [[form.elements.name, form.elements.name.value.trim().length > 1], [form.elements.phone, phone.length >= 10]].forEach(function (p) {
        p[0].classList.toggle("err", !p[1]); if (!p[1]) ok = false;
      });
      if (!ok) { form.querySelector(".err").focus(); return; }

      var cities = Array.prototype.map.call(form.querySelectorAll('input[name="cities"]:checked'), function (i) { return i.value; });
      var data = {
        name: form.elements.name.value.trim(),
        mobile: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        destination: regionSel.value,
        cities: cities.join(", "),
        travel_date: form.elements.date.value,
        travellers: form.elements.pax.value,
        package: form.elements.package.value,
        notes: form.elements.msg.value.trim(),
        page: location.pathname.split("/").pop() || "index.html",
        submitted_at: new Date().toISOString()
      };
      for (var k in track) data[k] = track[k];

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = "Sending…";
      var card = form.closest(".qcard");
      function done() { card.classList.add("done"); card.querySelector(".okbox").classList.add("on"); }

      if (CONFIG.crmEndpoint) {
        fetch(CONFIG.crmEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(data), keepalive: true })
          .then(done).catch(function () { btn.disabled = false; btn.textContent = "Try again"; });
      } else {
        var text = "Hi Goinggly, I'd like a quote.\n" + Object.keys(data).filter(function (k) { return data[k] && !/^(page|submitted_at|utm|gclid|fbclid)/.test(k); })
          .map(function (k) { return k.replace("_", " ") + ": " + data[k]; }).join("\n");
        if (CONFIG.whatsapp) w.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        else location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Trip enquiry — " + (data.cities || data.destination)) + "&body=" + encodeURIComponent(text);
        done();
      }
    });
  });

  // ---- Quote popup: every [data-quote] button/link opens the same enquiry form ----
  var modal = d.getElementById("quote-modal");
  var mform = modal ? modal.querySelector("form[data-enquiry]") : null;
  var pageForm = d.querySelector("#quote form[data-enquiry]") || d.querySelector("form[data-enquiry]");
  function regionOf(city) { for (var r in REGIONS) if (REGIONS[r].indexOf(city) > -1) return r; return ""; }
  function resetCard(card) {
    card.classList.remove("done");
    card.querySelector(".okbox").classList.remove("on");
    var b = card.querySelector('button[type="submit"]');
    if (b) { b.disabled = false; b.textContent = "Get my free quote →"; }
  }
  function openQuote(pkg, citiesStr) {
    if (!modal || !modal.showModal) { var q = d.getElementById("quote"); if (q) q.scrollIntoView({ behavior: "smooth" }); return; }
    resetCard(modal.querySelector(".qcard"));
    var cities = (citiesStr || (pageForm && pageForm.getAttribute("data-cities")) || "").split(",").filter(Boolean);
    var region = regionOf(cities[0]) || (pageForm && pageForm.getAttribute("data-region")) || "";
    mform.elements.region.value = region;
    renderChips(mform, region, cities);
    mform.elements.package.value = pkg || "";
    var tag = mform.querySelector(".pkgsel");
    if (pkg) { tag.firstChild.textContent = "📦 " + pkg + " "; tag.classList.add("on"); } else tag.classList.remove("on");
    modal.showModal();
    d.body.classList.add("noscroll");
  }
  if (modal) {
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".qx")) modal.close(); });
    modal.addEventListener("close", function () { d.body.classList.remove("noscroll"); });
  }
  d.querySelectorAll("[data-quote]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      openQuote(b.getAttribute("data-package"), b.getAttribute("data-cities"));
    });
  });

  // Long Google reviews: "Read more" shows the full, unedited text
  d.querySelectorAll(".rmore").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = b.closest(".rv");
      var open = card.classList.toggle("open");
      b.textContent = open ? "Show less" : "Read more";
    });
  });

  d.querySelectorAll("[data-wa]").forEach(function (a) {
    if (CONFIG.whatsapp) { a.href = "https://wa.me/" + CONFIG.whatsapp; a.target = "_blank"; a.rel = "noopener"; }
    else a.style.display = "none";
  });
})();
