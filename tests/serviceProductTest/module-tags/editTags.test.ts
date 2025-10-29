import { errorMessages } from "../../../data/errorMessages";
import { duplicateNameEdit, emptyNameEdit, mapEditData, nameValidEdit } from "../../../data/serviceProductData/tags.data";
import { editTag } from "../../../services/productApi/tags/tag.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareSearchTagList, compareTagDetails } from "./tags.step";
import { callWithAllure } from "../../../utils/httpWithAllure";
import { testWithAllure } from "../../testWithAllure";

describe("Chỉnh sửa Thẻ tags cho Khách hàng, Nhà cung cấp, Sản phẩm, Đơn hàng", () => {
  testWithAllure("@smoke TAG_EDIT_008 - Chỉnh sửa Lưu thành công thẻ tag với data không thay đổi", async () => {
    const { payload: payloadEditTag, id } = await mapEditData();
    // Gọi API edit (attach request/response)
    const editResponse = await callWithAllure(() => editTag(id, payloadEditTag as any), { name: 'editTag' });

    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });

  testWithAllure("TAG_EDIT_009 - Chỉnh sửa Lưu không thành công khi tên rỗng", async () => {
    const { payload: payloadEditTag, id } = await emptyNameEdit();
    await testsCheckFails(
      callWithAllure(() => editTag(id, payloadEditTag as any), { name: 'editTag' }),
      400,
      errorMessages.product.createTagEmptyName
    );
  });

  testWithAllure("TAG_EDIT_010 - Chỉnh sửa Lưu không thành công khi tên thẻ tag đã tồn tại", async () => {
    const { payload: payloadEditTag, id } = await duplicateNameEdit();
    await testsCheckFails(
      callWithAllure(() => editTag(id, payloadEditTag as any), { name: 'editTag' }),
      403,
      errorMessages.product.createTagDuplicateName
    );
  });

  testWithAllure("@smoke TAG_EDIT_011 - Chỉnh sửa Lưu thành công thẻ tag với tên hợp lệ", async () => {
    const { payload: payloadEditTag, id } = await nameValidEdit();

    const editReq = await callWithAllure(() => editTag(id, payloadEditTag as any), { name: 'editTag' });

    // So sánh chi tiết sau khi edit
    await compareTagDetails(id, payloadEditTag);

    // So sánh kết quả tìm kiếm tag theo name
    await compareSearchTagList(payloadEditTag);
  });
});
