import React from "react";

export const WebshopPage: React.FC = () => (
  <main>
    <section className="webshop-hero">
      {/* Háttérkép – teljes szélességben, a header alatt */}
      <div className="webshop-hero__bg">
        <img
          src="/images/kleoshop.png"
          alt="Kleoshop – bérletek, szépség- és ajándékutalványok"
        />
      </div>

      {/* Tartalomréteg a kép FELETT */}
      <div className="container webshop-hero__content">
        {/* Magenta körök – overlay */}
        <div className="webshop-hero__bubbles">
          <div className="webshop-hero__bubble webshop-hero__bubble--top">
            <img
              src="/images/ajandekutalvany.png"
              alt="Ajándékutalványok"
            />
          </div>

          <div className="webshop-hero__bubble webshop-hero__bubble--middle">
            <img
              src="/images/szepsegcsomagok.png"
              alt="Szépségcsomagok"
            />
          </div>

          <div className="webshop-hero__bubble webshop-hero__bubble--bottom">
            <img src="/images/berlet.png" alt="Bérletek" />
          </div>
        </div>

        {/* Jobb oldali szöveg + gombok + vendégszámla */}
        <div className="webshop-hero__text">
          <p className="section-eyebrow">
            KLEOPÁTRA SZÉPSÉGSZALONOK · ONLINE WEBSHOP
          </p>

          <h1 className="hero-title hero-title--tight">
            Bérletek, szépségutalványok,{" "}
            <span className="hero-part hero-part-magenta">
              ajándékutalványok
            </span>
          </h1>

          <p className="hero-lead hero-lead--narrow">
            Kedvenc Kleopátra termékeidet, bérleteidet és
            ajándékutalványaidat kényelmesen, online is megvásárolhatod –
            biztonságos fizetéssel, visszaigazoló vendégszámlával.
          </p>

          <div className="webshop-hero__buttons">
            <a
              className="btn btn-primary btn-primary--magenta btn--shine"
              href="https://www.kleoshop.hu"
              target="_blank"
              rel="noreferrer"
            >
              SHOP NOW
            </a>

            <a
              className="btn btn-secondary btn-secondary--ghost btn--shine"
              href="https://www.kleoshop.hu/ajandekutalvanyok"
              target="_blank"
              rel="noreferrer"
            >
              Ajándékutalványok
            </a>
          </div>

          <div className="webshop-invoice">
            <div className="webshop-invoice__image">
              <img
                src="/images/vendegszamla.png"
                alt="Vendégszámla minta"
              />
            </div>
            <div className="webshop-invoice__text">
              <p className="small">
                Minden online vásárlás után azonnali visszaigazoló vendégszámlát
                küldünk e-mailben – így könnyen nyomon követheted a
                Kleopátra-élményeidet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);
