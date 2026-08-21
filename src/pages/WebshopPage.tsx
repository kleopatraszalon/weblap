import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiClient";
import "../styles/webshop-modern.css";

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
  image_url?: string | null;
  thumbnail_url?: string | null;
  web_description?: string | null;
  main_category?: MainCategoryKey | null;
  sub_category?: SubCategoryKey | null;
  service_category?: ServiceCategoryKey | null;
};

type CartItem = { product: Product; quantity: number };
type CouponResponse = {
  valid: boolean;
  code?: string;
  discount_gross?: number;
  final_total_gross?: number;
  message?: string;
};
type SortKey = "recommended" | "price-asc" | "price-desc" | "name";

type Category = {
  key: MainCategoryKey;
  label: string;
  icon: string;
};

const CATEGORIES: Category[] = [
  { key: "GIFT_VOUCHERS", label: "Ajándékutalványok", icon: "✦" },
  { key: "PASSES", label: "Bérletek", icon: "∞" },
  { key: "KLEO_PRODUCTS", label: "Kleo termékek", icon: "◌" },
  { key: "GUEST_ACCOUNT", label: "Vendégszámla", icon: "◇" },
  { key: "COMPANY_DISCOUNTS", label: "Céges kedvezmények", icon: "%" },
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const toNumber = (value: number | string | null | undefined) => {
  if (value == null || value === "") return 0;
  const parsed = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const priceInfo = (product: Product) => {
  const retail = toNumber(product.retail_price_gross);
  const sale = toNumber(product.sale_price);
  const isDiscounted = sale > 0 && retail > 0 && sale < retail;
  const effective = isDiscounted ? sale : sale > 0 && retail <= 0 ? sale : retail;
  const discountPercent = isDiscounted ? Math.round(((retail - sale) / retail) * 100) : 0;
  return { retail, sale, effective, isDiscounted, discountPercent };
};

const money = (value: number) => `${Math.round(value).toLocaleString("hu-HU")} Ft`;

const buildImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return undefined;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${API_BASE}/${imageUrl.replace(/^\/+/, "")}`;
};

const readCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("kleoCart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    localStorage.removeItem("kleoCart");
    return [];
  }
};

const readWishlist = (): string[] => {
  try {
    const raw = localStorage.getItem("kleoWishlist");
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export const WebshopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [category, setCategory] = useState<MainCategoryKey | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    setCart(readCart());
    setWishlist(readWishlist());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/public/webshop/products`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Webshop products load error", err);
          setError("A terméklista most nem tölthető be. Kérjük, próbáld újra néhány másodperc múlva.");
        }
      } finally {
        setLoading(false);
      }
    };
    void loadProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const q = normalize(search);
    const next = products.filter((product) => {
      if (category && product.main_category !== category) return false;
      if (!q) return true;
      const haystack = normalize(`${product.name} ${product.web_description || ""}`);
      return haystack.includes(q);
    });

    return [...next].sort((a, b) => {
      if (sort === "price-asc") return priceInfo(a).effective - priceInfo(b).effective;
      if (sort === "price-desc") return priceInfo(b).effective - priceInfo(a).effective;
      if (sort === "name") return a.name.localeCompare(b.name, "hu");
      return 0;
    });
  }, [products, search, category, sort]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<MainCategoryKey, number>();
    products.forEach((product) => {
      if (!product.main_category) return;
      counts.set(product.main_category, (counts.get(product.main_category) || 0) + 1);
    });
    return counts;
  }, [products]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Math.max(0, item.quantity || 0), 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + priceInfo(item.product).effective * item.quantity, 0),
    [cart]
  );
  const total = Math.max(0, subtotal - couponDiscount);

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("kleoCart", JSON.stringify(next));
    window.dispatchEvent(new Event("kleo-cart-updated"));
  };

  const addProduct = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    const next = existing
      ? cart.map((item) =>
          item.product.id === product.id ? { ...item, product, quantity: item.quantity + 1 } : item
        )
      : [...cart, { product, quantity: 1 }];
    saveCart(next);
    setToast(`${product.name} a kosárba került.`);
  };

  const changeQuantity = (productId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      saveCart(cart.filter((item) => item.product.id !== productId));
      return;
    }
    saveCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);
    localStorage.setItem("kleoWishlist", JSON.stringify(next));
  };

  const applyCoupon = async () => {
    setCouponError("");
    setCouponMessage("");
    const code = couponInput.trim().toUpperCase();
    if (!code) return setCouponError("Írj be egy kuponkódot.");
    if (!cart.length) return setCouponError("A kupon ellenőrzéséhez előbb tegyél terméket a kosárba.");

    setCouponLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code,
          cart: {
            items: cart.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
              unit_price: priceInfo(item.product).effective,
            })),
            total_gross: subtotal,
          },
        }),
      });
      const data = (await response.json().catch(() => ({}))) as CouponResponse;
      if (!response.ok || !data.valid) throw new Error(data.message || "A kupon nem alkalmazható erre a kosárra.");
      setCouponCode(data.code || code);
      setCouponDiscount(Number(data.discount_gross || 0));
      setCouponMessage(data.message || "Kupon alkalmazva.");
    } catch (err: any) {
      setCouponCode(null);
      setCouponDiscount(0);
      setCouponError(err?.message || "A kupon ellenőrzése sikertelen.");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <main className="shop-modern">
      <section className="shop-modern__hero">
        <div className="container shop-modern__hero-grid">
          <div className="shop-modern__hero-copy">
            <span className="shop-modern__eyebrow">KLEOSHOP · KLEOPÁTRA SZÉPSÉGSZALONOK</span>
            <h1>Szépségélmény, <em>egy kattintásra.</em></h1>
            <p>
              Ajándékutalványok, bérletek és Kleo termékek letisztult, gyors vásárlási
              élménnyel. Keresés, kuponkezelés, vendég checkout és mobilbarát kosár egy helyen.
            </p>
            <div className="shop-modern__hero-actions">
              <a className="shop-modern__button shop-modern__button--primary" href="#termekek">
                Vásárlás indítása
              </a>
              <Link className="shop-modern__button shop-modern__button--ghost" to="/cart">
                Kosár megnyitása {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </div>
            <div className="shop-modern__microproof">
              <span>✓ Vendégként is vásárolhatsz</span>
              <span>✓ Kuponkód a checkoutban</span>
              <span>✓ Azonnali rendelési visszaigazolás</span>
            </div>
          </div>
          <div className="shop-modern__hero-visual" aria-hidden="true">
            <div className="shop-modern__hero-card shop-modern__hero-card--main">
              <img src="/images/kleoshop.png" alt="" />
            </div>
            <div className="shop-modern__hero-card shop-modern__hero-card--floating">
              <span>AJÁNDÉK</span>
              <strong>Kleopátra élmény</strong>
              <small>digitális vagy szalonban felhasználható termékekhez</small>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-modern__trustbar" aria-label="Webshop előnyök">
        <div className="container shop-modern__trustbar-grid">
          <div><span>01</span><strong>Gyors termékkeresés</strong><small>név és leírás alapján</small></div>
          <div><span>02</span><strong>Átlátható árak</strong><small>akciós ár kiemeléssel</small></div>
          <div><span>03</span><strong>Kuponrendszer</strong><small>azonnali szerveres ellenőrzéssel</small></div>
          <div><span>04</span><strong>Mobil-first checkout</strong><small>külön kosár és fizetési oldal</small></div>
        </div>
      </section>

      <section id="termekek" className="shop-modern__catalog-section">
        <div className="container">
          <div className="shop-modern__section-head">
            <div>
              <span className="shop-modern__eyebrow">ONLINE KÍNÁLAT</span>
              <h2>Találd meg gyorsan, amit keresel</h2>
              <p>{products.length} elérhető webshop tétel · {filteredProducts.length} találat</p>
            </div>
            <Link to="/cart" className="shop-modern__cart-chip" aria-label="Kosár megnyitása">
              <span>🛍</span>
              <b>{cartCount}</b>
              <small>{money(subtotal)}</small>
            </Link>
          </div>

          <div className="shop-modern__category-scroller" aria-label="Termékkategóriák">
            <button
              type="button"
              className={!category ? "is-active" : ""}
              onClick={() => setCategory(null)}
            >
              <span>⌘</span> Összes <b>{products.length}</b>
            </button>
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item.key}
                className={category === item.key ? "is-active" : ""}
                onClick={() => setCategory(category === item.key ? null : item.key)}
              >
                <span>{item.icon}</span> {item.label} <b>{categoryCounts.get(item.key) || 0}</b>
              </button>
            ))}
          </div>

          <div className="shop-modern__toolbar">
            <label className="shop-modern__search">
              <span aria-hidden="true">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Keresés termék, bérlet vagy utalvány alapján…"
                aria-label="Keresés a webshopban"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Keresés törlése">×</button>
              )}
            </label>
            <label className="shop-modern__sort">
              <span>Rendezés</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                <option value="recommended">Ajánlott sorrend</option>
                <option value="price-asc">Ár szerint növekvő</option>
                <option value="price-desc">Ár szerint csökkenő</option>
                <option value="name">Név szerint</option>
              </select>
            </label>
          </div>

          {loading && (
            <div className="shop-modern__skeleton-grid" aria-label="Termékek betöltése">
              {Array.from({ length: 8 }, (_, index) => <div key={index} className="shop-modern__skeleton" />)}
            </div>
          )}

          {!loading && error && (
            <div className="shop-modern__empty shop-modern__empty--error">
              <strong>Nem sikerült betölteni a webshopot.</strong>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>Újrapróbálom</button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="shop-modern__empty">
              <strong>Nincs találat.</strong>
              <p>Próbálj másik keresést vagy válaszd az összes kategóriát.</p>
              <button type="button" onClick={() => { setSearch(""); setCategory(null); }}>Szűrők törlése</button>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="shop-modern__catalog-layout">
              <div className="shop-modern__grid">
                {filteredProducts.map((product) => {
                  const image = buildImageUrl(product.thumbnail_url || product.image_url);
                  const price = priceInfo(product);
                  const favorite = wishlist.includes(product.id);
                  return (
                    <article key={product.id} className="shop-modern__product-card">
                      <div className="shop-modern__product-media">
                        <Link to={`/webshop/${product.id}`} state={{ product }}>
                          {image ? (
                            <img src={image} alt={product.name} loading="lazy" />
                          ) : (
                            <div className="shop-modern__product-placeholder">KLEO</div>
                          )}
                        </Link>
                        <div className="shop-modern__badges">
                          {price.isDiscounted && <span className="shop-modern__badge shop-modern__badge--sale">−{price.discountPercent}%</span>}
                          <span className="shop-modern__badge">Online</span>
                        </div>
                        <button
                          type="button"
                          className={favorite ? "shop-modern__wishlist is-active" : "shop-modern__wishlist"}
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={favorite ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
                        >
                          {favorite ? "♥" : "♡"}
                        </button>
                      </div>
                      <div className="shop-modern__product-body">
                        <span className="shop-modern__product-kicker">
                          {CATEGORIES.find((item) => item.key === product.main_category)?.label || "Kleoshop"}
                        </span>
                        <h3><Link to={`/webshop/${product.id}`} state={{ product }}>{product.name}</Link></h3>
                        {product.web_description && <p>{product.web_description}</p>}
                        <div className="shop-modern__price-row">
                          <div>
                            {price.isDiscounted && <del>{money(price.retail)}</del>}
                            <strong>{price.effective > 0 ? money(price.effective) : "Ár hamarosan"}</strong>
                          </div>
                          <button type="button" onClick={() => addProduct(product)} disabled={price.effective <= 0}>
                            <span>＋</span> Kosárba
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="shop-modern__mini-cart" aria-label="Kosár összesítő">
                <div className="shop-modern__mini-cart-head">
                  <div><span>KOSÁR</span><strong>{cartCount} tétel</strong></div>
                  {cart.length > 0 && <button type="button" onClick={() => saveCart([])}>Ürítés</button>}
                </div>

                {cart.length === 0 ? (
                  <div className="shop-modern__mini-cart-empty">
                    <span>🛍</span>
                    <strong>Még üres</strong>
                    <p>A kiválasztott termékek itt jelennek meg.</p>
                  </div>
                ) : (
                  <div className="shop-modern__mini-cart-items">
                    {cart.slice(0, 4).map((item) => {
                      const itemPrice = priceInfo(item.product).effective;
                      return (
                        <div key={item.product.id} className="shop-modern__mini-cart-item">
                          <div><strong>{item.product.name}</strong><small>{money(itemPrice)} / db</small></div>
                          <div className="shop-modern__qty">
                            <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity - 1)}>−</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => changeQuantity(item.product.id, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                      );
                    })}
                    {cart.length > 4 && <Link to="/cart" className="shop-modern__more-items">+ {cart.length - 4} további termék</Link>}
                  </div>
                )}

                <div className="shop-modern__coupon">
                  <label htmlFor="shop-coupon">Kuponkód</label>
                  <div>
                    <input
                      id="shop-coupon"
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                      placeholder="pl. KLEO10"
                    />
                    <button type="button" onClick={applyCoupon} disabled={couponLoading || !cart.length}>
                      {couponLoading ? "…" : "OK"}
                    </button>
                  </div>
                  {couponMessage && <small className="is-success">✓ {couponMessage}</small>}
                  {couponError && <small className="is-error">{couponError}</small>}
                </div>

                <div className="shop-modern__totals">
                  <div><span>Részösszeg</span><b>{money(subtotal)}</b></div>
                  {couponDiscount > 0 && <div className="is-discount"><span>Kedvezmény {couponCode ? `(${couponCode})` : ""}</span><b>−{money(couponDiscount)}</b></div>}
                  <div className="shop-modern__grand-total"><span>Fizetendő</span><strong>{money(total)}</strong></div>
                </div>

                <Link
                  to="/checkout"
                  className={cart.length ? "shop-modern__checkout" : "shop-modern__checkout is-disabled"}
                  aria-disabled={!cart.length}
                  onClick={(event) => { if (!cart.length) event.preventDefault(); }}
                >
                  Tovább a pénztárhoz <span>→</span>
                </Link>
                <small className="shop-modern__checkout-note">Regisztráció nélkül is véglegesítheted a rendelést.</small>
              </aside>
            </div>
          )}
        </div>
      </section>

      <section className="shop-modern__info-section">
        <div className="container">
          <div className="shop-modern__info-grid">
            <article><span>01</span><h3>Ajándékozás egyszerűen</h3><p>Válassz utalványt vagy szépségcsomagot, majd add meg a rendelésnél a szükséges adatokat és megjegyzést.</p></article>
            <article><span>02</span><h3>Akciók és kuponok</h3><p>A kuponkódot már a kosárban ellenőrizheted; a szerver a checkout során ismét validálja a kedvezményt.</p></article>
            <article><span>03</span><h3>Átlátható végösszeg</h3><p>A kosár minden módosítás után újraszámol, az akciós árakat és a kuponkedvezményt külön mutatja.</p></article>
          </div>
          <div className="shop-modern__faq">
            <details><summary>Hogyan használhatom a kuponkódot?</summary><p>Add meg a kódot a kosár összesítőjében vagy a pénztár oldalon. Az érvényességet a webshop API ellenőrzi.</p></details>
            <details><summary>Kell fiókot létrehoznom?</summary><p>Nem. A checkout vendégként is használható; csak a rendelés teljesítéséhez szükséges adatokat kérjük.</p></details>
            <details><summary>Hol tudom módosítani a kosarat?</summary><p>A webshop jobb oldali gyors-kosarában vagy a külön Kosár oldalon is változtathatod a mennyiségeket.</p></details>
          </div>
        </div>
      </section>

      {toast && <div className="shop-modern__toast" role="status">✓ {toast}</div>}
      {cartCount > 0 && (
        <Link to="/cart" className="shop-modern__mobile-cart">
          <span>Kosár · {cartCount} tétel</span><strong>{money(subtotal)}</strong><b>→</b>
        </Link>
      )}
    </main>
  );
};

export default WebshopPage;
