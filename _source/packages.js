// Package library + day-by-day itinerary builder.
// Itineraries follow the pattern used by popular India-market Thailand / Himachal packages
// (Pattaya first from Bangkok airport, Coral Island, Bangkok temples, Phi Phi, Four Islands, Solang + Atal Tunnel ...).

const CITY = {
  bangkok: {
    name: "Bangkok",
    arr: "Evening is free — try the riverside Asiatique night bazaar or Chinatown street food (optional).",
    dep: "Enjoy a free morning for last-minute shopping or a Thai massage.",
    days: [
      ["Grand Palace, Wat Pho & Wat Arun", "Explore the Grand Palace and the giant Reclining Buddha at Wat Pho, then cross the river to Wat Arun. Evening street-food trail in Yaowarat (Chinatown). Dress modestly — shoulders and knees covered at temples."],
      ["Floating market & Chao Phraya dinner cruise", "Morning visit to a traditional floating market (Damnoen Saduak or Amphawa). Free afternoon, then a Chao Phraya River dinner cruise with skyline views."],
      ["Safari World & shopping", "Full-day Safari World and Marine Park — drive-through safari, dolphin and stunt shows. Evening shopping at MBK or Siam Paragon."],
      ["Free day in Bangkok", "Leisure day for Chatuchak Weekend Market (Sat–Sun), Jim Thompson House, a rooftop sunset or more shopping."],
    ],
  },
  pattaya: {
    name: "Pattaya",
    arr: "Check in and unwind. Evening at Pattaya Beach Road; optionally catch the Alcazar cabaret show.",
    dep: "Enjoy a leisurely breakfast and a last stroll along the beach.",
    days: [
      ["Coral Island (Koh Larn) by speedboat", "Speedboat to Coral Island for white-sand beaches, with optional parasailing, jet-ski and banana-boat rides. Buffet lunch on the island, back in Pattaya by evening."],
      ["Pattaya city sights", "Sanctuary of Truth, Big Buddha Hill, Pattaya Viewpoint and a gem gallery stop. Evening at Walking Street (optional)."],
      ["Nong Nooch Garden & Floating Market", "Tropical gardens with elephant and cultural shows at Nong Nooch, followed by the Pattaya Floating Market for snacks and souvenirs."],
      ["Free day in Pattaya", "Leisure day — optional Art in Paradise, a tiger park or simply the beach."],
    ],
  },
  phuket: {
    name: "Phuket",
    arr: "Check in and catch the sunset at Kata or Karon beach.",
    dep: "Enjoy a relaxed morning at the beach before check-out.",
    days: [
      ["Phi Phi Islands by speedboat", "Full-day speedboat trip to Phi Phi with snorkelling, beaches and lunch on the island. Maya Bay access depends on current park rules; the national park fee (about 400 THB) is paid locally."],
      ["Phang Nga Bay & James Bond Island", "Cruise through the limestone towers of Phang Nga Bay, sea-canoe into caves and visit James Bond Island and a floating village."],
      ["Phuket city tour & Promthep Cape sunset", "Big Buddha, Wat Chalong and Old Phuket Town's Sino-Portuguese streets, then sunset at Promthep Cape."],
      ["Free day on the beach", "Leisure day on Kata, Karon or Patong — optional Simon Cabaret in the evening."],
    ],
    lux: [
      ["Private speedboat to Phi Phi & Khai Islands", "Skip the crowds with a private speedboat — snorkelling, quiet beaches and a seaside lunch. The national park fee (about 400 THB) is paid locally."],
      ["Private longtail through Phang Nga Bay", "A private boat through Phang Nga Bay with sea-canoeing, James Bond Island and a relaxed lunch."],
      ["Island sights, spa & sunset dinner", "Big Buddha and Old Phuket Town with your private guide, a Thai spa session, then a beachfront sunset dinner."],
      ["Leisure at your resort", "A free day to enjoy the resort pool and beach, or add a sunset catamaran cruise (optional)."],
    ],
  },
  krabi: {
    name: "Krabi",
    arr: "Check in. Sunset at Ao Nang beach and an evening stroll through the night market.",
    dep: "Free morning at the beach or pool.",
    days: [
      ["Four Islands tour by longtail", "Longtail and speedboat day hopping between Koh Poda, Chicken Island, Koh Tup and Phra Nang Cave Beach with snorkelling and a beach lunch."],
      ["Emerald Pool, Hot Springs & Tiger Cave Temple", "Swim in the jungle's blue-green Emerald Pool, soak in the hot springs and climb (optional) to Tiger Cave Temple for sweeping views."],
      ["Railay Beach & mangrove kayaking", "Longtail boat to Railay and Phra Nang beaches, then paddle the mangrove channels and lagoons of Ao Thalane (optional)."],
      ["Free day in Ao Nang", "Leisure day — shopping, spa, or an optional Hong Islands trip."],
    ],
    lux: [
      ["Private longtail to the Four Islands", "A private longtail around Koh Poda, Chicken Island and Phra Nang Cave with snorkelling and a quiet beach lunch."],
      ["Emerald Pool & Hot Springs with a private guide", "Visit the Emerald Pool and Hot Springs at an unhurried pace with your own guide and vehicle."],
      ["Railay by private boat & spa", "Private boat to Railay and Phra Nang, then an afternoon Thai spa session."],
      ["Leisure at your resort", "A free day to enjoy the resort, or add a sunset kayak at Ao Thalane (optional)."],
    ],
  },
  shimla: {
    name: "Shimla",
    arr: "Check in and take an evening walk on Mall Road and the Ridge. (Optional: arrive by the UNESCO Kalka–Shimla toy train, subject to availability.)",
    dep: "Free morning for last-minute shopping on Mall Road.",
    days: [
      ["Shimla sightseeing", "Jakhu Temple, Christ Church on the Ridge, Mall Road and the Viceregal Lodge (Indian Institute of Advanced Study)."],
      ["Kufri & Mashobra", "Day trip to Kufri for viewpoints, pony rides and the Himalayan Nature Park (snow activities in winter), then the cedar forests of Mashobra."],
      ["Naldehra & Tattapani", "Drive to Naldehra for its meadows and historic golf course; time for horse riding and picnic spots."],
      ["Free day in Shimla", "Leisure day for cafés, shopping or an optional Chadwick Falls visit."],
    ],
  },
  manali: {
    name: "Manali",
    arr: "Check in and unwind. Evening at Mall Road and Hadimba Temple.",
    dep: "Free morning for a walk through Old Manali's cafés.",
    days: [
      ["Solang Valley adventure", "Solang Valley for snow activities and skiing in winter, or paragliding, ropeway and zorbing in warmer months."],
      ["Atal Tunnel & Sissu", "Drive through the Atal Tunnel to the Lahaul valley and Sissu. Subject to road, tunnel and weather conditions; Rohtang Pass is permit-based and seasonal."],
      ["Manali local sightseeing", "Hadimba Temple, Manu Temple, Vashisht hot springs and Old Manali's riverside cafés."],
      ["Naggar Castle & Jogini Falls", "Visit Naggar Castle and the Roerich Gallery, then a short walk to Jogini Falls."],
    ],
    lux: null,
  },
};

