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
const envPath = path.resolve(__dirname, '../../enviroments', `.env.${ENV}`);

// Load biến môi trường từ file .env được chỉ định
dotenv.config({ path: envPath });

// console.log("ENV:", ENV);
// console.log("BASE_URL:", process.env.BASE_URL);

/**
 * Export các base URLs từ biến môi trường
 */
export const baseURL = process.env.BASE_URL; // URL cơ sở chung (có thể không dùng)
export const storageID = process.env.STORAGE_ID; // Storage ID dùng cho các service API
export const channelID = process.env.CHANNEL_ID; // Channel ID dùng cho các service API


/**
 * Export object chứa các endpoints cho Authentication service
 */
export const baseAuthEndpoints = {
  urlLogin: `${baseURL}/token`, // Endpoint đăng nhập bằng password
};
 
export const baseProductEndpoints = {
  urlCreateAttribute: `${baseURL}/api-chatbot/shop-manager/v1.1/general_schema/${storageID}/update` 
};