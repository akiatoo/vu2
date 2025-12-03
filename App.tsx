
import React, { useState, useEffect } from 'react';
import { ViewState, Product, CartItem, CustomerAccount, Order } from './types';
import { database } from './database';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { CartView } from './components/CartView';
import { ProductDetail } from './components/ProductDetail';
import { CustomerHistory } from './components/CustomerHistory';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { sendOrderToZalo } from './services/zaloService';
import { Search, Filter, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SHOP);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Auth States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Customer Auth
  const [currentUser, setCurrentUser] = useState<CustomerAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
    setCart(database.getCart());
  }, []);

  const refreshData = () => {
    setProducts(database.getProducts());
    setCategories(database.getCategories());
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      
      const currentQtyInCart = existing ? existing.quantity : 0;
      if (currentQtyInCart + 1 > product.stock) {
          alert(`Sản phẩm này chỉ còn ${product.stock} chiếc trong kho!`);
          return prev;
      }

      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      database.saveCart(newCart);
      return newCart;
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const itemToUpdate = prev.find(item => item.id === id);
      const productInfo = products.find(p => p.id === id);

      if (itemToUpdate && productInfo) {
          if (delta > 0 && itemToUpdate.quantity + delta > productInfo.stock) {
              alert(`Kho chỉ còn ${productInfo.stock} sản phẩm này.`);
              return prev; 
          }
      }

      const newCart = prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
      database.saveCart(newCart);
      return newCart;
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      database.saveCart(newCart);
      return newCart;
    });
  };

  const handleReorder = (order: Order) => {
      const currentProducts = database.getProducts();
      let addedCount = 0;
      let outOfStockCount = 0;
      
      // Clone cart để xử lý
      let nextCart = [...cart];

      order.items.forEach(orderItem => {
          // Tìm sản phẩm hiện tại trong kho (để lấy giá và stock mới nhất)
          const liveProduct = currentProducts.find(p => p.id === orderItem.id);
          
          if (liveProduct && liveProduct.stock > 0) {
              // Tìm xem đã có trong giỏ hàng chưa
              const existingCartItemIndex = nextCart.findIndex(item => item.id === liveProduct.id);
              
              if (existingCartItemIndex > -1) {
                  // Đã có trong giỏ -> Cộng dồn số lượng
                  // Cần check stock tổng thể
                  const currentQty = nextCart[existingCartItemIndex].quantity;
                  const newQty = Math.min(currentQty + orderItem.quantity, liveProduct.stock);
                  
                  nextCart[existingCartItemIndex] = {
                      ...liveProduct, // Update giá/ảnh mới nhất
                      quantity: newQty
                  };
              } else {
                  // Chưa có -> Thêm mới
                  const quantityToAdd = Math.min(orderItem.quantity, liveProduct.stock);
                  nextCart.push({
                      ...liveProduct,
                      quantity: quantityToAdd
                  });
              }
              addedCount++;
          } else {
              outOfStockCount++;
          }
      });

      if (addedCount > 0) {
          setCart(nextCart);
          database.saveCart(nextCart);
          
          let message = "Đã thêm sản phẩm vào giỏ hàng!";
          if (outOfStockCount > 0) {
              message += `\n(${outOfStockCount} sản phẩm đã hết hàng hoặc ngừng kinh doanh)`;
          }
          
          alert(message);
          setView(ViewState.CART);
      } else {
          alert("Rất tiếc, tất cả sản phẩm trong đơn này đều đã hết hàng.");
      }
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  const handleFinalizeCheckout = async (customerInfo: { name: string, phone: string, address: string }) => {
    const newOrder = database.processCheckout(cart, customerInfo);

    if (newOrder) {
        setCart([]);
        database.clearCart();
        refreshData(); 
        setIsCheckoutModalOpen(false);
        setView(ViewState.SHOP);

        const shouldSendZalo = confirm(
            `Đặt hàng thành công!\n\nBạn có muốn gửi chi tiết đơn hàng qua Zalo cho Shop không?\n(Nội dung đơn hàng sẽ được TỰ ĐỘNG COPY, bạn chỉ cần bấm DÁN vào ô chat)`
        );

        if (shouldSendZalo) {
            await sendOrderToZalo(newOrder);
        } else {
            alert('Cảm ơn bạn đã mua hàng!');
        }

    } else {
        alert('Có lỗi xảy ra: Một số sản phẩm đã hết hàng trong quá trình thanh toán.');
        refreshData(); 
        setIsCheckoutModalOpen(false);
    }
  };

  const handleViewDetail = (product: Product) => {
    const freshProduct = products.find(p => p.id === product.id) || product;
    setSelectedProduct(freshProduct);
    setView(ViewState.PRODUCT_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToShop = () => {
    setSelectedProduct(null);
    setView(ViewState.SHOP);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        view={view} 
        setView={setView} 
        cartCount={cartCount} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogoutUser={() => {
            setCurrentUser(null);
            setView(ViewState.SHOP);
        }}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {view === ViewState.SHOP && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100 items-stretch md:items-center">
                
                {/* Category Dropdown */}
                <div className="relative min-w-[240px] group">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all cursor-pointer text-gray-700 font-medium"
                    >
                        <option value="All">Tất cả danh mục</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none group-focus-within:text-brand-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="flex justify-center mb-4">
                        <Search className="h-12 w-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
                    <button 
                        onClick={() => {setSelectedCategory('All'); setSearchTerm('')}}
                        className="mt-4 text-brand-600 hover:text-brand-700 font-semibold"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}
          </div>
        )}

        {/* View: PRODUCT DETAIL */}
        {view === ViewState.PRODUCT_DETAIL && selectedProduct && (
            <ProductDetail 
                product={selectedProduct} 
                onBack={handleBackToShop}
                onAddToCart={handleAddToCart}
            />
        )}

        {/* View: CUSTOMER HISTORY (New) */}
        {view === ViewState.CUSTOMER_HISTORY && currentUser && (
            <CustomerHistory 
                currentUser={currentUser}
                onBack={handleBackToShop}
                onReorder={handleReorder}
            />
        )}

        {/* View: ADMIN (Protected) */}
        {view === ViewState.ADMIN && (
          isAdminLoggedIn ? (
            <AdminPanel 
                onProductAdded={refreshData} 
                onLogout={() => {
                    setIsAdminLoggedIn(false);
                    setView(ViewState.SHOP);
                }} 
            />
          ) : (
            <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
          )
        )}

        {view === ViewState.CART && (
          <CartView
            cart={cart}
            updateQuantity={handleUpdateQuantity}
            removeFromCart={handleRemoveFromCart}
            checkout={handleCheckoutClick}
          />
        )}
      </main>

      <Footer />

      {/* Modals */}
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleFinalizeCheckout}
        totalAmount={totalAmount}
        currentUser={currentUser}
      />

      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(account) => {
            setCurrentUser(account);
        }}
      />
    </div>
  );
};

export default App;
