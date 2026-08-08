export type KioskService = {
  id: string;
  name: string;
  name_hu?: string | null;
  name_en?: string | null;
  name_ru?: string | null;
  description?: string | null;
  list_price?: number | null;
  base_price: number | null;
  duration_minutes: number | null;
  category_id: string | number | null;
  category_name: string | null;
  category_name_hu?: string | null;
  category_name_en?: string | null;
  category_name_ru?: string | null;
  category_subtitle?: string | null;
  category_image?: string | null;
  image_url?: string | null;
  badge_text?: string | null;
  featured?: boolean;
};

export type KioskCategory = {
  id: string;
  name: string;
  subtitle?: string | null;
  image_path: string | null;
  type?: "service" | "product";
};

export type KioskProduct = {
  id: string;
  name: string;
  name_hu?: string | null;
  name_en?: string | null;
  name_ru?: string | null;
  retail_price_gross?: number | null;
  sale_price?: number | null;
  image_url?: string | null;
  web_description?: string | null;
  main_category?: string | null;
  sub_category?: string | null;
  service_category?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_subtitle?: string | null;
  category_image?: string | null;
  badge_text?: string | null;
  featured?: boolean;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  meta?: Record<string, any>;
};
