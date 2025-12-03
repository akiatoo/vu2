
import { Product, CartItem, Order, Customer, CustomerAccount } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './seed';

const DB_KEYS = {
  PRODUCTS: 'shop_products_db_v8',  // Bump version to v8 for 'condition' field
  CART: 'shop_cart_db_v3',
  CATEGORIES: 'shop_categories_db_v1',
  ORDERS: 'shop_orders_db_v3', 
  CUSTOMERS: 'shop_customers_db_v1',
  AUTH: 'shop_auth_db_v1',
  CUSTOMER_ACCOUNTS: 'shop_customer_accounts_v1', 
};

// Default Admin Credentials
const DEFAULT_AUTH = {
    username: 'admin',
    password: '123456'
};

// Recovery Key
export const RECOVERY_KEY = "SHOP_RECOVERY_2024";

// Initialize DB if empty
const initDB = () => {
  const products = localStorage.getItem(DB_KEYS.PRODUCTS);
  if (!products) {
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  const categories = localStorage.getItem(DB_KEYS.CATEGORIES);
  if (!categories) {
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }

  const customers = localStorage.getItem(DB_KEYS.CUSTOMERS);
  if (!customers) {
      localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify([]));
  }
  
  // Init Customer Accounts
  const customerAccounts = localStorage.getItem(DB_KEYS.CUSTOMER_ACCOUNTS);
  if (!customerAccounts) {
      localStorage.setItem(DB_KEYS.CUSTOMER_ACCOUNTS, JSON.stringify([]));
  }

  // Init Auth
  const auth = localStorage.getItem(DB_KEYS.AUTH);
  if (!auth) {
      localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH));
  }
};

initDB();

