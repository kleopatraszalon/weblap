import React from "react";
import { NavLink } from "react-router-dom";
import { useWebsiteCms } from "../websiteCms";

export function Footer() {
  const cms = useWebsiteCms();
  const social = [
    ["TikTok", cms.header.tiktokUrl, "/images/tiktok.png"],
    ["Facebook", cms.header.facebookUrl, "/images/facebook.png"],
    ["Instagram", cms.header.instagramUrl, "/images/insta.png"],
    ["Messenger", cms.header.messengerUrl, "/images/messenger.png"],
  ].filter(([,url])=>Boolean(url));

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div className="site-footer-brand">
          <img src={cms.brand.logoUrl} alt="Kleopátra Szépségszalonok" />
          <p>{cms.brand.slogan}</p>
        </div>
        <nav className="site-footer-links" aria-label="Gyorslinkek">
          <NavLink to="/salons">Szalonjaink</NavLink>
          <NavLink to="/services">Szolgáltatások</NavLink>
          <NavLink to="/booking">Időpontfoglalás</NavLink>
          <NavLink to="/career">Karrier</NavLink>
          <NavLink to="/contact">Kapcsolat</NavLink>
        </nav>
        <nav className="site-footer-legal" aria-label="Jogi információk">
          <a href={cms.footer.privacyUrl} target="_blank" rel="noreferrer">{cms.footer.privacyLabel}</a>
          <a href={cms.footer.cookieUrl} target="_blank" rel="noreferrer">{cms.footer.cookieLabel}</a>
          <a href={cms.footer.complaintsUrl} target="_blank" rel="noreferrer">{cms.footer.complaintsLabel}</a>
          <a href={cms.footer.imprintUrl} target="_blank" rel="noreferrer">{cms.footer.imprintLabel}</a>
        </nav>
      </div>
      {social.length>0 && <div className="site-footer-social" aria-label="Közösségi oldalak">
        {social.map(([label,url,img])=><a key={String(label)} href={String(url)} target="_blank" rel="noreferrer" aria-label={String(label)}><img src={String(img)} alt="" /></a>)}
      </div>}
      <div className="site-footer-bottom">© {new Date().getFullYear()} Kleopátra Szépségszalonok</div>
    </footer>
  );
}

export default Footer;
