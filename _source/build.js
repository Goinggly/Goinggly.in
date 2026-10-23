// Goinggly static site generator v2 (run: node gen2.js <outDir>)
const fs = require("fs");
const path = require("path");
const D = require("./data.js");

const HL = {
  bangkok: [["🛕", "Grand Palace", "Thailand's most spectacular royal complex, home to the Emerald Buddha."], ["🛕", "Wat Pho", "Bangkok's oldest temple and the giant Reclining Buddha."], ["🚤", "Chao Phraya dinner cruise", "Skyline views, live music and a buffet gliding down the river."], ["🛶", "Damnoen Saduak Floating Market", "Paddle-boat vendors, fresh fruit and street snacks on the water."], ["🦒", "Safari World & Marine Park", "A drive-through safari with dolphin and stunt shows — great for families."], ["🏙️", "Mahanakhon Skywalk", "Step onto a glass floor over 300 m above the city for Bangkok's best skyline view."]],
  pattaya: [["🏝️", "Coral Island (Koh Larn)", "Speedboat to white-sand beaches with clear water and water sports."], ["🎭", "Alcazar Cabaret Show", "A glittering, world-famous live production for all ages."], ["🏯", "Sanctuary of Truth", "A towering all-wood temple carved right on the sea."], ["🌴", "Nong Nooch Tropical Garden", "Manicured gardens, an elephant show and cultural performances."], ["🐠", "Underwater World Pattaya", "Walk through glass tunnels beneath sharks, rays and tropical fish."], ["🌃", "Walking Street", "Seafront dining, music and the famous neon strip after dark."]],
  phuket: [["🏝️", "Phi Phi Islands by speedboat", "Snorkelling, hidden bays and the dramatic cliffs of Phi Phi."], ["⛵", "Phang Nga Bay", "Limestone towers, sea-canoe caves and James Bond Island."], ["🗿", "Big Buddha", "Sit above the island with sweeping views in every direction."], ["🌇", "Promthep Cape sunset", "Phuket's most famous sunset spot, at the island's southern tip."], ["🏘️", "Old Phuket Town", "Sino-Portuguese shophouses, cafés and a Sunday walking street."], ["🏖️", "Patong & Kata beaches", "Golden sand, water sports and lively beachfront evenings."]],
  shimla: [["🚂", "Kalka–Shimla toy train", "A UNESCO-listed narrow-gauge ride through tunnels and pine forests."], ["🛍️", "The Ridge & Mall Road", "Colonial architecture, cafés and the town's evening buzz."], ["⛪", "Christ Church", "A neo-Gothic landmark on the Ridge, one of North India's oldest churches."], ["⛷️", "Kufri", "Snow fun in winter, pony rides and viewpoints the rest of the year."], ["🌲", "Mashobra & Naldehra", "Quiet cedar forests, apple orchards and a historic golf course."], ["🏛️", "Viceregal Lodge", "The grand former residence of the British Viceroy."]],
  manali: [["🎿", "Solang Valley", "Skiing in winter; paragliding, ropeway and zorbing in warmer months."], ["🚇", "Atal Tunnel & Sissu", "Drive through the world's highest tunnel to the Lahaul valley."], ["🏔️", "Rohtang Pass", "High-altitude snow views (seasonal; permit-based and weather-dependent)."], ["🛕", "Hadimba Temple", "A wooden temple set inside a quiet deodar forest."], ["☕", "Old Manali", "Riverside cafés, bohemian lanes and live music."], ["🏞️", "Beas River Valley", "Riverside drives and picnic spots along the Beas, with rafting in season."]],
  krabi: [["🏖️", "Railay Beach", "Reachable only by boat, framed by cliffs and a legendary cave beach."], ["🛥️", "Four Islands tour", "Longtail hopping between Tup, Chicken, Poda and Phra Nang."], ["💧", "Emerald Pool & Hot Springs", "Swim in jungle pools of striking blue-green water."], ["🛕", "Tiger Cave Temple", "Climb the stairs for a sweeping view across Krabi's countryside."], ["🌅", "Seven Islands sunset tour", "A full-day island circuit that ends with a golden-hour sunset."], ["🌴", "Ao Nang", "Easy beachside dining, shopping and golden evenings."]],
};
D.forEach((d) => { if (HL[d.slug]) d.highlights = HL[d.slug]; });
const OUT = process.argv[2] || path.join(__dirname, "..");

const TINT = {
  bangkok: ["#f6b27a", "#c2587a"], pattaya: ["#8fd0f7", "#2d7fd0"], phuket: ["#7fe0e0", "#1b8fb5"],
  krabi: ["#9fe3c0", "#16966f"], shimla: ["#b8cdea", "#5d7fb5"], manali: ["#cfe6fb", "#4a86c8"], site: ["#8fd0f7", "#0f77c9"],
};
const REGION = (d) => (d.group === "thailand" ? "Thailand" : "Himachal Pradesh");
const IMGS = []; // collected for images/README.txt

