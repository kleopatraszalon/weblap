import React from "react";

export function Footer() {
  return (
    <footer className="footer">
      {/* Felső sor – jogi linkek */}
      <div className="container footer-inner footer-top">
        <nav className="footer-links" aria-label="Jogi és információs oldalak">
          <a href="#" className="footer-link">
            ADATVÉDELEM
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link">
            COOKIE TÁJÉKOZTATÓ
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link">
            PANASZKEZELÉSI SZABÁLYZAT
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link">
            HÍRLEVÉL
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link">
            FIZETÉSI LEHETŐSÉGEK
          </a>
          <span className="footer-separator">•</span>
          <a href="#" className="footer-link">
            IMPRESSZUM
          </a>
        </nav>
      </div>

      {/* Középső sor – social ikonok */}
      <div className="footer-social-block">
        <p className="footer-follow-label">Kövess minket!</p>
        <div className="footer-social-icons">
          <a
            href="https://www.tiktok.com/@kleoszalon"
            aria-label="TikTok"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/tiktok.png"
              alt="TikTok"
              className="footer-social-icon"
              width={30}
              height={30}
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
              className="footer-social-icon"
              width={30}
              height={30}
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
              className="footer-social-icon"
              width={30}
              height={30}
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
              className="footer-social-icon"
              width={30}
              height={30}
            />
          </a>
        </div>
      </div>

      {/* Alsó sor – cookie sáv */}
      <div className="footer-cookie">
        <span className="footer-cookie-text">
          A weboldal sütiket használ a teljes funkcionalitás érdekében.
          <a href="#" className="footer-cookie-link">
            {" "}
            Részletek
          </a>
        </span>
        <button type="button" className="btn footer-cookie-btn">
          Értem!
        </button>
      </div>
    </footer>
  );
}

export default Footer;
