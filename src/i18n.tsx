import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import translationsJson from "./translations.json";

export type Language = "hu" | "en" | "ru";

type TranslationDict = Record<string, string>;
type AllTranslations = Record<Language, TranslationDict>;

const translations = translationsJson as AllTranslations;

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "hu",
  setLang: () => undefined,
  t: (key: string) => key,
});

const STORAGE_KEY = "kleo-lang";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>("hu");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "hu" || stored === "en" || stored === "ru") {
        setLangState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[lang] || translations.hu || {};
      if (key in dict) return dict[key];

      const huDict = translations.hu || {};
      if (key in huDict) return huDict[key];

      return key;
    },
    [lang]
  );

  const ctxValue = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t]
  );

  return (
    <I18nContext.Provider value={ctxValue}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

// Régi név kompatibilitás miatt:
export const LanguageProvider = I18nProvider;