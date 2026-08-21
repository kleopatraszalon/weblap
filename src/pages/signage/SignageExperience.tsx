import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../apiClient";
import { SignagePage } from "../SignagePage";
import "./signageExperience.css";
import "./signageThemeBridge.css";

type Appearance = {
  template: string;
  colors: { background: string; surface: string; surfaceAlt: string; text: string; muted: string; gold: string; accent: string; success: string };
  effects: { glow: number; blur: number; radius: number; contrast: number; motion: string; ambient: boolean; scanlines: boolean };
  popup: { enabled: boolean; intervalSec: number; durationSec: number; initialDelaySec: number; source: string; animation: string; showPrice: boolean };
};

type SurpriseKind = "offer" | "availability" | "tip" | "nameday" | "birthday" | "slot" | "product" | "weather";
type Promo = {
  id?: string;
  title: string;
  body?: string;
  subtitle?: string;
  price_text?: string;
  image_url?: string;
  kind?: SurpriseKind;
  label?: string;
};

type InsightState = {
  freePros: number;
  visiblePros: number;
  activeDeals: number;
  beautyTip: string;
  nameday: string;
};

type BirthdayState = { celebrating: boolean; count: number; message: string; date?: string };
type LastMinute = {
  id: string;
  location_id?: string;
  service_id?: string;
  employee_id?: string;
  start_time: string;
  end_time?: string;
  original_price?: number | string | null;
  offer_price?: number | string | null;
  discount_percent?: number | string | null;
  location_name?: string;
  service_name?: string;
  employee_name?: string;
  photo_url?: string | null;
};
type ProductRec = {
  id: string;
  name: string;
  retail_price_gross?: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  web_description?: string | null;
  main_category?: string | null;
  sub_category?: string | null;
};
type WeatherState = { temperature: number; precipitation: number; code: number; fetchedAt: string };

const FALLBACK: Appearance = {
  template: "classic",
  colors: {
    background: "#fbfaf8",
    surface: "#ffffff",
    surfaceAlt: "#f3eee7",
    text: "#120c08",
    muted: "#5d5a55",
    gold: "#b69861",
    accent: "#ec008c",
    success: "#41a86f",
  },
  effects: { glow: 0, blur: 0, radius: 24, contrast: 1, motion: "medium", ambient: true, scanlines: false },
  popup: { enabled: true, intervalSec: 150, durationSec: 12, initialDelaySec: 18, source: "flash_then_deal", animation: "impact", showPrice: true },
};

const EMPTY_INSIGHTS: InsightState = { freePros: 0, visiblePros: 0, activeDeals: 0, beautyTip: "", nameday: "" };
const EMPTY_BIRTHDAY: BirthdayState = { celebrating: false, count: 0, message: "" };
const merge = (x: any): Appearance => ({ ...FALLBACK, ...x, colors: { ...FALLBACK.colors, ...(x?.colors || {}) }, effects: { ...FALLBACK.effects, ...(x?.effects || {}) }, popup: { ...FALLBACK.popup, ...(x?.popup || {}) } });

