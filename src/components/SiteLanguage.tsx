import React,{useEffect,useMemo,useState}from"react";

type SiteLanguage="hu"|"en"|"de"|"ru";
const KEY="kleo_site_language";
const LANGS:SiteLanguage[]=["hu","en","de","ru"];
const LABELS:Record<SiteLanguage,string>={hu:"HU",en:"EN",de:"DE",ru:"RU"};
const NAMES:Record<SiteLanguage,string>={hu:"Magyar",en:"English",de:"Deutsch",ru:"Русский"};

declare global{interface Window{google?:any;googleTranslateElementInit?:()=>void}}

const readLanguage=():SiteLanguage=>{
  try{const value=localStorage.getItem(KEY)as SiteLanguage|null;if(value&&LANGS.includes(value))return value;}catch{}
  return"hu";
};

const setTranslateCookie=(lang:SiteLanguage)=>{
  const value=lang==="hu"?"":`/hu/${lang}`;
  const expires=lang==="hu"?"Thu, 01 Jan 1970 00:00:00 GMT":"Fri, 31 Dec 2038 23:59:59 GMT";
  const attrs=`path=/;expires=${expires};SameSite=Lax`;
  document.cookie=`googtrans=${value};${attrs}`;
  const host=location.hostname;
  if(host.includes("."))document.cookie=`googtrans=${value};path=/;domain=.${host};expires=${expires};SameSite=Lax`;
};

const forceHungarianSource=()=>{
  try{localStorage.setItem("kleo_lang","hu");}catch{}
};

export const selectSiteLanguage=(lang:SiteLanguage)=>{
  try{localStorage.setItem(KEY,lang);}catch{}
  forceHungarianSource();
  setTranslateCookie(lang);
  window.location.reload();
};

const translateSeo=(lang:SiteLanguage)=>{
  const defaults={
    hu:{title:"Kleopátra Szépségszalonok",description:"Kleopátra Szépségszalonok – fodrászat, kozmetika, kéz- és lábápolás, masszázs, online időpontfoglalás és webshop."},
    en:{title:"Kleopátra Beauty Salons",description:"Kleopátra Beauty Salons – hairdressing, beauty treatments, hand and foot care, massage, online booking and webshop."},
    de:{title:"Kleopátra Schönheitssalons",description:"Kleopátra Schönheitssalons – Friseur, Kosmetik, Hand- und Fußpflege, Massage, Online-Terminbuchung und Webshop."},
    ru:{title:"Салоны красоты Kleopátra",description:"Салоны красоты Kleopátra – парикмахерские услуги, косметология, уход за руками и ногами, массаж, онлайн-запись и интернет-магазин."},
  }[lang];
  if(!document.title||/Kleopátra|Kleopatra/i.test(document.title))document.title=defaults.title;
  let meta=document.head.querySelector('meta[name="description"]')as HTMLMetaElement|null;
  if(!meta){meta=document.createElement("meta");meta.name="description";document.head.appendChild(meta);}
  if(!meta.content||/Kleopátra|Kleopatra/i.test(meta.content))meta.content=defaults.description;
};

const patchAccessibility=(root:ParentNode=document)=>{
  const lang=readLanguage();
  const ui:Record<SiteLanguage,Record<string,string>>={
    hu:{"Nyelvválasztó":"Nyelvválasztó","Menü megnyitása":"Menü megnyitása","Menü bezárása":"Menü bezárása","Fő navigáció":"Fő navigáció","Gyors linkek":"Gyors linkek","Közösségi oldalak":"Közösségi oldalak"},
    en:{"Nyelvválasztó":"Language selector","Menü megnyitása":"Open menu","Menü bezárása":"Close menu","Fő navigáció":"Main navigation","Gyors linkek":"Quick links","Közösségi oldalak":"Social media"},
    de:{"Nyelvválasztó":"Sprachauswahl","Menü megnyitása":"Menü öffnen","Menü bezárása":"Menü schließen","Fő navigáció":"Hauptnavigation","Gyors linkek":"Schnellzugriffe","Közösségi oldalak":"Soziale Medien"},
    ru:{"Nyelvválasztó":"Выбор языка","Menü megnyitása":"Открыть меню","Menü bezárása":"Закрыть меню","Fő navigáció":"Основная навигация","Gyors linkek":"Быстрые ссылки","Közösségi oldalak":"Социальные сети"},
  };
  root.querySelectorAll?.("[aria-label],[title],[placeholder]").forEach((el:any)=>{
    ["aria-label","title","placeholder"].forEach(attr=>{const v=el.getAttribute?.(attr);if(v&&ui[lang][v])el.setAttribute(attr,ui[lang][v]);});
  });
};

