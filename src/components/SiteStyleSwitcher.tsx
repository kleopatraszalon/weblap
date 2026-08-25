import React from "react";
import "./SiteStyleSwitcher.css";

type SiteVisualMode = "classic" | "pearl" | "silver" | "kids" | "noir" | "rose-gold" | "aqua" | "zen";
const THEMES: Array<{mode:SiteVisualMode;icon:string;label:string;color:string}> = [
  {mode:"classic",icon:"◐",label:"Classic",color:"#ec008c"},
  {mode:"pearl",icon:"✦",label:"Pearl",color:"#b36ad8"},
  {mode:"silver",icon:"◈",label:"Silver",color:"#9fa4aa"},
  {mode:"kids",icon:"★",label:"KIDS",color:"#8fd7ff"},
  {mode:"noir",icon:"◆",label:"Noir",color:"#c8a96b"},
  {mode:"rose-gold",icon:"◇",label:"Rose Gold",color:"#c98f86"},
  {mode:"aqua",icon:"≈",label:"Aqua",color:"#25a9b8"},
  {mode:"zen",icon:"○",label:"Zen",color:"#7d9270"},
];
const STORAGE_KEY="kleo_site_visual_mode";
const isMode=(value:string|null):value is SiteVisualMode=>THEMES.some(theme=>theme.mode===value);
const readMode=():SiteVisualMode=>{try{const value=localStorage.getItem(STORAGE_KEY);return isMode(value)?value:"classic"}catch{return "classic"}};

export function SiteStyleSwitcher(){
  const[mode,setMode]=React.useState<SiteVisualMode>(()=>typeof window==="undefined"?"classic":readMode());
  const[open,setOpen]=React.useState(false);
  const pickerRef=React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(()=>{document.documentElement.dataset.siteVisual=mode;try{localStorage.setItem(STORAGE_KEY,mode)}catch{}window.dispatchEvent(new CustomEvent("kleo-site-style-change",{detail:{mode}}))},[mode]);
  React.useEffect(()=>{const close=(event:MouseEvent)=>{if(!pickerRef.current?.contains(event.target as Node))setOpen(false)};const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};document.addEventListener("click",close);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("click",close);document.removeEventListener("keydown",escape)}},[]);
  const current=THEMES.find(theme=>theme.mode===mode)??THEMES[0];
  return <><div className="site-theme-atmosphere" aria-hidden="true">
    <div className="theme-orb theme-orb-a"/><div className="theme-orb theme-orb-b"/><div className="theme-grid"/><div className="theme-scan"/><div className="theme-ring"><i/><i/><i/><i/></div><div className="theme-wave theme-wave-a"/><div className="theme-wave theme-wave-b"/><div className="theme-noir-line"/><div className="theme-zen-stone"/>
    <div className="theme-kids-animals"><img src="/images/kiosk/kids/bunny.gif" alt=""/><img src="/images/kiosk/kids/bear.gif" alt=""/><img src="/images/kiosk/kids/fox.gif" alt=""/><span>Szia! Válassz velünk! ✨</span></div>
  </div><div className="site-style-picker" ref={pickerRef}>
    <button type="button" className="site-style-toggle" onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-haspopup="menu" aria-label={`Weboldal stílusa: ${current.label}`} title="Weboldal stílusa"><span>{current.icon}</span><b>{current.label}</b><i aria-hidden="true">⌄</i></button>
    {open&&<div className="site-style-menu" role="menu" aria-label="Weboldal stílusa">{THEMES.map(item=><button key={item.mode} type="button" role="menuitemradio" aria-checked={mode===item.mode} className={mode===item.mode?"active":""} onClick={()=>{setMode(item.mode);setOpen(false)}}><span style={{color:item.color}}>{item.icon}</span><b>{item.label}</b><i>{mode===item.mode?"✓":""}</i></button>)}</div>}
  </div></>;
}
export default SiteStyleSwitcher;
