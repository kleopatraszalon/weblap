import React, { useEffect, useMemo, useState } from "react";

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
type Product = {
  id: string;
  name: string;
  retail_price_gross: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  web_description?: string | null;
  is_retail?: boolean | null;
  web_is_visible?: boolean | null;
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

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const WebshopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

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

  // KUPON ÁLLAPOT
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
    setCart((prev) => {
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
      setCart((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === id ? { ...i, quantity } : i
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
    // kupont is nullázzuk, ha kiürül a kosár
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

  const currencyLabel = "Ft"; // a dump alapján HUF

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
      /**
       * BACKEND – javasolt végpont:
       *   POST /api/public/webshop/validate-coupon
       *
       * input:
       *   {
       *     code: "KLEO10",
       *     cart: {
       *       items: [{ product_id, quantity, unit_price }],
       *       total_gross: number
       *     }
       *   }
       *
       * output (példa):
       *   {
       *     valid: true,
       *     code: "KLEO10",
       *     discount_gross: 2500,
       *     final_total_gross: 22500,
       *     message: "10% kedvezmény jóváírva."
       *   }
       */
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
          data.message || "Érvénytelen kuponkód vagy nem alkalmazható erre a rendelésre."
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
        payment_method: checkoutForm.paymentMethod, // "card" | "cod"
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

      // Ha kártyás fizetés: { payment_url: "https://..." }
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
              <img
                
                alt="Ajándékutalványok"
              />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--middle">
              <img
               
                alt="Szépségcsomagok"
              />
            </div>
            <div className="webshop-hero__bubble webshop-hero__bubble--bottom">
              <img  alt="Bérletek" />
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
              Kleopátra élményt adhatsz ajándékba vagy saját magadnak –
              online vásárlással, bankkártyás vagy utánvétes fizetéssel, kupon
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
              <strong>pa lehető leggyorsaban</strong> érkeznek. Csak azok
              látszanak, amik elérhetőek
            </p>

            {productsLoading && (
              <p className="webshop-status">Termékek betöltése…</p>
            )}
            {productsError && (
              <p className="webshop-status webshop-status--error">
                {productsError}
              </p>
            )}
            {!productsLoading && !productsError && products.length === 0 && (
              <p className="webshop-status">
                Jelenleg nem elérhetőek webshop termékek. Kérlek, nézz vissza
                később.
              </p>
            )}

            <div className="webshop-grid">
              {products.map((p) => {
                const raw = p.retail_price_gross ?? p.sale_price ?? 0;
                const price =
                  typeof raw === "string"
                    ? parseFloat(raw.replace(",", "."))
                    : raw ?? 0;
                const formattedPrice =
                  !price || Number.isNaN(price)
                    ? "-"
                    : `${price.toLocaleString("hu-HU")} ${currencyLabel}`;

                return (
                  <article key={p.id} className="webshop-card">
                    {p.image_url && (
                      <div className="webshop-card__image-wrap">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="webshop-card__image"
                        />
                      </div>
                    )}

                    <h3 className="webshop-card__title">{p.name}</h3>

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
                        Kosárba
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
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
                      <span>
                        Kupon kedvezmény ({appliedCouponCode}):{" "}
                      </span>
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
