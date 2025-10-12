import { login } from "../services/authentication/account/login.api";
import { saveSession } from "./session.helper";
import { accounts } from "../config/accounts.config";
import dotenv from "dotenv";
import { getIdShop } from "../services/authentication/shop/getShop.api";

dotenv.config();

export const AuthFlowHelper = {
  /**
   * Đăng nhập → lấy token → lưu session
   */
  loginAndSaveToken: async () => {
    const env = process.env.ENVIRONMENT as "dev" | "stag" | "prod";
    const { username, password } = accounts[env];

    const res = await login(username, password);
    const token = res.data.accessToken;

    if (!token) throw new Error("Không lấy được token!");

    saveSession(token, ""); // chỉ lưu token

    return token;
  },

  /**
   * Lấy shopId → lưu session
   */
  getShopIdAndSave: async () => {
    const env = process.env.ENVIRONMENT as "dev" | "stag" | "prod";
    const { shopName } = accounts[env]; // 👈 lấy tên shop mong muốn từ config
    const res = await getIdShop();
    const listShops = res.data.shops;
    const shop = listShops.find((shop: any) => shop.name === shopName); // tìm shop theo tên cửa hàng theo môi trường
    const shopId = shop ? shop.id : null;
    saveSession(undefined, shopId);
    console.log("✅ ShopID saved:", shopId);
    return shopId;
  },

  /**
   * Full flow login + lấy shopId
   */
  // initFullAuthFlow: async () => {
  //   await AuthFlowHelper.loginAndSaveToken();
  //   // await AuthFlowHelper.getShopIdAndSave();
  // },
};
