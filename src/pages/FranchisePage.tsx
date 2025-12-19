import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n"; // <<< FONTOS: egy szinttel feljebb!
import "../styles/FranchisePage.css";  // <<< EZT ADD HOZZÁ
import { submitToMailchimp } from "../utils/mailchimp";

export const FranchisePage: React.FC = () => {
  const { t } = useI18n();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      FNAME: String(fd.get("name") || ""),
      EMAIL: String(fd.get("email") || ""),
      PHONE: String(fd.get("phone") || ""),
      CITY: String(fd.get("city") || ""),
      STREET: String(fd.get("street") || ""),
      BUSINESS: String(fd.get("business") || ""),
      TIMELINE: String(fd.get("timeline") || ""),
      SOURCE: "franchise",
    };
    await submitToMailchimp(payload);
    nav("/franchise-koszonjuk");
  }

  return (
    <main className="page-franchise">
      {/* HERO – franchise csatlakozás */}
      <section className="page-hero page-hero--franchise">
        <div className="page-hero__image-wrap">
          <img
            src="/images/franchise.jpg"
            alt={t("franchise.hero.imageAlt")}
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay" />
        </div>
        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow">{t("franchise.hero.eyebrow")}</p>
          <h1 className="hero-title">
            <span className="hero-part hero-part-default">
              {t("home.hero.title.prefix")}
            </span>
            <span className="hero-part hero-part-magenta">
              {t("home.hero.title.highlight")}
            </span>
            <span className="hero-part hero-part-gold">
              {t("franchise.hero.title")}
            </span>
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("franchise.hero.lead")}
          </p>
          <div className="hero-actions">
            {/* BELSŐ ŰRLAPRA GÖRGET */}
            <a
              href="#franchise-form"
              className="btn btn-primary btn-primary--magenta"
            >
              {t("franchise.hero.cta.primary")}
            </a>
            <Link
              to="/contact?topic=franchise"
              className="btn btn-ghost"
            >
              {t("franchise.hero.cta.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* KINEK SZÓL – két arany, „ígéret” kártya */}
      <section className="section section--franchise-segment">
        <div className="container">
          <h2 className="section-title">{t("franchise.segment.title")}</h2>
          <div className="grid-two">
            <article className="card card--franchise-segment">
              <h3 className="card-title">
                {t("franchise.segment.new.title")}
              </h3>
              <p className="card-text">
                {t("franchise.segment.new.lead")}
              </p>
              <ul className="list-bullets">
                <li>{t("franchise.segment.new.li1")}</li>
                <li>{t("franchise.segment.new.li2")}</li>
                <li>{t("franchise.segment.new.li3")}</li>
              </ul>
            </article>

            <article className="card card--franchise-segment">
              <h3 className="card-title">
                {t("franchise.segment.existing.title")}
              </h3>
              <p className="card-text">
                {t("franchise.segment.existing.lead")}
              </p>
              <ul className="list-bullets">
                <li>{t("franchise.segment.existing.li1")}</li>
                <li>{t("franchise.segment.existing.li2")}</li>
                <li>{t("franchise.segment.existing.li3")}</li>
                <li>{t("franchise.segment.existing.li4")}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ELŐNYÖK / MÁRKA / TÁMOGATÁS */}
      <section className="section section--franchise-benefits">
        <div className="container grid-three">
          <article className="card card--soft">
            <h2 className="card-title">{t("franchise.benefits.brand.title")}</h2>
            <p className="card-text">
              {t("franchise.benefits.brand.text")}
            </p>
          </article>
          <article className="card card--soft">
            <h2 className="card-title">
              {t("franchise.benefits.support.title")}
            </h2>
            <p className="card-text">
              {t("franchise.benefits.support.text")}
            </p>
          </article>
          <article className="card card--soft">
            <h2 className="card-title">
              {t("franchise.benefits.flexible.title")}
            </h2>
            <p className="card-text">
              {t("franchise.benefits.flexible.text")}
            </p>
          </article>
        </div>
      </section>

      {/* BEFEKTETÉS / FŐ SZÁMOK */}
      <section className="section section--franchise-invest">
        <div className="container grid-three">
          <article className="card card--soft">
            <h2 className="card-title">
              {t("franchise.invest.entry.title")}
            </h2>
            <p className="card-text">
              {t("franchise.invest.entry.text")}
            </p>
          </article>
          <article className="card card--soft">
            <h2 className="card-title">
              {t("franchise.invest.start.title")}
            </h2>
            <p className="card-text">
              {t("franchise.invest.start.text")}
            </p>
          </article>
          <article className="card card--soft">
            <h2 className="card-title">
              {t("franchise.invest.royalty.title")}
            </h2>
            <p className="card-text">
              {t("franchise.invest.royalty.text")}
            </p>
          </article>
        </div>
      </section>

      {/* LÉPÉSEK – MIT KAPSZ PARTNERKÉNT */}
      <section className="section section--franchise-steps">
        <div className="container">
          <h2 className="section-title">{t("franchise.steps.title")}</h2>
          <div className="grid-three">
            <article className="card card--soft">
              <h3 className="card-title">
                {t("franchise.steps.start.title")}
              </h3>
              <p className="card-text">
                {t("franchise.steps.start.text")}
              </p>
            </article>
            <article className="card card--soft">
              <h3 className="card-title">
                {t("franchise.steps.firstGuests.title")}
              </h3>
              <p className="card-text">
                {t("franchise.steps.firstGuests.text")}
              </p>
            </article>
            <article className="card card--soft">
              <h3 className="card-title">
                {t("franchise.steps.growth.title")}
              </h3>
              <p className="card-text">
                {t("franchise.steps.growth.text")}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FRANCHISE JELENTKEZÉSI ŰRLAP – ContactPage mintájára */}
      <section
        id="franchise-form"
        className="section section--no-top section--franchise-form"
      >
        <div className="container contact-layout">
          {/* FORM */}
          <form className="form-card beauty-form" onSubmit={onSubmit}>
            <h2 className="form-title">{t("franchise.form.title")}</h2>
            <p className="form-intro">{t("franchise.form.intro")}</p>

            {/* SZEMÉLYES ADATOK */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("franchise.form.personal.legend")}
              </legend>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("franchise.form.name")}</span>
                  <input type="text" name="name" required />
                </label>
                <label className="field">
                  <span>{t("franchise.form.email")}</span>
                  <input type="email" name="email" required />
                </label>
              </div>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("franchise.form.phone")}</span>
                  <input type="tel" name="phone" />
                </label>
              </div>
            </fieldset>

            {/* TERVEZETT HELYSZÍN */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("franchise.form.location.legend")}
              </legend>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("franchise.form.location.city")}</span>
                  <input type="text" name="city" />
                </label>
                <label className="field">
                  <span>{t("franchise.form.location.street")}</span>
                  <input type="text" name="street" />
                </label>
              </div>
            </fieldset>

            {/* JELENLEGI HELYZET */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("franchise.form.business.legend")}
              </legend>

              <div className="choice-pills">
                <label className="choice-pill">
                  <input
                    type="radio"
                    name="business"
                    value="new-salon"
                    defaultChecked
                  />
                  <span>{t("franchise.form.business.new")}</span>
                </label>
                <label className="choice-pill">
                  <input
                    type="radio"
                    name="business"
                    value="convert-salon"
                  />
                  <span>{t("franchise.form.business.convert")}</span>
                </label>
                <label className="choice-pill">
                  <input
                    type="radio"
                    name="business"
                    value="other"
                  />
                  <span>{t("franchise.form.business.other")}</span>
                </label>
              </div>
            </fieldset>

            {/* IDŐZÍTÉS */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("franchise.form.timeline.legend")}
              </legend>

              <div className="choice-pills">
                <label className="choice-pill">
                  <input type="radio" name="timeline" value="asap" />
                  <span>{t("franchise.form.timeline.asap")}</span>
                </label>
                <label className="choice-pill">
                  <input type="radio" name="timeline" value="6months" />
                  <span>{t("franchise.form.timeline.sixMonths")}</span>
                </label>
                <label className="choice-pill">
                  <input type="radio" name="timeline" value="1year" />
                  <span>{t("franchise.form.timeline.year")}</span>
                </label>
              </div>
            </fieldset>

            {/* SZABAD SZÖVEG */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("franchise.form.message.legend")}
              </legend>

              <label className="field">
                <span>{t("franchise.form.messageLabel")}</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={t("franchise.form.messagePlaceholder")}
                />
              </label>
            </fieldset>

            <p className="form-caption">
              {t("franchise.form.caption.demo")}
            </p>

            <button
              type="submit"
              className="btn btn-primary btn-primary--magenta"
            >
              {t("franchise.form.submit")}
            </button>
          </form>

          {/* JOBB OLDALI INFO-KÁRTYA */}
          <aside className="card contact-aside card--soft franchise-aside">
            <h2 className="card-title">{t("franchise.aside.title")}</h2>
            <p className="card-text">{t("franchise.aside.text1")}</p>
            <p className="card-text">{t("franchise.aside.text2")}</p>
            <hr className="card-divider" />
            <p className="card-text small muted">
              {t("franchise.aside.note")}
            </p>
          </aside>
        </div>
      </section>

      {/* ZÁRÓ CTA */}
      <section className="section section--cta section--franchise-cta">
        <div className="container franchise-cta">
          <h2 className="section-title">{t("franchise.cta.title")}</h2>
          <p className="section-lead">
            {t("franchise.cta.lead")}
          </p>

          <div className="franchise-cta__contact">
            <p>
              <strong>{t("franchise.cta.phoneLabel")}</strong>{" "}
              +36 30 630 1506
            </p>
            <p>
              <strong>{t("franchise.cta.emailLabel")}</strong>{" "}
              info@kleopatraszepsegszalonok.hu
            </p>
          </div>

          <div className="franchise-cta__actions">
            <a
              href="#franchise-form"
              className="btn btn-primary btn-primary--magenta"
            >
              {t("franchise.cta.button.form")}
            </a>
            <Link
              to="/contact?topic=franchise"
              className="btn btn-ghost"
            >
              {t("franchise.cta.button.contact")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FranchisePage;