const TRANSFER = {
  "air>bangkok": "Arrive at Bangkok airport, meet our representative and transfer to your hotel.",
  "air>pattaya": "Arrive at Bangkok airport and drive to Pattaya (approx. 2 hrs).",
  "air>phuket": "Arrive at Phuket airport and transfer to your hotel.",
  "air>krabi": "Arrive at Krabi airport and transfer to your hotel.",
  "pattaya>bangkok": "Check out and drive to Bangkok (approx. 2 hrs).",
  "bangkok>phuket": "Transfer to Bangkok airport for your flight to Phuket (approx. 1 hr 25 min).",
  "bangkok>krabi": "Transfer to Bangkok airport for your flight to Krabi (approx. 1 hr 25 min).",
  "phuket>krabi": "Check out and transfer by road to Krabi (approx. 2.5–3 hrs).",
  "krabi>bangkok": "Transfer to Krabi airport for your flight to Bangkok (approx. 1 hr 25 min).",
  "air>shimla": "Pick-up from Chandigarh and drive to Shimla (approx. 3.5 hrs).",
  "air>manali": "Pick-up from Bhuntar airport or Kullu and drive to Manali.",
  "shimla>manali": "Check out and drive to Manali (approx. 7–8 hrs), with stops at Pandoh Dam and Beas river viewpoints.",
};

