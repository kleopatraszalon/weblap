// src/pages/WebshopPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/kleo-theme v3.css";
import { apiFetch } from "../apiClient";  // <-- EZ LEGYEN



type MainCategoryKey =
  | "GIFT_VOUCHERS"
  | "PASSES"
  | "GUEST_ACCOUNT"
  | "KLEO_PRODUCTS"
  | "COMPANY_DISCOUNTS";

type SubCategoryKey =
  | "GIFT_VOUCHERS_BASIC"
  | "GIFT_CUSTOM_PACKAGE"
  | "GIFT_BEAUTY_VOUCHERS"
  | "GIFT_BEAUTY_PACKAGES"
  | "PASSES_BUDAPEST"
  | "PASSES_COUNTRYSIDE";

type ServiceCategoryKey =
  | "HAIRDRESSING"
  | "HAIR_BLOWDRY"
  | "HAIRCUT"
  | "HAIRTREATMENT"
  | "HAND_FOOT"
  | "GEL_LAC"
  | "NAIL_FILL"
  | "PEDICURE"
  | "COSMETIC"
  | "SUGARP_DEPILATION"
  | "WAX_DEPILATION"
  | "IPL"
  | "CAVITATION"
  | "EYELASH"
  | "BROW_LASH"
  | "MASSAGE";

type Product = {
  id: string;
  name: string;
  retail_price_gross: number | string | null;
  sale_price?: number | string | null;

  // --- Kép mezők: több lehetséges backend elnevezéshez ---
  image_url?: string | null;      // ha így jön a backendből
  image_path?: string | null;     // ha pl. relatív útvonal
  thumbnail_url?: string | null;  // ha külön bélyegkép mező van

  web_description?: string | null;
  is_retail?: boolean | null;
  web_is_visible?: boolean | null;
  main_category?: MainCategoryKey | null;
  sub_category?: SubCategoryKey | null;
  service_category?: ServiceCategoryKey | null;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type RegistrationForm = {
  fullName: string;
  email: string;
  password: string;
};

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "card" | "cod";
};

type CouponResponse = {
  valid: boolean;
  code?: string;
  discount_gross?: number;
  final_total_gross?: number;
  message?: string;
};

type CategoryLevel3 = {
  key: ServiceCategoryKey;
  label: string;
};

type CategoryLevel2 = {
  key: SubCategoryKey;
  label: string;
  children?: CategoryLevel3[];
};

type CategoryLevel1 = {
  key: MainCategoryKey;
  label: string;
  children?: CategoryLevel2[];
};

