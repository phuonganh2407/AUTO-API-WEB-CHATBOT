import { getIDGroupCusNoData } from "../../../data/serviceCustomerData/groupCustomer.data";
import { deleteGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api";

describe("Xóa nhóm khách hàng", () => {
  test("@smoke GROUPCUS_DEL_020 - Xóa nhóm khách hàng không có dữ liệu", async () => {
    // Lấy id nhóm khách hàng không có dữ liệu
    const idGroupCusNoData = await getIDGroupCusNoData();
    const deleteRequest = await deleteGroupCustomer(idGroupCusNoData);
    expect(deleteRequest.status).toBe(204);
  });
});