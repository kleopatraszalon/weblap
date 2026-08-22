import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type CardKind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type PriceRow = { id: string; name: string; price: string };
type WeatherState = { temperature: number | null; precipitation: number; code: number };

type Palette = { background: string; border: string; shadow: string };

const CARD_KINDS: CardKind[] = ["nameday", "weather", "motivation", "beauty", "gym"];
const PALETTES: Record<CardKind, Palette> = {
  nameday: {
    background: "linear-gradient(135deg,#d71f77 0%,#8f1459 100%)",
    border: "rgba(255,160,211,.96)",
    shadow: "0 8px 24px rgba(215,31,119,.42)",
  },
  weather: {
    background: "linear-gradient(135deg,#168bc8 0%,#0d4f91 100%)",
    border: "rgba(139,220,255,.96)",
    shadow: "0 8px 24px rgba(22,139,200,.40)",
  },
  motivation: {
    background: "linear-gradient(135deg,#e58c17 0%,#9c5208 100%)",
    border: "rgba(255,219,145,.96)",
    shadow: "0 8px 24px rgba(229,140,23,.40)",
  },
  beauty: {
    background: "linear-gradient(135deg,#a34cc8 0%,#5e2588 100%)",
    border: "rgba(232,171,255,.96)",
    shadow: "0 8px 24px rgba(163,76,200,.40)",
  },
  gym: {
    background: "linear-gradient(135deg,#23a875 0%,#0c6847 100%)",
    border: "rgba(139,245,194,.96)",
    shadow: "0 8px 24px rgba(35,168,117,.40)",
  },
};

let priceRows: PriceRow[] = [];
let namedayText = "Mai névnapos vendégeinknek 20% kedvezmény.";
let weather: WeatherState = { temperature: null, precipitation: 0, code: 0 };
let uiTimer = 0;
let priceTimer = 0;
let namedayTimer = 0;
let weatherTimer = 0;
let quoteTimer = 0;
let animationFrame = 0;
let fallbackCaptureTimer = 0;

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function numericPrice(value: unknown) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/\s/g, "").replace(/[^0-9,.-]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function money(value: unknown) {
  const n = numericPrice(value);
  return n > 0 ? `${Math.round(n).toLocaleString("hu-HU")} Ft` : "";
}

function firstMoney(...values: unknown[]) {
  for (const value of values) {
    const formatted = money(value);
    if (formatted) return formatted;
    const raw = String(value ?? "").trim();
    if (raw && /\d/.test(raw) && /ft|huf/i.test(raw)) return raw;
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
  const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (weather.precipitation > 0.1 || rainCodes.has(weather.code)) return "Esős idő: egy kényeztető beltéri szépségprogram különösen jól esik.";
  if (weather.temperature !== null && weather.temperature >= 27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if (weather.temperature !== null && weather.temperature <= 8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  if (weather.code <= 2) return "Szép idő: egy friss megjelenés még jobbá teszi a napot.";
  return "A mai időhöz is találunk egy jó szépségprogramot.";
}

function dedupeRows(rows: PriceRow[]) {
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
  }
  return out.slice(0, 120);
}

function mapPublicPricelist(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return dedupeRows(
    raw.map((x: any, i: number) => ({
      id: String(x?.id ?? `booking-${i}`),
      name: String(x?.name ?? x?.title ?? "").trim(),
      price: firstMoney(
        x?.level_prices?.normal,
        x?.base_price,
        x?.price,
        x?.price_text,
        x?.level_prices?.top,
        x?.level_prices?.master
      ),
    }))
  );
}

function mapPublicServices(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return dedupeRows(
    raw.map((x: any, i: number) => ({
      id: String(x?.id ?? `public-${i}`),
      name: String(x?.name ?? x?.title ?? "").trim(),
      price: firstMoney(x?.price, x?.base_price, x?.price_text, x?.priceText),
    }))
  );
}

function mapSignageServices(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
  return dedupeRows(
    raw.map((x: any, i: number) => ({
      id: String(x?.id ?? x?.service_id ?? `signage-${i}`),
      name: String(x?.name ?? x?.title ?? "").trim(),
      price: firstMoney(x?.price_text, x?.priceText, x?.price, x?.base_price),
    }))
  );
}

function captureNativePrices() {
  if (priceRows.length) return;
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".sgServices .sgSvcItem, .sgServices .sgSvcRow"));
  const mapped = dedupeRows(
    rows.map((row, i) => ({
      id: `dom-${i}`,
      name:
        row.querySelector<HTMLElement>(".sgSvcTitle")?.textContent?.trim() ||
        row.querySelector<HTMLElement>(".sgSvcName")?.textContent?.trim() ||
        "",
      price: row.querySelector<HTMLElement>(".sgSvcPrice")?.textContent?.trim() || "",
    }))
  );
  if (mapped.length) {
    priceRows = mapped;
    renderPricePanel();
  }
}

function renderPricePanel() {
  const panel = document.querySelector<HTMLElement>(".sgServices");
  if (!panel) return;

  const title = panel.querySelector<HTMLElement>(".sgPanelHeader h2");
  if (title) title.textContent = "ÁRAINK";
  const meta = panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta");
  if (meta) meta.textContent = priceRows.length ? `${priceRows.length} szolgáltatás` : "Szolgáltatás • Ár";
  const hint = panel.querySelector<HTMLElement>(".sgHint");
  if (hint) hint.textContent = priceRows.length ? "Az árlista automatikusan gördül" : "Árak betöltése…";

  if (!priceRows.length) {
    captureNativePrices();
    return;
  }

  panel.dataset.nativePriceRuntime = "rolling-real-prices-v20";
  let overlay = panel.querySelector<HTMLElement>(".sgPriceOverlayV20");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sgPriceOverlayV20";
    overlay.setAttribute("aria-label", "Gördülő árlista");
    panel.appendChild(overlay);
  }

  const signature = priceRows.map((x) => `${x.id}:${x.name}:${x.price}`).join("|");
  if (overlay.dataset.signature !== signature) {
    overlay.dataset.signature = signature;
    const doubled = [...priceRows, ...priceRows];
    const duration = Math.max(42, Math.min(210, priceRows.length * 2.7));
    overlay.innerHTML = `<div class="sgPriceTrackV20" style="--sg-price-v20-duration:${duration}s">${doubled
      .map((row) => `<div class="sgPriceRowV20"><span>${esc(row.name)}</span><b>${esc(row.price)}</b></div>`)
      .join("")}</div>`;
  }

  const nativeList = panel.querySelector<HTMLElement>(".sgSvcList");
  if (nativeList) nativeList.style.setProperty("visibility", "hidden", "important");
}

