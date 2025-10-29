// utils/allure.helper.ts
// Helper an toàn để làm việc với Allure runtime từ nhiều môi trường khác nhau.
// File này cung cấp các tiện ích:
// - safeAllure(): cố gắng tìm instance Allure runtime (từ global, globalThis,
//   hoặc require các module phổ biến) một cách an toàn.
// - attachJson(name, obj): đính kèm một payload JSON vào Allure nếu runtime
//   sẵn sàng; nếu không, lưu tạm vào bộ nhớ/đĩa để post-process.
// - flushBufferedAllureAttachments(): khi runtime có sẵn, flush (đính kèm)
//   các attachments đã lưu tạm vào các `*-result.json` hoặc runtime trực tiếp.

// Hàm tìm instance Allure runtime an toàn.
export function safeAllure(): any | null {
  try {
    const g: any = global as any;
    if (g?.allure) return g.allure;
    const gh: any = (globalThis as any)?.allure;
    if (gh) return gh;
    try {
      
      const mod = require('jest-allure2');
      if (mod) {
        if (mod.allure) return mod.allure;
        if (mod.default?.allure) return mod.default.allure;
      }
    } catch {}
    try {
      
      const mod2 = require('@shelex/jest-allure2');
      if (mod2) {
        if (mod2.allure) return mod2.allure;
        if (mod2.default?.allure) return mod2.default.allure;
      }
    } catch {}
    try {
      
      const ajc = require('allure-js-commons');
      if (ajc) {
        if (ajc.allure) return ajc.allure;
        if (ajc.default?.allure) return ajc.default.allure;
      }
    } catch {}
  } catch (e) {}
  return null;
}

