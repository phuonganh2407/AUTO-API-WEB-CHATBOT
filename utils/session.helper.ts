// Import module fs để thao tác với file system (đọc/ghi file)
import fs from "fs";
// Import module path để xử lý và xây dựng đường dẫn file
import path from "path";

// Xây dựng đường dẫn tuyệt đối đến file session.json trong thư mục storage
const sessionFile = path.resolve(__dirname, "../storage/session.json");

// Định nghĩa interface SessionData để mô tả cấu trúc dữ liệu session
interface SessionData {
  token: string; // Chuỗi token xác thực từ API login
  shopId: string; // ID của cửa hàng được lấy từ API shops
  loginTime: number; // Thời gian đăng nhập tính bằng epoch seconds (số giây từ 1970-01-01)
  expiresIn: number; // Thời gian hiệu lực của token tính bằng giây
  environment: string; // Môi trường hiện tại (dev, stag, prod) để tránh conflict khi chuyển môi trường
}

// Hàm export saveSession: Lưu trữ dữ liệu session vào file JSON
// Tham số tùy chọn: chỉ cập nhật các trường được cung cấp, giữ nguyên các trường khác
export const saveSession = (token?: string, shopId?: string, loginTime?: number, expiresIn?: number, environment?: string) => {
  // Khởi tạo object currentData với giá trị mặc định
  let currentData: SessionData = { token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" };

  // Kiểm tra xem file session.json có tồn tại không
  if (fs.existsSync(sessionFile)) {
    // Nếu có, đọc nội dung file dưới dạng chuỗi UTF-8
    const data = fs.readFileSync(sessionFile, "utf-8");
    // Parse chuỗi JSON thành object để lấy dữ liệu cũ
    currentData = JSON.parse(data);
  }

  // Tạo object newData mới, sử dụng giá trị mới nếu được cung cấp, ngược lại giữ giá trị cũ
  const newData: SessionData = {
    token: token ?? currentData.token, // Nullish coalescing: nếu token undefined/null, dùng currentData.token
    shopId: shopId ?? currentData.shopId,
    loginTime: loginTime ?? currentData.loginTime,
    expiresIn: expiresIn ?? currentData.expiresIn,
    environment: environment ?? currentData.environment,
  };

  // Ghi object newData vào file JSON, format với indent 2 spaces để dễ đọc
  fs.writeFileSync(sessionFile, JSON.stringify(newData, null, 2));
};

// Hàm export getSession: Lấy dữ liệu session từ file JSON
// Trả về object SessionData với giá trị mặc định nếu file không tồn tại hoặc thiếu dữ liệu
export const getSession = (): SessionData => {
  // Kiểm tra file có tồn tại không, nếu không trả về mặc định
  if (!fs.existsSync(sessionFile)) {
    return { token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" };
  }
  // Đọc nội dung file
  const data = fs.readFileSync(sessionFile, "utf-8");
  // Parse JSON thành object
  const parsed = JSON.parse(data);
  // Trả về object với fallback mặc định cho từng trường
  return {
    token: parsed.token || "", // Nếu parsed.token dùng ""
    shopId: parsed.shopId || "",
    loginTime: parsed.loginTime || 0, // Nếu không có, dùng 0
    expiresIn: parsed.expiresIn || 0,
    environment: parsed.environment || "",
  };
};

// Hàm export clearSession: Xóa/reset toàn bộ dữ liệu session về mặc định
export const clearSession = () => {
  // Ghi file với object mặc định
  fs.writeFileSync(sessionFile, JSON.stringify({ token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" }, null, 2));
};

// Hàm export isTokenExpired: Kiểm tra xem token có hết hạn không
// Trả về true nếu hết hạn hoặc thiếu dữ liệu, false nếu còn valid
export const isTokenExpired = (): boolean => {
  // Lấy dữ liệu session hiện tại
  const session = getSession();
  // Lấy môi trường hiện tại từ biến môi trường ENVIRONMENT, mặc định 'dev'
  const currentEnv = process.env.ENVIRONMENT || 'dev';
  // Kiểm tra điều kiện hết hạn: thiếu dữ liệu hoặc môi trường không khớp
  if (!session.token || !session.loginTime || !session.expiresIn || session.environment !== currentEnv) {
    return true; // Hết hạn
  }
  // Tính thời gian hiện tại tính bằng epoch seconds
  const now = Math.floor(Date.now() / 1000);
  // Tính thời gian đã trôi qua kể từ loginTime
  const elapsed = now - session.loginTime;
  // Kiểm tra xem elapsed có >= expiresIn không
  const expired = elapsed >= session.expiresIn;
  // Trả về kết quả
  return expired;
};
