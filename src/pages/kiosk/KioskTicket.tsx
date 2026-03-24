import React from "react";
import { useNavigate } from "react-router-dom";

function genTicket() {
  return Math.floor(100 + Math.random() * 900);
}

export function KioskTicket() {
  const nav = useNavigate();
  const [ticket] = React.useState(() => genTicket());

  return (
    <div className="kioskTicketPage">
      <div className="kioskPanelTitle">Sorszám</div>
      <div className="kioskTicketBox">
        <div className="kioskTicketLabel">Köszönjük! A sorszámod:</div>
        <div className="kioskTicketNo">{ticket}</div>
        <div className="kioskTicketSub">Kérjük fáradjon a recepcióhoz a sorszámmal.</div>
      </div>
      <button className="kioskBtn kioskPrimaryBtn" onClick={() => nav("/kiosk")}>Új rendelés</button>
    </div>
  );
}
