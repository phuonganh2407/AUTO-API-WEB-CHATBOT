import { fullAttributesData } from "../../../data/api/moduleProduct/attribute.data";
import { testWithAllure } from "../testWithAllure";

describe("Thêm mới thuộc tính", () => {

  testWithAllure("@smoke TAG_ADD_001 - Tạo thành công thẻ tag với data hợp lệ", async () => {
    const payload = await fullAttributesData();
    // Gọi API create để tạo tag
    const createResponse = await callWithAllure(() => (payload as any), { name: 'createTag' });
  });
});