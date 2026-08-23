import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cartCount, cartTotal, readCart } from "./cartStore";
import { fetchKioskConfig } from "./kioskApi";
import { KidsGameArcade } from "./KidsGameArcade";
import { KioskHairMirror } from "./KioskHairMirror";

const LANGS = [
  { code: "hu", label: "Magyar", flag: "HU" },
  { code: "en", label: "English", flag: "EN" },
  { code: "ru", label: "Русский", flag: "RU" },
] as const;
type LangCode = (typeof LANGS)[number]["code"];
type VisualMode = "classic" | "pearl" | "silver" | "kids";
function getStoredLang(): LangCode { const raw = localStorage.getItem("kiosk_lang"); return raw === "en" || raw === "ru" ? raw : "hu"; }

const COPY: Record<LangCode, { menu: string; pay: string; ticket: string; total: string; home: string; theme: string }> = {
  hu: { menu: "Választás", pay: "Adatok és fizetés", ticket: "Kész", total: "Kosár", home: "Főmenü", theme: "Téma" },
  en: { menu: "Choose", pay: "Details & payment", ticket: "Done", total: "Basket", home: "Home", theme: "Theme" },
  ru: { menu: "Выбор", pay: "Данные и оплата", ticket: "Готово", total: "Корзина", home: "Главная", theme: "Тема" },
};

export function KioskShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = React.useState(() => readCart());
  const [lang, setLang] = React.useState<LangCode>(() => getStoredLang());
  const [visualMode, setVisualMode] = React.useState<VisualMode>(() => { const saved = localStorage.getItem("kiosk_visual_mode"); return saved === "pearl" || saved === "silver" || saved === "kids" ? saved : "classic"; });
  const [themeMenuOpen, setThemeMenuOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Record<string, any>>({});

  const loadConfig = React.useCallback(() => {
    const locationId = localStorage.getItem("kiosk_location_id");
    if (!locationId) return setTheme({});
    fetchKioskConfig(locationId).then((data) => setTheme(data.menu?.theme || {})).catch(() => setTheme({}));
  }, []);

  React.useEffect(() => {
    const refresh = () => setCart(readCart());
    const onLang = () => setLang(getStoredLang());
    const onLocation = () => loadConfig();
    window.addEventListener("storage", refresh);
    window.addEventListener("kiosk-cart-change", refresh as EventListener);
    window.addEventListener("kiosk-lang-change", onLang as EventListener);
    window.addEventListener("kiosk-location-change", onLocation as EventListener);
    loadConfig();
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("kiosk-cart-change", refresh as EventListener);
      window.removeEventListener("kiosk-lang-change", onLang as EventListener);
      window.removeEventListener("kiosk-location-change", onLocation as EventListener);
    };
  }, [loadConfig]);

  function changeLang(next: LangCode) {
    localStorage.setItem("kiosk_lang", next);
    setLang(next);
    window.dispatchEvent(new Event("kiosk-lang-change"));
  }

  function selectVisualMode(next: VisualMode) {
    localStorage.setItem("kiosk_visual_mode", next);
    setVisualMode(next);
    setThemeMenuOpen(false);
  }

  const copy = COPY[lang];
  const step = location.pathname.includes("/ticket") ? 3 : location.pathname.includes("/pay") ? 2 : 1;
  const total = cartTotal(cart);
  const count = cartCount(cart);
  const radius = Math.max(12, Math.min(38, Number(theme.cardRadius || 24)));
  const shellStyle = {
    "--kiosk-bg": theme.backgroundColor || "#f4efe7",
    "--kiosk-surface": theme.surfaceColor || "#ffffff",
    "--kiosk-ink": theme.textColor || "#181310",
    "--kiosk-gold": theme.primaryColor || "#b69861",
    "--kiosk-accent": theme.accentColor || "#ec008c",
    "--kiosk-radius": `${radius}px`,
    background: theme.backgroundColor || "#f4efe7",
  } as React.CSSProperties;

  return <div className="kioskScreen" data-kiosk-visual={visualMode} style={shellStyle}>
    <header className="kioskTop">
      <button className="kiosk-home-button" onClick={() => navigate("/kiosk")} aria-label={copy.home}>
        <img src={theme.logoUrl || "/images/kleo_logo@2x.png"} className="kioskBrandLogo" alt="Kleopátra" />
      </button>
      <div className="kiosk-progress" aria-label="Kiosk folyamat">
        {[copy.menu, copy.pay, copy.ticket].map((label, index) => {
          const n = index + 1; return <div key={label} className={`kiosk-progress-step ${n === step ? "active" : n < step ? "done" : ""}`}>
            <span>{n < step ? "✓" : n}</span><b>{label}</b>
          </div>;
        })}
      </div>
      <div className="kiosk-utilities">
        <div className="kiosk-theme-picker">
          <button className="kiosk-theme-toggle" type="button" onClick={() => setThemeMenuOpen((open) => !open)} aria-label={copy.theme} aria-expanded={themeMenuOpen} title={copy.theme}>
            <span>{visualMode === "classic" ? "◐" : visualMode === "pearl" ? "✦" : visualMode === "silver" ? "◈" : "★"}</span><b>{visualMode === "classic" ? "Classic" : visualMode === "pearl" ? "Pearl" : visualMode === "silver" ? "Silver" : "KIDS"}</b><i>⌄</i>
          </button>
          {themeMenuOpen&&<div className="kiosk-theme-menu" role="menu" aria-label={copy.theme}>
            {([['classic','◐','Classic'],['pearl','✦','Pearl'],['silver','◈','Silver'],['kids','★','KIDS']] as const).map(([mode,icon,label])=><button key={mode} type="button" role="menuitemradio" aria-checked={visualMode===mode} className={visualMode===mode?'active':''} onClick={()=>selectVisualMode(mode)}><span>{icon}</span><b>{label}</b>{visualMode===mode&&<i>✓</i>}</button>)}
          </div>}
        </div>
        <div className="kioskLangFlags">{LANGS.map((item) => <button key={item.code} type="button" className={`kioskFlagBtn ${lang === item.code ? "isActive" : ""}`} onClick={() => changeLang(item.code)}>{item.flag}</button>)}</div>
        <button className="kiosk-mini-cart" onClick={() => navigate("/kiosk/pay")} disabled={!count}>
          <span>{copy.total}</span><b>{count} · {total.toLocaleString("hu-HU")} Ft</b>
        </button>
      </div>
    </header>
    <main className="kioskBody">{children}</main>
    <KioskHairMirror visualMode={visualMode} />
    <KidsGameArcade active={visualMode === "kids"} />
    <div className="kiosk-kids-companions" aria-hidden="true">
      <div className="kiosk-kids-guide bunny"><img src="/images/kiosk/kids/bunny.gif" alt=""/><span>Mit válasszunk? ✨</span></div>
      <div className="kiosk-kids-guide bear"><img src="/images/kiosk/kids/bear.gif" alt=""/><span>Szuper választás! ★</span></div>
      <div className="kiosk-kids-guide fox"><img src="/images/kiosk/kids/fox.gif" alt=""/><span>Segítek! 🌈</span></div>
    </div>
  </div>;
}
