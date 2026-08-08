import React from "react";
import { useNavigate } from "react-router-dom";

export function KioskTicket() {
  const nav = useNavigate();
  const workOrder = React.useMemo(() => { try { return JSON.parse(sessionStorage.getItem("kiosk_last_workorder") || "null"); } catch { return null; } }, []);
  return <div className="kioskTicketPage">
    <div className="kioskPanelTitle">Munkalap létrehozva</div>
    <div className="kioskTicketBox">
      <div className="kioskTicketLabel">Köszönjük! A VIR munkalapszáma:</div>
      <div className="kioskTicketNo" style={{fontSize:"clamp(34px,5vw,64px)"}}>{workOrder?.work_order_number || "Rögzítve"}</div>
      <div className="kioskTicketSub">A rendelés/szolgáltatás új munkalapként bekerült a szalon rendszerébe. A recepció innen folytathatja és zárhatja le.</div>
      {workOrder?.status && <div className="kioskInfo" style={{marginTop:14}}>Állapot: Új / várakozik</div>}
    </div>
    <button className="kioskBtn kioskPrimaryBtn" onClick={() => { sessionStorage.removeItem("kiosk_last_workorder"); nav("/kiosk"); }}>Új rendelés</button>
  </div>;
}
