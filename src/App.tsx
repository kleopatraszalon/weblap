// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import ModernPublicStyles from "./components/ModernPublicStyles";
import { HomePage } from "./pages/HomePage";
import { SalonsPage } from "./pages/SalonsPage";
import { SalonDetailPage } from "./pages/SalonDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
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
import { SignageExperience } from "./pages/signage/SignageExperience";
import { KioskPage } from "./pages/KioskPage";
import { WebshopPage } from "./pages/WebshopPage";
import { WebshopProductDetailPage } from "./pages/WebshopProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BookingPage as VoiceBookingPage } from "./pages/BookingPage";
import { BookingPageV2 } from "./pages/BookingPageV2";
import type { CartItem } from "./utils/cart";
import { LanguageProvider } from "./i18n";
import { WebsiteCmsProvider } from "./websiteCms";

const OLD_FRANCHISE_HOSTS = new Set(["kleopatraszepsegszalonok.hu", "www.kleopatraszepsegszalonok.hu"]);
const isFranchiseHost = () => typeof window !== "undefined" && OLD_FRANCHISE_HOSTS.has(window.location.hostname.toLowerCase());

const FloatingCartButton: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const updateCountFromStorage = () => {
    try {
      const raw = localStorage.getItem("kleoCart");
      if (!raw) return setCount(0);
      const items = JSON.parse(raw) as CartItem[];
      setCount(items.reduce((sum, item) => sum + (item.quantity || 0), 0));
    } catch { setCount(0); }
  };
  useEffect(() => {
    updateCountFromStorage();
    const handler = () => updateCountFromStorage();
    window.addEventListener("storage", handler);
    window.addEventListener("kleo-cart-updated", handler as EventListener);
    return () => { window.removeEventListener("storage", handler); window.removeEventListener("kleo-cart-updated", handler as EventListener); };
  }, []);
  return <Link to="/cart" className="kleo-cart-fab"><span className="kleo-cart-fab__icon">🛒</span><span className="kleo-cart-fab__label">Kosár</span><span className="kleo-cart-fab__badge">{count}</span></Link>;
};

function AppShell() {
  const location = useLocation();
  const franchiseHost = isFranchiseHost();
  const isSignage = location.pathname.startsWith("/signage") || location.pathname.startsWith("/kiosk");
  const isFocusedFranchise = franchiseHost || ["/lp1", "/ajanlat", "/koszonjuk", "/franchise-v1", "/franchise-info", "/franchise-koszonjuk"].includes(location.pathname);
  return <>
    {!isSignage && <ModernPublicStyles />}
    {!isSignage && !isFocusedFranchise && <Header />}
    {!isSignage && !isFocusedFranchise && <FloatingCartButton />}
    <Routes>
      <Route path="/signage" element={<SignageExperience />} />
      <Route path="/kiosk/*" element={<KioskPage />} />
      <Route path="/" element={franchiseHost ? <FranchiseV1Page /> : <HomePage />} />

      <Route path="/booking" element={<BookingPageV2 />} />
      <Route path="/idopontfoglalas" element={<BookingPageV2 />} />
      <Route path="/hangos-idopontfoglalas" element={<VoiceBookingPage />} />

      <Route path="/salons" element={<SalonsPage />} />
      <Route path="/salons/:id" element={<SalonDetailPage />} />
      <Route path="/szalonok" element={<SalonsPage />} />
      <Route path="/szalonok/:id" element={<SalonDetailPage />} />

      <Route path="/services" element={<ServicesPage />} />
      <Route path="/szolgaltatasok" element={<ServicesPage />} />
      <Route path="/szolgaltatasok/:slug" element={<ServiceDetailPage />} />
      <Route path="/prices" element={<PriceListPage />} />
      <Route path="/araink" element={<PriceListPage />} />

      <Route path="/loyalty" element={<LoyaltyPage />} />
      <Route path="/husegprogram" element={<LoyaltyPage />} />
      <Route path="/franchise" element={<FranchisePage />} />

      {/* Franchise funnel canonical routes */}
      <Route path="/lp1" element={<FranchiseV1Page />} />
      <Route path="/ajanlat" element={<FranchiseInfoPage />} />
      <Route path="/koszonjuk" element={<FranchiseKoszonjukPage />} />

      {/* Legacy aliases kept until Render 301 rules have propagated */}
      <Route path="/franchise-v1" element={<FranchiseV1Page />} />
      <Route path="/franchise-info" element={<FranchiseInfoPage />} />
      <Route path="/franchise-koszonjuk" element={<FranchiseKoszonjukPage />} />

      <Route path="/career" element={<CareerPage />} />
      <Route path="/karrier" element={<CareerPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/education" element={<TrainingPage />} />
      <Route path="/oktatas" element={<TrainingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/rolunk" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/kapcsolat" element={<ContactPage />} />

      <Route path="/webshop" element={<WebshopPage />} />
      <Route path="/webshop/:productId" element={<WebshopProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/kosar" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/fizetes" element={<CheckoutPage />} />

      <Route path="*" element={franchiseHost ? <FranchiseV1Page /> : <HomePage />} />
    </Routes>
    {!isSignage && !isFocusedFranchise && <Footer />}
  </>;
}

const App: React.FC = () => <WebsiteCmsProvider><LanguageProvider><BrowserRouter><AppShell /></BrowserRouter></LanguageProvider></WebsiteCmsProvider>;
export default App;
