import axios from "axios";
import { getSession } from "../utils/session.helper";
import { baseURL } from "../config/urls.config";

/**
 * Tạo instance axios với cấu hình mặc định của request
 */
const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  //Check đảm bảo tồn tại headers
  if (!config.headers) {
    config.headers = {} as typeof config.headers;
  }

  // Get token and shopId from session
  const { token, shopId } = getSession();
  const env = process.env.ENVIRONMENT || 'dev';
  const { tenant } = require('../config/accounts.config').accounts[env];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (shopId) {
    config.headers.shopId = shopId;
  }

  // Thêm tenant vào header
  config.headers.tenant = tenant;

   // ✅ Log
  console.log("🚀 [REQUEST]", {
    url: config.url,
    method: config.method?.toUpperCase(),
    headers: config.headers,
    data: config.data
  });

  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API error:", {
      url: err.config?.url,
      status: err.response?.status,
      message: err.message,
    });
    throw err;
  }
);

export default axiosClient;