const hideGoogleChrome=()=>{
  document.documentElement.style.top="0px";
  document.body.style.top="0px";
  const styleId="kleo-google-translate-hide";
  if(document.getElementById(styleId))return;
  const style=document.createElement("style");style.id=styleId;style.textContent=`.goog-te-banner-frame.skiptranslate,.goog-te-banner-frame,#goog-gt-tt,.goog-te-balloon-frame{display:none!important}body{top:0!important}.goog-text-highlight{background:transparent!important;box-shadow:none!important}`;document.head.appendChild(style);
};

export const SiteLanguageBridge:React.FC=()=>{
  useEffect(()=>{
    const lang=readLanguage();
    document.documentElement.lang=lang;
    document.documentElement.setAttribute("data-site-language",lang);
    document.documentElement.setAttribute("translate","yes");
    forceHungarianSource();
    translateSeo(lang);
    patchAccessibility();
    hideGoogleChrome();

    const observer=new MutationObserver(records=>{
      for(const record of records)for(const node of Array.from(record.addedNodes))if(node instanceof Element)patchAccessibility(node);
      hideGoogleChrome();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});

    if(lang==="hu"){
      setTranslateCookie("hu");
      return()=>observer.disconnect();
    }

    setTranslateCookie(lang);
    const id="kleo-google-translate-script";
    window.googleTranslateElementInit=()=>{
      if(!window.google?.translate?.TranslateElement)return;
      const node=document.getElementById("kleo-google-translate");
      if(node&&!node.childNodes.length)new window.google.translate.TranslateElement({pageLanguage:"hu",includedLanguages:"hu,en,de,ru",autoDisplay:false,multilanguagePage:false},"kleo-google-translate");
      hideGoogleChrome();
    };
    if(window.google?.translate?.TranslateElement)window.googleTranslateElementInit();
    else if(!document.getElementById(id)){
      const script=document.createElement("script");script.id=id;script.async=true;script.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";document.head.appendChild(script);
    }
    return()=>observer.disconnect();
  },[]);
  return <div id="kleo-google-translate" aria-hidden="true" style={{position:"fixed",left:"-9999px",top:"-9999px",width:1,height:1,overflow:"hidden"}}/>;
};

export const SiteLanguageSwitcher:React.FC<{className?:string}>=({className="kleo-modern-lang"})=>{
  const[lang,setLang]=useState<SiteLanguage>("hu");
  useEffect(()=>setLang(readLanguage()),[]);
  const aria=useMemo(()=>lang==="hu"?"Nyelvválasztó":lang==="en"?"Language selector":lang==="de"?"Sprachauswahl":"Выбор языка",[lang]);
  return <div className={className} aria-label={aria}>
    {LANGS.map(value=><button key={value} type="button" className={lang===value?"is-active":""} aria-pressed={lang===value} title={NAMES[value]} onClick={()=>{setLang(value);selectSiteLanguage(value)}}>{LABELS[value]}</button>)}
  </div>;
};

export const FloatingSiteLanguageSwitcher:React.FC=()=> <div className="kleo-floating-language"><SiteLanguageSwitcher className="kleo-floating-language__inner"/><style>{`.kleo-floating-language{position:fixed;right:18px;top:18px;z-index:9999;padding:6px;border:1px solid rgba(30,20,20,.12);border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 30px rgba(25,15,20,.12);backdrop-filter:blur(12px)}.kleo-floating-language__inner{display:flex;gap:3px}.kleo-floating-language__inner button{width:38px;height:32px;border:0;border-radius:999px;background:transparent;color:#23191c;font:800 10px/1 Montserrat,Arial,sans-serif;letter-spacing:.05em;cursor:pointer}.kleo-floating-language__inner button.is-active{background:#201619;color:#fff}@media(max-width:640px){.kleo-floating-language{right:10px;top:10px}.kleo-floating-language__inner button{width:34px;height:30px}}`}</style></div>;

export default SiteLanguageBridge;
