import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type CardKind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type WeatherState = { temperature: number | null; precipitation: number; code: number };
type PriceRow = { id: string; name: string; price: string };
type MotionState = { x: number; y: number; vx: number; vy: number };

type Palette = { background: string; border: string; glow: string };

const CARD_KINDS: CardKind[] = ["nameday", "weather", "motivation", "beauty", "gym"];
const PALETTES: Record<CardKind, Palette> = {
  nameday: { background: "linear-gradient(135deg,#df1f7c,#8e1558)", border: "#ff9bd0", glow: "rgba(223,31,124,.42)" },
  weather: { background: "linear-gradient(135deg,#1691d1,#0c4d8f)", border: "#8bdcff", glow: "rgba(22,145,209,.42)" },
  motivation: { background: "linear-gradient(135deg,#ef961c,#9b5208)", border: "#ffd584", glow: "rgba(239,150,28,.42)" },
  beauty: { background: "linear-gradient(135deg,#a94fd1,#5c2587)", border: "#e7aaff", glow: "rgba(169,79,209,.42)" },
  gym: { background: "linear-gradient(135deg,#24af79,#0b6645)", border: "#89f0bf", glow: "rgba(36,175,121,.42)" },
};

let namedayText = "Mai névnapos vendégeinknek 20% kedvezmény.";
let weather: WeatherState = { temperature: null, precipitation: 0, code: 0 };
let priceRows: PriceRow[] = [];
let frame = 0;
let lastTs = 0;
let syncTimer = 0;
let priceTimer = 0;
let namedayTimer = 0;
let weatherTimer = 0;
let quoteTimer = 0;
const motion = new Map<CardKind, MotionState>();

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function num(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value ?? "").replace(/\s/g, "").replace(/[^0-9,.-]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(value: unknown) {
  const n = num(value);
  return n > 0 ? `${Math.round(n).toLocaleString("hu-HU")} Ft` : "";
}

function firstPrice(...values: unknown[]) {
  for (const value of values) {
    const formatted = formatMoney(value);
    if (formatted) return formatted;
    const raw = String(value ?? "").trim();
    if (raw && /\d/.test(raw) && /(ft|huf)/i.test(raw)) return raw;
  }
  return "";
}

function budapestKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "0";
  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  const h = Number(get("hour"));
  return { day: Math.floor(Date.UTC(y, m - 1, d) / 86400000), hour: h };
}

function quoteFor(list: string[], index: number, fallback: string) {
  if (!list.length) return fallback;
  const i = ((index % list.length) + list.length) % list.length;
  return list[i] || fallback;
}

