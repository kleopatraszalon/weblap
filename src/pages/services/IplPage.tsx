import React from "react";
import "../../styles/kleo-theme v6.css";import { useI18n } from "../../i18n";

export const IplPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="service-detail">
      <div
        className="service-hero service-hero--image"
        style={{ backgroundImage: "url('/images/ipl.jpg')" }}
      >
        <div className="service-hero-overlay">
          <h1 className="service-hero-title service-hero-title--center">
            {t("services.highlight.ipl.title")}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default IplPage;
