import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "../signageInfoContentV13";

type Rect = { left: number; top: number; width: number; height: number };
type Service = { id: string; name: string; price: string };
type Weather = { temperature: number | null; precipitation: number; code: number };

const isSignage = () => typeof window !== "undefined" && window.location.pathname.startsWith("/signage");

function rectOf(selector: string): Rect | null {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 20 || r.height < 20) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

function fallbackGrid(): Rect {
  const top = Math.max(92, Math.round(window.innerHeight * 0.16));
  const bottomPad = Math.max(54, Math.round(window.innerHeight * 0.07));
  return { left: 8, top, width: Math.max(960, window.innerWidth - 16), height: Math.max(260, window.innerHeight - top - bottomPad) };
}

function clockKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "0";
  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  const h = Number(get("hour"));
  return { day: Math.floor(Date.UTC(y, m - 1, d) / 86400000), hour: h };
}

function weatherCopy(w: Weather) {
  const rain = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
  if (w.precipitation > 0.1 || rain.has(w.code)) return "Esős idő: bent különösen jól esik egy kis feltöltődés.";
  if (w.temperature !== null && w.temperature >= 27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if (w.temperature !== null && w.temperature <= 8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  return "A mai időhöz is találunk egy jó szépségprogramot.";
}

export default function SignageOverlayV17() {
  const [grid, setGrid] = useState<Rect | null>(null);
  const [servicesPanel, setServicesPanel] = useState<Rect | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [nameday, setNameday] = useState("Mai névnapos vendégeinknek 20% kedvezmény.");
  const [weather, setWeather] = useState<Weather>({ temperature: null, precipitation: 0, code: 0 });
  const [timeSeed, setTimeSeed] = useState(() => Date.now());

  useEffect(() => {
    if (!isSignage()) return;
    const measure = () => {
      setGrid(rectOf(".sgGrid") || fallbackGrid());
      setServicesPanel(rectOf(".sgServices"));
    };
    measure();
    const t = window.setInterval(measure, 500);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.clearInterval(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!isSignage()) return;
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/signage/services?_=${Date.now()}`, { cache: "no-store", credentials: "omit" });
        if (!r.ok) throw new Error(String(r.status));
        const j = await r.json();
        const raw = Array.isArray(j) ? j : Array.isArray(j?.services) ? j.services : Array.isArray(j?.items) ? j.items : Array.isArray(j?.rows) ? j.rows : [];
        const mapped = raw
          .map((x: any, i: number) => {
            const name = String(x?.name ?? x?.title ?? "").trim();
            const priceRaw = x?.price_text ?? x?.priceText ?? x?.price ?? x?.from_price ?? x?.min_price ?? "";
            const price = typeof priceRaw === "number" ? `${Math.round(priceRaw).toLocaleString("hu-HU")} Ft` : String(priceRaw || "").trim();
            return { id: String(x?.id ?? `svc-${i}`), name, price: price || "Ár a recepción" };
          })
          .filter((x: Service) => x.name);
        setServices(mapped);
      } catch {
        setServices([]);
      }
    };
    void load();
    const t = window.setInterval(load, 60_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isSignage()) return;
    const loadNameday = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`, { cache: "no-store", credentials: "omit" });
        if (!r.ok) return;
        const j = await r.json();
        const names = Array.isArray(j?.names) ? j.names.join(", ") : String(j?.name || "").trim();
        const text = String(j?.message || j?.text || "").trim();
        setNameday(text || (names ? `Ma ${names} ünnepli a névnapját — 20% kedvezmény.` : "Mai névnapos vendégeinknek 20% kedvezmény."));
      } catch {
        setNameday("Mai névnapos vendégeinknek 20% kedvezmény.");
      }
    };
    void loadNameday();
    const t = window.setInterval(loadNameday, 5 * 60_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isSignage()) return;
    const loadWeather = async () => {
      try {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,weather_code&timezone=Europe%2FBudapest";
        const r = await fetch(`${url}&_=${Date.now()}`, { cache: "no-store" });
        if (!r.ok) throw new Error(String(r.status));
        const j = await r.json();
        setWeather({
          temperature: Number.isFinite(Number(j?.current?.temperature_2m)) ? Number(j.current.temperature_2m) : null,
          precipitation: Number.isFinite(Number(j?.current?.precipitation)) ? Number(j.current.precipitation) : 0,
          code: Number.isFinite(Number(j?.current?.weather_code)) ? Number(j.current.weather_code) : 0,
        });
      } catch {
        setWeather({ temperature: null, precipitation: 0, code: 0 });
      }
    };
    void loadWeather();
    const t = window.setInterval(loadWeather, 10 * 60_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isSignage()) return;
    const t = window.setInterval(() => setTimeSeed(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const content = useMemo(() => {
    const { day, hour } = clockKey();
    const m = MOTIVATION_QUOTES_V13[((day % MOTIVATION_QUOTES_V13.length) + MOTIVATION_QUOTES_V13.length) % MOTIVATION_QUOTES_V13.length];
    const b = BEAUTY_QUOTES_V13[((day * 24 + hour) % BEAUTY_QUOTES_V13.length + BEAUTY_QUOTES_V13.length) % BEAUTY_QUOTES_V13.length];
    const g = GYM_TIPS_V13[((day * 24 + hour) % GYM_TIPS_V13.length + GYM_TIPS_V13.length) % GYM_TIPS_V13.length];
    return { m, b, g };
  }, [timeSeed]);

  if (!isSignage()) return null;

  const g = grid || (typeof window !== "undefined" ? fallbackGrid() : { left: 0, top: 0, width: 1920, height: 420 });
  const p = servicesPanel || { left: g.left, top: g.top, width: Math.max(230, g.width * 0.17), height: g.height };
  const cardsLeft = Math.min(g.left + g.width - 760, p.left + p.width + 8);
  const cardsWidth = Math.max(760, g.left + g.width - cardsLeft - 8);
  const cardsTop = g.top + 8;
  const cardsHeight = Math.max(84, Math.min(104, g.height * 0.26));

  const cards = [
    { kind: "nameday", kicker: "🎁 NÉVNAPI KEDVEZMÉNY", strong: "20%", small: nameday },
    { kind: "weather", kicker: "☀ IDŐJÁRÁS-AJÁNLÓ", strong: weather.temperature === null ? "—°" : `${Math.round(weather.temperature)}°`, small: weatherCopy(weather) },
    { kind: "motivation", kicker: "💬 NAPI MOTIVÁCIÓ", strong: "MAI GONDOLAT", small: content.m },
    { kind: "beauty", kicker: "✨ SZÉPSÉG · ÓRÁNKÉNT ÚJ", strong: "SZÉPSÉG-IDÉZET", small: content.b },
    { kind: "gym", kicker: "🏋 GYM GYAKORLAT TIPP", strong: "TECHNIKA", small: content.g },
  ];

  const priceStyle: React.CSSProperties = {
    left: p.left,
    top: p.top,
    width: p.width,
    height: p.height,
  };
  const cardStripStyle: React.CSSProperties = {
    left: cardsLeft,
    top: cardsTop,
    width: cardsWidth,
    height: cardsHeight,
  };
  const duration = `${Math.max(18, Math.min(60, Math.max(1, services.length) * 2.4))}s`;
  const duplicated = services.length ? [...services, ...services] : [];

  return (
    <>
      <section className="sgPricePanelV17" data-signage-release="smart-signage-v17" style={priceStyle} aria-label="Áraink">
        <header className="sgPricePanelV17__header">
          <div>
            <span>ÁRLISTA</span>
            <strong>ÁRAINK</strong>
          </div>
          <small>Szolgáltatás • Ár</small>
        </header>
        <div className="sgPricePanelV17__viewport">
          {duplicated.length ? (
            <div className="sgPricePanelV17__track" style={{ ["--sg-price-duration" as any]: duration }}>
              {duplicated.map((item, i) => (
                <div className="sgPricePanelV17__row" key={`${item.id}-${i}`}>
                  <span>{item.name}</span>
                  <b>{item.price}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="sgPricePanelV17__empty">Az árlista betöltése folyamatban…</div>
          )}
        </div>
      </section>

      <section className="sgInfoStripV17" data-info-runtime="react-five-cards-v17" style={cardStripStyle} aria-label="KLEO Smart információs kártyák">
        {cards.map((card, i) => (
          <article className={`sgInfoCardV17 sgInfoCardV17--${card.kind}`} key={card.kind} style={{ ["--sg-card-index" as any]: i }}>
            <span className="sgInfoCardV17__kicker">{card.kicker}</span>
            <strong>{card.strong}</strong>
            <small>{card.small}</small>
          </article>
        ))}
      </section>
    </>
  );
}
