import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";
import { useWebsiteCms } from "../websiteCms";

export const HomePage: React.FC = () => {
  const { t } = useI18n();
  const cms = useWebsiteCms();
  const h = cms.home;
  return <main>
    <section className="hero"><div className="hero-bg"/><div className="container hero-grid">
      <div className="hero-content">
        <div className="hero-kicker">{h.heroKicker}</div>
        <h1 className="hero-title"><span className="hero-part hero-part-default">{h.heroTitlePrefix}</span><span className="hero-part hero-part-magenta">{h.heroTitleHighlight}</span><span className="hero-part hero-part-gold">{h.heroTitleSuffix}</span></h1>
        <p className="hero-lead">{h.heroLead}</p>
        <div className="hero-pills">
          <NavLink to="/services#hair" className="hero-pill">{t("home.hero.pill.hair")}</NavLink><NavLink to="/services#beauty" className="hero-pill">{t("home.hero.pill.beauty")}</NavLink><NavLink to="/services#handsfeet" className="hero-pill">{t("home.hero.pill.handsFeet")}</NavLink><NavLink to="/services#solarium" className="hero-pill">{t("home.hero.pill.solarium")}</NavLink><NavLink to="/services#massage" className="hero-pill">{t("home.hero.pill.massage")}</NavLink>
        </div>
        <div className="hero-actions"><NavLink to="/booking" className="btn btn-primary btn-primary--magenta">{cms.header.bookingLabel}</NavLink><NavLink to="/services" className="btn btn-outline">{t("home.hero.cta.services")}</NavLink></div>
      </div>
      <div className="hero-media"><div className="hero-media-frame"><img src={h.heroImageUrl} alt="Kleopátra Szépségszalon" className="hero-media-img"/><div className="hero-media-overlay"><NavLink to="/webshop" className="hero-media-webshop">{t("home.hero.media.webshop")}</NavLink><div className="hero-media-chip">{t("home.hero.media.appChip")}</div></div></div></div>
    </div></section>

    <section className="hero-strips"><div className="container hero-strips-row"><NavLink to="/franchise" className="hero-strip">{t("home.strips.franchise")}</NavLink><NavLink to="/training" className="hero-strip">{t("home.strips.app")}</NavLink><NavLink to="/loyalty" className="hero-strip">{t("home.strips.newsletter")}</NavLink><NavLink to="/contact" className="hero-strip">{t("home.strips.contact")}</NavLink></div></section>

    {h.showFranchise && <section className="section section--franchise"><div className="container grid-two"><div><p className="section-kicker">{t("home.franchise.kicker")}</p><h2>{t("home.franchise.title")}</h2><p className="section-lead">{t("home.franchise.lead")}</p><ul className="bullet-list"><li>{t("home.franchise.bullet1")}</li><li>{t("home.franchise.bullet2")}</li><li>{t("home.franchise.bullet3")}</li><li>{t("home.franchise.bullet4")}</li><li>{t("home.franchise.bullet5")}</li></ul><NavLink to="/franchise" className="btn btn-outline">{t("home.franchise.cta")}</NavLink></div><div className="franchise-image"><img src="/images/franchise.png" alt={t("home.franchise.imageAlt")}/></div></div></section>}

    {h.showApp && <section id="app" className="section section--app"><div className="container grid-two"><div className="app-image"><img src="/images/app.png" alt={t("home.app.imageAlt")}/></div><div><p className="section-kicker">MOBILALKALMAZÁS</p><h2>{h.appTitle}</h2><p className="section-lead">{h.appLead}</p><ul className="bullet-list"><li>{t("home.app.bullet1")}</li><li>{t("home.app.bullet2")}</li><li>{t("home.app.bullet3")}</li><li>{t("home.app.bullet4")}</li></ul><div className="app-buttons"><a href="https://apps.apple.com/us/app/id1492246806" target="_blank" rel="noreferrer" className="btn btn-primary btn-primary--magenta">iPhone</a><a href="https://play.google.com/store/apps/details?id=com.yclients.mobile.s206313" target="_blank" rel="noreferrer" className="btn btn-outline">Android</a></div></div></div></section>}

    {h.showVouchers && <section className="section section--vouchers"><div className="container grid-two"><div><p className="section-kicker">AJÁNDÉK</p><h2>{h.voucherTitle}</h2><p className="section-lead">{h.voucherLead}</p><NavLink to="/webshop" className="btn btn-outline">{t("home.vouchers.cta")}</NavLink></div><div className="vouchers-image"><img src="/images/vouchers.png" alt={t("home.vouchers.imageAlt")}/></div></div></section>}

    {h.showNewsletter && <section className="section section--newsletter"><div className="container grid-two"><div><p className="section-kicker">HÍRLEVÉL</p><h2>{h.newsletterTitle}</h2><p className="section-lead">{h.newsletterLead}</p></div><div className="newsletter-actions"><NavLink to="/loyalty" className="btn btn-primary">{t("home.newsletter.cta")}</NavLink></div></div></section>}

    {h.showProducts && <section className="section section--products"><div className="container grid-two"><div><p className="section-kicker">KLEOS</p><h2>{h.productsTitle}</h2><p className="section-lead">{h.productsLead}</p><NavLink to="/webshop" className="btn btn-outline">{t("home.products.cta")}</NavLink></div><div className="products-image"><img src="/images/products.png" alt={t("home.products.imageAlt")}/></div></div></section>}

    <section className="kleo-why"><div className="container"><p className="section-kicker">KLEOPÁTRA ÉLMÉNY</p><h2>{h.whyTitle}</h2><div className="kleo-why-grid">{(h.whyItems || []).map((item,i)=><div className="kleo-why-card" key={`${i}-${item}`}>{item}</div>)}</div></div></section>

    {h.showServices && <section className="section section--services-overview"><div className="container"><header className="section-header"><p className="section-kicker">{t("home.services.kicker")}</p><h2>{t("home.services.title")}</h2><p className="section-lead">{t("home.services.lead")}</p></header><div className="grid-three">
      {[["hair","/services#hair"],["beauty","/services#beauty"],["handsFeet","/services#handsfeet"],["solarium","/services#solarium"],["massage","/services#massage"],["fitness","/services#fitness"]].map(([key,to])=><NavLink key={key} to={to} className="card"><h3 className="card-title">{t(`services.cards.${key}.title`)}</h3><p className="card-text">{t(`services.cards.${key}.text`)}</p><span className="link-btn">{t(`services.cards.${key}.cta`)}</span></NavLink>)}
    </div></div></section>}
  </main>;
};

export default HomePage;
