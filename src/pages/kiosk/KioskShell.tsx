import React from "react";
import { cartTotal, readCart } from "./cartStore";

const LANGS = [
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];

function getStoredLang(): LangCode {
  const raw = localStorage.getItem("kiosk_lang");
  return raw === "en" || raw === "ru" ? raw : "hu";
}

const COPY: Record<LangCode, { daily: string; dailySub: string; total: string; step1: string; step2: string; step3: string }> = {
  hu: {
    daily: "Napi akciók",
    dailySub: "Nincs aktív villám akció.",
    total: "Összesen",
    step1: "1. Menü",
    step2: "2. Fizetés",
    step3: "3. Sorszám",
  },
  en: {
    daily: "Daily offers",
    dailySub: "No active flash offer.",
    total: "Total",
    step1: "1. Menu",
    step2: "2. Payment",
    step3: "3. Ticket",
  },
  ru: {
    daily: "Акции дня",
    dailySub: "Сейчас нет активной акции.",
    total: "Итого",
    step1: "1. Меню",
    step2: "2. Оплата",
    step3: "3. Талон",
  },
};

export function KioskShell({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = React.useState(() => cartTotal(readCart()));
  const [lang, setLang] = React.useState<LangCode>(() => getStoredLang());

  React.useEffect(() => {
    const onStorage = () => {
      setTotal(cartTotal(readCart()));
      setLang(getStoredLang());
    };
    const onLang = () => setLang(getStoredLang());
    window.addEventListener("storage", onStorage);
    window.addEventListener("kiosk-lang-change", onLang as EventListener);
    const t = window.setInterval(onStorage, 400);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kiosk-lang-change", onLang as EventListener);
      window.clearInterval(t);
    };
  }, []);

  function changeLang(next: LangCode) {
    localStorage.setItem("kiosk_lang", next);
    setLang(next);
    window.dispatchEvent(new Event("kiosk-lang-change"));
  }

  const copy = COPY[lang];

  return (
    <div className="kioskScreen">
      <div className="kioskTop">
        <div className="kioskBrand">
          <img src="/images/kleo_logo@2x.png" className="kioskBrandLogo" alt="Kleopatra" />
        </div>
        <div className="kioskTopCard">
          <div className="kioskTopCardTitle">{copy.daily}</div>
          <div className="kioskTopCardSub">{copy.dailySub}</div>
        </div>
        <div className="kioskSteps">
          <div className="kioskStep">{copy.step1}</div>
          <div className="kioskStep">{copy.step2}</div>
          <div className="kioskStep">{copy.step3}</div>
        </div>
        <div className="kioskLangFlags" aria-label="Language selector">
          {LANGS.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`kioskFlagBtn ${lang === item.code ? "isActive" : ""}`}
              onClick={() => changeLang(item.code)}
              title={item.label}
              aria-label={item.label}
            >
              <span>{item.flag}</span>
            </button>
          ))}
        </div>
        <div className="kioskTopSpacer" />
        <div className="kioskMiniTotal">{copy.total}: {total.toLocaleString("hu-HU")} Ft</div>
      </div>

      <div className="kioskBody">{children}</div>
    </div>
  );
}
