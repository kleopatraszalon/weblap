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

/* Desktop header: keep the navigation readable instead of shrinking it to fit. */
@media(min-width:981px){
  .kleo-modern-header__inner{grid-template-columns:150px minmax(0,1fr)!important;gap:22px!important;min-height:82px!important}
  .kleo-modern-header__brand{width:146px!important}
  .kleo-modern-header__brand img{height:58px!important}
  .kleo-modern-header__nav-wrap{gap:18px!important;min-width:0!important}
  .kleo-modern-nav{gap:clamp(10px,1.05vw,18px)!important;min-width:0!important}
  .kleo-modern-nav__link{font-size:11px!important;letter-spacing:.045em!important}
  .kleo-modern-header__cta{padding:0 16px!important;font-size:10px!important}
  .kleo-v3-hero{min-height:72svh!important}
  .kleo-v3-hero__grid{padding-top:42px!important;padding-bottom:42px!important}
  .kleo-v3-hero__visual{min-height:510px!important}
  .kleo-v3-services{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  .kleo-v3-service,.kleo-v3-service:nth-child(n){grid-column:auto!important;min-height:310px!important}
}

/* Mid-size desktop/tablet gets the existing full-screen menu rather than a crushed desktop row. */
@media(min-width:981px) and (max-width:1320px){
  .kleo-modern-header__inner{display:flex!important;align-items:center!important;justify-content:space-between!important}
  .kleo-modern-header__menu-btn{display:grid!important;place-items:center!important;width:54px!important;height:54px!important;flex:0 0 54px!important;border:1px solid rgba(32,23,25,.1)!important;border-radius:50%!important;background:#f8f3f1!important}
  .kleo-modern-header__menu-icon{width:24px!important;height:18px!important;display:block!important;position:relative!important}
  .kleo-modern-header__menu-icon i{position:absolute!important;left:0!important;width:24px!important;height:2px!important;background:#201619!important;border-radius:999px!important}
  .kleo-modern-header__menu-icon i:first-child{top:4px!important}.kleo-modern-header__menu-icon i:last-child{top:12px!important}
  .kleo-modern-header__nav-wrap{position:fixed!important;top:92px!important;left:24px!important;right:24px!important;z-index:2003!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:28px!important;border:1px solid #eee5e8!important;border-radius:24px!important;background:#fff!important;box-shadow:0 30px 90px rgba(30,17,23,.22)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-10px)!important}
  .kleo-modern-header__nav-wrap.is-open{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}
  .kleo-modern-header__backdrop.is-open{position:fixed!important;inset:0!important;z-index:2001!important;display:block!important;background:rgba(25,15,20,.28)!important;border:0!important}
  .kleo-modern-nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0 24px!important;justify-content:stretch!important}
  .kleo-modern-nav__link{min-height:58px!important;border-bottom:1px solid #eee8e9!important;font-size:13px!important;text-transform:none!important}
  .kleo-modern-nav__index{display:inline-block!important;margin-right:9px!important;color:#b79a82!important;font-size:9px!important}
  .kleo-modern-header__tools{justify-content:space-between!important;margin-top:20px!important}
  .kleo-modern-header__mobile-head,.kleo-modern-header__mobile-footer{display:flex!important}
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
