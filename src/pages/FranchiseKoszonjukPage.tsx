import React from "react";
import "../styles/franchiseLanding.css";
import { useI18n } from "../i18n";
import { useNoIndex } from "../hooks/useNoIndex";

export function FranchiseKoszonjukPage() {
  const { lang } = useI18n();
  useNoIndex();

  const title = lang === "ru" ? "Спасибо!" : lang === "en" ? "Thank you!" : "Köszönjük!";
  const lead = lang === "ru"
    ? "Мы получили ваши данные и свяжемся с вами в ближайшее время."
    : lang === "en"
      ? "We have received your details and will contact you shortly."
      : "Megkaptuk az adataidat. A franchise csapat hamarosan felveszi veled a kapcsolatot.";

  return (
    <main className="fr-landing">
      <section className="fr-section" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <div className="fr-container" style={{ textAlign: "center" }}>
          <h1 className="fr-h2">{title}</h1>
          <p className="fr-lead">{lead}</p>
        </div>
      </section>
    </main>
  );
}

export default FranchiseKoszonjukPage;
