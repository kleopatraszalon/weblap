import React from "react";
import { useNavigate } from "react-router-dom";
import { cartTotal, clearCart, readCart, removeFromCart } from "./cartStore";
import { createKioskWorkOrder, fetchKioskContext } from "./kioskApi";

export function KioskPay() {
  const nav = useNavigate();
  const [cart, setCart] = React.useState(() => readCart());
  const [locations, setLocations] = React.useState<{id:string;name:string}[]>([]);
  const [employees, setEmployees] = React.useState<{id:string;full_name:string}[]>([]);
  const [locationId, setLocationId] = React.useState(() => localStorage.getItem("kiosk_location_id") || "");
  const [employeeId, setEmployeeId] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const total = cartTotal(cart);

  React.useEffect(() => {
    fetchKioskContext(locationId || undefined).then((d) => {
      setLocations(d.locations || []); setEmployees(d.employees || []);
      if (!locationId && d.locations?.[0]?.id) { setLocationId(d.locations[0].id); localStorage.setItem("kiosk_location_id", d.locations[0].id); }
    }).catch((e) => setError(e.message));
  }, []);

  React.useEffect(() => {
    if (!locationId) return;
    localStorage.setItem("kiosk_location_id", locationId);
    fetchKioskContext(locationId).then((d) => { setEmployees(d.employees || []); setEmployeeId(""); }).catch(() => undefined);
  }, [locationId]);

  function refresh() { setCart(readCart()); }

  async function finalize(method: string) {
    if (!cart.length) return setError("A kosár üres.");
    if (!locationId || !name.trim() || (!phone.trim() && !email.trim())) return setError("Válasszon szalont, adja meg a nevét és legalább egy elérhetőséget.");
    setSaving(true); setError("");
    try {
      const result = await createKioskWorkOrder({
        location_id: locationId, employee_id: employeeId || null, client_name: name.trim(), phone: phone.trim(), email: email.trim(), note: note.trim(), payment_method: method, items: cart,
      });
      sessionStorage.setItem("kiosk_last_workorder", JSON.stringify(result));
      clearCart(); refresh(); nav("/kiosk/ticket");
    } catch (e:any) { setError(e.message || "A munkalap létrehozása sikertelen."); }
    finally { setSaving(false); }
  }

  return <div className="kioskPayPage">
    <div className="kioskBackRow"><button className="kioskBtn" onClick={() => nav(-1 as any)}>← Vissza</button><button className="kioskBtn" onClick={() => { clearCart(); refresh(); }}>Kosár ürítése</button></div>
    <div className="kioskPanelTitle">Vendégadatok és munkalap</div>
    {error && <div className="kioskError">{error}</div>}
    <div className="kioskPayGrid">
      <div className="kioskPayLeft">
        <div className="kioskCartList">{cart.length === 0 ? <div className="kioskInfo">A kosár üres.</div> : cart.map((c) => <div key={c.id} className="kioskCartRow"><div><div className="kioskCartRowTitle">{c.title}</div><div className="kioskCartRowSub">{c.qty} × {c.price.toLocaleString("hu-HU")} Ft</div></div><button className="kioskIconBtn" onClick={() => { removeFromCart(c.id); refresh(); }}>🗑</button></div>)}</div>
        <div className="kioskTotalRow"><div>Összesen</div><div className="kioskTotalValue">{total.toLocaleString("hu-HU")} Ft</div></div>
      </div>
      <div className="kioskPayRight">
        <div style={{display:"grid",gap:12,padding:18,background:"#fff",borderRadius:18}}>
          <label>Szalon<select style={field} value={locationId} onChange={e=>setLocationId(e.target.value)}><option value="">Válasszon szalont</option>{locations.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label>Név *<input style={field} value={name} onChange={e=>setName(e.target.value)} placeholder="Teljes név"/></label>
          <label>Telefonszám<input style={field} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+36 30 123 4567"/></label>
          <label>E-mail<input style={field} value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@pelda.hu"/></label>
          <label>Munkatárs (opcionális)<select style={field} value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">Recepció osztja ki</option>{employees.map(x=><option key={x.id} value={x.id}>{x.full_name}</option>)}</select></label>
          <label>Megjegyzés<input style={field} value={note} onChange={e=>setNote(e.target.value)} placeholder="Opcionális"/></label>
        </div>
        <div className="kioskPayMethods" style={{marginTop:14}}>
          <button disabled={saving} className="kioskPayMethod" onClick={() => finalize("card")}>{saving?"Mentés…":"Bankkártya / terminál"}</button>
          <button disabled={saving} className="kioskPayMethod" onClick={() => finalize("szep")}>SZÉP kártya</button>
          <button disabled={saving} className="kioskPayMethod" onClick={() => finalize("reception")}>Fizetés a recepción</button>
        </div>
        <div className="kioskInfo" style={{marginTop:12}}>A kiosk itt nem könyvel automatikusan banki teljesítést: a választott fizetési mód a munkalapra kerül, a pénzügyi lezárás a VIR-ben történik.</div>
      </div>
    </div>
  </div>;
}
const field:React.CSSProperties={display:"block",width:"100%",marginTop:6,padding:"12px 14px",border:"1px solid #d9cdbd",borderRadius:12,fontSize:16,background:"#fff"};
