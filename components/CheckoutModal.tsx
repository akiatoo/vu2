
import React, { useState, useEffect } from 'react';
import { X, Truck, User, Phone, MapPin, PackageCheck } from 'lucide-react';
import { CustomerAccount } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: { name: string, phone: string, address: string }) => void;
  totalAmount: number;
  currentUser: CustomerAccount | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSubmit, totalAmount, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Auto-fill when modal opens or user logs in
  useEffect(() => {
    if (isOpen && currentUser) {
        setFormData({
            name: currentUser.name,
            phone: currentUser.phone,
            address: currentUser.address
        });
    } else if (isOpen && !currentUser) {
        // Reset if guest
        setFormData({ name: '', phone: '', address: '' });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
        alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in z-10">
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck size={24} className="text-brand-400" />
            Xác nhận đặt hàng
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {currentUser && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <User size={16} />
                  Đang dùng thông tin của <b>{currentUser.name}</b>
              </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên người nhận</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại liên hệ</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="0912 345 678"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  required
                  rows={3}
                  placeholder="Số nhà, đường, phường/xã..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 -mx-6 px-6 py-4 mt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-brand-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
            >
              <PackageCheck size={20} />
              Hoàn tất đặt hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
