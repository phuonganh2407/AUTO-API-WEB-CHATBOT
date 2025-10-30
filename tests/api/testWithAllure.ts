// Helper nhỏ để đảm bảo tên test và ID được gán đồng bộ trước khi body test chạy.
// Sử dụng `testWithAllure('tên', async () => { ... })` thay cho `test(...)` khi cần
// bắt mọi HTTP request phát sinh trong test và gắn attachment vào Allure.
import { test as jestTest } from '@jest/globals';

export function testWithAllure(name: string, fn: any, timeout?: number) {
  // Gán tên test vào global một cách đồng bộ trước khi body test được gọi
  const wrappedFn: any = async () => {
    try {
      // Tạo testId duy nhất cho test và lưu mapping id -> tên test
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
      (global as any).__CURRENT_TEST_ID__ = id;
  // Ghi mapping bền vững (testId -> fullName) ra đĩa để post-process có thể
  // ánh xạ testId về tên đầy đủ của test sau này; không cần giữ bản đồ trong bộ nhớ.
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fs = require('fs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const path = require('path');
        const resultsDir = path.resolve(process.cwd(), 'reports', 'allure-results');
        if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  // Cố gắng suy ra 'feature' từ đường dẫn file gọi test (ví dụ folder module-tags -> Tags)
  function detectFeature() {
          try {
            const st = (new Error()).stack || '';
            const lines = st.split(/\r?\n/);
            for (const l of lines) {
              // match paths that include /tests/ or \tests\
              const m = l.match(/(\\|\/)(tests)(\\|\/)(.*)/i);
              if (m) {
                // extract the remainder after 'tests/'
                const idx = l.indexOf(m[0]);
                const sub = l.slice(idx + m[0].length);
                // split path segments
                const parts = sub.split(/[\\\/]/).filter(Boolean);
                // find module-xxx segment if exists
                const moduleSeg = parts.find(p => p.startsWith('module-')) || parts[0];
                if (!moduleSeg) return null;
                let feat = moduleSeg;
                if (feat.startsWith('module-')) feat = feat.replace(/^module-/, '');
                feat = feat.replace(/[-_]/g, ' ');
                feat = feat.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                return feat;
              }
            }
          } catch (e) {}
          return null;
        }

  const mapLine = JSON.stringify({ testId: id, fullName: name });
        fs.appendFileSync(path.join(resultsDir, '__testid_map.jsonl'), mapLine + '\n', 'utf8');
      } catch (e) {
        // ignore
      }
      // Lưu tên test vào biến global để axios interceptor có thể đọc (fallback)
      (global as any).__CURRENT_TEST_NAME__ = name;
      // Gọi hàm test gốc (có thể sync hoặc async)
      return await fn();
    } finally {
      // Không xóa ngay tên/testId ở đây — afterEach (tests/setupAllure.ts)
      // sẽ gọi flushBufferedAllureAttachments() và có thể dọn dẹp các biến global.
    }
  };

  if (typeof timeout === 'number') {
    return jestTest(name, wrappedFn as any, timeout);
  }
  return jestTest(name, wrappedFn as any);
}
