
import { GoogleGenAI } from "@google/genai";

// KHÔNG khởi tạo ở đây (Global scope).
// Nếu khởi tạo ở đây, code sẽ chạy ngay khi app bật -> Crash nếu thiếu env.

export const generateProductDescription = async (
  name: string,
  category: string
): Promise<string> => {
  try {
    // 1. Lấy API Key từ biến môi trường (Vite standard)
    // Ưu tiên VITE_API_KEY, fallback sang API_KEY nếu cấu hình define trong vite.config.ts
    const apiKey = import.meta.env.VITE_API_KEY || (import.meta.env as any).API_KEY;
    
    // Debug log (Kiểm tra xem key có load được không trong Console F12)
    console.log("Gemini Service: Đang khởi tạo...", { hasKey: !!apiKey });

    // 2. Kiểm tra kỹ lưỡng trước khi khởi tạo
    if (!apiKey || apiKey === 'undefined' || apiKey.includes("your_api_key")) {
      console.error("Lỗi: Thiếu API Key trong file .env");
      return "Vui lòng tạo file .env và điền VITE_API_KEY hợp lệ để sử dụng tính năng này.";
    }

    // 3. Lazy Initialization: Chỉ khởi tạo khi hàm được gọi
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Sử dụng model Flash cho tốc độ nhanh
    const model = 'gemini-2.5-flash'; 
    const prompt = `
      Bạn là một chuyên gia marketing. Hãy viết một mô tả sản phẩm hấp dẫn, ngắn gọn (khoảng 2-3 câu) bằng tiếng Việt.
      
      Thông tin sản phẩm:
      - Tên: ${name}
      - Danh mục: ${category}
      
      Yêu cầu đầu ra:
      - Chỉ trả về nội dung văn bản mô tả.
      - Giọng văn lôi cuốn, kích thích mua hàng.
      - Không dùng dấu ngoặc kép ở đầu cuối.
    `;

    console.log("Gemini Service: Đang gửi yêu cầu...");

    // 4. Gọi API
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    console.log("Gemini Service: Hoàn tất.");
    return response.text?.trim() || "Không có nội dung được tạo.";
    
  } catch (error) {
    console.error("Gemini API Error Chi tiết:", error);
    // Trả về thông báo lỗi để hiển thị lên UI
    return "Đã xảy ra lỗi khi gọi AI. Vui lòng kiểm tra Console (F12) để biết chi tiết.";
  }
};
