import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchKioskProducts, fetchKioskServices } from "./kioskApi";
import { addToCart } from "./cartStore";
import { KioskCartPanel } from "./KioskCartPanel";
import { KioskSemanticArt } from "./KioskSemanticArt";
import type { KioskCategory, KioskProduct, KioskService } from "./types";

const FALLBACK_IMAGES=["/kiosk/tiles/fodraszat.png","/kiosk/tiles/kez_es_labapolas.png","/kiosk/tiles/kozmetika.png","/kiosk/tiles/masszazs.png","/kiosk/tiles/testkezeles.png","/kiosk/tiles/wellness_fitness_szolarium.png"];
function lang(): "hu" | "en" | "ru" { const v=localStorage.getItem("kiosk_lang"); return v==="en"||v==="ru"?v:"hu"; }
function normalize(v:string|null|undefined){return(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function serviceName(x:KioskService){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function productName(x:KioskProduct){const l=lang();return(l==="en"?x.name_en:l==="ru"?x.name_ru:x.name_hu)||x.name}
function servicePrice(x:KioskService){return Number(x.list_price??x.base_price??0)}
function productPrice(x:KioskProduct){return Number(x.sale_price??x.retail_price_gross??0)}
const slugify=(s:string)=>normalize(s);

export function KioskCategory(){
 const nav=useNavigate();const{slug=""}=useParams();const[loading,setLoading]=React.useState(true);const[err,setErr]=React.useState("");
 const[services,setServices]=React.useState<KioskService[]>([]);const[serviceCats,setServiceCats]=React.useState<KioskCategory[]>([]);const[products,setProducts]=React.useState<KioskProduct[]>([]);const[productCats,setProductCats]=React.useState<KioskCategory[]>([]);const[menu,setMenu]=React.useState<any>(null);const[addedId,setAddedId]=React.useState("");const[langTick,setLangTick]=React.useState(0);
 const catalogType=(localStorage.getItem("kiosk_catalog_type")==="product"?"product":"service") as "product"|"service";const storedId=localStorage.getItem("kiosk_category_id")||"";const storedName=localStorage.getItem("kiosk_category_name")||"";
 React.useEffect(()=>{const h=()=>setLangTick(x=>x+1);window.addEventListener("kiosk-lang-change",h);return()=>window.removeEventListener("kiosk-lang-change",h)},[]);
 React.useEffect(()=>{(async()=>{try{setLoading(true);setErr("");const locationId=localStorage.getItem("kiosk_location_id");const[svc,prod]=await Promise.all([fetchKioskServices(lang(),locationId),fetchKioskProducts(locationId)]);setServices(svc.services||[]);setServiceCats(svc.categories||[]);setProducts(prod.products||[]);setProductCats(prod.categories||[]);setMenu(svc.menu||prod.menu||null)}catch(e:any){setErr(e?.message||"API hiba")}finally{setLoading(false)}})()},[slug,langTick]);
 const cats=catalogType==="product"?productCats:serviceCats;const wanted=normalize(storedName||slug);const activeCategory=cats.find(c=>(storedId&&String(c.id)===storedId)||normalize(c.name)===wanted)||cats[0]||null;
 const activeServices=catalogType==="service"&&activeCategory?services.filter(s=>String(s.category_id||"")===String(activeCategory.id)||normalize(s.category_name)===normalize(activeCategory.name)):[];
 const activeProducts=catalogType==="product"&&activeCategory?products.filter(p=>String(p.category_id||"")===String(activeCategory.id)||normalize(p.category_name)===normalize(activeCategory.name)):[];
 const theme=menu?.theme||{};const showPrice=theme.showPrices!==false,showDuration=theme.showDuration!==false;const allCats=[...serviceCats.map(c=>({...c,type:"service" as const})),...(theme.showProducts!==false?productCats.map(c=>({...c,type:"product" as const})):[])];
 const categoryImage=activeCategory?.image_path||FALLBACK_IMAGES[Math.max(0,cats.findIndex(x=>x.id===activeCategory?.id))%FALLBACK_IMAGES.length];
 function selectCategory(c:KioskCategory,type:"service"|"product"){localStorage.setItem("kiosk_catalog_type",type);localStorage.setItem("kiosk_category_id",String(c.id));localStorage.setItem("kiosk_category_name",c.name);nav(`/kiosk/cat/${slugify(c.name)||c.id}`)}
 function flash(id:string){setAddedId(id);window.setTimeout(()=>setAddedId(""),700)}
 function addService(s:KioskService){
   const title=serviceName(s);
   addToCart({id:s.id,title,price:servicePrice(s),meta:{kind:"service",duration:s.duration_minutes,category_id:s.category_id,image_url:s.image_url||categoryImage}},1);
   flash(s.id);
   window.dispatchEvent(new CustomEvent("kiosk-service-selected",{detail:{id:s.id,title,duration:s.duration_minutes,categoryId:s.category_id}}));
 }
 function addProduct(p:KioskProduct){addToCart({id:p.id,title:productName(p),price:productPrice(p),meta:{kind:"product",category_id:p.category_id,image_url:p.image_url||p.category_image}},1);flash(p.id)}
 return <div className="kiosk-order-layout">
  <aside className="kiosk-category-rail"><button className="kiosk-back-home" onClick={()=>nav("/kiosk")}>← Főmenü</button><button className="kiosk-retail-rail-button" onClick={()=>nav("/kiosk/products")}>🛍 <span>Termékeladás</span><small>KÁVÉ · ITAL · CSOKI</small></button><div className="kiosk-rail-title">Menü</div><div className="kiosk-rail-list">{allCats.map((c,i)=><button key={`${c.type}-${c.id}`} className={catalogType===c.type&&activeCategory?.id===c.id?"active":""} onClick={()=>selectCategory(c,c.type)}><KioskSemanticArt kind={c.type} name={c.name} source={c.image_path}/><span>{c.name}</span><small>{c.type==="product"?"TERMÉK":"SZOLGÁLTATÁS"}</small></button>)}</div></aside>
  <section className="kiosk-catalog-page"><div className="kiosk-category-banner" style={{backgroundImage:`linear-gradient(90deg,rgba(18,12,8,.82),rgba(18,12,8,.15)),url(${categoryImage})`}}><span>{catalogType==="product"?"KLEOSHOP":"SZOLGÁLTATÁS"}</span><h1>{activeCategory?.name||storedName||"Kategória"}</h1><p>{activeCategory?.subtitle||"Válassz a kártyák közül, majd add a kosárhoz."}</p></div>{loading&&<div className="kioskInfo">Adatok betöltése a VIR adatbázisból…</div>}{err&&<div className="kioskError">{err}</div>}
  {catalogType==="service"?<div className="kiosk-service-grid">{activeServices.map((s,index)=>{const image=s.image_url||s.category_image||null;const artName={`${serviceName(s)} ${s.category_name||""}`;return <article key={s.id} className={`kiosk-service-tile ${s.featured?"featured":""}`}><button className="kiosk-service-touch" onClick={()=>addService(s)}><div className="kiosk-service-image"><KioskSemanticArt kind="service" name={artName} source={image}/>{s.badge_text&&<span className="kiosk-service-badge">{s.badge_text}</span>}{s.featured&&<span className="kiosk-service-featured">AJÁNLOTT</span>}</div><div className="kiosk-service-content"><h3>{serviceName(s)}</h3>{s.description&&<p>{s.description}</p>}<div className="kiosk-service-facts">{showPrice&&<strong>{servicePrice(s).toLocaleString("hu-HU")} Ft</strong>}{showDuration&&s.duration_minutes!=null&&<span>{s.duration_minutes} perc</span>}</div></div></button><button className={`kiosk-add-button ${addedId===s.id?"added":""}`} onClick={()=>addService(s)}>{addedId===s.id?"✓ Hozzáadva":"+ Kosárba"}</button></article>})}{!loading&&!activeServices.length&&<div className="kioskInfo">Ebben a csoportban jelenleg nincs aktív szolgáltatás.</div>}</div>:<div className="kiosk-service-grid kiosk-product-grid">{activeProducts.map((p)=>{const artName={`${productName(p)} ${p.category_name||""} ${p.main_category||""}`;return <article key={p.id} className={`kiosk-service-tile ${p.featured?"featured":""}`}><button className="kiosk-service-touch" onClick={()=>addProduct(p)}><div className="kiosk-service-image"><KioskSemanticArt kind="product" name={artName} source={p.image_url||p.category_image}/>{p.badge_text&&<span className="kiosk-service-badge">{p.badge_text}</span>}{p.featured&&<span className="kiosk-service-featured">KIEMELT</span>}</div><div className="kiosk-service-content"><h3>{productName(p)}</h3>{p.web_description&&<p>{p.web_description}</p>}<div className="kiosk-service-facts">{showPrice&&<strong>{productPrice(p).toLocaleString("hu-HU")} Ft</strong>}</div></div></button><button className={`kiosk-add-button ${addedId===p.id?"added":""}`} onClick={()=>addProduct(p)}>{addedId===p.id?"✓ Hozzáadva":"+ Kosárba"}</button></article>})}{!loading&&!activeProducts.length&&<div className="kioskInfo">Ebben a csoportban jelenleg nincs aktív termék.</div>}</div>}
  </section><KioskCartPanel/>
 </div>
}