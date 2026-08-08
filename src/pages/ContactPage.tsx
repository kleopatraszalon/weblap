import React, { FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import PublicPageHero from "../components/PublicPageHero";
import { useWebsiteCms } from "../websiteCms";

export const ContactPage: React.FC = () => {
  const { pages } = useWebsiteCms(); const p=pages.contact;
  const [message, setMessage] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setMessage("Az űrlapot kitöltötted, de az e-mail/CRM bekötés még fejlesztés alatt áll. Időpont ügyben használd az online foglalást, egyéb ügyben keresd közvetlenül a kiválasztott szalont."); };

  return <main>
    <PublicPageHero eyebrow={p.eyebrow} title={<>{p.titlePrefix}<span className="highlight">{p.titleHighlight}</span>{p.titleSuffix}</>} lead={<p>{p.lead}</p>} image={p.imageUrl} imageAlt="Kapcsolat a Kleopátra Szépségszalonokkal" actions={<><NavLink to="/booking" className="btn btn-primary">Időpontfoglalás</NavLink><NavLink to="/salons" className="btn btn-outline">Szalonok</NavLink></>} />
    <section className="public-section"><div className="container contact-layout">
      <form className="form-card beauty-form" onSubmit={handleSubmit}><p className="section-eyebrow">Üzenetküldés</p><h2 className="form-title">{p.sectionTitle}</h2><p className="form-intro">{p.sectionLead}</p>
        <fieldset className="beauty-fieldset"><legend className="beauty-legend">Elérhetőségek</legend><div className="form-row form-row--two"><label className="field"><span>Teljes név*</span><input type="text" name="name" required/></label><label className="field"><span>E-mail cím*</span><input type="email" name="email" required/></label></div><div className="form-row form-row--two"><label className="field"><span>Telefonszám</span><input type="tel" name="phone"/></label><label className="field"><span>Preferált szalon</span><select name="location"><option>Összes szalon</option><option>Budapest IX. – Mester u. 1.</option><option>Budapest VIII. – Rákóczi u. 63.</option><option>Budapest XII. – Krisztina krt. 23.</option><option>Budapest XIII. – Visegrádi u. 3.</option><option>Gyöngyös – Koháry u. 29.</option><option>Eger – Dr. Nagy János u. 8.</option><option>Salgótarján – Füleki u. 44.</option></select></label></div></fieldset>
        <fieldset className="beauty-fieldset"><legend className="beauty-legend">Téma</legend><div className="choice-pills">{["Fodrászat","Kozmetika","Kéz- és lábápolás","Masszázs","Franchise","Karrier","Oktatás","Panasz / visszajelzés"].map(topic=><label className="choice-pill" key={topic}><input type="checkbox" name="topic" value={topic}/><span>{topic}</span></label>)}</div></fieldset>
        <fieldset className="beauty-fieldset"><legend className="beauty-legend">Kapcsolatfelvétel módja</legend><div className="choice-pills choice-pills--soft"><label className="choice-pill choice-pill--outline"><input type="radio" name="contactType" value="email" defaultChecked/><span>E-mail</span></label><label className="choice-pill choice-pill--outline"><input type="radio" name="contactType" value="phone"/><span>Telefon</span></label><label className="choice-pill choice-pill--outline"><input type="radio" name="contactType" value="either"/><span>Bármelyik</span></label></div></fieldset>
        <fieldset className="beauty-fieldset"><legend className="beauty-legend">Üzenet</legend><label className="field"><span>Üzenet / kérés*</span><textarea name="message" rows={6} placeholder="Írd le röviden, miben segíthetünk…" required/></label></fieldset>
        <button type="submit" className="btn btn-primary">Üzenet ellenőrzése</button>{message&&<div className="notice-card" style={{marginTop:16}}>{message}</div>}
      </form>
      <aside className="feature-card contact-aside"><span className="feature-card__kicker">Gyors ügyintézés</span><h2>Időponttal kapcsolatban</h2><p>Új foglaláshoz az online időpontfoglaló a leggyorsabb megoldás. Meglévő foglalás sürgős módosításához vagy lemondásához közvetlenül az adott szalonnal érdemes egyeztetni.</p><div className="public-page-hero__actions"><NavLink to="/booking" className="btn btn-primary">Foglalás</NavLink><NavLink to="/salons" className="btn btn-outline">Szalonok</NavLink></div><hr className="card-divider"/><h3>Panasz és visszajelzés</h3><p>A VIR-specifikáció szerint a panaszkezelést külön, visszakereshető rendszerben kell rögzíteni. Ennek teljes publikus bekötése még külön fejlesztési lépés.</p></aside>
    </div></section>
  </main>;
};
