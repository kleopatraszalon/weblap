import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchKioskConfig, fetchKioskQueueTicket } from "./kioskApi";

export function KioskTicket() {
  const nav = useNavigate();
  const workOrder = React.useMemo(() => { try { return JSON.parse(sessionStorage.getItem("kiosk_last_workorder") || "null"); } catch { return null; } }, []);
  const [seconds,setSeconds]=React.useState(30);
  const [theme,setTheme]=React.useState<Record<string,any>>({});
  const [queue,setQueue]=React.useState<any>(null);

  const reset=React.useCallback(()=>{
    sessionStorage.removeItem("kiosk_last_workorder");
    sessionStorage.removeItem("kiosk_started");
    nav("/kiosk");
  },[nav]);

  React.useEffect(()=>{
    const locationId=localStorage.getItem("kiosk_location_id");
    fetchKioskConfig(locationId).then(cfg=>{const t=cfg.menu?.theme||{};setTheme(t);setSeconds(Math.max(10,Math.min(120,Number(t.autoResetSeconds||30))) )}).catch(()=>undefined);
    const workOrderId=String(workOrder?.id||workOrder?.work_order_id||"").trim();
    if(workOrderId)fetchKioskQueueTicket(workOrderId).then(setQueue).catch(()=>undefined);
  },[workOrder]);
  React.useEffect(()=>{const t=window.setInterval(()=>setSeconds(v=>{if(v<=1){window.clearInterval(t);window.setTimeout(reset,0);return 0}return v-1}),1000);return()=>window.clearInterval(t)},[reset]);

  const queueCode=queue?.kiosk_queue_code||workOrder?.kiosk_queue_code||"";
  const workOrderNumber=queue?.work_order_number||workOrder?.work_order_number||"Rögzítve";

  return <section className="kiosk-success-page">
    <div className="kiosk-success-card">
      <div className="kiosk-success-mark">✓</div>
      <span className="kiosk-success-kicker">SIKERES RÖGZÍTÉS</span>
      <h1>Köszönjük!</h1>
      <p>A rendelésed bekerült a szalon VIR rendszerébe új munkalapként.</p>
      <div className="kiosk-ticket-number"><span>Napi sorszámod</span><strong>{queueCode||"KIOSK…"}</strong></div>
      <div className="kiosk-ticket-number"><span>Munkalapszám</span><strong>{workOrderNumber}</strong></div>
      <div className="kiosk-ticket-status"><span>Állapot</span><b>Várakozik</b></div>
      <p className="kiosk-ticket-help">Kérjük, jegyezd meg a <strong>{queueCode||"KIOSK sorszámodat"}</strong>, és figyeld a kijelzőt. Amikor a recepció továbbenged, a sorszámod a „Mehet a szakemberhez” oszlopban jelenik meg a szakember nevével és – ha rendelkezésre áll – a fotójával.</p>
      <button className="kiosk-new-order-button" onClick={reset}>Új rendelés <span>→</span></button>
      <small className="kiosk-reset-note">A képernyő {seconds} másodperc múlva automatikusan visszaáll.</small>
      {theme.logoUrl&&<img className="kiosk-success-logo" src={theme.logoUrl} alt="Kleopátra"/>}
    </div>
  </section>;
}
