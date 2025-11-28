import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

export const HomePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <main>
      {/* HERO – KEZDŐLAP */}
            {/* HERO – KEZDŐLAP */}
      <section className="hero">
        <div className="hero-bg" />

        <div className="container hero-grid">
          {/* BAL: szöveg */}
          <div className="hero-content">
            <div className="hero-kicker">{t("home.hero.kicker")}</div>

            <h1 className="hero-title">
              <span className="hero-part hero-part-default">
                {t("home.hero.title.prefix")}
              </span>
              <span className="hero-part hero-part-magenta">
                {t("home.hero.title.highlight")}
              </span>
              <span className="hero-part hero-part-gold">
                {t("home.hero.title.suffix")}
              </span>
            </h1>

            <p className="hero-lead">{t("home.hero.lead")}</p>

            {/* PILL GOMBOK – ÁRLISTA / SZOLGÁLTATÁSOK OLDALRA MUTATNAK */}
            <div className="hero-pills">
              <NavLink to="/services#hair" className="hero-pill">
                {t("home.hero.pill.hair")}
              </NavLink>
              <NavLink to="/services#beauty" className="hero-pill">
                {t("home.hero.pill.beauty")}
              </NavLink>
              <NavLink to="/services#hands-feet" className="hero-pill">
                {t("home.hero.pill.handsFeet")}
              </NavLink>
              <NavLink to="/services#solarium" className="hero-pill">
                {t("home.hero.pill.solarium")}
              </NavLink>
              <NavLink to="/services#massage" className="hero-pill">
                {t("home.hero.pill.massage")}
              </NavLink>
            </div>

            <div className="btn-row">
              <NavLink to="/salons" className="btn btn-primary">
                {t("home.hero.cta.book")}
              </NavLink>
              <NavLink to="/services" className="btn btn-ghost">
                {t("home.hero.cta.services")}
              </NavLink>
            </div>
          </div>

          {/* JOBB: kép */}
          <div className="hero-media">
            <div className="hero-media-inner">
              <img
                src="/images/home.png"
                alt="Kleopátra Szépségszalon – szépségszolgáltatások"
                className="hero-media-img"
              />

              <div className="hero-media-overlay">
                {/* FELSŐ: WEBSHOP LINK A KÉPEN */}
                <NavLink to="/webshop" className="hero-media-webshop">
                  {t("home.hero.media.webshop")}
                </NavLink>

                {/* ALSÓ: APP LETÖLTÉS SZÖVEG A KÉPEN */}
                <div className="hero-media-chip">
                  {t("home.hero.media.appChip")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 NAGY VÍZSZINTES GOMB – FRANCHISE / APP / HÍRLEVÉL / KAPCSOLAT */}
      <section className="hero-strips">
        <div className="container hero-strips-inner">
          <NavLink
            to="/franchise"
            className="hero-strip hero-strip--primary"
          >
            SZERETNÉL EGY KLEOPÁTRA SZÉPSZALONT? FRANCHISE PROGRAM
          </NavLink>

          <NavLink to="/app" className="hero-strip">
            TÖLTSD LE MOBILODRA ALKALMAZÁSUNK
          </NavLink>

          <NavLink to="/newsletter" className="hero-strip">
            HÍRLEVÉL
          </NavLink>

          <NavLink to="/contact" className="hero-strip">
            KAPCSOLAT
          </NavLink>
        </div>
      </section>

      {/* FRANCHISE PROGRAM BLOKK */}
      <section className="section section--franchise">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">Franchise program</p>
            <h2>Építsd fel saját Kleopátra Szépségszalonod!</h2>
            <p className="section-lead">
              Csatlakozz országos hálózatunkhoz, és használd ki a több mint 30
              év tapasztalatát, kész üzleti modellünket és marketing
              támogatásunkat.
            </p>

            <ul className="bullet-list">
              <li>Országosan ismert, bejáratott márkanév</li>
              <li>Marketing és grafikai támogatás központból</li>
              <li>HR-támogatás, folyamatos képzések és oktatás</li>
              <li>Kedvezményes eszköz- és anyagbeszerzés</li>
              <li>Központi ügyfélmenedzsment és foglalási rendszer</li>
            </ul>

            <NavLink to="/franchise" className="btn btn-outline">
              Tovább a franchise programra
            </NavLink>
          </div>

          <div className="section-image-card">
            <img
              src="/images/franchise.jpg"
              alt="Kleopátra franchise szalon"
            />
          </div>
        </div>
      </section>

      {/* MOBILALKALMAZÁS BLOKK */}
      <section className="section section--app">
        <div className="container grid-two grid-two--reverse">
          <div className="section-image-card section-image-card--phone">
            <img
              src="/images/app_mockup.png"
              alt="Kleopátra mobilalkalmazás"
            />
          </div>

          <div>
            <p className="section-kicker">Mobilalkalmazás</p>
            <h2>Elindult mobil alkalmazásunk – Neked megvan már?</h2>
            <p className="section-lead">
              Foglalj időpontot pár kattintással, kövesd bérleted egységeit,
              egyenlegedet és értesülj elsőként a kedvezményekről.
            </p>

            <ul className="bullet-list">
              <li>Időpontfoglalás a hozzád legközelebbi szalonba</li>
              <li>Bérlet-egységek és szolárium egyenleg követése</li>
              <li>Akciók, kedvezmények, személyre szabott ajánlatok</li>
              <li>Push értesítések – hogy semmiről ne maradj le</li>
            </ul>

            <div className="btn-row">
              <a href="#" className="btn btn-dark">
                Telepítés iPhone-ra
              </a>
              <a href="#" className="btn btn-dark btn-dark--outline">
                Telepítés Android-ra
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AJÁNDÉKUTALVÁNY BLOKK */}
      <section className="section section--vouchers">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">Ajándékutalványok</p>
            <h2>Ajándékozz Kleopátra-élményt!</h2>
            <p className="section-lead">
              Egy szépségszalon-élmény mindig jó választás – legyen szó
              születésnapról, évfordulóról vagy meglepetésről.
            </p>
            <p>
              Válassz különböző értékű és tematikájú ajándékutalványaink közül,
              amelyek bármely Kleopátra Szépségszalonban beválthatók.
            </p>

            <NavLink to="/gift-vouchers" className="btn btn-outline">
              Tovább az ajándékutalványokra
            </NavLink>
          </div>

          <div className="section-image-card">
            <img
              src="/images/voucher.jpg"
              alt="Kleopátra ajándékutalvány"
            />
          </div>
        </div>
      </section>

      {/* HÍRLEVÉL BLOKK */}
      <section className="section section--newsletter">
        <div className="container">
          <div className="newsletter-box">
            <div>
              <p className="section-kicker">Hírlevél</p>
              <h2>
                Iratkozz fel hírlevelünkre – most{" "}
                <span className="accent">1500 Ft kedvezménnyel</span>{" "}
                ajándékozunk meg!
              </h2>
              <p className="section-lead">
                Értesülj elsőként újdonságainkról, akcióinkról, eseményeinkről,
                és gyűjts extra kedvezményeket.
              </p>
            </div>

            <div className="newsletter-actions">
              <NavLink to="/newsletter" className="btn btn-primary">
                Tovább a feliratkozáshoz
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* KLEOS TERMÉKEK / WEBSHOP TEASER */}
      <section className="section section--products">
        <div className="container grid-two">
          <div>
            <p className="section-kicker">Kleos termékek</p>
            <h2>100% Kleopátrás megjelenés – vedd magadra az élményt!</h2>
            <p className="section-lead">
              Limitált kollekciós termékeinkkel a Kleopátra-élményt a
              mindennapjaidba is magaddal viheted.
            </p>
            <p>
              Válaszd ki kedvenc darabjaid – stílusos, igényes kiegészítők és
              ajándéktárgyak várnak webshopunkban.
            </p>

            <NavLink to="/webshop" className="btn btn-outline">
              Tovább a termékekre
            </NavLink>
          </div>

          <div className="section-image-card section-image-card--products">
            <img src="/images/products.jpg" alt="Kleos termékek" />
          </div>
        </div>
      </section>

      {/* SZOLGÁLTATÁS ÖSSZEFOGLALÓ – TÉRJ BE HOZZÁNK */}
      <section className="section section--services-overview">
        <div className="container">
          <p className="section-kicker">Szolgáltatásaink</p>
          <h2>Térj be hozzánk, amikor csak akarsz!</h2>
          <p className="section-lead">
            Szalonjaink jelentős részében bejelentkezés nélkül is fogadunk.
            Találd meg a hozzád legközelebb eső Kleopátra Szépségszalont, és
            válaszd ki, milyen szolgáltatásra van szükséged.
          </p>

          <div className="grid-three">
            <NavLink to="/services#hair" className="card">
              <h3 className="card-title">Fodrászat</h3>
              <p className="card-text">
                Divatos frizurák, professzionális színtechnika és regeneráló
                hajkezelések a mindennapi szépségedért.
              </p>
              <span className="link-btn">
                Bejelentkezéshez válassz szalont!
              </span>
            </NavLink>

            <NavLink to="/services#beauty" className="card">
              <h3 className="card-title">Kozmetika</h3>
              <p className="card-text">
                Klasszikus és modern arckezelések, smink, szempilla- és
                szemöldökformázás – ragyogó bőr, friss megjelenés.
              </p>
              <span className="link-btn">Részletek</span>
            </NavLink>

            <NavLink to="/services#hands-feet" className="card">
              <h3 className="card-title">Kéz- és lábápolás</h3>
              <p className="card-text">
                Manikűr, pedikűr, géllakk, műköröm – ápolt, esztétikus körmök
                minden alkalomra.
              </p>
              <span className="link-btn">Részletek</span>
            </NavLink>

            <NavLink to="/services#solarium" className="card">
              <h3 className="card-title">Szolárium</h3>
              <p className="card-text">
                Modern gépekkel, szakértő tanácsadással segítünk elérni az
                egyenletes, napbarnított bőrt.
              </p>
              <span className="link-btn">Részletek</span>
            </NavLink>

            <NavLink to="/services#massage" className="card">
              <h3 className="card-title">Masszázs</h3>
              <p className="card-text">
                Relaxáló, gyógy- és frissítő masszázsok, amelyek segítenek
                feltöltődni és kikapcsolni.
              </p>
              <span className="link-btn">Részletek</span>
            </NavLink>

            <NavLink to="/services#fitness" className="card">
              <h3 className="card-title">Fitness / Wellness</h3>
              <p className="card-text">
                Gyöngyösi fitnesz- és wellness szolgáltatásainkkal a teljes
                testi-lelki megújulást célozzuk.
              </p>
              <span className="link-btn">Belépek</span>
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};
