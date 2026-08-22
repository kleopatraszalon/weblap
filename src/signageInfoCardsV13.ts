import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type CardKind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type MovingCard = { el: HTMLElement; x: number; y: number; vx: number; vy: number; phase: number; nextTurnAt: number };
type WeatherState = { temperature: number | null; precipitation: number | null; code: number | null };

const CARD_KINDS: CardKind[] = ["nameday", "weather", "motivation", "beauty", "gym"];
const moving = new Map<CardKind, MovingCard>();
let dock: HTMLDivElement | null = null;
let raf = 0;
let lastNow = 0;
let contentTimer = 0;
let namedayTimer = 0;
let weatherTimer = 0;
let boundsTimer = 0;

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");
const rand = (min: number, max: number) => min + Math.random() * (max - min);

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
  const dateKey = `${value("year")}-${value("month")}-${value("day")}`;
  const hour = Number(value("hour")) || 0;
  const [year, month, day] = dateKey.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  return { hour, dayNumber };
}

function cardMarkup(kind: CardKind) {
  return `<article class="sgxInfoCardV13 sgxInfoCardV13--${kind}" data-info-kind="${kind}">
    <span class="sgxInfoCardV13__kicker"></span>
    <strong class="sgxInfoCardV13__strong"></strong>
    <small class="sgxInfoCardV13__small"></small>
  </article>`;
}

function setCard(kind: CardKind, kicker: string, strong: string, small: string) {
  const card = dock?.querySelector<HTMLElement>(`[data-info-kind="${kind}"]`);
  if (!card) return;
  const kickerNode = card.querySelector<HTMLElement>(".sgxInfoCardV13__kicker");
  const strongNode = card.querySelector<HTMLElement>(".sgxInfoCardV13__strong");
  const smallNode = card.querySelector<HTMLElement>(".sgxInfoCardV13__small");
  if (kickerNode) kickerNode.textContent = kicker;
  if (strongNode) strongNode.textContent = strong;
  if (smallNode) smallNode.textContent = small;
}

function ensureDock() {
  if (!isSignage()) return null;
  const root = document.querySelector<HTMLElement>(".sgx");
  if (!root) return null;
  if (dock && document.contains(dock)) return dock;

  moving.clear();
  dock = document.createElement("div");
  dock.className = "sgxInfoDockV13";
  dock.dataset.infoRuntime = "info-cards-v13-video-band";
  dock.innerHTML = CARD_KINDS.map(cardMarkup).join("");
  root.appendChild(dock);
  refreshStaticContent();
  return dock;
}

function videoBandRect() {
  const grid = document.querySelector<HTMLElement>(".sgGrid");
  const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  const source = grid || video?.parentElement || video;
  if (!source) return null;
  const rect = source.getBoundingClientRect();
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(window.innerWidth, rect.right);
  const bottom = Math.min(window.innerHeight, rect.bottom);
  if (right - left < 420 || bottom - top < 180) return null;
  return { left, top, width: right - left, height: bottom - top };
}

function syncBounds() {
  const node = ensureDock();
  const rect = videoBandRect();
  if (!node || !rect) return;
  node.style.left = `${rect.left}px`;
  node.style.top = `${rect.top}px`;
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
  node.dataset.bounds = "video-row-v13";
}

function speed() { return rand(18, 42); }

function randomVelocity(card: MovingCard) {
  const angle = rand(0, Math.PI * 2);
  const s = speed();
  card.vx = Math.cos(angle) * s;
  card.vy = Math.sin(angle) * s * 0.62;
  card.nextTurnAt = performance.now() + rand(5200, 11200);
}

function seedPosition(index: number, maxX: number, maxY: number) {
  const seeds = [[0.03, 0.07], [0.75, 0.08], [0.05, 0.72], [0.72, 0.72], [0.39, 0.42]];
  const [sx, sy] = seeds[index % seeds.length];
  return { x: maxX * sx, y: maxY * sy };
}

function refreshMovingCards() {
  const node = ensureDock();
  if (!node) return;
  const dockRect = node.getBoundingClientRect();
  CARD_KINDS.forEach((kind, index) => {
    const el = node.querySelector<HTMLElement>(`[data-info-kind="${kind}"]`);
    if (!el) return;
    el.style.willChange = "transform";
    if (!moving.has(kind)) {
      const maxX = Math.max(0, dockRect.width - el.offsetWidth);
      const maxY = Math.max(0, dockRect.height - el.offsetHeight);
      const pos = seedPosition(index, maxX, maxY);
      const state: MovingCard = { el, x: pos.x, y: pos.y, vx: 0, vy: 0, phase: rand(0, Math.PI * 2), nextTurnAt: 0 };
      randomVelocity(state);
      moving.set(kind, state);
    }
  });
}

