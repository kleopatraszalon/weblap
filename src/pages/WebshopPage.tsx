// src/pages/WebshopPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/kleo-theme v7.css";
import { apiFetch } from "../apiClient";  // <-- EZ LEGYEN
import { useI18n } from "../i18n";

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

interface CategoryLevel3 {
  key: ServiceCategoryKey;
  label: string;
  icon?: string;
}

interface CategoryLevel2 {
  key: SubCategoryKey;
  label: string;
  children?: CategoryLevel3[];
}

interface CategoryLevel1 {
  key: MainCategoryKey;
  label: string;
  children?: CategoryLevel2[];
}

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
          { key: "HAIRDRESSING", label: "Fodrászat" },
          { key: "COSMETICS", label: "Kozmetika" },
          { key: "MASSAGE", label: "Masszázs" },
          { key: "SOLARIUM", label: "Szolárium" },
          { key: "NAILS", label: "Kéz- és lábápolás" },
          { key: "OTHER", label: "Egyéb szépségszolgáltatások" },
        ],
      },
    ],
  },
  {
    key: "PASSES",
    label: "Bérletek",
    children: [
      { key: "PASSES_SOLARIUM", label: "Szolárium bérletek" },
      { key: "PASSES_MASSAGE", label: "Masszázsbérletek" },
      {
        key: "PASSES_FACIAL",
        label: "Arckezelés bérletek",
      },
      {
        key: "PASSES_HAIR",
        label: "Fodrászati bérletek",
      },
      {
        key: "PASSES_OTHER",
        label: "Egyéb bérletek",
      },
    ],
  },
  {
    key: "GUEST_ACCOUNT",
    label: "Vendégfiókok és vendégszámlák",
    children: [
      { key: "GUEST_ACCOUNT_CREATE", label: "Vendégprofil létrehozása" },
      {
        key: "GUEST_ACCOUNT_BALANCE",
        label: "Vendégszámlák és egyenlegek",
      },
    ],
  },
  {
    key: "KLEO_PRODUCTS",
    label: "Kleopátra termékek",
    children: [
      { key: "KLEO_PRODUCTS_HAIR", label: "Hajápolási termékek" },
      { key: "KLEO_PRODUCTS_COSMETICS", label: "Kozmetikumok" },
      {
        key: "KLEO_PRODUCTS_SOLARIUM",
        label: "Szolárium krémek és kiegészítők",
      },
      { key: "KLEO_PRODUCTS_ACCESSORIES", label: "Kiegészítők" },
    ],
  },
  {
    key: "COMPANY_DISCOUNTS",
    label: "Kedvezmények cégeknek",
    children: [
      {
        key: "COMPANY_DISCOUNTS_PARTNERS",
        label: "Partnercégek és kedvezmények",
      },
      {
        key: "COMPANY_DISCOUNTS_EMPLOYEES",
        label: "Munkavállalói kedvezmények",
      },
    ],
  },
];