export function attachJson(name: string, obj: any) {
  const allure = safeAllure();
  const content = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
  // Nếu không tìm thấy allure tại runtime hiện tại, cố gắng một lần nữa bằng
  // cách require trực tiếp runtime module (last-ditch). Nếu vẫn không có, thì
  // push vào buffer trong global và ghi file tạm vào reports/allure-results.
  if (!allure) {
    // Last-ditch: thử require runtime trực tiếp
    try {
      
      const rt = require('jest-allure2/dist/runtime') || require('@shelex/jest-allure2/dist/runtime');
      const runtimeAllure = rt?.allure || rt?.default?.allure;
      if (runtimeAllure) {
        try {
          if (typeof runtimeAllure.attachment === 'function') return runtimeAllure.attachment(name, content, 'application/json');
          if (typeof runtimeAllure.addAttachment === 'function') return runtimeAllure.addAttachment(name, content, 'application/json');
          if (typeof runtimeAllure.writeAttachment === 'function') return runtimeAllure.writeAttachment(content, 'application/json', name);
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }

    // push into in-memory buffer for later flush
    try {
      
      const g: any = global as any;
      if (!g.__ALLURE_ATTACHMENT_BUFFER__) g.__ALLURE_ATTACHMENT_BUFFER__ = [];
      const testId = g.__CURRENT_TEST_ID__ || null;
      const testName = g.__CURRENT_TEST_NAME__ || null;
      g.__ALLURE_ATTACHMENT_BUFFER__.push({ name, content, type: 'application/json', testName, testId });
  // Ghi file tạm trên đĩa để attachment tồn tại qua các process (CI runners,
  // jest worker processes...). Post-process script sẽ đọc các file này để
  // gắn vào result JSON khi khả dụng.
      try {
        
        const fs = require('fs');
        
        const path = require('path');
        const resultsDir = path.resolve(process.cwd(), 'reports', 'allure-results');
        if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
        const tmpName = `__tmpattach-${testId || 'noid'}-${Date.now()}-${Math.random().toString(36).slice(2,8)}.json`;
        const tmpPath = path.join(resultsDir, tmpName);
        // Ghi async; các lỗi khi ghi file tạm sẽ bị bỏ qua để không làm vỡ test.
        fs.promises.writeFile(tmpPath, JSON.stringify({ name, content, type: 'application/json', testName, testId }, null, 2), 'utf8').catch(() => {});
      } catch (e) {}
      
      console.warn(`[allure.helper] Chưa có Allure runtime — lưu tạm attachment: ${name} (testName=${testName} testId=${testId})`);
    } catch (e) {}
    return;
  }

  // runtime available: attach via common APIs
  try {
    if (typeof allure.attachment === 'function') return allure.attachment(name, content, 'application/json');
    if (typeof allure.addAttachment === 'function') return allure.addAttachment(name, content, 'application/json');
    if (typeof allure.addAttachmentRaw === 'function') return allure.addAttachmentRaw(content, 'application/json', name);
    if (typeof allure.writeAttachment === 'function') return allure.writeAttachment(content, 'application/json', name);
    try { allure.step(name, () => {}); } catch {}
  } catch (e) {}
}

export async function flushBufferedAllureAttachments(): Promise<number> {
  try {
    
    const g: any = global as any;
    const gb = g.__ALLURE_ATTACHMENT_BUFFER__ || [];
    try {
      // Thông tin debug hữu ích khi chạy local/CI
      
      console.log('[allure.helper] flushBufferedAllureAttachments - buffer length:', gb.length);
      if (gb.length) console.log('[allure.helper] buffer items:', gb.map((i: any) => ({ name: i.name, testName: i.testName, testId: i.testId })));
    } catch (e) {}
    if (!gb.length) return 0;

    // Try filesystem-based attaching first
    try {
      
      const fs = require('fs');
      
      const path = require('path');
      const resultsDir = path.resolve(process.cwd(), 'reports', 'allure-results');
      const fsp = fs.promises;
      try {
        const files = await fsp.readdir(resultsDir);
        let resultFiles = files.filter((f: string) => f.endsWith('-result.json'));
        const results: Array<{ file: string; data: any }> = [];
        for (const rf of resultFiles) {
          try {
            const fullPath = path.join(resultsDir, rf);
            const text = await fsp.readFile(fullPath, 'utf8');
            const data = JSON.parse(text);
            results.push({ file: fullPath, data });
          } catch (e) {}
        }

  const remaining: any[] = [];
  // Khi cố gắng gán attachment vào `*-result.json`, ta đợi tới `maxWaitMs`
  // để file result được tạo bởi jest-allure. Thời gian chờ và khoảng polling
  // có thể điều chỉnh tuỳ môi trường CI.
  const maxWaitMs = 5000;
  const pollIntervalMs = 200;

        const loadResults = async () => {
          const fresh: Array<{ file: string; data: any }> = [];
          for (const rf of resultFiles) {
            try {
              const fullPath = path.join(resultsDir, rf);
              const text = await fsp.readFile(fullPath, 'utf8');
              const data = JSON.parse(text);
              fresh.push({ file: fullPath, data });
            } catch (e) {}
          }
          return fresh;
        };

        for (const item of gb) {
          let testName = item.testName || null;
          if (!testName && item.testId) {
            const mapping = (global as any).__TEST_ID_TO_NAME__ || {};
            testName = mapping[item.testId] || null;
          }
          if (!testName) {
            remaining.push(item);
            continue;
          }

          let match: { file: string; data: any } | undefined = undefined;
          const start = Date.now();
          let currentResults = results;
          const matchesTest = (rdata: any, tn: string) => {
            if (!rdata || !tn) return false;
            const fullName = String(rdata.fullName || '');
            const name = String(rdata.name || '');
            if (fullName === tn || name === tn) return true;
            if (fullName.endsWith(tn) || fullName.includes(tn)) return true;
            if (name.includes(tn)) return true;
            return false;
          };

          while (Date.now() - start < maxWaitMs) {
            match = currentResults.find(r => matchesTest(r.data, testName));
            if (match) break;
            try {
              const filesNow = await fsp.readdir(resultsDir);
              const resultFilesNow = filesNow.filter((f: string) => f.endsWith('-result.json'));
              if (resultFilesNow.length !== resultFiles.length || resultFilesNow.some((f: string, idx: number) => f !== resultFiles[idx])) {
                resultFiles = resultFilesNow;
                currentResults = await loadResults();
              }
            } catch (e) {}
            await new Promise(res => setTimeout(res, pollIntervalMs));
          }

          if (!match) {
            // Không tìm thấy result JSON khớp với testName trong khoảng chờ
            // -> lưu vào remaining để xử lý sau (hoặc debug file)
            remaining.push(item);
            continue;
          }

          try {
            const uuid = match.data.uuid || path.basename(match.file).replace('-result.json','');
            const attachFilename = `${uuid}-attachment-${Date.now()}-${Math.random().toString(36).slice(2,8)}.json`;
            const attachPath = path.join(resultsDir, attachFilename);
            // Ghi file attachment và cập nhật trường attachments trong result JSON
            await fsp.writeFile(attachPath, item.content, 'utf8');
            if (!Array.isArray(match.data.attachments)) match.data.attachments = [];
            match.data.attachments.push({ source: attachFilename, type: item.type || 'application/json', name: item.name });
            await fsp.writeFile(match.file, JSON.stringify(match.data, null, 2), 'utf8');
          } catch (e) {
            remaining.push(item);
          }
        }

        // Cập nhật buffer trong global với những phần chưa gắn được
        g.__ALLURE_ATTACHMENT_BUFFER__ = remaining;
        try {
          if (remaining.length) {
            const dbgName = `__allure_attachment_buffer_debug-${Date.now()}.json`;
            const dbgPath = path.join(resultsDir, dbgName);
            await fsp.writeFile(dbgPath, JSON.stringify({ remaining, mapping: (global as any).__TEST_ID_TO_NAME__ || {} }, null, 2), 'utf8');
          }
        } catch (e) {}

        if (!g.__ALLURE_ATTACHMENT_BUFFER__ || !g.__ALLURE_ATTACHMENT_BUFFER__.length) return 0;
      } catch (e) {}
    } catch (e) {}

  // Nếu không gắn được qua tập tin result JSON, thử gắn trực tiếp vào runtime Allure
  // (nếu runtime hiện đã sẵn sàng)
  // try runtime fallback
  let a = (global as any).allure || null;
    if (!a) {
      try {
        
        const rt = require('jest-allure2/dist/runtime') || require('@shelex/jest-allure2/dist/runtime');
        a = rt?.allure || rt?.default?.allure || a;
      } catch (e) {
        try {
            
          const top = require('jest-allure2') || require('@shelex/jest-allure2');
          a = top?.allure || top?.default?.allure || a;
        } catch (e2) {}
      }
    }

    if (a) {
      for (const item of g.__ALLURE_ATTACHMENT_BUFFER__ || []) {
        try {
          if (typeof a.attachment === 'function') {
            const res = a.attachment(item.name, item.content, item.type);
            if (res && typeof res.then === 'function') await res;
          } else if (typeof a.addAttachment === 'function') {
            const res = a.addAttachment(item.name, item.content, item.type);
            if (res && typeof res.then === 'function') await res;
          } else if (typeof a.writeAttachment === 'function') {
            const res = a.writeAttachment(item.content, item.type, item.name);
            if (res && typeof res.then === 'function') await res;
          }
        } catch (e) {}
      }
      g.__ALLURE_ATTACHMENT_BUFFER__ = [];
      return 0;
    }

    return (g.__ALLURE_ATTACHMENT_BUFFER__ || []).length;
  } catch (e) {
    return -1;
  }
}