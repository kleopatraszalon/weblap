export type KioskService = {
  id: string;
  name: string;
  base_price: number | null;
  duration_minutes: number | null;
  category_id: string;
  category_name: string;
};

export type KioskCategory = {
  id: string;
  name: string;
  image_path: string | null;
};

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  meta?: Record<string, any>;
};
