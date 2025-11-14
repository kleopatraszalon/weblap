import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 960 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* LOGÓ – bal oldalt nagyban */}
        <NavLink
          className="brand"
          to="/"
          aria-label="Kleopátra Szépségszalonok – Főoldal"
        >
          <img
            src="/images/kleo_logo@2x.png"
            alt="Kleopátra Szépségszalonok logó"
          />
        </NavLink>

        {/* MOBIL HAMBURGER */}
        <button
          className={`hamburger ${isOpen ? "is-open" : ""}`}
          id="navToggle"
          aria-label="Menü megnyitása"
          aria-expanded={isOpen}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* MENÜ – két sor, középen */}
        <nav
          id="mainNav"
          className={`nav ${isOpen ? "is-open" : ""}`}
        >
          <div className="nav-row">
            <NavLink to="/salons">Szalonjaink</NavLink>
            <NavLink to="/prices">Áraink</NavLink>
            <NavLink to="/services">Szolgáltatások</NavLink>
            <NavLink to="/webshop">Webshop</NavLink>
            <NavLink to="/contact">Kapcsolat</NavLink>
          </div>
          <div className="nav-row">
            <NavLink to="/loyalty">Hűségprogram</NavLink>
            <NavLink to="/franchise">Franchise</NavLink>
            <NavLink to="/career">Karrier</NavLink>
            <NavLink to="/training">Oktatás</NavLink>
            <NavLink to="/about">Rólunk</NavLink>
          </div>
        </nav>

        {/* Desktop CTA – jobb szélen, arculati gomb */}
        <a className="header-cta" href="/salons">
          Időpontfoglalás
        </a>
      </div>
    </header>
  );
};
