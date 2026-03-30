export type KioskService = {
  id: string;
  name: string;
  name_hu?: string | null;
  name_en?: string | null;
  name_ru?: string | null;
  base_price: number | null;
  list_price?: number | null;
  duration_minutes: number | null;
  category_id: string;
  category_name: string;
  category_name_hu?: string | null;
  category_name_en?: string | null;
  category_name_ru?: string | null;
};

export type KioskCategory = {
  id: string;
  name: string;
  image_path: string | null;
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
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  meta?: Record<string, any>;
};
