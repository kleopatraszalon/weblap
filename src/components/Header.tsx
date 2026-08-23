import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { useWebsiteCms } from "../websiteCms";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "kleo-modern-nav__link" + (isActive ? " is-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();
  const cms = useWebsiteCms();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    close();
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.classList.add("kleo-mobile-menu-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("kleo-mobile-menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={"kleo-modern-header" + (open ? " is-menu-open" : "")}>
      <div className="kleo-modern-container kleo-modern-header__inner">
        <NavLink to="/" className="kleo-modern-header__brand" aria-label="Kleopátra főoldal" onClick={close}>
          <img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok" />
        </NavLink>

        <button
          type="button"
          className="kleo-modern-header__menu-btn"
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          aria-expanded={open}
          aria-controls="kleo-mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="kleo-modern-header__menu-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="kleo-modern-header__menu-label">Menü</span>
        </button>

        <button
          type="button"
          className={"kleo-modern-header__backdrop" + (open ? " is-open" : "")}
          aria-label="Menü bezárása"
          tabIndex={open ? 0 : -1}
          onClick={close}
        />

        <div id="kleo-mobile-navigation" className={"kleo-modern-header__nav-wrap" + (open ? " is-open" : "")}>
          <div className="kleo-modern-header__mobile-head">
            <span>Navigáció</span>
            <button type="button" aria-label="Menü bezárása" onClick={close}>×</button>
          </div>

          <nav className="kleo-modern-nav" aria-label="Fő navigáció">
            <NavLink to="/services" className={navLinkClass} onClick={close}>Szolgáltatások <span>→</span></NavLink>
            <NavLink to="/prices" className={navLinkClass} onClick={close}>Áraink <span>→</span></NavLink>
            <NavLink to="/salons" className={navLinkClass} onClick={close}>Szalonjaink <span>→</span></NavLink>
            <NavLink to="/loyalty" className={navLinkClass} onClick={close}>Hűségprogram <span>→</span></NavLink>
            <NavLink to="/webshop" className={navLinkClass} onClick={close}>{t("menu.webshop")} <span>→</span></NavLink>
            <NavLink to="/education" className={navLinkClass} onClick={close}>Oktatás <span>→</span></NavLink>
            <NavLink to="/career" className={navLinkClass} onClick={close}>Karrier <span>→</span></NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={close}>Rólunk <span>→</span></NavLink>
            <NavLink to="/franchise" className={navLinkClass} onClick={close}>Franchise <span>→</span></NavLink>
          </nav>

          <div className="kleo-modern-header__tools">
            {cms.header.showLanguageSwitcher && (
              <div className="kleo-modern-lang" aria-label={t("header.language.label")}>
                {(["hu", "en", "ru"] as const).map((value) => (
                  <button key={value} type="button" className={lang === value ? "is-active" : ""} onClick={() => setLang(value)}>
                    {value.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            <NavLink to="/booking" className="kleo-modern-header__cta" onClick={close}>{cms.header.bookingLabel}</NavLink>
          </div>

          <p className="kleo-modern-header__mobile-note">Kleopátra Szépségszalonok</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
