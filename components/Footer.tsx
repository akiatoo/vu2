import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send, CreditCard, Wallet } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Thông tin & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">ShopGenius VN</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Mua sắm thông minh hơn với công nghệ AI. Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất.
            </p>
            <div className="pt-2">
              <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Đăng ký nhận tin</label>
              <div className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-brand-500 w-full text-sm border border-gray-700"
                />
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-r-lg transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Blog công nghệ</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Hệ thống cửa hàng</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-500 shrink-0 mt-0.5" />
                <span>71 xóm 3 thôn Tân An, xã Tân Hội, Tỉnh Lâm Đồng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-500 shrink-0" />
                <a href="tel:0792630630" className="font-mono text-white hover:text-brand-400 transition-colors">0792 630 630</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-500 shrink-0" />
                <a href="mailto:ngocvusm@gmail.com" className="hover:text-brand-400 transition-colors">ngocvusm@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thanh toán & MXH */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Thanh toán</h4>
            <div className="flex gap-2 mb-6">
              <div className="bg-gray-800 p-2 rounded border border-gray-700 text-gray-400" title="Visa/Mastercard">
                 <CreditCard size={24} />
              </div>
              <div className="bg-gray-800 p-2 rounded border border-gray-700 text-gray-400" title="Ví điện tử">
                 <Wallet size={24} />
              </div>
              <div className="bg-gray-800 p-2 rounded border border-gray-700 text-gray-400 font-bold text-xs flex items-center">
                 COD
              </div>
            </div>

            <h4 className="text-white font-semibold mb-4 text-lg">Kết nối</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopGenius VN. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Điều khoản</a>
            <a href="#" className="hover:text-gray-300">Bảo mật</a>
            <a href="#" className="hover:text-gray-300">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};