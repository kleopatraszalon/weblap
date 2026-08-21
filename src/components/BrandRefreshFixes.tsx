import React from "react";

const CSS = String.raw`
.kleo-v3-shop__copy h2{
  margin:0;
  font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif;
  font-size:clamp(36px,4.7vw,68px);
  font-weight:540;
  letter-spacing:-.055em;
  line-height:1;
}

.kleo-v3-section--priority{padding-top:72px;padding-bottom:72px}
.kleo-v3-nearby-actions{display:flex;align-items:center;justify-content:flex-end;gap:14px;flex-wrap:wrap}
.kleo-v3-nearby-btn{min-height:44px;padding:0 17px;border:1px solid rgba(18,12,8,.2);border-radius:999px;background:#fff;color:#120c08;font:800 10px/1 Montserrat,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.kleo-v3-nearby-btn:hover{border-color:#ec008c;color:#ec008c;transform:translateY(-1px)}
.kleo-v3-nearby-btn:disabled{opacity:.55;cursor:wait;transform:none}
.kleo-v3-location-note{margin:-16px 0 24px;color:#756c65;font-size:12px;line-height:1.6}

@media(min-width:1181px){
  .kleo-modern-header__inner{grid-template-columns:168px minmax(0,1fr)!important;gap:16px!important}
  .kleo-modern-header__brand{width:164px!important}
  .kleo-modern-nav{gap:clamp(8px,1vw,15px)!important}
  .kleo-modern-nav__link{font-size:9.5px!important;letter-spacing:.065em!important}
  .kleo-modern-header__nav-wrap{gap:12px!important}
  .kleo-modern-header__cta{padding:0 15px!important}
}

@media(min-width:981px){
  .kleo-v3-hero{min-height:72svh!important}
  .kleo-v3-hero__grid{padding-top:42px!important;padding-bottom:42px!important}
  .kleo-v3-hero__visual{min-height:510px!important}
  .kleo-v3-services{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  .kleo-v3-service,.kleo-v3-service:nth-child(n){grid-column:auto!important;min-height:310px!important}
}

@media(max-width:980px){
  .kleo-v3-nearby-actions{justify-content:flex-start}
}

@media(max-width:680px){
  .kleo-v3-shop__copy h2{font-size:clamp(34px,12vw,50px)}
  .kleo-v3-section--priority{padding-top:56px;padding-bottom:56px}
  .kleo-v3-nearby-actions{display:grid;grid-template-columns:1fr;width:100%}
  .kleo-v3-nearby-btn{width:100%}
}
`;

export function BrandRefreshFixes(){
  return <style data-kleo-brand-refresh-fixes>{CSS}</style>;
}

export default BrandRefreshFixes;
