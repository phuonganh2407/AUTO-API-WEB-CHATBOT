import { fullCreateCustomerData } from "../../../data/serviceCustomerData/customer.data";
import { createCustomer } from "../../../services/customerApi/customer.api";
import { AuthFlowHelper } from "../../../utils/infoAccount.helper";
import { compareCustomerDetail } from "./customer.step";

describe("Thêm mới Khách hàng cho cửa hàng", () => {
  test("@smoke CUSTOMER_ADD_024 - Thêm mới nhóm khách hàng với dữ liệu đầy đủ", async () => {
    await AuthFlowHelper.getIDShopOwner();
    //Gọi API tạo khách hàng với đầy đủ dữ liệu
    const payloadCreateCus = await fullCreateCustomerData();

    const response = await createCustomer(payloadCreateCus as any);

    console.log("Response từ API tạo nhóm khách hàng:", response.data);

    //So sánh chi tiết khách hàng sau khi tạo
    await compareCustomerDetail(response.data.id, payloadCreateCus);
  });
});