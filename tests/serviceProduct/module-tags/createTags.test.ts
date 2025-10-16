import { emptyName, fullTagsData } from "../../../data/tags.data";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareTagDetails } from "./tags.step";

describe("Thêm mới Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {

  test("creTag_001 - Tạo thành công thẻ tag với data hợp lệ", async () => {
    const payload = await fullTagsData();
    // Tạo tag và so sánh chi tiết (xử lý hết bên step)
    await compareTagDetails(payload);
  });

  test("creTag_002 - Tạo thất bại thẻ tag với name rỗng", async () => {
    const payload = await emptyName(); // Lấy dữ liệu đầy đủ cho tag với name rỗng
    testsCheckFails(payload, 400, "Please enter a name");
  });
});