function dockMarkup() {
  return CARD_KINDS.map((kind, index) => {
    const duration = 13.5 + index * 1.7;
    return `<article class="sgx-widget sgx-widget-v20 sgx-widget-${kind}-v20" data-v20-kind="${kind}" style="--sg-v20-marquee:${duration}s"><span class="sgx-widget-kicker sgx-widget-kicker-v20"></span><div class="sgx-widget-marquee-v20"><div class="sgx-widget-marquee-track-v20"><span></span></div></div></article>`;
  }).join("");
}

function applyPalette(card: HTMLElement, kind: CardKind) {
  const p = PALETTES[kind];
  card.style.setProperty("background", p.background, "important");
  card.style.setProperty("border-color", p.border, "important");
  card.style.setProperty("box-shadow", `${p.shadow}, inset 0 1px 0 rgba(255,255,255,.24)`, "important");
}

function setDockCard(kind: CardKind, kicker: string, text: string) {
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  const card = dock?.querySelector<HTMLElement>(`[data-v20-kind="${kind}"]`);
  if (!card) return;
  applyPalette(card, kind);
  const label = card.querySelector<HTMLElement>(".sgx-widget-kicker-v20");
  const content = card.querySelector<HTMLElement>(".sgx-widget-marquee-track-v20 span");
  if (label) label.textContent = kicker;
  if (content && content.textContent !== text) content.textContent = text;
}

function syncDockToVideo(dock: HTMLElement) {
  const wrap = document.querySelector<HTMLElement>(".sgVideoWrap");
  const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  const target = wrap || video;
  if (!target) return;
  const r = target.getBoundingClientRect();
  if (r.width < 420 || r.height < 120) return;

  const height = Math.max(42, Math.min(54, r.height * 0.17));
  const left = Math.max(6, r.left + 8);
  const width = Math.max(400, r.width - 16);
  const top = Math.max(r.top + 8, r.bottom - height - 10);

  dock.style.setProperty("position", "fixed", "important");
  dock.style.setProperty("left", `${left}px`, "important");
  dock.style.setProperty("right", "auto", "important");
  dock.style.setProperty("top", `${top}px`, "important");
  dock.style.setProperty("bottom", "auto", "important");
  dock.style.setProperty("width", `${width}px`, "important");
  dock.style.setProperty("height", `${height}px`, "important");
  dock.style.setProperty("transform", "none", "important");
  dock.dataset.anchor = "inside-video-bottom-band-v20";
}

