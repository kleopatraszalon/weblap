// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

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

import { PriceListPage } from "./pages/PriceListPage";
import { LoyaltyPage } from "./pages/LoyaltyPage";
import { CareerPage } from "./pages/CareerPage";
import { TrainingPage } from "./pages/TrainingPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

import { FranchisePage } from "./pages/FranchisePage";
import { FranchiseV1Page } from "./pages/FranchiseV1Page";
import { FranchiseInfoPage } from "./pages/FranchiseInfoPage";
import { FranchiseKoszonjukPage } from "./pages/FranchiseKoszonjukPage";

import { WebshopPage } from "./pages/WebshopPage";
import { WebshopProductDetailPage } from "./pages/WebshopProductDetailPage";
import { CartPage } from "./pages/CartPage";

import { LanguageProvider } from "./i18n";

/**
 * Franchise landing oldalak – nincs Header / Footer / lebegő kosár.
 * Ide tartozik: /franchise, /franchise-v1, /franchise-info, /franchise-koszonjuk
 * (valamint a /hu|/en|/ru prefixel induló verziók)
 */
const isFranchisePath = (pathname: string) => {
  return /^\/(hu|en|ru)?\/?(franchise|franchise-v1|franchise-info|franchise-koszonjuk)(\/.*)?$/.test(
    pathname
  );
};

const FloatingCartButton: React.FC = () => {
  const { pathname } = useLocation();
  const isFranchise = isFranchisePath(pathname);

  // Franchise LP-n soha ne jelenjen meg
  if (isFranchise) return null;

  // csak webshop route-okon legyen (ahogy eddig is)
  const isWebshopRoute =
    pathname.startsWith("/webshop") || pathname.startsWith("/cart");

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const calcCount = () => {
      try {
        const raw = localStorage.getItem("kleo_cart_items");
        if (!raw) return 0;
        const items = JSON.parse(raw);
        if (!Array.isArray(items)) return 0;
        return items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
      } catch {
        return 0;
      }
    };

    const handler = () => setCount(calcCount());
    handler();

    window.addEventListener("storage", handler);
    window.addEventListener("kleo-cart-updated", handler as EventListener);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("kleo-cart-updated", handler as EventListener);
    };
  }, []);

  if (!isWebshopRoute) return null;

  return (
    <Link to="/cart" className="kleo-cart-fab">
      <span className="kleo-cart-fab__icon">🛒</span>
      <span className="kleo-cart-fab__label">Kosár</span>
      <span className="kleo-cart-fab__badge">{count}</span>
    </Link>
  );
};

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <FloatingCartButton />
      <Outlet />
      <Footer />
    </>
  );
};

const FranchiseLayout: React.FC = () => {
  return <Outlet />;
};

/**
 * Régi (legacy) szolgáltatás URL-ek – React Router szinten is kezeljük,
 * hogy lokálisan és prodon is működjön akkor is, ha a Render redirect valamiért nem fut le.
 */
const LegacyServiceRedirects: React.FC = () => {
  const { pathname } = useLocation();

  const map: Record<string, string> = {
    "/ipl": "/szolgaltatasok/ipl",
    "/mollos": "/szolgaltatasok/melegollos",
    "/melegollos": "/szolgaltatasok/melegollos",
    "/joico": "/szolgaltatasok/joico",
    "/szempilla": "/szolgaltatasok/szempilla",
    "/hajmosas": "/szolgaltatasok/hajmosas",
    "/arcmasszazs": "/szolgaltatasok/arcmasszazs",
    "/actisztitas": "/szolgaltatasok/actisztitas",
  };

  const target = map[pathname];
  if (!target) return null;

  return <Navigate to={target} replace />;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        {/* legacy root redirectek */}
        <LegacyServiceRedirects />

        <Routes>
          {/* Franchise – TELJESEN IZOLÁLT (nincs Header/Footer) */}
          <Route element={<FranchiseLayout />}>
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/franchise-v1" element={<FranchiseV1Page />} />
            <Route path="/franchise-info" element={<FranchiseInfoPage />} />
            <Route
              path="/franchise-koszonjuk"
              element={<FranchiseKoszonjukPage />}
            />


            {/* Lang prefix támogatás (HU/EN/RU) */}
            <Route path="/:lang/franchise" element={<FranchisePage />} />
            <Route path="/:lang/franchise-v1" element={<FranchiseV1Page />} />
            <Route path="/:lang/franchise-info" element={<FranchiseInfoPage />} />
            <Route
              path="/:lang/franchise-koszonjuk"
              element={<FranchiseKoszonjukPage />}
            />
          </Route>

          {/* Fő weboldal – standard chrome */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/salons" element={<SalonsPage />} />
            <Route path="/salons/:slug" element={<SalonDetailPage />} />

            {/* Services – új canonical */}
            <Route path="/szolgaltatasok" element={<ServicesPage />} />
            <Route path="/szolgaltatasok/szempilla" element={<SzempillaPage />} />
            <Route path="/szolgaltatasok/hajmosas" element={<HajmosasPage />} />
            <Route
              path="/szolgaltatasok/arcmasszazs"
              element={<ArcmasszazsPage />}
            />
            <Route
              path="/szolgaltatasok/actisztitas"
              element={<ActisztitasPage />}
            />
            <Route path="/szolgaltatasok/joico" element={<JoicoPage />} />
            <Route
              path="/szolgaltatasok/melegollos"
              element={<MelegollosPage />}
            />
            <Route path="/szolgaltatasok/ipl" element={<IplPage />} />

            {/* Services – régi URL-ek (kompatibilitás) */}
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
            <Route path="/career" element={<CareerPage />} />
            <Route path="/education" element={<TrainingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Webshop */}
            <Route path="/webshop" element={<WebshopPage />} />
            <Route
              path="/webshop/products/:productId"
              element={<WebshopProductDetailPage />}
            />
            <Route path="/cart" element={<CartPage />} />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
