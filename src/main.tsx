import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installMarketingAttribution } from "./marketingAttribution";
import { installSignageMotionV8 } from "./signageMotionV8";
import { installSignageMotionV10 } from "./signageMotionV10";
import { installSignageOfferSpotlightV11 } from "./signageOfferSpotlightV11";
import { installSignageInfoCardsV13 } from "./signageInfoCardsV13";
import "./styles/kleo-theme.css";
import "./styles/website-cms.css";
import "./styles/public-pages.css";
import "./styles/commerce-pages.css";
import "./styles/home-modern.css";
import "./styles/booking-modern.css";
import "./styles/signage-responsive-v5.css";
import "./styles/signage-motion-v8.css";
import "./styles/signage-motion-v10.css";
import "./styles/signage-offer-spotlight-v11.css";
import "./styles/signage-info-cards-v13.css";

installMarketingAttribution();
installSignageMotionV8();
installSignageMotionV10();
installSignageOfferSpotlightV11();
installSignageInfoCardsV13();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
