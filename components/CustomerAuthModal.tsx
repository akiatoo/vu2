
import React, { useState } from 'react';
import { X, UserCircle, Phone, Lock, MapPin, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { database } from '../database';
import { CustomerAccount } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (account: CustomerAccount) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const resetForms = () => {
      setError('');
      setSuccess('');
      setLoginPhone('');
      setLoginPass('');
      setRegName('');
      setRegPhone('');
      setRegPass('');
      setRegAddress('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = database.customerLogin(loginPhone, loginPass);
    if (result.success && result.account) {
        onLoginSuccess(result.account);
        onClose();
        resetForms();
    } else {
        setError(result.message);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPhone.length < 9) {
        setError('Số điện thoại không hợp lệ.');
        return;
    }
    if (regPass.length < 4) {
        setError('Mật khẩu quá ngắn.');
        return;
    }

    const result = database.customerRegister({
        name: regName,
        phone: regPhone,
        password: regPass,
        address: regAddress
    });

    if (result.success) {
        setSuccess(result.message);
        setError('');
        setTimeout(() => {
            setIsLoginView(true); // Switch to login
            setLoginPhone(regPhone);
            setSuccess('');
        }, 1500);
    } else {
        setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden animate-fade-in z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={20} />
        </button>

        <div className="p-8">
            <div className="text-center mb-6">
                <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserCircle className="text-brand-600 h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isLoginView ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {isLoginView ? 'Đăng nhập để mua sắm nhanh hơn.' : 'Điền thông tin để đăng ký thành viên.'}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> {success}
                </div>
            )}

            {isLoginView ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                            value={loginPhone}
                            onChange={e => setLoginPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                            value={loginPass}
                            onChange={e => setLoginPass(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors">
                        Đăng nhập
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-gray-500 text-sm">Chưa có tài khoản? </span>
                        <button 
                            type="button" 
                            onClick={() => { setIsLoginView(false); setError(''); }}
                            className="text-brand-600 font-bold text-sm hover:underline"
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-3">
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            value={regPass}
                            onChange={e => setRegPass(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Địa chỉ giao hàng"
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                            value={regAddress}
                            onChange={e => setRegAddress(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors mt-2 flex items-center justify-center gap-2">
                        Tạo tài khoản <ArrowRight size={16} />
                    </button>
                    
                    <div className="text-center mt-4">
                        <button 
                            type="button" 
                            onClick={() => { setIsLoginView(true); setError(''); }}
                            className="text-brand-600 font-bold text-sm hover:underline"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};
