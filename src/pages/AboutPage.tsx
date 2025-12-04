import React from "react";

export const AboutPage: React.FC = () => {
  return (
    <main>
      {/* HERO – Rólunk */}
      <section className="page-hero page-hero--about">
        <div className="page-hero__image-wrap">
          <img
            src="/images/rolunk.jpg"
            alt="Kleopátra Szépségszalonok – Rólunk"
            className="page-hero__image"
          />
          <div className="page-hero__image-overlay page-hero__image-overlay--gradient" />
        </div>

        <div className="container page-hero__content page-hero__content--center">
          <p className="section-eyebrow">Rólunk</p>

          <h1 className="hero-title hero-title--tight">
            <span className="hero-part hero-part-default">
              Több mint egy szépségszalon hálózat
            </span>
          </h1>

          <p className="hero-lead hero-lead--narrow">
            A Kleopátra Szépségszalonok célja, hogy vendégeink a lehető
            legrövidebb idő alatt, egy helyen kapjanak meg minél több
            szépségápolási szolgáltatást – elérhető, hétköznapi luxusként,
            egységes Kleopátra-minőségben.
          </p>

          <div className="hero-pill-row hero-pill-row--soft">
            <span className="hero-pill hero-pill--outline">Fodrászat</span>
            <span className="hero-pill hero-pill--outline">Kozmetika</span>
            <span className="hero-pill hero-pill--outline">
              Kéz- és lábápolás
            </span>
            <span className="hero-pill hero-pill--outline">Szolárium</span>
            <span className="hero-pill hero-pill--outline">Masszázs</span>
          </div>
        </div>
      </section>

      {/* VÍZIÓ + KÜLDETÉS – két elegáns kártya képpel */}
      <section className="section section--soft section--about-cards">
        <div className="container grid-two">
          {/* VÍZIÓ */}
          <article className="card card--about card--about-left">
            <div className="card-media">
              <img
                src="/images/about-vision.jpg"
                alt="Vendég a Kleopátra Szépségszalonban tükör előtt"
                className="card-image-top"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">Víziónk</h2>
              <p className="card-text">
                Úgy gondoljuk, hogy az ápoltság és a magabiztos megjelenés
                alapvetően befolyásolja a mindennapi komfortérzetet,
                közérzetet és azt, hogyan tekintünk magunkra és a világra –
                akár a munkában, akár a családban, párkapcsolatban vagy
                szabadidőben.
              </p>
              <p className="card-text">
                Szeretnénk minél több embernek megmutatni, hogy a
                szépségápolás lehet a hétköznapokba beépített, elérhető
                luxus. Olyan élmény, amelyből erőt, örömet és pozitív
                visszajelzést meríthet, és amit természetes módon ad tovább
                szeretteinek, ismerőseinek.
              </p>
            </div>
          </article>

          {/* KÜLDETÉS */}
          <article className="card card--about card--about-right">
            <div className="card-media">
              <img
                src="/images/about-mission.jpg"
                alt="Kleopátra csapat közös munkában"
                className="card-image-top"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">Küldetésünk</h2>
              <p className="card-text">
                Küldetésünk, hogy vendégeink számára magabiztos
                megjelenést, feltöltődést és valódi kikapcsolódást
                teremtsünk – kortól és nemtől függetlenül, kedvező árakon.
                A szépségápolás ne kiváltság, hanem elérhető élmény legyen.
              </p>
              <p className="card-text">
                Ugyanilyen fontos számunkra munkatársaink lojalitása és
                szakmai fejlődése. Hosszú távon megbízható, értékteremtő
                munkahelyet építünk, ahol kibontakozhatnak, és ahol az
                egyéni sikeresség mögött mindig a csapatmunka energiája és
                a szeretetteljes légkör áll.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* POZITÍV VISSZAJELZÉSEK */}
      <section className="section section--soft">
        <div className="container grid-two">
          <article className="card">
            <div className="card-media">
              <img
                src="/images/about-feedback.jpg"
                alt="Elégedett vendég a Kleopátra Szépségszalonban"
                className="card-image-top"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">Pozitív visszajelzések vendégeinktől</h2>
              <p className="card-text">
                Fontos számunkra, hogy leendő vendégeink valós
                visszajelzések alapján dönthessenek. A rólunk szóló
                értékelésekben rendszeresen visszatér, hogy munkatársaink
                kedvesek, segítőkészek, mosolygósak és szakmailag
                felkészültek, a kezelések pedig valódi, érezhető eredményt
                hoznak.
              </p>
              <ul className="card-list">
                <li>
                  Gyakran emelik ki, hogy barátságos, biztonságos, jó
                  hangulatú környezet várja őket.
                </li>
                <li>
                  Vendégeink szerint kényelmes, hogy több
                  szépségszolgáltatás elérhető egy helyen – nem kell
                  különböző szalonok között ingázni.
                </li>
                <li>
                  Sok visszatérő vendég írja, hogy nálunk egyszerre kapnak
                  élményt, minőségi szakmai munkát és korrekt ár–érték
                  arányt.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* ÉRTÉKRENDÜNK */}
      <section className="section">
        <div className="container">
          <article className="card">
            <h2 className="card-title">Értékrendünk – amiben hiszünk</h2>
            <ul className="card-list">
              <li>A mosoly és a figyelmesség erejében.</li>
              <li>
                Abban, hogy minden vendég egyedi, és ezt tiszteletben
                tartjuk – nincsenek „sablonarcok”.
              </li>
              <li>
                A magabiztos megjelenés adta plusz erőben a hétköznapokban.
              </li>
              <li>
                A természetesség és a minőségi, akár luxus
                szolgáltatások egyensúlyában.
              </li>
              <li>
                A tisztességes, kétkezi szakmunka értékében, amelyre
                büszkék lehetünk.
              </li>
              <li>
                A korrekt ár–érték arányban és a stabil, kiszámítható
                minőségben.
              </li>
              <li>
                A folyamatos szakmai fejlődésben – saját tanulóink
                képzésén keresztül is.
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* TÖRTÉNETÜNK */}
      <section className="section section--soft">
        <div className="container">
          <article className="card">
            <h2 className="card-title">Történetünk röviden</h2>
            <p className="card-text">
              A Kleopátra Szépségszalonok története az 1980-as évek
              közepén indult, egy Heves megyei, egyszemélyes
              „garázskozmetikából”. Az első lépésektől kezdve az vezérelte
              a tulajdonost, hogy a vendégek igényeire adjon valódi
              választ.
            </p>
            <p className="card-text">
              Az elektrokozmetikusi munkából hamar kiderült, hogy a
              vendégeknek szükségük lenne fodrászatra, körömápolásra és
              masszázsra is – lehetőleg egy helyen. Így született meg az
              első olyan szalon, ahol a kozmetika mellett már több
              szépségápolási terület is elérhető volt, külön szolgáltatásokért
              nem kellett több helyszínre járni.
            </p>
            <p className="card-text">
              A vendégkör gyorsan növekedett, ezzel együtt az igény a jól
              képzett szakemberekre is. A cég ezért kezdett el tanulókat
              képezni – ma is büszkék vagyunk rá, hány kiváló szakember
              került ki a Kleopátra „iskolájából”, és hogy jelenlegi
              legjobb kollégáink közül is sokan itt végezték gyakorlati
              tanulmányaikat.
            </p>
            <p className="card-text">
              A folyamatosan bővülő vendégkör, az elégedett visszajelzések
              és a bizalom tették lehetővé, hogy újabb Kleopátra
              Szépségszalonokat nyissunk, és hálózattá fejlődjünk. Célunk,
              hogy továbbra is terjeszkedjünk és fejlődjünk, miközben
              minden vendégünknek elérhető áron, a lehető legmagasabb
              színvonalon biztosítjuk a hétköznapokba csempészett luxust.
            </p>
            <p className="card-text">
              Bízunk benne, hogy hamarosan Önt is törzsvendégeink között
              üdvözölhetjük – szeretettel várjuk a Kleopátra
              Szépségszalonokban!
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
