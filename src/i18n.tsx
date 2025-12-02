import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import translationsJson from "./translations.json";

export type Language = "hu" | "en" | "ru";

type TranslationDict = Record<string, string>;

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "kleo_lang";

const translations: Record<Language, TranslationDict> =
  translationsJson as Record<Language, TranslationDict>;


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
