import React from "react";
import { useNavigate } from "react-router-dom";

const MENU = [
  { slug: "beauty-plus", title: "BEAUTY+", img: "/kiosk/main/beauty_plus.png" },
  { slug: "vendegszamla", title: "VENDÉGSZÁMLA", img: "/kiosk/main/vendegszamla.png" },
  { slug: "ajandekutalvany", title: "AJÁNDÉKUTALVÁNYOK", img: "/kiosk/main/utalvany.png" },

  { slug: "fodraszat", title: "Fodrászat", img: "/kiosk/main/fodraszat.png" },
  { slug: "kezlab", title: "Kéz- és lábápolás", img: "/kiosk/main/kezlab.png" },
  { slug: "kozmetika", title: "Kozmetika", img: "/kiosk/main/kozmetika.png" },

  { slug: "ferfiaknak", title: "FÉRFIAKNAK", img: "/kiosk/main/ferfiaknak.png" },
  { slug: "masszazs", title: "Masszázs", img: "/kiosk/main/masszazs.png" },
  { slug: "testkezeles", title: "Testkezelés", img: "/kiosk/main/testkezeles.png" },

  { slug: "tinik", title: "Tinik és Gyerekek", img: "/kiosk/main/tinik.png" },
  { slug: "kids", title: "Gyerekeknek – Kids Project (8 éves korig)", img: "/kiosk/main/kids.png" },
];

const HERO = [
  "/kiosk/hero/salon_1.jpg",
  "/kiosk/hero/salon_2.jpg",
  "/kiosk/hero/salon_3.jpg",
];

export function KioskLanding() {
  const nav = useNavigate();
  const [hero, setHero] = React.useState(0);

  React.useEffect(() => {
    const t = window.setInterval(() => setHero((h) => (h + 1) % HERO.length), 6000);
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
              </div>
              <div className="kioskCategoryLabel">{m.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="kioskColCenter">
        <div className="kioskCenterHero">
          <img className="kioskHeroImg" src={HERO[hero]} alt="Kleopatra" />
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
