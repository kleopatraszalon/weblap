import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type CardKind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type WeatherState = { temperature: number | null; precipitation: number | null; code: number | null };

const CARD_KINDS: CardKind[] = ["nameday", "weather", "motivation", "beauty", "gym"];
let dock: HTMLDivElement | null = null;
let raf = 0;
let contentTimer = 0;
let namedayTimer = 0;
let weatherTimer = 0;
let uiTimer = 0;

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function budapestClock() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  const year = Number(value("year"));
  const month = Number(value("month"));
  const day = Number(value("day"));
  return {
    hour: Number(value("hour")) || 0,
    dayNumber: Math.floor(Date.UTC(year, month - 1, day) / 86400000),
  };
}

function cardMarkup(kind: CardKind) {
  return `<article class="sgxInfoCardV16 sgxInfoCardV16--${kind}" data-v16-kind="${kind}">
    <span class="sgxInfoCardV16__kicker"></span>
    <strong class="sgxInfoCardV16__strong"></strong>
    <small class="sgxInfoCardV16__small"></small>
  </article>`;
}

function hideLegacyCards() {
  document
    .querySelectorAll<HTMLElement>(
      ".sgx-widgetDock-v3, .sgx-widget-birthday, .sgx-popup-kind-birthday, .sgx-toast-birthday, .sgxInfoDockV13, .sgxInfoDockV14, .sgxInfoDockV15"
    )
    .forEach((el) => {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("aria-hidden", "true");
    });
}

function ensureDock() {
  if (!isSignage()) return null;
  hideLegacyCards();
  if (dock && document.body.contains(dock)) return dock;

  document.querySelectorAll(".sgxInfoDockV16").forEach((el) => el.remove());
  dock = document.createElement("div");
  dock.className = "sgxInfoDockV16";
  dock.dataset.infoRuntime = "body-fixed-five-cards-v16";
  dock.setAttribute("aria-label", "KLEO Smart információs kártyák");
  dock.innerHTML = CARD_KINDS.map(cardMarkup).join("");
  document.body.appendChild(dock);
  refreshStaticContent();
  return dock;
}

function setCard(kind: CardKind, kicker: string, strong: string, small: string) {
  const card = ensureDock()?.querySelector<HTMLElement>(`[data-v16-kind="${kind}"]`);
  if (!card) return;
  const a = card.querySelector<HTMLElement>(".sgxInfoCardV16__kicker");
  const b = card.querySelector<HTMLElement>(".sgxInfoCardV16__strong");
  const c = card.querySelector<HTMLElement>(".sgxInfoCardV16__small");
  if (a) a.textContent = kicker;
  if (b) b.textContent = strong;
  if (c) c.textContent = small;
}

function visibleBandRect() {
  const grid = document.querySelector<HTMLElement>(".sgGrid");
  if (grid) {
    const r = grid.getBoundingClientRect();
    const left = Math.max(8, Math.min(window.innerWidth - 8, r.left));
    const right = Math.max(left + 1, Math.min(window.innerWidth - 8, r.right));
    const top = Math.max(8, Math.min(window.innerHeight - 8, r.top));
    const bottom = Math.max(top + 1, Math.min(window.innerHeight - 8, r.bottom));
    if (right - left >= 650 && bottom - top >= 160) {
      return { left, top, width: right - left, height: bottom - top };
    }
  }

  const top = Math.max(92, Math.round(window.innerHeight * 0.16));
  const height = Math.max(190, Math.min(360, window.innerHeight - top - 74));
  return { left: 10, top, width: Math.max(700, window.innerWidth - 20), height };
}

function syncDockBounds() {
  const node = ensureDock();
  if (!node) return;
  const rect = visibleBandRect();
  node.style.setProperty("left", `${rect.left}px`, "important");
  node.style.setProperty("top", `${rect.top}px`, "important");
  node.style.setProperty("width", `${rect.width}px`, "important");
  node.style.setProperty("height", `${rect.height}px`, "important");
  node.style.setProperty("display", "block", "important");
  node.style.setProperty("visibility", "visible", "important");
  node.style.setProperty("opacity", "1", "important");
  node.dataset.bounds = "visible-video-band-v16";
}

function layout(now: number) {
  const node = ensureDock();
  if (!node) return;
  syncDockBounds();
  const width = node.clientWidth;
  const height = node.clientHeight;
  if (width < 600 || height < 150) return;

  const gap = Math.max(8, Math.min(16, width * 0.007));
  const laneWidth = (width - gap * 4) / 5;
  const cardWidth = Math.max(138, Math.min(286, laneWidth - 10));
  const cardHeight = Math.max(82, Math.min(106, height * 0.34));
  const ySeeds = [0.08, 0.60, 0.31, 0.09, 0.59];

  CARD_KINDS.forEach((kind, index) => {
    const card = node.querySelector<HTMLElement>(`[data-v16-kind="${kind}"]`);
    if (!card) return;
    const laneLeft = index * (laneWidth + gap);
    const baseX = laneLeft + (laneWidth - cardWidth) / 2;
    const maxY = Math.max(0, height - cardHeight - 6);
    const baseY = Math.max(3, maxY * ySeeds[index]);
    const phase = index * 1.47;
    const driftX = Math.sin(now * (0.00032 + index * 0.000018) + phase) * Math.min(6, laneWidth * 0.02);
    const driftY = Math.cos(now * (0.00041 + index * 0.000016) + phase) * 4;
    const tilt = Math.sin(now * 0.00022 + phase) * 0.18;

    card.style.setProperty("width", `${cardWidth}px`, "important");
    card.style.setProperty("height", `${cardHeight}px`, "important");
    card.style.setProperty(
      "transform",
      `translate3d(${(baseX + driftX).toFixed(1)}px, ${(baseY + driftY).toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}deg)`,
      "important"
    );
    card.style.setProperty("display", "block", "important");
    card.style.setProperty("visibility", "visible", "important");
    card.style.setProperty("opacity", "1", "important");
    card.dataset.lane = String(index + 1);
  });
}

