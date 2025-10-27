import { errorMessages } from "../../../data/errorMessages";
import { duplicateNameEdit, emptyNameEdit, mapEditData, nameValidEdit } from "../../../data/serviceProductData/tags.data";
import { editTag } from "../../../services/productApi/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareSearchTagList, compareTagDetails } from "./tags.step";

describe("Chỉnh sửa Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {
  test("@smoke TAG_EDIT_001 - Chỉnh sửa Lưu thành công thẻ tag với data không thay đổi", async () => {
    const { payload: payloadEditTag, id } = await mapEditData();
    // console.log("ID của tag cần edit:", id);
    const editResponse = await editTag(id, payloadEditTag as any);

    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });

  test("TAG_EDIT_002 - Chỉnh sửa Lưu không thành công khi tên rỗng", async () => {
    const { payload: payloadEditTag, id } = await emptyNameEdit();
    await testsCheckFails(
      editTag(id, payloadEditTag as any),
      400,
      errorMessages.product.createTagEmptyName
    );
  });

  test("TAG_EDIT_003 - Chỉnh sửa Lưu không thành công khi tên thẻ tag đã tồn tại", async () => {
    const { payload: payloadEditTag, id } = await duplicateNameEdit();
    await testsCheckFails(
      editTag(id, payloadEditTag as any),
      403,
      errorMessages.product.createTagDuplicateName
    );
  });

  test("@smoke TAG_EDIT_004 - Chỉnh sửa Lưu thành công thẻ tag với tên hợp lệ", async () => {
    const { payload: payloadEditTag, id } = await nameValidEdit();

    const editReq = await editTag(id, payloadEditTag as any);

    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });
});
