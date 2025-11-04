import { fullAttributesData } from "../../../data/api/moduleProduct/attribute.data";
import { testWithAllure } from "../../../tests/api/testWithAllure";
import { callWithAllure } from "../../../utils/httpWithAllure";
import { createAttribute } from "../../../services/api/productApi/attribute.api";
import { checkListAttribute } from "./attribute.step";

describe("Cập nhật thuộc tính", () => {

  testWithAllure("@smoke ATTRIBUTE_UPDATE_002 - Thêm mới thành công thuộc tính với data hợp lệ", async () => {
    //Gọi body đầy đủ data hợp lệ
    const payLoadBody = await fullAttributesData();

    //Gọi api tạo thuộc tính. Đồng thời gắn thẻ tags allure cho request này { name: 'createAttribute' }
    const responseCreate = await callWithAllure(() => createAttribute(payLoadBody as any), { name: 'createAttribute' });
    
    //Kiểm tra response trả về sau khi tạo thành công
    expect(responseCreate.status).toBe(200);

    //Kiểm tra trong danh sách thuộc tính có tồn tại thuộc tính vừa tạo hay không
    await checkListAttribute(payLoadBody)
  });
});