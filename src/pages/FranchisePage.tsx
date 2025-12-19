import React, { useMemo } from "react";
import { useI18n } from "../i18n";
import "../styles/franchise-landing.css";

/**
 * Headerless / footerless landing page.
 * Visual target: https://kleofranch-test-lp1.abacusai.app/
 */
export const FranchisePage: React.FC = () => {
  const { lang } = useI18n();

  const copy = useMemo(() => {
    const hu = {
      kicker: "Kleopátra Szépségszalonok Franchise",
      titleA: "Így indíts vagy fejlessz nyereséges",
      titleB: "szépségszalont",
      titleEmph: "biztos háttérrel",
      titleC: "– nulláról vagy működő üzletből.",
      lead:
        "Ismerd meg a Kleopátra Szépségszalonok franchise rendszerét, amivel befektetőként, karrierváltóként vagy jelenlegi szalontulajdonosként is komoly, tervezhető befektetéssel építhetsz stabilan működő szépségszalont.",
      videoTitle: "Videó hamarosan",
      videoSub: "Ismerd meg a Kleopátra franchise rendszerét",
      cta: "Kérem a részleteket",
    };
    const en = {
      kicker: "Kleopatra Beauty Salons Franchise",
      titleA: "Launch or grow a profitable",
      titleB: "beauty salon",
      titleEmph: "with reliable support",
      titleC: "— from scratch or from an existing business.",
      lead:
        "Discover the Kleopatra Beauty Salons franchise system. Whether you are an investor, a career changer, or an existing salon owner, you can build a stable, scalable beauty business with a predictable investment.",
      videoTitle: "Video coming soon",
      videoSub: "Get to know the Kleopatra franchise system",
      cta: "Request details",
    };
    const ru = {
      kicker: "Франшиза салонов красоты Kleopatra",
      titleA: "Запусти или развивай прибыльный",
      titleB: "салон красоты",
      titleEmph: "с надежной поддержкой",
      titleC: "— с нуля или на базе действующего бизнеса.",
      lead:
        "Узнай о франчайзинговой системе Kleopatra Beauty Salons. Инвестор, смена карьеры или владелец действующего салона — ты сможешь построить стабильный и масштабируемый бизнес с прогнозируемыми вложениями.",
      videoTitle: "Видео скоро",
      videoSub: "Познакомься с системой франшизы Kleopatra",
      cta: "Запросить детали",
    };
    return (lang === "en" ? en : lang === "ru" ? ru : hu);
  }, [lang]);

  return (
    <main className="frlp">
      <section className="frlp-hero">
        <div className="frlp-hero__bg" aria-hidden="true" />
        <div className="frlp-hero__wrap">
          <div className="frlp-hero__kicker">
            <span className="frlp-hero__dot" aria-hidden="true" />
            {copy.kicker}
          </div>

          <h1 className="frlp-hero__title">
            {copy.titleA}{" "}
            <span className="frlp-hero__title--break">{copy.titleB}</span>{" "}
            <span className="frlp-hero__title--emph">{copy.titleEmph}</span>{" "}
            {copy.titleC}
          </h1>

          <p className="frlp-hero__lead">{copy.lead}</p>

          <div className="frlp-videoCard">
            <div className="frlp-videoCard__inner">
              <div className="frlp-play" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M10 8.5V15.5L16 12L10 8.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="frlp-videoCard__title">{copy.videoTitle}</div>
              <div className="frlp-videoCard__sub">{copy.videoSub}</div>
            </div>
          </div>

          {/* Optional CTA anchor for your form section if/when you add it */}
          <a className="frlp-cta" href="#franchise-form">
            {copy.cta}
          </a>
        </div>
      </section>
    </main>
  );
};

export default FranchisePage;
