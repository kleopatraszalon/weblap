import React from "react";

type SiteVisualMode = "classic" | "pearl" | "silver" | "kids";

const THEMES: Array<{mode:SiteVisualMode;icon:string;label:string}> = [
  {mode:"classic",icon:"◐",label:"Classic"},
  {mode:"pearl",icon:"✦",label:"Pearl"},
  {mode:"silver",icon:"◈",label:"Silver"},
  {mode:"kids",icon:"★",label:"KIDS"},
];

const STORAGE_KEY="kleo_site_visual_mode";
const isMode=(value:string|null):value is SiteVisualMode=>value==="classic"||value==="pearl"||value==="silver"||value==="kids";
const readMode=():SiteVisualMode=>{try{const v=localStorage.getItem(STORAGE_KEY);return isMode(v)?v:"classic"}catch{return "classic"}};

const CSS=String.raw`
.site-style-picker{position:fixed;right:18px;bottom:82px;z-index:2200;font-family:Montserrat,Arial,sans-serif}
.site-style-toggle{min-height:44px;display:flex;align-items:center;gap:8px;padding:0 13px;border:1px solid rgba(31,23,25,.14);border-radius:999px;background:rgba(255,255,255,.95);color:#21171a;box-shadow:0 10px 34px rgba(27,15,20,.14);backdrop-filter:blur(16px);cursor:pointer}
.site-style-toggle span{font-size:17px}.site-style-toggle b{font-size:10px;letter-spacing:.05em}.site-style-toggle i{font-style:normal;font-size:11px;opacity:.65}
.site-style-menu{position:absolute;right:0;bottom:52px;width:190px;padding:8px;border:1px solid rgba(31,23,25,.12);border-radius:18px;background:rgba(255,255,255,.98);box-shadow:0 22px 60px rgba(25,14,18,.2);backdrop-filter:blur(18px)}
.site-style-menu button{width:100%;min-height:44px;display:grid;grid-template-columns:26px 1fr 18px;align-items:center;gap:7px;padding:0 10px;border:0;border-radius:12px;background:transparent;color:#21171a;text-align:left;cursor:pointer}.site-style-menu button:hover,.site-style-menu button.active{background:#f7f0f3}.site-style-menu button span{font-size:17px}.site-style-menu button b{font-size:11px}.site-style-menu button i{font-style:normal;color:#ec008c}

html[data-site-visual="pearl"] body{background:#fffaf7;color:#33242a}
html[data-site-visual="pearl"] .kleo-modern-header,html[data-site-visual="pearl"] header{background:rgba(255,250,247,.94)!important}
html[data-site-visual="pearl"] .kleo-v3-hero,html[data-site-visual="pearl"] .b6hero,html[data-site-visual="pearl"] .b7hero{background:linear-gradient(135deg,#f4e6df,#fffaf7 56%,#e9d5c8)!important;color:#3d2b30!important}
html[data-site-visual="pearl"] .kleo-v3-hero *,html[data-site-visual="pearl"] .b6hero *,html[data-site-visual="pearl"] .b7hero *{color:inherit}
html[data-site-visual="pearl"] main,html[data-site-visual="pearl"] .b6,html[data-site-visual="pearl"] .b7{background:linear-gradient(#fffaf7,#fff 620px)!important}
html[data-site-visual="pearl"] .b6card,html[data-site-visual="pearl"] .b7card,html[data-site-visual="pearl"] article,html[data-site-visual="pearl"] .kleo-v3-service{border-color:#ead8d0!important;box-shadow:0 14px 40px rgba(132,99,83,.08)!important}
html[data-site-visual="pearl"] a:hover,html[data-site-visual="pearl"] button:hover{--site-accent:#c79a85}

html[data-site-visual="silver"] body{background:#f3f4f5;color:#202327}
html[data-site-visual="silver"] .kleo-modern-header,html[data-site-visual="silver"] header{background:rgba(244,245,246,.95)!important;border-color:#d8dadd!important}
html[data-site-visual="silver"] main,html[data-site-visual="silver"] .b6,html[data-site-visual="silver"] .b7{background:linear-gradient(#eceeef,#fff 660px)!important;color:#202327!important}
html[data-site-visual="silver"] .kleo-v3-hero,html[data-site-visual="silver"] .b6hero,html[data-site-visual="silver"] .b7hero{background:linear-gradient(135deg,#151719,#45494e)!important;color:#fff!important}
html[data-site-visual="silver"] .b6card,html[data-site-visual="silver"] .b7card,html[data-site-visual="silver"] article,html[data-site-visual="silver"] .kleo-v3-service{border-color:#d5d8dc!important;box-shadow:0 12px 32px rgba(24,27,30,.08)!important}
html[data-site-visual="silver"] .btn,html[data-site-visual="silver"] .b7btn,html[data-site-visual="silver"] .kleo-modern-header__cta{background:#2f3337!important;color:#fff!important}

html[data-site-visual="kids"] body{background:#fff8fd;color:#3f2c4d}
html[data-site-visual="kids"] body:before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(circle at 10% 18%,rgba(255,193,226,.35),transparent 22%),radial-gradient(circle at 88% 24%,rgba(183,225,255,.38),transparent 24%),radial-gradient(circle at 42% 90%,rgba(255,229,160,.28),transparent 22%)}
html[data-site-visual="kids"] .kleo-modern-header,html[data-site-visual="kids"] header{background:rgba(255,250,254,.95)!important;border-color:#f0cfe5!important}
html[data-site-visual="kids"] main,html[data-site-visual="kids"] .b6,html[data-site-visual="kids"] .b7{background:linear-gradient(135deg,#fff9fd,#f5fbff 55%,#fff9e9)!important;color:#3f2c4d!important}
html[data-site-visual="kids"] .kleo-v3-hero,html[data-site-visual="kids"] .b6hero,html[data-site-visual="kids"] .b7hero{background:linear-gradient(135deg,#ff8bc8,#8fd7ff 52%,#ffd66f)!important;color:#fff!important;border-radius:34px!important}
html[data-site-visual="kids"] .b6card,html[data-site-visual="kids"] .b7card,html[data-site-visual="kids"] article,html[data-site-visual="kids"] .kleo-v3-service{border:2px solid #f5d5e8!important;border-radius:26px!important;box-shadow:0 12px 32px rgba(153,102,153,.1)!important}
html[data-site-visual="kids"] button,html[data-site-visual="kids"] input,html[data-site-visual="kids"] select,html[data-site-visual="kids"] textarea{border-radius:16px!important}
html[data-site-visual="kids"] .btn,html[data-site-visual="kids"] .b7btn,html[data-site-visual="kids"] .kleo-modern-header__cta{background:linear-gradient(135deg,#ef4fa4,#8f77ef)!important;color:#fff!important;border:none!important}
html[data-site-visual="kids"] h1,html[data-site-visual="kids"] h2,html[data-site-visual="kids"] h3{letter-spacing:-.02em}
html[data-site-visual="kids"] .site-style-toggle{background:linear-gradient(135deg,#fff,#fff4fb);border:2px solid #f0cce2}

@media(max-width:680px){.site-style-picker{right:10px;bottom:72px}.site-style-toggle{min-height:40px;padding:0 11px}.site-style-menu{width:172px}}
`;

