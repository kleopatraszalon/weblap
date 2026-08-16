import React, { useMemo } from "react";
import { useI18n } from "../i18n";
import "../styles/franchiseLanding.css";
import { getCopy, SparkleIcon } from "../components/FranchiseLanding";
import FranchiseLeadForm, { FranchiseExtraField } from "../components/FranchiseLeadForm";
import { useNoIndex } from "../hooks/useNoIndex";

export function FranchiseInfoPage() {
  const { lang } = useI18n();
  const c = useMemo(() => getCopy(lang as any), [lang]);
  const videoUrl = String(import.meta.env.VITE_FRANCHISE_INFO_VIDEO_URL || import.meta.env.VITE_FRANCHISE_VIDEO_URL || "");
  useNoIndex();

  const fields: FranchiseExtraField[] = [
    { key: "AGE", label: "Életkor", type: "number", required: true },
    { key: "CITY", label: "Melyik városban / régióban nyitnál szalont?", required: true },
    { key: "MOTIVATION", label: "Miért érdekel a Kleopátra franchise és a szépségipar?", type: "textarea", required: true },
    { key: "EXPERIENCE", label: "Van szépségipari, kereskedelmi vagy vállalkozói tapasztalatod?", type: "textarea", required: true },
    {
      key: "OWNER_ROLE",
      label: "Milyen szerepet vállalnál a szalonban?",
      type: "select",
      required: true,
      options: ["Személyesen is dolgoznék a szalonban", "Menedzserként / üzemeltetőként vezetném", "Befektetőként, külön menedzsmenttel működtetném", "Még nem döntöttem el"],
    },
    {
      key: "CAPITAL",
      label: "Milyen saját tőkével / finanszírozással tervezel?",
      type: "select",
      required: true,
      options: ["7,5–15 M Ft saját tőke rendelkezésre áll", "Részben finanszírozásra is szükségem van", "Finanszírozás szükséges", "Még tervezési szakaszban vagyok"],
    },
    {
      key: "TIMELINE",
      label: "Mikor szeretnél indulni?",
      type: "select",
      required: true,
      options: ["3–6 hónapon belül", "6–12 hónapon belül", "12 hónapnál később", "Még nincs konkrét időpont"],
    },
    {
      key: "TRAINING",
      label: "Vállalod a franchise rendszerhez tartozó kötelező képzést és mentorálást?",
      type: "select",
      required: true,
      options: ["Igen", "Nem", "Szeretnék róla előbb részletes tájékoztatást"],
    },
    { key: "CONSULTATION_TIME", label: "Mikor lenne megfelelő egy személyes / online konzultáció?", type: "datetime-local" },
    { key: "OTHER", label: "Egyéb kérdés vagy megjegyzés", type: "textarea" },
  ];

  return (
    <main className="fr-landing">
      <section className="fr-hero">
        <div className="fr-hero-inner">
          <div className="fr-badge"><SparkleIcon /></div>
          <h1 className="fr-title">Kleopátra franchise – részletes partneri jelentkezés</h1>
          <p className="fr-sub">{c.heroSub}</p>

          <div className="fr-video-card" role="region" aria-label="Kleopátra franchise tájékoztató videó">
            {videoUrl ? (
              <video controls preload="metadata" poster="/images/franchise.png" style={{ width: "100%", borderRadius: 20, display: "block" }}>
                <source src={videoUrl} />
                A böngésződ nem támogatja a videó lejátszását.
              </video>
            ) : (
              <div style={{ padding: "34px 16px" }}>
                <h2 className="fr-video-title">Részletes franchise videó</h2>
                <p className="fr-video-sub">A videó URL-je a VITE_FRANCHISE_INFO_VIDEO_URL beállítással kapcsolható be.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="fr-section">
        <div className="fr-container">
          <h2 className="fr-h2">Ismerjünk meg jobban</h2>
          <p className="fr-lead">A következő adatok segítenek abban, hogy a konzultációra már a lokációhoz, a tervezett szerepedhez, a finanszírozáshoz és az indulási időhöz illeszkedő franchise információval készüljünk.</p>
          <FranchiseLeadForm variant="franchise-info" extraFields={fields} />
        </div>
      </section>
    </main>
  );
}

export default FranchiseInfoPage;
