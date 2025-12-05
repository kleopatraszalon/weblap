import React from "react";
import { useI18n } from "../i18n";

export const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      {/* HERO – Rólunk */}
      <section className="page-hero page-hero--about">
        <div className="page-hero__image-wrap">
          <img
            src="/images/rolunk.jpg"
            alt={t("about.hero.imageAlt")}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay page-hero__image-overlay--gradient" />
        </div>

        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>

          <h1 className="hero-title hero-title--tight">
            <span className="hero-part hero-part-default">
              {t("about.hero.title")}
            </span>
          </h1>

          <p className="hero-lead hero-lead--narrow">
            {t("about.hero.lead")}
          </p>

          <div className="hero-pill-row hero-pill-row--soft">
            <span className="hero-pill hero-pill--outline">
              {t("home.hero.pill.hair")}
            </span>
            <span className="hero-pill hero-pill--outline">
              {t("home.hero.pill.beauty")}
            </span>
            <span className="hero-pill hero-pill--outline">
              {t("home.hero.pill.handsFeet")}
            </span>
            <span className="hero-pill hero-pill--outline">
              {t("home.hero.pill.solarium")}
            </span>
            <span className="hero-pill hero-pill--outline">
              {t("home.hero.pill.massage")}
            </span>
          </div>
        </div>
      </section>

      {/* 1. Víziónk – szöveg balra, kép jobbra (vision.png) */}
      <section className="section section--soft">
        <div className="container grid-two">
          <div className="about-block about-block__text">
            <h2 className="card-title">
              {t("about.section.vision.title")}
            </h2>
            <p className="card-text">
              {t("about.section.vision.p1")}
            </p>
            <p className="card-text">
              {t("about.section.vision.p2")}
            </p>
          </div>
          <div className="about-block about-block__image">
            <img
              src="/images/vision.png"
              alt={t("about.vision.imageAlt")}
              className="card-image-side"
            />
          </div>
        </div>
      </section>

      {/* 2. Küldetésünk – kép balra, szöveg jobbra (mission.png) */}
      <section className="section">
        <div className="container grid-two">
          <div className="about-block about-block__image">
            <img
              src="/images/mission.png"
              alt={t("about.mission.imageAlt")}
              className="card-image-side"
            />
          </div>
          <div className="about-block about-block__text">
            <h2 className="card-title">
              {t("about.section.mission.title")}
            </h2>
            <p className="card-text">
              {t("about.section.mission.p1")}
            </p>
            <p className="card-text">
              {t("about.section.mission.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Pozitív visszajelzések – szöveg balra, kép jobbra (feedback.png) */}
      <section className="section section--soft">
        <div className="container grid-two">
          <div className="about-block about-block__text">
            <h2 className="card-title">
              {t("about.section.feedback.title")}
            </h2>
            <p className="card-text">
              {t("about.section.feedback.p1")}
            </p>
            <ul className="card-list">
              <li>{t("about.section.feedback.li1")}</li>
              <li>{t("about.section.feedback.li2")}</li>
              <li>{t("about.section.feedback.li3")}</li>
            </ul>
          </div>
          <div className="about-block about-block__image">
            <img
              src="/images/feedback.png"
              alt={t("about.feedback.imageAlt")}
              className="card-image-side"
            />
          </div>
        </div>
      </section>

      {/* 4. Értékrendünk – kép balra, szöveg jobbra (values.png) */}
      <section className="section">
        <div className="container grid-two">
          <div className="about-block about-block__image">
            <img
              src="/images/values.png"
              alt={t("about.section.values.title")}
              className="card-image-side"
            />
          </div>
          <div className="about-block about-block__text">
            <h2 className="card-title">
              {t("about.section.values.title")}
            </h2>
            <ul className="card-list">
              <li>{t("about.section.values.li1")}</li>
              <li>{t("about.section.values.li2")}</li>
              <li>{t("about.section.values.li3")}</li>
              <li>{t("about.section.values.li4")}</li>
              <li>{t("about.section.values.li5")}</li>
              <li>{t("about.section.values.li6")}</li>
              <li>{t("about.section.values.li7")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Történetünk – szöveg balra, kép jobbra (history.png) */}
      <section className="section section--soft">
        <div className="container grid-two">
          <div className="about-block about-block__text">
            <h2 className="card-title">
              {t("about.section.story.title")}
            </h2>
            <p className="card-text">
              {t("about.section.story.p1")}
            </p>
            <p className="card-text">
              {t("about.section.story.p2")}
            </p>
            <p className="card-text">
              {t("about.section.story.p3")}
            </p>
            <p className="card-text">
              {t("about.section.story.p4")}
            </p>
            <p className="card-text">
              {t("about.section.story.p5")}
            </p>
          </div>
          <div className="about-block about-block__image">
            <img
              src="/images/history.png"
              alt={t("about.section.story.title")}
              className="card-image-side"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
