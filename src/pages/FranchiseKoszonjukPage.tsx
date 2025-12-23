
import React from "react";
import "../styles/franchiseLanding.css";
import { useI18n } from "../i18n";

export function FranchiseKoszonjukPage() {
  const { lang } = useI18n();
  const title =
    lang === "ru" ? "Спасибо!" : lang === "en" ? "Thank you!" : "Köszönjük!";
  const lead =
    lang === "ru"
      ? "Мы получили ваши данные и свяжемся с вами в ближайшее время."
      : lang === "en"
      ? "We have received your details and will contact you shortly."
      : "Megkaptuk az adataidat, hamarosan felvesszük veled a kapcsolatot.";

  return (
    <div className="fr-landing">
      <section className="fr-section">
        <div className="fr-container">
          <h1 className="fr-h2">{title}</h1>
          <p className="fr-lead">{lead}</p>
        </div>
      </section>
    </div>
  );
}

export default FranchiseKoszonjukPage;