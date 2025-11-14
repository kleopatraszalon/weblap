import React from "react";

export const ContactPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Kapcsolat</p>
        <h1>Lépj velünk kapcsolatba</h1>
        <p className="hero-lead hero-lead--narrow">
          Kérdésed van franchise, karrier, hűségprogram vagy szolgáltatásaink
          kapcsán? Írj nekünk, és munkatársaink felveszik veled a kapcsolatot.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container contact-layout">
        <form className="form-card">
          <div className="form-row form-row--two">
            <label className="field">
              <span>Teljes név*</span>
              <input type="text" name="name" required />
            </label>
            <label className="field">
              <span>E-mail*</span>
              <input type="email" name="email" required />
            </label>
          </div>

          <div className="form-row form-row--two">
            <label className="field">
              <span>Tárgy*</span>
              <input type="text" name="subject" required />
            </label>
            <label className="field">
              <span>Telefonszám</span>
              <input type="tel" name="phone" />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span>Üzenet*</span>
              <textarea name="message" rows={5} required />
            </label>
          </div>

          <p className="form-caption">
            *Kötelező mezők. A demó verzió még nem küld valós e-mailt.
          </p>

          <button type="submit" className="btn btn-primary">
            Üzenet küldése
          </button>
        </form>

        <aside className="card">
          <h2 className="card-title">Központi elérhetőség</h2>
          <p className="card-text">
            Weboldal:{" "}
            <a href="https://kleoszalon.hu" target="_blank" rel="noreferrer">
              kleoszalon.hu
            </a>
          </p>
          <p className="card-text small muted">
            A szalonok elérhetőségeit a Szalonjaink oldalon találod.
          </p>
        </aside>
      </div>
    </section>
  </main>
);
