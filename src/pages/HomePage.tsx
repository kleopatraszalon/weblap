import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

export const HomePage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      {/* HERO – KEZDŐLAP */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="container hero-grid">
          {/* BAL: szöveg */}
          <div className="hero-content">
            <div className="hero-kicker">{t("home.hero.kicker")}</div>

            <h1 className="hero-title">
              <span className="hero-part hero-part-default">
                {t("home.hero.title.prefix")}
              </span>
              <span className="hero-part hero-part-magenta">
                {t("home.hero.title.highlight")}
              </span>
              <span className="hero-part hero-part-gold">
                {t("home.hero.title.suffix")}
              </span>
            </h1>

            <p className="hero-lead">{t("home.hero.lead")}</p>

            {/* PILL GOMBOK – ÁRLISTA / SZOLGÁLTATÁSOK OLDALRA MUTATNAK */}
            <div className="hero-pills">
              <NavLink to="/services#hair" className="hero-pill">
                {t("home.hero.pill.hair")}
              </NavLink>
              <NavLink to="/services#beauty" className="hero-pill">
                {t("home.hero.pill.beauty")}
              </NavLink>
              <NavLink to="/services#handsfeet" className="hero-pill">
                {t("home.hero.pill.handsFeet")}
              </NavLink>
              <NavLink to="/services#solarium" className="hero-pill">
                {t("home.hero.pill.solarium")}
              </NavLink>
              <NavLink to="/services#massage" className="hero-pill">
                {t("home.hero.pill.massage")}
              </NavLink>
            </div>

            {/* CTA GOMBOK – FOGLALÁS / SZOLGÁLTATÁSOK */}
            <div className="hero-actions">
              <NavLink
                to="/salons"
                className="btn btn-primary btn-primary--magenta"
              >
                {t("home.hero.cta.book")}
              </NavLink>
              <NavLink to="/services" className="btn btn-outline">
                {t("home.hero.cta.services")}
              </NavLink>
            </div>
          </div>

          {/* JOBB: kép + overlay webshop / app chip */}
          <div className="hero-media">
            <div className="hero-media-frame">
              <img
                src="/images/home.png"
                alt="Kleopátra Szépségszalon – szépségszolgáltatások"
                className="hero-media-img"
              />

              <div className="hero-media-overlay">
                <NavLink to="/webshop" className="hero-media-webshop">
                  {t("home.hero.media.webshop")}
                </NavLink>

                {/* Mobilon a referenciaképen látható mini nyelv + social sor */}

                <div className="hero-media-chip">
                  {t("home.hero.media.appChip")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HERO ALATTI LINKCSÍKOK */}
      <section className="hero-strips">
        <div className="container hero-strips-row">
          <NavLink to="/franchise" className="hero-strip">
            {t("home.strips.franchise")}
          </NavLink>
          <NavLink to="/training" className="hero-strip">
            {t("home.strips.app")}
          </NavLink>
          <NavLink to="/loyalty" className="hero-strip">
            {t("home.strips.newsletter")}
          </NavLink>
          <NavLink to="/contact" className="hero-strip">
            {t("home.strips.contact")}
          </NavLink>
        </div>
      </section>

      {/* FRANCHISE PROGRAM BLOKK */}
      <section className="section section--franchise">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">{t("home.franchise.kicker")}</p>
            <h2>{t("home.franchise.title")}</h2>
            <p className="section-lead">{t("home.franchise.lead")}</p>

            <ul className="bullet-list">
              <li>{t("home.franchise.bullet1")}</li>
              <li>{t("home.franchise.bullet2")}</li>
              <li>{t("home.franchise.bullet3")}</li>
              <li>{t("home.franchise.bullet4")}</li>
              <li>{t("home.franchise.bullet5")}</li>
            </ul>

            <NavLink to="/franchise" className="btn btn-outline">
              {t("home.franchise.cta")}
            </NavLink>
          </div>

          <div className="franchise-image">
            <img
              src="/images/franchise.png"
              alt={t("home.franchise.imageAlt")}
            />
          </div>
        </div>
      </section>

      {/* MOBILALKALMAZÁS BLOKK */}
      <section id="app" className="section section--app">
        <div className="container grid-two">
          <div className="app-image">
            <img src="/images/app.png" alt={t("home.app.imageAlt")} />
          </div>

          <div>
            <p className="section-kicker">{t("home.app.kicker")}</p>
            <h2>{t("home.app.title")}</h2>
            <p className="section-lead">{t("home.app.lead")}</p>

            <ul className="bullet-list">
              <li>{t("home.app.bullet1")}</li>
              <li>{t("home.app.bullet2")}</li>
              <li>{t("home.app.bullet3")}</li>
              <li>{t("home.app.bullet4")}</li>
            </ul>

            <div className="app-buttons">
              <a href="#" className="btn btn-primary btn-primary--magenta">
                {t("home.app.cta.primary")}
              </a>
              <a href="#" className="btn btn-outline">
                {t("home.app.cta.secondary")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AJÁNDÉKUTALVÁNYOK BLOKK */}
      <section className="section section--vouchers">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">{t("home.vouchers.kicker")}</p>
            <h2>{t("home.vouchers.title")}</h2>
            <p className="section-lead">{t("home.vouchers.lead1")}</p>
            <p>{t("home.vouchers.lead2")}</p>

            <div className="badge-row">
              <span className="hero-badge hero-badge--gift">
                {t("home.vouchers.badge")}
              </span>
            </div>

            <NavLink to="/webshop" className="btn btn-outline">
              {t("home.vouchers.cta")}
            </NavLink>
          </div>

          <div className="vouchers-image">
            <img
              src="/images/vouchers.png"
              alt={t("home.vouchers.imageAlt")}
            />
          </div>
        </div>
      </section>

      {/* HÍRLEVÉL / HŰSÉG BLOKK */}
      <section className="section section--newsletter">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">{t("home.newsletter.kicker")}</p>
            <h2>
              {t("home.newsletter.titlePrefix")}{" "}
              <span className="highlight">1500 Ft</span>{" "}
              {t("home.newsletter.titleSuffix")}
            </h2>
            <p className="section-lead">{t("home.newsletter.lead")}</p>
          </div>

          <div className="newsletter-actions">
            <NavLink to="/loyalty" className="btn btn-primary">
              {t("home.newsletter.cta")}
            </NavLink>
          </div>
        </div>
      </section>

      {/* KLEOS TERMÉKEK / WEBSHOP TEASER */}
      <section className="section section--products">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">{t("home.products.kicker")}</p>
            <h2>{t("home.products.title")}</h2>
            <p className="section-lead">{t("home.products.lead1")}</p>
            <p>{t("home.products.lead2")}</p>

            <NavLink to="/webshop" className="btn btn-outline">
              {t("home.products.cta")}
            </NavLink>
          </div>

          <div className="products-image">
            <img
              src="/images/products.png"
              alt={t("home.products.imageAlt")}
            />
          </div>
        </div>
      </section>

      {/* SZOLGÁLTATÁS-BLOKK (RÖVID ÍZELÍTŐ) */}
      <section className="section section--services-overview">
        <div className="container">
          <header className="section-header">
            <p className="section-kicker">{t("home.services.kicker")}</p>
            <h2>{t("home.services.title")}</h2>
            <p className="section-lead">{t("home.services.lead")}</p>
          </header>

          <div className="grid-three">
            <NavLink to="/services#hair" className="card">
              <h3 className="card-title">
                {t("services.cards.hair.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.hair.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.hair.cta")}
              </span>
            </NavLink>

            <NavLink to="/services#beauty" className="card">
              <h3 className="card-title">
                {t("services.cards.beauty.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.beauty.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.beauty.cta")}
              </span>
            </NavLink>

            <NavLink to="/services#handsfeet" className="card">
              <h3 className="card-title">
                {t("services.cards.handsFeet.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.handsFeet.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.handsFeet.cta")}
              </span>
            </NavLink>

            <NavLink to="/services#solarium" className="card">
              <h3 className="card-title">
                {t("services.cards.solarium.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.solarium.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.solarium.cta")}
              </span>
            </NavLink>

            <NavLink to="/services#massage" className="card">
              <h3 className="card-title">
                {t("services.cards.massage.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.massage.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.massage.cta")}
              </span>
            </NavLink>

            <NavLink to="/services#fitness" className="card">
              <h3 className="card-title">
                {t("services.cards.fitness.title")}
              </h3>
              <p className="card-text">
                {t("services.cards.fitness.text")}
              </p>
              <span className="link-btn">
                {t("services.cards.fitness.cta")}
              </span>
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;