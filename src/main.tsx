import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installMarketingAttribution } from "./marketingAttribution";
import { installSignageMotionV8 } from "./signageMotionV8";
import { installSignageOfferSpotlightV11 } from "./signageOfferSpotlightV11";
import { installSignageNativeV21 } from "./signageNativeV21";
import "./styles/kleo-theme.css";
import "./styles/website-cms.css";
import "./styles/public-pages.css";
import "./styles/commerce-pages.css";
import "./styles/home-modern.css";
import "./styles/booking-modern.css";
import "./styles/signage-responsive-v5.css";
import "./styles/signage-motion-v8.css";
import "./styles/signage-offer-spotlight-v11.css";
import "./styles/signage-native-v21.css";

installMarketingAttribution();
installSignageMotionV8();
installSignageOfferSpotlightV11();
installSignageNativeV21();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
