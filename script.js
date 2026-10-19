/* ============ AYARLAR: yalnızca bu bölümü düzenleyin ============ */
const CONFIG = {
  phoneDisplay: "0 5XX XXX XX XX",          // Sayfada görünen telefon
  phoneTel:     "+905XXXXXXXXX",            // Arama linki için (boşluksuz)
  whatsapp:     "905XXXXXXXXX",             // WhatsApp numarası (başında + olmadan, 90 ile)
  address:      "Klinik adresi buraya yazılacak",
  mapQuery:     "MKK Dent",                 // Harita arama ifadesi (tam adres yazarsanız daha doğru olur)
  formEndpoint: "",                         // İsteğe bağlı: Formspree vb. adresi. Boşsa talep WhatsApp ile gönderilir.
  // Haftanın günleri: 0 Pazar ... 6 Cumartesi. null = kapalı. [açılış, kapanış]
  schedule: { 0:null, 1:["09:00","18:00"], 2:["09:00","18:00"], 3:["09:00","18:00"], 4:["09:00","18:00"], 5:["09:00","18:00"], 6:["09:00","14:00"] },
  lunch: ["12:30","13:30"],                 // Hafta içi öğle arası (randevu verilmez)
  slotMinutes: 30,
  daysAhead: 21
};
/* ================================================================= */

const $ = (s, r=document) => r.querySelector(s); const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const dayNames = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cl = (x, a=0, b=1) => Math.min(b, Math.max(a, x));

/* ---- İletişim bilgileri ---- */
$$('[data-bind="phone-link"]').forEach(a => { a.textContent = a.classList.contains("btn") ? "Ara" : CONFIG.phoneDisplay; a.href = "tel:" + CONFIG.phoneTel; }); $$
('[data-bind="address"]').forEach(el => el.textContent = CONFIG.address);
$("#map").src = "https://maps.google.com/maps?q=" + encodeURIComponent(CONFIG.mapQuery) + "&hl=tr&z=16&output=embed";
$("#directions").href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CONFIG.mapQuery);
$("#year").textContent = new Date().getFullYear();

$("#hours").innerHTML = [1,2,3,4,5,6,0].map(d => {
  const s = CONFIG.schedule[d];
  return `<tr><td>${dayNames[d]}</td><td class="${s ? "" : "closed"}">${s ? s[0] + " – " + s[1] : "Kapalı"}</td></tr>`;
}).join("");

/* ---- Üst bar ---- */
const topbar = $("#topbar");
const onTop = () => topbar.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onTop, { passive:true }); onTop();

/* ---- Görünürlük animasyonları ---- */
if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold:.12, rootMargin:"0px 0px -6% 0px" });
  $$(".reveal").forEach(el => io.observe(el)); } else { $$
(".reveal").forEach(el => el.classList.add("in")); }

/* ---- Hero: fare ile hafif paralaks ---- */
const heroArt = $("#heroArt"); if (heroArt && !reduced && window.matchMedia("(pointer:fine)").matches) { window.addEventListener("mousemove", e => { const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2; heroArt.style.setProperty("--mx", (x * -14).toFixed(1) + "px"); heroArt.style.setProperty("--my", (y * -10).toFixed(1) + "px"); }, { passive:true }); } if (reduced) $$("animateMotion").forEach(n => n.remove());

/* ---- İmplant parçaları (çizim) ---- */
const FIX_D = "M -29 0 L 29 0 L 29 6 L 25 12 L 20 106 Q 19 116 0 118 Q -19 116 -20 106 L -25 12 L -29 6 Z";
const ABUT_D = "M -23 0 L 23 0 L 23 -6 L 17 -12 L 14 -64 Q 14 -68 10 -68 L -10 -68 Q -14 -68 -14 -64 L -17 -12 L -23 -6 Z";
function threadLines(){
  let s = "";
  for (let y = -24; y <= 140; y += 10) s += `<path d="M-32 ${y+3} L32 ${y-3}" stroke="#4E5A62" stroke-width="2.4" opacity=".75"/><path d="M-32 ${y+5.2} L32 ${y-.8}" stroke="#F4F7F8" stroke-width="1" opacity=".55"/>`;
  return s;
}
const fixtureSVG = (id, spin) => `<clipPath id="cp-${id}"><path d="${FIX_D}"/></clipPath><path d="${FIX_D}" fill="url(#gTi)" stroke="#5A666E" stroke-width="1"/><g clip-path="url(#cp-${id})"><g class="threads${spin ? " spin-threads" : ""}">${threadLines()}</g></g><rect x="-12" y="0" width="24" height="5" rx="2" fill="#3A444A"/>`;
const abutmentSVG = () => `<path d="${ABUT_D}" fill="url(#gGold)" stroke="#7A5C27" stroke-width="1"/><path d="M -9 -60 L -10 -16" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>`;
const crownSVG = () => `<use href="#shCrown" fill="url(#gPorc)" stroke="#BDAF94" stroke-width="1.2"/><path d="M -2 -146 C -4 -120 2 -100 0 -84" fill="none" stroke="#BDAF94" stroke-width="1.4" stroke-linecap="round"/><path d="M -52 -110 C -58 -90 -56 -60 -50 -42" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="6" stroke-linecap="round"/>`;
const badgeSVG = (n, x, y) => `<g class="badge" data-i="${n}" transform="translate(${x} ${y})"><circle r="14"/><text>${n}</text></g>`;

