import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitToMailchimp } from "../utils/mailchimp";
import { setRobotsNoIndex } from "../utils/seo";
import "../kleo-theme.css";

export function FranchiseInfoPage() {
  const nav = useNavigate();
  useEffect(() => {
    document.title = "Franchise – jelentkezési adatlap (belső)";
    setRobotsNoIndex(true);
    return () => setRobotsNoIndex(false);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    hasSalon: "",
    timeframe: "",
    investment: "",
    experience: "",
    message: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitToMailchimp({
      FNAME: form.name,
      EMAIL: form.email,
      PHONE: form.phone,
      CITY: form.city,
      HAS_SALON: form.hasSalon,
      TIMEFRAME: form.timeframe,
      INVESTMENT: form.investment,
      EXPERIENCE: form.experience,
      MESSAGE: form.message,
      SOURCE: "franchise-info",
    });
    nav("/franchise-koszonjuk");
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Franchise – részletes adatmegadás</h1>
        <p className="section-lead">
          Cél: részletes lead információ gyűjtése. Ez az oldal noindex.
        </p>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              title="Franchise info video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ padding: "1rem 1rem 0.25rem 1rem" }}>
            <h2 className="card-title">Kérjük, töltsd ki az alábbi adatlapot</h2>
            <p className="card-text">
              Az adatok kizárólag kapcsolatfelvétel és franchise tájékoztatás céljából kerülnek felhasználásra.
            </p>
          </div>

          <div style={{ padding: "0 1rem 1rem 1rem" }}>
            <form onSubmit={onSubmit}>
              <div className="grid-two" style={{ gap: "1rem" }}>
                <div className="form-field">
                  <label>Név</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>E-mail</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Telefonszám</label>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Város</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
              </div>

              <div className="grid-two" style={{ gap: "1rem" }}>
                <div className="form-field">
                  <label>Van már működő szalonod?</label>
                  <select value={form.hasSalon} onChange={(e) => set("hasSalon", e.target.value)} required>
                    <option value="" disabled>Válassz...</option>
                    <option value="igen">Igen</option>
                    <option value="nem">Nem</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Mikor szeretnél indulni?</label>
                  <select value={form.timeframe} onChange={(e) => set("timeframe", e.target.value)} required>
                    <option value="" disabled>Válassz...</option>
                    <option value="0-1-honap">0–1 hónap</option>
                    <option value="1-3-honap">1–3 hónap</option>
                    <option value="3-6-honap">3–6 hónap</option>
                    <option value="6plusz">6+ hónap</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Becsült befektetési keret</label>
                <select value={form.investment} onChange={(e) => set("investment", e.target.value)} required>
                  <option value="" disabled>Válassz...</option>
                  <option value="1-3m">1–3 M Ft</option>
                  <option value="3-6m">3–6 M Ft</option>
                  <option value="6-10m">6–10 M Ft</option>
                  <option value="10mplusz">10+ M Ft</option>
                </select>
              </div>

              <div className="form-field">
                <label>Tapasztalat / háttér</label>
                <textarea value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Pár mondatban..." />
              </div>

              <div className="form-field">
                <label>Megjegyzés</label>
                <textarea value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Kérdés, cél, elképzelés..." />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary btn-primary--magenta">
                  Beküldés
                </button>
              </div>

              <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--color-muted)" }}>
                Beküldéskor a rendszer Mailchimp listába továbbítja az adatokat (VITE_MAILCHIMP_POST_URL beállítással).
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FranchiseInfoPage;
