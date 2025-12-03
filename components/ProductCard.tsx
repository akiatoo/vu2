
import React from 'react';
import { Product } from '../types';
import { Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div className={`group bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col h-full ${!isOutOfStock ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-80'}`}>
      
      <div 
        className="relative aspect-square overflow-hidden bg-gray-100"
        onClick={() => onViewDetail(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`object-cover w-full h-full transition-transform duration-500 ${!isOutOfStock ? 'group-hover:scale-105' : 'grayscale'}`}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-600">
          {product.category}
        </div>

        {/* Badge Hết hàng */}
        {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 rounded font-bold uppercase text-sm transform -rotate-12 border-2 border-white">Hết hàng</span>
            </div>
        )}
        
        {/* Overlay hiệu ứng hover (chỉ khi còn hàng) */}
        {!isOutOfStock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Eye size={16} /> Xem chi tiết
                </div>
            </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 
            onClick={() => onViewDetail(product)}
            className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-brand-600 transition-colors" 
            title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>
        
        {/* Hiển thị số lượng còn lại nếu sắp hết */}
        {product.stock > 0 && product.stock < 5 && (
            <p className="text-xs text-red-500 font-medium mb-2">Chỉ còn {product.stock} sản phẩm!</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <span className="text-lg font-bold text-brand-600">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(product);
            }}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-2 rounded-full text-white transition-all shadow-lg ${
                isOutOfStock 
                ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-gray-900 hover:bg-brand-600 active:scale-95 shadow-gray-200'
            }`}
            title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