export const database = {
  // --- Products ---
  getProducts: (): Product[] => {
    const data = localStorage.getItem(DB_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  getProductById: (id: string): Product | undefined => {
    const products = database.getProducts();
    return products.find(p => p.id === id);
  },

  addProduct: (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const products = database.getProducts();
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    const updatedProducts = [newProduct, ...products];
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    return newProduct;
  },

  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): void => {
    const products = database.getProducts();
    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
  },

  deleteProduct: (id: string): void => {
    const products = database.getProducts();
    const updatedProducts = products.filter((p) => p.id !== id);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
  },

  // --- Inventory & Checkout ---
  processCheckout: (cartItems: CartItem[], customerInfo: { name: string, phone: string, address: string }): Order | null => {
    const products = database.getProducts();
    
    // 1. Check stock
    for (const item of cartItems) {
        const productInDb = products.find(p => p.id === item.id);
        if (!productInDb || productInDb.stock < item.quantity) {
            return null; 
        }
    }

    // 2. Reduce stock
    const updatedProducts = products.map(p => {
        const cartItem = cartItems.find(c => c.id === p.id);
        if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedProducts));

    // 3. Create Order
    const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        shippingAddress: customerInfo.address,
        items: cartItems,
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending', 
        createdAt: Date.now(),
    };

    const currentOrders = database.getOrders();
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([newOrder, ...currentOrders]));

    return newOrder;
  },

  // --- Orders ---
  getOrders: (): Order[] => {
      const data = localStorage.getItem(DB_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
  },

  // --- Customers (History) ---
  getCustomers: (): Customer[] => {
      const data = localStorage.getItem(DB_KEYS.CUSTOMERS);
      const customers: Customer[] = data ? JSON.parse(data) : [];
      return customers.sort((a, b) => b.lastOrderDate - a.lastOrderDate);
  },

  // NEW: Get combined history for a logged-in user
  getCustomerHistory: (phone: string): Order[] => {
      // 1. Get Pending orders
      const allOrders = database.getOrders();
      const pendingOrders = allOrders.filter(o => o.customerPhone === phone);

      // 2. Get Completed orders (from Customer record)
      const allCustomers = database.getCustomers();
      // Use logic to find customer by phone (id is phone)
      const customerRecord = allCustomers.find(c => c.phone === phone || c.id === phone);
      const completedOrders = customerRecord ? customerRecord.history : [];

      // 3. Combine and Sort
      return [...pendingOrders, ...completedOrders].sort((a, b) => b.createdAt - a.createdAt);
  },

  confirmOrder: (orderId: string): void => {
    const orders = database.getOrders();
    const orderToConfirm = orders.find(o => o.id === orderId);
    
    if (!orderToConfirm) return;

    const completedOrder: Order = { ...orderToConfirm, status: 'completed' };
    const customers = database.getCustomers();
    const phoneId = completedOrder.customerPhone.replace(/\s/g, '');
    
    let customer = customers.find(c => c.id === phoneId);

    if (!customer) {
        customer = {
            id: phoneId,
            name: completedOrder.customerName,
            phone: completedOrder.customerPhone,
            address: completedOrder.shippingAddress,
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: 0,
            history: []
        };
        customers.push(customer);
    }

    customer.totalSpent += completedOrder.totalAmount;
    customer.orderCount += 1;
    customer.history.unshift(completedOrder);
    
    if (completedOrder.createdAt > customer.lastOrderDate) {
        customer.lastOrderDate = completedOrder.createdAt;
        customer.name = completedOrder.customerName;
        customer.address = completedOrder.shippingAddress;
    }

    localStorage.setItem(DB_KEYS.CUSTOMERS, JSON.stringify(customers));

    const remainingOrders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(remainingOrders));
  },

  cancelOrder: (orderId: string): void => {
    const orders = database.getOrders();
    const orderToCancel = orders.find(o => o.id === orderId);

    if (!orderToCancel) return;

    const products = database.getProducts();
    const updatedProducts = products.map(p => {
        const itemInOrder = orderToCancel.items.find(item => item.id === p.id);
        if (itemInOrder) {
            return { ...p, stock: p.stock + itemInOrder.quantity };
        }
        return p;
    });
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(updatedProducts));

    const updatedOrders = orders.filter(o => o.id !== orderId);
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(updatedOrders));
  },

  // --- CUSTOMER ACCOUNTS (Authentication) ---
  customerRegister: (info: Omit<CustomerAccount, 'createdAt'>): { success: boolean, message: string } => {
      const accounts: CustomerAccount[] = JSON.parse(localStorage.getItem(DB_KEYS.CUSTOMER_ACCOUNTS) || '[]');
      
      if (accounts.find(acc => acc.phone === info.phone)) {
          return { success: false, message: 'Số điện thoại này đã được đăng ký.' };
      }

      const newAccount: CustomerAccount = {
          ...info,
          createdAt: Date.now()
      };

      accounts.push(newAccount);
      localStorage.setItem(DB_KEYS.CUSTOMER_ACCOUNTS, JSON.stringify(accounts));
      return { success: true, message: 'Đăng ký thành công!' };
  },

  customerLogin: (phone: string, pass: string): { success: boolean, account?: CustomerAccount, message: string } => {
      const accounts: CustomerAccount[] = JSON.parse(localStorage.getItem(DB_KEYS.CUSTOMER_ACCOUNTS) || '[]');
      const account = accounts.find(acc => acc.phone === phone && acc.password === pass);

      if (account) {
          // Trả về tài khoản nếu đăng nhập thành công
          return { success: true, account: account, message: 'Đăng nhập thành công' };
      }

      return { success: false, message: 'Số điện thoại hoặc mật khẩu không đúng.' };
  },

  // --- Categories ---
  getCategories: (): string[] => {
    const data = localStorage.getItem(DB_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },

  addCategory: (category: string): boolean => {
    const categories = database.getCategories();
    if (categories.includes(category)) return false; 
    
    const newCategories = [...categories, category];
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(newCategories));
    return true;
  },

  deleteCategory: (category: string): void => {
    const categories = database.getCategories();
    const newCategories = categories.filter(c => c !== category);
    localStorage.setItem(DB_KEYS.CATEGORIES, JSON.stringify(newCategories));
  },

  // --- Cart ---
  getCart: (): CartItem[] => {
    const data = localStorage.getItem(DB_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  saveCart: (cart: CartItem[]): void => {
    localStorage.setItem(DB_KEYS.CART, JSON.stringify(cart));
  },
  
  clearCart: (): void => {
      localStorage.removeItem(DB_KEYS.CART);
  },

  // --- ADMIN AUTH ---
  checkLogin: (username: string, password: string): boolean => {
      const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || JSON.stringify(DEFAULT_AUTH));
      return authData.username === username && authData.password === password;
  },

  changePassword: (newPassword: string): void => {
      const authData = JSON.parse(localStorage.getItem(DB_KEYS.AUTH) || JSON.stringify(DEFAULT_AUTH));
      authData.password = newPassword;
      localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(authData));
  },

  resetPassword: (): void => {
      localStorage.setItem(DB_KEYS.AUTH, JSON.stringify(DEFAULT_AUTH));
  }
};
