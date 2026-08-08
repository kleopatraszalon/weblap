import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WebsitePageContent = {
  eyebrow:string;
  titlePrefix:string;
  titleHighlight:string;
  titleSuffix:string;
  lead:string;
  imageUrl:string;
  sectionTitle:string;
  sectionLead:string;
};

export type WebsiteCmsConfig = {
  theme: { gold:string; goldSoft:string; magenta:string; magentaSoft:string; text:string; muted:string; background:string; surface:string; headingFont:string; bodyFont:string; radius:number };
  brand: { logoUrl:string; slogan:string };
  header: { bookingLabel:string; showLanguageSwitcher:boolean; facebookUrl:string; instagramUrl:string; tiktokUrl:string; messengerUrl:string };
  home: { heroKicker:string; heroTitlePrefix:string; heroTitleHighlight:string; heroTitleSuffix:string; heroLead:string; heroImageUrl:string; showFranchise:boolean; showApp:boolean; showVouchers:boolean; showNewsletter:boolean; showProducts:boolean; showServices:boolean; appTitle:string; appLead:string; newsletterTitle:string; newsletterLead:string; voucherTitle:string; voucherLead:string; productsTitle:string; productsLead:string; whyTitle:string; whyItems:string[] };
  pages: Record<string,WebsitePageContent>;
  footer: { privacyLabel:string; privacyUrl:string; cookieLabel:string; cookieUrl:string; complaintsLabel:string; complaintsUrl:string; imprintLabel:string; imprintUrl:string };
};

const page = (eyebrow:string,titlePrefix:string,titleHighlight:string,titleSuffix:string,lead:string,imageUrl:string,sectionTitle:string,sectionLead:string):WebsitePageContent => ({eyebrow,titlePrefix,titleHighlight,titleSuffix,lead,imageUrl,sectionTitle,sectionLead});

const FALLBACK_PAGES:Record<string,WebsitePageContent> = {
  salons: page("Szalonjaink","Jelenleg ","7 helyszínen"," várunk","Budapesten és vidéki városokban is megtalálsz bennünket. Foglalhatsz online, de szalonjaink működésének fontos része a rugalmas, akár bejelentkezés nélküli vendégfogadás is.","/images/szalonok.jpg","Válaszd ki a hozzád legközelebbi szalont","A szalon adatlapján megtalálod az elérhető szolgáltatásokat, szakembereket és a foglaláshoz szükséges információkat."),
  services: page("Szolgáltatások","Minden, ami szépség – ","egy helyen","","A Kleopátra Szépségszalonok célja, hogy több szépségápolási területet egy helyen érj el, rugalmas időpontfoglalással és szalononként összeállított szolgáltatáskínálattal.","/images/szolgaltatasok.jpg","Válaszd ki, mire van szükséged","A pontos kínálat és az elérhető szakemberek szalononként eltérhetnek; a foglalási rendszer mindig az aktuális lehetőségeket mutatja."),
  prices: page("Árlista","Aktuális szolgáltatások és ","árak","","Válaszd ki a szalont, és nézd meg az ott elérhető szolgáltatásokat, időtartamokat és árakat. A lista a központi rendszer aktuális adataiból töltődik.","/images/szolgaltatasok.jpg","Árlista szalononként","Az árak forintban értendők; az időszakos ajánlatok feltételei eltérhetnek."),
  loyalty: page("Hűségprogram","Több előny a ","visszatérő vendégeknek","","A Kleopátra hűségvilága nem egyetlen kedvezményből áll: kártyák, kuponok, bérletek, vendégszámla és időszakos ajánlatok kapcsolódhatnak a regisztrált vendégfiókhoz.","/images/husegprogram.png","Egy rendszerben a kedvezmények és vendégelőnyök","Az egyes kedvezmények feltételei, időtartama és összevonhatósága kampányonként eltérhetnek."),
  franchise: page("Franchise","Építs szépségszalont ","biztosabb rendszerrel","","A Kleopátra franchise befektetőknek, karrierváltóknak, szépségipari szakembereknek és már működő szalont vezetőknek kínál felépített márka- és működési hátteret.","/images/franchise.jpg","Négy tipikus belépési helyzet","A program akkor is releváns lehet, ha nem szépségipari szakemberként érkezel, de üzleti szemlélettel és vezetői ambícióval építenél szalont."),
  career: page("Kleo Team Karrier","A te sikered a ","mi sikerünk is","","Olyan szakembereket és ügyfélközpontú kollégákat keresünk, akik hosszú távon szeretnének stabil, fejlődő és professzionális szépségipari környezetben dolgozni.","/images/rolunk.jpg","Folyamatosan bővülő csapat","A konkrét nyitott helyek szalononként változhatnak. Az alábbi munkakörök rendszeresen megjelennek a hálózatban."),
  training: page("KLEO ACADEMY","Tanulj, fejlődj, építs ","szépségipari karriert","","A KLEO ACADEMY célja a gyakorlatban is használható tudás átadása. A képzési kínálatban rövid, célzott szakmai tanfolyamok és tanulói gyakorlati lehetőségek is megjelennek.","/images/oktatas.jpg","Gyakorlatorientált szakmai tanfolyamok","A pontos indulási időpontok, helyszínek, részvételi díjak és feltételek képzésenként változhatnak."),
  about: page("Rólunk","Több mint szalon: ","Kleopátra élmény","","Több mint három évtizede azon dolgozunk, hogy a vendégek minél több szépségápolási szolgáltatást érjenek el egy helyen, kiszámítható minőségben, rugalmasan és egységes márkakörnyezetben.","/images/rolunk.jpg","Egyszerűbbé tenni a szépségápolást","Olyan szépségszalon-hálózatot építünk, ahol a vendég több szolgáltatáshoz, több szakemberhez és több megoldáshoz fér hozzá egy helyen."),
  contact: page("Kapcsolat","Miben segíthetünk ","Neked?","","Időpontfoglalás, szolgáltatás, franchise, karrier, oktatás vagy vendégvisszajelzés – válaszd ki a témát, hogy a megfelelő helyre kerülhessen a kérésed.","/images/home.png","Lépj velünk kapcsolatba","Add meg a legfontosabb adatokat és válaszd ki, milyen témában keresel bennünket.")
};