const P = require("./packages.js");

// ---------- helpers ----------
const crypto = require("crypto");
const _verCache = new Map();
function imgVer(file) {
  if (_verCache.has(file)) return _verCache.get(file);
  const p = path.join(OUT, "images", file);
  const v = fs.existsSync(p) ? "?v=" + crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex").slice(0, 8) : "";
  _verCache.set(file, v);
  return v;
}
function ph(file, alt, tint, w, h, opts = {}) {
  IMGS.push([file, `${w}×${h}`, alt]);
  const [a, b] = TINT[tint] || TINT.site;
  return `<div class="ph ${opts.cls || ""}" data-name="${file}" style="--a:${a};--b:${b};${opts.style || ''}"><img src="images/${file}${imgVer(file)}" alt="${alt}" width="${w}" height="${h}"${opts.eager ? ' fetchpriority="high"' : ' loading="lazy"'} onerror="this.remove()">${opts.inner || ""}</div>`;
}
const BASE = "https://goinggly.in/";
const VER = Date.now().toString(36);
const jld = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
const esc = (t) => t.replace(/"/g, "&quot;");
function head(title, desc, page, image, schema = []) {
  const url = BASE + (page === "index.html" ? "" : page);
  const img = BASE + "images/" + image;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0f9bf0">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%230f9bf0'/%3E%3Ctext x='50' y='68' font-size='56' text-anchor='middle' fill='white'%3E%E2%9C%88%3C/text%3E%3C/svg%3E">
<meta property="og:site_name" content="Goinggly"><meta property="og:type" content="website"><meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${img}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${img}">
${schema.map(jld).join("\n")}
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${VER}">
</head>`;
}
const SEO = {
  home: ["Goinggly – Travel Consciously | Thailand & Himachal Tours", "Goinggly — Travel Consciously. Bangkok, Pattaya, Phuket, Krabi, Shimla & Manali tour packages with hand-picked hotels, transfers and sightseeing. Free quote."],
  about: ["About Goinggly – Thailand & Himachal Holiday Planners", "Goinggly is a travel company that plans premium Thailand and Himachal Pradesh holidays — personally, transparently and around your dates and budget."],
};
const BIZ = {
  phoneShow: "+91 98996 54892", phoneTel: "+919899654892",
  street: "Gomti Nagar", city: "Lucknow", state: "Uttar Pradesh", zip: "226010",
  legal: "Goinggly Travels India Pvt. Ltd.",
  map: "https://www.google.com/maps/search/?api=1&query=Goinggly+Virat+Khand+Gomti+Nagar+Lucknow",
};
const ORG = { "@context": "https://schema.org", "@type": "TravelAgency", name: "Goinggly", slogan: "Travel Consciously", url: BASE, email: "enquiry@goinggly.in", telephone: BIZ.phoneTel, legalName: BIZ.legal, address: { "@type": "PostalAddress", streetAddress: BIZ.street, addressLocality: BIZ.city, addressRegion: BIZ.state, postalCode: BIZ.zip, addressCountry: "IN" }, areaServed: ["Thailand", "Himachal Pradesh, India"], description: "Premium Thailand and Himachal Pradesh holiday packages with hand-picked hotels, transfers and sightseeing.", knowsAbout: ["Bangkok tour packages", "Pattaya tour packages", "Phuket tour packages", "Krabi tour packages", "Shimla tour packages", "Manali tour packages"] };
const SITE = { "@context": "https://schema.org", "@type": "WebSite", name: "Goinggly", url: BASE };
function destSchema(d) {
  return [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: d.name, item: BASE + d.slug + ".html" } ] },
    { "@context": "https://schema.org", "@type": "TouristDestination", name: d.name, description: d.lede.replace(/<[^>]+>/g, ""), url: BASE + d.slug + ".html",
      touristType: ["Couples", "Families", "Friends"], containedInPlace: { "@type": d.group === "thailand" ? "Country" : "AdministrativeArea", name: d.group === "thailand" ? "Thailand" : "Himachal Pradesh, India" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map((q) => ({ "@type": "Question", name: q[0], acceptedAnswer: { "@type": "Answer", text: q[1] } })) },
  ];
}
const INTRO = {
  bangkok: "Looking for Bangkok tour packages from India? Goinggly designs Bangkok holidays that blend the Grand Palace, Wat Arun and a Chao Phraya dinner cruise with free time for street food, shopping and rooftop views. Every package includes hand-picked hotels, airport transfers and guided sightseeing, and Bangkok pairs easily with Pattaya for a city-and-beach trip. Share your dates and group size and we'll send a custom quote.",
  pattaya: "Planning a Pattaya trip? Our Pattaya tour packages cover Coral Island speedboat trips, the Alcazar show, Sanctuary of Truth, Nong Nooch Garden and the Floating Market, all about two hours from Bangkok airport. Goinggly arranges your stay, private transfers and sightseeing so friends and families can simply enjoy the beach town. Combine it with Bangkok, or tell us your budget and we'll tailor the rest.",
  phuket: "Goinggly's Phuket tour packages are built around the best of the Andaman: Phi Phi Islands, Phang Nga Bay and James Bond Island, Big Buddha, Old Phuket Town and unforgettable sunsets. Choose a beach resort for a honeymoon or a family-friendly stay, add island tours, and pair Phuket with Krabi for a longer holiday. We handle hotels, transfers and activities — you pick the dates.",
  krabi: "Krabi tour packages from Goinggly are made for travellers who want scenery without the crowds: Four Islands longtail tours, Railay and Phra Nang beaches, Emerald Pool, Tiger Cave Temple and mangrove kayaking. Ideal for honeymooners and nature lovers, Krabi combines beautifully with Phuket. Tell us when you want to travel and we'll shape a relaxed, well-paced itinerary with hotels and transfers included.",
  shimla: "Shimla tour packages with Goinggly bring together the Kalka–Shimla toy train, Mall Road and the Ridge, Jakhu Temple, Kufri and the cedar forests of Mashobra and Naldehra. Whether you want a snowy winter getaway or a cool summer break, we arrange your hotel, cab and sightseeing, and can extend the trip to Manali. Send us your dates for a free custom quote.",
  manali: "Planning Manali tour packages? Goinggly covers Solang Valley adventures, the Atal Tunnel and Sissu, Hadimba Temple, Old Manali cafés and Vashisht hot springs, with seasonal options such as Rohtang Pass where permitted. Our Manali holidays include hotels, cabs and sightseeing for couples, friends and families, and combine easily with Shimla. Share your travel dates and we'll send a tailored quote.",
};
function header(active) {
  const th = D.filter((d) => d.group === "thailand").map((d) => `<a href="${d.slug}.html">${d.name}</a>`).join("");
  const hm = D.filter((d) => d.group === "himalayas").map((d) => `<a href="${d.slug}.html">${d.name}</a>`).join("");
  return `<body>
<div class="topbar"><div class="container"><span>✈ <b>Goinggly — Travel Consciously</b></span><span class="hide-m">📞 <a href="tel:${BIZ.phoneTel}">${BIZ.phoneShow}</a> · <a href="mailto:enquiry@goinggly.in">enquiry@goinggly.in</a></span></div></div>
<header class="site-header"><div class="container">
  <a href="index.html" class="logo" aria-label="Goinggly home"><i>✈</i><span class="lt"><b>Going<span>gly</span></b><em>Travel Consciously</em></span></a>
  <button class="burger" aria-label="Menu" aria-expanded="false"><i></i></button>
  <nav class="nav">
    <a href="index.html"${active === "home" ? ' class="active"' : ""}>Home</a>
    <div class="dd"><button type="button" aria-haspopup="true">Destinations ▾</button>
      <div class="dd-menu"><small>Thailand</small>${th}<small>Himachal Pradesh</small>${hm}</div></div>
    <a href="about.html"${active === "about" ? ' class="active"' : ""}>About</a>
    <a href="#quote">Contact</a>
    <a href="#quote" class="cta" data-quote>Get free quote</a>
  </nav>
</div></header>`;
}
// Enquiry card (same form everywhere; region + city auto-map from the page)
function form(d, title, sub, id, modal = false) {
  const region = d ? REGION(d) : "";
  return `<div class="qcard"${id ? ` id="${id}"` : ""}>
  <div class="head"><h3>${title}</h3><p class="sub">${sub}</p></div>
  <form class="qform" data-enquiry novalidate data-region="${region}" data-cities="${d ? d.name : ""}">
    <input type="hidden" name="package" value="">
    <div class="pkgsel"><button type="button" aria-label="Remove package">×</button></div>
    <div><label>Name <b>*</b><input name="name" required autocomplete="name" placeholder="Your full name"></label></div>
    <div><label>Mobile <b>*</b><span class="pre"><span>+91</span><input name="phone" type="tel" inputmode="numeric" required autocomplete="tel-national" placeholder="10-digit number"></span></label></div>
    <div><label>Destination<select name="region"><option value=""${region ? "" : " selected"}>Select</option><option>Thailand</option><option>Himachal Pradesh</option></select></label></div>
    <div><label>Travel date<input name="date" type="date"></label></div>
    <div class="full"><label>Cities <small>(select one or more)</small></label><div class="chips"></div></div>
    <div><label>Adults <small>(13+ yrs)</small><input name="adults" type="number" min="1" max="50" value="2"></label></div>
    <div><label>Children <small>(2–12 yrs)</small><input name="children" type="number" min="0" max="20" value="0"></label></div>
    <div class="full"><label>Email <small>(optional)</small><input name="email" type="email" autocomplete="email" placeholder="you@email.com"></label></div>
    <div class="full"><label>Notes <small>(optional)</small><textarea name="msg" rows="1" placeholder="Honeymoon, kids, budget…"></textarea></label></div>
    <div class="full"><button class="btn btn-orange btn-w" type="submit">Get my free quote →</button></div>
  </form>
  <div class="okbox"><div class="tick">✓</div><h3>Thank you!</h3><p class="sub">We've received your enquiry. Our travel expert will contact you shortly.</p>${modal ? '<button type="button" class="btn btn-line qx">Close</button>' : ""}</div>
</div>`;
}
function bottomQuote(d) {
  return `<section class="section bottom-q" id="enquiry"><div class="container">
  <div class="reveal"><span class="eyebrow" style="background:rgba(255,255,255,.18);color:#fff">Free custom quote</span>
  <h2>${d ? `Ready for ${d.name}?` : "Ready to plan your trip?"}</h2>
  <p class="lede">Share a few details and our travel expert will build the perfect itinerary around your dates and budget — no obligation.</p>
  <ul class="ticks" style="margin-top:22px;color:#fff"><li>Free custom quote</li><li>Hand-picked stays</li><li>Flexible dates</li><li>Honest advice</li></ul></div>
  <div class="reveal">${form(d, d ? `Plan your ${d.name} trip` : "Tell us where you want to go", "Takes less than a minute.", "")}</div>
</div></section>`;
}
function footer() {
  const li = (g) => D.filter((d) => d.group === g).map((d) => `<li><a href="${d.slug}.html">${d.name}</a></li>`).join("");
  return `<footer class="site-footer"><div class="container">
  <div class="foot">
    <div><a href="index.html" class="logo"><i>✈</i><span class="lt"><b>Going<span>gly</span></b><em>Travel Consciously</em></span></a><p>Curated holidays to Thailand and Himachal Pradesh, planned beautifully.</p></div>
    <div><h4>Thailand</h4><ul>${li("thailand")}</ul></div>
    <div><h4>Himachal</h4><ul>${li("himalayas")}</ul></div>
    <div><h4>Contact</h4><ul><li><a href="about.html">About us</a></li><li><a href="tel:${BIZ.phoneTel}">📞 ${BIZ.phoneShow}</a></li><li><a href="mailto:enquiry@goinggly.in">✉ enquiry@goinggly.in</a></li><li class="addr"><a href="${BIZ.map}" target="_blank" rel="noopener">📍 ${BIZ.street}, ${BIZ.city} ${BIZ.zip}</a></li></ul></div>
  </div>
  <div class="copy"><span>© 2026 ${BIZ.legal} All rights reserved.</span><span>Prices and inclusions are confirmed in your written quote.</span></div>
</div></footer>
<dialog class="qmodal" id="quote-modal"><button type="button" class="qx x" aria-label="Close">×</button>${form(null, "Get a free quote", "Takes less than a minute.", "", true)}</dialog>
<div class="fabs"><a class="fab call" href="tel:${BIZ.phoneTel}" aria-label="Call Goinggly">📞</a><a class="fab" style="background:#25d366" href="#" data-wa aria-label="WhatsApp">💬</a><a class="fab q" href="#quote" data-quote aria-label="Get free quote">✈</a></div>
<script src="main.js?v=${VER}" defer></script>
<script>window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}</script>
<script id="zsiqscript" src="https://salesiq.zohopublic.com/widget?wc=siqdd369953893b6b8c69223a98329cef460e1e5989b7237b17605c684d29519e0c7e55b6cce0ea2b689a085d1c5ec3b2ba" defer></script>
</body>
</html>`;
}
const RV = (i = 0) => ` reveal" style="--d:${(i % 4) * 0.08}s`;
function destCard(d) {
  return `<a class="dest${RV(0)}" href="${d.slug}.html">${ph(`${d.slug}-card.jpg`, `${d.name}, ${d.country}`, d.slug, 800, 600, { inner: `<span class="tag">${d.tag}</span>` })}
  <div class="body"><h3>${d.name}</h3><p>${d.card}</p><span class="go">Explore ${d.name} <span>→</span></span></div></a>`;
}
const inr = (n) => "₹" + n.toLocaleString("en-IN");
function pkgCard(id, k) {
  const b = P.BUILT[id];
  const c = P.CARD[id];
  const city = P.PK[id].stay[0][0];
  const full = `${b.name} (${b.dur.replace(/ /g, "")})`;
  const route = b.routeCities.map((x) => `<span class="rc"><b>${x.name}</b><small>${x.n} ${x.n > 1 ? "nights" : "night"}</small></span>`).join('<i class="ar">→</i>');
  const multi = c.groups.length > 1;
  const groups = c.groups.map(([name, items]) => `<div class="pg">${multi ? `<h5>${name}</h5>` : ""}<ul class="hl">${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("");
  const price = c.price ? `<b>${inr(c.price)}</b><small>per person</small>` : `<b class="onreq">Best price on request</b>`;
  return `<article class="pkg${RV(k)}" id="pkg-${id}">${ph(`pkg-${id}.jpg`, `${b.name} holiday package`, city, 800, 600, { inner: `<span class="dur">${b.dur}</span>${c.tag ? `<span class="ptag">${c.tag}</span>` : ""}` })}
  <div class="body"><h3>${b.name}</h3>
  <div class="route2">${route}</div>
  <div class="pgs">${groups}</div>
  <ul class="pin"><li><span>🏨</span>${c.stay}</li><li><span>🍽</span>${c.meals}</li><li><span>🚐</span>${c.transfers}</li></ul>
  <div class="foot"><div class="price"><small>Starting from</small>${price}</div>
  <a href="#quote" class="btn btn-orange" data-quote data-package="${full}" data-cities="${b.cityNames.join(",")}">Get quote</a></div></div></article>`;
}
const R = require("./reviews.js");
const h = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function reviewsSection(scope, small = false) {
  const items = R.items.filter((r) => r.on.includes(scope));
  if (!items.length) return "";
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
  const cards = items.map((r, i) => {
    const long = r.text.length > (small ? 150 : 330);
    return `<figure class="rv${small ? " sm" : ""}${long ? " long" : ""}${RV(i)}"><div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)}</div><blockquote>${h(r.text)}</blockquote>${long ? '<button type="button" class="rmore">Read more</button>' : ""}<figcaption><b>${h(r.name)}</b><small>${[r.trip, r.when].filter(Boolean).map(h).join(" · ")}</small></figcaption></figure>`;
  }).join("");
  const summary = R.rating && R.count ? `<a class="rsum" href="${R.profileUrl}" target="_blank" rel="noopener"><b>${R.rating}</b><span class="stars">★★★★★</span><small>${R.count} reviews on Google</small></a>` : "";
  const link = R.profileUrl ? `<p class="center" style="margin-top:28px"><a class="btn btn-line" href="${R.profileUrl}" target="_blank" rel="noopener">See all ${R.count || ""} reviews on Google →</a></p>` : "";
  return `<section class="section alt" id="reviews"><div class="container"><div class="section-head center reveal"><span class="eyebrow">Google reviews</span><h2>Loved by our travellers</h2><p class="lede">Real reviews from real Goinggly trips, copied word for word from our Google Business Profile.</p><p class="rnote">Review times are shown as Google displayed them on ${R.capturedOn}.</p>${summary}</div><div class="grid d3 rv-grid${small ? " sm" : ""}">${cards}</div>${link}</div></section>`;
}
const TICKS = `<ul class="ticks"><li>Free custom quote</li><li>Hand-picked hotels</li><li>Airport &amp; local transfers</li><li>Flexible itineraries</li></ul>`;

// ---------- pages ----------
function homePage() {
  const th = D.filter((d) => d.group === "thailand").map(destCard).join("");
  const hm = D.filter((d) => d.group === "himalayas").map(destCard).join("");
  const pk = P.PAGES.home.map((id, k) => pkgCard(id, k)).join("");
  return `${head(SEO.home[0], SEO.home[1], "index.html", "home-hero.jpg", [ORG, SITE])}
${header("home")}
<section class="hero zoom">${ph("home-hero.jpg", "Goinggly holidays", "site", 1600, 900, { eager: true })}
  <div class="container">
    <div><span class="eyebrow">Goinggly · Travel Consciously</span>
    <h1>Your dream holiday, <span style="color:#7fd0ff">planned for you.</span></h1>
    <p class="lede">Beaches, cities, islands and hill stations — handcrafted packages with stays, transfers and sightseeing sorted. Tell us where, we'll do the rest.</p>${TICKS}</div>
    ${form(null, "Get a free quote", "Fill in 30 seconds — our expert will call you.", "quote")}
  </div></section>
<div class="facts"><div class="container"><div class="row">
  <div class="f"><small>Destinations</small><b>6 handpicked</b></div><div class="f"><small>Regions</small><b>Thailand &amp; Himachal</b></div>
  <div class="f"><small>Itineraries</small><b>Fully customisable</b></div><div class="f"><small>Quote</small><b>Free, no obligation</b></div>
</div></div></div>
<section class="section" id="destinations"><div class="container">
  <div class="section-head reveal"><span class="eyebrow">Thailand</span><h2>Beaches, cities &amp; islands</h2><p class="lede">Four unforgettable Thai destinations — mix and match them into one seamless trip.</p></div>
  <div class="grid d4">${th}</div>
  <div class="section-head reveal" style="margin-top:70px"><span class="eyebrow">Himachal Pradesh</span><h2>Hill stations &amp; snow peaks</h2><p class="lede">Cool air, mountain views and cosy evenings in the Himalayas.</p></div>
  <div class="grid d2">${hm}</div>
</div></section>
<section class="section alt"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Popular packages</span><h2>Suggested holiday packages</h2><p class="lede">A few favourites to start with — every package can be customised.</p></div>
  <div class="grid d3 pk-grid">${pk}</div>
  <p class="center" style="margin-top:22px;color:var(--mute);font-size:.8rem">*Starting prices per person. Final price depends on travel dates, hotels and group size.</p>
</div></section>
<section class="section why"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Why Goinggly</span><h2>Travel that feels <span class="grad-u">effortless</span></h2><p class="lede">Premium holidays, planned personally — so you only have to pack.</p></div>
  <div class="why-grid">
    <div class="wcard${RV(0)}"><span class="no">01</span><div class="wic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1z"/></svg></div><h3>Curated, not crowded</h3><p>Stays and experiences we'd choose ourselves.</p></div>
    <div class="wcard${RV(1)}"><span class="no">02</span><div class="wic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg></div><h3>Clear pricing</h3><p>Inclusions spelled out so you know what you get.</p></div>
    <div class="wcard${RV(2)}"><span class="no">03</span><div class="wic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg></div><h3>Fully tailored</h3><p>Dates, pace, budget and group — built around you.</p></div>
    <div class="wcard${RV(3)}"><span class="no">04</span><div class="wic"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3 3 0 010 5.6M18.5 20c0-2.1-.9-4-2.4-5.2"/></svg></div><h3>Real people</h3><p>Talk to a planner before you book.</p></div>
  </div>
  <div class="trust reveal">
    <a href="${R.profileUrl}" target="_blank" rel="noopener"><b>${R.rating}</b><span class="stars">★★★★★</span><small>${R.count} Google reviews</small></a>
    <span><i>📍</i><small>Based in Lucknow</small></span>
    <span><i>🌏</i><small>6 handpicked destinations</small></span>
    <span><i>🧾</i><small>Free custom quote</small></span>
  </div></div></section>
<section class="section alt"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">How it works</span><h2>From idea to boarding pass</h2></div>
  <div class="grid d3 steps">
    <div class="step${RV(0)}"><h3>Tell us your plan</h3><p>Share your destination, dates and group size.</p></div>
    <div class="step${RV(1)}"><h3>Get your itinerary</h3><p>We send a tailored day-by-day plan and quote.</p></div>
    <div class="step${RV(2)}"><h3>Pack &amp; go</h3><p>Confirm, relax and enjoy — we handle the logistics.</p></div>
  </div></div></section>
${reviewsSection("home")}
${bottomQuote(null)}
${footer()}`;
}

function aboutPage() {
  return `${head(SEO.about[0], SEO.about[1], "about.html", "about-hero.jpg", [ORG])}
${header("about")}
<section class="page-hero"><div class="container">
  <div><span class="eyebrow">About us</span><h1>Goinggly — Travel <span class="accent">Consciously.</span></h1>
  <p class="lede" style="margin-top:14px">Goinggly is a travel company that designs premium holidays to Thailand and Himachal Pradesh — with the details handled so you can simply enjoy the trip.</p>
  <div style="margin-top:22px"><a href="#quote" class="btn btn-orange">Get a free quote</a></div></div>
  ${ph("about-hero.jpg", "Goinggly travellers", "site", 1000, 750, { eager: true })}
</div></section>
<section class="section"><div class="container two" style="align-items:center">
  ${ph("about-story.jpg", "Our story", "site", 800, 600, { cls: "reveal", style: "min-height:320px;border-radius:24px" })}
  <div class="reveal"><span class="eyebrow">Our story</span><h2 style="margin-bottom:14px">Built around the way you like to travel</h2>
  <p class="lede" style="margin-bottom:12px">We started Goinggly with a simple idea: a great holiday should feel effortless from the first message to the flight home.</p>
  <p class="lede">So we focus on a small set of destinations we know well — Bangkok, Pattaya, Phuket and Krabi in Thailand, and Shimla and Manali in Himachal Pradesh — and plan each trip personally.</p></div>
</div></section>
<section class="section alt"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">What we stand for</span><h2>Our promise</h2></div>
  <div class="grid d3">
    <div class="feat${RV(0)}"><div class="ic">✨</div><h3>Premium, without the fuss</h3><p>Well-chosen stays and experiences, planned end to end.</p></div>
    <div class="feat${RV(1)}"><div class="ic">🤝</div><h3>Honest advice</h3><p>We'll tell you when to go, what to skip and what's worth it.</p></div>
    <div class="feat${RV(2)}"><div class="ic">🗺️</div><h3>Made for you</h3><p>No two itineraries are the same — yours is built around your group.</p></div>
  </div></div></section>
${reviewsSection("about", true)}
<div id="quote"></div>
${bottomQuote(null)}
${footer()}`;
}

function destPage(d) {
  const spots = d.highlights.map((h, i) => `<div class="feat img${RV(i)}">${ph(`${d.slug}-spot-${i + 1}.jpg`, h[1], d.slug, 800, 600)}<div class="t"><h3>${h[1]}</h3><p>${h[2]}</p></div></div>`).join("");
  const pk = P.PAGES[d.slug].map((id, i) => pkgCard(id, i)).join("");
  const it = d.itinerary.map((x) => `<div class="day reveal"><div class="box"><small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p></div></div>`).join("");
  const fq = d.faq.map((q) => `<details class="reveal"><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join("");
  const sameGroup = D.filter((x) => x.slug !== d.slug && x.group === d.group);
  const extra = D.filter((x) => x.group !== d.group);
  const rel = sameGroup.concat(extra).slice(0, 3).map(destCard).join("");
  const facts = d.facts.map((f) => `<div class="f"><small>${f[0]}</small><b>${f[1]}</b></div>`).join("");
  return `${head(`${d.name} Tour Packages | Free Custom Quote – Goinggly`, `Book ${d.name} tour packages with Goinggly — hand-picked hotels, transfers and sightseeing included. Get a free custom quote today.`, d.slug + ".html", d.slug + "-hero.jpg", destSchema(d))}
${header("")}
<section class="hero">${ph(`${d.slug}-hero.jpg`, `${d.name}, ${d.country}`, d.slug, 1600, 900, { eager: true })}
  <div class="container">
    <div><p class="crumbs"><a href="index.html">Home</a> / <a href="index.html#destinations">Destinations</a> / ${d.name}</p>
    <span class="eyebrow">${d.tag}</span>
    <h1>${d.h1.replace(/class="grad"/g, 'style="color:#7fd0ff"')}</h1>
    <p class="lede">${d.lede}</p>${TICKS}</div>
    ${form(d, `Get a free ${d.name} quote`, "Fill in 30 seconds — our expert will call you.", "quote")}
  </div></section>
<div class="facts"><div class="container"><div class="row">${facts}</div></div></div>
<section class="section alt" id="packages"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Suggested packages</span><h2>${d.name} holiday packages</h2><p class="lede">Pick a starting point — we'll customise hotels, dates and activities for you.</p></div>
  <div class="grid d3 pk-grid">${pk}</div>
  <p class="center" style="margin-top:22px;color:var(--mute);font-size:.8rem">*Starting prices per person. Final price depends on travel dates, hotels and group size.</p>
</div></section>
<section class="section"><div class="container">
  <div class="section-head reveal"><span class="eyebrow">Highlights</span><h2>Why visit ${d.name}</h2><p class="lede">The experiences travellers love most — all easy to build into your trip.</p></div>
  <div class="grid d3">${spots}</div></div></section>
<section class="section alt" id="itinerary"><div class="container">
  <div class="section-head center reveal"><span class="eyebrow">Sample itinerary</span><h2>${d.itinerary.length} days in ${d.name}</h2><p class="lede">A starting point — we tailor every day to your dates, pace and budget.</p></div>
  <div class="itin">${it}</div></div></section>
<section class="section"><div class="container two">
  <div class="panel reveal"><h3>What's typically included</h3><ul><li>${d.group === "thailand" ? "4★ hotel stay with daily breakfast" : "3★ & 4★ hotel stay with breakfast & dinner"}</li><li>Airport and sightseeing transfers</li><li>Guided tours and entry as per itinerary</li><li>Local support during your trip</li></ul></div>
  <div class="panel no reveal"><h3>Usually not included</h3><ul><li>Flights to and from your city</li><li>Visa and travel insurance (we can assist)</li><li>Meals not mentioned in the itinerary</li><li>Personal expenses and optional activities</li></ul></div>
</div></section>
<section class="section alt"><div class="container" style="max-width:860px"><div class="reveal"><h2 style="margin-bottom:12px">${d.name} holiday packages by Goinggly</h2><p class="lede" style="max-width:none">${INTRO[d.slug]}</p></div></div></section>
<section class="section"><div class="container" style="max-width:820px">
  <div class="section-head center reveal"><span class="eyebrow">FAQs</span><h2>Good to know</h2></div>${fq}</div></section>
${reviewsSection(d.group === "thailand" ? "thailand" : "himachal")}
<section class="section"><div class="container">
  <div class="section-head reveal"><span class="eyebrow">Keep exploring</span><h2>More destinations you'll love</h2></div>
  <div class="grid d3">${rel}</div></div></section>
${bottomQuote(d)}
${footer()}`;
}

// ---------- write pages ----------
fs.mkdirSync(path.join(OUT, "images"), { recursive: true });
const write = (f, c) => fs.writeFileSync(path.join(OUT, f), c);
write("index.html", homePage());
write("about.html", aboutPage());
D.forEach((d) => write(d.slug + ".html", destPage(d)));

// SEO files
const today = new Date().toISOString().slice(0, 10);
const urls = ["", "about.html", ...D.map((d) => d.slug + ".html")];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === "" ? "1.0" : u === "about.html" ? "0.5" : "0.9"}</priority></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
write("404.html", `${head("Page not found – Goinggly", "This page could not be found.", "404.html", "home-hero.jpg").replace('content="index, follow, max-image-preview:large"', 'content="noindex"')}
${header("").replace(/href="#quote"/g, 'href="index.html#quote"')}
<section class="section"><div class="container center"><span class="eyebrow">Error 404</span><h1>This trip took a wrong turn.</h1>
<p class="lede" style="margin:14px auto 24px">The page you're looking for isn't here. Let's get you back on the road.</p>
<a class="btn btn-orange" href="index.html">Back to home</a></div></section>
${footer()}`);

// ---------- IMAGE-BRIEF.md (outside the repo: parent folder) — lists only images that are still missing ----------
const HERO_P = {
  shimla: "Shimla hill station at dusk: cedar and pine forest, Christ Church on the Ridge, misty Himalayan foothills, warm lights",
  manali: "Snow-capped Himalayan peaks above the Manali valley with pine forest, crisp winter morning light",
};
const style = "Photorealistic travel photography, natural light, vibrant but realistic colours, no text, no logos, no watermark.";
const have = new Set(fs.readdirSync(path.join(OUT, "images")));
const rows = []; // {group, file, size, use, show}
const add = (group, file, size, use, show) => { if (!have.has(file)) rows.push({ group, file, size, use, show }); };
add("Home", "home-hero.jpg", "1600×900", "Top banner behind headline + form", "Aspirational wide holiday scene");
add("About", "about-hero.jpg", "1000×750", "Top-right banner image", "Happy group of friends/family travelling together");
add("About", "about-story.jpg", "800×600", "Our story section", "Travel planner's desk: map, laptop, passports, coffee");
D.forEach((d) => {
  const g = `${d.name} — ${d.slug}.html`;
  add(g, `${d.slug}-hero.jpg`, "1600×900", `Top banner of the ${d.name} page`, HERO_P[d.slug] || d.lede.replace(/<[^>]+>/g, ""));
  add(g, `${d.slug}-card.jpg`, "800×600", `${d.name} card on Home and "More destinations"`, `Iconic, bright view of ${d.name}`);
  d.highlights.forEach((h, i) => add(g, `${d.slug}-spot-${i + 1}.jpg`, "800×600", `Highlight: ${h[1]}`, `${h[1]} in ${d.name} — ${h[2]}`));
});
Object.keys(P.PK).forEach((id) => {
  const pages = Object.entries(P.PAGES).filter(([, ids]) => ids.includes(id)).map(([pg]) => pg).join(", ");
  add("Packages (shared across pages)", `pkg-${id}.jpg`, "800×600", `Package card: ${P.BUILT[id].name} (${P.BUILT[id].dur}) — pages: ${pages}`, P.PK[id].img);
});
let md = `# Goinggly — Images still needed\n\nSave each image in \`C:\\Goinggly.in\\Goinggly.in\\images\\\` with the **exact file name** shown (all \`.jpg\`). Until a file exists the page shows a labelled placeholder.\n\n`;
md += `**Status:** ${have.size - (have.has(".gitkeep") ? 1 : 0)} images are already in place (all Thailand). **${rows.length} still needed.**\n\n`;
md += `## Rules\n- **Format:** JPG, quality ~75–80, **under 200 KB each** (hero under 300 KB).\n- **Heroes:** the site adds a dark-blue overlay with text on the left and the enquiry form on the right — keep the subject in the centre.\n- Avoid logos, text or watermarks inside images.\n- **AI style hint:** "${style}"\n\n`;
const groups = [...new Set(rows.map((r) => r.group))];
if (!rows.length) md += "Nothing missing — all image slots are filled.\n";
groups.forEach((g) => {
  md += `## ${g}\n| File | Size | Used for | What it should show |\n|---|---|---|---|\n`;
  rows.filter((r) => r.group === g).forEach((r) => { md += `| ${r.file} | ${r.size} | ${r.use} | ${r.show} |\n`; });
  md += `\n`;
});
fs.writeFileSync(path.join(__dirname, "IMAGE-BRIEF.md"), md);
console.log("Images still missing:", rows.length);
try { fs.unlinkSync(path.join(OUT, "images", "README.txt")); } catch (e) {}
console.log("Wrote", 2 + D.length, "pages + sitemap, robots, 404, IMAGE-BRIEF.md");
