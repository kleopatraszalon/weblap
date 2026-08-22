import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type CardKind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type PriceRow = { id: string; name: string; price: string };
type WeatherState = { temperature: number | null; precipitation: number; code: number };

const CARD_KINDS: CardKind[] = ["nameday", "weather", "motivation", "beauty", "gym"];
let priceRows: PriceRow[] = [];
let fallbackRows: PriceRow[] = [];
let namedayText = "Mai névnapos vendégeinknek 20% kedvezmény.";
let weather: WeatherState = { temperature: null, precipitation: 0, code: 0 };
let uiTimer = 0;
let priceTimer = 0;
let namedayTimer = 0;
let weatherTimer = 0;
let quoteTimer = 0;

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value: unknown) {
  const normalized = typeof value === "string" ? value.replace(/[^0-9,.-]/g, "").replace(",", ".") : value;
  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? `${Math.round(n).toLocaleString("hu-HU")} Ft` : "";
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

function weatherCopy() {
  const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (weather.precipitation > 0.1 || rainCodes.has(weather.code)) return "Esős idő: bent különösen jól esik egy kis feltöltődés.";
  if (weather.temperature !== null && weather.temperature >= 27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if (weather.temperature !== null && weather.temperature <= 8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  if (weather.code <= 2) return "Szép idő: egy friss megjelenés még jobbá teszi a napot.";
  return "A mai időhöz is találunk egy jó szépségprogramot.";
}

function quoteFor(list: string[], index: number, fallback: string) {
  if (!list.length) return fallback;
  const i = ((index % list.length) + list.length) % list.length;
  return list[i] || fallback;
}

function captureFallbackPrices() {
  if (fallbackRows.length) return;
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".sgServices .sgSvcItem"));
  fallbackRows = rows
    .map((row, i) => ({
      id: `fallback-${i}`,
      name: row.querySelector<HTMLElement>(".sgSvcTitle")?.textContent?.trim() || "",
      price: row.querySelector<HTMLElement>(".sgSvcPrice")?.textContent?.trim() || "Ár a recepción",
    }))
    .filter((x) => x.name);
}

function renderPricePanel() {
  const panel = document.querySelector<HTMLElement>(".sgServices");
  if (!panel) return;
  captureFallbackPrices();
  panel.dataset.nativePriceRuntime = "rolling-public-pricelist-v19";

  const title = panel.querySelector<HTMLElement>(".sgPanelHeader h2");
  if (title) title.textContent = "ÁRAINK";
  const meta = panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta");
  if (meta) meta.textContent = "Szolgáltatás • Ár";
  const hint = panel.querySelector<HTMLElement>(".sgHint");
  if (hint) hint.textContent = "Árlista automatikusan gördül";

  const list = panel.querySelector<HTMLElement>(".sgSvcList");
  if (!list) return;
  list.dataset.nativePriceV19 = "true";

  const rows = priceRows.length ? priceRows : fallbackRows;
  const signature = rows.map((x) => `${x.id}:${x.name}:${x.price}`).join("|");
  if (list.querySelector(".sgPriceTrackV19") && list.dataset.priceSignature === signature) return;
  list.dataset.priceSignature = signature;

  if (!rows.length) {
    list.innerHTML = `<div class="sgPriceEmptyV19">Az árlista frissítése folyamatban…</div>`;
    return;
  }

  const doubled = [...rows, ...rows];
  const duration = Math.max(32, Math.min(180, rows.length * 2.3));
  list.innerHTML = `<div class="sgPriceTrackV19" style="--sg-price-v19-duration:${duration}s">${doubled
    .map((row) => `<div class="sgPriceRowV19"><span>${esc(row.name)}</span><b>${esc(row.price || "Ár a recepción")}</b></div>`)
    .join("")}</div>`;
}

function dockMarkup() {
  return CARD_KINDS.map((kind, index) => {
    const duration = 17 + index * 2.6;
    const moveDuration = 5.6 + index * 0.7;
    return `<article class="sgx-widget sgx-widget-v19 sgx-widget-${kind}-v19" data-v19-kind="${kind}" style="--sg-v19-marquee:${duration}s;--sg-v19-move:${moveDuration}s;--sg-v19-delay:${(-index * 0.85).toFixed(2)}s"><span class="sgx-widget-kicker sgx-widget-kicker-v19"></span><div class="sgx-widget-marquee-v19"><div class="sgx-widget-marquee-track-v19"><span></span><span aria-hidden="true"></span></div></div></article>`;
  }).join("");
}

function setDockCard(kind: CardKind, kicker: string, text: string) {
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  const card = dock?.querySelector<HTMLElement>(`[data-v19-kind="${kind}"]`);
  if (!card) return;
  const a = card.querySelector<HTMLElement>(".sgx-widget-kicker-v19");
  const spans = card.querySelectorAll<HTMLElement>(".sgx-widget-marquee-track-v19 span");
  if (a) a.textContent = kicker;
  spans.forEach((span) => { span.textContent = text; });
}

function syncDockToVideoBand(dock: HTMLElement) {
  const grid = document.querySelector<HTMLElement>(".sgGrid");
  const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  if (!grid || !video) return;

  const g = grid.getBoundingClientRect();
  const v = video.getBoundingClientRect();
  if (g.width < 500 || v.height < 120) return;

  const height = Math.max(66, Math.min(82, v.height * 0.18));
  const left = Math.max(8, g.left + 8);
  const width = Math.max(760, Math.min(window.innerWidth - left - 8, g.width - 16));
  const top = Math.max(v.top + 8, Math.min(v.bottom - height - 8, window.innerHeight - height - 8));

  dock.style.setProperty("position", "fixed", "important");
  dock.style.setProperty("left", `${left}px`, "important");
  dock.style.setProperty("right", "auto", "important");
  dock.style.setProperty("top", `${top}px`, "important");
  dock.style.setProperty("bottom", "auto", "important");
  dock.style.setProperty("width", `${width}px`, "important");
  dock.style.setProperty("height", `${height}px`, "important");
  dock.style.setProperty("transform", "none", "important");
  dock.dataset.anchor = "video-panel-bottom-band-v19";
}

function renderDock() {
  const dock = document.querySelector<HTMLElement>(".sgx-widgetDock-v3");
  if (!dock) return;
  dock.classList.remove("sgx-widgetDock-v18");
  dock.classList.add("sgx-widgetDock-v19");
  dock.dataset.infoRuntime = "native-five-moving-marquee-cards-v19";
  dock.style.setProperty("display", "grid", "important");
  dock.style.setProperty("visibility", "visible", "important");
  dock.style.setProperty("opacity", "1", "important");
  syncDockToVideoBand(dock);

  const existing = dock.querySelectorAll("[data-v19-kind]");
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

function ensureNativeUi() {
  if (!isSignage()) return;
  document.querySelectorAll<HTMLElement>(".sgPricePanelV17, .sgInfoStripV17, .sgxInfoDockV13, .sgxInfoDockV14, .sgxInfoDockV15, .sgxInfoDockV16").forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.setAttribute("aria-hidden", "true");
  });
  renderPricePanel();
  renderDock();
}

