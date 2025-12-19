import React from "react";
import { useI18n } from "../i18n";

export const CareerPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
    <section className="page-hero page-hero--career">
      <div className="page-hero__image-wrap">
        <img
          src="/images/images_1.webp"
          alt={t("career.hero.imageAlt")}
          className="page-hero__image"
        />
        <div className="page-hero__image-overlay" />
      </div>
      <div className="container page-hero__content page-hero__content--center">
        <p className="section-eyebrow">{t("career.hero.eyebrow")}</p>
        <h1>{t("career.hero.title")}</h1>
        <p className="hero-lead hero-lead--narrow">{t("career.hero.lead")}</p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-two">
        <article className="card">
          <h2 className="card-title">{t("career.card1.title")}</h2>
          <p className="card-text">{t("career.card1.text")}</p>
        </article>
        <article className="card">
          <h2 className="card-title">{t("career.card2.title")}</h2>
          <p className="card-text">{t("career.card2.text")}</p>
        </article>
      </div>
    </section>
  </main>
  );
};
