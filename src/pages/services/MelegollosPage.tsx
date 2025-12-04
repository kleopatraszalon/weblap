import React from "react";
import "../../styles/kleo-theme v7.css";import { useI18n } from "../../i18n";

export const MelegollosPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="service-detail">
      <div
        className="service-hero service-hero--image"
        style={{ backgroundImage: "url('/images/Melegollos.jpg')" }}
      >
        <div className="service-hero-overlay">
          <h1 className="service-hero-title service-hero-title--center">
            {t("services.highlight.hotcut.title")}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default MelegollosPage;
