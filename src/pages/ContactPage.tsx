import React from "react";
import { useI18n } from "../i18n";

export const ContactPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main>
      {/* HERO */}
      <section className="page-hero page-hero--soft">
        <div className="container">
          <p className="section-eyebrow">{t("contact.hero.eyebrow")}</p>
          <h1 className="hero-title">
            <span className="hero-part hero-part-default">
              {t("home.hero.title.prefix")}
            </span>
            <span className="hero-part hero-part-magenta">
              {t("home.hero.title.highlight")}
            </span>
            <span className="hero-part hero-part-gold">
              {t("contact.hero.title.suffix")}
            </span>
          </h1>
          <p className="hero-lead hero-lead--narrow">
            {t("contact.hero.lead")}
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="section section--no-top">
        <div className="container contact-layout">
          {/* BEAUTY FORM */}
          <form className="form-card beauty-form">
            <h2 className="form-title">{t("contact.hero.title")}</h2>
            <p className="form-intro">{t("contact.form.intro")}</p>

            {/* VENDÉGADATOK */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("contact.form.guest.legend")}
              </legend>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("contact.form.name")}</span>
                  <input type="text" name="name" required />
                </label>
                <label className="field">
                  <span>{t("contact.form.email")}</span>
                  <input type="email" name="email" required />
                </label>
              </div>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("contact.form.phone")}</span>
                  <input type="tel" name="phone" />
                </label>
                <label className="field">
                  <span>{t("contact.form.location.label")}</span>
                  <select name="location">
                    <option>{t("contact.form.location.all")}</option>
                    <option>Budapest IX. – Mester u. 1.</option>
                    <option>Budapest VIII. – Rákóczi u. 63.</option>
                    <option>Budapest XII. – Krisztina krt. 23.</option>
                    <option>Budapest XIII. – Visegrádi u. 3.</option>
                    <option>Gyöngyös – Koháry u. 29.</option>
                    <option>Eger – Dr. Nagy János u. 8.</option>
                    <option>Salgótarján – Füleki út 44.</option>
                  </select>
                </label>
              </div>
            </fieldset>

            {/* TÉMA / SZOLGÁLTATÁS */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("contact.form.topics.legend")}
              </legend>

              <div className="choice-pills">
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="fodraszat" />
                  <span>{t("contact.form.topic.hairdressing")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="kozmetika" />
                  <span>{t("contact.form.topic.beauty")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="kezlabapolas" />
                  <span>{t("contact.form.topic.handsFeet")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="szolarium" />
                  <span>{t("contact.form.topic.solarium")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="masszazs" />
                  <span>{t("contact.form.topic.massage")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="franchise" />
                  <span>{t("contact.form.topic.franchise")}</span>
                </label>
                <label className="choice-pill">
                  <input type="checkbox" name="topic" value="karrier" />
                  <span>{t("contact.form.topic.career")}</span>
                </label>
              </div>
            </fieldset>

            {/* KAPCSOLATFELVÉTEL MÓDJA */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("contact.form.contactType.legend")}
              </legend>

              <div className="choice-pills choice-pills--soft">
                <label className="choice-pill choice-pill--outline">
                  <input
                    type="radio"
                    name="contactType"
                    value="email"
                    defaultChecked
                  />
                  <span>{t("contact.form.contactType.email")}</span>
                </label>
                <label className="choice-pill choice-pill--outline">
                  <input type="radio" name="contactType" value="phone" />
                  <span>{t("contact.form.contactType.phone")}</span>
                </label>
                <label className="choice-pill choice-pill--outline">
                  <input type="radio" name="contactType" value="either" />
                  <span>{t("contact.form.contactType.either")}</span>
                </label>
              </div>
            </fieldset>

            {/* ÜZENET */}
            <fieldset className="beauty-fieldset">
              <legend className="beauty-legend">
                {t("contact.form.message.legend")}
              </legend>

              <div className="form-row">
                <label className="field">
                  <span>{t("contact.form.messageLabel")}</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t("contact.form.messagePlaceholder")}
                    required
                  />
                </label>
              </div>
            </fieldset>

            <p className="form-caption">
              {t("contact.form.caption.demo")}
            </p>

            <button
              type="submit"
              className="btn btn-primary btn-primary--magenta"
            >
              {t("contact.form.submit")}
            </button>
          </form>

          {/* OLDALSÁV / INFO */}
          <aside className="card contact-aside card--soft">
            <h2 className="card-title">{t("contact.aside.title")}</h2>
            <p className="card-text">
              {t("contact.aside.websiteLabel")}{" "}
              <a
                href="https://kleoszalon.hu"
                target="_blank"
                rel="noreferrer"
              >
                kleoszalon.hu
              </a>
            </p>

            <p className="card-text">
              {t("contact.aside.salonInfo")}
            </p>

            <hr className="card-divider" />

            <p className="card-text small muted">
              {t("contact.aside.urgentNote")}
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
