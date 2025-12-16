// src/pages/WebshopPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/kleo-theme v7.css";
import "../styles/webshop-layout.css";
import { apiFetch } from "../apiClient";
import { useI18n } from "../i18n";

// ====== TÍPUSOK ======

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
  | "PASSES_SOLARIUM"
  | "PASSES_MASSAGE"
  | "PASSES_FACIAL"
  | "PASSES_HAIR"
  | "PASSES_OTHER"
  | "GUEST_ACCOUNT_CREATE"
  | "GUEST_ACCOUNT_BALANCE"
  | "KLEO_PRODUCTS_HAIR"
  | "KLEO_PRODUCTS_COSMETICS"
  | "KLEO_PRODUCTS_SOLARIUM"
  | "KLEO_PRODUCTS_ACCESSORIES"
  | "COMPANY_DISCOUNTS_PARTNERS"
  | "COMPANY_DISCOUNTS_EMPLOYEES";

type ServiceCategoryKey =
  | "HAIRDRESSING"
  | "COSMETICS"
  | "MASSAGE"
  | "SOLARIUM"
  | "NAILS"
  | "OTHER";

// termékcsoport kulcs – engedjük a stringet is, hogy biztosan ne okozzon TS hibát
type ProductGroupKey = MainCategoryKey | SubCategoryKey | string;

interface CategoryLevel1 {
  key: MainCategoryKey;
  label: string;
}

const CATEGORY_TREE: CategoryLevel1[] = [
  { key: "GIFT_VOUCHERS", label: "Ajándékutalványok" },
  { key: "PASSES", label: "Bérletek" },
  { key: "GUEST_ACCOUNT", label: "Vendégfiókok és vendégszámlák" },
  { key: "KLEO_PRODUCTS", label: "Kleopátra termékek" },
  { key: "COMPANY_DISCOUNTS", label: "Kedvezmények cégeknek" },
];

interface Product {
  id: number;
  sku: string | null;
  name: string;

  // fordítások
  display_name_hu?: string | null;
  display_name_en?: string | null;
  display_name_ru?: string | null;
  name_en?: string | null;
  name_ru?: string | null;

  // kategória-információk a terméktáblából
  main_category?: string | null;
  sub_category?: string | null;
  service_category?: string | null;
  category_id?: number | null;

  product_group_key: ProductGroupKey;
  service_category_key: ServiceCategoryKey | string | null;
  retail_price_gross: number | string | null;
  sale_price: number | string | null;
  image_url: string | null;

  is_active?: boolean | null;
  is_webshop_visible?: boolean | null;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface RegistrationForm {
  fullName: string;
  email: string;
  password: string;
}

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "card" | "cod";
}

interface MainCategoryFromApi {
  key: MainCategoryKey | string;
  name?: string | null;
  name_hu?: string | null;
  name_en?: string | null;
  name_ru?: string | null;
}

// ====== SEGÉDFÜGGVÉNYEK ======

function getProductName(product: Product, lang: string): string {
  // Elsődlegesen az adatbázis 3 nyelvű oszlopaiból olvasunk
  if (lang === "en") {
    return (
      product.display_name_en ||
      product.name_en ||
      product.name ||
      product.display_name_hu ||
      ""
    );
  }

  if (lang === "ru") {
    return (
      product.display_name_ru ||
      product.name_ru ||
      product.name ||
      product.display_name_en ||
      product.name_en ||
      product.display_name_hu ||
      ""
    );
  }

  // alapértelmezett: HU
  return (
    product.display_name_hu ||
    product.name ||
    product.name_en ||
    product.display_name_en ||
    ""
  );
}

const INITIAL_REG_FORM: RegistrationForm = {
  fullName: "",
  email: "",
  password: "",
};

const INITIAL_CHECKOUT_FORM: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  note: "",
  paymentMethod: "card",
};

const PRODUCTS_PER_PAGE = 15;
const CART_STORAGE_KEY = "kleoCart";
const CART_EVENT_NAME = "kleo-cart-updated";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000/api";
const API_ROOT = API_BASE.replace(/\/api$/, "");

function buildImageUrl(imageUrl?: string | null): string | undefined {
  if (!imageUrl) return undefined;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const cleaned = imageUrl.replace(/^\/+/, "");
  return `${API_ROOT}/${cleaned}`;
}

