import React from "react";
import { NavLink } from "react-router-dom";
import { useWebsiteCms } from "../websiteCms";

export function Footer() {
  const cms = useWebsiteCms();
  const social = [
    ["Facebook", cms.header.facebookUrl, "/images/facebook.png"],
    ["Instagram", cms.header.instagramUrl, "/images/insta.png"],
    ["TikTok", cms.header.tiktokUrl, "/images/tiktok.png"],
    ["Messenger", cms.header.messengerUrl, "/images/messenger.png"],
  ].filter(([, url]) => Boolean(url));

  return (
    <footer className="site-footer kleo-modern-footer">
      <div className="container kleo-modern-footer__grid">
        <div className="kleo-modern-footer__brand">
          <img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok" />
          <p>{cms.brand.slogan}</p>
        </div>

        <nav className="kleo-modern-footer__col" aria-label="Gyors linkek">
          <h3>Gyors linkek</h3>
          <NavLink to="/salons">Szalonok</NavLink>
          <NavLink to="/services">Szolgáltatások</NavLink>
          <NavLink to="/prices">Árak</NavLink>
          <NavLink to="/webshop">Webshop</NavLink>
          <NavLink to="/booking">Időpontfoglalás</NavLink>
        </nav>

        <nav className="kleo-modern-footer__col" aria-label="Rólunk">
          <h3>Rólunk</h3>
          <NavLink to="/about">Rólunk</NavLink>
          <NavLink to="/loyalty">Hűségprogram</NavLink>
          <NavLink to="/franchise">Franchise</NavLink>
          <NavLink to="/career">Karrier</NavLink>
          <NavLink to="/training">Oktatás</NavLink>
        </nav>

        <nav className="kleo-modern-footer__col" aria-label="Ügyfélszolgálat">
          <h3>Ügyfélszolgálat</h3>
          <NavLink to="/contact">Kapcsolat</NavLink>
          <a href={cms.footer.privacyUrl} target="_blank" rel="noreferrer">{cms.footer.privacyLabel}</a>
          <a href={cms.footer.cookieUrl} target="_blank" rel="noreferrer">{cms.footer.cookieLabel}</a>
          <a href={cms.footer.complaintsUrl} target="_blank" rel="noreferrer">{cms.footer.complaintsLabel}</a>
          <a href={cms.footer.imprintUrl} target="_blank" rel="noreferrer">{cms.footer.imprintLabel}</a>
        </nav>

        <div className="kleo-modern-footer__contact">
          <h3>Kapcsolat</h3>
          <p>Kleopátra Szépségszalonok</p>
          <NavLink to="/contact">Írj nekünk →</NavLink>
          {social.length > 0 && (
            <div className="kleo-modern-footer__social" aria-label="Közösségi oldalak">
              {social.map(([label, url, img]) => (
                <a key={String(label)} href={String(url)} target="_blank" rel="noreferrer" aria-label={String(label)}>
                  <img src={String(img)} alt="" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="kleo-modern-footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Kleopátra Szépségszalonok</span>
          <span>Minden jog fenntartva.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
