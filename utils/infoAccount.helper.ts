import { login } from "../services/authentication/account/login.api";
import { saveSession, getSession, isTokenExpired } from "./session.helper";
import { accounts } from "../config/accounts.config";
import dotenv from "dotenv";
import { getIdShop } from "../services/authentication/shop/getShop.api";

dotenv.config();

export const AuthFlowHelper = {
  /**
   * Đăng nhập và lấy shopId, lưu cả token và shopId vào session
   */
  loginAndSaveTokenAndShop: async () => {
    if (isTokenExpired()) {
      const token = await AuthFlowHelper.loginAndSaveToken();
      await AuthFlowHelper.getShopIdAndSave();
      return token;
    }
    // Nếu token chưa hết hạn thì không làm gì cả
    return getSession().token;
  },
  /**
   * Đăng nhập → lấy token → lưu session với expireToken
   */
  loginAndSaveToken: async () => {
    const env = process.env.ENVIRONMENT as "dev" | "stag" | "prod";
    const { username, password } = accounts[env];

    const res = await login(username, password);
    const token = res.data.accessToken;

    if (!token) throw new Error("Không lấy được token!");

    // Lưu loginTime (thời gian login) và expiresIn (thời gian sống còn từ API)
    const loginTime = Math.floor(Date.now() / 1000); // Thời gian login (epoch seconds) => nếu mún chuyển sang format date thì dùng: new Date(loginTime * 1000).toISOString()
    const expiresIn = res.data.expiresIn; // Thời gian hiệu lực của token lấy từ response (giây)
    const currentEnv = process.env.ENVIRONMENT || 'dev'; // Môi trường hiện tại => Được chuyển theo môi trường khi chạy test
    saveSession(token, undefined, loginTime, expiresIn, currentEnv); // Lưu token, loginTime, expiresIn, environment

    return token;
  },

  /**
   * Lấy shopId → lưu session
   */
  getShopIdAndSave: async () => {
    const env = process.env.ENVIRONMENT as "dev" | "stag" | "prod";
    const { shopName } = accounts[env]; //lấy tên shop mong muốn từ config
    const res = await getIdShop();
    const listShops = res.data.shops;
    const shop = listShops.find((shop: any) => shop.name === shopName); // tìm shop theo tên cửa hàng theo môi trường
    const shopId = shop ? shop.id : null;
    saveSession(undefined, shopId);
    // console.log("ShopID saved:", shopId);
    return shopId;
  },

  /**
   * Kiểm tra token hết hạn, nếu có thì login lại
   */
  ensureAuth: async () => {
    if (isTokenExpired()) { // Gọi hàm kiểm tra: nếu (now - loginTime) >= expiresIn, thì login
      await AuthFlowHelper.loginAndSaveToken();
    }
  },
};
