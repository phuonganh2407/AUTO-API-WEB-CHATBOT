/**
 * global.setup.ts
 * Mục đích: đảm bảo trước khi chạy test có token, shopId, ownerId hợp lệ.
 * Gom logic auth vào một nơi thay vì phụ thuộc file helper riêng lẻ.
 */

process.env.DOTENV_CONFIG_SILENT = 'true';

// Import trực tiếp các hàm cần thiết
const { login } = require('./services/api/authenticationApi/account/login.api');
const { getIdShop } = require('./services/api/authenticationApi/shop/getShop.api');
const { getShopUserInfo } = require('./services/api/authenticationApi/shop/shopUser.api');
const { saveSession, getSession, isTokenExpired } = require('./utils/session.helper');
const { accounts } = require('./config/api/accounts.config');

async function loginAndSaveToken() {
  const env = process.env.ENVIRONMENT || 'dev';
  const { username, password } = accounts[env];
  const res = await login(username, password);
  const token = res?.data?.accessToken;
  if (!token) throw new Error('Không lấy được token!');
  const loginTime = Math.floor(Date.now() / 1000);
  const expiresIn = res.data.expiresIn;
  saveSession({ token, loginTime, expiresIn, environment: env });
  return token;
}

async function getShopIdAndSave() {
  const env = process.env.ENVIRONMENT || 'dev';
  const { shopName } = accounts[env];
  const res = await getIdShop();
  const listShops = res.data.shops || [];
  const shop = listShops.find((s: any) => s.name === shopName);
  const shopId = shop ? shop.id : null;
  saveSession({ shopId });
  return shopId;
}

async function getOwnerIdAndSave() {
  const env = process.env.ENVIRONMENT || 'dev';
  const { nameOwner } = accounts[env];
  const res = await getShopUserInfo();
  const listUsers = res.data.shopUsers || [];
  const owner = listUsers.find((u: any) => u.name === nameOwner);
  const ownerId = owner ? owner.userId : null;
  saveSession({ ownerId });
  return ownerId;
}

module.exports = async () => {
  // Nếu token hết hạn hoặc chưa có => login lại
  if (isTokenExpired()) {
    await loginAndSaveToken();
    await getShopIdAndSave();
    await getOwnerIdAndSave();
  } else {
    // Nếu chưa có shopId/ownerId trong session thì bổ sung
    const { shopId, ownerId } = getSession();
    if (!shopId) await getShopIdAndSave();
    if (!ownerId) await getOwnerIdAndSave();
  }
};