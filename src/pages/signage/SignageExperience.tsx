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

type SurpriseKind = "offer" | "availability" | "tip" | "nameday";
type Promo = {
  id?: string;
  title: string;
  body?: string;
  subtitle?: string;
  price_text?: string;
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
  effects: { glow: 0, blur: 0, radius: 18, contrast: 1, motion: "medium", ambient: false, scanlines: false },
  popup: { enabled: true, intervalSec: 180, durationSec: 12, initialDelaySec: 45, source: "flash_then_deal", animation: "impact", showPrice: true },
};

const EMPTY_INSIGHTS: InsightState = { freePros: 0, visiblePros: 0, activeDeals: 0, beautyTip: "", nameday: "" };
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

export function SignageExperience() {
  const [appearance, setAppearance] = useState<Appearance>(FALLBACK);
  const [popup, setPopup] = useState<Promo | null>(null);
  const [microSurprise, setMicroSurprise] = useState<Promo | null>(null);
  const [offers, setOffers] = useState<Promo[]>([]);
  const [insights, setInsights] = useState<InsightState>(EMPTY_INSIGHTS);
  const offerIndex = useRef(0);
  const surpriseIndex = useRef(0);
  const lastConfig = useRef("");

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

  const surprises = useMemo<Promo[]>(() => {
    const arr: Promo[] = [];
    if (insights.freePros > 0) {
      arr.push({
        id: "surprise-availability",
        kind: "availability",
        label: "MOST · SZABAD HELY",
        title: `${insights.freePros} szakember most elérhető`,
        body: "Ha van kedved egy spontán frissítéshez, kérdezd a recepción kollégáinkat.",
      });
    }
    if (insights.beautyTip) {
      arr.push({ id: "surprise-tip", kind: "tip", label: "KLEO BEAUTY MOMENT", title: "Egy perc szépség", body: insights.beautyTip });
    }
    if (insights.nameday) {
      arr.push({ id: "surprise-nameday", kind: "nameday", label: "MA ÜNNEPELJÜK", title: "Boldog névnapot!", body: insights.nameday });
    }
    return arr;
  }, [insights]);

  const popupPool = useMemo(() => [...offers, ...surprises], [offers, surprises]);

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
    const first = window.setTimeout(show, Math.max(10, appearance.popup.initialDelaySec) * 1000);
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
    const first = window.setTimeout(show, 25_000);
    const repeat = window.setInterval(show, Math.max(75, Math.round(appearance.popup.intervalSec * 0.55)) * 1000);
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
    "--sgx-radius": `${appearance.effects.radius}px`,
    "--sgx-glow": `${appearance.effects.glow}px`,
    "--sgx-blur": `${appearance.effects.blur}px`,
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
    <div className={`sgx sgx-${appearance.template} ${appearance.effects.ambient ? "sgx-ambient" : ""} ${appearance.effects.scanlines ? "sgx-scanlines" : ""}`} style={vars} data-template={appearance.template}>
      <SignagePage />

      <aside className="sgx-widgetDock" aria-label="Élő kijelző widgetek">
        <article className="sgx-widget sgx-widget-live">
          <span className="sgx-widget-kicker"><i /> Élő státusz</span>
          <strong>{insights.freePros}</strong>
          <small>szabad szakember most</small>
        </article>
        <article className="sgx-widget">
          <span className="sgx-widget-kicker">Mai ajánlatok</span>
          <strong>{insights.activeDeals}</strong>
          <small>aktív kedvezmény</small>
        </article>
        <article className="sgx-widget sgx-widget-wide">
          <span className="sgx-widget-kicker">KLEO moment</span>
          <p>{insights.beautyTip || "Egy kis szépség, egy kis feltöltődés – csak Neked."}</p>
        </article>
      </aside>

      {microSurprise && !popup && (
        <div className={`sgx-toast sgx-toast-${microSurprise.kind || "tip"}`} aria-live="polite">
          <span>{microSurprise.label || "KLEO MEGLEPETÉS"}</span>
          <strong>{microSurprise.title}</strong>
          {microSurprise.body && <p>{microSurprise.body}</p>}
        </div>
      )}

      {popup && (
        <div className={`sgx-popup sgx-popup-${appearance.popup.animation} sgx-popup-kind-${popup.kind || "offer"}`}>
          <div className="sgx-popup-backdrop" />
          <div className="sgx-confetti" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => <b key={i} style={{ "--sgx-i": i, "--sgx-x": `${5 + ((i * 17) % 90)}%` } as React.CSSProperties} />)}
          </div>
          <section style={popupDurationStyle}>
            <div className="sgx-popup-orbit" aria-hidden="true" />
            <span>{popup.label || "KLEOPÁTRA · AJÁNLAT"}</span>
            <h2>{popup.title}</h2>
            {(popup.body || popup.subtitle) && <p>{popup.body || popup.subtitle}</p>}
            {appearance.popup.showPrice && popup.price_text && <strong>{popup.price_text}</strong>}
            <div className="sgx-popup-progress" aria-hidden="true" />
            <i>Meglepetés a Kleopátrától</i>
          </section>
        </div>
      )}
    </div>
  );
}

export default SignageExperience;
