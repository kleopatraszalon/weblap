// src/App.tsx
import React, { useEffect } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
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
import { WebshopPage } from "./pages/WebshopPage";
import { WebshopProductDetailPage } from "./pages/WebshopProductDetailPage";

const App: React.FC = () => {
  const initialPath =
    typeof window !== "undefined" && window.location.pathname
      ? window.location.pathname
      : "/";

  // URL mindig "/" maradjon a címsorban
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salons" element={<SalonsPage />} />
        <Route path="/salons/:id" element={<SalonDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Webshop listanézet + termék részletek */}
        <Route path="/webshop" element={<WebshopPage />} />
        <Route path="/webshop/:productId" element={<WebshopProductDetailPage />} />

        {/* minden más URL menjen vissza a Home-ra */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;