const CATEGORY_TREE: CategoryLevel1[] = [
  {
    key: "GIFT_VOUCHERS",
    label: "Ajándékutalványok",
    children: [
      { key: "GIFT_VOUCHERS_BASIC", label: "Ajándékutalványok" },
      {
        key: "GIFT_CUSTOM_PACKAGE",
        label: "Egyedi szépségcsomag összeállítása",
      },
      {
        key: "GIFT_BEAUTY_VOUCHERS",
        label: "Szépségutalványok",
        children: [
          { key: "HAIRDRESSING", label: "Fodrász szolgáltatások" },
          { key: "HAND_FOOT", label: "Kéz- és lábápolás szolgáltatások" },
          { key: "COSMETIC", label: "Kozmetikai szolgáltatások" },
          { key: "MASSAGE", label: "Masszázs szolgáltatások" },
          { key: "EYELASH", label: "Szépségutalványok férfiaknak" },
        ],
      },
      { key: "GIFT_BEAUTY_PACKAGES", label: "Szépségcsomagok" },
    ],
  },
  {
    key: "PASSES",
    label: "Bérletek",
    children: [
      {
        key: "PASSES_BUDAPEST",
        label: "Bérletek Budapest",
        children: [
          { key: "HAIR_BLOWDRY", label: "Budapest hajszárítás bérletek" },
          { key: "HAIRCUT", label: "Budapest hajvágás bérletek" },
          { key: "HAIRTREATMENT", label: "Budapest hajkezelés bérletek" },
          { key: "HAND_FOOT", label: "Budapest kéz- és lábápolás bérletek" },
          { key: "GEL_LAC", label: "Budapest géllakk csere bérletek" },
          { key: "NAIL_FILL", label: "Budapest műköröm töltés bérletek" },
          { key: "PEDICURE", label: "Budapest pedikűr bérletek" },
          { key: "COSMETIC", label: "Budapest kozmetikai bérletek" },
          {
            key: "SUGARP_DEPILATION",
            label: "Budapest cukorpasztás szőrtelenítés bérletek",
          },
          {
            key: "WAX_DEPILATION",
            label: "Budapest gyantás szőrtelenítés bérletek",
          },
          { key: "IPL", label: "Budapest IPL tartós szőrtelenítés" },
          {
            key: "CAVITATION",
            label: "Budapest kavitációs zsírbontás bérletek",
          },
          { key: "EYELASH", label: "Budapest műszempilla bérletek" },
          {
            key: "BROW_LASH",
            label: "Budapest szemöldök–szempilla bérletek",
          },
          { key: "MASSAGE", label: "Budapest masszázsbérletek" },
        ],
      },
      {
        key: "PASSES_COUNTRYSIDE",
        label: "Bérletek Vidék",
        children: [
          { key: "HAIRTREATMENT", label: "Hajkezelés bérletek" },
          { key: "HAIR_BLOWDRY", label: "Hajszárítás bérletek" },
          { key: "HAIRCUT", label: "Hajvágás bérletek" },
          { key: "HAND_FOOT", label: "Kéz- és lábápolás bérletek" },
          { key: "GEL_LAC", label: "Géllakk csere bérletek" },
          { key: "NAIL_FILL", label: "Műköröm töltés bérletek" },
          { key: "PEDICURE", label: "Pedikűr bérletek" },
          { key: "COSMETIC", label: "Kozmetikai bérletek" },
          {
            key: "SUGARP_DEPILATION",
            label: "Cukorpasztás szőrtelenítés bérletek",
          },
          {
            key: "WAX_DEPILATION",
            label: "Gyantás szőrtelenítés bérletek",
          },
          { key: "IPL", label: "IPL tartós szőrtelenítés" },
          {
            key: "CAVITATION",
            label: "Kavitációs zsírbontás bérletek",
          },
          { key: "EYELASH", label: "Műszempilla bérletek" },
          {
            key: "BROW_LASH",
            label: "Szemöldök–szempilla bérletek",
          },
          { key: "MASSAGE", label: "Masszázs bérletek" },
        ],
      },
    ],
  },
  { key: "GUEST_ACCOUNT", label: "Vendégszámla" },
  { key: "KLEO_PRODUCTS", label: "Kleo termékek" },
  { key: "COMPANY_DISCOUNTS", label: "Kedvezmények cégeknek" },
];

// --- API elérési adatok – egyszer, helyesen sorrendben definiálva ---

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const API_ROOT = API_BASE.replace(/\/api$/, "");

const buildImageUrl = (imageUrl?: string | null): string | undefined => {
  if (!imageUrl) return undefined;

  // Ha már teljes URL (http/https), nem piszkáljuk
  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl;
  }

  // Relatív út esetén levágjuk az elejéről a sok /-t
  const cleaned = imageUrl.replace(/^\/+/, "");
  return `${API_ROOT}/${cleaned}`;
};

export const WebshopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategoryKey | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryKey | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState<ServiceCategoryKey | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [regForm, setRegForm] = useState<RegistrationForm>({
    fullName: "",
    email: "",
    password: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regMessage, setRegMessage] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "card",
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        if (selectedMainCategory && p.main_category !== selectedMainCategory)
          return false;
        if (selectedSubCategory && p.sub_category !== selectedSubCategory)
          return false;
        if (
          selectedServiceCategory &&
          p.service_category &&
          p.service_category !== selectedServiceCategory
        )
          return false;
        return true;
      }),
    [products, selectedMainCategory, selectedSubCategory, selectedServiceCategory]
  );
