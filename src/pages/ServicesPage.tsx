import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

type ServiceCard = {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "hair",
    titleKey: "services.cards.hair.title",
    descriptionKey: "services.cards.hair.text",
    ctaKey: "services.cards.hair.cta",
  },
  {
    slug: "beauty",
    titleKey: "services.cards.beauty.title",
    descriptionKey: "services.cards.beauty.text",
    ctaKey: "services.cards.beauty.cta",
  },
  {
    slug: "handsfeet",
    titleKey: "services.cards.handsFeet.title",
    descriptionKey: "services.cards.handsFeet.text",
    ctaKey: "services.cards.handsFeet.cta",
  },
  {
    slug: "solarium",
    titleKey: "services.cards.solarium.title",
    descriptionKey: "services.cards.solarium.text",
    ctaKey: "services.cards.solarium.cta",
  },
  {
    slug: "massage",
    titleKey: "services.cards.massage.title",
    descriptionKey: "services.cards.massage.text",
    ctaKey: "services.cards.massage.cta",
  },
  {
    slug: "fitness",
    titleKey: "services.cards.fitness.title",
    descriptionKey: "services.cards.fitness.text",
    ctaKey: "services.cards.fitness.cta",
  },
];

export const ServicesPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      <section className="section section--services">
        <div className="container services-block">
          <header className="services-header">
            <p className="section-eyebrow">{t("services.eyebrow")}</p>
            <h1>{t("services.title")}</h1>
            <p className="hero-lead hero-lead--narrow">
              {t("services.lead")}
            </p>
          </header>

          <div className="services-hero-image">
            <img
              src="/images/szolgaltatasok.png"
              alt={t("services.heroAlt")}
              className="services-hero-image__img"
            />
          </div>

          <div className="services-grid">
            {SERVICE_CARDS.map((service) => (
              <NavLink
                key={service.slug}
                to={`/prices#${service.slug}`}
                className="card card--service"
              >
                <h2 className="card-title">{t(service.titleKey)}</h2>
                <p className="card-text">{t(service.descriptionKey)}</p>
                <span className="link-btn">{t(service.ctaKey)}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
