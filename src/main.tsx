import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installMarketingAttribution } from "./marketingAttribution";
import { installSignageMotion } from "./signageMotion";
import { installSignageMotionV8 } from "./signageMotionV8";
import "./styles/kleo-theme.css";
import "./styles/website-cms.css";
import "./styles/public-pages.css";
import "./styles/commerce-pages.css";
import "./styles/home-modern.css";
import "./styles/booking-modern.css";
import "./styles/signage-responsive-v5.css";
import "./styles/signage-motion-v6.css";
import "./styles/signage-motion-v8.css";

installMarketingAttribution();
installSignageMotion();
installSignageMotionV8();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);