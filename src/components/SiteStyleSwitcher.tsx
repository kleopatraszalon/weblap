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

const THEME_POLISH_CSS=String.raw`
/* A Classic szándékosan érintetlen. A többi téma külön kontraszt- és képi karaktert kap. */
html[data-site-visual="pearl"]{--st-muted:#5c5367;--st-link:#8d3e8d;--st-hero-ink:#312b36;--st-on-ink:#fffafc}
html[data-site-visual="silver"]{--st-muted:#d6d3ce;--st-link:#ff79bc;--st-hero-ink:#fff;--st-on-ink:#fff}
html[data-site-visual="kids"]{--st-muted:#59476a;--st-link:#c51d78;--st-hero-ink:#fff;--st-on-ink:#fff}
html[data-site-visual="noir"]{--st-muted:#d6cec3;--st-link:#d3b477;--st-hero-ink:#f7f1e8;--st-on-ink:#f7f1e8}
html[data-site-visual="rose-gold"]{--st-muted:#67494a;--st-link:#9d4f5c;--st-hero-ink:#fff;--st-on-ink:#fff}
html[data-site-visual="aqua"]{--st-muted:#31585d;--st-link:#0d7784;--st-hero-ink:#fff;--st-on-ink:#fff}
html[data-site-visual="zen"]{--st-muted:#52604f;--st-link:#536747;--st-hero-ink:#f5f6ef;--st-on-ink:#f5f6ef}

html[data-site-visual]:not([data-site-visual="classic"]) main{color:var(--st-ink)!important}
html[data-site-visual]:not([data-site-visual="classic"]) main :where(h1,h2,h3,h4,h5,h6,strong){color:var(--st-ink)!important}
html[data-site-visual]:not([data-site-visual="classic"]) main :where(p,li,small,label,blockquote,figcaption){color:var(--st-muted)!important}
html[data-site-visual]:not([data-site-visual="classic"]) main a:not(.kleo-v3-btn):not(.btn):not(.b7btn){color:var(--st-link)!important}
html[data-site-visual]:not([data-site-visual="classic"]) :is(.kleo-v3-hero,.b6hero,.b7hero) :where(h1,h2,h3,h4,p,small,strong,em,.kleo-v3-eyebrow,.kleo-v3-hero__meta span){color:var(--st-hero-ink)!important;text-shadow:0 1px 1px rgba(0,0,0,.08)}
html[data-site-visual]:not([data-site-visual="classic"]) .kleo-v3-section--ink{background:color-mix(in srgb,var(--st-ink) 92%,#000)!important}
html[data-site-visual]:not([data-site-visual="classic"]) .kleo-v3-section--ink :where(h1,h2,h3,p,span,strong,a,small){color:var(--st-on-ink)!important}
html[data-site-visual]:not([data-site-visual="classic"]) .kleo-v3-eyebrow{color:var(--st-accent)!important;font-weight:800}

/* Minden nem-Classic hero pontosan a Classic frame méretét és geometriáját használja. */
html[data-site-visual]:not([data-site-visual="classic"]) .kleo-v3-hero__image{position:absolute!important;inset:0 -84px 0 0!important;overflow:hidden!important;border-radius:42% 0 0 8%!important;background:#eee6dc!important;box-shadow:0 30px 80px rgba(18,12,8,.14)!important;isolation:isolate}
html[data-site-visual]:not([data-site-visual="classic"]) .kleo-v3-hero__image img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transform:none!important;clip-path:none!important;border-radius:0!important;outline:0!important;box-shadow:none!important}

/* Teljesen új, 2026-os hero-portrék; egyetlen korábbi hero/arc asset sem kerül újra felhasználásra. */
html[data-site-visual="pearl"] .kleo-v3-hero__image img{content:url('/images/themes/pearl-luminous-beauty.svg');filter:saturate(.96) contrast(.98) brightness(1.03)}
html[data-site-visual="silver"] .kleo-v3-hero__image{background:#05070a!important;box-shadow:0 30px 85px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.16),0 0 52px rgba(236,0,140,.22)!important}
html[data-site-visual="silver"] .kleo-v3-hero__image img{content:url('/images/themes/silver-cyber-glam.svg');filter:contrast(1.08) saturate(1.05) brightness(.98);object-position:50% 50%!important}
html[data-site-visual="silver"] .kleo-v3-hero__image:after{content:"CYBER BEAUTY / 2026";position:absolute;right:16px;bottom:16px;padding:8px 10px;background:rgba(5,7,10,.86);color:#fff;border:1px solid rgba(236,0,140,.78);font:700 8px/1 ui-monospace,monospace;letter-spacing:.18em;z-index:5;box-shadow:0 0 22px rgba(236,0,140,.26)}
html[data-site-visual="kids"] .kleo-v3-hero__image img{content:url('/images/themes/kids-playful-child.svg');filter:saturate(1.06) brightness(1.02)}
html[data-site-visual="noir"] .kleo-v3-hero__image img{content:url('/images/themes/noir-couture-beauty.svg');filter:contrast(1.05) brightness(.96)}
html[data-site-visual="rose-gold"] .kleo-v3-hero__image img{content:url('/images/themes/rose-gold-soft-glam.svg');filter:saturate(.98) brightness(1.01)}
html[data-site-visual="aqua"] .kleo-v3-hero__image img{content:url('/images/themes/aqua-fresh-beauty.svg');filter:saturate(1.02) brightness(1.01)}
html[data-site-visual="zen"] .kleo-v3-hero__image img{content:url('/images/themes/zen-calm-beauty.svg');filter:saturate(.88) contrast(.98) brightness(1.01)}

/* SILVER + NOIR: a felső és mobil menü mindig erős kontrasztú. */
html[data-site-visual="silver"] .kleo-modern-nav__link,html[data-site-visual="silver"] .kleo-modern-nav__label,html[data-site-visual="silver"] .kleo-modern-header__mobile-head,html[data-site-visual="silver"] .kleo-modern-header__mobile-head strong,html[data-site-visual="silver"] .kleo-modern-header__mobile-kicker,html[data-site-visual="silver"] .kleo-modern-header__mobile-footer{color:#fff!important}
html[data-site-visual="silver"] .kleo-modern-nav__index{color:#ec008c!important}
html[data-site-visual="silver"] .kleo-modern-nav__link:hover,html[data-site-visual="silver"] .kleo-modern-nav__link:focus-visible,html[data-site-visual="silver"] .kleo-modern-nav__link.is-active,html[data-site-visual="silver"] .kleo-modern-nav__link:hover .kleo-modern-nav__label,html[data-site-visual="silver"] .kleo-modern-nav__link.is-active .kleo-modern-nav__label{color:#ec008c!important}
html[data-site-visual="silver"] .kleo-modern-header__menu-icon i,html[data-site-visual="silver"] .kleo-modern-header__close span{background:#fff!important}
html[data-site-visual="silver"] .kleo-modern-header__nav-wrap{color:#fff!important}
html[data-site-visual="noir"] .kleo-modern-nav__link,html[data-site-visual="noir"] .kleo-modern-nav__label,html[data-site-visual="noir"] .kleo-modern-header__mobile-head,html[data-site-visual="noir"] .kleo-modern-header__mobile-head strong,html[data-site-visual="noir"] .kleo-modern-header__mobile-kicker,html[data-site-visual="noir"] .kleo-modern-header__mobile-footer{color:#fff!important}
html[data-site-visual="noir"] .kleo-modern-nav__index{color:#ec008c!important}
html[data-site-visual="noir"] .kleo-modern-nav__link:hover,html[data-site-visual="noir"] .kleo-modern-nav__link:focus-visible,html[data-site-visual="noir"] .kleo-modern-nav__link.is-active,html[data-site-visual="noir"] .kleo-modern-nav__link:hover .kleo-modern-nav__label,html[data-site-visual="noir"] .kleo-modern-nav__link.is-active .kleo-modern-nav__label{color:#ec008c!important}
html[data-site-visual="noir"] .kleo-modern-header__menu-icon i,html[data-site-visual="noir"] .kleo-modern-header__close span{background:#fff!important}
html[data-site-visual="noir"] .kleo-modern-header__nav-wrap{color:#fff!important}

/* ZEN: a zöld hero-mező nagyobb, így a teljes szövegtömb a zöld felületen marad. */
html[data-site-visual="zen"] .kleo-v3-hero,html[data-site-visual="zen"] .b6hero,html[data-site-visual="zen"] .b7hero{background:linear-gradient(90deg,#405344 0 62%,#f5f6ef 62% 100%)!important}
html[data-site-visual="zen"] .kleo-v3-hero__grid{grid-template-columns:minmax(0,1.14fr) minmax(300px,.86fr)!important}
html[data-site-visual="zen"] .kleo-v3-hero__copy{max-width:100%!important;padding-right:clamp(24px,4vw,72px)!important}
html[data-site-visual="zen"] .kleo-v3-hero__copy :where(h1,p,em,span,strong){color:#f5f6ef!important}
html[data-site-visual="zen"] .kleo-v3-hero__lead{max-width:58ch!important}

/* KIDS: minden, a fő tartalomban megjelenő kép saját állatfigurát kap. */
html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img){position:relative;isolation:isolate}
html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img)::after{content:"";position:absolute;top:8px;right:8px;width:clamp(54px,6.6vw,88px);aspect-ratio:1;background:url('/images/kiosk/kids/bunny.gif') center/contain no-repeat;filter:drop-shadow(0 8px 8px rgba(83,50,98,.22));z-index:8;pointer-events:none;animation:kidsImageBuddy 3.8s ease-in-out infinite}
html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img):nth-child(3n+2)::after{background-image:url('/images/kiosk/kids/bear.gif');animation-delay:-1.1s}
html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img):nth-child(3n)::after{background-image:url('/images/kiosk/kids/fox.gif');animation-delay:-2.2s}
html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img) > img{outline:4px solid rgba(255,255,255,.96);box-shadow:0 8px 0 #e3d8c3,0 18px 34px rgba(83,50,98,.12)!important}
html[data-site-visual="kids"] main .kleo-v3-hero__image > img{outline:0!important;box-shadow:none!important}
html[data-site-visual="kids"] main .kleo-v3-hero__image::after{width:clamp(76px,9vw,124px);top:10px;right:10px;background-image:url('/images/kiosk/kids/fox.gif')}
html[data-site-visual="kids"] main .kleo-v3-salon:nth-child(3n+2)::after{background-image:url('/images/kiosk/kids/bear.gif')}
html[data-site-visual="kids"] main .kleo-v3-salon:nth-child(3n)::after{background-image:url('/images/kiosk/kids/fox.gif')}

/* KIDS lebegő figurák: az alsó maci és róka a középső navigáció fölé kerül, nem mögé. */
html[data-site-visual="kids"] .site-theme-atmosphere{z-index:2100!important}
html[data-site-visual="kids"] .theme-kids-animals{inset:0!important;z-index:1!important}
html[data-site-visual="kids"] .theme-kids-animals img:nth-child(1){left:1.5%!important;top:24%!important;bottom:auto!important;right:auto!important}
html[data-site-visual="kids"] .theme-kids-animals img:nth-child(2){left:calc(50% - 150px)!important;right:auto!important;top:auto!important;bottom:138px!important;width:clamp(92px,9vw,132px)!important;height:clamp(122px,12vw,172px)!important}
html[data-site-visual="kids"] .theme-kids-animals img:nth-child(3){right:calc(50% - 150px)!important;left:auto!important;top:auto!important;bottom:130px!important;width:clamp(92px,9vw,132px)!important;height:clamp(122px,12vw,172px)!important}
html[data-site-visual="kids"] .theme-kids-animals span{right:4%!important;top:18%!important}

/* Erős kontraszt a témák sötétebb és színes felületein. */
html[data-site-visual="silver"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(h1,h2,h3,h4,p,small,strong,span,a){color:#f3f2ef!important}
html[data-site-visual="noir"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(h1,h2,h3,h4,p,small,strong,span){color:#eee7dc!important}
html[data-site-visual="pearl"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(p,small){color:#5c5367!important}
html[data-site-visual="rose-gold"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(p,small){color:#67494a!important}
html[data-site-visual="aqua"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(p,small){color:#31585d!important}
html[data-site-visual="zen"] :where(.b6card,.b7card,article,.kleo-v3-service) :where(p,small){color:#52604f!important}

@keyframes kidsImageBuddy{50%{transform:translateY(-7px) rotate(3deg)}}
@media(max-width:900px){html[data-site-visual="zen"] .kleo-v3-hero,html[data-site-visual="zen"] .b6hero,html[data-site-visual="zen"] .b7hero{background:linear-gradient(180deg,#405344 0 66%,#f5f6ef 66% 100%)!important}html[data-site-visual="zen"] .kleo-v3-hero__grid{grid-template-columns:1fr!important}html[data-site-visual="zen"] .kleo-v3-hero__copy{padding-right:0!important}html[data-site-visual="kids"] .theme-kids-animals img:nth-child(2){left:calc(50% - 112px)!important;bottom:112px!important}html[data-site-visual="kids"] .theme-kids-animals img:nth-child(3){right:calc(50% - 112px)!important;bottom:106px!important}}
@media(max-width:720px){html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img)::after{width:58px;top:6px;right:6px}html[data-site-visual="kids"] main .kleo-v3-hero__image::after{width:76px}html[data-site-visual="kids"] .theme-kids-animals img:nth-child(2){left:calc(50% - 92px)!important;width:78px!important;height:106px!important;bottom:94px!important}html[data-site-visual="kids"] .theme-kids-animals img:nth-child(3){right:calc(50% - 92px)!important;width:78px!important;height:106px!important;bottom:90px!important}}
@media(prefers-reduced-motion:reduce){html[data-site-visual="kids"] main :where(div,a,figure,picture):has(> img)::after{animation:none}}
`;