$("#hero-fixture").innerHTML = fixtureSVG("h", true);
$("#hero-abutment").innerHTML = abutmentSVG();
$("#hero-crown").innerHTML = crownSVG();

const pf = $("#p-fixture"), pa = $("#p-abutment"), pc = $("#p-crown");
pf.innerHTML = fixtureSVG("s", false) + badgeSVG(1, 50, 24);
pa.innerHTML = abutmentSVG() + badgeSVG(2, 40, -40);
pc.innerHTML = crownSVG() + badgeSVG(3, 102, -92);
const sparksG = $("#sparks");
sparksG.innerHTML = Array.from({length:14}, () => `<circle r="3" fill="#F2E1B8" opacity="0"/>`).join("");
const sparks = $$("#sparks circle");
const threads = $(".threads", pf);

/* ---- İmplant sahnesi: kaydırma ilerlemesi ---- */
const imp = $("#implant"), steps = $$("#vsteps li"), counter = $("#counter"), rail = $("#vsteps");
const halo = $("#halo"), collarA = $("#collarA"), collarC = $("#collarC"), target = $("#target"); const badges = $$(".badge", imp);
const easeIO = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const easeBack = t => { const c1 = .8, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
let lastIdx = -1;

function renderImplant(p){
  const f = easeIO(cl((p - .20) / .26));
  const a = easeIO(cl((p - .50) / .20));
  const c = easeBack(cl((p - .74) / .22));
  pf.setAttribute("transform", `translate(400 ${(400 - 186 * (1 - f)).toFixed(2)})`);
  pa.setAttribute("transform", `translate(400 ${(400 - 216 * (1 - a)).toFixed(2)})`);
  pc.setAttribute("transform", `translate(400 ${(358 - 268 * (1 - c)).toFixed(2)})`);
  threads.setAttribute("transform", `translate(0 ${((f * 186) % 10).toFixed(2)})`);
  halo.setAttribute("opacity", (cl((p - .46) / .12) * .9).toFixed(2));
  collarA.setAttribute("opacity", cl((p - .66) / .06).toFixed(2));
  collarC.setAttribute("opacity", cl((p - .88) / .06).toFixed(2));
  target.setAttribute("opacity", (p < .2 ? .65 : (1 - f) * .65).toFixed(2));

  const t = cl((p - .93) / .07);
  sparks.forEach((s, i) => {
    const ang = i / sparks.length * Math.PI * 2, d = 24 + 110 * t;
    s.setAttribute("cx", (400 + Math.cos(ang) * d * 1.25).toFixed(1));
    s.setAttribute("cy", (278 + Math.sin(ang) * d).toFixed(1));
    s.setAttribute("r", (3.2 * (1 - t) + .8).toFixed(2));
    s.setAttribute("opacity", (Math.sin(Math.PI * t) * .95).toFixed(2));
  });

  const idx = p < .20 ? 0 : p < .50 ? 1 : p < .74 ? 2 : 3;
  rail.style.setProperty("--p", p.toFixed(3));
  if (idx !== lastIdx) {
    lastIdx = idx;
    steps.forEach((li, i) => li.classList.toggle("active", i === idx));
    counter.textContent = "0" + (idx + 1) + " / 04";
    const hot = [null, pf, pa, pc][idx];
    [pf, pa, pc].forEach(g => g.removeAttribute("filter"));
    if (hot && p < .985) hot.setAttribute("filter", "url(#fGlow)");
  }
  // numaralı işaretler: o an hareket eden parça vurgulanır
  const active = p < .20 ? 0 : p < .50 ? 1 : p < .74 ? 2 : 3;
  badges.forEach(b => b.classList.toggle("on", Number(b.dataset.i) === active));
  const fade = p > .96 ? 0 : 1;
  badges.forEach(b => b.style.opacity = fade);
}

if (reduced) {
  renderImplant(1);
  steps.forEach(li => li.classList.add("active"));
} else {
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = imp.getBoundingClientRect();
    const total = imp.offsetHeight - window.innerHeight;
    renderImplant(cl(-r.top / Math.max(1, total)));
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", req, { passive:true });
  window.addEventListener("resize", req);
  update();
}

/* ---- Tedaviye dokununca formda seç ---- */
$$(".svc").forEach(a => a.addEventListener("click", () => {
  const sel = $("#treatment"), v = a.dataset.reason;
  if (sel && v) sel.value = v;
}));

/* ---- Randevu sistemi ---- */
const STORE_KEY = "mkkdent.booked";
const state = { date:null, time:null, quad:"Belirtmek istemiyorum" };

const toMin = t => { const [h,m] = t.split(":").map(Number); return h*60 + m; };
const fmt = m => String(Math.floor(m/60)).padStart(2,"0") + ":" + String(m%60).padStart(2,"0");
const iso = d => d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");

function readBooked(){ try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch(e){ return {}; } }
function writeBooked(map){ try { localStorage.setItem(STORE_KEY, JSON.stringify(map)); } catch(e){} }

function openDays(){
  const out = [], now = new Date();
  for (let i = 0; i <= CONFIG.daysAhead && out.length < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const s = CONFIG.schedule[d.getDay()];
    if (!s) continue;
    if (i === 0 && now.getHours()*60 + now.getMinutes() + 60 > toMin(s[1]) - CONFIG.slotMinutes) continue;
    out.push(d);
  }
  return out;
}

function slotsFor(d){
  const s = CONFIG.schedule[d.getDay()]; if (!s) return [];
  const list = [], isWeekday = d.getDay() >= 1 && d.getDay() <= 5;
  const now = new Date(), isToday = iso(d) === iso(now), nowMin = now.getHours()*60 + now.getMinutes() + 60;
  const booked = readBooked()[iso(d)] || [];
  for (let m = toMin(s[0]); m + CONFIG.slotMinutes <= toMin(s[1]); m += CONFIG.slotMinutes) {
    if (isWeekday && m >= toMin(CONFIG.lunch[0]) && m < toMin(CONFIG.lunch[1])) continue;
    if (isToday && m < nowMin) continue;
    list.push({ t: fmt(m), taken: booked.includes(fmt(m)) });
  }
  return list;
}

const daysEl = $("#days"), slotsEl = $("#slots");

function renderDays(){
  const fDay = new Intl.DateTimeFormat("tr-TR", { weekday:"short" });
  const fMon = new Intl.DateTimeFormat("tr-TR", { month:"short" });
  daysEl.innerHTML = "";
  openDays().forEach(d => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "day"; b.dataset.date = iso(d);
    b.setAttribute("aria-pressed", String(state.date === iso(d)));
    b.innerHTML = `<small>${fDay.format(d)}</small><b>${d.getDate()}</b><em>${fMon.format(d)}</em>`;
    b.addEventListener("click", () => { state.date = iso(d); state.time = null; renderDays(); renderSlots(); $("#err-day").textContent = ""; });
    daysEl.appendChild(b);
  });
}

