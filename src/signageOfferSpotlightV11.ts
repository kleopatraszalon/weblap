import { API_BASE } from "./apiClient";

type OfferCard = {
  id: string;
  label: string;
  title: string;
  body: string;
  price?: string;
  kind: "flash" | "deal" | "slot" | "product" | "fallback";
};

let host: HTMLDivElement | null = null;
let refreshTimer = 0;
let showTimer = 0;
let hideTimer = 0;
let positionTimer = 0;
let cards: OfferCard[] = [];
let lastId = "";

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

const money = (value: unknown) => {
  const n = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? `${Math.round(n).toLocaleString("hu-HU")} Ft` : "";
};

const pickArray = (value: any, keys: string[]) => {
  if (Array.isArray(value)) return value;
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return [];
};

async function getJson(path: string) {
  const response = await fetch(`${API_BASE}${path}${path.includes("?") ? "&" : "?"}_=${Date.now()}`, {
    cache: "no-store",
    credentials: "omit",
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${response.status}`);
  return response.json();
}

function positionHost() {
  if (!host || !document.contains(host)) return;
  const video = document.querySelector<HTMLElement>(".sgPanel.sgVideo");
  const band = document.querySelector<HTMLElement>(".sgGrid");
  const target = video || band;
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (rect.width < 120 || rect.height < 80) return;

  const width = Math.max(300, Math.min(760, rect.width * (video ? 0.78 : 0.46)));
  const left = rect.left + rect.width / 2;
  const top = rect.top + rect.height * (video ? 0.52 : 0.46);
  host.style.setProperty("--sg-offer-left", `${left}px`);
  host.style.setProperty("--sg-offer-top", `${top}px`);
  host.style.setProperty("--sg-offer-width", `${width}px`);
  host.dataset.offerBand = "video-row-v12";
}

function ensureHost() {
  if (!isSignage()) return null;
  const root = document.querySelector<HTMLElement>(".sgx");
  if (!root) return null;
  if (host && document.contains(host)) {
    positionHost();
    return host;
  }

  host = document.createElement("div");
  host.className = "sgOfferSpotlightV11";
  host.dataset.offerRuntime = "spotlight-content-band-v12";
  host.setAttribute("aria-live", "polite");
  host.innerHTML = `
    <div class="sgOfferSpotlightV11__glow" aria-hidden="true"></div>
    <div class="sgOfferSpotlightV11__kicker"></div>
    <div class="sgOfferSpotlightV11__title"></div>
    <div class="sgOfferSpotlightV11__body"></div>
    <div class="sgOfferSpotlightV11__price"></div>
    <div class="sgOfferSpotlightV11__progress" aria-hidden="true"></div>
  `;
  root.appendChild(host);
  positionHost();
  return host;
}

function text(selector: string, value: string) {
  const node = host?.querySelector<HTMLElement>(selector);
  if (node) node.textContent = value;
}

function renderCard(card: OfferCard) {
  const node = ensureHost();
  if (!node) return;
  positionHost();
  text(".sgOfferSpotlightV11__kicker", card.label);
  text(".sgOfferSpotlightV11__title", card.title);
  text(".sgOfferSpotlightV11__body", card.body);
  text(".sgOfferSpotlightV11__price", card.price || "");
  node.dataset.kind = card.kind;
  node.classList.remove("is-visible");
  void node.offsetWidth;
  node.classList.add("is-visible");
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => node.classList.remove("is-visible"), 9_500);
}

function chooseCard() {
  if (!cards.length) return null;
  const pool = cards.filter((item) => item.id !== lastId);
  const list = pool.length ? pool : cards;
  const selected = list[Math.floor(Math.random() * list.length)];
  lastId = selected.id;
  return selected;
}

function scheduleNext(first = false) {
  window.clearTimeout(showTimer);
  showTimer = window.setTimeout(() => {
    if (!isSignage()) return;
    const selected = chooseCard();
    if (selected) renderCard(selected);
    scheduleNext(false);
  }, first ? 2_500 : Math.round(18_000 + Math.random() * 10_000));
}

async function refreshCards() {
  if (!isSignage()) return;
  const next: OfferCard[] = [];

  const [flash, deals, slots, products] = await Promise.all([
    getJson("/api/signage/flash").catch(() => ({})),
    getJson("/api/signage/deals").catch(() => ({ deals: [] })),
    getJson("/api/public/booking/v4/last-minute").catch(() => ({ offers: [] })),
    getJson("/api/public/webshop/products").catch(() => []),
  ]);

  if (flash?.flash?.title) {
    next.push({ id: `flash-${flash.flash.id || flash.flash.title}`, kind: "flash", label: "⚡ VILLÁM AJÁNLAT", title: String(flash.flash.title), body: String(flash.flash.body || "Kérdezd kollégáinkat a részletekről.") });
  }

  pickArray(deals, ["deals", "items", "rows"])
    .filter((d: any) => d?.active !== false && d?.enabled !== false && d?.title)
    .slice(0, 8)
    .forEach((d: any) => next.push({ id: `deal-${d.id || d.title}`, kind: "deal", label: "KLEOPÁTRA · AJÁNLAT", title: String(d.title), body: String(d.subtitle || d.body || "Kérdezd kollégáinkat a részletekről."), price: String(d.price_text || "") }));

  pickArray(slots, ["offers", "items", "rows"])
    .filter((s: any) => s?.start_time && new Date(s.start_time).getTime() > Date.now())
    .slice(0, 4)
    .forEach((s: any) => {
      const time = new Date(s.start_time).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Budapest" });
      next.push({ id: `slot-${s.id || s.start_time}`, kind: "slot", label: "MOST FELSZABADULT IDŐPONT", title: `${time} · ${s.service_name || "Szépségidőpont"}`, body: `${s.location_name || "Kleopátra Szépségszalon"}${s.employee_name ? ` · ${s.employee_name}` : ""}`, price: money(s.offer_price || s.original_price) });
    });

  pickArray(products, ["items", "products", "rows"])
    .filter((p: any) => p?.name)
    .slice(0, 6)
    .forEach((p: any) => next.push({ id: `product-${p.id || p.name}`, kind: "product", label: "KLEOSHOP · AJÁNLÓ", title: String(p.name), body: String(p.web_description || "Kérdezd kollégáinkat az otthoni szépségápolási ajánlásról.").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 150), price: money(p.sale_price || p.retail_price_gross) }));

  if (!next.length) {
    next.push({ id: "fallback-daily", kind: "fallback", label: "KLEOPÁTRA · MAI AJÁNLATOK", title: "Mai szépségajánlat", body: "Kérdezd kollégáinkat a ma elérhető kezelésekről, szabad időpontokról és KLEOSHOP ajánlatokról." });
  }

  cards = next;
}

export function installSignageOfferSpotlightV11() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ((window as any).__kleoSignageOfferSpotlightV11Installed) return;
  (window as any).__kleoSignageOfferSpotlightV11Installed = true;
  (window as any).__kleoSignageOfferContentBandV12 = true;

  window.setTimeout(() => {
    if (!isSignage()) return;
    ensureHost();
    void refreshCards().then(() => scheduleNext(true));
    refreshTimer = window.setInterval(() => void refreshCards(), 60_000);
    positionTimer = window.setInterval(positionHost, 1000);
  }, 350);

  window.addEventListener("resize", positionHost);
  window.addEventListener("beforeunload", () => {
    window.clearInterval(refreshTimer);
    window.clearInterval(positionTimer);
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    window.removeEventListener("resize", positionHost);
  });
}
