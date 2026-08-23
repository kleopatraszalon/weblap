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

/* Header reset: desktop must never leak mobile-only footer/head/index elements. */
@media(min-width:1321px){
  .kleo-modern-header{background:#fff!important;border-bottom:1px solid rgba(182,152,97,.22)!important;box-shadow:0 7px 24px rgba(18,12,8,.05)!important;padding:0!important}
  .kleo-modern-header__inner{width:calc(100% - 48px)!important;max-width:1380px!important;min-height:92px!important;display:grid!important;grid-template-columns:190px minmax(0,1fr)!important;align-items:center!important;gap:26px!important;margin:0 auto!important;padding:0!important}
  .kleo-modern-header__brand{width:184px!important;max-width:none!important;display:flex!important;align-items:center!important}
  .kleo-modern-header__brand img{width:100%!important;height:66px!important;object-fit:contain!important;object-position:left center!important}
  .kleo-modern-header__menu-btn,.kleo-modern-header__backdrop,.kleo-modern-header__mobile-head,.kleo-modern-header__mobile-footer,.kleo-modern-nav__index{display:none!important}
  .kleo-modern-header__nav-wrap{position:static!important;width:auto!important;height:auto!important;max-height:none!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-end!important;gap:18px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}
  .kleo-modern-nav{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:clamp(12px,1vw,20px)!important;padding:0!important}
  .kleo-modern-nav__link{width:auto!important;min-height:44px!important;display:inline-flex!important;align-items:center!important;gap:0!important;padding:4px 0!important;border:0!important;color:#302b27!important;font-family:var(--cms-heading-font,"Montserrat"),Arial,sans-serif!important;font-size:12px!important;font-weight:700!important;letter-spacing:.045em!important;line-height:1!important;text-transform:uppercase!important;white-space:nowrap!important;transform:none!important}
  .kleo-modern-nav__label{font-size:inherit!important;font-weight:inherit!important;letter-spacing:inherit!important;line-height:inherit!important}
  .kleo-modern-header__tools{display:flex!important;align-items:center!important;gap:10px!important;margin:0!important;padding:0!important;border:0!important}
  .kleo-modern-header__cta{min-height:44px!important;padding:0 17px!important;font-size:10px!important}
}

/* Laptop / narrow desktop: one clean hamburger, no compressed half-desktop layout. */
@media(min-width:981px) and (max-width:1320px){
  .kleo-modern-header{background:#fff!important;padding:0!important}
  .kleo-modern-header__inner{width:calc(100% - 36px)!important;max-width:1240px!important;min-height:88px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:20px!important;margin:0 auto!important;padding:0!important}
  .kleo-modern-header__brand{width:180px!important;max-width:none!important}
  .kleo-modern-header__brand img{height:64px!important}
  .kleo-modern-header__menu-btn{display:grid!important;place-items:center!important;width:56px!important;height:56px!important;flex:0 0 56px!important;padding:0!important;border:1px solid rgba(32,23,25,.1)!important;border-radius:50%!important;background:#f8f3f1!important;color:#201619!important}
  .kleo-modern-header__menu-icon{width:24px!important;height:18px!important;display:block!important;position:relative!important}
  .kleo-modern-header__menu-icon i{position:absolute!important;left:0!important;width:24px!important;height:2px!important;background:currentColor!important;border-radius:999px!important;transition:.2s!important}
  .kleo-modern-header__menu-icon i:first-child{top:4px!important}.kleo-modern-header__menu-icon i:last-child{top:12px!important}
  .kleo-modern-header.is-menu-open .kleo-modern-header__menu-icon i:first-child,.kleo-modern-header.is-menu-open .kleo-modern-header__menu-icon i:last-child{top:8px!important}.kleo-modern-header.is-menu-open .kleo-modern-header__menu-icon i:first-child{transform:rotate(45deg)!important}.kleo-modern-header.is-menu-open .kleo-modern-header__menu-icon i:last-child{transform:rotate(-45deg)!important}
  .kleo-modern-header__backdrop{position:fixed!important;inset:0!important;z-index:2001!important;display:block!important;border:0!important;background:rgba(25,15,20,.3)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
  .kleo-modern-header__backdrop.is-open{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
  .kleo-modern-header__nav-wrap{position:fixed!important;top:100px!important;left:24px!important;right:24px!important;width:auto!important;height:auto!important;max-height:calc(100dvh - 124px)!important;z-index:2003!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;padding:28px!important;border:1px solid #eee5e8!important;border-radius:26px!important;background:#fff!important;box-shadow:0 30px 90px rgba(30,17,23,.22)!important;overflow:auto!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-10px)!important}
  .kleo-modern-header__nav-wrap.is-open{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}
  .kleo-modern-header__mobile-head{display:flex!important;align-items:center!important;justify-content:space-between!important;padding-bottom:18px!important;border-bottom:1px solid #eee8e9!important}
  .kleo-modern-header__mobile-footer{display:flex!important;justify-content:space-between!important;gap:16px!important;margin-top:18px!important;color:#8e8587!important;font-size:9px!important;text-transform:uppercase!important}
  .kleo-modern-nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0 24px!important;padding:12px 0 4px!important}
  .kleo-modern-nav__link{width:100%!important;min-height:58px!important;display:grid!important;grid-template-columns:30px 1fr!important;align-items:center!important;padding:0!important;border-bottom:1px solid #eee8e9!important;color:#201619!important;font-size:13px!important;text-transform:none!important}
  .kleo-modern-nav__index{display:block!important;color:#b79a82!important;font-size:9px!important}
  .kleo-modern-nav__label{font-size:17px!important;line-height:1.1!important}
  .kleo-modern-header__tools{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;margin-top:20px!important;padding-top:20px!important;border-top:1px solid #eee8e9!important}
  .kleo-modern-header__cta{min-height:52px!important;padding:0 22px!important}
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
