import React from "react";

export const AboutPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Rólunk</p>
        <h1>Miért válaszd a Kleopátra Szépségszalonokat?</h1>
        <p className="hero-lead hero-lead--narrow">
          Célunk, hogy a lehető legrövidebb idő alatt, a legtöbb
          szépségápolási szolgáltatást egy helyen biztosítsuk számodra,
          egységes arculattal és magas szakmai színvonallal.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-two">
        <article className="card">
          <h2 className="card-title">Minden egy helyen</h2>
          <p className="card-text">
            Fodrászat, kozmetika, kéz- és lábápolás, masszázs, szolárium – hogy
            a magabiztos megjelenéshez szükséges szolgáltatásokat egy csapat
            biztosítsa neked.
          </p>
        </article>
        <article className="card">
          <h2 className="card-title">Vendégközpontú gondolkodás</h2>
          <p className="card-text">
            Fontos számunkra az időd és az élmény, amit nálunk töltesz. Hosszú
            nyitvatartással, rugalmas bejelentkezéssel és kedves, felkészült
            kollégákkal várunk.
          </p>
        </article>
      </div>
    </section>
  </main>
);
