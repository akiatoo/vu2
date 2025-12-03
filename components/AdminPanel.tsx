
import React, { useState, useEffect } from 'react';
import { Product, Order, Customer } from '../types';
import { database } from '../database';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, Save, Loader2, Trash2, Pencil, XCircle, CheckCircle2, Tags, Plus, Box, History, Receipt, Phone, MapPin, FileText, LogOut, KeyRound, X, TrendingUp, XOctagon, CheckSquare, Users, UserCircle, ChevronDown, ChevronRight, Search, Truck, ShieldCheck } from 'lucide-react';

interface AdminPanelProps {
  onProductAdded: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onProductAdded, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'ORDERS' | 'CUSTOMERS'>('PRODUCTS');
  
  // State for Product Management
  const [products, setProducts] = useState<Product[]>(database.getProducts());
  const [categories, setCategories] = useState<string[]>(database.getCategories());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '', 
    category: '', 
    condition: 'Hàng chính hãng 100%', // Mặc định
    description: '',
    specs: '', 
    warrantyPeriod: '', 
    image: `https://picsum.photos/400/400?random=${Date.now()}`,
    stock: '10', 
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // State for Orders & Customers
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // State for Change Password
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });

  useEffect(() => {
    if (activeTab === 'PRODUCTS') {
        setProducts(database.getProducts());
        setCategories(database.getCategories());
        if (categories.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: categories[0] }));
        }
    } else if (activeTab === 'ORDERS') {
        setOrders(database.getOrders());
    } else if (activeTab === 'CUSTOMERS') {
        setCustomers(database.getCustomers());
    }
  }, [activeTab]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      costPrice: '',
      category: categories[0] || '',
      condition: 'Hàng chính hãng 100%',
      description: '',
      specs: '',
      warrantyPeriod: '',
      image: `https://picsum.photos/400/400?random=${Date.now()}`,
      stock: '10',
    });
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const productData = {
        name: formData.name,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        specs: formData.specs,
        warrantyPeriod: formData.warrantyPeriod,
        image: formData.image,
        stock: Number(formData.stock),
    };

    if (editingId) {
      database.updateProduct(editingId, productData);
      alert('Cập nhật sản phẩm thành công!');
    } else {
      database.addProduct(productData);
    }

    resetForm();
    setProducts(database.getProducts());
    onProductAdded();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      costPrice: product.costPrice ? product.costPrice.toString() : '',
      category: product.category,
      condition: product.condition || 'Hàng chính hãng 100%',
      description: product.description,
      specs: product.specs || '',
      warrantyPeriod: product.warrantyPeriod || '',
      image: product.image,
      stock: product.stock.toString(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
      if(confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
          database.deleteProduct(id);
          if (editingId === id) {
            resetForm();
          }
          setProducts(database.getProducts());
          onProductAdded();
      }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const success = database.addCategory(newCategoryName.trim());
    if (success) {
      setCategories(database.getCategories());
      setNewCategoryName('');
      onProductAdded(); 
    } else {
      alert('Danh mục đã tồn tại!');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (confirm(`Bạn có chắc muốn xóa danh mục "${cat}"?`)) {
      database.deleteCategory(cat);
      const newCats = database.getCategories();
      setCategories(newCats);
      if (formData.category === cat) {
        setFormData(prev => ({ ...prev, category: newCats[0] || '' }));
      }
      onProductAdded(); 
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (!database.checkLogin('admin', passForm.oldPass)) {
          alert('Mật khẩu cũ không chính xác!');
          return;
      }
      if (passForm.newPass.length < 6) {
          alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
          return;
      }
      if (passForm.newPass !== passForm.confirmPass) {
          alert('Mật khẩu xác nhận không khớp!');
          return;
      }

      database.changePassword(passForm.newPass);
      alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setIsChangePassOpen(false);
      onLogout();
  };

  // --- Order Actions ---
  const handleConfirmOrder = (id: string) => {
      if (confirm('Xác nhận giao hàng thành công? Đơn hàng sẽ được lưu vào Hồ sơ khách hàng và xóa khỏi danh sách chờ.')) {
          database.confirmOrder(id);
          setOrders(database.getOrders());
      }
  };

  const handleCancelOrder = (id: string) => {
      if (confirm('CẢNH BÁO: Đơn hàng giao không thành công?\n\n- Tồn kho sản phẩm sẽ được CỘNG LẠI.\n- Đơn hàng sẽ bị XÓA VĨNH VIỄN khỏi hệ thống.')) {
          database.cancelOrder(id);
          setOrders(database.getOrders());
          onProductAdded(); // Refresh product list to update stock in shop view
      }
  };

  const toggleCustomerExpand = (customerId: string) => {
      setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  // Filter customers logic
  const filteredCustomers = customers.filter(c => 
    c.phone.includes(customerSearchTerm) || 
    c.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  // Filter products logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Admin Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-4 border-b border-gray-200 pb-2 w-full md:w-auto overflow-x-auto">
            <button
                onClick={() => setActiveTab('PRODUCTS')}
                className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'PRODUCTS' 
                    ? 'text-brand-600 border-b-2 border-brand-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <Box size={20} /> Kho hàng
            </button>
            <button
                onClick={() => setActiveTab('ORDERS')}
                className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'ORDERS' 
                    ? 'text-brand-600 border-b-2 border-brand-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <div className="relative">
                    <Truck size={20} />
                    {orders.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {orders.length}
                        </span>
                    )}
                </div>
                Đơn chờ giao
            </button>
            <button
                onClick={() => setActiveTab('CUSTOMERS')}
                className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'CUSTOMERS' 
                    ? 'text-brand-600 border-b-2 border-brand-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <History size={20} /> Lịch sử & Khách hàng
            </button>
          </div>

          <div className="flex gap-2">
            <button 
                onClick={() => setIsChangePassOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
                <KeyRound size={16} /> Đổi mật khẩu
            </button>
            <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
                <LogOut size={16} /> Đăng xuất
            </button>
          </div>
      </div>

      {activeTab === 'PRODUCTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1 space-y-8">
                {/* Category Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tags className="text-brand-600" size={20} />
                    Quản lý danh mục
                </h2>
                <div className="flex gap-2 mb-4">
                    <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Tên danh mục mới"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <button 
                    onClick={handleAddCategory}
                    className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                    <Plus size={18} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                    <span key={cat} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {cat}
                        <button onClick={() => handleDeleteCategory(cat)} className="hover:text-red-500 ml-1">
                        <XCircle size={14} />
                        </button>
                    </span>
                    ))}
                </div>
                </div>

                {/* Product Form */}
                <div className={`bg-white rounded-xl shadow-sm border p-6 sticky top-24 transition-colors duration-300 ${editingId ? 'border-brand-500 ring-1 ring-brand-200' : 'border-gray-100'}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    {editingId ? (
                    <>
                        <Pencil className="text-brand-600" />
                        <span>Sửa sản phẩm</span>
                    </>
                    ) : (
                    <>
                        <Sparkles className="text-brand-500" />
                        <span>Nhập kho sản phẩm</span>
                    </>
                    )}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        placeholder="Ví dụ: Giày Sneaker X"
                        required
                    />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VND)</label>
                            <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="0"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-red-600">Giá vốn (VND)</label>
                            <input
                            type="number"
                            name="costPrice"
                            value={formData.costPrice}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 outline-none bg-red-50"
                            placeholder="Để tính lãi"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                            <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="0"
                            required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bảo hành</label>
                             <input
                            type="text"
                            name="warrantyPeriod"
                            value={formData.warrantyPeriod}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Ví dụ: 12 tháng"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                        <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                        <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                        >
                            <option value="Hàng chính hãng 100%">Hàng chính hãng 100% (New)</option>
                            <option value="Hàng cũ">Hàng cũ (Used)</option>
                        </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-sm text-gray-600"
                    />
                    </div>

                    <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating || !formData.name}
                        className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-700 disabled:opacity-50 font-medium"
                        >
                        {isGenerating ? <Loader2 className="animate-spin h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                        AI Viết hộ
                        </button>
                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="Mô tả sản phẩm..."
                    />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FileText size={14} /> Thông số kỹ thuật
                        </label>
                        <textarea
                            name="specs"
                            value={formData.specs}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-xs"
                            placeholder="Mỗi dòng một thông số. Ví dụ:&#10;RAM: 8GB&#10;Pin: 5000mAh"
                        />
                    </div>

                    <div className="pt-2 flex gap-2">
                    <button
                        type="submit"
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-colors font-medium ${
                        editingId ? 'bg-brand-600 hover:bg-brand-700' : 'bg-gray-900 hover:bg-gray-800'
                        }`}
                    >
                        {editingId ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {editingId ? 'Cập nhật' : 'Lưu vào CSDL'}
                    </button>
                    
                    {editingId && (
                        <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Hủy bỏ sửa"
                        >
                        <XCircle size={20} />
                        </button>
                    )}
                    </div>
                </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Box size={24} />
                        Kho hàng hiện tại
                    </h2>
                    
                    {/* Product Search Bar */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder="Tìm sản phẩm..." 
                            value={productSearchTerm}
                            onChange={(e) => setProductSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Sản phẩm</th>
                                    <th className="p-4">Giá bán</th>
                                    <th className="p-4">Tình trạng</th>
                                    <th className="p-4 text-red-600">Giá vốn</th>
                                    <th className="p-4 text-center">Tồn kho</th>
                                    <th className="p-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(product => {
                                    const profit = (product.price || 0) - (product.costPrice || 0);
                                    return (
                                        <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${editingId === product.id ? 'bg-brand-50' : ''}`}>
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={product.image} className="w-10 h-10 rounded object-cover bg-gray-200" alt="" />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{product.name}</span>
                                                    <span className="text-xs text-gray-500">{product.category}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded border ${
                                                    product.condition === 'Hàng cũ' 
                                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {product.condition || 'Chính hãng'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {product.costPrice ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.costPrice)}</span>
                                                        <span className="text-xs text-green-600 flex items-center gap-0.5" title="Lợi nhuận dự kiến">
                                                            <TrendingUp size={10} /> +{new Intl.NumberFormat('vi-VN').format(profit)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">--</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    product.stock === 0 
                                                        ? 'bg-red-100 text-red-600' 
                                                        : product.stock < 5 
                                                            ? 'bg-yellow-100 text-yellow-700' 
                                                            : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="text-brand-600 hover:bg-brand-50 p-2 rounded-full transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-400">
                                            {productSearchTerm ? 'Không tìm thấy sản phẩm nào.' : 'Chưa có dữ liệu'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Receipt size={24} />
                    Danh sách đơn hàng chờ xử lý
                </h2>
                <div className="text-sm text-gray-500 italic">
                    * Đơn hàng giao thành công sẽ chuyển sang Tab "Khách hàng"
                </div>
             </div>
             
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="p-4">Thời gian</th>
                                <th className="p-4">Khách hàng</th>
                                <th className="p-4">Chi tiết đơn hàng</th>
                                <th className="p-4 text-right">Thành tiền</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="p-4 whitespace-nowrap align-top">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-900">{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(order.createdAt)}</span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded w-fit">
                                                <Box size={12} /> Đang chờ
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-gray-900">{order.customerName}</div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Phone size={12} /> {order.customerPhone}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                            <MapPin size={12} /> {order.shippingAddress}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs">
                                                    <img src={item.image} alt="" className="w-6 h-6 rounded bg-gray-100 object-cover" />
                                                    <span className="font-medium text-gray-700">{item.name}</span>
                                                    <span className="text-gray-500">x{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right align-top font-bold text-brand-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => handleConfirmOrder(order.id)}
                                                className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors shadow-sm"
                                                title="Xác nhận giao thành công -> Lưu bảo hành"
                                            >
                                                <CheckSquare size={14} /> Giao xong
                                            </button>
                                            <button 
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="flex items-center justify-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                                                title="Xóa đơn -> Cộng lại tồn kho"
                                            >
                                                <XOctagon size={14} /> Hủy bỏ
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 size={32} className="text-green-500" />
                                            Tuyệt vời! Đã xử lý hết đơn hàng.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'CUSTOMERS' && (
         <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users size={24} />
                    Danh sách Khách hàng & Lịch sử mua (VIP)
                </h2>
                
                {/* Customer Search Bar */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo Số điện thoại hoặc Tên..." 
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-10"></th>
                                <th className="p-4">Thông tin khách hàng</th>
                                <th className="p-4">Địa chỉ mới nhất</th>
                                <th className="p-4 text-center">Tổng đơn hàng</th>
                                <th className="p-4 text-right">Tổng chi tiêu (VIP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer) => (
                                <React.Fragment key={customer.id}>
                                    <tr 
                                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedCustomer === customer.id ? 'bg-brand-50' : ''}`}
                                        onClick={() => toggleCustomerExpand(customer.id)}
                                    >
                                        <td className="p-4 text-center">
                                            {expandedCustomer === customer.id ? <ChevronDown size={18} className="text-brand-600" /> : <ChevronRight size={18} className="text-gray-400" />}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-brand-100 text-brand-600 p-2 rounded-full">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{customer.name}</div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 font-mono">
                                                        <Phone size={12} /> {customer.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-start gap-1">
                                                <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                                                <span>{customer.address}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                                {customer.orderCount} đơn thành công
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right font-bold text-brand-600 text-lg">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)}
                                        </td>
                                    </tr>
                                    
                                    {/* Sub-row for Order History */}
                                    {expandedCustomer === customer.id && (
                                        <tr className="bg-gray-50/50 animate-fade-in">
                                            <td colSpan={5} className="p-0 border-b border-gray-100">
                                                <div className="p-4 pl-16 pr-8">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                                        <History size={14} /> Lịch sử đơn hàng chi tiết
                                                    </h4>
                                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-gray-100 text-gray-700">
                                                                <tr>
                                                                    <th className="p-3 text-left">Ngày mua</th>
                                                                    <th className="p-3 text-left">Mã đơn</th>
                                                                    <th className="p-3 text-left">Sản phẩm</th>
                                                                    <th className="p-3 text-right">Giá trị đơn</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {customer.history.map((order, idx) => (
                                                                    <tr key={idx} className="hover:bg-gray-50">
                                                                        <td className="p-3 font-medium text-gray-600">
                                                                             {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(order.createdAt)}
                                                                        </td>
                                                                        <td className="p-3 font-mono text-gray-500">#{order.id}</td>
                                                                        <td className="p-3">
                                                                            <div className="space-y-1">
                                                                                {order.items.map((item, i) => (
                                                                                    <div key={i} className="flex justify-between w-full max-w-xs">
                                                                                        <span>{item.name}</span>
                                                                                        <span className="text-gray-500 font-medium">x{item.quantity}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-3 text-right font-bold text-gray-900">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            {customerSearchTerm ? <Search size={32} /> : <Users size={32} />}
                                            {customerSearchTerm ? 'Không tìm thấy khách hàng nào.' : 'Chưa có dữ liệu khách hàng (Cần có đơn hàng thành công).'}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      )}

      {/* Change Password Modal */}
      {isChangePassOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsChangePassOpen(false)}></div>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden animate-fade-in">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Đổi mật khẩu</h3>
                    <button onClick={() => setIsChangePassOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mật khẩu cũ</label>
                        <input 
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            value={passForm.oldPass}
                            onChange={e => setPassForm({...passForm, oldPass: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mật khẩu mới</label>
                        <input 
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            value={passForm.newPass}
                            onChange={e => setPassForm({...passForm, newPass: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Xác nhận mật khẩu mới</label>
                        <input 
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            value={passForm.confirmPass}
                            onChange={e => setPassForm({...passForm, confirmPass: e.target.value})}
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-brand-600 text-white py-2 rounded-lg font-bold hover:bg-brand-700 transition-colors mt-2"
                    >
                        Cập nhật mật khẩu
                    </button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};
