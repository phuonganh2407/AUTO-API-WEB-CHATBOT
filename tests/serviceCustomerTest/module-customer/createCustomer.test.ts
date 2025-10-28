import { fullCreateCustomerData } from "../../../data/serviceCustomerData/customer.data";
import { createCustomer } from "../../../services/customerApi/customer.api";
import { AuthFlowHelper } from "../../../utils/infoAccount.helper";

describe("Thêm mới Khách hàng cho cửa hàng", () => {
  test("@smoke CUSTOMER_ADD_024 - Thêm mới nhóm khách hàng với dữ liệu đầy đủ", async () => {
    await AuthFlowHelper.getIDShopOwner();
    const payloadCreateCus = await fullCreateCustomerData();
    console.log("Payload tạo nhóm khách hàng:", payloadCreateCus);
    const response = await createCustomer(payloadCreateCus as any);
    console.log("Response từ API tạo nhóm khách hàng:", response.data);
  });
});