const THAI_STD = ["Hotels", "Daily breakfast", "Airport transfers", "Sightseeing"];
const THAI_LUX = ["5★ resort", "Daily breakfast", "Private transfers", "Spa session"];
const HP_STD = ["Hotels", "Daily breakfast", "Private cab", "Sightseeing"];

// id -> package. stay: [city, nights]. lux: use luxury day pool. extra: {dayNumber: text appended}
const PK = {
  bkk: { name: "Bangkok Delight", stay: [["bangkok", 4]], tags: THAI_STD, img: "Bangkok skyline with Wat Arun and the Chao Phraya river at sunset" },
  "bkk-pty": { name: "Bangkok & Pattaya Classic", stay: [["pattaya", 3], ["bangkok", 2]], tags: THAI_STD, img: "Split scene: Coral Island beach in Pattaya and a golden Bangkok temple" },
  "bkk-hkt": { name: "Bangkok & Phuket Combo", stay: [["bangkok", 2], ["phuket", 4]], tags: THAI_STD, img: "Split scene: Bangkok temple and a Phuket beach with a longtail boat" },
  "bkk-pty-hkt": { name: "Bangkok, Pattaya & Phuket", stay: [["pattaya", 2], ["bangkok", 2], ["phuket", 3]], tags: THAI_STD, img: "Three-part collage: Bangkok temple, Pattaya Coral Island, Phuket Phi Phi cliffs" },
  all4: { name: "Thailand Grand Tour", stay: [["pattaya", 2], ["bangkok", 2], ["phuket", 3], ["krabi", 2]], tags: THAI_STD, img: "Four-part collage: Bangkok temple, Pattaya beach, Phuket cliffs, Krabi Railay beach" },
  pty: { name: "Pattaya Honeymoon Getaway", stay: [["pattaya", 3]], tags: THAI_STD, img: "Coral Island beach with speedboats and travellers, Pattaya" },
  pty2: { name: "Pattaya Fun Special", stay: [["pattaya", 4]], tags: THAI_STD, img: "Sanctuary of Truth wooden temple by the sea at golden hour, Pattaya" },
  hkt: { name: "Phuket Escapade", stay: [["phuket", 4]], tags: THAI_STD, img: "Phuket beach cove with turquoise water and a longtail boat" },
  "hkt-lux": { name: "Phuket Luxury Retreat", stay: [["phuket", 5]], lux: true, tags: THAI_LUX, extra: { 4: "Evening: romantic beachfront dinner at your resort." }, img: "Luxury Phuket beachfront resort with infinity pool at sunset" },
  "hkt-kbi": { name: "Phuket & Krabi Combo", stay: [["phuket", 3], ["krabi", 3]], tags: THAI_STD, img: "Split scene: Phi Phi cliffs in Phuket and Railay Beach in Krabi" },
  kbi: { name: "Krabi Escape", stay: [["krabi", 3]], tags: THAI_STD, img: "Railay Beach with limestone cliffs and a longtail boat, Krabi" },
  "kbi-lux": { name: "Krabi Luxury Retreat", stay: [["krabi", 4]], lux: true, tags: THAI_LUX, extra: { 3: "Evening: candlelight dinner on the beach." }, img: "Luxury Krabi resort pool overlooking limestone cliffs at sunset" },
  "kbi-bkk": { name: "Krabi & Bangkok", stay: [["krabi", 3], ["bangkok", 3]], tags: THAI_STD, img: "Split scene: Krabi limestone islands and Bangkok Grand Palace" },
  "hkt-kbi-bkk": { name: "Phuket, Krabi & Bangkok", stay: [["phuket", 3], ["krabi", 3], ["bangkok", 2]], tags: THAI_STD, img: "Three-part collage: Phuket beach, Krabi islands, Bangkok temple" },
  "shl-wk": { name: "Shimla Weekend", stay: [["shimla", 2]], tags: HP_STD, img: "Shimla Ridge and Christ Church with misty pine hills" },
  "shl-cls": { name: "Shimla Honeymoon", stay: [["shimla", 3]], tags: HP_STD, img: "Kufri snowy pine forest near Shimla with travellers" },
  "shl-fam": { name: "Shimla Family Holiday", stay: [["shimla", 4]], tags: HP_STD, img: "Happy Indian family with kids on Shimla Mall Road in woollens" },
  "shl-mnl": { name: "Shimla Manali Tour Package", stay: [["shimla", 3], ["manali", 3]], tags: ["2 Hotels", "Daily breakfast", "Private cab", "Sightseeing"], img: "Split scene: Shimla Ridge and snow-capped Manali peaks" },
  mnl: { name: "Manali Escape", stay: [["manali", 3]], tags: HP_STD, img: "Manali valley with snow peaks and pine forest" },
  "mnl-adv": { name: "Manali Adventure", stay: [["manali", 4]], tags: HP_STD, img: "Solang Valley with paragliders over snowy meadows, Manali" },
  "mnl-hm": { name: "Manali Honeymoon", stay: [["manali", 5]], tags: ["Resort stay", "Daily breakfast", "Private cab", "Candlelight dinner"], extra: { 4: "Evening: candlelight dinner for two." }, img: "Romantic couple (seen from behind) at a Manali mountain resort with snow peaks" },
};

