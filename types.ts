
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number; // Giá vốn (Chỉ hiện trong Admin)
  category: string;
  condition?: string; // MỚI: Tình trạng hàng (Hàng mới / Hàng cũ)
  description: string;
  specs?: string; // Thông số kỹ thuật
  warrantyPeriod?: string; // Thời gian bảo hành
  image: string;
  stock: number; // Số lượng tồn kho
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'completed';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus; 
  createdAt: number;
}

export interface Customer {
    id: string; // Dùng SĐT làm ID
    name: string;
    phone: string;
    address: string;
    totalSpent: number; 
    orderCount: number; 
    lastOrderDate: number;
    history: Order[]; 
}

// Tài khoản đăng nhập của khách hàng
export interface CustomerAccount {
  phone: string; // Dùng làm ID đăng nhập
  password: string;
  name: string;
  address: string;
  createdAt: number;
}

export enum ViewState {
  SHOP = 'SHOP',
  ADMIN = 'ADMIN',
  CART = 'CART',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CUSTOMER_HISTORY = 'CUSTOMER_HISTORY'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
