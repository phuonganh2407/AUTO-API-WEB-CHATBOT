import { login } from "../services/api/authenticationApi/account/login.api";
import { saveSession, getSession, isTokenExpired } from "./session.helper";
import { accounts } from "../config/api/accounts.config";
import dotenv from "dotenv";
import { getIdShop } from "../services/api/authenticationApi/shop/getShop.api";

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

    const loginTime = Math.floor(Date.now() / 1000);
    const expiresIn = res.data.expiresIn;
    const environment = process.env.ENVIRONMENT || "dev";

    saveSession({ token, loginTime, expiresIn, environment });

    return token;
  },

  /**
   * Lấy shopId → lưu session
   */
  getShopIdAndSave: async () => {
    const env = process.env.ENVIRONMENT as "dev" | "stag" | "prod";
    const { shopName } = accounts[env];
    const res = await getIdShop();
    const listShops = res.data.shops;
    const shop = listShops.find((shop: any) => shop.name === shopName);
    const shopId = shop ? shop.id : null;
    
    saveSession({ shopId });
    
    return shopId;
  },

  /**
   * Kiểm tra token hết hạn, nếu có thì login lại
   */
  ensureAuth: async () => {
    if (isTokenExpired()) {
      await AuthFlowHelper.loginAndSaveToken();
    }
  },
};