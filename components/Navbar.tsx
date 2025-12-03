
import React, { useState } from 'react';
import { ViewState, CustomerAccount } from '../types';
import { ShoppingCart, LayoutGrid, PackagePlus, ShoppingBag, User, LogOut, ChevronDown, History } from 'lucide-react';

interface NavbarProps {
  view: ViewState;
  setView: (view: ViewState) => void;
  cartCount: number;
  currentUser: CustomerAccount | null;
  onOpenAuth: () => void;
  onLogoutUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, setView, cartCount, currentUser, onOpenAuth, onLogoutUser }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer gap-2" 
            onClick={() => setView(ViewState.SHOP)}
          >
            <div className="bg-brand-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">ShopGenius</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setView(ViewState.SHOP)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === ViewState.SHOP 
                  ? 'text-brand-600 bg-brand-50' 
                  : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Cửa hàng</span>
            </button>

            <button
              onClick={() => setView(ViewState.ADMIN)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === ViewState.ADMIN 
                  ? 'text-brand-600 bg-brand-50' 
                  : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              <PackagePlus size={18} />
              <span className="hidden md:inline">Quản lý</span>
            </button>

            {/* Customer Account Button */}
            <div className="relative">
                {currentUser ? (
                    <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className="bg-brand-100 text-brand-600 p-1 rounded-full">
                            <User size={16} />
                        </div>
                        <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </div>
                ) : (
                     <button
                        onClick={onOpenAuth}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-gray-50"
                    >
                        <User size={18} />
                        <span className="hidden sm:inline">Đăng nhập</span>
                    </button>
                )}

                {/* Dropdown Menu */}
                {isUserMenuOpen && currentUser && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                                <p className="text-xs text-gray-500">{currentUser.phone}</p>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    setView(ViewState.CUSTOMER_HISTORY);
                                    setIsUserMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"
                            >
                                <History size={16} className="text-brand-500" /> Đơn hàng của tôi
                            </button>

                            <button 
                                onClick={() => {
                                    onLogoutUser();
                                    setIsUserMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Đăng xuất
                            </button>
                        </div>
                    </>
                )}
            </div>

            <button
              onClick={() => setView(ViewState.CART)}
              className={`relative p-2 rounded-full transition-colors ${
                view === ViewState.CART
                  ? 'bg-brand-100 text-brand-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