function renderSlots(){
  slotsEl.innerHTML = "";
  if (!state.date) { slotsEl.innerHTML = '<p class="slots-empty">Önce bir gün seçin.</p>'; return; }
  const [y,m,dd] = state.date.split("-").map(Number);
  const list = slotsFor(new Date(y, m-1, dd));
  if (!list.length) { slotsEl.innerHTML = '<p class="slots-empty">Bu gün için uygun saat kalmadı. Başka bir gün seçin.</p>'; return; }
  list.forEach(s => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "slot"; b.textContent = s.t; b.disabled = s.taken;
    b.setAttribute("aria-pressed", String(state.time === s.t));
    b.addEventListener("click", () => { state.time = s.t; renderSlots(); $("#err-time").textContent = ""; });
    slotsEl.appendChild(b);
  });
}

$("#quads").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; state.quad = b.dataset.v; $$("#quads .chip").forEach(c => c.setAttribute("aria-pressed", String(c === b)));
});

function setErr(id, msg, field){ $("#err-" + id).textContent = msg; if (field) field.setAttribute("aria-invalid", msg ? "true" : "false"); }

function longDate(isoStr){
  const [y,m,d] = isoStr.split("-").map(Number);
  return new Intl.DateTimeFormat("tr-TR", { day:"numeric", month:"long", year:"numeric", weekday:"long" }).format(new Date(y, m-1, d));
}

