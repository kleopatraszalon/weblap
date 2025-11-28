import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "hu" | "en" | "ru";

type TranslationDict = Record<string, string>;

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "kleo_lang";

const translations: Record<Language, TranslationDict> = {
  hu: {
    "lang.name": "Magyar",

    // MENÜK
    "menu.salons": "Szalonjaink",
    "menu.pricesServices": "Áraink és Szolgáltatásaink",
    "menu.webshop": "Webshop",
    "menu.contact": "Kapcsolat",
    "menu.about": "Rólunk",
    "menu.loyalty": "Hűségprogram",
    "menu.franchise": "Franchise",
    "menu.career": "Karrier",
    "menu.education": "Oktatás",

    // FEJLÉC
    "header.booking": "Időpontfoglalás",
    "header.followUs": "Kövess minket",
    "header.language.label": "Nyelvválasztó",

    // HERO BLOKK
    "home.hero.kicker": "KLEOPÁTRA SZÉPSÉGSZALONOK · TÖBB MINT 30 ÉVE",
    "home.hero.title.prefix": "Éld át a ",
    "home.hero.title.highlight": "Kleopátra-élményt",
    "home.hero.title.suffix":
      " – prémium szépségszolgáltatások, akár bejelentkezés nélkül.",
    "home.hero.lead":
      "Fodrászat, kozmetika, manikűr–pedikűr, szolárium és masszázs egy helyen. Tapasztalt szakembereinkkel és minőségi termékeinkkel várunk minden szalonunkban.",
    "home.hero.pill.hair": "Fodrászat",
    "home.hero.pill.beauty": "Kozmetika",
    "home.hero.pill.handsFeet": "Kéz- és lábápolás",
    "home.hero.pill.solarium": "Szolárium",
    "home.hero.pill.massage": "Masszázs",
    "home.hero.cta.book": "Időpontfoglalás / szalonok",
    "home.hero.cta.services": "Szolgáltatásaink",
    "home.hero.media.webshop": "Webshop",
    "home.hero.media.appChip": "Töltsd le mobilalkalmazásunkat",
  },

  en: {
    "lang.name": "English",

    "menu.salons": "Our salons",
    "menu.pricesServices": "Prices & Services",
    "menu.webshop": "Webshop",
    "menu.contact": "Contact",
    "menu.about": "About us",
    "menu.loyalty": "Loyalty program",
    "menu.franchise": "Franchise",
    "menu.career": "Career",
    "menu.education": "Education",

    "header.booking": "Book an appointment",
    "header.followUs": "Follow us",
    "header.language.label": "Language selector",

    "home.hero.kicker": "KLEOPATRA BEAUTY SALONS · OVER 30 YEARS",
    "home.hero.title.prefix": "Feel the ",
    "home.hero.title.highlight": "Cleopatra Experience",
    "home.hero.title.suffix":
      " – premium beauty services, even without appointment.",
    "home.hero.lead":
      "Hairdressing, beauty, manicure & pedicure, solarium and massage in one place. Our experienced professionals and high-quality products welcome you in all our salons.",
    "home.hero.pill.hair": "Hairdressing",
    "home.hero.pill.beauty": "Beauty",
    "home.hero.pill.handsFeet": "Hands & feet care",
    "home.hero.pill.solarium": "Solarium",
    "home.hero.pill.massage": "Massage",
    "home.hero.cta.book": "Book an appointment / salons",
    "home.hero.cta.services": "Our services",
    "home.hero.media.webshop": "Webshop",
    "home.hero.media.appChip": "Download our mobile app",
  },

  ru: {
    "lang.name": "Русский",

    "menu.salons": "Наши салоны",
    "menu.pricesServices": "Цены и услуги",
    "menu.webshop": "Интернет-магазин",
    "menu.contact": "Контакты",
    "menu.about": "О нас",
    "menu.loyalty": "Программа лояльности",
    "menu.franchise": "Франшиза",
    "menu.career": "Карьера",
    "menu.education": "Обучение",

    "header.booking": "Записаться",
    "header.followUs": "Подписывайтесь на нас",
    "header.language.label": "Выбор языка",

    "home.hero.kicker": "САЛОНЫ КЛЕОПАТРА · БОЛЕЕ 30 ЛЕТ ОПЫТА",
    "home.hero.title.prefix": "Испытай ",
    "home.hero.title.highlight": "эффект Клеопатры",
    "home.hero.title.suffix":
      " – премиальные бьюти-услуги, даже без предварительной записи.",
    "home.hero.lead":
      "Парикмахерские услуги, косметология, маникюр и педикюр, солярий и массаж в одном месте. Опытные специалисты и качественная косметика ждут тебя во всех наших салонах.",
    "home.hero.pill.hair": "Парикмахерская",
    "home.hero.pill.beauty": "Косметология",
    "home.hero.pill.handsFeet": "Уход за руками и ногами",
    "home.hero.pill.solarium": "Солярий",
    "home.hero.pill.massage": "Массаж",
    "home.hero.cta.book": "Записаться / салоны",
    "home.hero.cta.services": "Наши услуги",
    "home.hero.media.webshop": "Интернет-магазин",
    "home.hero.media.appChip": "Скачай наше мобильное приложение",
  },
};

const I18nContext = createContext<I18nContextValue>({
  lang: "hu",
  setLang: () => undefined,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>("hu");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored === "hu" || stored === "en" || stored === "ru") {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (value: Language) => {
    setLangState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  };

  const t = useMemo(
    () => (key: string) =>
      translations[lang]?.[key] ?? translations["hu"]?.[key] ?? key,
    [lang]
  );

  const ctxValue = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, t]
  );

  return (
    <I18nContext.Provider value={ctxValue}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
