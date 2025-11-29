import React from "react";
import { useI18n } from "../i18n";

export const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">{t("about.eyebrow")}</p>
          <h1>{t("about.title")}</h1>
          <p className="hero-lead hero-lead--narrow">
            {t("about.lead")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">{t("about.card1.title")}</h2>
            <p className="card-text">
              {t("about.card1.text")}
            </p>
          </article>
          <article className="card">
            <h2 className="card-title">{t("about.card2.title")}</h2>
            <p className="card-text">
              {t("about.card2.text")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};
