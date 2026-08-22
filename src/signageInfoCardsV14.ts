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
let boundsTimer = 0;
let observer: MutationObserver | null = null;

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
  return `<article class="sgxInfoCardV14 sgxInfoCardV14--${kind}" data-v14-kind="${kind}">
    <span class="sgxInfoCardV14__kicker"></span>
    <strong class="sgxInfoCardV14__strong"></strong>
    <small class="sgxInfoCardV14__small"></small>
  </article>`;
}

function setCard(kind: CardKind, kicker: string, strong: string, small: string) {
  const card = dock?.querySelector<HTMLElement>(`[data-v14-kind="${kind}"]`);
  if (!card) return;
  const kickerNode = card.querySelector<HTMLElement>(".sgxInfoCardV14__kicker");
  const strongNode = card.querySelector<HTMLElement>(".sgxInfoCardV14__strong");
  const smallNode = card.querySelector<HTMLElement>(".sgxInfoCardV14__small");
  if (kickerNode) kickerNode.textContent = kicker;
  if (strongNode) strongNode.textContent = strong;
  if (smallNode) smallNode.textContent = small;
}

function hideLegacyCards() {
  document.querySelectorAll<HTMLElement>(".sgx-widgetDock-v3, .sgx-widget-birthday, .sgx-popup-kind-birthday, .sgx-toast-birthday, .sgxInfoDockV13").forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.setAttribute("aria-hidden", "true");
  });
}

function ensureDock() {
  if (!isSignage()) return null;
  const root = document.querySelector<HTMLElement>(".sgx");
  if (!root) return null;
  hideLegacyCards();
  if (dock && document.contains(dock)) return dock;

  dock = document.createElement("div");
  dock.className = "sgxInfoDockV14";
  dock.dataset.infoRuntime = "five-lane-info-cards-v14";
  dock.innerHTML = CARD_KINDS.map(cardMarkup).join("");
  root.appendChild(dock);
  refreshStaticContent();
  return dock;
}

function contentBandRect() {
  const grid = document.querySelector<HTMLElement>(".sgGrid");
  const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  const source = grid || video?.parentElement || video;
  if (!source) return null;
  const rect = source.getBoundingClientRect();
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(window.innerWidth, rect.right);
  const bottom = Math.min(window.innerHeight, rect.bottom);
  if (right - left < 520 || bottom - top < 170) return null;
  return { left, top, width: right - left, height: bottom - top };
}

function syncBounds() {
  const node = ensureDock();
  const rect = contentBandRect();
  if (!node || !rect) return;
  node.style.left = `${rect.left}px`;
  node.style.top = `${rect.top}px`;
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
  node.dataset.bounds = "video-row-five-lanes-v14";
}

function layout(now: number) {
  const node = ensureDock();
  if (!node) return;
  const width = node.clientWidth;
  const height = node.clientHeight;
  if (width <= 0 || height <= 0) return;

  const columns = width >= 1180 ? 5 : width >= 820 ? 3 : 2;
  const rows = Math.ceil(CARD_KINDS.length / columns);
  const gapX = width >= 1180 ? 14 : 10;
  const gapY = 10;
  const laneWidth = (width - gapX * (columns - 1)) / columns;
  const laneHeight = (height - gapY * (rows - 1)) / rows;

  CARD_KINDS.forEach((kind, index) => {
    const card = node.querySelector<HTMLElement>(`[data-v14-kind="${kind}"]`);
    if (!card) return;
    const col = index % columns;
    const row = Math.floor(index / columns);
    const cardWidth = Math.max(170, Math.min(322, laneWidth - 12));
    const cardHeight = Math.max(78, Math.min(108, laneHeight - 18));
    const laneLeft = col * (laneWidth + gapX);
    const laneTop = row * (laneHeight + gapY);
    const baseX = laneLeft + (laneWidth - cardWidth) / 2;
    const baseY = laneTop + (laneHeight - cardHeight) / 2;
    const phase = index * 1.73;
    const driftX = Math.sin(now * (0.00042 + index * 0.000025) + phase) * Math.min(10, laneWidth * 0.035);
    const driftY = Math.cos(now * (0.00054 + index * 0.00002) + phase) * Math.min(6, laneHeight * 0.045);
    const tilt = Math.sin(now * 0.00033 + phase) * 0.28;

    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.transform = `translate3d(${(baseX + driftX).toFixed(1)}px, ${(baseY + driftY).toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}deg)`;
    card.style.zIndex = String(300 + index);
    card.dataset.lane = `${row + 1}-${col + 1}`;
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
    setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", weather.temperature === null ? "—°" : `${Math.round(weather.temperature)}°`, weatherText(weather));
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
  const { dayNumber, hour } = budapestClock();
  const motivationIndex = ((dayNumber % MOTIVATION_QUOTES_V13.length) + MOTIVATION_QUOTES_V13.length) % MOTIVATION_QUOTES_V13.length;
  const beautyIndex = ((dayNumber * 24 + hour) % BEAUTY_QUOTES_V13.length + BEAUTY_QUOTES_V13.length) % BEAUTY_QUOTES_V13.length;
  const gymIndex = ((dayNumber * 24 + hour) % GYM_TIPS_V13.length + GYM_TIPS_V13.length) % GYM_TIPS_V13.length;
  setCard("motivation", "💬 NAPI MOTIVÁCIÓ", "MAI GONDOLAT", MOTIVATION_QUOTES_V13[motivationIndex]);
  setCard("beauty", "✨ SZÉPSÉG · ÓRÁNKÉNT ÚJ", "SZÉPSÉG-IDÉZET", BEAUTY_QUOTES_V13[beautyIndex]);
  setCard("gym", "🏋 GYM GYAKORLAT TIPP", "TECHNIKA", GYM_TIPS_V13[gymIndex]);
  if (!dock?.querySelector('[data-v14-kind="nameday"] .sgxInfoCardV14__strong')?.textContent) {
    setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény.");
  }
  if (!dock?.querySelector('[data-v14-kind="weather"] .sgxInfoCardV14__strong')?.textContent) {
    setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az aktuális időjárás frissítése folyamatban.");
  }
}

export function installSignageInfoCardsV14() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageInfoCardsV14Installed) return;
  (window as any).__kleoSignageInfoCardsV14Installed = true;

  window.setTimeout(() => {
    if (!isSignage()) return;
    ensureDock();
    hideLegacyCards();
    syncBounds();
    refreshStaticContent();
    void refreshNameday();
    void refreshWeather();
    raf = window.requestAnimationFrame(tick);
    contentTimer = window.setInterval(refreshStaticContent, 60_000);
    namedayTimer = window.setInterval(() => void refreshNameday(), 5 * 60_000);
    weatherTimer = window.setInterval(() => void refreshWeather(), 10 * 60_000);
    boundsTimer = window.setInterval(syncBounds, 1500);
    observer = new MutationObserver(() => hideLegacyCards());
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }, 350);

  window.addEventListener("resize", syncBounds, { passive: true });
  window.addEventListener("beforeunload", () => {
    if (raf) window.cancelAnimationFrame(raf);
    if (contentTimer) window.clearInterval(contentTimer);
    if (namedayTimer) window.clearInterval(namedayTimer);
    if (weatherTimer) window.clearInterval(weatherTimer);
    if (boundsTimer) window.clearInterval(boundsTimer);
    observer?.disconnect();
  });
}
