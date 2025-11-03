import fs from "fs";
import path from "path";

const sessionFile = path.resolve(__dirname, "../storage/api/session.json");

//Định nghĩa cấu trúc dữ liệu session
interface SessionData {
  token: string;
  loginTime: number;
  expiresIn: number;
  environment: string;
}

const EMPTY: SessionData = { token: "", loginTime: 0, expiresIn: 0, environment: "" };

// Đọc session từ file
const readRaw = (): Partial<SessionData> => {
  try {
    //Kiểm tra file tồn tại trước khi đọc -> Nếu tồn tại thì đọc và parse JSON, nếu không trả về object rỗng
    return fs.existsSync(sessionFile) ? JSON.parse(fs.readFileSync(sessionFile, "utf-8")) : {};
  } catch {
    // Nếu có lỗi khi đọc hoặc parse, trả về object rỗng
    return {};
  }
};

//Field nào thiếu sẽ dùng giá trị mặc định (empty string hoặc 0), nên hàm này luôn trả về đầy đủ các field của SessionData
export const getSession = (): SessionData => ({ ...EMPTY, ...readRaw() });

// Lưu session với Partial type thay vì nhiều tham số optional
export const saveSession = (data: Partial<SessionData>) => {
  fs.writeFileSync(sessionFile, JSON.stringify({ ...getSession(), ...data }, null, 2));
};

//Sử dụng khi Đổi tài khoản hoặc Đổi môi trường trong khi token chưa hết hạn. Không nên ghi đè từng field riêng lẻ vì có thể sót field.
export const clearSession = () => fs.writeFileSync(sessionFile, JSON.stringify(EMPTY, null, 2));

export const isTokenExpired = (): boolean => {
  const { token, loginTime, expiresIn, environment } = getSession();
  const currentEnv = process.env.ENVIRONMENT || "prod";
  
  /**
   * Trả về true (hết hạn) nếu:
   * Không có token
   * Không có thời gian login
   * Không có thời gian sống
   * Environment khác với môi trường hiện tại (quan trọng! Nếu đổi từ dev → prod thì phải login lại)
   */
  if (!token || !loginTime || !expiresIn || environment !== currentEnv) return true;
  
  return (Math.floor(Date.now() / 1000) - loginTime) >= expiresIn;
};


/* Tóm tắt luồng hoạt động

1. Login → Lưu token, loginTime, expiresIn, environment
   saveSession({ token: "xyz", loginTime: 170000, expiresIn: 3600, environment: "dev" })

2. Mỗi lần gọi API → Kiểm tra isTokenExpired()
   - Nếu false: Dùng token cũ
   - Nếu true: Login lại

3. Đổi môi trường (dev → prod) → isTokenExpired() = true → Bắt buộc login lại

4. Xóa session → clearSession() → Reset về EMPTY
*/