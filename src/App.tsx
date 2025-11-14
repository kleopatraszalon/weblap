import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/salons" element={<SalonsPage />} />
        <Route path="/salons/:slug" element={<SalonDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/prices" element={<PriceListPage />} />
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/webshop" element={<WebshopPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
