import React from "react";

export const FranchisePage: React.FC = () => (
  <main>
    <section className="page-hero page-hero--franchise">
      <div className="page-hero__image-wrap">
        <img
          src="/images/franchise.jpg"
          alt="Kleopátra Szépségszalon – franchise lehetőség"
          className="page-hero__image"
        />
        <div className="page-hero__image-overlay" />
      </div>
      <div className="container page-hero__content page-hero__content--center">
        <p className="section-eyebrow">Franchise</p>
        <h1>Szeretnél Kleopátra Szépségszalont?</h1>
        <p className="hero-lead hero-lead--narrow">
          Franchise programunkban kész arculattal, üzemeltetési know-how-val
          és marketingtámogatással segítünk, hogy sikeres szépségszalont
          építhess.
        </p>
      </div>
    </section>

    <section className="section">
      <div className="container grid-three">
        <article className="card">
          <h2 className="card-title">Márka és arculat</h2>
          <p className="card-text">
            Egységes vizuális világ, arculati kézikönyv és belsőépítészeti
            ajánlások, hogy a vendég minden szalonban azonnal felismerje a
            Kleopátra élményt.
          </p>
        </article>
        <article className="card">
          <h2 className="card-title">Üzemeltetési támogatás</h2>
          <p className="card-text">
            Folyamatos szakmai és vezetői képzések, HR támogatás, rendszeres
            konzultációk és központi ügyfélmenedzsment.
          </p>
        </article>
        <article className="card">
          <h2 className="card-title">Marketing &amp; kampányok</h2>
          <p className="card-text">
            Központi kampányok, digitális anyagok, hirdetési sablonok,
            amelyekre helyben is tudsz támaszkodni a vendégszerzésben.
          </p>
        </article>
      </div>
    </section>
  </main>
);
