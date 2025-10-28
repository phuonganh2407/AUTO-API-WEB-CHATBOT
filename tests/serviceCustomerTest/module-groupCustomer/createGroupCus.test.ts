import { errorMessages } from "../../../data/errorMessages";
import {
  duplicateNameGroupCus,
  emptyNameGroupCus,
  fullDataGroupCus,
  longNameGroupCus,
} from "../../../data/serviceCustomerData/groupCustomer.data";
import { createGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api"; // Update the path as needed
import { testsCheckFails } from "../../../utils/funtionHelper";

describe("Thêm mới nhóm cho Khách hàng", () => {
  test("@smoke GROUPCUS_ADD_016 - Thêm mới nhóm khách hàng với dữ liệu đầy đủ", async () => {
    const payloadCreateGroupCus = await fullDataGroupCus();
    console.log("Payload tạo nhóm khách hàng:", payloadCreateGroupCus);
    const response = await createGroupCustomer(payloadCreateGroupCus as any);
    console.log("Response từ API tạo nhóm khách hàng:", response.data);
  });

  test("GROUPCUS_ADD_017 - Thêm mới nhóm khách hàng với tên nhóm đã tồn tại", async () => {
    const payloadCreateGroupCus = await duplicateNameGroupCus();

    await testsCheckFails(
      createGroupCustomer(payloadCreateGroupCus as any),
      403,
      errorMessages.groupCustomer.createGroupCusDuplicateName
    );
  });

  test("GROUPCUS_ADD_018 - Thêm mới nhóm khách hàng với tên nhóm > 100 kí tự", async () => {
    const payloadCreateGroupCus = await longNameGroupCus();
    const length = payloadCreateGroupCus.name?.length || 0;

    await testsCheckFails(
      createGroupCustomer(payloadCreateGroupCus as any),
      400,
      errorMessages.groupCustomer.createGroupCusLongName(length)
    );
  });

  test("GROUPCUS_ADD_019 - Thêm mới nhóm khách hàng với tên nhóm rỗng", async () => {
    const payloadCreateGroupCus = emptyNameGroupCus();
    await testsCheckFails(
      createGroupCustomer(payloadCreateGroupCus as any),
      400,
      errorMessages.groupCustomer.createGroupCusEmptyName
    );
  });
});
