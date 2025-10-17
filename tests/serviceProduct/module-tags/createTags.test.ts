import { emptyName, fullTagsData } from "../../../data/tags.data";
import { createTag } from "../../../services/product/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareTagDetails } from "./tags.step";
import { errorMessages } from "../../../data/errorMessages";

describe("Thêm mới Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {

  // test("creTag_001 - Tạo thành công thẻ tag với data hợp lệ", async () => {
  //   const payload = await fullTagsData();
  //   // Gọi API create để tạo tag
  //   const createResponse = await createTag(payload as any);
  //   // Tạo tag và so sánh chi tiết (xử lý hết bên step)
  //   await compareTagDetails(createResponse, payload);
  // });

  test("creTag_002 - Tạo thất bại thẻ tag với name rỗng", async () => {
    const payload = await emptyName(); // Lấy dữ liệu đầy đủ cho tag với name rỗng
    // Gọi API create và kiểm tra lỗi. Nội dung lỗi lấy từ data/errorMessages.ts
    await testsCheckFails(createTag(payload as any), 400, errorMessages.product.createTagEmptyName);
  });
});
