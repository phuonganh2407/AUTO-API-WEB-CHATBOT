// tests/setupAllure.ts
import { flushBufferedAllureAttachments } from '../../utils/allure.helper';

// File này chạy sau khi môi trường Jest được khởi tạo (được cấu hình trong jest.config.ts)
// Mục tiêu:
// - Thiết lập biến global `__CURRENT_TEST_NAME__` mỗi beforeEach để các interceptor
//   HTTP có thể liên kết log/attachment với test hiện tại.
// - Trong afterEach gọi `flushBufferedAllureAttachments()` để cố gắng gắn các
//   attachment tạm thời (nếu có) vào result JSON hoặc runtime khi reporter sẵn sàng.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g: any = global as any;

beforeEach(() => {
  try {
    // Tries lấy tên test hiện tại từ expect.getState() (phiên bản Jest mới)
    // Nếu không có, fallback về null
    const state = require('@jest/globals').expect?.getState?.();
    g.__CURRENT_TEST_NAME__ = state?.currentTestName ?? null;
  } catch {
    g.__CURRENT_TEST_NAME__ = null;
  }
});

afterEach(async () => {
  try {
    // Thử flush trực tiếp (hàm async export từ utils/allure.helper)
    // In thông tin debug trước khi flush để tiện kiểm tra buffer và mapping
    const g: any = global as any;
    try {
      
      console.log('[setupAllure] before flush - buffer length:', (g.__ALLURE_ATTACHMENT_BUFFER__ || []).length);
      
      console.log('[setupAllure] before flush - testId mapping keys:', Object.keys(g.__TEST_ID_TO_NAME__ || {}).length);
    } catch (e) {
      // ignore debug print errors
    }
    const flushed = await flushBufferedAllureAttachments();
    
    console.log('[setupAllure] afterEach: flushBufferedAllureAttachments -> remainingBuffer:', flushed);
    try {
      
      console.log('[setupAllure] after flush - buffer length:', (g.__ALLURE_ATTACHMENT_BUFFER__ || []).length);
    } catch (e) {}
  } catch (e) {
    // ignore
  } finally {
    try {
      // Reset tên test hiện tại để tránh rò rỉ giữa các test
      g.__CURRENT_TEST_NAME__ = null;
    } catch {}
  }
});

export {};
