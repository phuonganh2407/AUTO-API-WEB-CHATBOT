/**
 * global.setup.ts
 * Mục đích: đảm bảo trước khi chạy test có token và shopId hợp lệ.
 * Nếu token hết hạn, sẽ tự động login để lấy token mới.
 * Sau đó lấy shopId nếu chưa có.
 */
const { AuthFlowHelper } = require('./utils/infoAccount.helper');

module.exports = async () => {
  // Kiểm tra và refresh token nếu cần
  await AuthFlowHelper.ensureAuth();
  // Lấy shopId nếu chưa có
  await AuthFlowHelper.getShopIdAndSave();
};