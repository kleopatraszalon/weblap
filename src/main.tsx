import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SignageLineMascot from "./components/SignageLineMascot";
import { installMarketingAttribution } from "./marketingAttribution";
import { installSignageMotionV8 } from "./signageMotionV8";
import { installSignageMotionV9 } from "./signageMotionV9";
import "./styles/kleo-theme.css";
import "./styles/website-cms.css";
import "./styles/public-pages.css";
import "./styles/commerce-pages.css";
import "./styles/home-modern.css";
import "./styles/booking-modern.css";
import "./styles/signage-responsive-v5.css";
import "./styles/signage-motion-v8.css";

installMarketingAttribution();
installSignageMotionV8();
installSignageMotionV9();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <SignageLineMascot />
  </React.StrictMode>
);
