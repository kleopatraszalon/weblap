// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router,MemoryRouter, Routes, Route } from "react-router-dom";
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
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";


function FloatingCartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const raw = localStorage.getItem("kleoCart");
        if (!raw) {
          setCount(0);
          return;
        }
        const items = JSON.parse(raw) as { quantity: number }[];
        const total = items.reduce((s, i) => s + (i.quantity || 0), 0);
        setCount(total);
      } catch {
        setCount(0);
      }
    };

    update();
    window.addEventListener("storage", update as any);
    // ha a kosár módosításnál dispatch-elsz egy eventet, azt is figyeli
    window.addEventListener("kleo-cart-updated", update as any);

    return () => {
      window.removeEventListener("storage", update as any);
      window.removeEventListener("kleo-cart-updated", update as any);
    };
  }, []);

  return (
    <Link to="/cart" className="kleo-cart-fab">
      <span className="kleo-cart-fab__icon">🛒</span>
      <span className="kleo-cart-fab__label">Kosár</span>
      <span className="kleo-cart-fab__badge">{count}</span>
    </Link>
  );
}


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
export const App: React.FC = () => {
  return (
    <Router>
      {/* Itt mehet a header, layout, stb. ha van */}

      {/* Globális kosár gomb – MINDEN oldalon látszik */}
      <FloatingCartButton />

      <Routes>
        {/* meglévő route-ok */}
        <Route path="/webshop" element={<WebshopPage />} />
        <Route path="/webshop/:productId" element={<WebshopProductDetailPage />} />

        {/* új oldalak */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* a többi route, pl. kezdőlap */}
      </Routes>
    </Router>
  );
};
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
