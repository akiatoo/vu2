
import React from 'react';
import { CartItem } from '../types';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ cart, updateQuantity, removeFromCart, checkout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500">Hãy thêm vài món đồ thú vị vào nhé!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng của bạn ({cart.length} món)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-gray-50" />
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="mt-2 font-semibold text-brand-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tổng quan đơn hàng</h3>
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Vận chuyển</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
            </div>
            
            <button
                onClick={checkout}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
            >
                Đặt hàng <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
