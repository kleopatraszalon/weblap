
import React, {useMemo, useState, useEffect} from "react";
import { useI18n } from "../i18n";
import "../styles/franchiseLanding.css";
import { getCopy, LandingForm, SparkleIcon, PlayIcon } from "../components/FranchiseLanding";

export function FranchiseV1Page() {
  const { lang } = useI18n();
  const c = useMemo(() => getCopy(lang as any), [lang]);
  const [open, setOpen] = useState(false);

  return (
    <div className="fr-landing">
      <section className="fr-hero">
        <div className="fr-hero-inner">
          <div className="fr-badge"><SparkleIcon /></div>
          <h1 className="fr-title" dangerouslySetInnerHTML={{ __html: c.heroTitle }} />
          <p className="fr-sub">{c.heroSub}</p>

          <div className="fr-video-card" role="region" aria-label={c.videoTitle}>
            <div className="fr-play"><PlayIcon /></div>
            <h3 className="fr-video-title">{c.videoTitle}</h3>
            <p className="fr-video-sub">{c.videoSub}</p>
            <button className="fr-btn" style={{ marginTop: 18 }} onClick={() => setOpen(true)}>
              {c.cta}
            </button>
          </div>
        </div>
      </section>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 9999,
          }}
        >
          <div
            className="fr-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(860px, 100%)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <h2 className="fr-h2" style={{ margin: 0 }}>{c.formTitle}</h2>
              <button className="fr-btn" style={{ background: "#0b1220", color: "#fff" }} onClick={() => setOpen(false)}>
                X
              </button>
            </div>
            <p className="fr-lead">{c.formLead}</p>
            <LandingForm variant="franchise-v1" />
          </div>
        </div>
      )}
    </div>
  );
}

export default FranchiseV1Page;