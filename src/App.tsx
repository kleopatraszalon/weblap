// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import { HomePage } from "./pages/HomePage";
import { SalonsPage } from "./pages/SalonsPage";
import { SalonDetailPage } from "./pages/SalonDetailPage";

import { ServicesPage } from "./pages/ServicesPage";
import SzempillaPage from "./pages/services/SzempillaPage";
import HajmosasPage from "./pages/services/HajmosasPage";
import ArcmasszazsPage from "./pages/services/ArcmasszazsPage";
import ActisztitasPage from "./pages/services/ActisztitasPage";
import JoicoPage from "./pages/services/JoicoPage";
import MelegollosPage from "./pages/services/MelegollosPage";
import IplPage from "./pages/services/IplPage";

import { PriceListPage } from "./pages/PriceListPage";
import { LoyaltyPage } from "./pages/LoyaltyPage";
import { FranchisePage } from "./pages/FranchisePage";
import { FranchiseV1Page } from "./pages/FranchiseV1Page";
import { FranchiseInfoPage } from "./pages/FranchiseInfoPage";
import { FranchiseKoszonjukPage } from "./pages/FranchiseKoszonjukPage";

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

/**
 * Route-kiosztás célja:
 * - Megfeleljen a kleoszalon.hu jelenlegi (HU) URL-struktúrájának.
 * - A régi/angol útvonalakat kliensoldali redirecttel is kezelje
 *   (a végleges SEO 301-eket Render oldalon érdemes beállítani).
 */
const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kleo_cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kleo_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((n, i) => n + (i.quantity ?? 1), 0);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Header cartItemsCount={cartCount} />
        <Routes>
          {/* Főoldal */}
          <Route path="/" element={<HomePage />} />

          {/* Szalonok */}
          <Route path="/szalonok" element={<SalonsPage />} />
          <Route path="/szalonok/:slug" element={<SalonDetailPage />} />

          {/* Szolgáltatások */}
          <Route path="/szolgaltatasok" element={<ServicesPage />} />
          <Route
            path="/szolgaltatasok/muszempilla"
            element={<SzempillaPage />}
          />
          <Route path="/szolgaltatasok/hajmosas" element={<HajmosasPage />} />
          <Route
            path="/szolgaltatasok/arcmasszazs"
            element={<ArcmasszazsPage />}
          />
          <Route
            path="/szolgaltatasok/arctisztitas"
            element={<ActisztitasPage />}
          />
          <Route
            path="/szolgaltatasok/joicohajkezeles"
            element={<JoicoPage />}
          />
          <Route path="/szolgaltatasok/mollos" element={<MelegollosPage />} />
          <Route path="/szolgaltatasok/melegollos" element={<MelegollosPage />} />
          <Route path="/szolgaltatasok/ipl" element={<IplPage />} />

          {/* Régi alias útvonalak (301 a Renderen, de fejlesztésben is működjön) */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/szempilla" element={<SzempillaPage />} />
          <Route path="/services/hajmosas" element={<HajmosasPage />} />
          <Route path="/services/arcmasszazs" element={<ArcmasszazsPage />} />
          <Route path="/services/actisztitas" element={<ActisztitasPage />} />
          <Route path="/services/joico" element={<JoicoPage />} />
          <Route path="/services/melegollos" element={<MelegollosPage />} />
          <Route path="/services/ipl" element={<IplPage />} />


          {/* Árak / hűség */}
          <Route path="/araink" element={<PriceListPage />} />
          <Route path="/husegprogram" element={<LoyaltyPage />} />

          {/* Franchise landingek */}
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/franchise-v1" element={<FranchiseV1Page />} />
          <Route path="/franchise-info" element={<FranchiseInfoPage />} />
          <Route
            path="/franchise-koszonjuk"
            element={<FranchiseKoszonjukPage />}
          />

          {/* Egyéb */}
          <Route path="/karrier" element={<CareerPage />} />
          <Route path="/karrier.php" element={<CareerPage />} />
          <Route path="/oktatas" element={<TrainingPage />} />
          <Route path="/rolunk" element={<AboutPage />} />
          <Route path="/kapcsolat" element={<ContactPage />} />

          {/* Webshop (ha külön domain lesz, később kivehető) */}
          <Route
            path="/webshop"
            element={<WebshopPage cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route
            path="/webshop/products/:productId"
            element={<WebshopProductDetailPage cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route
            path="/kosar"
            element={<CartPage cartItems={cartItems} setCartItems={setCartItems} />}
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cartItems={cartItems} setCartItems={setCartItems} />}
          />

          {/* Régi / angol útvonalak – kliensoldali átvezetés */}
          <Route path="/salons" element={<Navigate to="/szalonok" replace />} />
          <Route path="/salons/:slug" element={<Navigate to="/szalonok" replace />} />
          <Route path="/services" element={<Navigate to="/szolgaltatasok" replace />} />
          <Route path="/services/szempilla" element={<Navigate to="/szolgaltatasok/muszempilla" replace />} />
          <Route path="/services/hajmosas" element={<Navigate to="/szolgaltatasok/hajmosas" replace />} />
          <Route path="/services/arcmasszazs" element={<Navigate to="/szolgaltatasok/arcmasszazs" replace />} />
          <Route path="/services/actisztitas" element={<Navigate to="/szolgaltatasok/arctisztitas" replace />} />
          <Route path="/services/joico" element={<Navigate to="/szolgaltatasok/joicohajkezeles" replace />} />
          <Route path="/services/melegollos" element={<Navigate to="/szolgaltatasok/mollos" replace />} />
          <Route path="/services/ipl" element={<Navigate to="/szolgaltatasok/ipl" replace />} />

          {/* Régi (gyökér) szolgáltatás URL-ek -> új, egységes /szolgaltatasok/* struktúra */}
          <Route path="/muszempilla" element={<Navigate to="/szolgaltatasok/muszempilla" replace />} />
          <Route path="/joicohajkezeles" element={<Navigate to="/szolgaltatasok/joicohajkezeles" replace />} />
          <Route path="/melegolloshajvagas" element={<Navigate to="/szolgaltatasok/mollos" replace />} />
          <Route path="/iplszortelenites" element={<Navigate to="/szolgaltatasok/ipl" replace />} />
          <Route path="/arcmasszazs" element={<Navigate to="/szolgaltatasok/arcmasszazs" replace />} />
          <Route path="/arctisztitas" element={<Navigate to="/szolgaltatasok/arctisztitas" replace />} />

          <Route path="/prices" element={<Navigate to="/araink" replace />} />
          <Route path="/loyalty" element={<Navigate to="/husegprogram" replace />} />
          <Route path="/about" element={<Navigate to="/rolunk" replace />} />
          <Route path="/education" element={<Navigate to="/oktatas" replace />} />
          <Route path="/contact" element={<Navigate to="/kapcsolat" replace />} />
          <Route path="/career" element={<Navigate to="/karrier" replace />} />

          {/* Default */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