function weatherCopy() {
  const rain = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (weather.precipitation > 0.1 || rain.has(weather.code)) return "Esős idő: egy kényeztető beltéri szépségprogram különösen jól esik.";
  if (weather.temperature !== null && weather.temperature >= 27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if (weather.temperature !== null && weather.temperature <= 8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  if (weather.code <= 2) return "Szép idő: egy friss megjelenés még jobbá teszi a napot.";
  return "A mai időhöz is találunk egy jó szépségprogramot.";
}

function cardMarkup() {
  return CARD_KINDS.map((kind, index) => {
    const p = PALETTES[kind];
    const duration = 14 + index * 1.6;
    return `<article class="kleoRoamCardV21 kleoRoamCardV21--${kind}" data-v21-kind="${kind}" style="background:${p.background} !important;border-color:${p.border} !important;box-shadow:0 9px 28px ${p.glow},0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.24) !important;--v21-marquee:${duration}s"><div class="kleoRoamLabelV21"></div><div class="kleoRoamMarqueeV21"><div class="kleoRoamTrackV21"><span></span></div></div></article>`;
  }).join("");
}

function ensureRoamLayer() {
  let layer = document.querySelector<HTMLElement>(".kleoRoamLayerV21");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "kleoRoamLayerV21";
    layer.dataset.runtime = "full-frame-five-moving-cards-v21";
    layer.innerHTML = cardMarkup();
    document.body.appendChild(layer);
  }
  if (layer.querySelectorAll("[data-v21-kind]").length !== 5) layer.innerHTML = cardMarkup();
  return layer;
}

function setCard(kind: CardKind, label: string, text: string) {
  const card = document.querySelector<HTMLElement>(`.kleoRoamCardV21[data-v21-kind="${kind}"]`);
  if (!card) return;
  const p = PALETTES[kind];
  card.style.setProperty("background", p.background, "important");
  card.style.setProperty("border-color", p.border, "important");
  card.style.setProperty("box-shadow", `0 9px 28px ${p.glow},0 8px 22px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.24)`, "important");
  const l = card.querySelector<HTMLElement>(".kleoRoamLabelV21");
  const s = card.querySelector<HTMLElement>(".kleoRoamTrackV21 span");
  if (l) l.textContent = label;
  if (s && s.textContent !== text) s.textContent = text;
}

function updateCards() {
  ensureRoamLayer();
  const { day, hour } = budapestKey();
  setCard("nameday", "🎁 NÉVNAP · 20%", namedayText);
  setCard("weather", `☀ IDŐJÁRÁS${weather.temperature === null ? "" : ` · ${Math.round(weather.temperature)}°`}`, weatherCopy());
  setCard("motivation", "💬 MOTIVÁCIÓ", quoteFor(MOTIVATION_QUOTES_V13, day, "A következetesség ma is közelebb visz a célodhoz."));
  setCard("beauty", "✨ SZÉPSÉG", quoteFor(BEAUTY_QUOTES_V13, day * 24 + hour, "A szépség az ápoltság és az önazonosság harmóniája."));
  setCard("gym", "🏋 GYM TIPP", quoteFor(GYM_TIPS_V13, day * 24 + hour, "Dolgozz kontrollált mozgástartományban, stabil törzzsel."));
}

function seedMotion() {
  const w = Math.max(900, window.innerWidth);
  const h = Math.max(600, window.innerHeight);
  CARD_KINDS.forEach((kind, index) => {
    if (motion.has(kind)) return;
    const x = 24 + ((index * 0.19 + 0.06) % 0.82) * (w - 260);
    const y = 88 + ((index * 0.21 + 0.07) % 0.68) * (h - 190);
    const speed = 24 + index * 3.3;
    const angle = 0.48 + index * 0.91;
    motion.set(kind, { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.78 });
  });
}

function collideCards(cards: Array<{ kind: CardKind; el: HTMLElement; state: MotionState; w: number; h: number }>) {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      const a = cards[i];
      const b = cards[j];
      const ax = a.state.x + a.w / 2;
      const ay = a.state.y + a.h / 2;
      const bx = b.state.x + b.w / 2;
      const by = b.state.y + b.h / 2;
      const dx = bx - ax;
      const dy = by - ay;
      const overlapX = (a.w + b.w) / 2 + 10 - Math.abs(dx);
      const overlapY = (a.h + b.h) / 2 + 8 - Math.abs(dy);
      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          const push = overlapX / 2 + 1;
          const dir = dx >= 0 ? 1 : -1;
          a.state.x -= push * dir;
          b.state.x += push * dir;
          const av = a.state.vx;
          a.state.vx = b.state.vx;
          b.state.vx = av;
        } else {
          const push = overlapY / 2 + 1;
          const dir = dy >= 0 ? 1 : -1;
          a.state.y -= push * dir;
          b.state.y += push * dir;
          const av = a.state.vy;
          a.state.vy = b.state.vy;
          b.state.vy = av;
        }
      }
    }
  }
}

