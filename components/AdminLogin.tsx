
import React, { useState } from 'react';
import { Lock, User, Key, ShieldCheck, AlertCircle, HelpCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { database, RECOVERY_KEY } from '../database';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [isRecovering, setIsRecovering] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Recovery State
  const [recoveryCode, setRecoveryCode] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (database.checkLogin(username, password)) {
      onLogin();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
      setPassword('');
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
      e.preventDefault();
      if (recoveryCode === RECOVERY_KEY) {
          database.resetPassword();
          setSuccessMsg('Mật khẩu đã được khôi phục về mặc định: 123456');
          setError('');
          setIsRecovering(false);
          setUsername('admin');
          setPassword('');
      } else {
          setError('Mã khôi phục không chính xác!');
      }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {isRecovering ? (
                <RefreshCw className="text-brand-600 h-8 w-8" />
            ) : (
                <ShieldCheck className="text-brand-600 h-8 w-8" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
              {isRecovering ? 'Khôi phục tài khoản' : 'Đăng nhập quản trị'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
              {isRecovering 
                ? 'Nhập mã khôi phục hệ thống để reset mật khẩu.' 
                : 'Vui lòng xác thực danh tính để truy cập kho hàng.'}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm animate-pulse">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                <ShieldCheck size={16} />
                {successMsg}
            </div>
        )}

        {/* Forms */}
        {!isRecovering ? (
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="admin"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="••••••"
                />
                </div>
                <div className="flex justify-end mt-2">
                    <button 
                        type="button"
                        onClick={() => {
                            setIsRecovering(true);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                    >
                        <HelpCircle size={12} /> Quên mật khẩu?
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2"
            >
                <Lock size={18} /> Đăng nhập
            </button>
            </form>
        ) : (
            <form onSubmit={handleRecovery} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã khôi phục (Recovery Key)</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            value={recoveryCode}
                            onChange={(e) => setRecoveryCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                            placeholder="Nhập mã bí mật..."
                        />
                    </div>
                     <p className="text-xs text-gray-400 mt-2 italic">
                        * Gợi ý cho bản Demo: SHOP_RECOVERY_2024
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw size={18} /> Khôi phục Mật khẩu Gốc
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setIsRecovering(false);
                        setError('');
                    }}
                    className="w-full text-gray-500 py-2 rounded-lg font-medium hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={16} /> Quay lại đăng nhập
                </button>
            </form>
        )}
      </div>
    </div>
  );
};
