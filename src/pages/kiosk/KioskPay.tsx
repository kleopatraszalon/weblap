import React from "react";
import { useNavigate } from "react-router-dom";
import { cartCount, cartTotal, changeCartQty, clearCart, readCart } from "./cartStore";
import { createKioskWorkOrder, fetchKioskConfig, fetchKioskContext } from "./kioskApi";

export function KioskPay() {
  const nav = useNavigate();
  const [cart, setCart] = React.useState(() => readCart());
  const [employees, setEmployees] = React.useState<{id:string;full_name:string}[]>([]);
  const [theme, setTheme] = React.useState<Record<string,any>>({});
  const [locationId, setLocationId] = React.useState(() => localStorage.getItem("kiosk_location_id") || "");
  const [locationName, setLocationName] = React.useState("Gyöngyös");
  const [employeeId, setEmployeeId] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [method, setMethod] = React.useState("reception");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const total = cartTotal(cart), count = cartCount(cart);

  React.useEffect(() => {
    Promise.all([fetchKioskContext(locationId || undefined), fetchKioskConfig(locationId || undefined)]).then(([ctx,cfg]) => {
      const bound=ctx.bound_location||ctx.locations?.[0];
      if(bound){setLocationId(bound.id);setLocationName(bound.name);localStorage.setItem("kiosk_location_id",bound.id)}
      setEmployees(ctx.employees || []); setTheme(cfg.menu?.theme || {});
    }).catch((e) => setError(e.message));
  }, []);

  const refresh = () => setCart(readCart());
  const change = (id:string,delta:number) => { changeCartQty(id,delta); refresh(); };

  async function finalize() {
    if (!cart.length) return setError("A kosár üres.");
    if (!locationId || !name.trim() || (!phone.trim() && !email.trim())) return setError("Adja meg a nevét és legalább egy elérhetőséget.");
    setSaving(true); setError("");
    try {
      const result = await createKioskWorkOrder({ location_id: locationId, employee_id: employeeId || null, client_name: name.trim(), phone: phone.trim(), email: email.trim(), note: note.trim(), payment_method: method, items: cart });
      sessionStorage.setItem("kiosk_last_workorder", JSON.stringify(result));
      clearCart(); refresh(); nav("/kiosk/ticket");
    } catch (e:any) { setError(e.message || "A munkalap létrehozása sikertelen."); }
    finally { setSaving(false); }
  }

  return <div className="kiosk-checkout-page">
    <div className="kiosk-checkout-toolbar"><button onClick={()=>nav(-1)}>← Vissza a választáshoz</button><span>{locationName} · {count} tétel a kosárban</span></div>
    {error&&<div className="kioskError">{error}</div>}
    <div className="kiosk-checkout-grid">
      <section className="kiosk-review-card"><div className="kiosk-checkout-title"><span>3. LÉPÉS</span><h1>Ellenőrizd a rendelést</h1><p>Módosítsd a mennyiséget, ha szükséges.</p></div><div className="kiosk-review-list">{cart.map(item=><article key={item.id}><div className="kiosk-review-thumb">{item.meta?.image_url?<img src={item.meta.image_url} alt=""/>:<span>✦</span>}</div><div className="kiosk-review-copy"><b>{item.title}</b><span>{Number(item.price||0).toLocaleString("hu-HU")} Ft / db</span></div><div className="kiosk-qty-control"><button onClick={()=>change(item.id,-1)}>−</button><strong>{item.qty}</strong><button onClick={()=>change(item.id,1)}>+</button></div><strong className="kiosk-review-line-total">{(Number(item.price||0)*Number(item.qty||1)).toLocaleString("hu-HU")} Ft</strong></article>)}</div><div className="kiosk-review-total"><span>Fizetendő</span><strong>{total.toLocaleString("hu-HU")} Ft</strong></div></section>
      <section className="kiosk-customer-card"><div className="kiosk-checkout-title"><span>4. LÉPÉS</span><h2>Vendégadatok</h2><p>A munkalap a gyöngyösi szalonban jön létre.</p></div><div className="kiosk-form-grid"><div className="wide kiosk-fixed-checkout-location"><span>SZALON</span><b>{locationName}</b></div><label className="wide"><span>Név *</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Teljes név" autoComplete="name"/></label><label><span>Telefonszám</span><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+36 30 123 4567" inputMode="tel"/></label><label><span>E-mail</span><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@pelda.hu" inputMode="email"/></label>{theme.showEmployees!==false&&<label className="wide"><span>Munkatárs (opcionális)</span><select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">A recepció ossza ki</option>{employees.map(x=><option key={x.id} value={x.id}>{x.full_name}</option>)}</select></label>}<label className="wide"><span>Megjegyzés</span><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Pl. érzékenység, külön kérés…"/></label></div></section>
    </div>
    <section className="kiosk-payment-card"><div className="kiosk-checkout-title"><span>5. LÉPÉS</span><h2>Hogyan szeretnél fizetni?</h2><p>A tényleges pénzügyi lezárás a VIR pénztárában történik.</p></div><div className="kiosk-payment-options"><button className={method==="card"?"active":""} onClick={()=>setMethod("card")}><span className="pay-icon">💳</span><b>Bankkártya</b><small>terminál</small></button><button className={method==="szep"?"active":""} onClick={()=>setMethod("szep")}><span className="pay-icon">◆</span><b>SZÉP kártya</b><small>recepciós ellenőrzéssel</small></button><button className={method==="reception"?"active":""} onClick={()=>setMethod("reception")}><span className="pay-icon">🏪</span><b>Fizetés a recepción</b><small>készpénz vagy más mód</small></button></div><div className="kiosk-final-row"><button className="kiosk-clear-order" onClick={()=>{clearCart();refresh();nav("/kiosk")}}>Rendelés törlése</button><button className="kiosk-finalize-button" disabled={saving||!cart.length} onClick={()=>void finalize()}>{saving?"Munkalap létrehozása…":<>Rendelés véglegesítése <strong>{total.toLocaleString("hu-HU")} Ft</strong><span>→</span></>}</button></div></section>
  </div>;
}
