/**
 * File cấu hình URLs cho các API endpoints
 * Sử dụng biến môi trường để cấu hình base URLs cho các service khác nhau
 */

// Import thư viện dotenv để load biến môi trường từ file .env
import dotenv from "dotenv";
import { url } from "inspector";
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

/**
 * Export các base URLs từ biến môi trường
 */
export const baseURL = process.env.BASE_URL; // URL cơ sở chung (có thể không dùng)

export const productBaseURL = process.env.BASE_PRODUCT_URL; // URL cơ sở cho Product service

export const authenBaseURL = process.env.BASE_AUTHENTICATION_URL; // URL cơ sở cho Authentication service

export const customerBaseURL = process.env.BASE_CUSTOMER_URL; // URL cơ sở cho Customer service

export const publicBaseURL = process.env.BASE_LOCATION_URL; // URL cơ sở cho Public service
/**
 * Export object chứa các endpoints cho Product service
 */
export const baseProductEndpoints = {
  attributes: `${productBaseURL}/attribute`, // Endpoint cho attributes API

  urlCreateTag: `${productBaseURL}/tag`, // Endpoint cho tags API

  urlDetailTag: `${productBaseURL}/tag`, // Endpoint chi tiết tag theo ID

  urlGetTagColor: `${productBaseURL}/tag-color`, // Endpoint lấy màu thẻ tag

  urlSearchTags: `${productBaseURL}/tag`, // Endpoint tìm kiếm thẻ tag

  urlEditTags: `${productBaseURL}/tag`, // Endpoint chỉnh sửa thẻ tag

  urlDeleteTag: `${productBaseURL}/tag`, // Endpoint xóa thẻ tag
}

/**
 * Export object chứa các endpoints cho Authentication service
 */
export const baseAuthEndpoints = {
  urlLogin: `${authenBaseURL}/sign-in/password`, // Endpoint đăng nhập bằng password

  urlGetAllShops: `${authenBaseURL}/shops/all`, // Endpoint lấy danh sách tất cả shops

  urlGetShopUserInfo: `${authenBaseURL}/shop-users`, // Endpoint lấy thông tin shop user hiện tại
}

/**
 * Export object chứa các endpoints cho Customer service
 */
export const baseCustomerEndpoints = {
  urlCreateGroupCustomer: `${customerBaseURL}/customer-groups`, // Endpoint tạo nhóm khách hàng

  urlGetListGroupCustomer: `${customerBaseURL}/customer-groups`, // Endpoint lấy danh sách nhóm khách hàng

  urlEditGroupCustomer: `${customerBaseURL}/customer-groups`, // Endpoint chỉnh sửa nhóm khách hàng

  urlDeleteGroupCustomer: `${customerBaseURL}/customer-groups`, // Endpoint xóa nhóm khách hàng

  urlCreateCustomer: `${customerBaseURL}/customer`, // Endpoint tạo khách hàng
  urlDetailCustomer: `${customerBaseURL}/customer`, // Endpoint lấy chi tiết khách hàng
}

/**
 * Export object chứa các endpoints cho Public service
 */
export const basePublicEndpoints = {
  urlGetCitiesCodes: `${publicBaseURL}/location/cities`, // Endpoint lấy mã thành phố

  urlGetDistrictsCodes: `${publicBaseURL}/location/districts`, // Endpoint lấy mã quận/huyện

  urlGetWardsCodes: `${publicBaseURL}/location/wards`, // Endpoint lấy mã phường/xã
}
