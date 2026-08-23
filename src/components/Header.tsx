import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { useWebsiteCms } from "../websiteCms";
import MobileLuxuryStyles from "./MobileLuxuryStyles";
import { SiteLanguageSwitcher } from "./SiteLanguage";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "kleo-modern-nav__link" + (isActive ? " is-active" : "");

const mobileNavItems = [
  ["01", "/services", "Szolgáltatások"],
  ["02", "/prices", "Áraink"],
  ["03", "/salons", "Szalonjaink"],
  ["04", "/loyalty", "Hűségprogram"],
  ["05", "/webshop", "Webshop"],
  ["06", "/education", "Oktatás"],
  ["07", "/career", "Karrier"],
  ["08", "/about", "Rólunk"],
  ["09", "/franchise", "Franchise"],
] as const;

export function Header() {
  const { t } = useI18n();
  const cms = useWebsiteCms();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => { close(); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.body.classList.add("kleo-mobile-menu-open");
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("kleo-mobile-menu-open"); window.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return (
    <header className={"kleo-modern-header" + (open ? " is-menu-open" : "")}>
      <MobileLuxuryStyles />
      <div className="kleo-modern-container kleo-modern-header__inner">
        <NavLink to="/" className="kleo-modern-header__brand" aria-label="Kleopátra főoldal" onClick={close}>
          <img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok" />
        </NavLink>
        <button type="button" className="kleo-modern-header__menu-btn" aria-label={open ? "Menü bezárása" : "Menü megnyitása"} aria-expanded={open} aria-controls="kleo-mobile-navigation" onClick={() => setOpen((value) => !value)}>
          <span className="kleo-modern-header__menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
        <button type="button" className={"kleo-modern-header__backdrop" + (open ? " is-open" : "")} aria-label="Menü bezárása" tabIndex={open ? 0 : -1} onClick={close} />
        <div id="kleo-mobile-navigation" className={"kleo-modern-header__nav-wrap" + (open ? " is-open" : "")}>
          <div className="kleo-modern-header__mobile-head"><div><span className="kleo-modern-header__mobile-kicker">Kleopátra</span><strong>Fedezd fel</strong></div><button type="button" className="kleo-modern-header__close" aria-label="Menü bezárása" onClick={close}><span /><span /></button></div>
          <nav className="kleo-modern-nav" aria-label="Fő navigáció">
            {mobileNavItems.map(([index, to, label]) => <NavLink key={to} to={to} className={navLinkClass} onClick={close}><span className="kleo-modern-nav__index">{index}</span><span className="kleo-modern-nav__label">{to === "/webshop" ? t("menu.webshop") : label}</span></NavLink>)}
          </nav>
          <div className="kleo-modern-header__tools">
            <NavLink to="/booking" className="kleo-modern-header__cta" onClick={close}><span>{cms.header.bookingLabel}</span><b aria-hidden="true">↗</b></NavLink>
            {cms.header.showLanguageSwitcher && <SiteLanguageSwitcher />}
          </div>
          <div className="kleo-modern-header__mobile-footer"><span>Beauty since 2003</span><span>Budapest · Eger · Gyöngyös · Salgótarján</span></div>
        </div>
      </div>
    </header>
  );
}

export default Header;