export function SiteStyleSwitcher(){
  const[mode,setMode]=React.useState<SiteVisualMode>(()=>typeof window==="undefined"?"classic":readMode());
  const[open,setOpen]=React.useState(false);

  React.useEffect(()=>{
    document.documentElement.dataset.siteVisual=mode;
    try{localStorage.setItem(STORAGE_KEY,mode)}catch{}
    window.dispatchEvent(new CustomEvent("kleo-site-style-change",{detail:{mode}}));
    return()=>{};
  },[mode]);

  React.useEffect(()=>{
    const close=(e:MouseEvent)=>{const target=e.target as HTMLElement|null;if(target&&!target.closest(".site-style-picker"))setOpen(false)};
    document.addEventListener("click",close);
    return()=>document.removeEventListener("click",close);
  },[]);

  const current=THEMES.find(x=>x.mode===mode)||THEMES[0];
  return <><style data-kleo-site-style>{CSS}</style><div className="site-style-picker">
    <button type="button" className="site-style-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Stílus választása" title="Stílus választása"><span>{current.icon}</span><b>{current.label}</b><i>⌄</i></button>
    {open&&<div className="site-style-menu" role="menu" aria-label="Weboldal stílusa">{THEMES.map(item=><button key={item.mode} type="button" role="menuitemradio" aria-checked={mode===item.mode} className={mode===item.mode?"active":""} onClick={()=>{setMode(item.mode);setOpen(false)}}><span>{item.icon}</span><b>{item.label}</b><i>{mode===item.mode?"✓":""}</i></button>)}</div>}
  </div></>;
}

export default SiteStyleSwitcher;
