import React from "react";

export const LoyaltyPage: React.FC = () => (
  <main>
    <section className="page-hero">
      <div className="container">
        <p className="section-eyebrow">Hűségprogram</p>
        <h1>Extra kedvezmények regisztrált vendégeinknek</h1>
        <p className="hero-lead hero-lead--narrow">
          Hűségprogramunkban pontgyűjtés, kuponok és személyre szabott ajánlatok
          várnak, hogy minden alkalommal egy kicsit többet kapj a
          szépségápolásból.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-two">
        <article className="card">
          <h2 className="card-title">Pontgyűjtés</h2>
          <p className="card-text">
            Minden igénybe vett szolgáltatás után pontokat írunk jóvá,
            amelyeket később kedvezményekre válthatsz be a kijelölt
            szolgáltatásoknál.
          </p>
        </article>
        <article className="card">
          <h2 className="card-title">Szolgáltatások kedvezménnyel</h2>
          <p className="card-text">
            A hűségprogram szintjeihez és akcióihoz igazodva időszakos
            ajánlatokat, extra szolgáltatásokat és ajándékokat biztosítunk.
          </p>
        </article>
      </div>
    </section>
  </main>
);