$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  const name = $("#name"), phone = $("#phone");
  const digits = phone.value.replace(/\D/g, "");
  let ok = true, first = null;
  const fail = (id, msg, field) => { setErr(id, msg, field); ok = false; first = first || field || $("#err-" + id); };

  setErr("day",""); setErr("time",""); setErr("name","",name); setErr("phone","",phone); setErr("kvkk","");
  if (!state.date) fail("day", "Lütfen bir gün seçin.");
  if (state.date && !state.time) fail("time", "Lütfen bir saat seçin.");
  if (name.value.trim().length < 3) fail("name", "Adınızı ve soyadınızı yazın.", name);
  if (digits.length < 10) fail("phone", "Geçerli bir telefon numarası yazın.", phone);
  if (!$("#kvkk").checked) fail("kvkk", "Devam etmek için onay vermeniz gerekir.", $("#kvkk"));
  if (!ok) { first.scrollIntoView({ behavior:"smooth", block:"center" }); if (first.focus) first.focus({ preventScroll:true }); return; }

  const data = {
    reason: $("#treatment").value, area: state.quad, date: state.date, time: state.time,
    name: name.value.trim(), phone: phone.value.trim(), note: $("#note").value.trim()
  };

  const btn = $("#submit"); btn.disabled = true; btn.textContent = "Gönderiliyor…";
  let sent = false;
  if (CONFIG.formEndpoint) {
    try {
      const r = await fetch(CONFIG.formEndpoint, { method:"POST", headers:{ "Content-Type":"application/json", "Accept":"application/json" }, body: JSON.stringify(data) });
      sent = r.ok;
    } catch(err){ sent = false; }
  }
  btn.disabled = false; btn.textContent = "Randevu talebi oluştur";

  const map = readBooked(); (map[data.date] = map[data.date] || []).push(data.time); writeBooked(map);

  const lines = [
    "Merhaba, MKK Dent'ten randevu talep ediyorum.",
    "Ad soyad: " + data.name,
    "Telefon: " + data.phone,
    "Tarih: " + longDate(data.date) + ", " + data.time,
    "Neden: " + data.reason,
    "Bölge: " + data.area
  ];
  if (data.note) lines.push("Not: " + data.note);
  $("#wa").href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));

  $("#done-title").textContent = sent ? "Talebiniz alındı" : "Son adım: talebi gönderin";
  $("#done-text").textContent = sent
    ? "Klinik talebinizi inceleyip saati telefonla veya mesajla onaylayacak. Dilerseniz aşağıdan WhatsApp ile de iletebilirsiniz."
    : "Bilgileriniz hazır. Talebin kliniğe ulaşması için aşağıdaki düğmeyle WhatsApp'tan gönderin. Klinik saati onaylayacaktır.";
  const rows = [["Tarih", longDate(data.date)], ["Saat", data.time], ["Neden", data.reason], ["Bölge", data.area], ["Ad soyad", data.name], ["Telefon", data.phone]];
  $("#summary").innerHTML = rows.map(() => "<div><dt></dt><dd></dd></div>").join(""); $$("#summary div").forEach((row, i) => { $("dt", row).textContent = rows[i][0]; $("dd", row).textContent = rows[i][1]; });

  $("#form").hidden = true; $("#done").hidden = false;
  $("#randevu").scrollIntoView({ behavior:"smooth", block:"start" });
});

$("#again").addEventListener("click", () => {
  $("#form").reset(); state.date = null; state.time = null; state.quad = "Belirtmek istemiyorum"; $$("#quads .chip").forEach((c, i) => c.setAttribute("aria-pressed", String(i === 0)));
  renderDays(); renderSlots();
  $("#done").hidden = true; $("#form").hidden = false;
});

renderDays(); renderSlots();