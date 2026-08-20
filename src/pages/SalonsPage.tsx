import React from "react";
import { Link, NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

type PublicSalon = { id: string; slug: string; city_label: string; address: string; image: string; mapQuery: string };
const STATIC_SALONS: PublicSalon[] = [
  { id: "budapest-ix", slug: "budapest-ix", city_label: "Budapest IX.", address: "Mester u. 1.", image: "/images/mester.jpg", mapQuery: "Kleopatra Szepsegszalon Mester utca Budapest" },
  { id: "budapest-viii", slug: "budapest-viii", city_label: "Budapest VIII.", address: "Rákóczi u. 63.", image: "/images/rakoczi.jpg", mapQuery: "Kleopatra Szepsegszalon Rakoczi ut Budapest" },
  { id: "budapest-xii", slug: "budapest-xii", city_label: "Budapest XII.", address: "Krisztina krt. 23.", image: "/images/krisztina.jpg", mapQuery: "Kleopatra Szepsegszalon Krisztina korut Budapest" },
  { id: "budapest-xiii", slug: "budapest-xiii", city_label: "Budapest XIII.", address: "Visegrádi u. 3.", image: "/images/visegradi.jpg", mapQuery: "Kleopatra Szepsegszalon Visegradi utca Budapest" },
  { id: "eger", slug: "eger", city_label: "Eger", address: "Dr. Nagy János u. 8.", image: "/images/Eger.jpg", mapQuery: "Kleopatra Szepsegszalon Eger Dr Nagy Janos utca" },
  { id: "gyongyos", slug: "gyongyos", city_label: "Gyöngyös", address: "Koháry u. 29.", image: "/images/gyongyos.png", mapQuery: "Kleopatra Szepsegszalon Gyongyos Kohary utca" },
  { id: "salgotarjan", slug: "salgotarjan", city_label: "Salgótarján", address: "Füleki u. 44.", image: "/images/salgotarjan.jpg", mapQuery: "Kleopatra Szepsegszalon Salgotarjan Fuleki ut" },
];

const CSS = `
.salon-directory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.salon-directory-card{display:block;overflow:hidden;border:1px solid #eadfd5;border-radius:20px;background:#fff;color:inherit;text-decoration:none;box-shadow:0 14px 38px rgba(25,15,10,.07);transition:.2s}
.salon-directory-card:hover{transform:translateY(-3px);box-shadow:0 20px 46px rgba(25,15,10,.12)}
.salon-directory-card img{width:100%;height:210px;object-fit:cover;display:block}.salon-directory-card__body{padding:18px}.salon-directory-card__body small{color:#b69861;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.salon-directory-card__body h3{margin:6px 0 5px;font-size:22px}.salon-directory-card__body p{margin:0 0 12px;color:#746b64}.salon-directory-card__actions{display:flex;gap:8px;flex-wrap:wrap}.salon-directory-card__actions span{font-size:12px;font-weight:800}
.salon-map-shell{overflow:hidden;border:1px solid #e4d9cf;border-radius:22px;background:#fff;box-shadow:0 16px 45px rgba(25,15,10,.07)}.salon-map-shell iframe{display:block;width:100%;height:520px;border:0}.salon-map-links{display:flex;gap:8px;flex-wrap:wrap;padding:16px}.salon-map-links a{padding:9px 12px;border:1px solid #e7ddd4;border-radius:999px;color:#241914;text-decoration:none;font-size:11px;font-weight:750;background:#fff}.salon-map-links a:hover{border-color:#ec008c;color:#ec008c}
@media(max-width:900px){.salon-directory-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.salon-directory-grid{grid-template-columns:1fr}.salon-map-shell iframe{height:420px}}
`;

export const SalonsPage: React.FC = () => {
  const { pages } = useWebsiteCms();
  const p = pages.salons;
  return <main><style>{CSS}</style>
    <PublicPageHero eyebrow={p.eyebrow} title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>} lead={<p>{p.lead}</p>} image={p.imageUrl} imageAlt="Kleopátra Szépségszalonok" actions={<><NavLink to="/booking" className="btn btn-primary">Online időpontfoglalás</NavLink><NavLink to="/prices" className="btn btn-outline">Áraink</NavLink></>} />

    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Szalonkereső</p><h2>Válassz képek és helyszín alapján</h2><p>A szalonkártyán keresztül az adott hely részletes oldalára jutsz, ahol megtalálod az elérhetőségeket, szolgáltatásokat és a foglalási lehetőséget.</p></header>
      <div className="salon-directory-grid">{STATIC_SALONS.map(s => <Link key={s.id} to={`/salons/${s.slug}`} className="salon-directory-card"><img loading="lazy" src={s.image} alt={`Kleopátra Szépségszalon – ${s.city_label}`} /><div className="salon-directory-card__body"><small>Kleopátra Szépségszalon</small><h3>{s.city_label}</h3><p>{s.address}</p><div className="salon-directory-card__actions"><span>Szalon részletei →</span><span>Foglalás · árak · nyitvatartás</span></div></div></Link>)}</div>
    </div></section>

    <section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Térképes keresés</p><h2>Találd meg a hozzád legközelebbi szalont</h2><p>A térképen földrajzi helyzet alapján is áttekintheted a Kleopátra szalonokat. Az alatta lévő helyszíngombok közvetlenül megnyitják az adott szalont a térképen.</p></header>
      <div className="salon-map-shell"><iframe title="Kleopátra szalonok térképe" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Kleop%C3%A1tra%20Sz%C3%A9ps%C3%A9gszalonok%20Hungary&output=embed" /><div className="salon-map-links">{STATIC_SALONS.map(s => <a key={s.id} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery)}`} target="_blank" rel="noreferrer">{s.city_label} · {s.address}</a>)}</div></div>
    </div></section>

    <section className="public-section"><div className="container public-cta"><div><h2>Megvan a szalon?</h2><p>A Booking 4.0-ban szalon, szolgáltatás, időpont vagy szakember alapján is elindíthatod a foglalást.</p></div><NavLink to="/booking" className="btn btn-primary">Foglalok</NavLink></div></section>
  </main>;
};
