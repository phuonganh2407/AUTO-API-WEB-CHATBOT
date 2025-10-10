/**
 * Thư viện dùng để đọc biến môi trường từ file .env
 * Gọi để load biến môi trường vào process.env
 */
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.ENVIRONMENT || "dev";
const envPath = path.resolve(__dirname, '../enviroments', `.env.${ENV}`);

dotenv.config({ path: envPath });

export const baseURL = process.env.BASE_URL;
export const productBaseURL = process.env.BASE_PRODUCT_URL;
export const authenBaseURL = process.env.BASE_AUTHENTICATION_URL;


export const baseProductEndpoints = {
  attributes: `${productBaseURL}/attribute`,
  tags: `${productBaseURL}/tag`
}

export const baseAuthEndpoints = {
  urlLogin: `${authenBaseURL}/sign-in/password`,
}