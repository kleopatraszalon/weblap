import { API_BASE } from "./apiClient";
import { BEAUTY_QUOTES_V13, GYM_TIPS_V13, MOTIVATION_QUOTES_V13 } from "./signageInfoContentV13";

type Kind = "nameday" | "weather" | "motivation" | "beauty" | "gym";
type Motion = { x:number; y:number; vx:number; vy:number };
type PriceRow = { id:string; name:string; price:string };

const KINDS: Kind[] = ["nameday","weather","motivation","beauty","gym"];
const PALETTE: Record<Kind,string> = {
  nameday:"linear-gradient(145deg,#df1f7c,#8d1456)",
  weather:"linear-gradient(145deg,#1697d5,#0d518f)",
  motivation:"linear-gradient(145deg,#ed951d,#9a5208)",
  beauty:"linear-gradient(145deg,#a94fd0,#5e2788)",
  gym:"linear-gradient(145deg,#22ad78,#0c6546)",
};
const BORDER: Record<Kind,string> = {
  nameday:"#ff9bd0",weather:"#8bdcff",motivation:"#ffd584",beauty:"#e7aaff",gym:"#89f0bf"
};
const motion = new Map<Kind,Motion>();
let raf=0, last=0, syncTimer=0, priceTimer=0, dataTimer=0;
let nameday = "Mai névnapos vendégeinknek 20% kedvezmény.";
let weather = { t:null as number|null, p:0, code:0 };
let prices: PriceRow[]=[];

const isSignage=()=>location.pathname.startsWith("/signage");
const esc=(s:unknown)=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
const money=(v:unknown)=>{ const n=Number(String(v??"").replace(/\s/g,"").replace(/[^0-9,.-]/g,"").replace(",",".")); return Number.isFinite(n)&&n>0?`${Math.round(n).toLocaleString("hu-HU")} Ft`:""; };
const firstPrice=(x:any)=>[x?.level_prices?.normal,x?.base_price,x?.price,x?.price_text,x?.priceText,x?.level_prices?.top,x?.level_prices?.master,x?.level_prices?.premium].map(money).find(Boolean)||"";

function timeKey(){
  const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Budapest",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const g=(t:string)=>Number(p.find(x=>x.type===t)?.value||0); return {day:Math.floor(Date.UTC(g("year"),g("month")-1,g("day"))/86400000),hour:g("hour")};
}
function q(list:string[],i:number,f:string){return list.length?list[((i%list.length)+list.length)%list.length]||f:f;}
function weatherText(){
  const rain=new Set([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99]);
  if(weather.p>.1||rain.has(weather.code)) return "Esős idő: egy kényeztető beltéri szépségprogram különösen jól esik.";
  if(weather.t!==null&&weather.t>=27) return "Meleg nap: könnyed, frissítő szépségprogram illik hozzá.";
  if(weather.t!==null&&weather.t<=8) return "Hűvös nap: jöhet egy kényeztető szépségpillanat.";
  return "Szép idő: egy friss megjelenés még jobbá teszi a napot.";
}

function injectCss(){
  if(document.getElementById("kleo-signage-v23-css")) return;
  const s=document.createElement("style"); s.id="kleo-signage-v23-css"; s.textContent=`
  .kleoV23Layer{position:fixed!important;inset:0!important;z-index:2147483200!important;pointer-events:none!important;overflow:hidden!important}
  .kleoV23Card{position:fixed!important;width:clamp(210px,16vw,285px)!important;min-height:88px!important;max-height:118px!important;padding:10px 12px!important;box-sizing:border-box!important;border:1px solid!important;border-radius:18px!important;color:#fff!important;overflow:hidden!important;box-shadow:0 12px 30px rgba(0,0,0,.24)!important;backdrop-filter:blur(8px)!important;display:block!important}
  .kleoV23Label{font:900 clamp(8px,.58vw,11px)/1.05 system-ui,sans-serif!important;letter-spacing:.07em!important;text-transform:uppercase!important;color:rgba(255,255,255,.94)!important;margin-bottom:6px!important;white-space:nowrap!important}
  .kleoV23Text{font:800 clamp(11px,.82vw,16px)/1.22 system-ui,sans-serif!important;color:#fff!important;white-space:normal!important;overflow-wrap:anywhere!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:4!important;overflow:hidden!important;text-shadow:0 1px 2px rgba(0,0,0,.28)!important}
  .sgSvcList.kleoV23Prices{visibility:visible!important;display:block!important;overflow:hidden!important;position:relative!important}
  .kleoV23PriceTrack{display:flex!important;flex-direction:column!important;gap:5px!important;animation:kleoV23PriceRoll var(--dur,150s) linear infinite!important;will-change:transform!important}
  .kleoV23PriceRow{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;align-items:center!important;padding:5px 7px!important;border:1px solid rgba(184,151,99,.22)!important;border-radius:8px!important;background:#fff!important;min-height:30px!important;box-sizing:border-box!important}
  .kleoV23PriceRow span{font:800 clamp(8px,.58vw,11px)/1.05 system-ui,sans-serif!important;color:#20140e!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
  .kleoV23PriceRow b{font:950 clamp(8px,.62vw,12px)/1 system-ui,sans-serif!important;color:#91662d!important;white-space:nowrap!important}
  @keyframes kleoV23PriceRoll{0%,3%{transform:translateY(0)}97%,100%{transform:translateY(-50%)}}
  `; document.head.appendChild(s);
}

