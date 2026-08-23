import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../apiClient";
import "../styles/webshop-modern.css";

type Product = {
  id: string;
  name: string;
  retail_price_gross: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  web_description?: string | null;
  main_category?: string | null;
};

type ProductReview = {
  id: string;
  product_id: string;
  rating: number;
  text: string;
  author_name: string | null;
  created_at: string;
};

type CartItem = { product: Product; quantity: number };

const toNumber = (value: number | string | null | undefined) => {
  if (value == null || value === "") return 0;
  const parsed = typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const priceInfo = (product: Product) => {
  const retail = toNumber(product.retail_price_gross);
  const sale = toNumber(product.sale_price);
  const isDiscounted = sale > 0 && retail > 0 && sale < retail;
  const effective = sale > 0 && (retail <= 0 || sale < retail) ? sale : retail;
  return {
    retail,
    effective,
    isDiscounted,
    discount: isDiscounted ? Math.round(((retail - sale) / retail) * 100) : 0,
  };
};

const money = (value: number) => `${Math.round(value).toLocaleString("hu-HU")} Ft`;

const buildImageUrl = (value?: string | null) => {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE}/${value.replace(/^\/+/, "")}`;
};

export const WebshopProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { product?: Product } | null;

  const [product, setProduct] = useState<Product | null>(state?.product ?? null);
  const [productLoading, setProductLoading] = useState(!state?.product);
  const [productError, setProductError] = useState("");
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    if (!productId || state?.product) return;
    const controller = new AbortController();
    const load = async () => {
      setProductLoading(true);
      setProductError("");
      try {
        const response = await fetch(`${API_BASE}/api/public/webshop/products/${productId}`, {
          signal: controller.signal,
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setProduct((await response.json()) as Product);
      } catch (err: any) {
        if (err?.name !== "AbortError") setProductError("Nem sikerült betölteni a termék adatait.");
      } finally {
        setProductLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [productId, state?.product]);

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();
    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");
      try {
        const response = await fetch(`${API_BASE}/api/public/webshop/products/${productId}/reviews`, {
          signal: controller.signal,
          credentials: "include",
        });
        if (response.status === 404) {
          setReviews([]);
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") setReviewsError("Nem sikerült betölteni a véleményeket.");
      } finally {
        setReviewsLoading(false);
      }
    };
    void loadReviews();
    return () => controller.abort();
  }, [productId]);

  const averageRating = useMemo(
    () => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null,
    [reviews]
  );

  const persistProductToCart = () => {
    if (!product) return false;
    try {
      const raw = localStorage.getItem("kleoCart");
      const cart: CartItem[] = raw ? JSON.parse(raw) : [];
      const existing = cart.find((item) => item.product.id === product.id);
      const next = existing
        ? cart.map((item) => item.product.id === product.id ? { ...item, product, quantity: item.quantity + 1 } : item)
        : [...cart, { product, quantity: 1 }];
      localStorage.setItem("kleoCart", JSON.stringify(next));
      window.dispatchEvent(new Event("kleo-cart-updated"));
      return true;
    } catch {
      return false;
    }
  };

  const addToCart = () => {
    if (persistProductToCart()) {
      setCartMessage("A termék a kosárba került.");
      window.setTimeout(() => setCartMessage(""), 2200);
    } else {
      setCartMessage("A kosár frissítése nem sikerült.");
    }
  };

  const buyNow = () => {
    if (!product || priceInfo(product).effective <= 0) return;
    if (!persistProductToCart()) {
      setCartMessage("A kosár frissítése nem sikerült.");
      return;
    }
    navigate("/checkout");
  };

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productId || !reviewText.trim()) return;
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const response = await fetch(`${API_BASE}/api/public/webshop/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          rating,
          text: reviewText.trim(),
          authorName: authorName.trim() || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || data?.message || "Nem sikerült elmenteni a véleményt.");
      setReviews((previous) => [data as ProductReview, ...previous]);
      setRating(5);
      setAuthorName("");
      setReviewText("");
    } catch (err: any) {
      setSubmitError(err?.message || "Nem sikerült elmenteni a véleményt.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (productLoading) {
    return <main className="kleo-shop-page"><div className="kleo-shop-shell"><div className="kleo-shop-card kleo-shop-empty"><p>Termék betöltése…</p></div></div></main>;
  }

  if (!product) {
    return (
      <main className="kleo-shop-page">
        <div className="kleo-shop-shell">
          <section className="kleo-shop-card kleo-shop-empty">
            <h2>Nem található ez a termék</h2>
            <p>{productError || "A termék már nem érhető el a webshopban."}</p>
            <Link className="kleo-shop-primary" style={{ maxWidth: 250, marginInline: "auto" }} to="/webshop">Vissza a webshophoz</Link>
          </section>
        </div>
      </main>
    );
  }

  const image = buildImageUrl(product.image_url || product.thumbnail_url);
  const price = priceInfo(product);

  return (
    <main className="kleo-shop-page">
      <div className="kleo-shop-shell">
        <nav className="kleo-shop-breadcrumbs" aria-label="Morzsamenü">
          <Link to="/webshop">Kleoshop</Link><span>›</span><strong>{product.name}</strong>
        </nav>

        <section className="kleo-product-layout">
          <div className="kleo-product-media">
            {image ? <img src={image} alt={product.name} /> : <span>KLEO</span>}
          </div>
          <div className="kleo-product-copy">
            <span>{product.main_category || "KLEOSHOP TERMÉK"}</span>
            <h1>{product.name}</h1>
            {averageRating !== null && (
              <p style={{ margin: "12px 0 0", color: "#6f6870", fontSize: 12 }}>
                <b style={{ color: "#e19a00" }}>{"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}</b>
                {" "}{averageRating.toFixed(1)} / 5 · {reviews.length} vélemény
              </p>
            )}
            {product.web_description && <p>{product.web_description}</p>}
            <div className="kleo-product-price">
              {price.isDiscounted && <del>{money(price.retail)}</del>}
              <strong>{price.effective > 0 ? money(price.effective) : "Ár hamarosan"}</strong>
              {price.isDiscounted && <span>−{price.discount}%</span>}
            </div>
            <div className="kleo-product-actions">
              <button type="button" onClick={addToCart} disabled={price.effective <= 0}>＋ Kosárba teszem</button>
              <button type="button" className="kleo-shop-primary" onClick={buyNow} disabled={price.effective <= 0}>Vásárlás most →</button>
              <Link to="/webshop">← Vissza a kínálathoz</Link>
            </div>
            {cartMessage && <div className="kleo-shop-message kleo-shop-message--ok" style={{ marginTop: 12 }}>{cartMessage}</div>}
            <div className="kleo-product-benefits">
              <div><strong>Gyors vásárlás</strong><small>Egy termékkel közvetlenül a pénztárra léphetsz.</small></div>
              <div><strong>Kupon használható</strong><small>A pénztár a kódot szerveroldalon ellenőrzi.</small></div>
              <div><strong>Átlátható ár</strong><small>Az akciós és eredeti ár külön jelenik meg.</small></div>
            </div>
          </div>
        </section>

        <section className="kleo-shop-card kleo-reviews">
          <h2>Vásárlói vélemények</h2>
          {reviewsLoading && <p>Vélemények betöltése…</p>}
          {reviewsError && <div className="kleo-shop-message kleo-shop-message--error">{reviewsError}</div>}
          {!reviewsLoading && !reviewsError && reviews.length === 0 && <p>Még nem érkezett vélemény ehhez a termékhez.</p>}
          {reviews.length > 0 && (
            <ul className="kleo-review-list">
              {reviews.map((review) => (
                <li className="kleo-review" key={review.id}>
                  <div className="kleo-review__meta">
                    <span className="kleo-review__stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                    <strong>{review.author_name || "Vendég"}</strong>
                    <span>{new Date(review.created_at).toLocaleDateString("hu-HU")}</span>
                  </div>
                  <p>{review.text}</p>
                </li>
              ))}
            </ul>
          )}

          <form className="kleo-review-form" onSubmit={submitReview}>
            <h3>Értékeld ezt a terméket</h3>
            <div className="kleo-field-grid">
              <label className="kleo-field">
                <span>Név (opcionális)</span>
                <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
              </label>
              <div className="kleo-field">
                <span>Értékelés</span>
                <div className="kleo-rating-buttons" aria-label="Csillagos értékelés">
                  {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= rating ? "is-active" : ""}
                      onClick={() => setRating(star)}
                      aria-label={`${star} csillag`}
                    >★</button>
                  ))}
                </div>
              </div>
            </div>
            <label className="kleo-field">
              <span>Vélemény *</span>
              <textarea rows={4} value={reviewText} onChange={(event) => setReviewText(event.target.value)} required />
            </label>
            {submitError && <div className="kleo-shop-message kleo-shop-message--error">{submitError}</div>}
            <button className="kleo-shop-primary" type="submit" style={{ maxWidth: 230 }} disabled={submitLoading}>
              {submitLoading ? "Küldés…" : "Vélemény elküldése"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default WebshopProductDetailPage;
