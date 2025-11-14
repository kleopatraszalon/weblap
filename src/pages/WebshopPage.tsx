import React from "react";

export const WebshopPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Webshop</p>
        <h1>Kleos termékek és ajándékutalványok</h1>
        <p className="hero-lead hero-lead--narrow">
          Kleos termékeinket, ajándékutalványainkat és bérleteinket webshopunkon
          keresztül érheted el. A megrendelt termékeket a hozzád legközelebbi
          szalonban is átveheted.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <article className="card">
          <h2 className="card-title">Tovább a webshopra</h2>
          <p className="card-text">
            A Kleos termékek, ajándékutalványok és bérletek online
            vásárlásához lépj át webshopunkra.
          </p>
          <a
            className="btn btn-primary"
            href="https://www.kleoshop.hu"
            target="_blank"
            rel="noreferrer"
          >
            Megnyitom a kleoshop.hu oldalt
          </a>
        </article>
      </div>
    </section>
  </main>
);
