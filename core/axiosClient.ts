import axios from "axios";
import { getSession } from "../utils/session.helper";
import { baseURL } from "../config/urls.config";
import { attachJson } from "../utils/allure.helper";

/**
 * Axios client dùng chung cho các API calls trong project.
 * - baseURL: giá trị mặc định lấy từ `config/urls.config`
 * - timeout: 10s cho các request
 * - header Content-Type mặc định là application/json
 *
 * Mục đích: tạo 1 instance tái sử dụng để dễ cấu hình chung
 * và thêm interceptors (đăng kí trước/sau request) tập trung.
 */
const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  // Đảm bảo luôn có object headers để tránh lỗi khi gán
  if (!config.headers) {
    config.headers = {} as typeof config.headers;
  }

  // Lấy token và shopId từ session (nếu có) để thêm vào header
  const { token, shopId } = getSession();
  const env = process.env.ENVIRONMENT || 'dev';
  const { tenant } = require('../config/accounts.config').accounts[env];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (shopId) {
    config.headers.shopId = shopId;
  }

  // Chỉ thêm tenant khi là request login (ví dụ url chứa 'sign-in')
  if (config.url && config.url.includes('sign-in')) {
    config.headers.tenant = tenant;
  }

  // Nếu test wrapper đang chạy, test sẽ set global.__CURRENT_TEST_ID__
  // Thêm header x-test-id để downstream (server/logs) và response interceptor biết thuộc test nào
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g: any = global as any;
    if (g.__CURRENT_TEST_ID__) {
      config.headers['x-test-id'] = g.__CURRENT_TEST_ID__;
    }
  } catch (e) {}

  // Xây dựng fullUrl bao gồm query params để attach dễ đọc
  let fullUrl = config.url;
  if (config.params) {
    const queryString = new URLSearchParams(config.params).toString();
    fullUrl = `${config.url}?${queryString}`;
  }

  // Nếu bật biến môi trường ALLURE_DEBUG thì in verbose request để debug nhanh
  try {
    if (process.env.ALLURE_DEBUG) {
      // eslint-disable-next-line no-console
      console.log("🚀 [REQUEST]", {
        url: fullUrl,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        params: config.params,
        data: config.data,
      });
    }
  } catch (e) {}

  // Ghi attachment request cho Allure (nội dung: url, method, headers, params, body)
  // Nếu Allure runtime chưa sẵn sàng, hàm attachJson sẽ fallback lưu tạm để post-process.
  try {
    attachJson('HTTP Request', {
      url: fullUrl,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      params: config.params,
      data: config.data,
      // Đính kèm testId (nếu có) để post-process dễ map attachment -> test
      __testId: (config.headers as any)['x-test-id'] || null,
    });
  } catch (e) {
    // Nếu attach lỗi thì im lặng, không làm hỏng request
  }

  return config;
});

axiosClient.interceptors.response.use(
  // Success handler: attach response body/headers/status cho Allure để dễ debug
  (res) => {
    try {
      attachJson('HTTP Response', {
        url: res.config?.url,
        status: res.status,
        headers: res.headers,
        data: res.data,
        __testId: (res.config?.headers as any)?.['x-test-id'] || null,
      });
    } catch (e) {}
    return res;
  },
  // Error handler: attach lỗi (status/message/response body) rồi re-throw để test thấy lỗi
  (err) => {
    try {
      attachJson('HTTP Error', {
        url: err.config?.url,
        status: err.response?.status,
        message: err.message,
        response: err.response?.data,
        __testId: (err.config?.headers as any)?.['x-test-id'] || null,
      });
    } catch (e) {}

    // In ra console đầy đủ cho developer (chạy local sẽ thấy log)
    console.error("❌ API error:", {
      url: err.config?.url,
      status: err.response?.status,
      message: err.message,
      response: err.response?.data, // Log toàn bộ body lỗi
    });

    // Rethrow để caller (test) nhận và fail đúng cách
    throw err;
  }
);

export default axiosClient;
