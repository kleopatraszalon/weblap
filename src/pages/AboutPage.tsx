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
          <div className="page-hero__image-overlay" />
        </div>
        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
          <h1>{t("about.hero.title")}</h1>
          <p className="hero-lead hero-lead--narrow">
            {t("about.hero.lead")}
          </p>
        </div>
      </section>

      {/* KÉT FŐ ÍGÉRET – Minden egy helyen / Vendégközpontú gondolkodás */}
<section className="section section--alt">
  <div className="container grid-two">
    <article className="card card--about-promise">
      <h2 className="card-title">{t("about.card1.title")}</h2>
      <p className="card-text">{t("about.card1.text")}</p>
    </article>
    <article className="card card--about-promise">
      <h2 className="card-title">{t("about.card2.title")}</h2>
      <p className="card-text">{t("about.card2.text")}</p>
    </article>
  </div>
</section>

      {/* VÍZIÓ – kép balra, szöveg jobbra (vision.png) */}
      <section className="section section--alt section--about-vision">
        <div className="container grid-two grid-two--reverse">
          <div className="section-image-card section-image-card--about">
            <img
              src="/images/vision.png"
              alt={t("about.vision.imageAlt")}
            />
          </div>

          <div>
            <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
            <h2 className="section-title">
              {t("about.section.vision.title")}
            </h2>

            <p className="section-lead">
              {t("about.section.vision.p1")}
            </p>
            <p>{t("about.section.vision.p2")}</p>
          </div>
        </div>
      </section>

      {/* KÜLDETÉS – kép jobbra, szöveg balra (mission.png) */}
      <section className="section section--about section--about-mission">
        <div className="container grid-two">
          <div>
            <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
            <h2 className="section-title">
              {t("about.section.mission.title")}
            </h2>

            <p className="section-lead">
              {t("about.section.mission.p1")}
            </p>
            <p>{t("about.section.mission.p2")}</p>
          </div>

          <div className="section-image-card section-image-card--about">
            <img
              src="/images/mission.png"
              alt={t("about.mission.imageAlt")}
            />
          </div>
        </div>
      </section>

      {/* ÉRTÉKREND – bullet lista + kép (values.png) */}
      <section className="section section--alt section--about-values">
        <div className="container grid-two">
          <div>
            <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
            <h2 className="section-title">
              {t("about.section.values.title")}
            </h2>

            <ul className="bullet-list">
              <li>{t("about.section.values.li1")}</li>
              <li>{t("about.section.values.li2")}</li>
              <li>{t("about.section.values.li3")}</li>
              <li>{t("about.section.values.li4")}</li>
              <li>{t("about.section.values.li5")}</li>
              <li>{t("about.section.values.li6")}</li>
              <li>{t("about.section.values.li7")}</li>
            </ul>
          </div>

          <div className="section-image-card section-image-card--about">
            <img
              src="/images/values.png"
              alt={t("about.section.values.title")}
            />
          </div>
        </div>
      </section>

      {/* VENDÉGVISSZAJELZÉSEK – bullet lista + kép (feedback.png) */}
      <section className="section section--about section--about-feedback">
        <div className="container grid-two grid-two--reverse">
          <div className="section-image-card section-image-card--about">
            <img
              src="/images/feedback.png"
              alt={t("about.feedback.imageAlt")}
            />
          </div>

          <div>
            <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
            <h2 className="section-title">
              {t("about.section.feedback.title")}
            </h2>

            <p className="section-lead">
              {t("about.section.feedback.p1")}
            </p>
            <ul className="bullet-list">
              <li>{t("about.section.feedback.li1")}</li>
              <li>{t("about.section.feedback.li2")}</li>
              <li>{t("about.section.feedback.li3")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TÖRTÉNETÜNK RÖVIDEN – történet + kép (history.png) – MOST A VÉGÉN */}
      <section className="section section--about section--about-story">
        <div className="container grid-two">
          <div>
            <p className="section-eyebrow">{t("about.hero.eyebrow")}</p>
            <h2 className="section-title">
              {t("about.section.story.title")}
            </h2>

            <p className="section-lead">
              {t("about.section.story.p1")}
            </p>
            <p>{t("about.section.story.p2")}</p>
            <p>{t("about.section.story.p3")}</p>
            <p>{t("about.section.story.p4")}</p>
            <p>{t("about.section.story.p5")}</p>
          </div>

          <div className="section-image-card section-image-card--about">
            <img
              src="/images/history.png"
              alt={t("about.section.story.title")}
            />
          </div>
        </div>
      </section>
    </main>
  );
};
