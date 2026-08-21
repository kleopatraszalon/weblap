import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";
import { useWebsiteCms } from "../websiteCms";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "kleo-modern-nav__link" + (isActive ? " is-active" : "");

export function Header() {
  const { lang, setLang, t } = useI18n();
  const cms = useWebsiteCms();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="kleo-modern-header">
      <div className="kleo-modern-container kleo-modern-header__inner">
        <NavLink to="/" className="kleo-modern-header__brand" aria-label="Kleopátra főoldal" onClick={close}>
          <img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok" />
        </NavLink>

        <button type="button" className="kleo-modern-header__menu-btn" aria-label={open ? "Menü bezárása" : "Menü megnyitása"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>

        <div className={"kleo-modern-header__nav-wrap" + (open ? " is-open" : "")}>
          <nav className="kleo-modern-nav" aria-label="Fő navigáció">
            <NavLink to="/salons" className={navLinkClass} onClick={close}>Szalonjaink</NavLink>
            <NavLink to="/loyalty" className={navLinkClass} onClick={close}>Hűségprogram</NavLink>
            <NavLink to="/prices" className={navLinkClass} onClick={close}>Áraink</NavLink>
            <NavLink to="/webshop" className={navLinkClass} onClick={close}>{t("menu.webshop")}</NavLink>
            <NavLink to="/franchise" className={navLinkClass} onClick={close}>Franchise</NavLink>
            <NavLink to="/career" className={navLinkClass} onClick={close}>Karrier</NavLink>
            <NavLink to="/education" className={navLinkClass} onClick={close}>Oktatás</NavLink>
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
        </div>
      </div>
    </header>
  );
}

export default Header;