// which packages appear on which page
const PAGES = {
  bangkok: ["bkk-pty", "bkk-hkt", "all4"],
  pattaya: ["bkk-pty", "pty", "all4"],
  phuket: ["hkt-kbi", "bkk-hkt", "all4"],
  krabi: ["hkt-kbi", "kbi-bkk", "all4"],
  shimla: ["shl-cls", "shl-fam", "shl-mnl"],
  manali: ["mnl", "mnl-adv", "shl-mnl"],
  home: ["bkk-pty", "all4", "shl-mnl"],
};

function build(id) {
  const p = PK[id];
  const nights = p.stay.reduce((a, s) => a + s[1], 0);
  const days = [];
  let prev = null;
  p.stay.forEach(([city, n], si) => {
    const c = CITY[city];
    let tin = TRANSFER[`${prev || "air"}>${city}`];
    if (p.lux && !prev) tin = tin.replace("transfer to your hotel", "take a private transfer to your 5★ resort");
    if (si === 0) {
      const first = city === "pattaya" ? "Arrive Bangkok & drive to Pattaya" : `Arrive in ${c.name}`;
      days.push([first, `${tin} ${c.arr}`]);
    } else {
      days.push([`${CITY[prev].name} → ${c.name}`, `${CITY[prev].dep} ${tin} ${c.arr}`]);
    }
    const pool = p.lux && c.lux ? c.lux : c.days;
    for (let k = 1; k < n; k++) days.push(pool[k - 1]);
    prev = city;
  });
  const lastCity = CITY[prev];
  const thai = ["bangkok", "pattaya", "phuket", "krabi"].includes(prev);
  days.push(["Departure", `${lastCity.dep} Breakfast, check-out and ${thai ? "airport transfer for your flight home" : "drop for your onward journey"}.`]);
  if (p.extra) for (const [d, t] of Object.entries(p.extra)) days[d - 1][1] += " " + t;
  const hl = [];
  if (p.stay.length > 1) p.stay.forEach(([c]) => { const cc = CITY[c]; hl.push((p.lux && cc.lux ? cc.lux : cc.days)[0][0]); });
  else { const cc = CITY[p.stay[0][0]]; (p.lux && cc.lux ? cc.lux : cc.days).slice(0, Math.min(3, p.stay[0][1] - 1)).forEach((x) => hl.push(x[0])); }
  return {
    highlights: hl,
    routeCities: p.stay.map(([c, n]) => ({ name: CITY[c].name, n })),
    cityNames: p.stay.map(([c]) => CITY[c].name),
    id, name: p.name, nights, daysN: nights + 1,
    dur: `${nights}N / ${nights + 1}D`,
    route: p.stay.map(([c, n]) => `${CITY[c].name} ${n}N`),
    tags: p.tags, img: p.img, lux: !!p.lux, days: days.map(([t, x], i) => ({ n: i + 1, t, x })),
  };
}
const BUILT = Object.fromEntries(Object.keys(PK).map((id) => [id, build(id)]));

