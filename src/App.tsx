// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { SalonsPage } from "./pages/SalonsPage";
import { SalonDetailPage } from "./pages/SalonDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import { PriceListPage } from "./pages/PriceListPage";
import { LoyaltyPage } from "./pages/LoyaltyPage";
import { FranchisePage } from "./pages/FranchisePage";
import { CareerPage } from "./pages/CareerPage";
import { TrainingPage } from "./pages/TrainingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { SignagePage } from "./pages/SignagePage";
import { KioskPage } from "./pages/KioskPage";
import { WebshopPage } from "./pages/WebshopPage";
import { WebshopProductDetailPage } from "./pages/WebshopProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BookingPage } from "./pages/BookingPage";
import type { CartItem } from "./utils/cart";
import { LanguageProvider } from "./i18n";
import { WebsiteCmsProvider } from "./websiteCms";

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
  const isSignage = location.pathname.startsWith("/signage") || location.pathname.startsWith("/kiosk");
  return <>
    {!isSignage && <Header />}
    {!isSignage && <FloatingCartButton />}
    <Routes>
      <Route path="/signage" element={<SignagePage />} />
      <Route path="/kiosk/*" element={<KioskPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/salons" element={<SalonsPage />} />
      <Route path="/salons/:id" element={<SalonDetailPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/prices" element={<PriceListPage />} />
      <Route path="/loyalty" element={<LoyaltyPage />} />
      <Route path="/franchise" element={<FranchisePage />} />
      <Route path="/career" element={<CareerPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/education" element={<TrainingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/webshop" element={<WebshopPage />} />
      <Route path="/webshop/:productId" element={<WebshopProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
    {!isSignage && <Footer />}
  </>;
}

const App: React.FC = () => <WebsiteCmsProvider><LanguageProvider><BrowserRouter><AppShell /></BrowserRouter></LanguageProvider></WebsiteCmsProvider>;
export default App;
