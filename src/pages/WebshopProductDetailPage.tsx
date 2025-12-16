// src/pages/WebshopProductDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

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
  sku?: string | null;
  name: string;
  retail_price_gross: number | string | null;
  sale_price?: number | string | null;
  image_url?: string | null;
  web_description?: string | null;
  is_retail?: boolean | null;
  web_is_visible?: boolean | null;
  main_category?: MainCategoryKey | string | null;
  sub_category?: SubCategoryKey | string | null;
  service_category?: ServiceCategoryKey | string | null;
};

type ProductReview = {
  id: string;
  product_id: string;
  rating: number;
  text: string;
  author_name: string | null;
  created_at: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

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

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Kosár mentése sikertelen", e);
  }
}

function dispatchCartUpdate(cart: CartItem[]) {
  const event = new CustomEvent<CartItem[]>(CART_EVENT_NAME, {
    detail: cart,
  });
  window.dispatchEvent(event);
}

export const WebshopProductDetailPage: React.FC = () => {
  const { t, lang } = useI18n();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { product?: Product } | null;

  const [product, setProduct] = useState<Product | null>(
    state?.product ?? null
  );
  const [productLoading, setProductLoading] = useState(!state?.product);
  const [productError, setProductError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState<string>("");
  const [text, setText] = useState<string>("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [addToCartMessage, setAddToCartMessage] = useState<string | null>(null);

  // Termék betöltése, ha nem érkezett state-ben
  useEffect(() => {
    if (!productId || state?.product) return;

    const load = async () => {
      setProductLoading(true);
      setProductError(null);
      try {
        const res = await fetch(
          `${API_BASE}/public/webshop/products/${productId}?lang=${lang}`
        );
        if (!res.ok) {
          throw new Error(`Hiba a termék betöltésekor (${res.status})`);
        }
        const data = (await res.json()) as Product;
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProductError(t("webshop.detail.productError"));
      } finally {
        setProductLoading(false);
      }
    };

    load();
  }, [productId, state?.product, t]);

  // Vélemények betöltése az adatbázisból
  useEffect(() => {
    if (!productId) return;

    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await fetch(
          `${API_BASE}/public/webshop/products/${productId}/reviews`
        );

        if (res.status === 404) {
          setReviews([]);
          return;
        }

        if (!res.ok) {
          throw new Error(`Hiba a vélemények betöltésekor (${res.status})`);
        }

        const data = (await res.json()) as ProductReview[];
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setReviewsError(t("webshop.detail.reviewsError"));
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [productId, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch(
        `${API_BASE}/public/webshop/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating,
            text: trimmed,
            authorName: authorName.trim() || null,
          }),
        }
      );

      if (res.status === 404) {
        throw new Error(
          "A vélemények beküldése jelenleg nincs engedélyezve ezen a szerveren (404)."
        );
      }

      if (!res.ok) {
        let msg = "Nem sikerült elmenteni a véleményt.";
        try {
          const data = await res.json();
          if (data && (data.error || data.message)) {
            msg = data.error || data.message;
          }
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const created = (await res.json()) as ProductReview;
      setReviews((prev) => [created, ...prev]);
      setRating(5);
      setAuthorName("");
      setText("");
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || "Nem sikerült elmenteni a véleményt.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const safeQty = quantity > 0 ? quantity : 1;

    const current = loadCartFromStorage();
    const existing = current.find((item) => item.product.id === product.id);

    let next: CartItem[];
    if (existing) {
      next = current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + safeQty }
          : item
      );
    } else {
      next = [...current, { product, quantity: safeQty }];
    }

    saveCartToStorage(next);
    dispatchCartUpdate(next);

    setAddToCartMessage("Termék hozzáadva a kosárhoz.");
    setTimeout(() => setAddToCartMessage(null), 3000);
  };

  if (!product && productLoading) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <p>Termék betöltése…</p>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <section className="section">
          <div className="container">
            <p>Nem található ez a termék.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/webshop")}
            >
              Vissza a webshophoz
            </button>
          </div>
        </section>
      </main>
    );
  }

  const imageSrc = buildImageUrl(product.image_url);
  const rawPrice = product.sale_price ?? product.retail_price_gross ?? 0;
  const numericPrice =
    typeof rawPrice === "string"
      ? parseFloat(rawPrice.replace(",", "."))
      : rawPrice ?? 0;
  const formattedPrice =
    !numericPrice || Number.isNaN(numericPrice)
      ? ""
      : `${numericPrice.toLocaleString("hu-HU")} Ft`;

  const averageRating =
    reviews.length === 0
      ? null
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <main className="page">
      <section className="section">
        <div className="container webshop-product-detail">
          <div className="webshop-product-detail__top">
            {/* BAL: TERMÉKKÉP + KIS GALÉRIA-HELY */}
            <div className="webshop-product-detail__image">
              {imageSrc ? (
                <img src={imageSrc} alt={product.name} />
              ) : (
                <div className="webshop-product-detail__image--placeholder">
                  {t("webshop.detail.noImage")}
                </div>
              )}
            </div>

            {/* JOBB: CÍM, LEÍRÁS, ÁR, KOSÁRBA */}
            <div className="webshop-product-detail__info">
              <p className="section-eyebrow">
                <Link to="/webshop">
                  {t("webshop.detail.breadcrumb")}
                </Link>
              </p>
              <h1 className="hero-title hero-title--tight">
                {product.name}
              </h1>

              {product.web_description && (
                <p className="hero-lead hero-lead--narrow">
                  {product.web_description}
                </p>
              )}

              {formattedPrice && (
                <p className="webshop-product-detail__price">{formattedPrice}</p>
              )}

              {averageRating !== null && (
                <div className="webshop-product-detail__rating-summary">
                  <span className="webshop-product-detail__rating-stars">
                    {Array.from({ length: 5 }, (_, i) => {
                      const star = i + 1;
                      return (
                        <span
                          key={star}
                          className={
                            star <= Math.round(averageRating)
                              ? "star star--filled"
                              : "star"
                          }
                        >
                          {star <= Math.round(averageRating) ? "★" : "☆"}
                        </span>
                      );
                    })}
                  </span>
                  <span className="webshop-product-detail__rating-text">
                    {averageRating.toFixed(1)} / 5 · {reviews.length}{" "}
                    {t("webshop.detail.reviewsCountLabel")}
                  </span>
                </div>
              )}

              {/* Mennyiség + Kosárba, mint a GymBeam termékoldalon */}
              <div className="webshop-product-detail__purchase">
                <div className="quantity-control">
                  <span className="quantity-control__label">Mennyiség</span>
                  <div className="quantity-control__buttons">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => (q > 1 ? q - 1 : 1))
                      }
                    >
                      -
                    </button>
                    <span className="quantity-control__value">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-primary--magenta btn--shine webshop-product-detail__addtocart"
                  onClick={handleAddToCart}
                >
                  {t("webshop.list.addToCart")}
                </button>
              </div>

              {addToCartMessage && (
                <p className="webshop-status webshop-status--success">
                  {addToCartMessage}
                </p>
              )}

              <div className="webshop-product-detail__actions">
                <Link to="/webshop" className="btn btn-secondary">
                  Vissza a webshophoz
                </Link>
              </div>
            </div>
          </div>

          {/* „Részletek” blokk – egyszerű specifikációs táblázat */}
          <div className="webshop-product-detail__spec">
            <h2>Termék részletei</h2>
            <table className="webshop-product-detail__spec-table">
              <tbody>
                {product.sku && (
                  <tr>
                    <th>SKU</th>
                    <td>{product.sku}</td>
                  </tr>
                )}
                {formattedPrice && (
                  <tr>
                    <th>Bruttó ár</th>
                    <td>{formattedPrice}</td>
                  </tr>
                )}
                {product.main_category && (
                  <tr>
                    <th>Főkategória</th>
                    <td>{String(product.main_category)}</td>
                  </tr>
                )}
                {product.sub_category && (
                  <tr>
                    <th>Alkategória</th>
                    <td>{String(product.sub_category)}</td>
                  </tr>
                )}
                {product.service_category && (
                  <tr>
                    <th>Szolgáltatás kategória</th>
                    <td>{String(product.service_category)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VÉLEMÉNYEK, mint eddig, csak a „GymBeam-szerű” layout alatt */}
          <div className="webshop-product-detail__reviews">
            <h2>{t("webshop.detail.reviewsTitle")}</h2>

            {reviewsLoading && <p>{t("webshop.detail.reviewsLoading")}</p>}
            {reviewsError && (
              <p className="webshop-status webshop-status--error">
                {reviewsError}
              </p>
            )}

            {!reviewsLoading && reviews.length === 0 && !reviewsError && (
              <p>{t("webshop.detail.reviewsEmpty")}</p>
            )}

            {reviews.length > 0 && (
              <ul className="webshop-review-list">
                {reviews.map((review) => (
                  <li key={review.id} className="webshop-review">
                    <div className="webshop-review__header">
                      <div className="webshop-review__rating">
                        {Array.from({ length: 5 }, (_, i) => {
                          const star = i + 1;
                          const filled = star <= review.rating;
                          return (
                            <span
                              key={star}
                              className={filled ? "star star--filled" : "star"}
                            >
                              {filled ? "★" : "☆"}
                            </span>
                          );
                        })}
                      </div>
                      <span className="webshop-review__author">
                        {review.author_name || t("webshop.detail.guestName")}
                      </span>
                      <span className="webshop-review__date">
                        {new Date(review.created_at).toLocaleDateString(
                          lang === "hu"
                            ? "hu-HU"
                            : lang === "en"
                            ? "en-GB"
                            : "ru-RU"
                        )}
                      </span>
                    </div>
                    <p className="webshop-review__text">{review.text}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="webshop-review-form">
              <h3>{t("webshop.detail.reviewFormTitle")}</h3>

              {submitError && (
                <p className="webshop-status webshop-status--error">
                  {submitError}
                </p>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label htmlFor="review-author">
                    {t("webshop.detail.nameLabel")}
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={t("webshop.detail.namePlaceholder")}
                  />
                </div>

                <div className="form-row">
                  <span>{t("webshop.detail.ratingLabel")}</span>
                  <div className="rating-input">
                    {Array.from({ length: 5 }, (_, i) => {
                      const star = i + 1;
                      const filled = star <= rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          className={
                            filled
                              ? "star star--interactive star--filled"
                              : "star star--interactive"
                          }
                          onClick={() => setRating(star)}
                          aria-label={`${star} csillag`}
                        >
                          {filled ? "★" : "☆"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="review-text">
                    {t("webshop.detail.textLabel")}
                  </label>
                  <textarea
                    id="review-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    required
                    placeholder={t("webshop.detail.textPlaceholder")}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-primary--magenta"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? t("webshop.detail.submitLoading")
                    : t("webshop.detail.submitLabel")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WebshopProductDetailPage;
