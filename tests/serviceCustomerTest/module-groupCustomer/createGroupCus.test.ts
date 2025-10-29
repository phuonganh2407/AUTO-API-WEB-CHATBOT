import { errorMessages } from "../../../data/errorMessages";
import {
  duplicateNameGroupCus,
  emptyNameGroupCus,
  fullDataGroupCus,
  longNameGroupCus,
} from "../../../data/serviceCustomerData/groupCustomer.data";
import { createGroupCustomer } from "../../../services/customerApi/groupCustomer/groupCustomer.api"; // Update the path as needed
import { testsCheckFails } from "../../../utils/funtionHelper";
import { callWithAllure } from "../../../utils/httpWithAllure";
import { testWithAllure } from "../../testWithAllure";

describe("Thêm mới nhóm cho Khách hàng", () => {
  testWithAllure("@smoke GROUPCUS_ADD_016 - Thêm mới nhóm khách hàng với dữ liệu đầy đủ", async () => {
    const payloadCreateGroupCus = await fullDataGroupCus();
    // Gọi API create và attach request/response vào Allure
    const response = await callWithAllure(() => createGroupCustomer(payloadCreateGroupCus as any), { name: 'createGroupCustomer' });
    // Ghi log hoặc kiểm tra dữ liệu trả về
    // eslint-disable-next-line no-console
    console.log("Response từ API tạo nhóm khách hàng:", response.data);
  });

  testWithAllure("GROUPCUS_ADD_017 - Thêm mới nhóm khách hàng với tên nhóm đã tồn tại", async () => {
    const payloadCreateGroupCus = await duplicateNameGroupCus();

    await testsCheckFails(
      callWithAllure(() => createGroupCustomer(payloadCreateGroupCus as any), { name: 'createGroupCustomer' }),
      403,
      errorMessages.groupCustomer.createGroupCusDuplicateName
    );
  });

  testWithAllure("GROUPCUS_ADD_018 - Thêm mới nhóm khách hàng với tên nhóm > 100 kí tự", async () => {
    const payloadCreateGroupCus = await longNameGroupCus();
    const length = payloadCreateGroupCus.name?.length || 0;

    await testsCheckFails(
      callWithAllure(() => createGroupCustomer(payloadCreateGroupCus as any), { name: 'createGroupCustomer' }),
      400,
      errorMessages.groupCustomer.createGroupCusLongName(length)
    );
  });

  testWithAllure("GROUPCUS_ADD_019 - Thêm mới nhóm khách hàng với tên nhóm rỗng", async () => {
    const payloadCreateGroupCus = emptyNameGroupCus();
    await testsCheckFails(
      callWithAllure(() => createGroupCustomer(payloadCreateGroupCus as any), { name: 'createGroupCustomer' }),
      400,
      errorMessages.groupCustomer.createGroupCusEmptyName
    );
  });
});
