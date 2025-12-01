// src/pages/ServicesPage.tsx
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";

type ServiceCategoryConfig = {
  id: "hair" | "beauty" | "handsfeet" | "solarium" | "massage" | "fitness";
  priceAnchor: string;
  titleKey: string;
  textKey: string;
};

const SERVICE_CATEGORIES: ServiceCategoryConfig[] = [
  {
    id: "hair",
    priceAnchor: "/prices#category-1",
    titleKey: "services.cards.hair.title",
    textKey: "services.cards.hair.text",
  },
  {
    id: "beauty",
    priceAnchor: "/prices#category-2",
    titleKey: "services.cards.beauty.title",
    textKey: "services.cards.beauty.text",
  },
  {
    id: "handsfeet",
    priceAnchor: "/prices#category-3",
    titleKey: "services.cards.handsFeet.title",
    textKey: "services.cards.handsFeet.text",
  },
  {
    id: "solarium",
    priceAnchor: "/prices#category-5",
    titleKey: "services.cards.solarium.title",
    textKey: "services.cards.solarium.text",
  },
  {
    id: "massage",
    priceAnchor: "/prices#category-6",
    titleKey: "services.cards.massage.title",
    textKey: "services.cards.massage.text",
  },
  {
    id: "fitness",
    priceAnchor: "/prices",
    titleKey: "services.cards.fitness.title",
    textKey: "services.cards.fitness.text",
  },
];

type HighlightServiceConfig = {
  slug: string;
  image: string;
  titleKey: string;
};

const HIGHLIGHT_SERVICES: HighlightServiceConfig[] = [
  {
    slug: "szempilla",
    image: "/images/szempilla.png",
    titleKey: "services.highlight.lash.title",
  },
  {
    slug: "hajmosas",
    image: "/images/hajmosas.png",
    titleKey: "services.highlight.hairwash.title",
  },
  {
    slug: "arcmasszazs",
    image: "/images/arcmasszazs.jpg",
    titleKey: "services.highlight.facemassage.title",
  },
  {
    slug: "actisztitas",
    image: "/images/actisztitas.png",
    titleKey: "services.highlight.actisztitas.title",
  },
  {
    slug: "joico",
    image: "/images/joico.png",
    titleKey: "services.highlight.joico.title",
  },
  {
    slug: "melegollos",
    image: "/images/Melegollos.jpg",
    titleKey: "services.highlight.hotcut.title",
  },
  {
    slug: "ipl",
    image: "/images/ipl.jpg",
    titleKey: "services.highlight.ipl.title",
  },
];

export const ServicesPage: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();

  // Ha hash-szel érkezünk (pl. /services#hair), gördüljünk a megfelelő blokkra
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.hash]);

  return (
    <main>
      {/* FELSŐ NAGY HERO-KÉP – hasonló a régi szolgáltatás oldalhoz */}
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
            <span className="hero-part hero-part-gold">
              {t("services.page.titleSuffix")}
            </span>
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("services.page.lead")}
          </p>

          <NavLink
            to="/prices"
            className="btn hero-cta-btn hero-cta-btn--gold hero-cta-btn--bold"
          >
            {t("services.page.viewPriceList")}
          </NavLink>
        </div>
      </section>

      {/* A) SZOLGÁLTATÁSKATEGÓRIÁK – FODRÁSZAT, KOZMETIKA stb.
          A gombok ugyanazt a stílust használják, mint a Szalonok oldalon. */}
      <section className="section section--services-categories">
        <div className="container">
          <div className="salons-grid services-category-grid">
            {SERVICE_CATEGORIES.map((service) => (
              <NavLink
                key={service.id}
                id={service.id}
                to={service.priceAnchor}
                className="salon-pill salon-pill--service"
              >
                <span className="salon-pill__city">
                  {t(service.titleKey)}
                </span>
                <span className="salon-pill__address">
                  {t(service.textKey)}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* B) KIEMELT SZOLGÁLTATÁSOK – a kép közepén arany/magenta szöveggel */}
      <section className="section section--services-highlights">
        <div className="container">
          <h2 className="section-title section-title--center">
            {t("services.highlight.sectionTitle")}
          </h2>
          <p className="hero-lead hero-lead--narrow services-highlight-lead">
            {t("services.highlight.sectionLead")}
          </p>

          <div className="services-highlights-grid">
            {HIGHLIGHT_SERVICES.map((service) => (
              <NavLink
                key={service.slug}
                to={`/services/${service.slug}`}
                className="services-highlight-card"
              >
                <div
                  className="services-highlight-card__image"
                  style={{ backgroundImage: `url('${service.image}')` }}
                >
                  <div className="services-highlight-card__overlay">
                    <span className="services-highlight-card__title">
                      {t(service.titleKey)}
                    </span>
                    <span className="services-highlight-card__more">
                      {t("services.highlight.more")}
                    </span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
