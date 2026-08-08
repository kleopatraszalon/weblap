import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../../apiClient";
import { SignagePage } from "../SignagePage";
import "./signageExperience.css";

type Appearance = {
  template:string;
  colors:{background:string;surface:string;surfaceAlt:string;text:string;muted:string;gold:string;accent:string;success:string};
  effects:{glow:number;blur:number;radius:number;contrast:number;motion:string;ambient:boolean;scanlines:boolean};
  popup:{enabled:boolean;intervalSec:number;durationSec:number;initialDelaySec:number;source:string;animation:string;showPrice:boolean};
};
type Promo = { id?:string; title:string; body?:string; subtitle?:string; price_text?:string };

const FALLBACK:Appearance={template:"classic",colors:{background:"#09070a",surface:"#171219",surfaceAlt:"#211720",text:"#fffaf5",muted:"#cfc4c8",gold:"#b69861",accent:"#ec008c",success:"#41d67c"},effects:{glow:32,blur:18,radius:26,contrast:1,motion:"medium",ambient:true,scanlines:false},popup:{enabled:true,intervalSec:180,durationSec:12,initialDelaySec:45,source:"flash_then_deal",animation:"impact",showPrice:true}};
const merge=(x:any):Appearance=>({...FALLBACK,...x,colors:{...FALLBACK.colors,...(x?.colors||{})},effects:{...FALLBACK.effects,...(x?.effects||{})},popup:{...FALLBACK.popup,...(x?.popup||{})}});
async function getJson(path:string){const r=await fetch(`${API_BASE}${path}`,{cache:"no-store",credentials:"omit",headers:{Accept:"application/json"}});if(!r.ok)throw new Error(String(r.status));return r.json()}

export function SignageExperience(){
  const[appearance,setAppearance]=useState<Appearance>(FALLBACK);const[popup,setPopup]=useState<Promo|null>(null);const[offers,setOffers]=useState<Promo[]>([]);const offerIndex=useRef(0);
  useEffect(()=>{let live=true;const load=async()=>{try{const [a,flash,deals]=await Promise.all([getJson("/api/signage/appearance"),getJson("/api/signage/flash").catch(()=>({})),getJson("/api/signage/deals").catch(()=>({deals:[]}))]);if(!live)return;const cfg=merge(a?.config);setAppearance(cfg);const arr:Promo[]=[];if(cfg.popup.source!=="deal"&&flash?.flash)arr.push({id:flash.flash.id,title:flash.flash.title,body:flash.flash.body});if(cfg.popup.source!=="flash"&&Array.isArray(deals?.deals))deals.deals.forEach((d:any)=>arr.push({id:d.id,title:d.title,body:d.subtitle,price_text:d.price_text}));setOffers(arr)}catch{}};void load();const t=window.setInterval(load,60000);return()=>{live=false;window.clearInterval(t)}},[]);
  useEffect(()=>{if(!appearance.popup.enabled||!offers.length)return;let closeTimer:number|undefined;const show=()=>{const current=offers[offerIndex.current%offers.length];offerIndex.current+=1;setPopup(current);if(closeTimer)window.clearTimeout(closeTimer);closeTimer=window.setTimeout(()=>setPopup(null),Math.max(5,appearance.popup.durationSec)*1000)};const first=window.setTimeout(show,Math.max(10,appearance.popup.initialDelaySec)*1000);const repeat=window.setInterval(show,Math.max(45,appearance.popup.intervalSec)*1000);return()=>{window.clearTimeout(first);window.clearInterval(repeat);if(closeTimer)window.clearTimeout(closeTimer)}},[appearance.popup.enabled,appearance.popup.initialDelaySec,appearance.popup.intervalSec,appearance.popup.durationSec,offers]);
  const vars=useMemo(()=>({"--sgx-bg":appearance.colors.background,"--sgx-surface":appearance.colors.surface,"--sgx-surface2":appearance.colors.surfaceAlt,"--sgx-text":appearance.colors.text,"--sgx-muted":appearance.colors.muted,"--sgx-gold":appearance.colors.gold,"--sgx-accent":appearance.colors.accent,"--sgx-success":appearance.colors.success,"--sgx-radius":`${appearance.effects.radius}px`,"--sgx-glow":`${appearance.effects.glow}px`,"--sgx-blur":`${appearance.effects.blur}px`} as React.CSSProperties),[appearance]);
  return <div className={`sgx sgx-${appearance.template} ${appearance.effects.ambient?"sgx-ambient":""} ${appearance.effects.scanlines?"sgx-scanlines":""}`} style={vars}><SignagePage/>{popup&&<div className={`sgx-popup sgx-popup-${appearance.popup.animation}`}><div className="sgx-popup-backdrop"/><section><span>KLEOPÁTRA · AJÁNLAT</span><h2>{popup.title}</h2>{(popup.body||popup.subtitle)&&<p>{popup.body||popup.subtitle}</p>}{appearance.popup.showPrice&&popup.price_text&&<strong>{popup.price_text}</strong>}<i>Automatikusan eltűnik</i></section></div>}</div>
}

export default SignageExperience;