function separateCards() {
  const list = Array.from(moving.values());
  for (let i = 0; i < list.length; i += 1) {
    for (let j = i + 1; j < list.length; j += 1) {
      const a = list[i];
      const b = list[j];
      const dx = (a.x + a.el.offsetWidth / 2) - (b.x + b.el.offsetWidth / 2);
      const dy = (a.y + a.el.offsetHeight / 2) - (b.y + b.el.offsetHeight / 2);
      const overlapX = (a.el.offsetWidth + b.el.offsetWidth) / 2 + 14 - Math.abs(dx);
      const overlapY = (a.el.offsetHeight + b.el.offsetHeight) / 2 + 10 - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0) continue;
      if (overlapX < overlapY) {
        const push = Math.min(8, overlapX / 2 + 1);
        a.x += dx >= 0 ? push : -push;
        b.x += dx >= 0 ? -push : push;
        a.vx *= -1;
        b.vx *= -1;
      } else {
        const push = Math.min(6, overlapY / 2 + 1);
        a.y += dy >= 0 ? push : -push;
        b.y += dy >= 0 ? -push : push;
        a.vy *= -1;
        b.vy *= -1;
      }
    }
  }
}

function tick(now: number) {
  if (!lastNow) lastNow = now;
  const dt = Math.min(0.05, Math.max(0, (now - lastNow) / 1000));
  lastNow = now;

  if (isSignage()) {
    const node = ensureDock();
    if (node) {
      refreshMovingCards();
      const dockRect = node.getBoundingClientRect();
      moving.forEach((card, kind) => {
        const kindIndex = Math.max(0, CARD_KINDS.indexOf(kind));
        const maxX = Math.max(0, dockRect.width - card.el.offsetWidth);
        const maxY = Math.max(0, dockRect.height - card.el.offsetHeight);
        if (now >= card.nextTurnAt) randomVelocity(card);
        card.x += card.vx * dt;
        card.y += card.vy * dt;
        if (card.x <= 0) { card.x = 0; card.vx = Math.abs(card.vx) || speed(); }
        if (card.x >= maxX) { card.x = maxX; card.vx = -Math.abs(card.vx) || -speed(); }
        if (card.y <= 0) { card.y = 0; card.vy = Math.abs(card.vy) || speed() * 0.6; }
        if (card.y >= maxY) { card.y = maxY; card.vy = -Math.abs(card.vy) || -speed() * 0.6; }
        const bob = Math.sin(now * 0.0011 + card.phase) * 3.2;
        const tilt = Math.sin(now * 0.0007 + card.phase) * 0.42;
        card.el.style.transform = `translate3d(${card.x.toFixed(1)}px, ${(card.y + bob).toFixed(1)}px, 0) rotate(${tilt.toFixed(3)}deg)`;
        card.el.style.zIndex = String(260 + ((kindIndex + Math.floor(now / 9000)) % 5));
      });
      separateCards();
    }
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
  if (t !== null && t <= 8) return "Hűvös nap: jöhet egy kényeztető, melegítő szépségpillanat.";
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
    const detail = message || (names ? `Ma ${names} ünnepli a névnapját — névnapos vendégeinknek 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény.");
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
  setCard("motivation", "☀ NAPI MOTIVÁCIÓ", "MAI GONDOLAT", MOTIVATION_QUOTES_V13[motivationIndex]);
  setCard("beauty", "✨ SZÉPSÉG · ÓRÁNKÉNT ÚJ", "SZÉPSÉG-IDÉZET", BEAUTY_QUOTES_V13[beautyIndex]);
  setCard("gym", "🏋 GYM GYAKORLAT TIPP", "TECHNIKA", GYM_TIPS_V13[gymIndex]);
  if (!dock?.querySelector('[data-info-kind="nameday"] .sgxInfoCardV13__strong')?.textContent) {
    setCard("nameday", "🎁 NÉVNAPI KEDVEZMÉNY", "20%", "Mai névnapos vendégeinknek 20% kedvezmény.");
  }
  if (!dock?.querySelector('[data-info-kind="weather"] .sgxInfoCardV13__strong')?.textContent) {
    setCard("weather", "☀ IDŐJÁRÁS-AJÁNLÓ", "—°", "Az aktuális időjárás frissítése folyamatban.");
  }
}

export function installSignageInfoCardsV13() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageInfoCardsV13Installed) return;
  (window as any).__kleoSignageInfoCardsV13Installed = true;

  window.setTimeout(() => {
    if (!isSignage()) return;
    ensureDock();
    syncBounds();
    refreshStaticContent();
    void refreshNameday();
    void refreshWeather();
    lastNow = performance.now();
    raf = window.requestAnimationFrame(tick);
    contentTimer = window.setInterval(refreshStaticContent, 60_000);
    namedayTimer = window.setInterval(() => void refreshNameday(), 5 * 60_000);
    weatherTimer = window.setInterval(() => void refreshWeather(), 10 * 60_000);
    boundsTimer = window.setInterval(syncBounds, 1000);
  }, 550);

  const onResize = () => syncBounds();
  window.addEventListener("resize", onResize);
  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", onResize);
    if (raf) window.cancelAnimationFrame(raf);
    window.clearInterval(contentTimer);
    window.clearInterval(namedayTimer);
    window.clearInterval(weatherTimer);
    window.clearInterval(boundsTimer);
  });
}
