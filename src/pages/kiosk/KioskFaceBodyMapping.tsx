import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, readCart, writeCart } from "./cartStore";
import { fetchKioskConfig, fetchKioskServices } from "./kioskApi";
import type { KioskService } from "./types";
import "./kiosk-mapping-config.css";

type ViewMode = "hair" | "face" | "body-front" | "body-back";
type AdminViewKey = "hair" | "face" | "bodyFront" | "bodyBack";
type Zone = { id:string; label:string; x:number; y:number; w?:number; h?:number; enabled?:boolean };
type MappingTransform = { x?:number; y?:number; scale?:number };
type MappingConfig = {
  enabled?:boolean; title?:string; subtitle?:string; accent?:string; surface?:string;
  showLabels?:boolean; showGuide?:boolean; imageFit?:"contain"|"cover";
  viewImages?:Partial<Record<AdminViewKey|string,string>>;
  viewTransforms?:Partial<Record<AdminViewKey|string,MappingTransform>>;
  zones?:Partial<Record<AdminViewKey|string,Zone[]>>;
};
type MappingDraft = { serviceId:string; view:ViewMode; zones:string[]; note:string; updatedAt:string };

const STORAGE_KEY="kiosk_face_body_mapping_v1";
const z=(id:string,label:string,x:number,y:number,w:number,h:number):Zone=>({id,label,x,y,w,h,enabled:true});
const DEFAULT_ZONES:Record<ViewMode,Zone[]>={
  hair:[z("scalp","Fejbőr",50,20,45,20),z("hairline","Hajvonal",50,33,38,9),z("hair-roots","Hajtő",50,43,44,13),z("hair-length-left","Bal hajhossz",27,62,22,42),z("hair-length-right","Jobb hajhossz",73,62,22,42),z("hair-ends","Hajvégek",50,86,55,15)],
  face:[z("forehead","Homlok",50,20,27,11),z("temple-left","Bal halánték",31,32,13,11),z("temple-right","Jobb halánték",69,32,13,11),z("eye-left","Bal szemkörnyék",38,39,17,9),z("eye-right","Jobb szemkörnyék",62,39,17,9),z("nose","Orr",50,49,14,18),z("cheek-left","Bal orca",34,53,20,17),z("cheek-right","Jobb orca",66,53,20,17),z("upper-lip","Felső ajak",50,63,20,8),z("chin","Áll",50,75,23,13),z("jaw-left","Bal állív",35,70,17,11),z("jaw-right","Jobb állív",65,70,17,11),z("neck-front","Nyak",50,91,28,12)],
  "body-front":[z("decollete","Dekoltázs",50,19,31,10),z("arm-left-front","Bal kar",28,36,13,32),z("arm-right-front","Jobb kar",72,36,13,32),z("abdomen","Has",50,42,27,22),z("waist-left","Bal derék",39,48,12,18),z("waist-right","Jobb derék",61,48,12,18),z("thigh-left-front","Bal comb",42,67,15,29),z("thigh-right-front","Jobb comb",58,67,15,29),z("shin-left","Bal lábszár",43,88,13,22),z("shin-right","Jobb lábszár",57,88,13,22)],
  "body-back":[z("shoulders","Vállöv",50,22,37,11),z("upper-back","Felső hát",50,33,29,15),z("lower-back","Derék / alsó hát",50,48,27,15),z("arm-left-back","Bal kar",28,37,13,32),z("arm-right-back","Jobb kar",72,37,13,32),z("glute-left","Bal far",43,59,17,14),z("glute-right","Jobb far",57,59,17,14),z("thigh-left-back","Bal comb",42,73,15,27),z("thigh-right-back","Jobb comb",58,73,15,27),z("calf-left","Bal vádli",43,91,13,19),z("calf-right","Jobb vádli",57,91,13,19)]
};
const normalize=(value:string|null|undefined)=>(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const adminKey=(view:ViewMode):AdminViewKey=>view==="body-front"?"bodyFront":view==="body-back"?"bodyBack":view;
function serviceText(service:KioskService){return normalize([service.name,service.name_hu,service.description,service.category_name,service.category_name_hu,service.category_subtitle].filter(Boolean).join(" "))}
function recommendationKeywords(view:ViewMode,zones:string[]){
  const keywords=new Set<string>(),add=(...items:string[])=>items.forEach(item=>keywords.add(normalize(item)));
  if(view==="hair")add("haj","fodrász","fejbőr","hair","scalp","keratin","hajápolás","hajkezelés","frizura");
  if(view==="face")add("arc","arckezelés","kozmetika","bőr","skin");
  if(view==="body-front"||view==="body-back")add("testkezelés","masszázs","alakformálás","szőrtelenítés");
  zones.forEach(zone=>{
    if(/scalp|hairline|hair-roots/.test(zone))add("fejbőr","hajtő","hajkezelés","regeneráló","keratin","haj");
    if(/hair-length|hair-ends/.test(zone))add("haj","hajápolás","regeneráló","keratin","vágás","festés","balayage");
    if(/eye/.test(zone))add("szemkörnyék","szem","kozmetika","szempilla");
    if(/forehead|temple|nose|cheek|chin|jaw/.test(zone))add("arc","arckezelés","kozmetika","bőr","tisztítás","hidratálás");
    if(/upper-lip/.test(zone))add("ajak","arc","gyanta","szőrtelenítés");
    if(/neck|decollete/.test(zone))add("nyak","dekoltázs","kozmetika","testkezelés","masszázs");
    if(/shoulders|upper-back|lower-back/.test(zone))add("hát","váll","masszázs","testkezelés");
    if(/abdomen|waist|thigh|glute/.test(zone))add("alakformálás","cellulit","zsírbontás","testkezelés","masszázs");
    if(/arm|shin|calf/.test(zone))add("szőrtelenítés","gyanta","lézer","testkezelés","masszázs");
  });
  return [...keywords].filter(Boolean);
}
function recommendServices(services:KioskService[],view:ViewMode,zones:string[]){
  if(!zones.length)return[];
  const keywords=recommendationKeywords(view,zones);
  return services.map(service=>{const text=serviceText(service);let score=0;keywords.forEach(keyword=>{if(text.includes(keyword))score+=keyword.length>=8?4:keyword.length>=5?3:2});if(view==="hair"&&/(haj|fodrasz|hair|fejbor)/.test(text))score+=8;if(view==="face"&&/(kozmet|arc|skin|bor)/.test(text))score+=6;if((view==="body-front"||view==="body-back")&&/(test|massz|alak|cellulit|szortelen|gyanta|lezer)/.test(text))score+=5;return{service,score}}).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||String(a.service.name_hu||a.service.name).localeCompare(String(b.service.name_hu||b.service.name),"hu")).slice(0,5).map(item=>item.service);
}
function readDraft():MappingDraft|null{try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return null;const parsed=JSON.parse(raw) as MappingDraft;return(["hair","face","body-front","body-back"] as ViewMode[]).includes(parsed.view)?parsed:{...parsed,view:"face",zones:[]}}catch{return null}}
function saveDraft(draft:MappingDraft){localStorage.setItem(STORAGE_KEY,JSON.stringify(draft))}
function configValue<T>(record:Record<string,T>|undefined,view:ViewMode):T|undefined{if(!record)return undefined;return record[adminKey(view)]??record[view]}

