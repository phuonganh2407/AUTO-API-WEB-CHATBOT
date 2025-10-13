import fs from "fs";
import path from "path";

const sessionFile = path.resolve(__dirname, "../storage/session.json");

interface SessionData {
  token: string;
  shopId: string;
  loginTime: number; // Thời gian login (epoch seconds)
  expiresIn: number; // Thời gian sống còn (giây)
  environment: string; // Môi trường (dev, stag, prod)
}

export const saveSession = (token?: string, shopId?: string, loginTime?: number, expiresIn?: number, environment?: string) => {
  let currentData: SessionData = { token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" };

  // Đọc file cũ nếu có
  if (fs.existsSync(sessionFile)) {
    const data = fs.readFileSync(sessionFile, "utf-8");
    currentData = JSON.parse(data);
  }

  const newData: SessionData = {
    token: token ?? currentData.token,
    shopId: shopId ?? currentData.shopId,
    loginTime: loginTime ?? currentData.loginTime,
    expiresIn: expiresIn ?? currentData.expiresIn,
    environment: environment ?? currentData.environment,
  };

  fs.writeFileSync(sessionFile, JSON.stringify(newData, null, 2));
};

export const getSession = (): SessionData => {
  if (!fs.existsSync(sessionFile)) {
    return { token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" };
  }
  const data = fs.readFileSync(sessionFile, "utf-8");
  const parsed = JSON.parse(data);
  return {
    token: parsed.token || "",
    shopId: parsed.shopId || "",
    loginTime: parsed.loginTime || 0,
    expiresIn: parsed.expiresIn || 0,
    environment: parsed.environment || "",
  };
};

export const clearSession = () => {
  fs.writeFileSync(sessionFile, JSON.stringify({ token: "", shopId: "", loginTime: 0, expiresIn: 0, environment: "" }, null, 2));
};

export const isTokenExpired = (): boolean => {
  const session = getSession();
  const currentEnv = process.env.ENVIRONMENT || 'dev';
  if (!session.token || !session.loginTime || !session.expiresIn || session.environment !== currentEnv) {
    return true;
  }
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - session.loginTime;
  const expired = elapsed >= session.expiresIn;
  return expired;
};
