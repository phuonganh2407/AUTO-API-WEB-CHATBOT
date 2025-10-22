/**
 * global.setup.ts
 * Mục đích: đảm bảo trước khi chạy test có token và shopId hợp lệ.
 * Nếu token hết hạn, sẽ tự động login để lấy token mới.
 * Sau đó lấy shopId nếu chưa có.
 */
const { AuthFlowHelper } = require('./utils/infoAccount.helper');

module.exports = async () => {
  // Đăng nhập và lấy shopId chỉ khi cần
  await AuthFlowHelper.loginAndSaveTokenAndShop();
};