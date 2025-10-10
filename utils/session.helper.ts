import fs from "fs";
import path from "path";

const sessionFile = path.resolve(__dirname, "../storage/session.json");

interface SessionData {
  token: string;
  shopId: string;
}

export const saveSession = (token?: string, shopId?: string) => {
  let currentData: SessionData = { token: "", shopId: "" };

  // Đọc file cũ nếu có
  if (fs.existsSync(sessionFile)) {
    const data = fs.readFileSync(sessionFile, "utf-8");
    currentData = JSON.parse(data);
  }

  const newData: SessionData = {
    token: token ?? currentData.token,
    shopId: shopId ?? currentData.shopId,
  };

  fs.writeFileSync(sessionFile, JSON.stringify(newData, null, 2));
};

export const getSession = (): SessionData => {
  if (!fs.existsSync(sessionFile)) {
    return { token: "", shopId: "" };
  }
  const data = fs.readFileSync(sessionFile, "utf-8");
  return JSON.parse(data);
};

export const clearSession = () => {
  fs.writeFileSync(sessionFile, JSON.stringify({ token: "", shopId: "" }, null, 2));
};