function animate(ts: number) {
  if (!isSignage()) {
    frame = window.requestAnimationFrame(animate);
    return;
  }
  ensureRoamLayer();
  seedMotion();
  const dt = Math.min(0.034, lastTs ? (ts - lastTs) / 1000 : 0.016);
  lastTs = ts;
  const top = 72;
  const left = 8;
  const right = window.innerWidth - 8;
  const bottom = window.innerHeight - 52;

  const cards: Array<{ kind: CardKind; el: HTMLElement; state: MotionState; w: number; h: number }> = [];
  CARD_KINDS.forEach((kind) => {
    const el = document.querySelector<HTMLElement>(`.kleoRoamCardV21[data-v21-kind="${kind}"]`);
    const state = motion.get(kind);
    if (!el || !state) return;
    const r = el.getBoundingClientRect();
    const cw = Math.max(150, r.width || 210);
    const ch = Math.max(38, r.height || 46);
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    if (state.x <= left) { state.x = left; state.vx = Math.abs(state.vx); }
    if (state.x + cw >= right) { state.x = right - cw; state.vx = -Math.abs(state.vx); }
    if (state.y <= top) { state.y = top; state.vy = Math.abs(state.vy); }
    if (state.y + ch >= bottom) { state.y = bottom - ch; state.vy = -Math.abs(state.vy); }
    cards.push({ kind, el, state, w: cw, h: ch });
  });

  collideCards(cards);
  cards.forEach(({ el, state }) => {
    el.style.setProperty("left", `${state.x.toFixed(1)}px`, "important");
    el.style.setProperty("top", `${state.y.toFixed(1)}px`, "important");
  });
  frame = window.requestAnimationFrame(animate);
}

function dedupePrices(rows: PriceRow[]) {
  const seen = new Set<string>();
  const out: PriceRow[] = [];
  for (const row of rows) {
    const name = row.name.trim();
    const price = row.price.trim();
    if (!name || !price) continue;
    const key = `${name.toLocaleLowerCase("hu-HU")}|${price}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...row, name, price });
    if (out.length >= 180) break;
  }
  return out;
}

function mapBooking4(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return dedupePrices(raw.map((x: any, i: number) => ({
    id: String(x?.id ?? x?.service_id ?? `booking4-${i}`),
    name: String(x?.name ?? x?.title ?? x?.service_name ?? "").trim(),
    price: firstPrice(
      x?.level_prices?.normal,
      x?.base_price,
      x?.price,
      x?.price_text,
      x?.priceText,
      x?.level_prices?.top,
      x?.level_prices?.master,
      x?.level_prices?.premium
    ),
  })));
}

function ensurePriceOverlay() {
  const panel = document.querySelector<HTMLElement>(".sgServices");
  if (!panel) return null;
  const title = panel.querySelector<HTMLElement>(".sgPanelHeader h2");
  const meta = panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta");
  const hint = panel.querySelector<HTMLElement>(".sgHint");
  if (title) title.textContent = "ÁRAINK";
  if (meta) meta.textContent = priceRows.length ? `Booking 4.0 · ${priceRows.length} ár` : "Booking 4.0";
  if (hint) hint.textContent = priceRows.length ? "Booking 4.0 árlista · automatikusan gördül" : "Booking 4.0 árak betöltése…";

  if (!priceRows.length) return null;

  let overlay = document.querySelector<HTMLElement>(".kleoPriceOverlayV21");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "kleoPriceOverlayV21";
    overlay.dataset.runtime = "booking4-rolling-price-overlay-v21";
    document.body.appendChild(overlay);
  }

  const pr = panel.getBoundingClientRect();
  const topOffset = Math.min(58, Math.max(42, pr.height * 0.13));
  const bottomOffset = Math.min(34, Math.max(22, pr.height * 0.07));
  overlay.style.setProperty("left", `${(pr.left + 6).toFixed(1)}px`, "important");
  overlay.style.setProperty("top", `${(pr.top + topOffset).toFixed(1)}px`, "important");
  overlay.style.setProperty("width", `${Math.max(120, pr.width - 12).toFixed(1)}px`, "important");
  overlay.style.setProperty("height", `${Math.max(90, pr.height - topOffset - bottomOffset).toFixed(1)}px`, "important");

  const signature = priceRows.map((x) => `${x.id}:${x.name}:${x.price}`).join("|");
  if (overlay.dataset.signature !== signature) {
    overlay.dataset.signature = signature;
    const doubled = [...priceRows, ...priceRows];
    const duration = Math.max(70, Math.min(320, priceRows.length * 2.1));
    overlay.innerHTML = `<div class="kleoPriceTrackV21" style="--v21-price-duration:${duration}s">${doubled.map((row) => `<div class="kleoPriceRowV21"><span>${esc(row.name)}</span><b>${esc(row.price)}</b></div>`).join("")}</div>`;
  }

  const nativeList = panel.querySelector<HTMLElement>(".sgSvcList");
  if (nativeList) nativeList.style.setProperty("visibility", "hidden", "important");
  return overlay;
}

function syncUi() {
  if (!isSignage()) return;
  document.querySelectorAll<HTMLElement>(".sgx-widgetDock-v3,.sgPricePanelV17,.sgInfoStripV17,.sgxInfoDockV13,.sgxInfoDockV14,.sgxInfoDockV15,.sgxInfoDockV16").forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.setAttribute("aria-hidden", "true");
  });
  updateCards();
  ensurePriceOverlay();
}

async function loadBooking4Prices() {
  try {
    const r = await fetch(`${API_BASE}/api/public/booking/v4/pricelist?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    if (!r.ok) throw new Error(`Booking 4.0 HTTP ${r.status}`);
    const mapped = mapBooking4(await r.json());
    if (!mapped.length) throw new Error("Booking 4.0 returned no priced services");
    priceRows = mapped;
    ensurePriceOverlay();
  } catch (error) {
    console.error("[signage-v21] Booking 4.0 pricelist error", error);
  }
}

