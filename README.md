# ShopGenius VN

## Hướng dẫn cài đặt và chạy trên máy tính

1. **Cài đặt thư viện:**
   Mở terminal tại thư mục dự án và chạy:
   ```bash
   npm install
   ```

2. **Cấu hình API Key:**
   - Tạo một file mới tên là `.env` tại thư mục gốc.
   - Mở file `.env` và thêm dòng sau (thay bằng key của bạn):
     ```
     API_KEY=AIzaSy...
     ```
   - Lưu ý: Không dùng dấu ngoặc kép bao quanh key.

3. **Chạy dự án:**
   ```bash
   npm run dev
   ```

## Khắc phục lỗi thường gặp
- Nếu báo lỗi "Vui lòng cấu hình API Key...": Kiểm tra xem bạn đã tạo file `.env` chưa và khởi động lại terminal (`npm run dev`) để nạp lại biến môi trường.
