import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "nav-link" + (isActive ? " nav-link-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();

  const handleLangClick = (value: "hu" | "en" | "ru") => {
    setLang(value);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* BAL: LOGÓ */}
        <NavLink to="/" className="header-logo-link" aria-label="Főoldal">
          <div className="site-logo-wrapper site-logo-wrapper--shiny">
            <img
              src="/images/Logo.jpg"
              alt="Kleopátra Szépségszalonok logó"
              className="site-logo"
            />
          </div>
        </NavLink>

        {/* KÖZÉP: KÉT SOROS MENÜ */}
        <nav className="main-nav" aria-label="Fő navigáció">
          <div className="main-nav-inner">
            <div className="main-nav-row">
              <NavLink to="/salons" className={navLinkClass}>
                {t("menu.salons")}
              </NavLink>

              <NavLink to="/services" className={navLinkClass}>
                {t("menu.pricesServices")}
              </NavLink>

              <NavLink to="/webshop" className={navLinkClass}>
                {t("menu.webshop")}
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                {t("menu.contact")}
              </NavLink>
            </div>

            <div className="main-nav-row main-nav-row--bottom">
              <NavLink to="/about" className={navLinkClass}>
                {t("menu.about")}
              </NavLink>
              <NavLink to="/loyalty" className={navLinkClass}>
                {t("menu.loyalty")}
              </NavLink>
              <NavLink to="/franchise" className={navLinkClass}>
                {t("menu.franchise")}
              </NavLink>
              <NavLink to="/career" className={navLinkClass}>
                {t("menu.career")}
              </NavLink>
              <NavLink to="/education" className={navLinkClass}>
                {t("menu.education")}
              </NavLink>
            </div>
          </div>
        </nav>

        {/* JOBB: IDŐPONTFOGLALÁS + SOCIAL + NYELVVÁLASZTÓ */}
        <div className="header-cta-block">
          <NavLink
            to="/salons"
            className="btn header-cta-btn"
            aria-label={t("header.booking")}
          >
            {t("header.booking")}
          </NavLink>

          <div className="header-social">
            <div className="header-social-label">
              {t("header.followUs")}
            </div>

            <div className="header-social-row">
              <div
                className="header-lang-switch"
                aria-label={t("header.language.label")}
              >
                <button
                  type="button"
                  className={
                    "lang-btn" + (lang === "hu" ? " lang-btn--active" : "")
                  }
                  onClick={() => handleLangClick("hu")}
                >
                  HU
                </button>
                <button
                  type="button"
                  className={
                    "lang-btn" + (lang === "en" ? " lang-btn--active" : "")
                  }
                  onClick={() => handleLangClick("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={
                    "lang-btn" + (lang === "ru" ? " lang-btn--active" : "")
                  }
                  onClick={() => handleLangClick("ru")}
                >
                  RU
                </button>
              </div>

              <div className="header-social-icons">
                <a href="#" aria-label="Facebook">
                  <img src="/images/facebook.png" alt="Facebook" />
                </a>
                <a href="#" aria-label="Instagram">
                  <img src="/images/insta.png" alt="Instagram" />
                </a>
                <a href="#" aria-label="TikTok">
                  <img src="/images/tiktok.png" alt="TikTok" />
                </a>
                <a href="#" aria-label="Messenger">
                  <img src="/images/messenger.png" alt="Messenger" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