export function KioskFaceBodyMapping(){
  const nav=useNavigate(),initial=React.useMemo(()=>readDraft(),[]);
  const [services,setServices]=React.useState<KioskService[]>([]),[mappingConfig,setMappingConfig]=React.useState<MappingConfig>({});
  const [serviceId,setServiceId]=React.useState(initial?.serviceId||""),[view,setView]=React.useState<ViewMode>(initial?.view||"face"),[selectedZones,setSelectedZones]=React.useState<string[]>(initial?.zones||[]),[note,setNote]=React.useState(initial?.note||""),[loading,setLoading]=React.useState(true),[error,setError]=React.useState(""),[saved,setSaved]=React.useState(false);
  React.useEffect(()=>{const locationId=localStorage.getItem("kiosk_location_id")||undefined,lang=localStorage.getItem("kiosk_lang")||"hu";setLoading(true);Promise.allSettled([fetchKioskServices(lang,locationId),fetchKioskConfig(locationId)]).then(results=>{const serviceResult=results[0],configResult=results[1];if(serviceResult.status==="fulfilled")setServices(serviceResult.value.services||[]);else setError(serviceResult.reason?.message||"A kezelések betöltése sikertelen.");if(configResult.status==="fulfilled")setMappingConfig((configResult.value.menu?.theme as any)?.kioskExperiences?.mapping||{});}).finally(()=>setLoading(false))},[]);
  React.useEffect(()=>saveDraft({serviceId,view,zones:selectedZones,note,updatedAt:new Date().toISOString()}),[serviceId,view,selectedZones,note]);
  const configuredZones=configValue(mappingConfig.zones as Record<string,Zone[]>|undefined,view),currentZones=(Array.isArray(configuredZones)&&configuredZones.length?configuredZones:DEFAULT_ZONES[view]).filter(zone=>zone.enabled!==false);
  const selectedService=services.find(service=>String(service.id)===serviceId),recommendations=React.useMemo(()=>recommendServices(services,view,selectedZones),[services,view,selectedZones]);
  const photo=configValue(mappingConfig.viewImages as Record<string,string>|undefined,view),transform=configValue(mappingConfig.viewTransforms as Record<string,MappingTransform>|undefined,view)||{};
  const style={"--kiosk-accent":mappingConfig.accent||undefined,"--mapping-admin-surface":mappingConfig.surface||undefined} as React.CSSProperties;
  const toggleZone=(id:string)=>{setSaved(false);setError("");setSelectedZones(prev=>prev.includes(id)?prev.filter(zone=>zone!==id):[...prev,id])};
  const changeView=(next:ViewMode)=>{setSaved(false);setError("");setView(next);setSelectedZones([])};
  const clearMapping=()=>{setSelectedZones([]);setNote("");setSaved(false);setError("")};
  const attachTreatment=()=>{if(!selectedZones.length)return setError("Jelölj ki legalább egy kezelési területet.");if(!selectedService)return setError("Válassz egy ajánlott vagy másik kezelést a térképhez.");setError("");const mapping={view,zones:selectedZones,zone_labels:currentZones.filter(zone=>selectedZones.includes(zone.id)).map(zone=>zone.label),note:note.trim(),recommended_service_ids:recommendations.map(service=>service.id),mapped_at:new Date().toISOString()},cart=readCart(),existing=cart.find(item=>item.id===selectedService.id),title=selectedService.name_hu||selectedService.name,price=Number(selectedService.list_price??selectedService.base_price??0),meta={kind:"service",duration:selectedService.duration_minutes,category_id:selectedService.category_id,image_url:selectedService.image_url||selectedService.category_image,face_body_mapping:mapping};if(existing)writeCart(cart.map(item=>item.id===selectedService.id?{...item,title,price,meta:{...(item.meta||{}),...meta}}:item));else addToCart({id:selectedService.id,title,price,meta},1);saveDraft({serviceId,view,zones:selectedZones,note,updatedAt:new Date().toISOString()});setSaved(true)};
  if(mappingConfig.enabled===false)return <div className="kiosk-mapping-page mapping-disabled" style={style}><button onClick={()=>nav("/kiosk")}>← Főmenü</button><h1>A kezelési térkép jelenleg nem elérhető.</h1></div>;
  return <div className="kiosk-mapping-page" style={style}>
    <div className="kiosk-mapping-toolbar"><button onClick={()=>nav("/kiosk")}>← Főmenü</button><div><span>17. FUNKCIÓ</span><b>Hair / Face / Body Mapping</b></div><button className="mapping-pay-link" onClick={()=>nav("/kiosk/pay")}>Kosár →</button></div>
    <section className="kiosk-mapping-hero"><div><span className="mapping-kicker">KEZELÉSI TÉRKÉP · KLEOPÁTRA 2026</span><h1>{mappingConfig.title||"Mutasd meg pontosan, melyik terület érdekel."}</h1><p>{mappingConfig.subtitle||"Jelöld ki a haj, arc vagy test területét. A rendszer azonnal a kijelölt területhez illő, valóban elérhető szalonkezeléseket ajánlja."}</p></div><div className="mapping-hero-stat"><strong>{selectedZones.length}</strong><span>kijelölt terület</span></div></section>
    {error&&<div className="kioskError">{error}</div>}{saved&&<div className="kiosk-mapping-success">✓ A kezelési térkép hozzá lett kötve a kosárban lévő szolgáltatáshoz.</div>}
    <div className="kiosk-mapping-grid"><section className="mapping-control-card">
      <div className="mapping-step"><span>01</span><div><b>Nézet kiválasztása</b><small>Haj, arc, test elöl vagy test hátul</small></div></div>
      <div className="mapping-view-tabs mapping-view-tabs-four"><button className={view==="hair"?"active":""} onClick={()=>changeView("hair")}><span>✂</span>Haj</button><button className={view==="face"?"active":""} onClick={()=>changeView("face")}><span>◉</span>Arc</button><button className={view==="body-front"?"active":""} onClick={()=>changeView("body-front")}><span>♙</span>Test · elöl</button><button className={view==="body-back"?"active":""} onClick={()=>changeView("body-back")}><span>♟</span>Test · hátul</button></div>
      <div className="mapping-step"><span>02</span><div><b>Ajánlott kezelések</b><small>A kijelölt terület alapján, az aktuális szolgáltatáslistából</small></div></div>
      {!selectedZones.length&&<div className="mapping-recommend-empty">Jelölj ki egy területet a jobb oldali képen.</div>}
      {!!selectedZones.length&&!loading&&!recommendations.length&&<div className="mapping-recommend-empty">Ehhez a területhez most nem találtam automatikus találatot. A listából továbbra is választhatsz.</div>}
      {!!recommendations.length&&<div className="mapping-recommendations">{recommendations.map((service,index)=>{const active=String(service.id)===serviceId;return <button key={service.id} className={active?"active":""} onClick={()=>{setServiceId(String(service.id));setSaved(false);setError("")}}><span>{index===0?"LEGJOBB TALÁLAT":"AJÁNLOTT"}</span><b>{service.name_hu||service.name}</b><small>{service.category_name_hu||service.category_name||"Kezelés"}{service.duration_minutes?` · ${service.duration_minutes} perc`:""}</small><strong>{Number(service.list_price??service.base_price??0).toLocaleString("hu-HU")} Ft</strong><i>{active?"✓ Kiválasztva":"Ezt választom →"}</i></button>})}</div>}
      <label className="mapping-service-select"><span>Másik kezelés választása</span><select value={serviceId} onChange={e=>{setServiceId(e.target.value);setSaved(false);setError("")}} disabled={loading}><option value="">{loading?"Kezelések betöltése…":"Válassz kezelést"}</option>{services.map(service=><option key={service.id} value={service.id}>{service.category_name?`${service.category_name} · `:""}{service.name_hu||service.name}</option>)}</select></label>
      {selectedService&&<div className="mapping-service-summary"><b>{selectedService.name_hu||selectedService.name}</b><span>{selectedService.duration_minutes?`${selectedService.duration_minutes} perc · `:""}{Number(selectedService.list_price??selectedService.base_price??0).toLocaleString("hu-HU")} Ft</span></div>}
      <div className="mapping-step"><span>03</span><div><b>Megjegyzés</b><small>Opcionális információ a szakembernek</small></div></div><textarea className="mapping-note" value={note} onChange={e=>{setNote(e.target.value);setSaved(false)}} placeholder="Pl. érzékeny terület, kerülendő rész, korábbi kezelés…"/>
      <div className="mapping-actions"><button className="mapping-clear" onClick={clearMapping}>Törlés</button><button className="mapping-attach" onClick={attachTreatment}>Kezeléshez kötés <span>→</span></button></div>
    </section>
    <section className="mapping-canvas-card"><div className="mapping-canvas-head"><div><span>04</span><b>Érintsd meg a kezelendő zónákat</b></div><small>Több terület is kijelölhető</small></div>
      <div className={`mapping-anatomy mapping-${view} ${photo?"has-admin-photo":""}`}>
        {mappingConfig.showGuide!==false&&<AnatomyFigure view={view}/>} 
        {photo&&<img className="mapping-admin-photo" src={photo} alt="" style={{objectFit:mappingConfig.imageFit||"contain",left:`calc(50% + ${Number(transform.x||0)}%)`,top:`calc(50% + ${Number(transform.y||0)}%)`,transform:`translate(-50%,-50%) scale(${Number(transform.scale||1)})`}}/>}
        {currentZones.map(zone=><button key={zone.id} className={`mapping-zone ${selectedZones.includes(zone.id)?"selected":""}`} style={{left:`${zone.x}%`,top:`${zone.y}%`,width:`${zone.w||16}%`,height:`${zone.h||10}%`}} onClick={()=>toggleZone(zone.id)} aria-pressed={selectedZones.includes(zone.id)} title={zone.label}><span>{selectedZones.includes(zone.id)?"✓":"+"}</span>{mappingConfig.showLabels!==false&&<b>{zone.label}</b>}</button>)}
      </div>
      <div className="mapping-selected-list"><span>Kijelölve</span><div>{selectedZones.length?currentZones.filter(zone=>selectedZones.includes(zone.id)).map(zone=><button key={zone.id} onClick={()=>toggleZone(zone.id)}>{zone.label} ×</button>):<small>Még nincs kijelölt terület.</small>}</div></div>
    </section></div>
  </div>;
}
function AnatomyFigure({view}:{view:ViewMode}){if(view==="face")return <svg className="mapping-figure-svg mapping-admin-guide" viewBox="0 0 300 420" aria-hidden="true"><ellipse cx="150" cy="175" rx="94" ry="135" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M90 150c35-20 85-20 120 0M150 120v115M112 265c24 18 52 18 76 0" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;if(view==="hair")return <svg className="mapping-figure-svg mapping-admin-guide" viewBox="0 0 300 420" aria-hidden="true"><path d="M55 360Q25 90 150 40Q275 90 245 360Q215 315 205 170Q150 105 95 170Q85 315 55 360Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;return <svg className="mapping-figure-svg mapping-admin-guide" viewBox="0 0 300 620" aria-hidden="true"><circle cx="150" cy="70" r="44" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M106 120c-32 28-45 90-31 180l25 94-24 200M194 120c32 28 45 90 31 180l-25 94 24 200M106 120c28 18 60 18 88 0M150 120v260M100 394l50-14 50 14" fill="none" stroke="currentColor" strokeWidth="2"/></svg>}
export default KioskFaceBodyMapping;
