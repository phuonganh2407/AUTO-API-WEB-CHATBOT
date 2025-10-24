import { mapEditGroupCusData } from "../../../data/serviceCustomerData/groupCustomer.data";
import { editGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api";

describe("Chỉnh sửa nhóm Khách hàng", () => {
  test("@smoke editGroupCus_001 - Chỉnh sửa nhóm khách hàng với data không thay đổi", async () => {
    const { payload: payloadEditGroupCus, id } = await mapEditGroupCusData();
    const editResponse = await editGroupCustomer(id, payloadEditGroupCus as any);
    console.log("Response từ API chỉnh sửa nhóm khách hàng:", editResponse.data);
    
  });
});