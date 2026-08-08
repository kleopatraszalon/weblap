import React from "react";
import { cartTotal, readCart } from "./cartStore";
import { fetchKioskConfig } from "./kioskApi";

const LANGS = [
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];
function getStoredLang(): LangCode { const raw = localStorage.getItem("kiosk_lang"); return raw === "en" || raw === "ru" ? raw : "hu"; }
const COPY: Record<LangCode, { daily: string; dailySub: string; total: string; step1: string; step2: string; step3: string }> = {
  hu: { daily: "Kleopátra Kiosk", dailySub: "Válasszon szolgáltatást néhány érintéssel.", total: "Összesen", step1: "1. Menü", step2: "2. Fizetés", step3: "3. Sorszám" },
  en: { daily: "Kleopátra Kiosk", dailySub: "Choose your service in a few taps.", total: "Total", step1: "1. Menu", step2: "2. Payment", step3: "3. Ticket" },
  ru: { daily: "Kleopátra Kiosk", dailySub: "Выберите услугу в несколько касаний.", total: "Итого", step1: "1. Меню", step2: "2. Оплата", step3: "3. Талон" },
};

export function KioskShell({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = React.useState(() => cartTotal(readCart()));
  const [lang, setLang] = React.useState<LangCode>(() => getStoredLang());
  const [theme, setTheme] = React.useState<Record<string, any>>({});

  const loadConfig = React.useCallback(() => {
    const locationId = localStorage.getItem("kiosk_location_id");
    if (!locationId) return setTheme({});
    fetchKioskConfig(locationId).then((data) => setTheme(data.menu?.theme || {})).catch(() => setTheme({}));
  }, []);

  React.useEffect(() => {
    const onStorage = () => { setTotal(cartTotal(readCart())); setLang(getStoredLang()); };
    const onLang = () => setLang(getStoredLang());
    const onLocation = () => loadConfig();
    window.addEventListener("storage", onStorage);
    window.addEventListener("kiosk-lang-change", onLang as EventListener);
    window.addEventListener("kiosk-location-change", onLocation as EventListener);
    const t = window.setInterval(onStorage, 400);
    loadConfig();
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("kiosk-lang-change", onLang as EventListener); window.removeEventListener("kiosk-location-change", onLocation as EventListener); window.clearInterval(t); };
  }, [loadConfig]);

  function changeLang(next: LangCode) { localStorage.setItem("kiosk_lang", next); setLang(next); window.dispatchEvent(new Event("kiosk-lang-change")); }
  const copy = COPY[lang];
  const shellStyle = {
    "--kiosk-admin-primary": theme.primaryColor || "#b69861",
    "--kiosk-admin-accent": theme.accentColor || "#ec008c",
    "--kiosk-admin-bg": theme.backgroundColor || "#f7f3ed",
  } as React.CSSProperties;

  return <div className="kioskScreen" style={shellStyle}>
    <div className="kioskTop" style={{borderBottomColor:theme.primaryColor||"#b69861"}}>
      <div className="kioskBrand"><img src={theme.logoUrl || "/images/kleo_logo@2x.png"} className="kioskBrandLogo" alt="Kleopatra" /></div>
      <div className="kioskTopCard"><div className="kioskTopCardTitle">{copy.daily}</div><div className="kioskTopCardSub">{theme.welcomeText || copy.dailySub}</div></div>
      <div className="kioskSteps"><div className="kioskStep">{copy.step1}</div><div className="kioskStep">{copy.step2}</div><div className="kioskStep">{copy.step3}</div></div>
      <div className="kioskLangFlags" aria-label="Language selector">{LANGS.map((item) => <button key={item.code} type="button" className={`kioskFlagBtn ${lang === item.code ? "isActive" : ""}`} onClick={() => changeLang(item.code)} title={item.label} aria-label={item.label}><span>{item.flag}</span></button>)}</div>
      <div className="kioskTopSpacer"/><div className="kioskMiniTotal" style={{borderColor:theme.accentColor||"#ec008c"}}>{copy.total}: {total.toLocaleString("hu-HU")} Ft</div>
    </div>
    <div className="kioskBody">{children}</div>
  </div>;
}
