export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  ingredients?: string;
  brand: string;
  price: number;
  category_id: string;
  categories?: Category;
  images: string[];
  stock: number;
  rating: number;
  created_at?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  products?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  created_at: string;
  order_items?: OrderItem[];
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  users?: { id: string; name: string };
}

export interface WishlistItem {
  id: string;
  product_id: string;
  products?: Product;
}
