
import React, {useMemo, useEffect} from "react";
import { useI18n } from "../i18n";
import "../styles/franchiseLanding.css";
import { getCopy, LandingForm, SparkleIcon, PlayIcon } from "../components/FranchiseLanding";

export function FranchiseInfoPage() {
  const { lang } = useI18n();
  const c = useMemo(() => getCopy(lang as any), [lang]);

  return (
    <div className="fr-landing">
      <section className="fr-hero">
        <div className="fr-hero-inner">
          <div className="fr-badge"><SparkleIcon /></div>
          <h1 className="fr-title" dangerouslySetInnerHTML={{ __html: c.heroTitle }} />
          <p className="fr-sub">{c.heroSub}</p>

          <div className="fr-video-card" role="region" aria-label={c.videoTitle}>
            <div className="fr-play"><PlayIcon /></div>
            <h3 className="fr-video-title">{c.videoTitle}</h3>
            <p className="fr-video-sub">{c.videoSub}</p>
          </div>
        </div>
      </section>

      <section className="fr-section">
        <div className="fr-container">
          <h2 className="fr-h2">{c.formTitle}</h2>
          <p className="fr-lead">{c.formLead}</p>

          <LandingForm
            variant="franchise-info"
            extraFields={[
              { key: "CITY", label: () => lang === "ru" ? "Город" : lang === "en" ? "City" : "Város", required: true },
              { key: "BUDGET", label: () => lang === "ru" ? "Планируемый бюджет (HUF)" : lang === "en" ? "Planned budget (HUF)" : "Tervezett befektetés (Ft)", required: true },
              { key: "TIMELINE", label: () => lang === "ru" ? "Срок запуска (например, 3–6 мес.)" : lang === "en" ? "Timeline (e.g. 3–6 months)" : "Időzítés (pl. 3–6 hónap)", required: false },
              { key: "BACKGROUND", label: () => lang === "ru" ? "Кратко о вас / опыт" : lang === "en" ? "Short background / experience" : "Rövid bemutatkozás / tapasztalat", required: false },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export default FranchiseInfoPage;