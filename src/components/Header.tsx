import React from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "nav-link" + (isActive ? " nav-link-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();

   const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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
              src="/images/Logo.png"
              alt="Kleopátra Szépségszalonok logó"
              className="site-logo"
            />
          </div>
        </NavLink>

        {/* KÖZÉP: KÉT SOROS MENÜ (DESKTOPON LÁTSZIK, MOBILON HAMBURGERREL NYÍLIK) */}
        <nav
          className={
            "main-nav" + (isMobileMenuOpen ? " main-nav--mobile-open" : "")
          }
          aria-label="Fő navigáció"
        >
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
            <div className="header-social-label">{t("header.followUs")}</div>

            <div className="header-social-row">
              {/* NYELVVÁLASZTÓ – 25×25 PX ZÁSZLÓKÉPEK */}
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
                  aria-label="Magyar"
                  title="Magyar"
                >
                  <img
                    src="/images/hungary.png"
                    alt="Magyar"
                    className="lang-flag"
                    width={25}
                    height={25}
                  />
                </button>

                <button
                  type="button"
                  className={
                    "lang-btn" + (lang === "en" ? " lang-btn--active" : "")
                  }
                  onClick={() => handleLangClick("en")}
                  aria-label="English"
                  title="English"
                >
                  <img
                    src="/images/england.png"
                    alt="English"
                    className="lang-flag"
                    width={25}
                    height={25}
                  />
                </button>

                <button
                  type="button"
                  className={
                    "lang-btn" + (lang === "ru" ? " lang-btn--active" : "")
                  }
                  onClick={() => handleLangClick("ru")}
                  aria-label="Русский"
                  title="Русский"
                >
                  <img
                    src="/images/russia.png"
                    alt="Русский"
                    className="lang-flag"
                    width={25}
                    height={25}
                  />
                </button>
              </div>

              {/* SOCIAL – MESSENGER TÖRÖLVE, YOUTUBE BE */}
              <div className="header-social-icons">
                <a
                  href="https://www.tiktok.com/@kleoszalon"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/tiktok.png"
                    alt="TikTok"
                    width={25}
                    height={25}
                  />
                </a>
                <a
                  href="https://www.youtube.com/channel/UC9GNInNzSznaxZkmaNnNTxA"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/youtube.png"
                    alt="YouTube"
                    width={25}
                    height={25}
                  />
                </a>
                <a
                  href="https://www.facebook.com/kleoszalon/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/facebook.png"
                    alt="Facebook"
                    width={25}
                    height={25}
                  />
                </a>
                <a
                  href="https://www.instagram.com/kleoszalon/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/insta.png"
                    alt="Instagram"
                    width={25}
                    height={25}
                  />
                </a>
              </div>
            </div>
          </div>
          </div>

        {/* ÚJ: HAMBURGER GOMB – csak markup, a pozicionálást a CSS csinálja */}
        <button
          type="button"
           className="hamburger kleo-shine"
          aria-label="Menü"
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-lines">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
