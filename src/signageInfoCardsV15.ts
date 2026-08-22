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
let observer: MutationObserver | null = null;

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function budapestClock() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Budapest", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const value = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  const year = Number(value("year"));
  const month = Number(value("month"));
  const day = Number(value("day"));
  return { hour: Number(value("hour")) || 0, dayNumber: Math.floor(Date.UTC(year, month - 1, day) / 86400000) };
}

function cardMarkup(kind: CardKind) {
  return `<article class="sgxInfoCardV15 sgxInfoCardV15--${kind}" data-v15-kind="${kind}"><span class="sgxInfoCardV15__kicker"></span><strong class="sgxInfoCardV15__strong"></strong><small class="sgxInfoCardV15__small"></small></article>`;
}

function setCard(kind: CardKind, kicker: string, strong: string, small: string) {
  const card = dock?.querySelector<HTMLElement>(`[data-v15-kind="${kind}"]`);
  if (!card) return;
  const a = card.querySelector<HTMLElement>(".sgxInfoCardV15__kicker");
  const b = card.querySelector<HTMLElement>(".sgxInfoCardV15__strong");
  const c = card.querySelector<HTMLElement>(".sgxInfoCardV15__small");
  if (a) a.textContent = kicker;
  if (b) b.textContent = strong;
  if (c) c.textContent = small;
}

function hideLegacyCards() {
  document.querySelectorAll<HTMLElement>(".sgx-widgetDock-v3, .sgx-widget-birthday, .sgx-popup-kind-birthday, .sgx-toast-birthday, .sgxInfoDockV13, .sgxInfoDockV14").forEach((el) => {
    el.style.setProperty("display", "none", "important");
    el.setAttribute("aria-hidden", "true");
  });
}

function ensureDock() {
  if (!isSignage()) return null;
  const grid = document.querySelector<HTMLElement>(".sgGrid");
  if (!grid) return null;
  hideLegacyCards();
  if (dock && document.contains(dock) && dock.parentElement === grid) return dock;
  dock?.remove();
  dock = document.createElement("div");
  dock.className = "sgxInfoDockV15";
  dock.dataset.infoRuntime = "five-lane-grid-child-v15";
  dock.innerHTML = CARD_KINDS.map(cardMarkup).join("");
  grid.appendChild(dock);
  refreshStaticContent();
  return dock;
}

function layout(now: number) {
  const node = ensureDock();
  if (!node) return;
  const width = node.clientWidth;
  const height = node.clientHeight;
  if (width < 500 || height < 160) return;
  const gap = Math.max(8, Math.min(18, width * 0.008));
  const laneWidth = (width - gap * 4) / 5;
  const cardWidth = Math.max(120, laneWidth - Math.max(10, width * 0.005));
  const cardHeight = Math.max(78, Math.min(108, height * 0.27));
  const verticalSeeds = [0.08, 0.67, 0.36, 0.10, 0.65];
  CARD_KINDS.forEach((kind, index) => {
    const card = node.querySelector<HTMLElement>(`[data-v15-kind="${kind}"]`);
    if (!card) return;
    const laneLeft = index * (laneWidth + gap);
    const baseX = laneLeft + (laneWidth - cardWidth) / 2;
    const maxY = Math.max(0, height - cardHeight - 10);
    const baseY = 5 + maxY * verticalSeeds[index];
    const phase = index * 1.61;
    const driftX = Math.sin(now * (0.00038 + index * 0.00002) + phase) * Math.min(7, laneWidth * 0.025);
    const driftY = Math.cos(now * (0.00052 + index * 0.000018) + phase) * 5;
    const tilt = Math.sin(now * 0.00029 + phase) * 0.22;
    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.transform = `translate3d(${(baseX + driftX).toFixed(1)}px, ${(baseY + driftY).toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}deg)`;
    card.style.zIndex = String(410 + index);
    card.dataset.lane = String(index + 1);
  });
}

function tick(now: number) {
  if (isSignage()) { hideLegacyCards(); layout(now); }
  raf = window.requestAnimationFrame(tick);
}

