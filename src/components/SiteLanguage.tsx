import React,{useEffect,useState}from"react";

type SiteLanguage="hu"|"en"|"de"|"ru";
const KEY="kleo_site_language";
const LANGS:SiteLanguage[]=["hu","en","de","ru"];
const LABELS:Record<SiteLanguage,string>={hu:"HU",en:"EN",de:"DE",ru:"RU"};

declare global{interface Window{google?:any;googleTranslateElementInit?:()=>void}}

const readLanguage=():SiteLanguage=>{
  try{const value=localStorage.getItem(KEY)as SiteLanguage|null;if(value&&LANGS.includes(value))return value;}catch{}
  return"hu";
};

const setTranslateCookie=(lang:SiteLanguage)=>{
  const value=lang==="hu"?"":`/hu/${lang}`;
  const expires=lang==="hu"?"Thu, 01 Jan 1970 00:00:00 GMT":"Fri, 31 Dec 2038 23:59:59 GMT";
  document.cookie=`googtrans=${value};path=/;expires=${expires};SameSite=Lax`;
  const host=location.hostname;
  if(host.includes("."))document.cookie=`googtrans=${value};path=/;domain=.${host};expires=${expires};SameSite=Lax`;
};

export const selectSiteLanguage=(lang:SiteLanguage)=>{
  try{localStorage.setItem(KEY,lang);localStorage.setItem("kleo_lang","hu");}catch{}
  setTranslateCookie(lang);
  window.location.reload();
};

export const SiteLanguageBridge:React.FC=()=>{
  useEffect(()=>{
    const lang=readLanguage();
    document.documentElement.lang=lang;
    document.documentElement.setAttribute("data-site-language",lang);
    if(lang==="hu")return;

    setTranslateCookie(lang);
    const id="kleo-google-translate-script";
    window.googleTranslateElementInit=()=>{
      if(!window.google?.translate?.TranslateElement)return;
      const node=document.getElementById("kleo-google-translate");
      if(node&&!node.childNodes.length)new window.google.translate.TranslateElement({pageLanguage:"hu",includedLanguages:"hu,en,de,ru",autoDisplay:false},"kleo-google-translate");
    };
    if(window.google?.translate?.TranslateElement){window.googleTranslateElementInit();return;}
    if(!document.getElementById(id)){
      const script=document.createElement("script");script.id=id;script.async=true;script.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";document.head.appendChild(script);
    }
  },[]);
  return <div id="kleo-google-translate" aria-hidden="true" style={{position:"fixed",left:"-9999px",top:"-9999px",width:1,height:1,overflow:"hidden"}}/>;
};

export const SiteLanguageSwitcher:React.FC<{className?:string}>=({className="kleo-modern-lang"})=>{
  const[lang,setLang]=useState<SiteLanguage>("hu");
  useEffect(()=>setLang(readLanguage()),[]);
  return <div className={className} aria-label="Nyelv / Language / Sprache / Язык">
    {LANGS.map(value=><button key={value} type="button" className={lang===value?"is-active":""} aria-pressed={lang===value} title={value==="hu"?"Magyar":value==="en"?"English":value==="de"?"Deutsch":"Русский"} onClick={()=>{setLang(value);selectSiteLanguage(value)}}>{LABELS[value]}</button>)}
  </div>;
};

export const FloatingSiteLanguageSwitcher:React.FC=()=> <div className="kleo-floating-language"><SiteLanguageSwitcher className="kleo-floating-language__inner"/><style>{`.kleo-floating-language{position:fixed;right:18px;top:18px;z-index:9999;padding:6px;border:1px solid rgba(30,20,20,.12);border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 8px 30px rgba(25,15,20,.12);backdrop-filter:blur(12px)}.kleo-floating-language__inner{display:flex;gap:3px}.kleo-floating-language__inner button{width:38px;height:32px;border:0;border-radius:999px;background:transparent;color:#23191c;font:800 10px/1 Montserrat,Arial,sans-serif;letter-spacing:.05em;cursor:pointer}.kleo-floating-language__inner button.is-active{background:#201619;color:#fff}@media(max-width:640px){.kleo-floating-language{right:10px;top:10px}.kleo-floating-language__inner button{width:34px;height:30px}}`}</style></div>;

export default SiteLanguageBridge;
