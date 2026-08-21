// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import ModernPublicStyles from "./components/ModernPublicStyles";
import BrandRefreshStyles from "./components/BrandRefreshStyles";
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
import { BookingPageV5 } from "./pages/BookingPageV5";
import { API_BASE } from "./apiClient";
import type { CartItem } from "./utils/cart";
import { LanguageProvider } from "./i18n";
import { WebsiteCmsProvider } from "./websiteCms";

const OLD_FRANCHISE_HOSTS = new Set(["kleopatraszepsegszalonok.hu", "www.kleopatraszepsegszalonok.hu"]);
const isFranchiseHost = () => typeof window !== "undefined" && OLD_FRANCHISE_HOSTS.has(window.location.hostname.toLowerCase());
const NBA_JOB_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NBA_BOOKING_PATHS=new Set(["/booking","/idopontfoglalas","/foglalas"]);

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

  useEffect(()=>{
    if(!NBA_BOOKING_PATHS.has(location.pathname))return;
    const fromUrl=new URLSearchParams(location.search).get("nba_job_id")||"";
    const stored=sessionStorage.getItem("kleo_nba_job_id")||"";
    const jobId=NBA_JOB_RE.test(fromUrl)?fromUrl:NBA_JOB_RE.test(stored)?stored:"";
    if(!jobId)return;
    sessionStorage.setItem("kleo_nba_job_id",jobId);
    const nativeFetch=window.fetch.bind(window);
    void nativeFetch(`${API_BASE}/api/public/booking/nba/touch`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({nba_job_id:jobId})}).catch(()=>undefined);
    window.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
      const response=await nativeFetch(input,init);
      try{
        const target=typeof input==="string"?input:input instanceof URL?input.toString():input.url;
        const requestMethod=typeof Request!=="undefined"&&input instanceof Request?input.method:"GET";
        const method=String(init?.method||requestMethod||"GET").toUpperCase();
        if(response.ok&&method==="POST"&&target.includes("/api/public/booking/book")){
          const payload=await response.clone().json().catch(()=>null);
          if(payload?.id)void nativeFetch(`${API_BASE}/api/public/booking/nba/attribute`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({nba_job_id:jobId,appointment_id:String(payload.id)})}).catch(()=>undefined);
        }
      }catch{}
      return response;
    };
    return()=>{window.fetch=nativeFetch};
  },[location.pathname,location.search]);

  return <>
    {!isSignage && <ModernPublicStyles />}
    {!isSignage && <BrandRefreshStyles />}
    {!isSignage && !isFocusedFranchise && <Header />}
    {!isSignage && !isFocusedFranchise && <FloatingCartButton />}
    <Routes>
      <Route path="/signage" element={<SignageExperience />} />
      <Route path="/kiosk/*" element={<KioskPage />} />
      <Route path="/" element={franchiseHost ? <FranchiseV1Page /> : <HomePage />} />

      <Route path="/booking" element={<BookingPageV5 />} />
      <Route path="/idopontfoglalas" element={<BookingPageV5 />} />
      <Route path="/foglalas" element={<BookingPageV5 />} />
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
