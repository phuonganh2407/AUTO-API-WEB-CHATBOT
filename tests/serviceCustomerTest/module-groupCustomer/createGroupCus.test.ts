import { fullDataGroupCus } from "../../../data/serviceCustomerData/groupCustomer.data";
import { createGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api"; // Update the path as needed

describe("Thêm mới nhóm cho Khách hàng", () => {
    test("@smoke createGroupCus_001 - Thêm mới nhóm khách hàng với dữ liệu đầy đủ", async () => {
        const payloadCreateGroupCus = await fullDataGroupCus();
        console.log("Payload tạo nhóm khách hàng:", payloadCreateGroupCus);
        const response = await createGroupCustomer(payloadCreateGroupCus as any);
        console.log("Response từ API tạo nhóm khách hàng:", response.data);
    });
});