// ====== KOMPONENS ======

export const WebshopPage: React.FC = () => {
  const { t, lang } = useI18n();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] =
    useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [regForm, setRegForm] = useState<RegistrationForm>(INITIAL_REG_FORM);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regMessage, setRegMessage] = useState<string | null>(null);

  const [checkoutForm, setCheckoutForm] =
    useState<CheckoutForm>(INITIAL_CHECKOUT_FORM);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState<string | null>(null);

  const [selectedMainCategory, setSelectedMainCategory] =
    useState<MainCategoryKey | null>(null);
  // alkategória szűrő a kiválasztott fő kategórián belül
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);


  // fő kategória nevek adatbázisból (HU/EN/RU)
  const [mainCategoryNames, setMainCategoryNames] = useState<
    Partial<Record<MainCategoryKey, string>>
  >({});

  // ====== KOSÁR KEZELÉS ======

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        setCart(items);
      }
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const updateCart = (updater: (prev: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Kosár mentése sikertelen", e);
      }
      const event = new CustomEvent<CartItem[]>(CART_EVENT_NAME, {
        detail: next,
      });
      window.dispatchEvent(event);
      return next;
    });
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      }
    };

    window.addEventListener(CART_EVENT_NAME, handler as EventListener);
    return () => {
      window.removeEventListener(CART_EVENT_NAME, handler as EventListener);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    updateCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    updateCart((prev) => {
      const next: CartItem[] = [];
      for (const item of prev) {
        if (item.product.id !== productId) {
          next.push(item);
          continue;
        }
        const newQty = item.quantity + delta;
        if (newQty > 0) {
          next.push({ ...item, quantity: newQty });
        }
      }
      return next;
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    updateCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    updateCart(() => []);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const raw =
        item.product.retail_price_gross ?? item.product.sale_price ?? 0;
      const price =
        typeof raw === "string"
          ? parseFloat(raw.replace(",", ".")) || 0
          : raw ?? 0;
      if (!price || Number.isNaN(price)) return sum;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const cartTotal = cartSubtotal;
  const currencyLabel = "Ft";

  const cartTotalAfterCoupon = useMemo(() => {
    const total = cartSubtotal - couponDiscount;
    return total < 0 ? 0 : total;
  }, [cartSubtotal, couponDiscount]);

  // ====== TERMÉKLISTA BETÖLTÉSE ======

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const list = await apiFetch<Product[]>(
          `/public/webshop/products?lang=${lang}`
        );
        setProducts(list);
      } catch (err: any) {
        console.error(err);
        setProductsError(t("webshop.list.error"));
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [lang, t]);

  // ====== FŐ KATEGÓRIA NEVEK BETÖLTÉSE DB-BŐL ======

  useEffect(() => {
    let active = true;

    const loadMainCategoryNames = async () => {
      try {
        const data = await apiFetch<MainCategoryFromApi[]>(
          `/public/webshop/main-categories?lang=${lang}`
        );

        if (!active) return;

        const map: Partial<Record<MainCategoryKey, string>> = {};
        for (const item of data) {
          const key = item.key as MainCategoryKey;
          let name =
            item.name ||
            (lang === "en"
              ? item.name_en
              : lang === "ru"
              ? item.name_ru
              : item.name_hu);

          if (!name) {
            // fallback – ha az adott nyelven nincs, próbáljuk HU-t
            name = item.name_hu || item.name_en || item.name_ru || undefined;
          }
          if (name) {
            map[key] = name;
          }
        }
        setMainCategoryNames(map);
      } catch (err) {
        console.error("Webshop main categories error:", err);
        // hiba esetén marad a CATEGORY_TREE fallback
      }
    };

    loadMainCategoryNames();

    return () => {
      active = false;
    };
  }, [lang]);

  const getMainCategoryLabel = (key: MainCategoryKey): string => {
    return (
      mainCategoryNames[key] ||
      CATEGORY_TREE.find((m) => m.key === key)?.label ||
      key
    );
  };

  // ====== ALKATEGÓRIA RESET, HA FŐ KATEGÓRIA VAGY NYELV VÁLTOZIK ======

  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedMainCategory, lang]);

