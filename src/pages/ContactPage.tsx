import React from "react";

export const ContactPage: React.FC = () => (
  <main>
    {/* HERO */}
    <section className="page-hero page-hero--soft">
      <div className="container">
        <p className="section-eyebrow">Kapcsolat</p>
        <h1 className="hero-title">
          <span className="hero-part hero-part-default">Éld át a </span>
          <span className="hero-part hero-part-magenta">Kleopátra-élményt</span>
          <span className="hero-part hero-part-gold">
            {" "}
            – prémium szépségszolgáltatásokkal.
          </span>
        </h1>
        <p className="hero-lead hero-lead--narrow">
          Kérdésed van szolgáltatásainkkal, franchise-szal, karrierrel vagy
          hűségprogramunkkal kapcsolatban? Töltsd ki az űrlapot, és
          szalonjaink egyikéből felvesszük veled a kapcsolatot.
        </p>
      </div>
    </section>

    {/* FORM + INFO */}
    <section className="section section--no-top">
      <div className="container contact-layout">
        {/* BEAUTY FORM */}
        <form className="form-card beauty-form">
          <h2 className="form-title">Lépj velünk kapcsolatba</h2>
          <p className="form-intro">
            Pár adat, és máris tudni fogjuk, melyik Kleopátra Szépségszalon és
            milyen szakember tud neked a legjobban segíteni.
          </p>

          {/* VENDÉGADATOK */}
          <fieldset className="beauty-fieldset">
            <legend className="beauty-legend">Vendégadatok</legend>

            <div className="form-row form-row--two">
              <label className="field">
                <span>Teljes név*</span>
                <input type="text" name="name" required />
              </label>
              <label className="field">
                <span>E-mail cím*</span>
                <input type="email" name="email" required />
              </label>
            </div>

            <div className="form-row form-row--two">
              <label className="field">
                <span>Telefonszám</span>
                <input type="tel" name="phone" />
              </label>
              <label className="field">
                <span>Preferált szalon</span>
                <select name="location">
                  <option>Összes szalon</option>
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
            <legend className="beauty-legend">Milyen témában keresel?</legend>

            <div className="choice-pills">
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="fodraszat" />
                <span>Fodrászat</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="kozmetika" />
                <span>Kozmetika</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="kezlabapolas" />
                <span>Kéz- és lábápolás</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="szolarium" />
                <span>Szolárium</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="masszazs" />
                <span>Masszázs</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="franchise" />
                <span>Franchise</span>
              </label>
              <label className="choice-pill">
                <input type="checkbox" name="topic" value="karrier" />
                <span>Karrier</span>
              </label>
            </div>
          </fieldset>

          {/* KAPCSOLATFELVÉTEL MÓDJA */}
          <fieldset className="beauty-fieldset">
            <legend className="beauty-legend">Hogyan vegyük fel veled a kapcsolatot?</legend>

            <div className="choice-pills choice-pills--soft">
              <label className="choice-pill choice-pill--outline">
                <input
                  type="radio"
                  name="contactType"
                  value="email"
                  defaultChecked
                />
                <span>E-mailben</span>
              </label>
              <label className="choice-pill choice-pill--outline">
                <input type="radio" name="contactType" value="phone" />
                <span>Telefonon</span>
              </label>
              <label className="choice-pill choice-pill--outline">
                <input type="radio" name="contactType" value="either" />
                <span>Bármelyik megfelel</span>
              </label>
            </div>
          </fieldset>

          {/* ÜZENET */}
          <fieldset className="beauty-fieldset">
            <legend className="beauty-legend">Üzeneted</legend>

            <div className="form-row">
              <label className="field">
                <span>Üzenet / kérés*</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Írd le, miben segíthetünk – pl. időpontkérés, árajánlat, visszajelzés…"
                  required
                />
              </label>
            </div>
          </fieldset>

          <p className="form-caption">
            *Kötelező mezők. A demó verzió jelenleg nem küld valós e-mailt, az
            adatok csak bemutató jellegűek.
          </p>

          <button type="submit" className="btn btn-primary btn-primary--magenta">
            Üzenet küldése
          </button>
        </form>

        {/* OLDALSÁV / INFO */}
        <aside className="card contact-aside card--soft">
          <h2 className="card-title">Központi elérhetőség</h2>
          <p className="card-text">
            Weboldal:{" "}
            <a href="https://kleoszalon.hu" target="_blank" rel="noreferrer">
              kleoszalon.hu
            </a>
          </p>

          <p className="card-text">
            Szalonjaink pontos címét és nyitvatartását a{" "}
            <strong>Szalonjaink</strong> menüpontban találod.
          </p>

          <hr className="card-divider" />

          <p className="card-text small muted">
            Ha sürgős időponttal vagy módosítással kapcsolatban keresel, kérjük
            közvetlenül az adott szalont hívd telefonon – így tudunk a
            leggyorsabban segíteni.
          </p>
        </aside>
      </div>
    </section>
  </main>
);
