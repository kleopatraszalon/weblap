import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installMarketingAttribution } from "./marketingAttribution";
import { installBookingFunnelTracking } from "./bookingFunnel";
import "./styles/kleo-theme.css";
import "./styles/website-cms.css";
import "./styles/public-pages.css";
import "./styles/commerce-pages.css";
import "./styles/home-modern.css";
import "./styles/booking-modern.css";

installMarketingAttribution();
installBookingFunnelTracking();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);