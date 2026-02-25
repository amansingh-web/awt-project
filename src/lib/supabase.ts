import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
};
