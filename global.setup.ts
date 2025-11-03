/**
 * global.setup.ts
 * Mục đích: đảm bảo trước khi chạy test có token, shopId, ownerId hợp lệ.
 * Gom logic auth vào một nơi thay vì phụ thuộc file helper riêng lẻ.
 */

process.env.DOTENV_CONFIG_SILENT = 'true';

// Import trực tiếp các hàm cần thiết
const { login } = require('./services/api/authenticationApi/login.api');
const { saveSession, getSession, isTokenExpired } = require('./utils/session.helper');
const { accounts } = require('./config/api/accounts.config');

async function loginAndSaveToken() {
  const env = process.env.ENVIRONMENT || 'dev';
  const { username, password, client_id } = accounts[env];
  const res = await login({
    username: username,
    password: password,
    client_id: client_id,
    grant_type: 'password',
    scope: 'AccountApp WionPosV2App'
  });
  console.log("Login response:", res.data);
  const token = res?.data?.access_token;
  if (!token) throw new Error('Không lấy được token!');
  const loginTime = Math.floor(Date.now() / 1000);
  const expiresIn = res.data.expires_in;
  saveSession({ token, loginTime, expiresIn, environment: env });
  return token;
}

module.exports = async () => {
  // Nếu token hết hạn hoặc chưa có => login lại
  if (isTokenExpired()) {
    await loginAndSaveToken();
  }
};