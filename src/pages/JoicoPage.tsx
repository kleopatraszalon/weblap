import React from "react";
import "../../kleo-theme v3.css";
import { useI18n } from "../../i18n";

export const JoicoPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <main className="service-detail">
      <div
        className="service-hero service-hero--image"
        style={{ backgroundImage: "url('/images/joico.png')" }}
      >
        <div className="service-hero-overlay">
          <h1 className="service-hero-title service-hero-title--center">
            {t("services.highlight.joico.title")}
          </h1>
        </div>
      </div>
    </main>
  );
};

export default JoicoPage;