function mapPublicPriceRows(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
  return raw
    .map((x: any, i: number) => {
      const normal = x?.level_prices?.normal ?? x?.base_price ?? x?.price ?? x?.price_text ?? null;
      return {
        id: String(x?.id ?? `public-${i}`),
        name: String(x?.name ?? x?.title ?? "").trim(),
        price: money(normal) || String(x?.price_text || "").trim() || "Ár a recepción",
      };
    })
    .filter((x: PriceRow) => x.name);
}

function mapSignagePriceRows(data: any): PriceRow[] {
  const raw = Array.isArray(data?.services) ? data.services : Array.isArray(data?.items) ? data.items : Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : [];
  return raw
    .map((x: any, i: number) => ({
      id: String(x?.id ?? x?.service_id ?? `signage-${i}`),
      name: String(x?.name ?? x?.title ?? "").trim(),
      price: String(x?.price_text ?? x?.priceText ?? "").trim() || money(x?.price) || "Ár a recepción",
    }))
    .filter((x: PriceRow) => x.name);
}

async function loadPrices() {
  let mapped: PriceRow[] = [];
  try {
    const r = await fetch(`${API_BASE}/api/public/booking/v4/pricelist?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "include",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    if (r.ok) mapped = mapPublicPriceRows(await r.json());
  } catch {
    mapped = [];
  }

  if (!mapped.length) {
    try {
      const r = await fetch(`${API_BASE}/api/signage/services?_=${Date.now()}`, {
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json", "Cache-Control": "no-cache" },
      });
      if (r.ok) mapped = mapSignagePriceRows(await r.json());
    } catch {
      mapped = [];
    }
  }

  if (mapped.length) priceRows = mapped;
  ensureNativeUi();
}

async function loadNameday() {
  try {
    const r = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
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

export function installSignageNativeV19() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageNativeV19Installed) return;
  (window as any).__kleoSignageNativeV19Installed = true;

  const start = () => {
    if (!isSignage()) return;
    ensureNativeUi();
    void loadPrices();
    void loadNameday();
    void loadWeather();
    if (!uiTimer) uiTimer = window.setInterval(ensureNativeUi, 350);
    if (!priceTimer) priceTimer = window.setInterval(() => void loadPrices(), 5 * 60_000);
    if (!namedayTimer) namedayTimer = window.setInterval(() => void loadNameday(), 5 * 60_000);
    if (!weatherTimer) weatherTimer = window.setInterval(() => void loadWeather(), 10 * 60_000);
    if (!quoteTimer) quoteTimer = window.setInterval(renderDock, 60_000);
  };

  window.setTimeout(start, 80);
  window.setTimeout(start, 500);
  window.setTimeout(start, 1400);
  window.addEventListener("resize", ensureNativeUi, { passive: true });
  window.addEventListener("focus", ensureNativeUi);
  document.addEventListener("visibilitychange", ensureNativeUi);
  window.addEventListener("beforeunload", () => {
    if (uiTimer) window.clearInterval(uiTimer);
    if (priceTimer) window.clearInterval(priceTimer);
    if (namedayTimer) window.clearInterval(namedayTimer);
    if (weatherTimer) window.clearInterval(weatherTimer);
    if (quoteTimer) window.clearInterval(quoteTimer);
  });
}