async function getJson(path: string, bust = false) {
  const suffix = bust ? `${path.includes("?") ? "&" : "?"}_=${Date.now()}` : "";
  const r = await fetch(`${API_BASE}${path}${suffix}`, {
    cache: "no-store",
    credentials: "omit",
    headers: { Accept: "application/json", "Cache-Control": "no-cache" },
  });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

function pickArray(data: any, keys: string[]) {
  if (Array.isArray(data)) return data;
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
  return [];
}

function asNumber(v: number | string | null | undefined) {
  const n = Number(typeof v === "string" ? v.replace(",", ".") : v || 0);
  return Number.isFinite(n) ? n : 0;
}
function money(v: number | string | null | undefined) {
  const n = asNumber(v);
  return n > 0 ? `${Math.round(n).toLocaleString("hu-HU")} Ft` : "";
}
function productPrice(p: ProductRec) {
  const retail = asNumber(p.retail_price_gross);
  const sale = asNumber(p.sale_price);
  return money(sale > 0 && (retail <= 0 || sale < retail) ? sale : retail);
}
function productImage(p: ProductRec) {
  const raw = String(p.thumbnail_url || p.image_url || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}
function shortText(value: string, max = 180) {
  const text = String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}
function slotTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "hamarosan";
  return d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Budapest" });
}
function weatherMeta(w: WeatherState | null) {
  if (!w) return { icon: "✦", label: "KLEO IDŐJÁRÁS", text: "Mai személyre szabott ajánló" };
  const rainCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (w.precipitation > 0.1 || rainCodes.has(w.code)) return { icon: "☂", label: "ESŐS NAP · KLEO", text: "Kint esik, bent jöhet egy kis feltöltődés" };
  if (w.temperature >= 27) return { icon: "☀", label: "FORRÓ NAP · KLEO", text: "Meleg napra könnyed, frissítő szépségpillanat" };
  if (w.temperature <= 8) return { icon: "❄", label: "HŰVÖS NAP · KLEO", text: "Hűvös napra kényeztető szépségpillanat" };
  if (w.code <= 2) return { icon: "☀", label: "NAPFÉNYES KLEO TIPP", text: "Ragyogó naphoz egy ragyogó választás" };
  return { icon: "◌", label: "MAI KLEO AJÁNLÓ", text: "A mai időhöz választott szépségpillanat" };
}

export function SignageExperience() {
  const [appearance, setAppearance] = useState<Appearance>(FALLBACK);
  const [popup, setPopup] = useState<Promo | null>(null);
  const [microSurprise, setMicroSurprise] = useState<Promo | null>(null);
  const [offers, setOffers] = useState<Promo[]>([]);
  const [insights, setInsights] = useState<InsightState>(EMPTY_INSIGHTS);
  const [birthday, setBirthday] = useState<BirthdayState>(EMPTY_BIRTHDAY);
  const [lastMinute, setLastMinute] = useState<LastMinute[]>([]);
  const [products, setProducts] = useState<ProductRec[]>([]);
  const [productIndex, setProductIndex] = useState(0);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const offerIndex = useRef(0);
  const surpriseIndex = useRef(0);
  const lastConfig = useRef("");
  const knownLastMinute = useRef<Set<string> | null>(null);

  useEffect(() => {
    let live = true;
    const loadAppearance = async () => {
      try {
        const a = await getJson("/api/signage/appearance", true);
        if (!live) return;
        const cfg = merge(a?.config);
        const signature = JSON.stringify(cfg);
        if (signature !== lastConfig.current) {
          lastConfig.current = signature;
          setAppearance(cfg);
        }
      } catch (e) {
        console.warn("[signage] appearance refresh failed", e);
      }
    };
    void loadAppearance();
    const t = window.setInterval(loadAppearance, 5000);
    const onFocus = () => void loadAppearance();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      live = false;
      window.clearInterval(t);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  useEffect(() => {
    let live = true;
    const loadOffers = async () => {
      try {
        const [flash, deals] = await Promise.all([
          getJson("/api/signage/flash", true).catch(() => ({})),
          getJson("/api/signage/deals", true).catch(() => ({ deals: [] })),
        ]);
        if (!live) return;
        const arr: Promo[] = [];
        if (appearance.popup.source !== "deal" && flash?.flash) {
          arr.push({ id: flash.flash.id, title: flash.flash.title, body: flash.flash.body, kind: "offer", label: "VILLÁM AJÁNLAT" });
        }
        if (appearance.popup.source !== "flash" && Array.isArray(deals?.deals)) {
          deals.deals.forEach((d: any) => arr.push({ id: d.id, title: d.title, body: d.subtitle, price_text: d.price_text, kind: "offer", label: "KLEOPÁTRA · AJÁNLAT" }));
        }
        setOffers(arr);
      } catch {
        // A kijelző alapnézete ajánlat-adat nélkül is működik.
      }
    };
    void loadOffers();
    const t = window.setInterval(loadOffers, 60_000);
    return () => {
      live = false;
      window.clearInterval(t);
    };
  }, [appearance.popup.source]);

  useEffect(() => {
    let live = true;
    const loadInsights = async () => {
      const [prosResult, dealsResult, dailyResult, namedayResult] = await Promise.all([
        getJson("/api/signage/professionals", true).catch(() => ({})),
        getJson("/api/signage/deals", true).catch(() => ({})),
        getJson("/api/signage/daily", true).catch(() => ({})),
        getJson("/api/signage/nameday", true).catch(() => ({})),
      ]);
      if (!live) return;
      const pros = pickArray(prosResult, ["professionals", "items", "rows"]).filter((p: any) => p?.show !== false && p?.enabled !== false);
      const deals = pickArray(dealsResult, ["deals", "items", "rows"]).filter((d: any) => d?.active !== false && d?.enabled !== false);
      const freePros = pros.filter((p: any) => (p?.is_free ?? p?.isFree ?? p?.available ?? true) === true).length;
      const beautyTip = String(dailyResult?.beauty?.text || dailyResult?.beauty || dailyResult?.tip || "").trim();
      const nameday = String(namedayResult?.message || "").trim();
      setInsights({ freePros, visiblePros: pros.length, activeDeals: deals.length, beautyTip, nameday });
    };
    void loadInsights();
    const t = window.setInterval(loadInsights, 60_000);
    return () => {
      live = false;
      window.clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let live = true;
    const loadBirthday = async () => {
      const result = await getJson("/api/signage/birthdays", true).catch(() => EMPTY_BIRTHDAY);
      if (!live) return;
      setBirthday({ celebrating: Boolean(result?.celebrating), count: Number(result?.count || 0), message: String(result?.message || ""), date: result?.date });
    };
    void loadBirthday();
    const t = window.setInterval(loadBirthday, 5 * 60_000);
    return () => { live = false; window.clearInterval(t); };
  }, []);

  useEffect(() => {
    let live = true;
    const loadLastMinute = async () => {
      const result = await getJson("/api/public/booking/v4/last-minute", true).catch(() => ({ offers: [] }));
      if (!live) return;
      const arr = pickArray(result, ["offers", "items", "rows"]) as LastMinute[];
      const active = arr.filter((x) => x?.id && x?.start_time && new Date(x.start_time).getTime() > Date.now()).slice(0, 12);
      const nextIds = new Set(active.map((x) => String(x.id)));
      if (knownLastMinute.current) {
        const fresh = active.find((x) => !knownLastMinute.current?.has(String(x.id)));
        if (fresh && appearance.popup.enabled) {
          const immediate: Promo = {
            id: `slot-${fresh.id}`,
            kind: "slot",
            label: "MOST FELSZABADULT IDŐPONT",
            title: `${slotTime(fresh.start_time)} · ${fresh.service_name || "Szépségidőpont"}`,
            body: `${fresh.location_name || "Kleopátra Szépségszalon"}${fresh.employee_name ? ` · ${fresh.employee_name}` : ""}. Foglalás: kleoszalon.hu/idopontfoglalas`,
            price_text: money(fresh.offer_price || fresh.original_price),
          };
          setMicroSurprise(immediate);
          window.setTimeout(() => setPopup(immediate), 1400);
        }
      }
      knownLastMinute.current = nextIds;
      setLastMinute(active);
    };
    void loadLastMinute();
    const t = window.setInterval(loadLastMinute, 30_000);
    return () => { live = false; window.clearInterval(t); };
  }, [appearance.popup.enabled]);

  useEffect(() => {
    let live = true;
    const loadProducts = async () => {
      const result = await getJson("/api/public/webshop/products", true).catch(() => []);
      if (!live) return;
      const all = pickArray(result, ["items", "products", "rows"]) as ProductRec[];
      const relevant = all.filter((p) => p?.id && p?.name && ["SALON_PRODUCTS", "KLEO_PRODUCTS"].includes(String(p.main_category || "")) && (asNumber(p.sale_price) > 0 || asNumber(p.retail_price_gross) > 0));
      setProducts(relevant.length ? relevant.slice(0, 40) : all.filter((p) => p?.id && p?.name).slice(0, 40));
    };
    void loadProducts();
    const t = window.setInterval(loadProducts, 10 * 60_000);
    return () => { live = false; window.clearInterval(t); };
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    const t = window.setInterval(() => setProductIndex((i) => (i + 1) % products.length), 45_000);
    return () => window.clearInterval(t);
  }, [products.length]);

  useEffect(() => {
    let live = true;
    const loadWeather = async () => {
      try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,weather_code&timezone=Europe%2FBudapest", { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const j = await r.json();
        if (!live) return;
        setWeather({ temperature: Number(j?.current?.temperature_2m || 0), precipitation: Number(j?.current?.precipitation || 0), code: Number(j?.current?.weather_code || 0), fetchedAt: new Date().toISOString() });
      } catch {
        if (live) setWeather(null);
      }
    };
    void loadWeather();
    const t = window.setInterval(loadWeather, 15 * 60_000);
    return () => { live = false; window.clearInterval(t); };
  }, []);

  const currentProduct = useMemo(() => products.length ? products[productIndex % products.length] : null, [products, productIndex]);
  const currentSlot = lastMinute[0] || null;
  const weatherInfo = useMemo(() => weatherMeta(weather), [weather]);

  const smartSurprises = useMemo<Promo[]>(() => {
    const arr: Promo[] = [];
    if (birthday.celebrating && birthday.count > 0) {
      arr.push({ id: `birthday-${birthday.date || "today"}`, kind: "birthday", label: "SZÜLETÉSNAPI KLEO MEGLEPETÉS", title: birthday.count === 1 ? "Boldog születésnapot! 🎂" : `Ma ${birthday.count} vendégünket ünnepeljük 🎂`, body: birthday.message || "Ma születésnapot ünneplünk a Kleopátrában." });
    }
    if (currentSlot) {
      arr.push({
        id: `slot-${currentSlot.id}`,
        kind: "slot",
        label: "MOST FELSZABADULT IDŐPONT",
        title: `${slotTime(currentSlot.start_time)} · ${currentSlot.service_name || "Szépségidőpont"}`,
        body: `${currentSlot.location_name || "Kleopátra Szépségszalon"}${currentSlot.employee_name ? ` · ${currentSlot.employee_name}` : ""}. Foglalás: kleoszalon.hu/idopontfoglalas`,
        price_text: money(currentSlot.offer_price || currentSlot.original_price),
      });
    }
    if (currentProduct) {
      arr.push({
        id: `product-${currentProduct.id}`,
        kind: "product",
        label: "KLEOSHOP · TERMÉKAJÁNLÓ",
        title: currentProduct.name,
        body: shortText(currentProduct.web_description || "Vidd haza a Kleopátra szépségélményt."),
        price_text: productPrice(currentProduct),
        image_url: productImage(currentProduct),
      });
    }
    const weatherBase = offers.find((x) => x.kind === "offer");
    if (weather) {
      arr.push({
        id: `weather-${weather.code}-${weatherBase?.id || "tip"}`,
        kind: "weather",
        label: `${weatherInfo.icon} ${weatherInfo.label}`,
        title: weatherBase ? weatherBase.title : weatherInfo.text,
        body: weatherBase ? `${weatherInfo.text}. ${weatherBase.body || "Nézd meg mai ajánlatainkat."}` : `${Math.round(weather.temperature)} °C · ${weatherInfo.text}. Kérdezd kollégáinkat a hozzád illő kezelésről.`,
        price_text: weatherBase?.price_text,
      });
    }
    return arr;
  }, [birthday, currentSlot, currentProduct, weather, weatherInfo, offers]);

  const classicSurprises = useMemo<Promo[]>(() => {
    const arr: Promo[] = [];
    if (insights.freePros > 0) {
      arr.push({ id: "surprise-availability", kind: "availability", label: "MOST · SZABAD HELY", title: `${insights.freePros} szakember most elérhető`, body: "Ha van kedved egy spontán frissítéshez, kérdezd a recepción kollégáinkat." });
    }
    if (insights.beautyTip) arr.push({ id: "surprise-tip", kind: "tip", label: "KLEO BEAUTY MOMENT", title: "Egy perc szépség", body: insights.beautyTip });
    if (insights.nameday) arr.push({ id: "surprise-nameday", kind: "nameday", label: "MA ÜNNEPELJÜK", title: "Boldog névnapot!", body: insights.nameday });
    return arr;
  }, [insights]);

  const surprises = useMemo(() => [...smartSurprises, ...classicSurprises], [smartSurprises, classicSurprises]);
  const popupPool = useMemo(() => [...smartSurprises, ...offers, ...classicSurprises], [smartSurprises, offers, classicSurprises]);

  useEffect(() => {
    if (!appearance.popup.enabled || !popupPool.length) return;
    let closeTimer: number | undefined;
    const show = () => {
      const current = popupPool[offerIndex.current % popupPool.length];
      offerIndex.current += 1;
      setPopup(current);
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => setPopup(null), Math.max(5, appearance.popup.durationSec) * 1000);
    };
    const firstDelay = Math.min(20, Math.max(8, appearance.popup.initialDelaySec || 18));
    const first = window.setTimeout(show, firstDelay * 1000);
    const repeat = window.setInterval(show, Math.max(45, appearance.popup.intervalSec) * 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(repeat);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [appearance.popup.enabled, appearance.popup.initialDelaySec, appearance.popup.intervalSec, appearance.popup.durationSec, popupPool]);

  useEffect(() => {
    if (!appearance.popup.enabled || !surprises.length) return;
    let hideTimer: number | undefined;
    const show = () => {
      const item = surprises[surpriseIndex.current % surprises.length];
      surpriseIndex.current += 1;
      setMicroSurprise(item);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setMicroSurprise(null), 8000);
    };
    const first = window.setTimeout(show, 8_000);
    const repeat = window.setInterval(show, Math.max(60, Math.round(appearance.popup.intervalSec * 0.5)) * 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(repeat);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, [appearance.popup.enabled, appearance.popup.intervalSec, surprises]);

  const vars = useMemo(() => ({
    "--sgx-bg": appearance.colors.background,
    "--sgx-surface": appearance.colors.surface,
    "--sgx-surface2": appearance.colors.surfaceAlt,
    "--sgx-text": appearance.colors.text,
    "--sgx-muted": appearance.colors.muted,
    "--sgx-gold": appearance.colors.gold,
    "--sgx-accent": appearance.colors.accent,
    "--sgx-success": appearance.colors.success,
    "--sgx-radius": `${Math.max(22, appearance.effects.radius || 24)}px`,
    "--sgx-glow": `${appearance.effects.glow}px`,
    "--sgx-blur": `${Math.max(12, appearance.effects.blur || 0)}px`,
    "--sgx-contrast": String(appearance.effects.contrast || 1),
    "--sg-white": appearance.colors.surface,
    "--sg-offwhite": appearance.colors.background,
    "--sg-ink": appearance.colors.text,
    "--sg-ink2": appearance.colors.muted,
    "--sg-ink3": appearance.colors.muted,
    "--sg-gold": appearance.colors.gold,
    "--sg-gold3": appearance.colors.gold,
    "--sg-magenta": appearance.colors.accent,
    "--sg-shadow": `0 18px 46px ${appearance.colors.accent}18`,
  } as React.CSSProperties), [appearance]);

  const popupDurationStyle = { "--sgx-popup-duration": `${Math.max(5, appearance.popup.durationSec)}s` } as React.CSSProperties;

  return (
    <div className={`sgx sgx-modern-v3 sgx-${appearance.template} ${appearance.effects.ambient ? "sgx-ambient" : ""} ${appearance.effects.scanlines ? "sgx-scanlines" : ""}`} style={vars} data-template={appearance.template}>
      <SignagePage />

      <div className="sgx-liveRibbon" aria-hidden="true"><span>● LIVE</span><b>SMART SIGNAGE</b><em>SZALONÉLMÉNY · VALÓS IDEJŰ AJÁNLATOK</em></div>

      <aside className="sgx-widgetDock sgx-widgetDock-v3" aria-label="Élő kijelző widgetek">
        <article className="sgx-widget sgx-widget-slot">
          <span className="sgx-widget-kicker"><i /> Most felszabadult</span>
          <strong>{currentSlot ? slotTime(currentSlot.start_time) : "Figyeljük"}</strong>
          <small>{currentSlot ? `${currentSlot.service_name || "Időpont"} · ${currentSlot.location_name || "Kleopátra"}` : "az új Last Minute időpontokat"}</small>
        </article>
        <article className="sgx-widget sgx-widget-product">
          <span className="sgx-widget-kicker">KLEOSHOP · Ajánló</span>
          <strong>{currentProduct ? currentProduct.name : "Termékajánló"}</strong>
          <small>{currentProduct ? productPrice(currentProduct) || "Kérdezd kollégáinkat" : "hamarosan"}</small>
        </article>
        <article className="sgx-widget sgx-widget-weather">
          <span className="sgx-widget-kicker">{weatherInfo.icon} Időjárás-ajánló</span>
          <strong>{weather ? `${Math.round(weather.temperature)}°` : "—"}</strong>
          <small>{weatherInfo.text}</small>
        </article>
        <article className={`sgx-widget sgx-widget-birthday ${birthday.celebrating ? "is-celebrating" : ""}`}>
          <span className="sgx-widget-kicker">🎂 Szülinapi meglepetés</span>
          <strong>{birthday.celebrating ? birthday.count : "♡"}</strong>
          <small>{birthday.celebrating ? "ünnepelt vendég ma" : "figyeljük a mai vendégeket"}</small>
        </article>
      </aside>

      {microSurprise && !popup && (
        <div className={`sgx-toast sgx-toast-${microSurprise.kind || "tip"}`} aria-live="polite">
          {microSurprise.image_url && <img className="sgx-toast-image" src={microSurprise.image_url} alt="" />}
          <div>
            <span>{microSurprise.label || "KLEO MEGLEPETÉS"}</span>
            <strong>{microSurprise.title}</strong>
            {microSurprise.body && <p>{microSurprise.body}</p>}
          </div>
        </div>
      )}

      {popup && (
        <div className={`sgx-popup sgx-popup-${appearance.popup.animation} sgx-popup-kind-${popup.kind || "offer"}`}>
          <div className="sgx-popup-backdrop" />
          <div className="sgx-confetti" aria-hidden="true">
            {Array.from({ length: popup.kind === "birthday" ? 34 : 18 }).map((_, i) => <b key={i} style={{ "--sgx-i": i, "--sgx-x": `${5 + ((i * 17) % 90)}%` } as React.CSSProperties} />)}
          </div>
          <section style={popupDurationStyle} className={popup.image_url ? "has-media" : ""}>
            <div className="sgx-popup-orbit" aria-hidden="true" />
            {popup.image_url && <div className="sgx-popup-media"><img src={popup.image_url} alt={popup.title} /></div>}
            <div className="sgx-popup-copy">
              <span>{popup.label || "KLEOPÁTRA · AJÁNLAT"}</span>
              <h2>{popup.title}</h2>
              {(popup.body || popup.subtitle) && <p>{popup.body || popup.subtitle}</p>}
              {appearance.popup.showPrice && popup.price_text && <strong>{popup.price_text}</strong>}
            </div>
            <div className="sgx-popup-progress" aria-hidden="true" />
            <i>Meglepetés a Kleopátrától</i>
          </section>
        </div>
      )}
    </div>
  );
}

export default SignageExperience;
