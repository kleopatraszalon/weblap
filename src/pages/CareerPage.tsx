import React from "react";
import { useI18n } from "../i18n";

export const CareerPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">{t("career.eyebrow")}</p>
          <h1>{t("career.title")}</h1>
          <p className="hero-lead hero-lead--narrow">
            {t("career.lead")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-two">
          <article className="card">
            <h2 className="card-title">{t("career.card1.title")}</h2>
            <p className="card-text">
              {t("career.card1.text")}
            </p>
          </article>
          <article className="card">
            <h2 className="card-title">{t("career.card2.title")}</h2>
            <p className="card-text">
              {t("career.card2.text")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};
