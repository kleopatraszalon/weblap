import React, { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useI18n } from "../i18n";

export type ServiceSection = {
  titleKey: string;
  items: string[]; // translation keys
};

export type ServiceDetailLayoutProps = {
  titleKey: string;
  leadKey: string;
  heroImageSrc: string;
  priceAnchor: string;
  sections: ServiceSection[];
};

export const ServiceDetailLayout: React.FC<ServiceDetailLayoutProps> = ({
  titleKey,
  leadKey,
  heroImageSrc,
  priceAnchor,
  sections,
}) => {
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main>
      <section className="page-hero page-hero--services">
        <div className="page-hero__image-wrap">
          <img
            src={heroImageSrc}
            alt={t(titleKey)}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay" />
        </div>

        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow section-eyebrow--magenta">
            <Link to="/szolgaltatasok" className="link-reset">
              {t("services.detail.breadcrumb.services")}
            </Link>
          </p>

          <h1 className="hero-title">
            <span className="hero-part hero-part-default">{t(titleKey)}</span>
          </h1>

          <p className="hero-lead hero-lead--narrow">{t(leadKey)}</p>

          <div className="hero-cta-row">
            <NavLink to={priceAnchor} className="btn hero-cta-btn hero-cta-btn--gold hero-cta-btn--bold">
              {t("services.detail.cta.prices")}
            </NavLink>
            <NavLink to="/szalonok" className="btn hero-cta-btn hero-cta-btn--outline">
              {t("services.detail.cta.salons")}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          {sections.map((sec) => (
            <div key={sec.titleKey} className="content-block">
              <h2 className="section-title">{t(sec.titleKey)}</h2>
              <ul className="content-list">
                {sec.items.map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className="content-actions">
            <NavLink to="/szolgaltatasok" className="btn btn--magenta-shine">
              {t("services.detail.cta.back")}
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetailLayout;
