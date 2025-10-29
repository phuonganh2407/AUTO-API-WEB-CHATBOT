// scripts/applyTmpAttachments.js
// Script post-process để gắn các attachment tạm (được tạo bởi attachJson khi
// Allure runtime chưa sẵn sàng) vào các file *-result.json tương ứng trong
// thư mục reports/allure-results.
// Cách dùng: node scripts/applyTmpAttachments.js

const fs = require('fs');
const path = require('path');

(async function main(){
  try {
    const resultsDir = path.resolve(process.cwd(), 'reports', 'allure-results');
    if (!fs.existsSync(resultsDir)) {
      console.error('No results dir:', resultsDir);
      process.exit(1);
    }

  // load mapping file nếu tồn tại (file __testid_map.jsonl do testWithAllure ghi ra)
    const mapPath = path.join(resultsDir, '__testid_map.jsonl');
    const idToName = {};
    if (fs.existsSync(mapPath)) {
      const lines = fs.readFileSync(mapPath, 'utf8').split(/\r?\n/).filter(Boolean);
      for (const l of lines) {
        try {
          const o = JSON.parse(l);
          if (o && o.testId && o.fullName) idToName[o.testId] = o.fullName;
        } catch(e){}
      }
    }

    const files = fs.readdirSync(resultsDir);
    const tmpFiles = files.filter(f => f.startsWith('__tmpattach-') && f.endsWith('.json'));
    const resultFiles = files.filter(f => f.endsWith('-result.json'));

  // preload results: đọc tất cả *-result.json trước để thuận tiện tìm match
    const results = [];
    for (const rf of resultFiles) {
      const fullPath = path.join(resultsDir, rf);
      try {
        const txt = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(txt);
        results.push({ file: fullPath, data });
      } catch(e){}
    }

    for (const tf of tmpFiles) {
      const tfPath = path.join(resultsDir, tf);
      let ok = false;
      try {
        // đọc nội dung file tmp, lấy testId/testName
        const txt = fs.readFileSync(tfPath, 'utf8');
        const obj = JSON.parse(txt);
        const testId = obj.testId;
        const testName = obj.testName || idToName[testId] || null;

        if (!testName) {
          console.log('No testName for', tf);
          continue;
        }

        // tìm result JSON khớp với testName (so sánh nhiều cách để tăng tỉ lệ match)
        const match = results.find(r => {
          try {
            const fullName = String(r.data.fullName || '');
            const name = String(r.data.name || '');
            if (fullName === testName || name === testName) return true;
            if (fullName.endsWith(testName) || fullName.includes(testName)) return true;
            if (name.includes(testName)) return true;
          } catch(e){}
          return false;
        });

        if (!match) {
          console.log('No match for tmp file', tf, 'testName', testName);
          continue;
        }

        // tạo file attachment mới và chép nội dung từ tmp (obj.content hoặc obj)
        const uuid = match.data.uuid || path.basename(match.file).replace('-result.json','');
        const attachFilename = `${uuid}-attachment-${Date.now()}-${Math.random().toString(36).slice(2,8)}.json`;
        const attachPath = path.join(resultsDir, attachFilename);
        // write attachment file (use original content or obj.content)
        const content = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content, null, 2);
        fs.writeFileSync(attachPath, content, 'utf8');

        if (!Array.isArray(match.data.attachments)) match.data.attachments = [];
        match.data.attachments.push({ source: attachFilename, type: obj.type || 'application/json', name: obj.name || 'attachment' });
        // loại bỏ label 'feature' hoặc tag 'AUTO_API_WIONPOS' nếu trước đó đã inject
        try {
          if (Array.isArray(match.data.labels)) {
            match.data.labels = match.data.labels.filter(l => {
              try {
                if (String(l.name) === 'feature') return false;
                if (String(l.name) === 'tag' && String(l.value) === 'AUTO_API_WIONPOS') return false;
              } catch(e){}
              return true;
            });
            if (match.data.labels.length === 0) delete match.data.labels;
          }
        } catch(e){}
        fs.writeFileSync(match.file, JSON.stringify(match.data, null, 2), 'utf8');

        // xóa file tmp sau khi attach thành công
        fs.unlinkSync(tfPath);
        console.log('Attached', tf, '->', match.file);
        ok = true;
      } catch(e){
        console.error('Failed processing', tf, e);
      }
      if (!ok) {
        // leave tmp file for manual inspection
      }
    }

    console.log('Done');
  } catch(e) {
    console.error(e);
    process.exit(2);
  }
})();
