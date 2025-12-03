
import { Order } from '../types';

const SHOP_PHONE_NUMBER = '0792630630';

export const sendOrderToZalo = async (order: Order) => {
  // 1. Định dạng nội dung tin nhắn đẹp mắt
  const itemsList = order.items
    .map((item, index) => `${index + 1}. ${item.name} x${item.quantity}`)
    .join('\n');

  const total = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount);
  const date = new Date(order.createdAt).toLocaleString('vi-VN');

  const message = `🛒 ĐƠN HÀNG MỚI #${order.id}
📅 Ngày: ${date}

👤 KHÁCH HÀNG:
- Tên: ${order.customerName}
- SĐT: ${order.customerPhone}
- Địa chỉ: ${order.shippingAddress}

📦 SẢN PHẨM:
${itemsList}

💰 TỔNG TIỀN: ${total}

Vui lòng xác nhận đơn hàng giúp mình nhé!`;

  // 2. Copy nội dung vào Clipboard
  try {
    await navigator.clipboard.writeText(message);
    
    // 3. Mở Zalo Chat
    // Sử dụng link zalo.me để mở app hoặc web
    const zaloUrl = `https://zalo.me/${SHOP_PHONE_NUMBER}`;
    window.open(zaloUrl, '_blank');
    
    return true;
  } catch (err) {
    console.error('Không thể copy text: ', err);
    // Fallback nếu copy thất bại (hiếm khi xảy ra trên trình duyệt hiện đại)
    alert('Không thể tự động copy đơn hàng. Vui lòng chụp màn hình!');
    return false;
  }
};