function weatherText(weather: WeatherState) {
  const t = weather.temperature;
  const p = weather.precipitation || 0;
  const c = weather.code ?? 0;
  const rainCodes = new Set([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99]);
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
    const weather: WeatherState = { temperature: Number.isFinite(Number(data?.current?.temperature_2m)) ? Number(data.current.temperature_2m) : null, precipitation: Number.isFinite(Number(data?.current?.precipitation)) ? Number(data.current.precipitation) : null, code: Number.isFinite(Number(data?.current?.weather_code)) ? Number(data.current.weather_code) : null };
    setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", weather.temperature === null ? "—°" : `${Math.round(weather.temperature)}°`, weatherText(weather));
  } catch { setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az időjárás frissítése folyamatban."); }
}

async function refreshNameday() {
  try {
    const response = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, { cache: "no-store", credentials: "omit", headers: { Accept: "application/json", "Cache-Control": "no-cache" } });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    const names = Array.isArray(data?.names) ? data.names.join(", ") : String(data?.name || "").trim();
    const message = String(data?.message || data?.text || "").trim();
    const detail = message || (names ? `Ma ${names} ünnepli a névnapját — 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény.");
    setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", detail);
  } catch { setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény."); }
}

function refreshStaticContent() {
  const { dayNumber, hour } = budapestClock();
  const motivationIndex = ((dayNumber % MOTIVATION_QUOTES_V13.length) + MOTIVATION_QUOTES_V13.length) % MOTIVATION_QUOTES_V13.length;
  const beautyIndex = ((dayNumber * 24 + hour) % BEAUTY_QUOTES_V13.length + BEAUTY_QUOTES_V13.length) % BEAUTY_QUOTES_V13.length;
  const gymIndex = ((dayNumber * 24 + hour) % GYM_TIPS_V13.length + GYM_TIPS_V13.length) % GYM_TIPS_V13.length;
  setCard("motivation", "💬 NAPI MOTIVÁCIÓ", "MAI GONDOLAT", MOTIVATION_QUOTES_V13[motivationIndex]);
  setCard("beauty", "✨ SZÉPSÉG · ÓRÁNKÉNT ÚJ", "SZÉPSÉG-IDÉZET", BEAUTY_QUOTES_V13[beautyIndex]);
  setCard("gym", "🏋 GYM GYAKORLAT TIPP", "TECHNIKA", GYM_TIPS_V13[gymIndex]);
  if (!dock?.querySelector('[data-v15-kind="nameday"] .sgxInfoCardV15__strong')?.textContent) setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény.");
  if (!dock?.querySelector('[data-v15-kind="weather"] .sgxInfoCardV15__strong')?.textContent) setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az aktuális időjárás frissítése folyamatban.");
}

export function installSignageInfoCardsV15() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageInfoCardsV15Installed) return;
  (window as any).__kleoSignageInfoCardsV15Installed = true;
  const start = () => {
    if (!isSignage()) return;
    ensureDock(); hideLegacyCards(); refreshStaticContent(); void refreshNameday(); void refreshWeather();
    if (!raf) raf = window.requestAnimationFrame(tick);
    if (!contentTimer) contentTimer = window.setInterval(refreshStaticContent, 60_000);
    if (!namedayTimer) namedayTimer = window.setInterval(() => void refreshNameday(), 5 * 60_000);
    if (!weatherTimer) weatherTimer = window.setInterval(() => void refreshWeather(), 10 * 60_000);
    if (!observer) { observer = new MutationObserver(() => { hideLegacyCards(); ensureDock(); }); observer.observe(document.documentElement, { childList: true, subtree: true }); }
  };
  window.setTimeout(start, 250);
  window.setTimeout(start, 900);
  window.setTimeout(start, 1800);
  window.addEventListener("beforeunload", () => { if (raf) window.cancelAnimationFrame(raf); if (contentTimer) window.clearInterval(contentTimer); if (namedayTimer) window.clearInterval(namedayTimer); if (weatherTimer) window.clearInterval(weatherTimer); observer?.disconnect(); });
}
