import React, { useMemo, useState } from "react";
import { useI18n } from "../i18n";
import "../styles/franchiseLanding.css";
import { getCopy, SparkleIcon } from "../components/FranchiseLanding";
import FranchiseLeadForm from "../components/FranchiseLeadForm";
import { useNoIndex } from "../hooks/useNoIndex";

export function FranchiseV1Page() {
  const { lang } = useI18n();
  const c = useMemo(() => getCopy(lang as any), [lang]);
  const [open, setOpen] = useState(false);
  const videoUrl = String(import.meta.env.VITE_FRANCHISE_V1_VIDEO_URL || import.meta.env.VITE_FRANCHISE_VIDEO_URL || "");
  useNoIndex();

  return (
    <main className="fr-landing">
      <section className="fr-hero">
        <div className="fr-hero-inner">
          <div className="fr-badge"><SparkleIcon /></div>
          <h1 className="fr-title" dangerouslySetInnerHTML={{ __html: c.heroTitle }} />
          <p className="fr-sub">{c.heroSub}</p>

          <div className="fr-video-card" role="region" aria-label="Kleopátra franchise videó">
            {videoUrl ? (
              <video controls preload="metadata" poster="/images/franchise.png" style={{ width: "100%", borderRadius: 20, display: "block" }}>
                <source src={videoUrl} />
                A böngésződ nem támogatja a videó lejátszását.
              </video>
            ) : (
              <div style={{ padding: "34px 16px" }}>
                <h2 className="fr-video-title">Franchise videó</h2>
                <p className="fr-video-sub">A kampányvideó URL-je a VITE_FRANCHISE_V1_VIDEO_URL beállítással kapcsolható be.</p>
              </div>
            )}
            <button type="button" className="fr-btn" style={{ marginTop: 18 }} onClick={() => setOpen(true)}>
              Kérem a részleteket
            </button>
          </div>
        </div>
      </section>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="LP_form – franchise kapcsolatfelvételi űrlap"
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.68)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 9999, overflowY: "auto" }}
        >
          <div className="fr-card" onClick={(e) => e.stopPropagation()} style={{ width: "min(920px, 100%)", maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <h2 className="fr-h2" style={{ margin: 0 }}>Kérj franchise információt</h2>
              <button type="button" className="fr-btn" style={{ width: 48, padding: 10, background: "#0b1220", color: "#fff" }} onClick={() => setOpen(false)} aria-label="Bezárás">×</button>
            </div>
            <p className="fr-lead">Add meg a neved, e-mail címed és telefonszámod. Sikeres LP_form beküldés után megmutatjuk a részletes franchise ajánlatot.</p>
            <FranchiseLeadForm variant="lp" compact successPath="/ajanlat" />
          </div>
        </div>
      )}
    </main>
  );
}

export default FranchiseV1Page;
