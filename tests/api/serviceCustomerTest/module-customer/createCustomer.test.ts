import { testWithAllure } from "../../testWithAllure";
import { fullCreateCustomerData } from "../../../../data/api/serviceCustomerData/customer.data";
import { createCustomer } from "../../../../services/api/customerApi/customer.api";
import { compareCustomerDetail } from "./customer.step";
import { callWithAllure } from "../../../../utils/httpWithAllure";

describe("Thêm mới Khách hàng cho cửa hàng", () => {
  testWithAllure("@smoke CUSTOMER_ADD_024 - Thêm mới khách hàng với dữ liệu đầy đủ", async () => {
    //Gọi API tạo khách hàng với đầy đủ dữ liệu
    const payloadCreateCus = await fullCreateCustomerData();

    const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

    //So sánh chi tiết khách hàng sau khi tạo
    await compareCustomerDetail(response.data.id, payloadCreateCus);
  });
});