import React from "react";
import "../styles/kleo_theme.css";

import step1Img from "../assets/franchise/step1.png";
import step2Img from "../assets/franchise/step2.png";
import team1Img from "../assets/franchise/team1.jpeg";
import team2Img from "../assets/franchise/team2.jpeg";
import interview1Img from "../assets/franchise/interview1.jpg";
import interview2Img from "../assets/franchise/interview2.jpg";
import rebekaImg from "../assets/franchise/rebeka.jpg";

export const FranchisePage: React.FC = () => {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid" style={{ alignItems: "center" }}>
            <div>
              <div className="hero-kicker">Kleopátra Szépségszalonok</div>
              <h1 className="hero-lead" style={{ marginTop: 8, marginBottom: 12 }}>
                franchisefranchise program
              </h1>
              <p className="card-text" style={{ maxWidth: 720, fontSize: 18 }}>
                Rugalmasság, Komplexitás, Vendégközpontúság
              </p>
              <p className="card-text" style={{ maxWidth: 720, marginTop: 12 }}>
                Szeretnél egy saját szépségszalont, ami vonzza az ügyfeleket? Csatlakozz Kleopátra
                Szépségszalon Franchise hálózatunkhoz, és valósítsd meg álmaidat!
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
                <a className="btn btn--primary" href="https://docs.google.com" target="_blank" rel="noreferrer">
                  Jelentkezés
                </a>
                <a className="btn btn--ghost" href="https://www.kleoszalon.hu" target="_blank" rel="noreferrer">
                  www.kleoszalon.hu
                </a>
              </div>
            </div>

            <div className="hero-media" aria-hidden="true">
              <div className="card card--soft" style={{ padding: 18 }}>
                <p className="card-title" style={{ marginBottom: 8 }}>Kiknek szól?</p>
                <p className="card-text" style={{ margin: 0 }}>
                  Olyan partnereket keresünk, akik biztos háttérrel, felépített rendszerben dolgoznának a szépségiparban
                  – akár a pálya elején, akár tapasztalt szalontulajdonosként.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFEKTETÉS */}
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Mekkora befektetés szükséges?</h2>
              <div className="card-subtitle">A megtérülés várható időtartama: 2–3 év.</div>
            </div>

            <div className="card-body">
              <div className="grid-2" style={{ gap: 18 }}>
                <div>
                  <h3 style={{ marginTop: 0 }}>Belépési díj</h3>
                  <p className="card-text" style={{ fontSize: 18, marginTop: 6 }}>
                    <strong>5.000.000 Ft + ÁFA</strong>
                  </p>
                  <ul className="list">
                    <li>A Kleopátra márkanév és arculat használati joga</li>
                    <li>Arculati és Működési könyv használati joga</li>
                    <li>Egyszeri csatlakozási díj</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ marginTop: 0 }}>Induló beruházás</h3>
                  <p className="card-text" style={{ fontSize: 18, marginTop: 6 }}>
                    <strong>kb. 15.000.000 Ft + ÁFA</strong> (üzlet méretétől és állapotától függően)
                  </p>
                  <ul className="list">
                    <li>Szalon kialakítása és berendezése</li>
                    <li>Működéshez szükséges gépek, eszközök</li>
                    <li>Induló termékkészlet</li>
                    <li>Marketing kampány a nyitási időszakra</li>
                    <li>Kollégák toborzása és beintegrálása</li>
                    <li>Teljeskörű betanítás (üzemeltetés, értékesítés, ügyfélkezelés)</li>
                    <li>Engedélyeztetés, nyitási költségek</li>
                  </ul>
                  <p className="card-text" style={{ marginTop: 12 }}>
                    <strong>Royalty díj: 10%</strong>
                  </p>
                </div>
              </div>

              <div className="card-divider" />

              <div className="grid-2" style={{ gap: 18 }}>
                <div>
                  <h3 style={{ marginTop: 0 }}>Amit folyamatosan biztosítunk</h3>
                  <ul className="list">
                    <li>Központi marketing támogatás</li>
                    <li>HR támogatás</li>
                    <li>Szakmai képzések, szakmai támogatás</li>
                    <li>Kedvezményes eszköz- és anyagvásárlás</li>
                    <li>Folyamatos termék- és szolgáltatásfejlesztések</li>
                  </ul>
                </div>
                <div className="card card--soft" style={{ margin: 0 }}>
                  <div className="card-body">
                    <h3 style={{ marginTop: 0 }}>Küldetésünk</h3>
                    <p className="card-text">
                      Vendégeink jól érezzék magukat a bőrükben, és magabiztos megjelenésüknek köszönhetően minden napjuk
                      örömmel és sikerekkel teli legyen. Ennek a küldetésnek Te is a részese lehetsz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LÉPÉSEK */}
      <section className="section">
        <div className="container">
          <h2 style={{ marginTop: 0 }}>Velünk garantált sikerekben lehet részed</h2>

          <div className="grid-3" style={{ gap: 18 }}>
            <div className="card card--soft">
              <img src={step1Img} alt="" style={{ width: "100%", borderRadius: 16 }} />
              <div className="card-body">
                <h3 className="card-title">Elindulunk a nulláról</h3>
                <ul className="list">
                  <li>több mint 20 év szakmai tapasztalat</li>
                  <li>Bevezetett márka</li>
                  <li>Egységes arculat</li>
                  <li>Biztos lokáció, hosszútávú szerződéskötés</li>
                  <li>Folyamatos szakmai fejlődés</li>
                </ul>
              </div>
            </div>

            <div className="card card--soft">
              <img src={step2Img} alt="" style={{ width: "100%", borderRadius: 16 }} />
              <div className="card-body">
                <h3 className="card-title">Első vendégek megszerzése</h3>
                <ul className="list">
                  <li>Bejáratott, jól működő üzleti stratégia</li>
                  <li>Eszközök és berendezések hatékony beszerzése, kialakítása</li>
                  <li>Szalonra kidolgozott egyedi marketing stratégia már az első időszakban</li>
                  <li>Profitorientált működés, már az első hónaptól kezdve</li>
                </ul>
              </div>
            </div>

            <div className="card card--soft">
              <img src={team1Img} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 220 }} />
              <div className="card-body">
                <h3 className="card-title">Felgyorsítjuk a növekedést</h3>
                <ul className="list">
                  <li>Számítógépes ügyfélkezelő szoftver</li>
                  <li>Kedvezményes alapanyagbeszerzés</li>
                  <li>Szakmai támogatás, oktatások</li>
                  <li>Marketing anyagok, képzés, tanácsadás</li>
                  <li>Folyamatos vezetőképzés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÚJRAINDULÁS */}
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Akik már működő szalont visznek, de szeretnék újra sikeressé tenni</h2>
              <div className="card-subtitle">
                Marketing, HR, adminisztráció, beszerzés, árverseny, munkaerőhiány… Ismerős helyzet?
              </div>
            </div>

            <div className="card-body">
              <ul className="list">
                <li>Csökkent a vendégforgalom, hiába hirdetsz.</li>
                <li>Nehéz jó szakembert találni vagy megtartani.</li>
                <li>Sok a kiadás, kevés a profit.</li>
                <li>Az adminisztráció viszi az időt, nem a vendégek.</li>
                <li>A szalon arculata már nem versenyképes.</li>
              </ul>

              <div className="card-divider" />

              <h3 style={{ marginTop: 0 }}>Mit kapsz a Kleopátra franchise tagjaként?</h3>
              <div className="grid-2" style={{ gap: 18 }}>
                <ul className="list">
                  <li>Központi marketingtámogatást – kész kampányokat, amelyek vendégeket hoznak.</li>
                  <li>HR és adminisztrációs segítséget – hogy ne a papírmunka vigye el az energiádat.</li>
                  <li>Szakmai képzéseket és támogatást – mindig naprakész tudással.</li>
                  <li>Kedvezményes anyag- és eszközbeszerzést – központi, előnyös feltételekkel.</li>
                  <li>Egységes, prémium arculatot – ami azonnal bizalmat kelt a vendégeidben.</li>
                </ul>
                <div className="card card--soft" style={{ margin: 0 }}>
                  <div className="card-body">
                    <p className="card-text" style={{ marginTop: 0 }}>
                      Nem csupán egy névhez csatlakozol – hanem egy bevált működési rendszerhez, amely bizonyítottan
                      nyereségessé teszi a szalonokat. Mi már felépítettük a működő rendszert – neked csak csatlakoznod kell hozzá.
                    </p>
                    <p className="card-text">
                      Ha már meglévő üzlettel rendelkezel, kedvezményes belépési feltételeket biztosítunk, és segítünk az arculati,
                      illetve működési átalakításban is.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
                <a className="btn btn--primary" href="https://docs.google.com" target="_blank" rel="noreferrer">
                  Jelentkezés
                </a>
                <a className="btn btn--ghost" href="tel:+36306301506">+36 30 630 1506</a>
                <a className="btn btn--ghost" href="mailto:info@kleopatraszepsegszalonok.hu">info@kleopatraszepsegszalonok.hu</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOL VAGYUNK */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 18, alignItems: "stretch" }}>
            <div className="card card--soft">
              <div className="card-body">
                <h2 className="card-title">Segítünk, ahol tudunk</h2>
                <p className="card-text">
                  Az új vendégek szerzésétől kezdve a szoftverek technikai beállításában is segítünk. A legtöbb feladatot segítünk
                  automatizálni és működő megoldásokat mutatunk a vendégek nyomon követésére, megszerzésére és megtartására.
                </p>
                <p className="card-text">
                  A Kleopátra Szépségszalonok egész Magyarország területén növekedni szeretne és ehhez leendő partnereinket keressük.
                </p>
                <p className="card-text" style={{ marginBottom: 0 }}>
                  Eddig az alábbi városokban vagyunk jelen: <strong>Budapest, Eger, Salgótarján, Gyöngyös</strong>.
                </p>
              </div>
            </div>

            <div className="card card--soft">
              <img src={team2Img} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 340 }} />
              <div className="card-body">
                <h3 className="card-title">Jelenleg partnereket keresünk</h3>
                <p className="card-text" style={{ marginBottom: 0 }}>
                  Budapest • Győr • Pécs • Székesfehérvár • Tatabánya • Nyíregyháza • Debrecen • Miskolc • Szeged • Veszprém • Kecskemét
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SZEMÉLYES ÜZENET */}
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Személyes üzenet</h2>
            </div>
            <div className="card-body">
              <div className="grid-2" style={{ gap: 18, alignItems: "center" }}>
                <div>
                  <p className="card-text" style={{ fontSize: 18 }}>
                    „Franchise partner programunk kialakításában arra törekedtünk, hogy létrehozzunk egy olyan működő rendszert,
                    ami szilárd alapokat biztosít az elinduláshoz, majd a skálázáshoz. Ha egy biztos lábakon álló vállalkozást keresel,
                    valamint részese akarsz lenni egy már több városban működő bizonyítottan sikeres üzleti koncepciónak, legyél Te is
                    franchise partnerünk és ezzel egy nagyszerű csapat sikeres tagja.”
                  </p>
                  <h3 style={{ marginBottom: 0 }}>Horváth Rebeka Bianka</h3>
                </div>
                <div>
                  <img src={rebekaImg} alt="Horváth Rebeka Bianka" style={{ width: "100%", borderRadius: 18, objectFit: "cover" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERJÚ */}
      <section className="section">
        <div className="container">
          <div className="card card--soft">
            <div className="card-body">
              <h2 className="card-title">Célok nélkül nincs siker!</h2>
              <p className="card-text">
                A szépség és az abból fakadó magabiztos megjelenés fontos szerepet tölt be az életünkben. Gondolhatunk itt a munkahelyre,
                a párkapcsolatra, a családra. A szépségápolás a hétköznapokban is mindannyiunk számára fontos.
              </p>
              <p className="card-text">
                Ezt vallja Horváth Rebeka Bianka a Kleopátra Szépségszalonok vezetője, aki a 20 éve indult családi vállalkozást vezeti immár
                két éve, mely mára számos szalonnal rendelkezik országszerte.
              </p>
              <p className="card-text" style={{ marginBottom: 0 }}>
                A SIKERES NŐK magazin teljes interjúja elérhető a hivatalos cikkben.
              </p>

              <div className="grid-2" style={{ gap: 18, marginTop: 18 }}>
                <img src={interview1Img} alt="" style={{ width: "100%", borderRadius: 18 }} />
                <img src={interview2Img} alt="" style={{ width: "100%", borderRadius: 18 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KAPCSOLAT */}
      <section className="section" style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Kérdésed van? Írj nekünk!</h2>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn btn--primary" href="tel:+36306301506">+36 30 630 1506</a>
                <a className="btn btn--ghost" href="mailto:info@kleopatraszepsegszalonok.hu">info@kleopatraszepsegszalonok.hu</a>
                <a className="btn btn--ghost" href="https://docs.google.com" target="_blank" rel="noreferrer">Jelentkezés</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