// Kosár inicializálása localStorage-ből, hogy a /webshop oldal
  // ugyanazt lássa, mint a /cart és a lebegő kosár gomb
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kleoCart");
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        setCart(items);
      }
    } catch {
      // ha valami gáz van a tárolt adattal, inkább üres kosár
      localStorage.removeItem("kleoCart");
    }
  }, []);

  // Segédfüggvény: minden kosár-módosítást ide tedd, hogy
  // mindig elmentse localStorage-be és jelezze a badge-nek
  const saveCart = (updater: (prev: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem("kleoCart", JSON.stringify(next));
        window.dispatchEvent(new Event("kleo-cart-updated"));
      } catch (e) {
        console.error("Kosár mentése sikertelen", e);
      }
      return next;
    });
  };
  // =============== KUPON ÁLLAPOT ===============
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // =============== TERMÉKEK BETÖLTÉSE ===============
  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const res = await fetch(`${API_BASE}/public/webshop/products`);
        if (!res.ok) {
          throw new Error(`Hiba a termékek betöltésekor (${res.status})`);
        }

        const data = await res.json();
        const list: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
          ? data.items
          : [];

        setProducts(list);
      } catch (err: any) {
        console.error(err);
        setProductsError(
          "Nem sikerült betölteni a webshop termékeket. Kérlek, próbáld meg később."
        );
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =============== KOSÁR LOGIKA ===============

 const handleAddToCart = (product: Product) => {
    saveCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleChangeQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // törlés, ha 0 vagy kisebb
      saveCart((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      saveCart((prev) =>
        prev.map((i) =>
          i.product.id === id ? { ...i, quantity } : i
        )
      );
    }
  };


const handleClearCart = () => {
    saveCart(() => []);
    setAppliedCouponCode(null);
    setCouponDiscount(0);
    setCouponMessage(null);
    setCouponError(null);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const raw =
        item.product.retail_price_gross ?? item.product.sale_price ?? 0;
      const price =
        typeof raw === "string"
          ? parseFloat(raw.replace(",", "."))
          : raw ?? 0;
      if (!price || Number.isNaN(price)) return sum;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const currencyLabel = "Ft";

  const cartTotalAfterCoupon = useMemo(() => {
    const total = cartSubtotal - couponDiscount;
    return total < 0 ? 0 : total;
  }, [cartSubtotal, couponDiscount]);

  // =============== KUPON ELLENŐRZÉSE ===============

  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    setCouponError(null);

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Írj be egy kuponkódot.");
      return;
    }

    if (cart.length === 0) {
      setCouponError("Először tegyél termékeket a kosárba, utána használd a kupont.");
      return;
    }

    setCouponLoading(true);

    try {
      const payload = {
        code,
        cart: {
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price:
              item.product.retail_price_gross ?? item.product.sale_price ?? 0,
          })),
          total_gross: cartSubtotal,
        },
      };

      const res = await fetch(`${API_BASE}/public/webshop/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Nem sikerült ellenőrizni a kuponkódot. Próbáld meg újra."
        );
      }

      const data: CouponResponse = await res.json();

      if (!data.valid || !data.discount_gross) {
        setAppliedCouponCode(null);
        setCouponDiscount(0);
        setCouponError(
          data.message ||
            "Érvénytelen kuponkód vagy nem alkalmazható erre a rendelésre."
        );
        return;
      }

      setAppliedCouponCode(data.code || code);
      setCouponDiscount(data.discount_gross);
      setCouponMessage(
        data.message || "A kupon sikeresen alkalmazva a rendelésedre."
      );
      setCouponError(null);
    } catch (err: any) {
      console.error(err);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponError(err.message || "Ismeretlen hiba történt a kupon ellenőrzésénél.");
    } finally {
      setCouponLoading(false);
    }
  };

  // =============== REGISZTRÁCIÓ – users tábla ===============

  const handleRegistrationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setRegLoading(true);
    setRegMessage(null);
    setRegError(null);

    try {
      if (!regForm.fullName || !regForm.email || !regForm.password) {
        throw new Error("Kérlek, tölts ki minden mezőt a regisztrációhoz.");
      }

      const res = await fetch(`${API_BASE}/public/webshop/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regForm.fullName,
          email: regForm.email,
          password: regForm.password,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Nem sikerült a regisztráció. Kérlek, próbáld meg újra."
        );
      }

      setRegMessage(
        "Sikeres regisztráció! Mostantól Kleopátra vendégprofiloddal is vásárolhatsz."
      );
      setRegForm({ fullName: "", email: "", password: "" });
    } catch (err: any) {
      console.error(err);
      setRegError(err.message || "Ismeretlen hiba történt.");
    } finally {
      setRegLoading(false);
    }
  };

  // =============== RENDELÉS – work_orders + work_order_items + kupon ===============

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderMessage(null);
    setOrderError(null);

    if (cart.length === 0) {
      setOrderError("A rendeléshez először tegyél termékeket a kosárba.");
      return;
    }

    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.address) {
      setOrderError(
        "Kérlek add meg a nevet, e-mail címet és a szállítási/számlázási címet."
      );
      return;
    }

    setOrderLoading(true);

    try {
      const payload = {
        customer: {
          full_name: checkoutForm.fullName,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          address: checkoutForm.address,
          note: checkoutForm.note,
        },
        payment_method: checkoutForm.paymentMethod,
        coupon: appliedCouponCode
          ? {
              code: appliedCouponCode,
              discount_gross: couponDiscount,
            }
          : null,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price:
            item.product.retail_price_gross ?? item.product.sale_price ?? 0,
        })),
        totals: {
          subtotal_gross: cartSubtotal,
          discount_gross: couponDiscount,
          total_gross: cartTotalAfterCoupon,
          currency: currencyLabel,
        },
      };

      const res = await fetch(`${API_BASE}/public/webshop/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || "Nem sikerült a rendelést leadni. Kérlek, próbáld meg újra."
        );
      }

      const data = await res.json().catch(() => ({} as any));

      if (checkoutForm.paymentMethod === "card" && data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      setOrderMessage(
        "Köszönjük a rendelést! A visszaigazoló vendégszámlát e-mailben küldjük."
      );
      setCart([]);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponMessage(null);
      setCouponError(null);
      setCouponInput("");
    } catch (err: any) {
      console.error(err);
      setOrderError(err.message || "Ismeretlen hiba történt a rendelésnél.");
    } finally {
      setOrderLoading(false);
    }
  };
useEffect(() => {
  (async () => {
    try {
      const data = await apiFetch("/public/webshop/products");
      setProducts(data);
    } catch (err) {
      console.error("Webshop termékek betöltési hiba:", err);
    }
  })();
}, []);
/**
 * A TE adatbázisodhoz igazítva:
 *   public.products:
 *     - id uuid
 *     - name text
 *     - retail_price_gross numeric(12,2)
 *     - sale_price numeric(12,2)
 *     - image_url text
 *     - web_description text
 *     - is_retail boolean
 *     - web_is_visible boolean
 */
  // =============== MEGJELENÍTÉS ===============

  return (
    <main>
      {/* HERO – meglévő látvány a képpel és körökkel */}
      <section className="webshop-hero">
        <div className="webshop-hero__bg">
          <img
            src="/images/kleoshop.png"
            alt="Kleoshop – bérletek, szépség- és ajándékutalványok"
          />
        </div>

        <div className="container webshop-hero__content">
          <div className="webshop-hero__bubbles">
            <div className="webshop-hero__bubble webshop-hero__bubble--top">
              <img alt="Ajándékutalványok" />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--middle">
              <img alt="Szépségcsomagok" />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--bottom">
              <img alt="Bérletek" />
            </div>
          </div>

          <div className="webshop-hero__text">
            <p className="section-eyebrow">
              KLEOPÁTRA SZÉPSÉGSZALONOK · ONLINE WEBSHOP
            </p>

            <h1 className="hero-title hero-title--tight">
              Bérletek, szépségutalványok,{" "}
              <span className="hero-part hero-part-magenta">
                ajándékutalványok
              </span>
            </h1>

            <p className="hero-lead hero-lead--narrow">
              Kleopátra élményt adhatsz ajándékba vagy saját magadnak – online
              vásárlással, bankkártyás vagy utánvétes fizetéssel, kupon
              kedvezményekkel.
            </p>

            <div className="webshop-hero__buttons">
              <a
                className="btn btn-primary btn-primary--magenta btn--shine"
                href="#webshop-lista"
              >
                Termékek megtekintése
              </a>
              <a
                className="btn btn-secondary btn-secondary--ghost btn--shine"
                href="#webshop-regisztracio"
              >
                Vendégprofil / regisztráció
              </a>
            </div>

            <div className="webshop-invoice">
              <div className="webshop-invoice__image">
                <img
                  src="/images/vendegszamla.png"
                  alt="Vendégszámla minta"
                />
              </div>
              <div className="webshop-invoice__text">
                <p className="small">
                  Minden online vásárlás után azonnali visszaigazoló
                  vendégszámlát küldünk e-mailben – így könnyen nyomon
                  követheted a Kleopátra-élményeket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TERMÉKLISTA + KOSÁR */}
      <section id="webshop-lista" className="section section--webshop">
        <div className="container webshop-layout">
          {/* BAL: TERMÉKEK */}
          <div className="webshop-main">
            <p className="section-eyebrow">Online vásárlás</p>
            <h2>Válassz bérletet, szépség- vagy ajándékutalványt</h2>
            <p className="section-lead">
              A lenti termékek közvetlenül a Kleopátra Szépségszalonokból{" "}
              <strong>a lehető leggyorsabban</strong> érkeznek. Csak azok
              látszanak, amik elérhetőek.
            </p>

            {productsLoading && (
              <p className="webshop-status">Termékek betöltése…</p>
            )}
            {productsError && (
              <p className="webshop-status webshop-status--error">
                {productsError}
              </p>
            )}
            {!productsLoading &&
              !productsError &&
              filteredProducts.length === 0 && (
                <p className="webshop-status">
                  Jelenleg nincs a szűrésnek megfelelő termék. Próbáld más
                  kategóriával, vagy töröld a szűrést.
                </p>
              )}

            {/* Kategória-szűrők */}
            <div className="webshop-category-bar">
              {CATEGORY_TREE.map((main) => (
                <div
                  key={main.key}
                  className={
                    main.key === selectedMainCategory
                      ? "webshop-category webshop-category--active"
                      : "webshop-category"
                  }
                >
                  <button
                    type="button"
                    className="webshop-category__button"
                    onClick={() => {
                      const next =
                        selectedMainCategory === main.key ? null : main.key;
                      setSelectedMainCategory(next);
                      setSelectedSubCategory(null);
                      setSelectedServiceCategory(null);
                    }}
                  >
                    {main.label}
                  </button>

                  {main.key === selectedMainCategory && main.children && (
                    <div className="webshop-subcategory-row">
                      {main.children.map((sub) => (
                        <div
                          key={sub.key}
                          className="webshop-subcategory-group"
                        >
                          <button
                            type="button"
                            className={
                              sub.key === selectedSubCategory
                                ? "webshop-subcategory__button webshop-subcategory__button--active"
                                : "webshop-subcategory__button"
                            }
                            onClick={() => {
                              const next =
                                selectedSubCategory === sub.key
                                  ? null
                                  : sub.key;
                              setSelectedSubCategory(next);
                              setSelectedServiceCategory(null);
                            }}
                          >
                            {sub.label}
                          </button>

                          {sub.children &&
                            sub.key === selectedSubCategory && (
                              <div className="webshop-servicecategory-row">
                                {sub.children.map((service) => (
                                  <button
                                    key={service.key}
                                    type="button"
                                    className={
                                      service.key === selectedServiceCategory
                                        ? "webshop-servicecategory__button webshop-servicecategory__button--active"
                                        : "webshop-servicecategory__button"
                                    }
                                    onClick={() => {
                                      const next =
                                        selectedServiceCategory === service.key
                                          ? null
                                          : service.key;
                                      setSelectedServiceCategory(next);
                                    }}
                                  >
                                    {service.label}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="webshop-category-reset"
                onClick={() => {
                  setSelectedMainCategory(null);
                  setSelectedSubCategory(null);
                  setSelectedServiceCategory(null);
                }}
              >
                Összes termék
              </button>
            </div>

            {/* SZŰRT TERMÉKLISTA */}
            <div className="webshop-grid">
              {filteredProducts.map((p) => {
                const raw = p.retail_price_gross ?? p.sale_price ?? 0;
                const price =
                  typeof raw === "string"
                    ? parseFloat(raw.replace(",", "."))
                    : raw ?? 0;
                const formattedPrice =
                  !price || Number.isNaN(price)
                    ? "-"
                    : `${price.toLocaleString("hu-HU")} ${currencyLabel}`;

                const imageSrc = buildImageUrl(
                  p.image_url || p.thumbnail_url || p.image_path || null
              );

                return (
                  <article key={p.id} className="webshop-card">
                    {imageSrc && (
                      <Link
                        to={`/webshop/${p.id}`}
                        state={{ product: p }}
                        className="webshop-card__image-link"
                      >
                        <div className="webshop-card__image-wrap">
                          <img
                            src={imageSrc}
                            alt={p.name}
                            className="webshop-card__image"
                          />
                        </div>
                      </Link>
                    )}

                    <h3 className="webshop-card__title">
                      <Link
                        to={`/webshop/${p.id}`}
                        state={{ product: p }}
                        className="webshop-card__title-link"
                      >
                        {p.name}
                      </Link>
                    </h3>

                    {p.web_description && (
                      <p className="webshop-card__text">
                        {p.web_description}
                      </p>
                    )}

                    <div className="webshop-card__footer">
                      <div className="webshop-card__price">
                        {formattedPrice}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-primary--magenta btn--sm"
                        onClick={() => handleAddToCart(p)}
                      >
                        <span className="icon-cart" aria-hidden="true">
                          <svg
                            className="icon-cart__svg"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 4h2.1l1.2 4H20l-1.6 7.2a2.5 2.5 0 0 1-2.4 1.8H9.4l-.5 2H6.5l.6-2.6L4 6H2V4h3z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        <span>Kosárba</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* (Ha külön akarod, itt volt még egy második grid az összes products-szal – ezt most meghagytam szűrt listának.) */}
          </div>

          {/* JOBB: KOSÁR */}
          <aside className="webshop-cart">
            <h3 className="webshop-cart__title">Kosár</h3>

            {cart.length === 0 && (
              <p className="webshop-cart__empty">
                A kosarad jelenleg üres. Válassz terméket a listából.
              </p>
            )}

            {cart.length > 0 && (
              <>
                <ul className="webshop-cart__list">
                  {cart.map((item) => {
                    const raw =
                      item.product.retail_price_gross ??
                      item.product.sale_price ??
                      0;
                    const price =
                      typeof raw === "string"
                        ? parseFloat(raw.replace(",", "."))
                        : raw ?? 0;
                    const formatted =
                      !price || Number.isNaN(price)
                        ? "-"
                        : `${price.toLocaleString("hu-HU")} ${currencyLabel}`;

                    return (
                      <li
                        key={item.product.id}
                        className="webshop-cart__item"
                      >
                        <div className="webshop-cart__item-main">
                          <span className="webshop-cart__item-name">
                            {item.product.name}
                          </span>
                          <span className="webshop-cart__item-price">
                            {formatted}
                          </span>
                        </div>
                        <div className="webshop-cart__item-controls">
                          <button
                            type="button"
                            className="webshop-cart__qty-btn"
                            onClick={() =>
                              handleChangeQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            className="webshop-cart__qty-input"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChangeQuantity(
                                item.product.id,
                                parseInt(e.target.value || "1", 10)
                              )
                            }
                          />
                          <button
                            type="button"
                            className="webshop-cart__qty-btn"
                            onClick={() =>
                              handleChangeQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="webshop-cart__summary">
                  <div className="webshop-cart__total">
                    <span>Részösszeg:</span>
                    <strong>
                      {cartSubtotal.toLocaleString("hu-HU")} {currencyLabel}
                    </strong>
                  </div>

                  {appliedCouponCode && (
                    <div className="webshop-cart__total webshop-cart__total--discount">
                      <span>Kupon kedvezmény ({appliedCouponCode}):</span>
                      <strong>
                        -{couponDiscount.toLocaleString("hu-HU")}{" "}
                        {currencyLabel}
                      </strong>
                    </div>
                  )}

                  <div className="webshop-cart__total webshop-cart__total--final">
                    <span>Fizetendő:</span>
                    <strong>
                      {cartTotalAfterCoupon.toLocaleString("hu-HU")}{" "}
                      {currencyLabel}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost webshop-cart__clear"
                    onClick={handleClearCart}
                  >
                    Kosár ürítése
                  </button>
                  <a
                    href="#webshop-checkout"
                    className="btn btn-primary btn-primary--magenta webshop-cart__checkout-link"
                  >
                    Tovább a fizetéshez
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      {/* REGISZTRÁCIÓ + FIZETÉS + KUPONMEZŐ */}
      <section
        id="webshop-regisztracio"
        className="section section--webshop-alt"
      >
        <div className="container webshop-checkout-grid">
          {/* REGISZTRÁCIÓ – users tábla */}
          <div className="webshop-panel">
            <p className="section-eyebrow">Vendégprofil</p>
            <h2>Regisztráció Kleopátra vendégként</h2>
            <p className="section-lead">
              Ha szeretnéd, hogy a Kleopátra rendszer vendégként ismerjen, hozz
              létre webshop fiókot. Az adataid a{" "}
              <strong>public.users</strong> táblába kerülnek.
            </p>

            <form className="webshop-form" onSubmit={handleRegistrationSubmit}>
              <div className="form-row form-row--two">
                <label className="field">
                  <span>Teljes név*</span>
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>E-mail cím*</span>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label className="field">
                  <span>Jelszó*</span>
                  <input
                    type="password"
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              {regError && (
                <p className="form-msg--error webshop-form-msg">
                  {regError}
                </p>
              )}
              {regMessage && (
                <p className="form-msg--success webshop-form-msg">
                  {regMessage}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-primary--magenta"
                disabled={regLoading}
              >
                {regLoading ? "Feldolgozás…" : "Regisztráció"}
              </button>
            </form>
          </div>

          {/* FIZETÉS / SZÁLLÍTÁSI ADATOK + KUPON */}
          <div id="webshop-checkout" className="webshop-panel">
            <p className="section-eyebrow">Fizetés és szállítás</p>
            <h2>Rendelés véglegesítése</h2>
            <p className="section-lead">
              Add meg a számlázási és szállítási adatokat, válaszd ki a
              fizetési módot, majd – ha van – írd be a kuponkódot is a
              kedvezményhez.
            </p>

            {/* Kupon mező blokk */}
            <div className="webshop-form webshop-form--coupon">
              <div className="form-row form-row--two">
                <label className="field">
                  <span>Kuponkód</span>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Pl. KLEO10"
                  />
                </label>
                <div className="field field--button">
                  <button
                    type="button"
                    className="btn btn-secondary btn-secondary--ghost"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || cart.length === 0}
                  >
                    {couponLoading ? "Ellenőrzés…" : "Kupon alkalmazása"}
                  </button>
                </div>
              </div>

              {couponError && (
                <p className="form-msg--error webshop-form-msg">
                  {couponError}
                </p>
              )}
              {couponMessage && (
                <p className="form-msg--success webshop-form-msg">
                  {couponMessage}
                </p>
              )}
            </div>

            <form className="webshop-form" onSubmit={handleOrderSubmit}>
              <div className="form-row form-row--two">
                <label className="field">
                  <span>Teljes név*</span>
                  <input
                    type="text"
                    value={checkoutForm.fullName}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>E-mail cím*</span>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>Telefonszám</span>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>Fizetési mód</span>
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        paymentMethod: e.target
                          .value as CheckoutForm["paymentMethod"],
                      }))
                    }
                  >
                    <option value="card">Bankkártyás fizetés</option>
                    <option value="cod">Utánvét (fizetés a futárnál)</option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label className="field">
                  <span>Számlázási / szállítási cím*</span>
                  <textarea
                    value={checkoutForm.address}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-row">
                <label className="field">
                  <span>Megjegyzés a rendeléshez</span>
                  <textarea
                    value={checkoutForm.note}
                    placeholder="Pl. kinek szól az ajándékutalvány, külön kérés, üzenet a számlára…"
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {orderError && (
                <p className="form-msg--error webshop-form-msg">
                  {orderError}
                </p>
              )}
              {orderMessage && (
                <p className="form-msg--success webshop-form-msg">
                  {orderMessage}
                </p>
              )}

              <div className="webshop-order-summary-row">
                <div className="webshop-order-summary">
                  <div>
                    <span>Részösszeg:</span>{" "}
                    <strong>
                      {cartSubtotal.toLocaleString("hu-HU")} {currencyLabel}
                    </strong>
                  </div>
                  {appliedCouponCode && (
                    <div>
                      <span>Kupon kedvezmény ({appliedCouponCode}): </span>
                      <strong>
                        -{couponDiscount.toLocaleString("hu-HU")}{" "}
                        {currencyLabel}
                      </strong>
                    </div>
                  )}
                  <div>
                    <span>Fizetendő:</span>{" "}
                    <strong>
                      {cartTotalAfterCoupon.toLocaleString("hu-HU")}{" "}
                      {currencyLabel}
                    </strong>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-primary--magenta"
                  disabled={orderLoading || cart.length === 0}
                >
                  {orderLoading
                    ? "Rendelés küldése…"
                    : "Rendelés elküldése"}
                </button>
              </div>

              {cart.length === 0 && (
                <p className="webshop-status webshop-status--hint">
                  A rendelés leadásához először tegyél termékeket a kosárba.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WebshopPage;
