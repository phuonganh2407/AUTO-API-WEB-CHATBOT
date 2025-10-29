import { getIDGroupCusNoData } from "../../../data/serviceCustomerData/groupCustomer.data";
import { deleteGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api";
import { callWithAllure } from "../../../utils/httpWithAllure";
import { testWithAllure } from "../../testWithAllure";

describe("Xóa nhóm khách hàng", () => {
  testWithAllure("@smoke GROUPCUS_DEL_020 - Xóa nhóm khách hàng không có dữ liệu", async () => {
    // Lấy id nhóm khách hàng không có dữ liệu
    const idGroupCusNoData = await getIDGroupCusNoData();
    const deleteRequest = await callWithAllure(() => deleteGroupCustomer(idGroupCusNoData), { name: 'deleteGroupCustomer' });
    expect(deleteRequest.status).toBe(204);
  });
});