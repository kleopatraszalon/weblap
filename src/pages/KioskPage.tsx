import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./kiosk.css";
import "./kiosk/kiosk-gyongyos.css";
import "./kiosk/kiosk-2026.css";
import "./kiosk/kiosk-pearl.css";
import "./kiosk/kiosk-silver.css";
import "./kiosk/kiosk-kids.css";
import { KioskShell } from "./kiosk/KioskShell";
import { KioskLanding } from "./kiosk/KioskLanding";
import { KioskCategory } from "./kiosk/KioskCategory";
import { KioskPay } from "./kiosk/KioskPay";
import { KioskTicket } from "./kiosk/KioskTicket";

export function KioskPage() {
  return (
    <KioskShell>
      <Routes>
        <Route path="/" element={<KioskLanding />} />
        <Route path="cat/:slug" element={<KioskCategory />} />
        <Route path="pay" element={<KioskPay />} />
        <Route path="ticket" element={<KioskTicket />} />
        <Route path="*" element={<Navigate to="/kiosk" replace />} />
      </Routes>
    </KioskShell>
  );
}

export default KioskPage;