async function loadNameday() {
  try {
    const r = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, { cache: "no-store", credentials: "omit", mode: "cors" });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const names = Array.isArray(j?.names) ? j.names.join(", ") : String(j?.name || "").trim();
    const text = String(j?.message || j?.text || "").trim();
    namedayText = text || (names ? `Ma ${names} ünnepli a névnapját — 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény.");
  } catch {
    namedayText = "Mai névnapos vendégeinknek 20% kedvezmény.";
  }
  updateCards();
}

async function loadWeather() {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,weather_code&timezone=Europe%2FBudapest";
    const r = await fetch(`${url}&_=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    weather = {
      temperature: Number.isFinite(Number(j?.current?.temperature_2m)) ? Number(j.current.temperature_2m) : null,
      precipitation: Number.isFinite(Number(j?.current?.precipitation)) ? Number(j.current.precipitation) : 0,
      code: Number.isFinite(Number(j?.current?.weather_code)) ? Number(j.current.weather_code) : 0,
    };
  } catch {
    weather = { temperature: null, precipitation: 0, code: 0 };
  }
  updateCards();
}

export function installSignageNativeV21() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageNativeV21Installed) return;
  (window as any).__kleoSignageNativeV21Installed = true;

  const start = () => {
    if (!isSignage()) return;
    syncUi();
    void loadBooking4Prices();
    void loadNameday();
    void loadWeather();
    if (!frame) frame = window.requestAnimationFrame(animate);
    if (!syncTimer) syncTimer = window.setInterval(syncUi, 700);
    if (!priceTimer) priceTimer = window.setInterval(() => void loadBooking4Prices(), 5 * 60_000);
    if (!namedayTimer) namedayTimer = window.setInterval(() => void loadNameday(), 5 * 60_000);
    if (!weatherTimer) weatherTimer = window.setInterval(() => void loadWeather(), 10 * 60_000);
    if (!quoteTimer) quoteTimer = window.setInterval(updateCards, 60_000);
  };

  window.setTimeout(start, 100);
  window.setTimeout(start, 650);
  window.setTimeout(start, 1600);
  window.addEventListener("resize", syncUi);
  window.addEventListener("focus", syncUi);
  document.addEventListener("visibilitychange", syncUi);
  window.addEventListener("beforeunload", () => {
    if (frame) window.cancelAnimationFrame(frame);
    if (syncTimer) window.clearInterval(syncTimer);
    if (priceTimer) window.clearInterval(priceTimer);
    if (namedayTimer) window.clearInterval(namedayTimer);
    if (weatherTimer) window.clearInterval(weatherTimer);
    if (quoteTimer) window.clearInterval(quoteTimer);
  });
}
