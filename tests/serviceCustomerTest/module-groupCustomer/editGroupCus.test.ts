import { errorMessages } from "../../../data/errorMessages";
import { mapEditGroupCusData, mapEditGroupCusDataWithChangeName, mapEditGroupCusDataWithDuplicateName } from "../../../data/serviceCustomerData/groupCustomer.data";
import { editGroupCustomer } from "../../../services/customerApi/groupCustomer.api";
import { testsCheckFails } from "../../../utils/funtionHelper";
import { compareSearchGroupCusList } from "./groupCus.step";

describe("Chỉnh sửa nhóm Khách hàng", () => {
  test("@smoke GROUPCUS_EDIT_021 - Chỉnh sửa nhóm khách hàng với data không thay đổi", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu nhiên
    const { payload: payloadEditGroupCus, id } = await mapEditGroupCusData();
    const editRequest = await editGroupCustomer(id, payloadEditGroupCus as any);
    // Tìm kiếm tên nhóm khách hàng vừa chỉnh sửa và so sánh kết quả
    await compareSearchGroupCusList(payloadEditGroupCus);
  });

    test("@smoke GROUPCUS_EDIT_022 - Chỉnh sửa nhóm khách hàng với name hợp lệ", async () => {
    const { payload: payloadEditGroupCus, id } = await mapEditGroupCusDataWithChangeName();
    const editRequest = await editGroupCustomer(id, payloadEditGroupCus as any);
    await compareSearchGroupCusList(payloadEditGroupCus);
  });

    test("@smoke GROUPCUS_EDIT_023 - Chỉnh sửa nhóm khách hàng với name hợp lệ", async () => {
    const { payload: payloadEditGroupCus, id } =
      await mapEditGroupCusDataWithDuplicateName();
    //Kiểm tra lỗi khi chỉnh sửa nhóm khách hàng với tên đã tồn tại
    await testsCheckFails(editGroupCustomer(id, payloadEditGroupCus as any), 403, errorMessages.groupCustomer.editGroupCusDuplicateName);
  });
});