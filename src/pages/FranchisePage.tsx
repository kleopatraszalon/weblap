import React from "react";
import { useI18n } from "../i18n";

export const FranchisePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-eyebrow">{t("franchise.eyebrow")}</p>
          <h1>{t("franchise.title")}</h1>
          <p className="hero-lead hero-lead--narrow">
            {t("franchise.lead")}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-three">
          <article className="card">
            <h2 className="card-title">{t("franchise.card1.title")}</h2>
            <p className="card-text">
              {t("franchise.card1.text")}
            </p>
          </article>
          <article className="card">
            <h2 className="card-title">{t("franchise.card2.title")}</h2>
            <p className="card-text">
              {t("franchise.card2.text")}
            </p>
          </article>
          <article className="card">
            <h2 className="card-title">{t("franchise.card3.title")}</h2>
            <p className="card-text">
              {t("franchise.card3.text")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};
