
import React, { useEffect, useState } from 'react';
import { CustomerAccount, Order } from '../types';
import { database } from '../database';
import { Package, Clock, CheckCircle2, ShoppingBag, MapPin, ArrowLeft, Repeat } from 'lucide-react';

interface CustomerHistoryProps {
  currentUser: CustomerAccount;
  onBack: () => void;
  onReorder: (order: Order) => void;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({ currentUser, onBack, onReorder }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (currentUser) {
        const history = database.getCustomerHistory(currentUser.phone);
        setOrders(history);
    }
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-brand-600 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Tiếp tục mua sắm
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-brand-50 p-3 rounded-full text-brand-600">
                    <ShoppingBag size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h2>
                    <p className="text-gray-500 text-sm">Xin chào, {currentUser.name}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-brand-600">{orders.length}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Tổng đơn hàng</div>
            </div>
        </div>

        <div className="divide-y divide-gray-100">
            {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                    <Package size={48} className="mb-4 text-gray-200" />
                    <p className="text-lg font-medium text-gray-900">Bạn chưa có đơn hàng nào.</p>
                    <p className="text-sm">Hãy dạo một vòng cửa hàng và mua sắm nhé!</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="p-6 md:p-8 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-lg text-gray-900">Đơn hàng #{order.id}</span>
                                    {order.status === 'completed' ? (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Giao thành công
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <Clock size={12} /> Đang xử lý
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Ngày đặt: {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeStyle: 'short' }).format(order.createdAt)}
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-sm text-gray-500 mb-1">Tổng tiền</div>
                                <div className="text-xl font-bold text-brand-600">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600 border border-gray-100">
                             <div className="flex items-start gap-2">
                                <MapPin size={16} className="mt-0.5 text-brand-500 shrink-0" />
                                <span><span className="font-semibold">Địa chỉ nhận hàng:</span> {order.shippingAddress}</span>
                             </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-white border border-gray-200" />
                                        <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                        <div className="text-sm text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</div>
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button 
                                onClick={() => onReorder(order)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-600 text-brand-600 rounded-lg font-medium hover:bg-brand-50 transition-colors shadow-sm"
                            >
                                <Repeat size={16} />
                                Mua lại đơn này
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
