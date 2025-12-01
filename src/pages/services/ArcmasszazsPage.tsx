import React from "react";
import "../../kleo-theme.css";
import { useI18n } from "../../i18n";

export const ArcmasszazsPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="service-detail">
      <div
        className="service-hero service-hero--image"
        style={{ backgroundImage: "url('/images/arcmasszazs.jpg')" }}
      >
        <div className="service-hero-overlay">
          <h1 className="service-hero-title service-hero-title--center">
            {t("services.highlight.facemassage.title")}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default ArcmasszazsPage;
