import React from "react";
import { useNavigate } from "react-router-dom";

// NOTE: These images are served from `weblap/public/kiosk/tiles/*.png`
// (we include them in the ZIP below so it works out-of-the-box).
const MENU = [
  { slug: "beauty-plus", title: "BEAUTY+", img: "/kiosk/tiles/beauty_plus.png" },
  { slug: "vendegszamla", title: "VENDÉGSZÁMLA", img: "/kiosk/tiles/vendegszamla.png" },
  { slug: "ajandekutalvany", title: "AJÁNDÉKUTALVÁNYOK", img: "/kiosk/tiles/ajandekutalvanyok.png" },

  { slug: "fodraszat", title: "Fodrászat", img: "/kiosk/tiles/fodraszat.png" },
  { slug: "kezlab", title: "Kéz- és lábápolás", img: "/kiosk/tiles/kez_es_labapolas.png" },
  { slug: "kozmetika", title: "Kozmetika", img: "/kiosk/tiles/kozmetika.png" },

  { slug: "ferfiaknak", title: "FÉRFIAKNAK", img: "/kiosk/tiles/ferfiaknak.png" },
  { slug: "masszazs", title: "Masszázs", img: "/kiosk/tiles/masszazs.png" },
  { slug: "testkezeles", title: "Testkezelés", img: "/kiosk/tiles/testkezeles.png" },

  { slug: "tinik", title: "Tinik és Gyerekek", img: "/kiosk/tiles/tinik_es_gyerekek.png" },
  { slug: "kids", title: "Gyerekeknek – Kids Project (8 éves korig)", img: "/kiosk/tiles/gyerekeknek_kids_project.png" },
  { slug: "wellness-fitness", title: "Wellness / Fitness / Szolárium", img: "/kiosk/tiles/wellness_fitness_szolarium.png" },
];

// A "Szolgáltatások" blokkban most a kategória-csempék váltakoznak.
// (A szalon fotókat később ide/egy külön sliderbe vissza tudjuk tenni.)
const SERVICE_SLIDES = MENU.map((m) => m.img);

export function KioskLanding() {
  const nav = useNavigate();
  const [slide, setSlide] = React.useState(0);

  React.useEffect(() => {
    const t = window.setInterval(() => setSlide((i) => (i + 1) % SERVICE_SLIDES.length), 3500);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="kioskGrid">
      <div className="kioskColLeft">
        <div className="kioskPanelTitle">Kategóriák</div>
        <div className="kioskCategoryStack">
          {MENU.map((m) => (
            <button
              key={m.slug}
              className="kioskCategoryTile"
              onClick={() => nav(`/kiosk/cat/${m.slug}`)}
            >
              <div className="kioskCategoryImgWrap">
                <img src={m.img} alt={m.title} className="kioskCategoryImg" />
                <div className="kioskCategoryLabel">{m.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="kioskColCenter">
        <div className="kioskCenterHero">
          <img className="kioskHeroImg" src={SERVICE_SLIDES[slide]} alt="Kategóriák" />
          <div className="kioskHeroCaption">Szolgáltatások</div>
          <div className="kioskHeroSub">Válassz kategóriát.</div>
        </div>

        <div className="kioskEmbedCard">
          <div className="kioskEmbedHeader">
            <div className="kioskEmbedTitle">Weboldal</div>
            <div className="kioskBadge">WEBSHOP</div>
          </div>
          <iframe
            title="kleoszalon"
            src="https://kleoszalon.hu"
            className="kioskEmbed"
          />
        </div>

        <div className="kioskRow">
          <div className="kioskSlideCard">
            <div className="kioskSlideTitle">Büfé ajánlataink</div>
            <div className="kioskSlideSub">Fogyassz várakozás közben – egy kattintás a kosárba.</div>
            <div className="kioskSlideRail">
              <div className="kioskSlideItem">
                <img src="/kiosk/buffet/shake.jpg" alt="Protein shake" />
                <div>
                  <div className="kioskSlideItemName">Protein shake</div>
                  <div className="kioskSlideItemDesc">Scitec/Biotech – gyors energia.</div>
                </div>
              </div>
              <div className="kioskSlideItem">
                <img src="/kiosk/buffet/coffee.jpg" alt="Kávé" />
                <div>
                  <div className="kioskSlideItemName">Kávé</div>
                  <div className="kioskSlideItemDesc">Friss espresso / latte.</div>
                </div>
              </div>
              <div className="kioskSlideItem">
                <img src="/kiosk/buffet/water.jpg" alt="Víz" />
                <div>
                  <div className="kioskSlideItemName">Ásványvíz</div>
                  <div className="kioskSlideItemDesc">Citromos / mentes.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="kioskSlideCard">
            <div className="kioskSlideTitle">Heti akciók</div>
            <div className="kioskWeeklyBox">
              <div className="kioskWeeklyTitle">Valentin napi ajánlataink</div>
              <div className="kioskWeeklyText">Február 14-ig – kérdezd a recepciót a részletekért.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="kioskColRight">
        <div className="kioskCartCard">
          <div className="kioskCartTitle">Kosár</div>
          <div className="kioskCartSub">Válassz szolgáltatást.</div>
          <button className="kioskPayBtn" onClick={() => nav("/kiosk/pay")}>Tovább a fizetéshez</button>
        </div>

        <div className="kioskStaffCard">
          <div className="kioskStaffTitle">Elérhető szakembereink</div>
          <div className="kioskStaffList">
            {[
              { n: "Szöke Noémi", r: "Fodrász", img: "/kiosk/staff/1.jpg" },
              { n: "Viktor Renátó", r: "Gyógymasszőr", img: "/kiosk/staff/2.jpg" },
              { n: "Besenyei Szilvia", r: "TOP Gyógymasszőr", img: "/kiosk/staff/3.jpg" },
            ].map((p) => (
              <div key={p.n} className="kioskStaffRow">
                <img src={p.img} alt={p.n} className="kioskStaffImg" />
                <div>
                  <div className="kioskStaffName">{p.n}</div>
                  <div className="kioskStaffRole">{p.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="kioskShopCard">
          <img className="kioskShopImg" src="/kiosk/shop/gift.jpg" alt="Webshop" />
          <div className="kioskShopTitle">Szépségcsomag Egyedi</div>
          <div className="kioskShopText">Ajándékutalvány – állítsd össze a csomagot saját igény szerint.</div>
          <div className="kioskShopPrice">39 640 Ft</div>
        </div>
      </div>
    </div>
  );
}
