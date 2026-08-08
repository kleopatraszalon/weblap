import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WebsiteCmsConfig = {
  theme: { gold:string; goldSoft:string; magenta:string; magentaSoft:string; text:string; muted:string; background:string; surface:string; headingFont:string; bodyFont:string; radius:number };
  brand: { logoUrl:string; slogan:string };
  header: { bookingLabel:string; showLanguageSwitcher:boolean; facebookUrl:string; instagramUrl:string; tiktokUrl:string; messengerUrl:string };
  home: { heroKicker:string; heroTitlePrefix:string; heroTitleHighlight:string; heroTitleSuffix:string; heroLead:string; heroImageUrl:string; showFranchise:boolean; showApp:boolean; showVouchers:boolean; showNewsletter:boolean; showProducts:boolean; showServices:boolean; appTitle:string; appLead:string; newsletterTitle:string; newsletterLead:string; voucherTitle:string; voucherLead:string; productsTitle:string; productsLead:string; whyTitle:string; whyItems:string[] };
  footer: { privacyLabel:string; privacyUrl:string; cookieLabel:string; cookieUrl:string; complaintsLabel:string; complaintsUrl:string; imprintLabel:string; imprintUrl:string };
};

export const FALLBACK_WEBSITE_CONFIG: WebsiteCmsConfig = {
  theme:{gold:"#b69861",goldSoft:"#e3d8c3",magenta:"#ec008c",magentaSoft:"#f9c1d9",text:"#120c08",muted:"#5d5a55",background:"#ffffff",surface:"#ffffff",headingFont:"Montserrat",bodyFont:"Open Sans",radius:18},
  brand:{logoUrl:"/images/Logo.jpg",slogan:"Minden ami szépség, csak Neked!"},
  header:{bookingLabel:"Időpontfoglalás",showLanguageSwitcher:true,facebookUrl:"",instagramUrl:"",tiktokUrl:"",messengerUrl:""},
  home:{heroKicker:"KLEOPÁTRA SZÉPSÉGSZALONOK",heroTitlePrefix:"Minden ami ",heroTitleHighlight:"szépség",heroTitleSuffix:", csak Neked!",heroLead:"Foglalj időpontot online vagy telefonon, de szalonjainkba bejelentkezés nélkül is bátran betérhetsz.",heroImageUrl:"/images/home.png",showFranchise:true,showApp:true,showVouchers:true,showNewsletter:true,showProducts:true,showServices:true,appTitle:"Elindult mobil alkalmazásunk!",appLead:"Kövesd foglalásaidat, bérleteidet és vendégszámla-egyenlegedet, és értesülj személyre szabott ajánlatainkról.",newsletterTitle:"Iratkozz fel hírlevelünkre – 1500 Ft kedvezményt adunk",newsletterLead:"Értesülj akcióinkról és a regisztrált vendégeinknek szóló ajánlatokról.",voucherTitle:"Ajándékutalványaink",voucherLead:"Ajándékozz szépségélményt: utalványaink többek egy darab papírnál, valódi élményt adnak.",productsTitle:"KLEOS termékek",productsLead:"Stílusos, letisztult, egyedi megjelenés és a Kleos életérzés – válogass saját márkás termékeinkből.",whyTitle:"Miért válassz bennünket?",whyItems:["Mindent egy helyen megtalálsz a magabiztos megjelenésedhez.","Sok szolgáltatás, rugalmas időpontok és hosszú nyitvatartás.","Többféle fizetési mód, folyamatos kedvezmények és kuponok.","Online foglalás, mobilalkalmazás és személyre szabott ajánlatok."]},
  footer:{privacyLabel:"Adatvédelem",privacyUrl:"https://www.kleoszalon.hu/adatvedelem/",cookieLabel:"Cookie tájékoztató",cookieUrl:"https://www.kleoszalon.hu/cookie-tajekoztato/",complaintsLabel:"Panaszkezelési szabályzat",complaintsUrl:"https://www.kleoszalon.hu/panaszkezelesi-szabalyzat/",imprintLabel:"Impresszum",imprintUrl:"https://www.kleoszalon.hu/impresszum/"}
};

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000/api" : "https://kleoszalon-api-1.onrender.com/api";
const WebsiteCmsContext = createContext<WebsiteCmsConfig>(FALLBACK_WEBSITE_CONFIG);

function mergeConfig(raw:any): WebsiteCmsConfig {
  return {
    ...FALLBACK_WEBSITE_CONFIG,
    ...(raw || {}),
    theme:{...FALLBACK_WEBSITE_CONFIG.theme,...(raw?.theme || {})},
    brand:{...FALLBACK_WEBSITE_CONFIG.brand,...(raw?.brand || {})},
    header:{...FALLBACK_WEBSITE_CONFIG.header,...(raw?.header || {})},
    home:{...FALLBACK_WEBSITE_CONFIG.home,...(raw?.home || {})},
    footer:{...FALLBACK_WEBSITE_CONFIG.footer,...(raw?.footer || {})},
  };
}

function applyTheme(config: WebsiteCmsConfig) {
  const root = document.documentElement;
  const t = config.theme;
  root.style.setProperty("--cms-gold", t.gold);
  root.style.setProperty("--cms-gold-soft", t.goldSoft);
  root.style.setProperty("--cms-magenta", t.magenta);
  root.style.setProperty("--cms-magenta-soft", t.magentaSoft);
  root.style.setProperty("--cms-text", t.text);
  root.style.setProperty("--cms-muted", t.muted);
  root.style.setProperty("--cms-background", t.background);
  root.style.setProperty("--cms-surface", t.surface);
  root.style.setProperty("--cms-radius", `${Math.max(0, Math.min(40, Number(t.radius) || 0))}px`);
  root.style.setProperty("--cms-heading-font", `"${t.headingFont}", Montserrat, sans-serif`);
  root.style.setProperty("--cms-body-font", `"${t.bodyFont}", "Open Sans", sans-serif`);
}

export function WebsiteCmsProvider({children}:{children:React.ReactNode}) {
  const [config,setConfig] = useState<WebsiteCmsConfig>(FALLBACK_WEBSITE_CONFIG);
  useEffect(()=>{
    let alive=true;
    fetch(`${API_BASE}/public/website/config`)
      .then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status))))
      .then(data=>{if(alive)setConfig(mergeConfig(data?.config))})
      .catch(()=>{if(alive)setConfig(FALLBACK_WEBSITE_CONFIG)});
    return()=>{alive=false};
  },[]);
  useEffect(()=>applyTheme(config),[config]);
  const value=useMemo(()=>config,[config]);
  return <WebsiteCmsContext.Provider value={value}>{children}</WebsiteCmsContext.Provider>;
}

export const useWebsiteCms = () => useContext(WebsiteCmsContext);