// ====== SZŰRÉS + LAPOZÁS ======

  useEffect(() => {
    setCurrentPage(1);
  }, [products, selectedMainCategory]);

    const subcategoriesForSelectedMain = useMemo(() => {
    if (!selectedMainCategory) return [] as string[];

    const labels = new Set<string>();

    for (const p of products) {
      const mainKey = (p.product_group_key || p.main_category) as MainCategoryKey | string | null;
      if (mainKey !== selectedMainCategory) continue;
      if (!p.sub_category) continue;
      labels.add(p.sub_category);
    }

    return Array.from(labels).sort();
  }, [products, selectedMainCategory]);

const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) => p.is_active !== false && p.is_webshop_visible !== false
    );

    if (selectedMainCategory) {
      result = result.filter((p) => {
        const mainKey = (p.product_group_key || p.main_category) as MainCategoryKey | string | null;

        if (!mainKey) return false;
        return mainKey === selectedMainCategory;
      });
    }

    if (selectedSubCategory) {
      result = result.filter((p) => p.sub_category === selectedSubCategory);
    }

    return result;
  }, [products, selectedMainCategory, selectedSubCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const pagedProducts = useMemo(() => {
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, safePage]);

  // ====== KUPON ======

  const handleApplyCoupon = async () => {
    setCouponMessage(null);
    setCouponError(null);

    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError(t("webshop.coupon.error.empty"));
      return;
    }

    if (cart.length === 0) {
      setCouponError(t("webshop.coupon.error.noCart"));
      return;
    }

    setCouponLoading(true);

    try {
      const payload = {
        couponCode: code,
        cartItems: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/public/webshop/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || t("webshop.coupon.error.general"));
      }

      const data = await res.json();

      if (!data.valid) {
        setCouponDiscount(0);
        setAppliedCouponCode(null);
        setCouponError(t("webshop.coupon.error.invalid"));
        setCouponMessage(null);
        return;
      }

      const discountAmount = Number(data.discountAmount || 0);
      if (Number.isNaN(discountAmount)) {
        setCouponDiscount(0);
        setAppliedCouponCode(null);
      } else {
        setCouponDiscount(discountAmount);
        setAppliedCouponCode(code);
      }

      setCouponMessage(t("webshop.coupon.success"));
    } catch (err: any) {
      console.error(err);
      setCouponError(err.message || t("webshop.coupon.error.unknown"));
    } finally {
      setCouponLoading(false);
    }
  };

  // ====== REGISZTRÁCIÓ ======

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegMessage(null);

    if (!regForm.fullName || !regForm.email || !regForm.password) {
      setRegError(t("webshop.registration.error.missingFields"));
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch("/api/public/webshop/register-guest", {
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
        throw new Error(text || t("webshop.registration.error.general"));
      }

      setRegForm(INITIAL_REG_FORM);
      setRegMessage(t("webshop.registration.success"));
    } catch (err: any) {
      console.error(err);
      setRegError(err.message || t("webshop.registration.error.unknown"));
    } finally {
      setRegLoading(false);
    }
  };

  // ====== RENDELÉS ======

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setOrderMessage(null);

    if (cart.length === 0) {
      setOrderError(t("webshop.order.error.noCart"));
      return;
    }

    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.address) {
      setOrderError(t("webshop.order.error.missingFields"));
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
        coupon_code: appliedCouponCode,
        cart_items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/public/webshop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || t("webshop.order.error.general"));
      }

      const data = await res.json();
      console.log("Rendelés sikeresen ment:", data);

      setOrderMessage(t("webshop.order.success"));
      setCart([]);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponMessage(null);
      setCouponError(null);
      setCouponInput("");
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err: any) {
      console.error(err);
      setOrderError(err.message || t("webshop.order.error.unknown"));
    } finally {
      setOrderLoading(false);
    }
  };

  // ====== RENDER ======

  return (
    <main className="page-main page-main--webshop">
      {/* HERO */}
      <section className="webshop-hero">
        <div className="webshop-hero__bg">
          <img src="/images/kleoshop.png" alt={t("webshop.hero.imageAlt")} />
        </div>

        <div className="container webshop-hero__content">
          <div className="webshop-hero__bubbles">
            <div className="webshop-hero__bubble webshop-hero__bubble--top">
              <img alt={t("webshop.hero.badge.giftVouchers")} />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--middle">
              <img alt={t("webshop.hero.badge.beautyPackages")} />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--bottom">
              <img alt={t("webshop.hero.badge.passes")} />
            </div>
          </div>

          <div className="webshop-hero__text">
            <p className="section-eyebrow">{t("webshop.hero.eyebrow")}</p>

            <h1 className="hero-title hero-title--tight">
              {t("webshop.hero.titleMain")}{" "}
              <span className="hero-part hero-part-magenta">
                {t("webshop.hero.titleHighlight")}
              </span>
            </h1>

            <p className="hero-lead hero-lead--narrow">
              {t("webshop.hero.lead")}
            </p>

            <div className="webshop-hero__buttons">
              <a
                className="btn btn-primary btn-primary--magenta btn--shine"
                href="#webshop-lista"
              >
                {t("webshop.hero.cta.products")}
              </a>
              <a
                className="btn btn-secondary btn-secondary--ghost btn--shine"
                href="#webshop-regisztracio"
              >
                {t("webshop.hero.cta.profile")}
              </a>
            </div>

            <div className="webshop-invoice">
              <div className="webshop-invoice__image">
                <img
                  src="/images/vendegszamla-minta.png"
                  alt={t("webshop.hero.invoiceAlt")}
                />
              </div>
              <div className="webshop-invoice__text">
                <p className="small">{t("webshop.hero.invoiceText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA + KOSÁR */}
      <section id="webshop-lista" className="section section--webshop">
        <div className="container webshop-layout">
{/* Felső, vízszintes kategória sáv – két hasábon át */}
<div className="webshop-categories-bar webshop-layout__categories">
  <h3 className="webshop-categories-bar__title">
    {t("webshop.list.sidebarTitle")}
  </h3>

  <div className="webshop-categories-bar__main">
    {CATEGORY_TREE.map((main) => {
      const isActiveMain = selectedMainCategory === main.key;
      return (
        <button
          key={main.key}
          type="button"
          className={
            "webshop-category-pill" +
            (isActiveMain ? " webshop-category-pill--active" : "")
          }
          onClick={() => {
            const next = isActiveMain ? null : main.key;
            setSelectedMainCategory(next);
          }}
        >
          {getMainCategoryLabel(main.key)}
        </button>
      );
    })}
  </div>
  {selectedMainCategory && subcategoriesForSelectedMain.length > 0 && (
    <div className="webshop-subcategory-row">
      {subcategoriesForSelectedMain.map((sub) => {
        const isActiveSub = selectedSubCategory === sub;
        return (
          <button
            key={sub}
            type="button"
            className={
              "webshop-category-pill webshop-category-pill--sub" +
              (isActiveSub ? " webshop-category-pill--active" : "")
            }
            onClick={() => {
              const next = isActiveSub ? null : sub;
              setSelectedSubCategory(next);
            }}
          >
            {sub}
          </button>
        );
      })}
    </div>
  )}
</div>

          {/* KÖZÉP: TERMÉKLISTA */}
          <div className="webshop-main">
            <p className="section-eyebrow">{t("webshop.list.eyebrow")}</p>
            <h2>{t("webshop.list.title")}</h2>
            <p className="section-lead">{t("webshop.list.lead")}</p>

                        {productsLoading && (
              <p className="webshop-status webshop-status--loading">
                {t("webshop.list.loading")}
              </p>
            )}

            {productsError && (
              <p className="webshop-status webshop-status--error">
                {productsError}
              </p>
            )}

            <div className="webshop-products-grid">
              {pagedProducts.map((product) => {
                const raw =
                  product.retail_price_gross ?? product.sale_price ?? 0;
                const price =
                  typeof raw === "string"
                    ? parseFloat(raw.replace(",", ".")) || 0
                    : raw ?? 0;
                const displayPrice =
                  !price || Number.isNaN(price)
                    ? t("webshop.list.priceOnRequest")
                    : `${price.toLocaleString("hu-HU")} ${currencyLabel}`;

                const imageSrc = buildImageUrl(product.image_url || undefined);

                return (
                  <article key={product.id} className="webshop-product-card">
                    <Link
                      to={`/webshop/products/${product.id}`}
                      state={{ product }}
                      className="webshop-product-card__image"
                    >
                      {imageSrc ? (
                        <img src={imageSrc} alt={getProductName(product, lang)} />
                      ) : (
                        <div className="webshop-product-card__image-placeholder">
                          <span>{product.name?.[0] ?? "K"}</span>
                        </div>
                      )}
                    </Link>

                    <div className="webshop-product-card__body">
                      <h3 className="webshop-product-card__title">
                        <Link
                          to={`/webshop/products/${product.id}`}
                          state={{ product }}
                        >
                          {getProductName(product, lang)}
                        </Link>
                      </h3>

                      <p className="webshop-product-card__sku">
                        <small>SKU: {product.sku}</small>
                      </p>

                      <p className="webshop-product-card__price">
                        <strong>{displayPrice}</strong>
                      </p>

                      <div className="webshop-product-card__actions">
                    

                        <button
                          type="button"
                          className="btn btn-primary btn-primary--magenta btn--shine webshop-product-card__btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          <span>{t("webshop.list.addToCart")}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredProducts.length === 0 &&
              !productsLoading &&
              !productsError && (
                <p className="webshop-status">
                  {t("webshop.list.emptyFiltered")}
                </p>
              )}

            {totalPages > 1 && (
              <div className="webshop-pagination">
                <button
                  type="button"
                  className="webshop-pagination__button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      type="button"
                      className={
                        "webshop-pagination__button" +
                        (page === safePage
                          ? " webshop-pagination__button--active"
                          : "")
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className="webshop-pagination__button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* JOBB OLDAL: KOSÁR */}
          <aside className="webshop-cart">
            <div className="webshop-cart__head">
              <h3 className="webshop-cart__title">
                {t("webshop.cart.title")}
              </h3>
              <p className="webshop-cart__hint">
                {t("webshop.cart.hint")}
              </p>
            </div>

            {cart.length === 0 && (
              <p className="webshop-cart__empty">
                {t("webshop.cart.empty")}
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
                        ? parseFloat(raw.replace(",", ".")) || 0
                        : raw ?? 0;
                    const displayPrice =
                      !price || Number.isNaN(price)
                        ? t("webshop.list.priceOnRequest")
                        : `${price.toLocaleString("hu-HU")} ${currencyLabel}`;

                    return (
                      <li
                        key={item.product.id}
                        className="webshop-cart-item"
                      >
                        <div className="webshop-cart-item__main">
                          <h4 className="webshop-cart-item__title">
                            {getProductName(item.product, lang)}
                          </h4>
                          <p className="webshop-cart-item__price">
                            {displayPrice}
                          </p>
                        </div>

                        <div className="webshop-cart-item__actions">
                          <button
                            type="button"
                            className="webshop-cart-qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.product.id, -1)
                            }
                          >
                            −
                          </button>
                          <span className="webshop-cart-qty">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="webshop-cart-qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.product.id, +1)
                            }
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="webshop-cart-qty-btn"
                            onClick={() =>
                              handleRemoveFromCart(item.product.id)
                            }
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="webshop-cart__summary">
                  <div className="webshop-cart__total">
                    <span>{t("webshop.cart.subtotal")}</span>
                    <strong>
                      {cartTotal.toLocaleString("hu-HU")} {currencyLabel}
                    </strong>
                  </div>

                  {cartTotalAfterCoupon !== cartTotal && (
                    <div className="webshop-cart__total webshop-cart__total--discount">
                      <span>{t("webshop.cart.totalDiscounted")}</span>
                      <strong>
                        {cartTotalAfterCoupon.toLocaleString("hu-HU")}{" "}
                        {currencyLabel}
                      </strong>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-ghost webshop-cart__clear"
                    onClick={handleClearCart}
                  >
                    {t("webshop.cart.clear")}
                  </button>

                  <a
                    href="#webshop-checkout"
                    className="btn btn-primary btn-primary--magenta webshop-cart__checkout-link"
                  >
                    {t("webshop.cart.gotoCheckout")}
                  </a>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      {/* REGISZTRÁCIÓ + CHECKOUT BLOKK */}
      <section
        id="webshop-regisztracio"
        className="section section--webshop-alt"
      >
        <div className="container webshop-checkout-grid">
          {/* BAL: REGISZTRÁCIÓ / FIÓK */}
          <div className="webshop-panel">
            <p className="section-eyebrow">
              {t("webshop.registration.eyebrow")}
            </p>
            <h2>{t("webshop.registration.title")}</h2>
            <p className="section-lead">
              {t("webshop.registration.lead")}
            </p>

            <form className="webshop-form" onSubmit={handleRegistrationSubmit}>
              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("webshop.registration.fullNameLabel")}</span>
                  <input
                    type="text"
                    value={regForm.fullName}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>{t("webshop.registration.emailLabel")}</span>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className="form-row">
                <label className="field">
                  <span>{t("webshop.registration.passwordLabel")}</span>
                  <input
                    type="password"
                    value={regForm.password}
                    onChange={(e) =>
                      setRegForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {regError && (
                <p className="form-msg--error webshop-form-msg">{regError}</p>
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
                {regLoading
                  ? t("webshop.registration.submitLoading")
                  : t("webshop.registration.submit")}
              </button>
            </form>
          </div>

          {/* JOBB: SZÁLLÍTÁS + FIZETÉS + ÖSSZEFOGLALÓ */}
          <div
            id="webshop-checkout"
            className="webshop-panel webshop-panel--checkout"
          >
            <p className="section-eyebrow">{t("webshop.checkout.eyebrow")}</p>
            <h2>{t("webshop.checkout.title")}</h2>
            <p className="section-lead">{t("webshop.checkout.lead")}</p>

            <form className="webshop-form" onSubmit={handleOrderSubmit}>
              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("webshop.checkout.fullNameLabel")}</span>
                  <input
                    type="text"
                    value={checkoutForm.fullName}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="field">
                  <span>{t("webshop.checkout.emailLabel")}</span>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("webshop.checkout.phoneLabel")}</span>
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
                  <span>{t("webshop.checkout.paymentMethodLabel")}</span>
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
                    <option value="card">
                      {t("webshop.checkout.payment.card")}
                    </option>
                    <option value="cod">
                      {t("webshop.checkout.payment.cod")}
                    </option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label className="field">
                  <span>{t("webshop.checkout.addressLabel")}</span>
                  <textarea
                    value={checkoutForm.address}
                    onChange={(e) =>
                      setCheckoutForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="form-row form-row--two">
                <label className="field">
                  <span>{t("webshop.checkout.couponLabel")}</span>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t("webshop.checkout.couponPlaceholder")}
                  />
                </label>
                <div className="field field--button">
                  <button
                    type="button"
                    className="btn btn-secondary btn-secondary--ghost"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || cart.length === 0}
                  >
                    {couponLoading
                      ? t("webshop.checkout.couponChecking")
                      : t("webshop.checkout.couponApply")}
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

              <div className="form-row">
                <label className="field">
                  <span>{t("webshop.checkout.noteLabel")}</span>
                  <textarea
                    value={checkoutForm.note}
                    placeholder={t("webshop.checkout.notePlaceholder")}
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
                    <span>{t("webshop.checkout.subtotal")}</span>{" "}
                    <strong>
                      {cartSubtotal.toLocaleString("hu-HU")} {currencyLabel}
                    </strong>
                  </div>
                  {appliedCouponCode && (
                    <div>
                      <span>
                        {t("webshop.checkout.discount")} ({appliedCouponCode}):{" "}
                      </span>
                      <strong>
                        -{couponDiscount.toLocaleString("hu-HU")}{" "}
                        {currencyLabel}
                      </strong>
                    </div>
                  )}
                  <div>
                    <span>{t("webshop.checkout.total")}</span>{" "}
                    <strong>
                      {cartTotalAfterCoupon.toLocaleString("hu-HU")}{" "}
                      {currencyLabel}
                    </strong>
                  </div>
                </div>

                <div className="webshop-order-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-primary--magenta btn--shine"
                    disabled={orderLoading || cart.length === 0}
                  >
                    {orderLoading
                      ? t("webshop.checkout.submitLoading")
                      : t("webshop.checkout.submit")}
                  </button>
                </div>
              </div>

              {cart.length === 0 && (
                <p className="webshop-status webshop-status--hint">
                  {t("webshop.checkout.emptyCartHint")}
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
