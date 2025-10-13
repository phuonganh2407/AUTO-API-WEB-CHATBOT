/**
 * File cấu hình URLs cho các API endpoints
 * Sử dụng biến môi trường để cấu hình base URLs cho các service khác nhau
 */

// Import thư viện dotenv để load biến môi trường từ file .env
import dotenv from "dotenv";
// Import module path để xử lý đường dẫn file
import path from "path";

// Lấy giá trị ENVIRONMENT từ process.env (ví dụ: 'dev', 'stag', 'prod')
const ENV = process.env.ENVIRONMENT;
// Xây dựng đường dẫn tuyệt đối đến file .env tương ứng với môi trường
// Ví dụ: ../environments/.env.dev
const envPath = path.resolve(__dirname, '../environments', `.env.${ENV}`);

// Load biến môi trường từ file .env được chỉ định
dotenv.config({ path: envPath });

// console.log("ENV:", ENV);
// console.log("BASE_URL:", process.env.BASE_URL);

// Export các base URLs từ biến môi trường
export const baseURL = process.env.BASE_URL; // URL cơ sở chung (có thể không dùng)
export const productBaseURL = process.env.BASE_PRODUCT_URL; // URL cơ sở cho Product service
export const authenBaseURL = process.env.BASE_AUTHENTICATION_URL; // URL cơ sở cho Authentication service

// Export object chứa các endpoints cho Product service
export const baseProductEndpoints = {
  attributes: `${productBaseURL}/attribute`, // Endpoint cho attributes API
  urlCreateTag: `${productBaseURL}/tag`, // Endpoint cho tags API
  urlGetTagColor: `${productBaseURL}/tag/color`, // Endpoint lấy màu thẻ tag

}

// Export object chứa các endpoints cho Authentication service
export const baseAuthEndpoints = {
  urlLogin: `${authenBaseURL}/sign-in/password`, // Endpoint đăng nhập bằng password
  urlGetAllShops: `${authenBaseURL}/shops/all`, // Endpoint lấy danh sách tất cả shops
}