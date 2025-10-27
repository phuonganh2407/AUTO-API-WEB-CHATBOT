import { errorMessages } from "../../../data/errorMessages";
import { createTagForDelete, idTagInvalid } from "../../../data/serviceProductData/tags.data";
import { deleteTag } from "../../../services/productApi/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";

describe("Xóa Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {
  test("@smoke delTag_001 - Xóa thành công thẻ tag chưa có dữ liệu liên kết", async () => {
    //Tạo thẻ tag trước khi xóa đảm bảo không bị dính tag đã có dữ liệu liên kết
    const tagId = await createTagForDelete();
    // Gọi API delete
    const deleteResponse = await deleteTag(tagId);
    // Kiểm tra response status 204 (No Content)
    expect(deleteResponse.status).toBe(204);
  });

  test("delTag_002 - Xóa thất bại thẻ tag có ID không tồn tại trong hệ thống", async () => {
    // Sử dụng tag có sẵn, giả sử có dữ liệu liên kết
    const tagId = await idTagInvalid(); // Thay bằng ID thực tế của tag có liên kết
    await testsCheckFails(
      deleteTag(tagId),
      403,
      errorMessages.product.deleteTagNoteExisted
    );
  });
});
