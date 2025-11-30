import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";

type ServiceDef = {
  id: "hair" | "beauty" | "handsfeet" | "solarium" | "massage" | "fitness";
  priceAnchor: string;
};

const SERVICES: ServiceDef[] = [
  { id: "hair", priceAnchor: "/prices#category-1" },
  { id: "beauty", priceAnchor: "/prices#category-2" },
  { id: "handsfeet", priceAnchor: "/prices#category-3" },
  { id: "solarium", priceAnchor: "/prices#category-5" },
  { id: "massage", priceAnchor: "/prices#category-6" },
  { id: "fitness", priceAnchor: "/prices" },
];

export const ServicesPage: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();

  // Hash alapú görgetés (#hair, #beauty, stb.)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main>
      {/* HERO – ugyanaz a logika, mint a Szalonjaink oldalon, arany + magenta */}
      <section className="page-hero page-hero--services">
        <div className="page-hero__image-wrap">
          <img
            src="/images/szolgaltatasok.png"
            alt={t("services.page.heroAlt")}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay" />
        </div>

        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow section-eyebrow--magenta">
            {t("services.page.eyebrow")}
          </p>
          <h1 className="hero-title">
            <span className="hero-part hero-part-default">
              {t("services.page.titlePrefix")}
            </span>{" "}
            <span className="hero-part hero-part-magenta">
              {t("services.page.titleHighlight")}
            </span>{" "}
            <span className="hero-part hero-part-gold">
              {t("services.page.titleSuffix")}
            </span>
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("services.page.lead")}
          </p>
        </div>
      </section>

      {/* RÉSZLETES SZOLGÁLTATÁS BLOKKOK – külön ID-kkel, hogy a hompage-ről odaguruljanak */}
      <section className="section section--services-page">
        <div className="container">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              id={service.id}
              className="service-detail-block"
            >
              <p className="section-eyebrow section-eyebrow--magenta">
                {t(`services.detail.${service.id}.eyebrow`)}
              </p>
              <h2 className="service-detail-title">
                {t(`services.detail.${service.id}.title`)}
              </h2>
              <p className="service-detail-lead">
                {t(`services.detail.${service.id}.lead`)}
              </p>

              <ul className="bullet-list">
                <li>{t(`services.detail.${service.id}.bullet1`)}</li>
                <li>{t(`services.detail.${service.id}.bullet2`)}</li>
                <li>{t(`services.detail.${service.id}.bullet3`)}</li>
              </ul>

              <NavLink
                to={service.priceAnchor}
                className="btn btn-outline service-detail-cta"
              >
                {t(`services.detail.${service.id}.cta`)}
              </NavLink>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
