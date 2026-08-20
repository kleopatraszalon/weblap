import React, { useEffect, useMemo, useState } from "react";
import { useParams, NavLink, Navigate } from "react-router-dom";
import { getPublicSalons, PublicSalon } from "../apiClient";
import PublicPageHero from "../components/PublicPageHero";

const SALON_IMAGES: Record<string, string> = {
  "budapest-ix": "/images/mester.jpg",
  "budapest-viii": "/images/rakoczi.jpg",
  "budapest-xii": "/images/krisztina.jpg",
  "budapest-xiii": "/images/visegradi.jpg",
  eger: "/images/Eger.jpg",
  gyongyos: "/images/gyongyos.png",
  salgotarjan: "/images/salgotarjan.jpg",
};

const CSS=`
.salon-detail-info{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.salon-detail-info .feature-card{height:100%}.salon-detail-info a{color:#ec008c;font-weight:800;text-decoration:none}.salon-detail-map{overflow:hidden;border:1px solid #e4d9cf;border-radius:22px;background:#fff;box-shadow:0 16px 45px rgba(25,15,10,.07)}.salon-detail-map iframe{display:block;width:100%;height:430px;border:0}.salon-detail-map__actions{display:flex;gap:10px;flex-wrap:wrap;padding:16px}.salon-detail-map__actions a{display:inline-flex;align-items:center;min-height:42px;padding:0 14px;border:1px solid #e7ddd4;border-radius:999px;color:#241914;text-decoration:none;font-size:11px;font-weight:800}.salon-detail-map__actions a:hover{border-color:#ec008c;color:#ec008c}@media(max-width:920px){.salon-detail-info{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:580px){.salon-detail-info{grid-template-columns:1fr}.salon-detail-map iframe{height:360px}}
`;

export const SalonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [salons, setSalons] = useState<PublicSalon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSalons().then(setSalons).catch((err) => {
      console.error(err);
      setError("Nem sikerült betölteni a szalonokat.");
    });
  }, []);

  const salon = useMemo(() => salons?.find((s) => s.slug === id || String(s.id) === id), [salons, id]);

  useEffect(()=>{
    if(!salon)return;
    const previousTitle=document.title;
    const existingDescription=document.head.querySelector('meta[name="description"]') as HTMLMetaElement|null;
    const created=!existingDescription; const meta=existingDescription||document.createElement("meta"); const previousDescription=meta.content||"";
    if(created){meta.name="description";document.head.appendChild(meta)}
    const existingCanonical=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;
    const canonicalCreated=!existingCanonical; const canonical=existingCanonical||document.createElement("link"); const previousCanonical=canonical.href||"";
    if(canonicalCreated){canonical.rel="canonical";document.head.appendChild(canonical)}
    document.title=`Kleopátra Szépségszalon ${salon.city_label} | Árak és időpontfoglalás`;
    meta.content=`Kleopátra Szépségszalon ${salon.city_label}: ${salon.address||"cím"}, nyitvatartás, elérhetőség, szolgáltatások, árak és online időpontfoglalás.`;
    canonical.href=`https://www.kleoszalon.hu/szalonok/${salon.slug}`;
    return()=>{document.title=previousTitle;if(created)meta.remove();else meta.content=previousDescription;if(canonicalCreated)canonical.remove();else canonical.href=previousCanonical};
  },[salon]);

  if (error) return <main className="public-section"><div className="container"><div className="notice-card">{error}</div></div></main>;
  if (!salons) return <main className="public-section"><div className="container"><div className="notice-card">Szalon adatainak betöltése…</div></div></main>;
  if (!salon) return <Navigate to="/salons" replace />;

  const image = SALON_IMAGES[salon.slug] || "/images/szalonok.jpg";
  const mapQuery=encodeURIComponent(salon.address||`${salon.city_label} Kleopátra Szépségszalon`);
  const mapEmbed=salon.latitude!=null&&salon.longitude!=null
    ? `https://www.google.com/maps?q=${salon.latitude},${salon.longitude}&z=16&output=embed`
    : `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapSearch=`https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <main><style>{CSS}</style>
      <PublicPageHero
        eyebrow="Kleopátra Szépségszalon"
        title={salon.city_label}
        lead={<p>{salon.address}. Több szépségápolási szolgáltatás egy helyen, böngészhető árlistával és online időpontfoglalással.</p>}
        image={image}
        imageAlt={`${salon.city_label} Kleopátra Szépségszalon`}
        actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/prices" className="btn btn-outline">Árlista</NavLink></>}
      />

      <section className="public-section">
        <div className="container salon-detail-info">
          <article className="feature-card"><span className="feature-card__kicker">Helyszín</span><h2>Cím</h2><p>{salon.address || "A cím betöltése folyamatban."}</p><a href={mapSearch} target="_blank" rel="noreferrer">Útvonaltervezés →</a></article>
          <article className="feature-card"><span className="feature-card__kicker">Elérhetőség</span><h2>Telefon</h2><p>{salon.phone||"Az elérhetőség betöltése folyamatban."}</p>{salon.phone&&<a href={`tel:${salon.phone.replace(/\s/g,"")}`}>Hívás indítása →</a>}</article>
          <article className="feature-card"><span className="feature-card__kicker">Nyitvatartás</span><h2>Mikor várunk?</h2><p>{salon.hours||"Az aktuális nyitvatartás betöltése folyamatban."}</p>{Number(salon.review_count||0)>0&&<p><strong>{Number(salon.rating||0).toFixed(1)} / 5</strong> · {salon.review_count} értékelés</p>}</article>
          <article className="feature-card"><span className="feature-card__kicker">Szolgáltatások</span><h2>Minden egy helyen</h2><p>Fodrászat, kozmetika, kéz- és lábápolás, masszázs és további szolgáltatások. A pontos kínálat szalononként eltérhet.</p><NavLink to="/prices">Szolgáltatások és árak →</NavLink></article>
        </div>
      </section>

      <section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Térkép</p><h2>Találd meg könnyen a szalont</h2><p>A térképen pontosan megnézheted a helyszínt, majd közvetlenül elindíthatod az útvonaltervezést.</p></header><div className="salon-detail-map"><iframe title={`${salon.city_label} Kleopátra Szépségszalon térkép`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapEmbed}/><div className="salon-detail-map__actions"><a href={mapSearch} target="_blank" rel="noreferrer">Megnyitás térképen</a><NavLink to="/prices">Árak és szolgáltatások</NavLink><NavLink to="/booking">Időpontfoglalás</NavLink></div></div></div></section>

      <section className="public-section">
        <div className="container public-cta">
          <div><h2>Megvan a megfelelő szolgáltatás?</h2><p>Előbb nézd meg az árakat és a szolgáltatás részleteit, vagy lépj közvetlenül az online időpontfoglalásra.</p></div>
          <div className="public-page-hero__actions"><NavLink to="/prices" className="btn btn-outline">Árak és szolgáltatások</NavLink><NavLink to="/booking" className="btn btn-primary">Foglalás</NavLink></div>
        </div>
      </section>
    </main>
  );
};
