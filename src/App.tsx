// src/App.tsx
import React, { useEffect, useState } from "react";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { SalonsPage } from "./pages/SalonsPage";
import { SalonDetailPage } from "./pages/SalonDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import { SzempillaPage } from "./pages/services/SzempillaPage";
import { HajmosasPage } from "./pages/services/HajmosasPage";
import { ArcmasszazsPage } from "./pages/services/ArcmasszazsPage";
import { ActisztitasPage } from "./pages/services/ActisztitasPage";
import { JoicoPage } from "./pages/services/JoicoPage";
import { MelegollosPage } from "./pages/services/MelegollosPage";
import { IplPage } from "./pages/services/IplPage";
import { BrowserRouter } from "react-router-dom"

import { PriceListPage } from "./pages/PriceListPage";
import { LoyaltyPage } from "./pages/LoyaltyPage";
import { FranchisePage } from "./pages/FranchisePage";
import { CareerPage } from "./pages/CareerPage";
import { TrainingPage } from "./pages/TrainingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { WebshopPage } from "./pages/WebshopPage";
import { WebshopProductDetailPage } from "./pages/WebshopProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import type { CartItem } from "./utils/cart";
import { LanguageProvider } from "./i18n";
import { Footer } from "./components/Footer"; // ⬅️ ÚJ
/**
 * Lebegő kosár gomb a jobb felső sarokban.
 * - Mindig látszik, bármelyik oldalon vagyunk
 * - A badge-ben mutatja a kosárban lévő tételek számát
 * - Kattintásra a /cart oldalra navigál
 */
const FloatingCartButton: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  // Kosár darabszám kiolvasása a localStorage-ből
  const updateCountFromStorage = () => {
    try {
      const raw = localStorage.getItem("kleoCart");
      if (!raw) {
        setCount(0);
        return;
      }
      const items = JSON.parse(raw) as CartItem[];
      const total = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCount(total);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    updateCountFromStorage();

    // Ha máshol módosul a kosár (pl. termékkártyán), frissítjük a gombot is
    const handler = () => updateCountFromStorage();
    window.addEventListener("storage", handler);
    window.addEventListener("kleo-cart-updated", handler as EventListener);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("kleo-cart-updated", handler as EventListener);
    };
  }, []);

  return (
    <Link to="/cart" className="kleo-cart-fab">
      <span className="kleo-cart-fab__icon">🛒</span>
      <span className="kleo-cart-fab__label">Kosár</span>
      <span className="kleo-cart-fab__badge">{count}</span>
    </Link>
  );
};

const App: React.FC = () => {
  const initialPath =
    typeof window !== "undefined" && window.location.pathname
      ? window.location.pathname
      : "/";

  // URL mindig "/" maradjon a címsorban (Render / statikus host kompatibilitás)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  return (
    <LanguageProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Header />
        <FloatingCartButton />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/salons" element={<SalonsPage />} />
          <Route path="/salons/:slug" element={<SalonDetailPage />} />
          <Route path="/services" element={<ServicesPage />} />
<Route path="/services/szempilla" element={<SzempillaPage />} />
<Route path="/services/hajmosas" element={<HajmosasPage />} />
<Route path="/services/arcmasszazs" element={<ArcmasszazsPage />} />
<Route path="/services/actisztitas" element={<ActisztitasPage />} />
<Route path="/services/joico" element={<JoicoPage />} />
<Route path="/services/melegollos" element={<MelegollosPage />} />
<Route path="/services/ipl" element={<IplPage />} />

          <Route path="/prices" element={<PriceListPage />} />
          <Route path="/loyalty" element={<LoyaltyPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/education" element={<TrainingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Webshop listanézet + termék részletek */}
          <Route path="/webshop" element={<WebshopPage />} />
  <Route path="/webshop/products/:productId" element={<WebshopProductDetailPage />} />
          

          {/* Külön kosár oldal */}
          <Route path="/cart" element={<CartPage />} />

          {/* Külön számlázás / fizetés oldal */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* minden más URL menjen vissza a Home-ra */}
          <Route path="*" element={<HomePage />} />
           </Routes>
           <Footer />        
      </MemoryRouter>
    </LanguageProvider>
  );
};

export default App;