export function SiteStyleSwitcher(){
  const[mode,setMode]=React.useState<SiteVisualMode>(()=>typeof window==="undefined"?"classic":readMode());
  const[open,setOpen]=React.useState(false);
  const pickerRef=React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(()=>{document.documentElement.dataset.siteVisual=mode;try{localStorage.setItem(STORAGE_KEY,mode)}catch{}window.dispatchEvent(new CustomEvent("kleo-site-style-change",{detail:{mode}}))},[mode]);
  React.useEffect(()=>{const close=(event:MouseEvent)=>{if(!pickerRef.current?.contains(event.target as Node))setOpen(false)};const escape=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};document.addEventListener("click",close);document.addEventListener("keydown",escape);return()=>{document.removeEventListener("click",close);document.removeEventListener("keydown",escape)}},[]);
  const current=THEMES.find(theme=>theme.mode===mode)??THEMES[0];
  return <><style>{THEME_POLISH_CSS}</style><div className="site-theme-atmosphere" aria-hidden="true">
    <div className="theme-orb theme-orb-a"/><div className="theme-orb theme-orb-b"/><div className="theme-grid"/><div className="theme-scan"/><div className="theme-ring"><i/><i/><i/><i/></div><div className="theme-wave theme-wave-a"/><div className="theme-wave theme-wave-b"/><div className="theme-noir-line"/><div className="theme-zen-stone"/>
    <div className="theme-kids-animals"><img src="/images/kiosk/kids/bunny.gif" alt=""/><img src="/images/kiosk/kids/bear.gif" alt=""/><img src="/images/kiosk/kids/fox.gif" alt=""/><span>Szia! Válassz velünk! ✨</span></div>
  </div><div className="site-style-picker" ref={pickerRef}>
    <button type="button" className="site-style-toggle" onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-haspopup="menu" aria-label={`Weboldal stílusa: ${current.label}`} title="Weboldal stílusa"><span>{current.icon}</span><b>{current.label}</b><i aria-hidden="true">⌄</i></button>
    {open&&<div className="site-style-menu" role="menu" aria-label="Weboldal stílusa">{THEMES.map(item=><button key={item.mode} type="button" role="menuitemradio" aria-checked={mode===item.mode} className={mode===item.mode?"active":""} onClick={()=>{setMode(item.mode);setOpen(false)}}><span style={{color:item.color}}>{item.icon}</span><b>{item.label}</b><i>{mode===item.mode?"✓":""}</i></button>)}</div>}
  </div></>;
}
export default SiteStyleSwitcher;