function tick(now: number) {
  if (isSignage()) {
    hideLegacyCards();
    layout(now);
  }
  raf = window.requestAnimationFrame(tick);
}

function weatherText(weather: WeatherState) {
  const t = weather.temperature;
  const p = weather.precipitation || 0;
  const c = weather.code ?? 0;
  const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (p > 0.1 || rainCodes.has(c)) return "Esős idő: bent különösen jól esik egy kis feltöltődés.";
  if (t !== null && t >= 27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if (t !== null && t <= 8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  if (c <= 2) return "Szép idő: egy friss megjelenés még jobbá teszi a napot.";
  return "A mai időhöz is találunk egy jó szépségprogramot.";
}

async function refreshWeather() {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,weather_code&timezone=Europe%2FBudapest";
    const response = await fetch(`${url}&_=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    const weather: WeatherState = {
      temperature: Number.isFinite(Number(data?.current?.temperature_2m)) ? Number(data.current.temperature_2m) : null,
      precipitation: Number.isFinite(Number(data?.current?.precipitation)) ? Number(data.current.precipitation) : null,
      code: Number.isFinite(Number(data?.current?.weather_code)) ? Number(data.current.weather_code) : null,
    };
    setCard(
      "weather",
      "☀ IDŐJÁRÁS-AJÁNLÓ",
      weather.temperature === null ? "—°" : `${Math.round(weather.temperature)}°`,
      weatherText(weather)
    );
  } catch {
    setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az időjárás frissítése folyamatban.");
  }
}

async function refreshNameday() {
  try {
    const response = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    const names = Array.isArray(data?.names) ? data.names.join(", ") : String(data?.name || "").trim();
    const message = String(data?.message || data?.text || "").trim();
    const detail = message || (names ? `Ma ${names} ünnepli a névnapját — 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény.");
    setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", detail);
  } catch {
    setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény.");
  }
}

function refreshStaticContent() {
  ensureDock();
  const { dayNumber, hour } = budapestClock();
  const motivationIndex = ((dayNumber % MOTIVATION_QUOTES_V13.length) + MOTIVATION_QUOTES_V13.length) % MOTIVATION_QUOTES_V13.length;
  const beautyIndex = ((dayNumber * 24 + hour) % BEAUTY_QUOTES_V13.length + BEAUTY_QUOTES_V13.length) % BEAUTY_QUOTES_V13.length;
  const gymIndex = ((dayNumber * 24 + hour) % GYM_TIPS_V13.length + GYM_TIPS_V13.length) % GYM_TIPS_V13.length;
  setCard("motivation", "💬 NAPI MOTIVÁCIÓ", "MAI GONDOLAT", MOTIVATION_QUOTES_V13[motivationIndex]);
  setCard("beauty", "✨ SZÉPSÉG · ÓRÁNKÉNT ÚJ", "SZÉPSÉG-IDÉZET", BEAUTY_QUOTES_V13[beautyIndex]);
  setCard("gym", "🏋 GYM GYAKORLAT TIPP", "TECHNIKA", GYM_TIPS_V13[gymIndex]);
  setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény.");
  setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az aktuális időjárás frissítése folyamatban.");
}

function applyPriceMode() {
  const panel = document.querySelector<HTMLElement>(".sgServices");
  if (!panel) return;
  panel.classList.add("sgPricesPanelV16");
  const title = panel.querySelector<HTMLElement>(".sgPanelHeader h2");
  if (title && title.textContent !== "ÁRAINK") title.textContent = "ÁRAINK";
  const meta = panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta");
  if (meta) meta.textContent = "Szolgáltatás • Ár";
  const list = panel.querySelector<HTMLElement>(".sgSvcList");
  list?.classList.add("sgPriceListV16");
  panel.querySelectorAll<HTMLElement>(".sgSvcItem").forEach((row) => row.classList.add("sgPriceRowV16"));
  const hint = panel.querySelector<HTMLElement>(".sgHint");
  if (hint) hint.textContent = "Árlista automatikusan gördül";
}

export function installSignageInfoCardsV16() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageInfoCardsV16Installed) return;
  (window as any).__kleoSignageInfoCardsV16Installed = true;

  const start = () => {
    if (!isSignage()) return;
    ensureDock();
    syncDockBounds();
    applyPriceMode();
    refreshStaticContent();
    void refreshNameday();
    void refreshWeather();
    if (!raf) raf = window.requestAnimationFrame(tick);
    if (!contentTimer) contentTimer = window.setInterval(refreshStaticContent, 60_000);
    if (!namedayTimer) namedayTimer = window.setInterval(() => void refreshNameday(), 5 * 60_000);
    if (!weatherTimer) weatherTimer = window.setInterval(() => void refreshWeather(), 10 * 60_000);
    if (!uiTimer) uiTimer = window.setInterval(() => { syncDockBounds(); applyPriceMode(); }, 750);
  };

  window.setTimeout(start, 150);
  window.setTimeout(start, 650);
  window.setTimeout(start, 1500);
  window.addEventListener("resize", syncDockBounds, { passive: true });
  window.addEventListener("beforeunload", () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (contentTimer) window.clearInterval(contentTimer);
    if (namedayTimer) window.clearInterval(namedayTimer);
    if (weatherTimer) window.clearInterval(weatherTimer);
    if (uiTimer) window.clearInterval(uiTimer);
    dock?.remove();
  });
}
