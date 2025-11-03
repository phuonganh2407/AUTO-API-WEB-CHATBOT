import { testWithAllure } from "../../../../tests/api/testWithAllure";
import { callWithAllure } from "../../../../utils/httpWithAllure";
import { editCustomer } from "../../../../services/api/customerApi/customer.api";
import { editCustomerAuthorIdValid, editCustomerChangeName, editCustomerEmailValid, editCustomerEmptyName, editCustomerPhoneValid, mapEditCustomerData } from "../../../../data/api/serviceCustomerData/customer.data";
import { compareCustomerDetail, compareCustomerSearch } from "./customer.step";
import { testsCheckFails } from "../../../../utils/funtionHelper";
import { errorMessages } from "../../../../data/api/errorMessages";

describe("Chỉnh sửa nhóm Khách hàng", () => {
  testWithAllure("@smoke CUSTOMER_EDIT_038 - Chỉnh sửa khách hàng với data không thay đổi", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
    const { payload: payloadEditCus, id } = await mapEditCustomerData();
    const editRequest = await callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' });
    // ✅ So sánh status code
    expect(editRequest.status).toBe(204);
    //So sánh chi tiết khách hàng sau khi chỉnh sửa
    await compareCustomerDetail(id, payloadEditCus);
    
    //So sánh kết quả tìm kiếm khách hàng theo tên đã chỉnh sửa
    await compareCustomerSearch(payloadEditCus);
  });

    testWithAllure("@smoke CUSTOMER_EDIT_039 - Chỉnh sửa khách hàng thành công với data thay đổi tên KH", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
    const { payload: payloadEditCus, id } = await editCustomerChangeName();
    const editRequest = await callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' });
    // ✅ So sánh status code
    expect(editRequest.status).toBe(204);
    //So sánh chi tiết khách hàng sau khi chỉnh sửa
    await compareCustomerDetail(id, payloadEditCus);
    
    //So sánh kết quả tìm kiếm khách hàng theo tên đã chỉnh sửa
    await compareCustomerSearch(payloadEditCus);
  });

//     testWithAllure("CUSTOMER_EDIT_040 - Chỉnh sửa khách hàng không thành công khi bỏ trống tên KH", async () => {
//     // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
//     const { payload: payloadEditCus, id } = await editCustomerEmptyName();
//     console.log('Payload Edit Customer with Empty Name:', payloadEditCus);

//     await testsCheckFails(callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' }), 400, errorMessages.customer.customerEmptyName);
//   });

    testWithAllure("@smoke CUSTOMER_EDIT_041 - Chỉnh sửa khách hàng thành công với data thay đổi hợp lệ - SĐT KH", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
    const { payload: payloadEditCus, id } = await editCustomerPhoneValid();
    const editRequest = await callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' });
    // ✅ So sánh status code
    expect(editRequest.status).toBe(204);
    //So sánh chi tiết khách hàng sau khi chỉnh sửa
    await compareCustomerDetail(id, payloadEditCus);
    
    //So sánh kết quả tìm kiếm khách hàng theo tên đã chỉnh sửa
    await compareCustomerSearch(payloadEditCus);
  });

    testWithAllure("@smoke CUSTOMER_EDIT_042 - Chỉnh sửa khách hàng thành công với data thay đổi hợp lệ - email KH", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
    const { payload: payloadEditCus, id } = await editCustomerEmailValid();
    const editRequest = await callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' });
    // ✅ So sánh status code
    expect(editRequest.status).toBe(204);
    //So sánh chi tiết khách hàng sau khi chỉnh sửa
    await compareCustomerDetail(id, payloadEditCus);
    
    //So sánh kết quả tìm kiếm khách hàng theo tên đã chỉnh sửa
    await compareCustomerSearch(payloadEditCus);
  });

    testWithAllure("@smoke CUSTOMER_EDIT_043 - Chỉnh sửa khách hàng thành công với data thay đổi hợp lệ - Người phụ trách KH", async () => {
    // Lấy dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu snhiên
    const { payload: payloadEditCus, id } = await editCustomerAuthorIdValid();
    const editRequest = await callWithAllure(() => editCustomer(id, payloadEditCus as any),{ name: 'editCustomer' });
    // ✅ So sánh status code
    expect(editRequest.status).toBe(204);
    //So sánh chi tiết khách hàng sau khi chỉnh sửa
    await compareCustomerDetail(id, payloadEditCus);
    
    //So sánh kết quả tìm kiếm khách hàng theo tên đã chỉnh sửa
    await compareCustomerSearch(payloadEditCus);
  });
});