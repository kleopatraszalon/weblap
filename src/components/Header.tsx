import React, {useMemo, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "nav-link" + (isActive ? " nav-link-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    // Prevent background scroll when the mobile drawer is open
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const menuItems = useMemo(
    () => [
      { to: "/salons", label: t("menu.salons") },
      { to: "/services", label: t("menu.pricesServices") },
      { to: "/webshop", label: t("menu.webshop") },
      { to: "/contact", label: t("menu.contact") },
      { to: "/about", label: t("menu.about") },
      { to: "/loyalty", label: t("menu.loyalty") },
      { to: "/franchise", label: t("menu.franchise") },
      { to: "/career", label: t("menu.career") },
      { to: "/education", label: t("menu.education") },
    ],
    [t]
  );

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

        {/* MOBIL: hamburger (a két soros menü helyett) */}
        <button
          type="button"
          className="hamburger-btn"
          aria-label={mobileOpen ? t("header.closeMenu") : t("header.openMenu")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

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

      {/* MOBIL MENÜ PANEL */}
      {mobileOpen && (
        <>
          <div
            className="mobile-nav-overlay"
            role="presentation"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="mobile-nav-drawer"
            role="dialog"
            aria-label={t("header.mobileMenu")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-header">
              <div className="mobile-nav-title">{t("header.mobileMenu")}</div>
              <button
                type="button"
                className="mobile-nav-close"
                aria-label={t("header.closeMenu")}
                onClick={() => setMobileOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mobile-nav-links">
              <NavLink
                to="/salons"
                className="btn btn-primary btn-primary--magenta"
                onClick={() => setMobileOpen(false)}
              >
                {t("header.booking")}
              </NavLink>

              {menuItems.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className="mobile-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {it.label}
                  <span aria-hidden="true">›</span>
                </NavLink>
              ))}
            </div>

            <div className="mobile-nav-subsection">
              <div>
                <div className="mobile-nav-subtitle">{t("header.language.label")}</div>
                <div className="mobile-lang">
                  <button
                    type="button"
                    className={"lang-btn" + (lang === "hu" ? " lang-btn--active" : "")}
                    onClick={() => handleLangClick("hu")}
                  >
                    HU
                  </button>
                  <button
                    type="button"
                    className={"lang-btn" + (lang === "en" ? " lang-btn--active" : "")}
                    onClick={() => handleLangClick("en")}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    className={"lang-btn" + (lang === "ru" ? " lang-btn--active" : "")}
                    onClick={() => handleLangClick("ru")}
                  >
                    RU
                  </button>
                </div>
              </div>

              <div>
                <div className="mobile-nav-subtitle">{t("header.followUs")}</div>
                <div className="mobile-social">
                  <a className="social-icon-btn" href="#" aria-label="Facebook">
                    <img src="/images/facebook.png" alt="Facebook" />
                  </a>
                  <a className="social-icon-btn" href="#" aria-label="Instagram">
                    <img src="/images/insta.png" alt="Instagram" />
                  </a>
                  <a className="social-icon-btn" href="#" aria-label="YouTube">
                    <span className="mobile-social-fallback">YT</span>
                  </a>
                  <a className="social-icon-btn" href="#" aria-label="TikTok">
                    <img src="/images/tiktok.png" alt="TikTok" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;