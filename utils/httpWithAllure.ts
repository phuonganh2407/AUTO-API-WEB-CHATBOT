import axios from 'axios';
import { attachJson } from './allure.helper';

/**
 * callWithAllure
 * - Mục đích:
 *   Bao bọc một lời gọi dịch vụ bất đồng bộ (hàm trả về Promise) và cố gắng
 *   đính kèm (attach) payload request/response hoặc lỗi vào Allure.
 *
 * - Hành vi:
 *   - Nhận một hàm `fn` (thường là wrapper gọi HTTP như axios) và một tùy chọn
 *     tên `opts.name` để làm nhãn cho attachment.
 *   - Gọi `fn()` và nếu trả về thành công, gọi `attachJson("<name> - Response", res)`
 *     để đính kèm response (nếu Allure runtime có sẵn hoặc fallback sẽ lưu tạm).
 *   - Nếu `fn()` ném lỗi, sẽ gọi `attachJson("<name> - Error", { message, data, status })`
 *     để đính kèm thông tin lỗi rồi re-throw lỗi cho caller xử lý tiếp.
 *
 * - Input:
 *   - fn: () => Promise<T>  (hàm bất đồng bộ thực thi HTTP request)
 *   - opts?: { name?: string }  (tên dùng trong attachment)
 *
 * - Output:
 *   - Trả về kết quả của `fn()` khi thành công.
 *   - Nếu `fn()` ném lỗi, lỗi được re-throw (sau khi đính kèm thông tin lỗi).
 *
 * - Lưu ý / Edge cases:
 *   - Không thể luôn luôn thu thập 'request' trước khi gọi nếu `fn` tự tạo config bên trong.
 *     Vì vậy hàm chủ yếu đính kèm response hoặc lỗi (interceptor của axios sẽ
 *     xử lý đính kèm request/response nếu được cấu hình).
 *   - attachJson có cơ chế fallback: nếu Allure runtime chưa sẵn sàng thì sẽ
 *     lưu tạm file trong `reports/allure-results` và post-process script sẽ gắn
 *     nó vào kết quả cuối cùng.
 *   - Hàm không bắt lỗi attach để tránh che dấu lỗi gốc của lời gọi HTTP.
 *
 * Ví dụ sử dụng:
 *   await callWithAllure(() => createTag(payload), { name: 'createTag' });
 */
export async function callWithAllure<T>(fn: () => Promise<T>, opts?: { name?: string }) {
  const name = opts?.name || 'HTTP call';
  try {
    // Gọi hàm thực thi HTTP. Nếu fn() có logic tạo request trong closure chúng
    // ta không thể đọc trước request config, nên đính kèm response/lỗi sau khi
    // thực thi.
    const res = await fn();
    try {
      attachJson(`${name} - Response`, res);
    } catch (e) {
      // swallow attach errors to not ảnh hưởng tới luồng test
    }
    return res;
  } catch (err: any) {
    try {
      attachJson(`${name} - Error`, { message: err?.message, data: err?.response?.data, status: err?.response?.status });
    } catch (e) {}
    throw err;
  }
}