function ensureLayer(){
  injectCss();
  document.querySelectorAll<HTMLElement>(".kleoRoamLayerV19,.kleoRoamLayerV20,.kleoRoamLayerV21,.kleoRoamLayerV22,.kleoV23Layer").forEach((e,i)=>{if(!e.classList.contains("kleoV23Layer")) e.remove();});
  let layer=document.querySelector<HTMLElement>(".kleoV23Layer");
  if(!layer){layer=document.createElement("div");layer.className="kleoV23Layer";layer.dataset.runtime="v23-full-frame-readable-cards";layer.innerHTML=KINDS.map(k=>`<article class="kleoV23Card" data-v23-kind="${k}"><div class="kleoV23Label"></div><div class="kleoV23Text"></div></article>`).join("");document.body.appendChild(layer);}
  KINDS.forEach(k=>{const el=layer!.querySelector<HTMLElement>(`[data-v23-kind="${k}"]`);if(el){el.style.setProperty("background",PALETTE[k],"important");el.style.setProperty("border-color",BORDER[k],"important");}});
  return layer;
}
function setCard(k:Kind,label:string,text:string){const el=document.querySelector<HTMLElement>(`[data-v23-kind="${k}"]`);if(!el)return; const l=el.querySelector<HTMLElement>(".kleoV23Label"),t=el.querySelector<HTMLElement>(".kleoV23Text"); if(l)l.textContent=label;if(t)t.textContent=text;}
function updateCards(){ensureLayer();const {day,hour}=timeKey();setCard("nameday","🎁 NÉVNAP · 20%",nameday);setCard("weather",`☀ IDŐJÁRÁS${weather.t===null?"":` · ${Math.round(weather.t)}°`}`,weatherText());setCard("motivation","💬 MOTIVÁCIÓ",q(MOTIVATION_QUOTES_V13,day,"A következetesség ma is közelebb visz a célodhoz."));setCard("beauty","✨ SZÉPSÉG",q(BEAUTY_QUOTES_V13,day*24+hour,"A szépség az ápoltság és az önazonosság harmóniája."));setCard("gym","🏋 GYM TIPP",q(GYM_TIPS_V13,day*24+hour,"Dolgozz kontrollált mozgástartományban, stabil törzzsel."));}

function seed(){const w=innerWidth,h=innerHeight;KINDS.forEach((k,i)=>{if(motion.has(k))return;const speed=26+i*3,ang=.5+i*.95;motion.set(k,{x:24+(i*.18+.05)*(w-330),y:80+(i*.16+.08)*(h-260),vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed*.82});});}
function animate(ts:number){if(!isSignage()){raf=requestAnimationFrame(animate);return;}ensureLayer();seed();const dt=Math.min(.035,last?(ts-last)/1000:.016);last=ts;const left=10,top=68,right=innerWidth-10,bottom=innerHeight-55;const cards:any[]=[];KINDS.forEach(k=>{const el=document.querySelector<HTMLElement>(`[data-v23-kind="${k}"]`),m=motion.get(k);if(!el||!m)return;const r=el.getBoundingClientRect(),w=Math.max(210,r.width||250),h=Math.max(88,r.height||100);m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.x<left){m.x=left;m.vx=Math.abs(m.vx)}if(m.x+w>right){m.x=right-w;m.vx=-Math.abs(m.vx)}if(m.y<top){m.y=top;m.vy=Math.abs(m.vy)}if(m.y+h>bottom){m.y=bottom-h;m.vy=-Math.abs(m.vy)}cards.push({el,m,w,h});});
  for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){const a=cards[i],b=cards[j],dx=(b.m.x+b.w/2)-(a.m.x+a.w/2),dy=(b.m.y+b.h/2)-(a.m.y+a.h/2),ox=(a.w+b.w)/2+8-Math.abs(dx),oy=(a.h+b.h)/2+8-Math.abs(dy);if(ox>0&&oy>0){if(ox<oy){const d=dx>=0?1:-1;a.m.x-=ox/2*d;b.m.x+=ox/2*d;[a.m.vx,b.m.vx]=[b.m.vx,a.m.vx]}else{const d=dy>=0?1:-1;a.m.y-=oy/2*d;b.m.y+=oy/2*d;[a.m.vy,b.m.vy]=[b.m.vy,a.m.vy]}}}
  cards.forEach(({el,m})=>{el.style.setProperty("left",`${m.x.toFixed(1)}px`,"important");el.style.setProperty("top",`${m.y.toFixed(1)}px`,"important")});raf=requestAnimationFrame(animate);
}

