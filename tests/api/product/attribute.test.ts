import { fullAttributesData } from "../../../data/api/moduleProduct/attribute.data";
import { testWithAllure } from "../../../tests/api/testWithAllure";
import { callWithAllure } from "../../../utils/httpWithAllure";
import { updateAttribute } from "../../../services/api/productApi/attribute.api";

describe("Cập nhật thuộc tính", () => {

  testWithAllure("@smoke ATTRIBUTE_UPDATE_002 - Cập nhật thành công thuộc tính với data hợp lệ", async () => {
    const payload = await fullAttributesData();
    console.log("Payload for update:", payload);
    // Gọi API update để cập nhật thuộc tính
    const updateResponse = await callWithAllure(() => updateAttribute(payload), { name: 'updateAttribute' });
    console.log(updateResponse.data);
  });
});