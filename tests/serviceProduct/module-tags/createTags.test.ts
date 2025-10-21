import { duplicateName, emptyName, fullTagsData, longName } from "../../../data/tags.data";
import { createTag } from "../../../services/product/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareSearchTagList, compareTagDetails } from "./tags.step";
import { errorMessages } from "../../../data/errorMessages";
import { TAGS } from "../../../constants/tags.constant";

describe("Thêm mới Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {

  test("@smoke creTag_001 - Tạo thành công thẻ tag với data hợp lệ", async () => {
    const payload = await fullTagsData();
    // Gọi API create để tạo tag
    const createResponse = await createTag(payload as any);
    // Tạo tag và so sánh chi tiết (xử lý hết bên step)
    await compareTagDetails(createResponse.data.id, payload);
    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payload);
  });

  test("@smoke creTag_002 - Tạo thất bại thẻ tag với name đã tồn tại", async () => {
    const payload = await duplicateName(); // Lấy dữ liệu đầy đủ cho tag với name trùng
    // Gọi API create và kiểm tra lỗi. Nội dung lỗi lấy từ data/errorMessages.ts
    await testsCheckFails(createTag(payload as any), 403, errorMessages.product.createTagDuplicateName);
  });
  
    test("creTag_003 - Tạo thất bại thẻ tag với name > 25 kí tự", async () => {
    const payload = await longName(); // Lấy dữ liệu đầy đủ cho tag với name trùng
    // Gọi API create và kiểm tra lỗi. Nội dung lỗi lấy từ data/errorMessages.ts
    await testsCheckFails(createTag(payload as any), 400, errorMessages.product.createTagLongName);
  });
  
  test("creTag_004 - Tạo thất bại thẻ tag với name rỗng", async () => {
    const payload = await emptyName(); // Lấy dữ liệu đầy đủ cho tag với name rỗng
    // Gọi API create và kiểm tra lỗi. Nội dung lỗi lấy từ data/errorMessages.ts
    await testsCheckFails(createTag(payload as any), 400, errorMessages.product.createTagEmptyName);
  });

  test("creTag_005 - Tạo thành công thẻ tag cho từng loại typeTags cụ thể", async () => {
    const typeTags = [TAGS.TAG_PRODUCT, TAGS.TAG_CUSTOMER, TAGS.TAG_ORDER, TAGS.TAG_SUPPLIER];
    for (const type of typeTags) {
      const payload = await fullTagsData();
      payload.type = type;
      const createResponse = await createTag(payload as any);
      // Tạo tag và so sánh chi tiết (xử lý hết bên step)
      await compareTagDetails(createResponse.data.id, payload);
      // So sánh kết quả tìm kiếm tag theo name
      await compareSearchTagList(payload);
    };
  });
});