export const FALLBACK_WEBSITE_CONFIG: WebsiteCmsConfig = {
  theme:{gold:"#b69861",goldSoft:"#e3d8c3",magenta:"#ec008c",magentaSoft:"#f9c1d9",text:"#120c08",muted:"#5d5a55",background:"#ffffff",surface:"#ffffff",headingFont:"Montserrat",bodyFont:"Open Sans",radius:18},
  brand:{logoUrl:"/images/Logo.jpg",slogan:"Minden ami szépség, csak Neked!"},
  header:{bookingLabel:"Időpontfoglalás",showLanguageSwitcher:true,facebookUrl:"",instagramUrl:"",tiktokUrl:"",messengerUrl:""},
  home:{heroKicker:"KLEOPÁTRA SZÉPSÉGSZALONOK",heroTitlePrefix:"Minden ami ",heroTitleHighlight:"szépség",heroTitleSuffix:", csak Neked!",heroLead:"Foglalj időpontot online vagy telefonon, de szalonjainkba bejelentkezés nélkül is bátran betérhetsz.",heroImageUrl:"/images/home.png",showFranchise:true,showApp:true,showVouchers:true,showNewsletter:true,showProducts:true,showServices:true,appTitle:"Elindult mobil alkalmazásunk!",appLead:"Kövesd foglalásaidat, bérleteidet és vendégszámla-egyenlegedet, és értesülj személyre szabott ajánlatainkról.",newsletterTitle:"Iratkozz fel hírlevelünkre – 1500 Ft kedvezményt adunk",newsletterLead:"Értesülj akcióinkról és a regisztrált vendégeinknek szóló ajánlatokról.",voucherTitle:"Ajándékutalványaink",voucherLead:"Ajándékozz szépségélményt: utalványaink többek egy darab papírnál, valódi élményt adnak.",productsTitle:"KLEOS termékek",productsLead:"Stílusos, letisztult, egyedi megjelenés és a Kleos életérzés – válogass saját márkás termékeinkből.",whyTitle:"Miért válassz bennünket?",whyItems:["Mindent egy helyen megtalálsz a magabiztos megjelenésedhez.","Sok szolgáltatás, rugalmas időpontok és hosszú nyitvatartás.","Többféle fizetési mód, folyamatos kedvezmények és kuponok.","Online foglalás, mobilalkalmazás és személyre szabott ajánlatok."]},
  pages:FALLBACK_PAGES,
  footer:{privacyLabel:"Adatvédelem",privacyUrl:"https://www.kleoszalon.hu/adatvedelem/",cookieLabel:"Cookie tájékoztató",cookieUrl:"https://www.kleoszalon.hu/cookie-tajekoztato/",complaintsLabel:"Panaszkezelési szabályzat",complaintsUrl:"https://www.kleoszalon.hu/panaszkezelesi-szabalyzat/",imprintLabel:"Impresszum",imprintUrl:"https://www.kleoszalon.hu/impresszum/"}
};

const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5000/api" : "https://kleoszalon-api-1.onrender.com/api";
const WebsiteCmsContext = createContext<WebsiteCmsConfig>(FALLBACK_WEBSITE_CONFIG);

function mergeConfig(raw:any): WebsiteCmsConfig {
  const rawPages = raw?.pages || {};
  const pages:Record<string,WebsitePageContent> = {};
  Object.keys(FALLBACK_PAGES).forEach(key => { pages[key] = {...FALLBACK_PAGES[key],...(rawPages[key] || {})}; });
  Object.keys(rawPages).forEach(key => { if (!pages[key]) pages[key] = rawPages[key]; });
  return {
    ...FALLBACK_WEBSITE_CONFIG,
    ...(raw || {}),
    theme:{...FALLBACK_WEBSITE_CONFIG.theme,...(raw?.theme || {})},
    brand:{...FALLBACK_WEBSITE_CONFIG.brand,...(raw?.brand || {})},
    header:{...FALLBACK_WEBSITE_CONFIG.header,...(raw?.header || {})},
    home:{...FALLBACK_WEBSITE_CONFIG.home,...(raw?.home || {})},
    pages,
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