// ---- Card content (as dictated by the owner) -------------------------------------------
const TH = { stay: "4★ hotel stay", meals: "Daily breakfast", transfers: "Airport & sightseeing transfers" };
const HP = { stay: "3★ & 4★ hotel stay", meals: "Breakfast & dinner included", transfers: "Daily & round-trip transfers" };
const BKK3 = ["Chao Phraya evening dinner cruise", "Safari World & Marine Park", "City tour: Grand Palace, Wat Pho & Wat Arun"];
// price = "starting from" per person in INR; null = shown as "Best price on request" until confirmed
const CARD = {
  "bkk-pty": { ...TH, price: 29999, groups: [["Pattaya", ["Coral Island (Koh Larn) by speedboat"]], ["Bangkok", BKK3]] },
  "bkk-hkt": { ...TH, price: 34999, groups: [["Bangkok", BKK3], ["Phuket", ["Phi Phi Island tour", "Mario Kart & Hanuman World"]]] },
  all4: { ...TH, price: 45999, groups: [["Pattaya", ["Coral Island tour", "Pattaya Floating Market"]], ["Bangkok", BKK3], ["Phuket", ["Phi Phi Island tour", "Phuket city tour & Big Buddha"]], ["Krabi", ["Four Islands tour"]]] },
  pty: { ...TH, price: 19999, tag: "Honeymoon", groups: [["Pattaya", ["Coral Island (Koh Larn) tour", "Pattaya Floating Market", "Sanctuary of Truth", "Sunset at Pattaya Viewpoint"]]] },
  "hkt-kbi": { ...TH, price: 29999, groups: [["Phuket", ["Phi Phi Island tour", "Mario Kart & Hanuman World", "Phuket city tour & Big Buddha"]], ["Krabi", ["Four Islands tour"]]] },
  "kbi-bkk": { ...TH, price: 34999, groups: [["Krabi", ["Four Islands tour", "Emerald Pool & jungle hot springs"]], ["Bangkok", BKK3]] },
  "shl-cls": { ...HP, price: 9999, tag: "Honeymoon", groups: [["Shimla", ["Shimla sightseeing", "Kufri & Mashobra", "Candlelight dinner for two"]]] },
  "shl-fam": { ...HP, price: 14999, tag: "Family", groups: [["Shimla", ["Shimla sightseeing", "Kufri & Mashobra", "Naldehra & Tattapani"]]] },
  "shl-mnl": { ...HP, price: 19999, groups: [["Shimla", ["Shimla sightseeing", "Kufri & Mashobra"]], ["Manali", ["Solang Valley adventure", "Atal Tunnel & Sissu"]]] },
  mnl: { ...HP, price: 9999, groups: [["Manali", ["Solang Valley adventure", "Atal Tunnel & Sissu", "Manali local sightseeing"]]] },
  "mnl-adv": { ...HP, price: 14999, tag: "Adventure", groups: [["Manali", ["Solang Valley adventure", "Atal Tunnel & Sissu", "Manali local sightseeing"]]] },
};

module.exports = { PK, PAGES, BUILT, CITY, CARD };
