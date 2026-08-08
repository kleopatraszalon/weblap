import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";
import { useWebsiteCms } from "../websiteCms";

const navLinkClass = ({ isActive }: { isActive: boolean }) => "nav-link" + (isActive ? " nav-link-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();
  const cms = useWebsiteCms();
  const handleLangClick = (value: "hu" | "en" | "ru") => setLang(value);
  const social = [
    ["Facebook",cms.header.facebookUrl,"/images/facebook.png"],
    ["Instagram",cms.header.instagramUrl,"/images/insta.png"],
    ["TikTok",cms.header.tiktokUrl,"/images/tiktok.png"],
    ["Messenger",cms.header.messengerUrl,"/images/messenger.png"],
  ].filter(([,url])=>Boolean(url));

  return <header className="site-header">
    <div className="container header-inner">
      <NavLink to="/" className="header-logo-link" aria-label="Főoldal">
        <div className="site-logo-wrapper"><img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok logó" className="site-logo" /></div>
      </NavLink>
      <nav className="main-nav" aria-label="Fő navigáció"><div className="main-nav-inner">
        <div className="main-nav-row">
          <NavLink to="/booking" className={navLinkClass}>{cms.header.bookingLabel}</NavLink>
          <NavLink to="/salons" className={navLinkClass}>{t("menu.salons")}</NavLink>
          <NavLink to="/services" className={navLinkClass}>{t("menu.pricesServices")}</NavLink>
          <NavLink to="/webshop" className={navLinkClass}>{t("menu.webshop")}</NavLink>
          <NavLink to="/contact" className={navLinkClass}>{t("menu.contact")}</NavLink>
        </div>
        <div className="main-nav-row main-nav-row--bottom">
          <NavLink to="/about" className={navLinkClass}>{t("menu.about")}</NavLink>
          <NavLink to="/loyalty" className={navLinkClass}>{t("menu.loyalty")}</NavLink>
          <NavLink to="/franchise" className={navLinkClass}>{t("menu.franchise")}</NavLink>
          <NavLink to="/career" className={navLinkClass}>{t("menu.career")}</NavLink>
          <NavLink to="/training" className={navLinkClass}>{t("menu.education")}</NavLink>
        </div>
      </div></nav>
      <div className="header-cta-block">
        <NavLink to="/booking" className="btn header-cta-btn" aria-label={cms.header.bookingLabel}>{cms.header.bookingLabel}</NavLink>
        {(cms.header.showLanguageSwitcher || social.length>0) && <div className="header-social">
          <div className="header-social-label">{t("header.followUs")}</div>
          <div className="header-social-row">
            {cms.header.showLanguageSwitcher && <div className="header-lang-switch" aria-label={t("header.language.label")}>
              <button type="button" className={"lang-btn" + (lang === "hu" ? " lang-btn--active" : "")} onClick={() => handleLangClick("hu")}>HU</button>
              <button type="button" className={"lang-btn" + (lang === "en" ? " lang-btn--active" : "")} onClick={() => handleLangClick("en")}>EN</button>
              <button type="button" className={"lang-btn" + (lang === "ru" ? " lang-btn--active" : "")} onClick={() => handleLangClick("ru")}>RU</button>
            </div>}
            {social.length>0 && <div className="header-social-icons">{social.map(([label,url,img])=><a key={String(label)} href={String(url)} target="_blank" rel="noreferrer" aria-label={String(label)}><img src={String(img)} alt={String(label)} /></a>)}</div>}
          </div>
        </div>}
      </div>
    </div>
  </header>;
}

export default Header;