interface Product {
  id: string;
  sku: string;
  name: string;
  retail_price_gross: number | null;
  sale_price: number | null;
  image_url?: string | null;
  is_active: boolean;
  is_webshop_visible: boolean;
  product_group_key?: string | null;
  service_category_key?: string | null;
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

export const WebshopPage: React.FC = () => {
  const { t } = useI18n();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null
  );
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
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryKey | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState<ServiceCategoryKey | null>(null);

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
  // a localStorage és az event is frissüljön
  const updateCart = (updater: (prev: CartItem[]) => CartItem[]) => {
    setCart((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem("kleoCart", JSON.stringify(next));
      } catch (e) {
        console.error("Kosár mentése sikertelen", e);
      }
      return next;
    });
  };

  // Ha máshol (pl. lebegő kosár ikon vagy /cart oldal) változik a kosár,
  // egy egyedi eseménnyel jelezzük itt is
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<CartItem[]>;
      if (customEvent.detail) {
        setCart(customEvent.detail);
      }
    };

    window.addEventListener("kleo-cart-updated", handler as EventListener);
    return () => {
      window.removeEventListener("kleo-cart-updated", handler as EventListener);
    };
  }, []);

  // Helper: esemény küldése, ha helyben módosítjuk a kosarat
  const dispatchCartUpdateEvent = (nextCart: CartItem[]) => {
    const event = new CustomEvent<CartItem[]>("kleo-cart-updated", {
      detail: nextCart,
    });
    window.dispatchEvent(event);
  };

  const handleAddToCart = (product: Product) => {
    updateCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let next: CartItem[];

      if (existing) {
        next = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        next = [...prev, { product, quantity: 1 }];
      }

      dispatchCartUpdateEvent(next);
      return next;
    });
  };

  const handleChangeQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart((prev) => {
        const next = prev.filter((item) => item.product.id !== productId);
        dispatchCartUpdateEvent(next);
        return next;
      });
      return;
    }

    updateCart((prev) => {
      const next = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      dispatchCartUpdateEvent(next);
      return next;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    updateCart((prev) => {
      const next = prev.filter((item) => item.product.id !== productId);
      dispatchCartUpdateEvent(next);
      return next;
    });
  };

  const handleClearCart = () => {
    updateCart(() => {
      const next: CartItem[] = [];
      dispatchCartUpdateEvent(next);
      return next;
    });
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const raw =
        item.product.retail_price_gross ?? item.product.sale_price ?? 0;
      const price =
        typeof raw === "string" ? parseFloat(raw.replace(",", ".")) : raw ?? 0;
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
        throw new Error(
          text || t("webshop.coupon.error.general")
        );
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

  // =============== REGISZTRÁCIÓ ===============

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegMessage(null);

    if (!regForm.fullName || !regForm.email || !regForm.password) {
      throw new Error(t("webshop.registration.error.missingFields"));
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
        throw new Error(
          text || t("webshop.registration.error.general")
        );
      }

      setRegForm(INITIAL_REG_FORM);
      setRegMessage(
        t("webshop.registration.success")
      );
    } catch (err: any) {
      console.error(err);
      setRegError(err.message || t("webshop.registration.error.unknown"));
    } finally {
      setRegLoading(false);
    }
  };

  // =============== RENDELÉS LEADÁSA ===============

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setOrderMessage(null);

    if (cart.length === 0) {
      setOrderError(t("webshop.order.error.noCart"));
      return;
    }

    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.address) {
      setOrderError(
        t("webshop.order.error.missingFields")
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
        throw new Error(
          text || t("webshop.order.error.general")
        );
      }

      const data = await res.json();
      console.log("Rendelés sikeresen ment:", data);

      setOrderMessage(
        t("webshop.order.success")
      );
      setCart([]);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
      setCouponMessage(null);
      setCouponError(null);
      setCouponInput("");
    } catch (err: any) {
      console.error(err);
      setOrderError(err.message || t("webshop.order.error.unknown"));
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const list = await apiFetch<Product[]>("/public/webshop/products");
        setProducts(list);
      } catch (err: any) {
        console.error(err);
        setProductsError(
          t("webshop.list.error")
        );
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [t]);

 const filteredProducts = useMemo(() => {
  // csak azokat rejtsük el, ahol kifejezetten false-t kaptunk a DB-ből
  let result = products.filter(
    (p) => p.is_active !== false && p.is_webshop_visible !== false
  );

  if (selectedMainCategory) {
    result = result.filter((p) => {
      if (selectedMainCategory === "GIFT_VOUCHERS") {
        return p.product_group_key === "GIFT_VOUCHERS";
      }
      if (selectedMainCategory === "PASSES") {
        return p.product_group_key === "PASSES";
      }
      if (selectedMainCategory === "GUEST_ACCOUNT") {
        return p.product_group_key === "GUEST_ACCOUNT";
      }
      if (selectedMainCategory === "KLEO_PRODUCTS") {
        return p.product_group_key === "KLEO_PRODUCTS";
      }
      if (selectedMainCategory === "COMPANY_DISCOUNTS") {
        return p.product_group_key === "COMPANY_DISCOUNTS";
      }
      return true;
    });
  }

  if (selectedSubCategory) {
    result = result.filter(
      (p) => p.product_group_key === selectedSubCategory
    );
  }

  if (selectedServiceCategory) {
    result = result.filter(
      (p) => p.service_category_key === selectedServiceCategory
    );
  }

  return result;
}, [
  products,
  selectedMainCategory,
  selectedSubCategory,
  selectedServiceCategory,
]);

  return (
    <main className="page-main page-main--webshop">
      {/* HERO – meglévő látvány a képpel és körökkel */}
      <section className="webshop-hero">
        <div className="webshop-hero__bg">
          <img
            src="/images/kleoshop.png"
            alt={t("webshop.hero.imageAlt")}
          />
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
            <p className="section-eyebrow">
              {t("webshop.hero.eyebrow")}
            </p>

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
                <p className="small">
                  {t("webshop.hero.invoiceText")}
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
            <p className="section-eyebrow">
              {t("webshop.list.eyebrow")}
            </p>
            <h2>{t("webshop.list.title")}</h2>
            <p className="section-lead">
              {t("webshop.list.lead")}
            </p>

            {productsLoading && (
              <p className="webshop-status">{t("webshop.list.loading")}</p>
            )}
            {productsError && (
              <p className="webshop-status webshop-status--error">
                {productsError}
              </p>
            )}

            {/* Kategória-szűrők – az általad kért fa alapján */}
            <div className="webshop-categories">
              {CATEGORY_TREE.map((main) => {
                const isActiveMain = selectedMainCategory === main.key;

                return (
                  <div key={main.key} className="webshop-category-group">
                    <button
                      type="button"
                      className={
                        isActiveMain
                          ? "webshop-category-main webshop-category-main--active"
                          : "webshop-category-main"
                      }
                      onClick={() => {
                        const next = isActiveMain ? null : main.key;
                        setSelectedMainCategory(next);
                        setSelectedSubCategory(null);
                        setSelectedServiceCategory(null);
                      }}
                    >
                      {main.label}
                    </button>

                    {isActiveMain && main.children && (
                      <div className="webshop-subcategories">
                        {main.children.map((sub) => {
                          const isActiveSub = selectedSubCategory === sub.key;
                          return (
                            <div
                              key={sub.key}
                              className="webshop-subcategory-block"
                            >
                              <button
                                type="button"
                                className={
                                  isActiveSub
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

                              {sub.children && isActiveSub && (
                                <div className="webshop-service-categories">
                                  {sub.children.map((svc) => (
                                    <button
                                      key={svc.key}
                                      type="button"
                                      className={
                                        selectedServiceCategory === svc.key
                                          ? "webshop-service__button webshop-service__button--active"
                                          : "webshop-service__button"
                                      }
                                      onClick={() => {
                                        setSelectedServiceCategory(
                                          selectedServiceCategory === svc.key
                                            ? null
                                            : svc.key
                                        );
                                      }}
                                    >
                                      {svc.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                className="webshop-category-reset"
                onClick={() => {
                  setSelectedMainCategory(null);
                  setSelectedSubCategory(null);
                  setSelectedServiceCategory(null);
                }}
              >
                {t("webshop.list.resetFilters")}
              </button>
            </div>

            {/* Terméklista kártyák */}
            <div className="webshop-products-grid">
              {filteredProducts.map((product) => {
                const raw =
                  product.retail_price_gross ?? product.sale_price ?? 0;
                const price =
                  typeof raw === "string"
                    ? parseFloat(raw.replace(",", "."))
                    : raw ?? 0;
                const displayPrice =
                  !price || Number.isNaN(price)
                    ? "Ár kérésre"
                    : `${price.toLocaleString("hu-HU")} Ft`;

                return (
                  <article key={product.id} className="webshop-product-card">
                    <div className="webshop-product-card__image">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                      ) : (
                        <div className="webshop-product-card__image-placeholder">
                          <span>{product.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="webshop-product-card__body">
                      <h3 className="webshop-product-card__title">
                        {product.name}
                      </h3>
                      <p className="webshop-product-card__sku">
                        <small>SKU: {product.sku}</small>
                      </p>
                      <p className="webshop-product-card__price">
                        <strong>{displayPrice}</strong>
                      </p>
                      <button
                        type="button"
                        className="btn btn-primary btn-primary--magenta btn--shine webshop-product-card__btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <span>{t("webshop.list.addToCart")}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredProducts.length === 0 && !productsLoading && !productsError && (
              <p className="webshop-status">
                  {t("webshop.list.emptyFiltered")}
                </p>
            )}
          </div>

          {/* JOBB: KOSÁR */}
          <aside className="webshop-cart">
            <div className="webshop-cart__head">
              <h3 className="webshop-cart__title">{t("webshop.cart.title")}</h3>
              <p className="webshop-cart__hint">
                <small>
                  Válaszd ki a bérleteket és utalványokat, majd a "Tovább a
                  fizetéshez" gombbal véglegesítsd a rendelést.
                </small>
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
                        ? parseFloat(raw.replace(",", "."))
                        : raw ?? 0;
                    const displayPrice =
                      !price || Number.isNaN(price)
                        ? "Ár kérésre"
                        : `${price.toLocaleString("hu-HU")} Ft`;

                    return (
                      <li
                        key={item.product.id}
                        className="webshop-cart__item webshop-cart-item"
                      >
                        <div className="webshop-cart-item__main">
                          <div className="webshop-cart-item__info">
                            <h4 className="webshop-cart-item__title">
                              {item.product.name}
                            </h4>
                            <p className="webshop-cart-item__price">
                              {displayPrice}
                            </p>
                          </div>
                        </div>
                        <div className="webshop-cart-item__actions">
                          <button
                            type="button"
                            className="webshop-cart-qty-btn"
                            onClick={() =>
                              handleChangeQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="webshop-cart-qty">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="webshop-cart-qty-btn"
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
                    <span>{t("webshop.cart.subtotal")}</span>
                    <strong>
                      {cartSubtotal.toLocaleString("hu-HU")} {currencyLabel}
                    </strong>
                  </div>

                  {appliedCouponCode && (
                    <div className="webshop-cart__total webshop-cart__total--discount">
                      <span>{t("webshop.cart.discount")} ({appliedCouponCode}):</span>
                      <strong>
                        -{couponDiscount.toLocaleString("hu-HU")}{" "}
                        {currencyLabel}
                      </strong>
                    </div>
                  )}

                  <div className="webshop-cart__total webshop-cart__total--final">
                    <span>{t("webshop.cart.total")}</span>
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

      {/* REGISZTRÁCIÓ + FIZETÉS + KUPONMEZŐ */}
      <section
        id="webshop-regisztracio"
        className="section section--webshop-alt"
      >
        <div className="container webshop-checkout-grid">
          {/* REGISZTRÁCIÓ – users tábla */}
          <div className="webshop-panel">
            <p className="section-eyebrow">{t("webshop.registration.eyebrow")}</p>
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
                      setRegForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                </label>
                <label className="field">
                  <span>{t("webshop.registration.emailLabel")}</span>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) =>
                      setRegForm((prev) => ({ ...prev, email: e.target.value }))
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
                      setRegForm((prev) => ({ ...prev, password: e.target.value }))
                    }
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
                {regLoading
                  ? t("webshop.registration.submitLoading")
                  : t("webshop.registration.submit")}
              </button>
            </form>
          </div>

          {/* FIZETÉS / SZÁLLÍTÁSI ADATOK + KUPON */}
          <div id="webshop-checkout" className="webshop-panel">
            <p className="section-eyebrow">{t("webshop.checkout.eyebrow")}</p>
            <h2>{t("webshop.checkout.title")}</h2>
            <p className="section-lead">
              {t("webshop.checkout.lead")}
            </p>

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
                        paymentMethod: e.target.value as "card" | "cod",
                      }))
                    }
                  >
                    <option value="card">{t("webshop.checkout.payment.card")}</option>
                    <option value="cod">{t("webshop.checkout.payment.cod")}</option>
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
                    {couponLoading ? t("webshop.checkout.couponChecking") : t("webshop.checkout.couponApply")}
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
                      <span>{t("webshop.checkout.discount")} ({appliedCouponCode}): </span>
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
