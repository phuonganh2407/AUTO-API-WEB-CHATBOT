import { errorMessages } from "../../../data/errorMessages";
import { duplicateNameEdit, emptyNameEdit, mapEditData, nameValidEdit } from "../../../data/tags.data";
import { editTag } from "../../../services/product/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareSearchTagList, compareTagDetails } from "./tags.step";

describe("Chỉnh sửa Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {
  test("editTag_001 - Chỉnh sửa Lưu thành công thẻ tag với data không thay đổi", async () => {
    const { payload: payloadEditTag, id } = await mapEditData();
    // console.log("ID của tag cần edit:", id);
    const editResponse = await editTag(id, payloadEditTag as any);

    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });

  test("editTag_002 - Chỉnh sửa Lưu không thành công khi tên rỗng", async () => {
    const { payload: payloadEditTag, id } = await emptyNameEdit();
    await testsCheckFails(
      editTag(id, payloadEditTag as any),
      400,
      errorMessages.product.createTagEmptyName
    );
  });

  test("editTag_003 - Chỉnh sửa Lưu không thành công khi tên thẻ tag đã tồn tại", async () => {
    const { payload: payloadEditTag, id } = await duplicateNameEdit();
    await testsCheckFails(
      editTag(id, payloadEditTag as any),
      403,
      errorMessages.product.createTagDuplicateName
    );
  });

  test("editTag_004 - Chỉnh sửa Lưu thành công thẻ tag với tên hợp lệ", async () => {
    const { payload: payloadEditTag, id } = await nameValidEdit();
    // console.log("ID của tag cần edit:", id);
    const editReq = await editTag(id, payloadEditTag as any);
    console.log("Edit Response:", editReq);
    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });
});
