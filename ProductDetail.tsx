
import React from 'react';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Check, Tag, ShieldCheck, Truck, PackageX, Box, FileText, Info } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [isAdded, setIsAdded] = React.useState(false);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Helper function to render specs table rows
  const renderSpecs = (specsString: string) => {
    const lines = specsString.split('\n').filter(line => line.trim() !== '');
    return (
        <div className="overflow-hidden bg-white rounded-lg border border-gray-200 mt-2">
            <table className="min-w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                    {lines.map((line, index) => {
                        const parts = line.split(':');
                        const label = parts[0];
                        const value = parts.slice(1).join(':').trim(); // Join back in case value has : inside
                        
                        // If no colon, just show the line as value
                        if (parts.length === 1) {
                             return (
                                <tr key={index} className="even:bg-gray-50">
                                    <td colSpan={2} className="px-4 py-3 text-gray-700">{line}</td>
                                </tr>
                            );
                        }

                        return (
                            <tr key={index} className="even:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-500 w-1/3 align-top bg-gray-50/50">{label}</td>
                                <td className="px-4 py-3 text-gray-900 w-2/3">{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-brand-600 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Quay lại cửa hàng
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          
          <div className="bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`max-h-[500px] w-full object-contain drop-shadow-xl ${isOutOfStock ? 'grayscale opacity-70' : 'hover:scale-105 transition-transform duration-500'}`}
            />
             {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold uppercase text-xl transform -rotate-12 border-4 border-white shadow-lg">Hết hàng</span>
                </div>
            )}
          </div>

          <div className="p-8 flex flex-col h-full">
            <div className="mb-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Tag size={14} /> {product.category}
                    </span>
                    <span className="text-gray-400 text-sm">Mã SP: {product.id.substring(0, 8).toUpperCase()}</span>
                </div>
                
                {/* Stock Status Badge */}
                <div className={`flex items-center gap-1 text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                    <Box size={16} />
                    {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Tình trạng hàng */}
              <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      product.condition === 'Hàng cũ'
                      ? 'bg-orange-100 text-orange-700 border-orange-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                      <Info size={14} />
                      {product.condition || 'Hàng chính hãng 100%'}
                  </span>
              </div>

              <div className="text-3xl font-bold text-brand-600 mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                <h3 className="text-gray-900 font-semibold mb-2 text-lg">Mô tả sản phẩm:</h3>
                <p>{product.description}</p>
                
                {/* Specs Section */}
                {product.specs && (
                    <div className="mt-6">
                         <h3 className="text-gray-900 font-semibold mb-2 text-lg flex items-center gap-2">
                            <FileText size={18} />
                            Thông số kỹ thuật
                         </h3>
                         {renderSpecs(product.specs)}
                    </div>
                )}

                <ul className="mt-6 space-y-2 list-none pl-0">
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" /> 
                        {product.condition || 'Hàng chính hãng 100%'}
                    </li>
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" /> 
                        Bảo hành {product.warrantyPeriod || '12 tháng'}
                    </li>
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" /> Đổi trả trong 7 ngày
                    </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="text-brand-600 shrink-0" />
                    <div>
                        <div className="font-semibold text-gray-900">Bảo hành uy tín</div>
                        <div className="text-xs text-gray-500">Trung tâm bảo hành toàn quốc</div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Truck className="text-brand-600 shrink-0" />
                    <div>
                        <div className="font-semibold text-gray-900">Giao hàng nhanh</div>
                        <div className="text-xs text-gray-500">Miễn phí ship đơn từ 1 triệu</div>
                    </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
                    isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : isAdded 
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100' 
                            : 'bg-gray-900 text-white hover:bg-brand-600 shadow-brand-100'
                  }`}
                >
                  {isOutOfStock ? (
                      <>
                        <PackageX size={24} /> Tạm hết hàng
                      </>
                  ) : isAdded ? (
                    <>
                      <Check size={24} /> Đã thêm vào giỏ
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={24} /> Thêm vào giỏ hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
