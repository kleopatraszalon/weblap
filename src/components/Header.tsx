import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  "nav-link" + (isActive ? " nav-link-active" : "");

export function Header() {
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
                Szalonjaink
              </NavLink>
             
              <NavLink to="/services" className={navLinkClass}>
                Áraink és Szolgáltatásaink 
              </NavLink>
              <NavLink to="/webshop" className={navLinkClass}>
                Webshop
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Kapcsolat
              </NavLink>
              
            </div>

            <div className="main-nav-row main-nav-row--bottom">
              <NavLink to="/about" className={navLinkClass}>
                Rólunk
              </NavLink>
              <NavLink to="/loyalty" className={navLinkClass}>
                Hűségprogram
              </NavLink>
              <NavLink to="/franchise" className={navLinkClass}>
                Franchise
              </NavLink>
              <NavLink to="/career" className={navLinkClass}>
                Karrier
              </NavLink>
              <NavLink to="/education" className={navLinkClass}>
                Oktatás
              </NavLink>
            </div>
          </div>
        </nav>

        {/* JOBB: IDŐPONTFOGLALÁS + SOCIAL IKONOK */}
        <div className="header-cta-block">
          <NavLink
            to="/salons"
            className="btn header-cta-btn"
            aria-label="Időpontfoglalás"
          >
            Időpontfoglalás
          </NavLink>
          

          <div className="header-social">
            <div className="header-social-label">Kövess minket</div>
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
    </header>
  );
}

export default Header;