function renderDock() {
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  if (!dock) return;
  dock.classList.remove("sgx-widgetDock-v18", "sgx-widgetDock-v19");
  dock.classList.add("sgx-widgetDock-v20");
  dock.dataset.infoRuntime = "five-compact-moving-single-marquee-cards-v20";
  dock.style.setProperty("display", "grid", "important");
  dock.style.setProperty("visibility", "visible", "important");
  dock.style.setProperty("opacity", "1", "important");
  syncDockToVideo(dock);

  const existing = dock.querySelectorAll("[data-v20-kind]");
  if (existing.length !== 5) dock.innerHTML = dockMarkup();

  const { day, hour } = budapestKey();
  const motivation = quoteFor(MOTIVATION_QUOTES_V13, day, "A következetesség ma is közelebb visz a célodhoz.");
  const beauty = quoteFor(BEAUTY_QUOTES_V13, day * 24 + hour, "A szépség az ápoltság és az önazonosság harmóniája.");
  const gym = quoteFor(GYM_TIPS_V13, day * 24 + hour, "Dolgozz kontrollált mozgástartományban, stabil törzzsel.");

  setDockCard("nameday", "🎁 NÉVNAP · 20%", namedayText);
  setDockCard("weather", `☀ IDŐJÁRÁS${weather.temperature === null ? "" : ` · ${Math.round(weather.temperature)}°`}`, weatherCopy());
  setDockCard("motivation", "💬 MOTIVÁCIÓ", motivation);
  setDockCard("beauty", "✨ SZÉPSÉG", beauty);
  setDockCard("gym", "🏋 GYM TIPP", gym);
}

function animateCards(now: number) {
  if (!isSignage()) {
    animationFrame = window.requestAnimationFrame(animateCards);
    return;
  }
  const t = now / 1000;
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".sgx-widgetDock-v20 > .sgx-widget-v20"));
  cards.forEach((card, index) => {
    const speed = 0.72 + index * 0.07;
    const phase = index * 1.31;
    const x = Math.sin(t * speed + phase) * (7 + (index % 2) * 2);
    const y = Math.cos(t * (speed * 1.17) + phase * 0.73) * 3.5;
    const rot = Math.sin(t * 0.43 + phase) * 0.22;
    card.style.setProperty("transform", `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg)`, "important");
  });
  animationFrame = window.requestAnimationFrame(animateCards);
}

function ensureNativeUi() {
  if (!isSignage()) return;
  document.querySelectorAll<HTMLElement>(".sgPricePanelV17, .sgInfoStripV17, .sgxInfoDockV13, .sgxInfoDockV14, .sgxInfoDockV15, .sgxInfoDockV16").forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.setAttribute("aria-hidden", "true");
  });
  renderPricePanel();
  renderDock();
}

async function fetchRows(path: string, mapper: (data: any) => PriceRow[]) {
  try {
    const r = await fetch(`${API_BASE}${path}${path.includes("?") ? "&" : "?"}_=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    if (!r.ok) return [];
    const data = await r.json();
    return mapper(data);
  } catch {
    return [];
  }
}

async function loadPrices() {
  const sources: Array<[string, (data: any) => PriceRow[]]> = [
    ["/api/public/booking/v4/pricelist", mapPublicPricelist],
    ["/api/public/services", mapPublicServices],
    ["/api/signage/services", mapSignageServices],
  ];

  for (const [path, mapper] of sources) {
    const rows = await fetchRows(path, mapper);
    if (rows.length) {
      priceRows = rows;
      renderPricePanel();
      return;
    }
  }

  captureNativePrices();
}

async function loadNameday() {
  try {
    const r = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const names = Array.isArray(j?.names) ? j.names.join(", ") : String(j?.name || "").trim();
    const text = String(j?.message || j?.text || "").trim();
    namedayText = text || (names ? `Ma ${names} ünnepli a névnapját — 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény.");
  } catch {
    namedayText = "Mai névnapos vendégeinknek 20% kedvezmény.";
  }
  renderDock();
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
  renderDock();
}

export function installSignageNativeV20() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageNativeV20Installed) return;
  (window as any).__kleoSignageNativeV20Installed = true;

  const start = () => {
    if (!isSignage()) return;
    ensureNativeUi();
    void loadPrices();
    void loadNameday();
    void loadWeather();

    if (!uiTimer) uiTimer = window.setInterval(ensureNativeUi, 700);
    if (!priceTimer) priceTimer = window.setInterval(() => void loadPrices(), 5 * 60_000);
    if (!namedayTimer) namedayTimer = window.setInterval(() => void loadNameday(), 5 * 60_000);
    if (!weatherTimer) weatherTimer = window.setInterval(() => void loadWeather(), 10 * 60_000);
    if (!quoteTimer) quoteTimer = window.setInterval(renderDock, 60_000);
    if (!fallbackCaptureTimer) fallbackCaptureTimer = window.setInterval(captureNativePrices, 1800);
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animateCards);
  };

  window.setTimeout(start, 120);
  window.setTimeout(start, 700);
  window.setTimeout(start, 1800);
  window.addEventListener("resize", ensureNativeUi);
  window.addEventListener("focus", ensureNativeUi);
  document.addEventListener("visibilitychange", ensureNativeUi);
  window.addEventListener("beforeunload", () => {
    if (uiTimer) window.clearInterval(uiTimer);
    if (priceTimer) window.clearInterval(priceTimer);
    if (namedayTimer) window.clearInterval(namedayTimer);
    if (weatherTimer) window.clearInterval(weatherTimer);
    if (quoteTimer) window.clearInterval(quoteTimer);
    if (fallbackCaptureTimer) window.clearInterval(fallbackCaptureTimer);
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
  });
}
