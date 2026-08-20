import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { API_BASE } from "../apiClient";
import { SERVICE_PAGE_BY_SLUG } from "../data/servicePages";

const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
type DynamicService={id:string;name:string;duration_minutes:number;category_name:string;department_name:string;base_price:number|string;level_prices?:{normal?:number|null;top?:number|null;master?:number|null}};

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const staticService = SERVICE_PAGE_BY_SLUG.get(slug.toLowerCase());
  const [dynamicService,setDynamicService]=useState<DynamicService|null>(null);
  const [loading,setLoading]=useState(!staticService);

  useEffect(()=>{
    if(staticService){setLoading(false);return;}
    setLoading(true);
    fetch(`${API_BASE}/api/public/booking/v4/pricelist`,{credentials:"include"}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
      const found=(data.services||[]).find((s:DynamicService)=>normalize(s.name)===normalize(slug));
      setDynamicService(found||null);
    }).catch(()=>setDynamicService(null)).finally(()=>setLoading(false));
  },[slug,staticService]);

  const seo=useMemo(()=>{
    if(staticService)return {title:staticService.title,description:staticService.lead,canonicalSlug:staticService.slug};
    if(dynamicService)return {title:dynamicService.name,description:`${dynamicService.name} a Kleopátra Szépségszalonokban. Ismerd meg a szolgáltatást, az időtartamot, az árakat és foglalj online időpontot.`,canonicalSlug:normalize(dynamicService.name)};
    return null;
  },[staticService,dynamicService]);

  useEffect(() => {
    if (!seo) return;
    const previousTitle=document.title;
    const existingDescription=document.head.querySelector('meta[name="description"]') as HTMLMetaElement|null;
    const descriptionWasCreated=!existingDescription; const description=existingDescription||document.createElement("meta"); const previousDescription=existingDescription?.content||"";
    if(descriptionWasCreated){description.name="description";document.head.appendChild(description)}
    const existingCanonical=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null;
    const canonicalWasCreated=!existingCanonical; const canonical=existingCanonical||document.createElement("link"); const previousCanonical=existingCanonical?.href||"";
    if(canonicalWasCreated){canonical.rel="canonical";document.head.appendChild(canonical)}
    document.title=`${seo.title} | Kleopátra Szépségszalonok`; description.content=seo.description; canonical.href=`https://www.kleoszalon.hu/szolgaltatasok/${seo.canonicalSlug}`;
    return()=>{document.title=previousTitle;if(descriptionWasCreated)description.remove();else description.content=previousDescription;if(canonicalWasCreated)canonical.remove();else canonical.href=previousCanonical};
  },[seo]);

  if(loading)return <main><section className="public-section"><div className="container"><div className="notice-card">Szolgáltatás betöltése…</div></div></section></main>;
  if(!staticService&&!dynamicService)return <main><section className="public-section"><div className="container public-cta"><div><h2>A szolgáltatás jelenleg nem érhető el</h2><p>Nézd meg a teljes szolgáltatás- és árlistát.</p></div><Link to="/prices" className="btn btn-primary">Áraink és szolgáltatásaink</Link></div></section></main>;

  if(staticService){
    const related=(staticService.related||[]).map(x=>SERVICE_PAGE_BY_SLUG.get(x)).filter(Boolean);
    return <main>
      <PublicPageHero eyebrow={staticService.eyebrow} title={staticService.title} lead={<p>{staticService.lead}</p>} actions={<><Link to="/booking" className="btn btn-primary">Időpontfoglalás</Link><Link to="/araink" className="btn btn-outline">Árak</Link></>} />
      <section className="public-section"><div className="container"><div className="public-section__header"><p className="section-eyebrow">{staticService.category}</p><h2>Részletek a szolgáltatásról</h2><p>{staticService.description}</p></div><div className="feature-grid">{staticService.benefits.map(benefit=><article className="feature-card" key={benefit}><span className="feature-card__kicker">Kleopátra</span><h3>{benefit}</h3><p>Az aktuális elérhetőség, időtartam és pontos szolgáltatási tartalom szalononként eltérhet.</p></article>)}</div></div></section>
      {related.length>0&&<section className="public-section public-section--soft"><div className="container"><header className="public-section__header"><p className="section-eyebrow">Kapcsolódó kezelések</p><h2>Fedezd fel a kapcsolódó szolgáltatásokat</h2></header><div className="feature-grid">{related.map(item=>item&&<Link key={item.slug} to={`/szolgaltatasok/${item.slug}`} className="feature-card card--service"><span className="feature-card__kicker">{item.category}</span><h3>{item.title}</h3><p>{item.lead}</p><span className="link-btn">Részletek →</span></Link>)}</div></div></section>}
      <section className="public-section"><div className="container public-cta"><div><h2>Ár és szabad időpont</h2><p>Hasonlítsd össze az árakat, majd válassz megfelelő szalont és szakembert.</p></div><div className="public-page-hero__actions"><Link to="/prices" className="btn btn-outline">Árak</Link><Link to="/booking" className="btn btn-primary">Időpontfoglalás</Link></div></div></section>
    </main>;
  }

  const s=dynamicService!; const normal=Number(s.level_prices?.normal??s.base_price??0);
  return <main>
    <PublicPageHero eyebrow={`${s.department_name} · ${s.category_name}`} title={s.name} lead={<p>Részletes tájékoztató a szolgáltatásról, az időtartamról, az árkategóriákról és az online foglalás lehetőségéről.</p>} actions={<><Link to="/booking" className="btn btn-primary">Időpontfoglalás</Link><Link to="/prices" className="btn btn-outline">Árlista</Link></>} />
    <section className="public-section"><div className="container"><header className="public-section__header"><p className="section-eyebrow">{s.category_name}</p><h2>Mit érdemes tudni?</h2><p>A {s.name} a Kleopátra {s.department_name.toLowerCase()} szolgáltatásai közé tartozik. A kezelés pontos tartalma és az alkalmazott technika a választott szalon, szakember és személyes igények alapján kerül véglegesítésre.</p></header><div className="feature-grid">
      <article className="feature-card"><span className="feature-card__kicker">Mi a szolgáltatás?</span><h3>{s.name}</h3><p>A szolgáltatás személyre szabott konzultációval és az adott kezelés szakmai protokollja szerint történik.</p></article>
      <article className="feature-card"><span className="feature-card__kicker">Kinek ajánlott?</span><h3>Személyre szabott választás</h3><p>A szakember a foglalás és a helyszíni konzultáció során segít eldönteni, hogy a szolgáltatás megfelel-e az igényeidnek.</p></article>
      <article className="feature-card"><span className="feature-card__kicker">Időtartam</span><h3>{s.duration_minutes||30} perc</h3><p>A tényleges időtartam a szolgáltatás változatától és az egyéni körülményektől eltérhet.</p></article>
      <article className="feature-card"><span className="feature-card__kicker">Ár</span><h3>{normal.toLocaleString("hu-HU")} Ft-tól</h3><p>A Normál, TOP és Master szakemberi árakat szalon szerint az árlistában hasonlíthatod össze.</p></article>
    </div></div></section>
    <section className="public-section public-section--soft"><div className="container public-cta"><div><h2>Következő lépés</h2><p>Válaszd ki a szalont, a szakemberi szintet és a neked megfelelő szabad időpontot.</p></div><div className="public-page-hero__actions"><Link to="/prices" className="btn btn-outline">Árak összehasonlítása</Link><Link to="/booking" className="btn btn-primary">Foglalás</Link></div></div></section>
  </main>;
}

export default ServiceDetailPage;
