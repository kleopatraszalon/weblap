import React from "react";

export const ServicesPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Szolgáltatások</p>
        <h1>Szolgáltatásaink egy helyen</h1>
        <p className="hero-lead hero-lead--narrow">
          Fodrászattól a modern kozmetikai kezeléseken át a kéz- és lábápolásig,
          masszázsig és szoláriumig mindent egy helyen találsz.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-three">
        <article className="card">
          <h2 className="card-title">Fodrászat</h2>
          <p className="card-text">
            Női, férfi és gyermek hajvágás, festés, balayage, frissítő vágás
            és alkalmi frizurák – személyre szabott tanácsadással.
          </p>
          <a className="link-btn" href="/prices">
            Fodrász árlista
          </a>
        </article>
        <article className="card">
          <h2 className="card-title">Kozmetika</h2>
          <p className="card-text">
            Klasszikus arckezelések, modern gépi megoldások és relaxáló
            kezelések, a bőröd igényeire szabva.
          </p>
          <a className="link-btn" href="/prices">
            Kozmetikai árlista
          </a>
        </article>
        <article className="card">
          <h2 className="card-title">Kéz- és lábápolás</h2>
          <p className="card-text">
            Manikűr, gél lakk, műköröm, pedikűr – az ápolt, esztétikus kéz és
            láb érdekében.
          </p>
          <a className="link-btn" href="/prices">
            Árak megtekintése
          </a>
        </article>
      </div>
    </section>
  </main>
);
