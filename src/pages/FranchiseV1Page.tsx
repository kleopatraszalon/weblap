import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitToMailchimp } from "../utils/mailchimp";
import { setRobotsNoIndex } from "../utils/seo";
import "../kleo-theme.css";

export function FranchiseV1Page() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    document.title = "Franchise – videó (belső)";
    setRobotsNoIndex(true);
    return () => setRobotsNoIndex(false);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitToMailchimp({
      FNAME: name,
      EMAIL: email,
      PHONE: phone,
      SOURCE: "franchise-v1",
    });
    nav("/franchise-koszonjuk");
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="section-title">Franchise – videós landing (v1)</h1>
        <p className="section-lead">
          Ez az oldal nem jelenik meg a menüben, és keresőkben sem (noindex).
        </p>

        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              title="Franchise video"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div style={{ padding: "1rem" }}>
            <button className="btn btn-primary btn-primary--magenta" onClick={() => setOpen(true)}>
              Jelentkezem – kérem a részleteket
            </button>
          </div>
        </div>

        {open && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 9999,
            }}
          >
            <div
              className="card"
              onClick={(ev) => ev.stopPropagation()}
              style={{ width: "min(720px, 100%)", padding: "1.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <h2 className="card-title" style={{ margin: 0 }}>Kapcsolatfelvétel</h2>
                <button className="btn" onClick={() => setOpen(false)}>Bezár</button>
              </div>

              <form onSubmit={onSubmit} style={{ marginTop: "1rem" }}>
                <div className="form-field">
                  <label>Név</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>E-mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-field">
                  <label>Telefonszám</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button type="button" className="btn" onClick={() => setOpen(false)}>
                    Mégse
                  </button>
                  <button type="submit" className="btn btn-primary btn-primary--magenta">
                    Küldés
                  </button>
                </div>
              </form>
              <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--color-muted)" }}>
                Beküldéskor a rendszer Mailchimp listába továbbítja az adatokat (VITE_MAILCHIMP_POST_URL beállítással).
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default FranchiseV1Page;