function parseBooking4(data:any){const raw=Array.isArray(data)?data:Array.isArray(data?.services)?data.services:Array.isArray(data?.items)?data.items:Array.isArray(data?.rows)?data.rows:[];const out:PriceRow[]=[];const seen=new Set<string>();for(let i=0;i<raw.length;i++){const x=raw[i],name=String(x?.name??x?.title??x?.service_name??"").trim(),price=firstPrice(x);if(!name||!price)continue;const key=`${name.toLowerCase()}|${price}`;if(seen.has(key))continue;seen.add(key);out.push({id:String(x?.id??x?.service_id??i),name,price});if(out.length>=180)break;}return out;}
function renderPrices(){const panel=document.querySelector<HTMLElement>(".sgServices");if(!panel)return;const title=panel.querySelector<HTMLElement>(".sgPanelHeader h2"),meta=panel.querySelector<HTMLElement>(".sgPanelHeader .sgMeta"),hint=panel.querySelector<HTMLElement>(".sgHint"),list=panel.querySelector<HTMLElement>(".sgSvcList");if(title)title.textContent="ÁRAINK";if(meta)meta.textContent=prices.length?`Booking 4.0 · ${prices.length} ár`:"Booking 4.0";if(hint)hint.textContent=prices.length?"Booking 4.0 árlista · automatikusan gördül":"Booking 4.0 árak betöltése…";if(!list||!prices.length)return;list.classList.add("kleoV23Prices");const sig=prices.map(x=>`${x.id}:${x.price}`).join("|");if(list.dataset.v23sig===sig)return;list.dataset.v23sig=sig;const doubled=[...prices,...prices];list.innerHTML=`<div class="kleoV23PriceTrack" style="--dur:${Math.max(90,Math.min(300,prices.length*1.9))}s">${doubled.map(x=>`<div class="kleoV23PriceRow"><span>${esc(x.name)}</span><b>${esc(x.price)}</b></div>`).join("")}</div>`;}
async function loadPrices(){try{const r=await fetch(`${API_BASE}/api/public/booking/v4/pricelist?_=${Date.now()}`,{cache:"no-store",credentials:"omit",mode:"cors",headers:{Accept:"application/json"}});if(!r.ok)throw new Error(String(r.status));prices=parseBooking4(await r.json());renderPrices();}catch(e){console.error("[signage-v23] Booking 4.0",e);}}
async function loadAux(){try{const r=await fetch(`${API_BASE}/api/signage/nameday?_=${Date.now()}`,{cache:"no-store",credentials:"omit",mode:"cors"});if(r.ok){const j=await r.json();const n=Array.isArray(j?.names)?j.names.join(", "):String(j?.name||"").trim();nameday=String(j?.message||j?.text||"").trim()||(n?`Ma ${n} ünnepli a névnapját — 20% kedvezmény.`:nameday);}}catch{}try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=47.4979&longitude=19.0402&current=temperature_2m,precipitation,weather_code&timezone=Europe%2FBudapest&_=${Date.now()}`,{cache:"no-store"});if(r.ok){const j=await r.json();weather={t:Number.isFinite(Number(j?.current?.temperature_2m))?Number(j.current.temperature_2m):null,p:Number(j?.current?.precipitation)||0,code:Number(j?.current?.weather_code)||0};}}catch{}updateCards();}
function sync(){if(!isSignage())return;document.querySelectorAll<HTMLElement>(".kleoRoamLayerV19,.kleoRoamLayerV20,.kleoRoamLayerV21,.kleoRoamLayerV22,.sgx-widgetDock-v3,.sgPricePanelV17,.sgInfoStripV17,.sgxInfoDockV13,.sgxInfoDockV14,.sgxInfoDockV15,.sgxInfoDockV16").forEach(el=>{el.style.setProperty("display","none","important")});ensureLayer();updateCards();renderPrices();}

export function installSignageNativeV23(){if(typeof window==="undefined"||typeof document==="undefined")return;if((window as any).__kleoSignageNativeV23Installed)return;(window as any).__kleoSignageNativeV23Installed=true;const start=()=>{if(!isSignage())return;sync();void loadPrices();void loadAux();if(!raf)raf=requestAnimationFrame(animate);if(!syncTimer)syncTimer=window.setInterval(sync,800);if(!priceTimer)priceTimer=window.setInterval(()=>void loadPrices(),5*60_000);if(!dataTimer)dataTimer=window.setInterval(()=>void loadAux(),10*60_000);};setTimeout(start,80);setTimeout(start,500);setTimeout(start,1500);window.addEventListener("resize",sync);window.addEventListener("focus",sync);}
