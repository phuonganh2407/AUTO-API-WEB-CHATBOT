import { testWithAllure } from "../../testWithAllure";
import { createCustomerEmailInvalid, createCustomerGenderAnother, createCustomerGenderFemale, createCustomerGenderInvalid, createCustomerGenderMale, createCustomerNullTags, createCustomersWithPhone14, createCustomersWithPhone8, createCustomersWithPhoneNull, createCustomersWithPhonePlus84, createCustomerWithEmptyName, createCustomerWithPhoneInvalid19, createCustomerWithPhoneInvalid6, fullCreateCustomerData } from "../../../../data/api/serviceCustomerData/customer.data";
import { createCustomer } from "../../../../services/api/customerApi/customer.api";
import { compareCustomerDetail, compareCustomerSearch } from "./customer.step";
import { callWithAllure } from "../../../../utils/httpWithAllure";
import { testsCheckFails } from "../../../../utils/funtionHelper";
import { errorMessages } from "../../../../data/api/errorMessages";

describe("Thêm mới Khách hàng cho cửa hàng", () => {
  testWithAllure("@smoke CUSTOMER_ADD_024 - Thêm mới khách hàng với dữ liệu đầy đủ", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await fullCreateCustomerData();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);
      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

  testWithAllure("@smoke CUSTOMER_ADD_025 - Thêm mới khách hàng với tên khách hàng để trống", async () => {
      //Gọi API tạo khách hàng với tên khách hàng để trống
      const payloadCreateCus = await createCustomerWithEmptyName();
      //So sánh mã lỗi trả về
      await testsCheckFails(callWithAllure(() => createCustomer(payloadCreateCus as any)), 400, errorMessages.customer.createCustomerEmptyName);
  });

    testWithAllure("CUSTOMER_ADD_026 - Thêm mới khách hàng thành công khi nhập phone hợp lệ(phone = 8 số)", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomersWithPhone8();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

        // ✅ So sánh status code
      expect(response.status).toBe(200);
      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("CUSTOMER_ADD_027 - Thêm mới khách hàng thành công khi nhập phone hợp lệ(phone = 14 số)", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomersWithPhone14();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);
      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("@smoke CUSTOMER_ADD_028 - Thêm mới khách hàng thành công khi nhập phone hợp lệ(phone = +84)", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomersWithPhonePlus84();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);
      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("@smoke CUSTOMER_ADD_029 - Thêm mới khách hàng thành công khi nhập phone hợp lệ(phone = null)", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomersWithPhoneNull();
      console.log("bodyNullPhone", payloadCreateCus)

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);

      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

  testWithAllure("CUSTOMER_ADD_030 - Thêm mới khách hàng không thành công với phone < 8 số", async () => {
      //Gọi API tạo khách hàng với tên khách hàng để trống
      const payloadCreateCus = await createCustomerWithPhoneInvalid6();
      //So sánh mã lỗi trả về
      await testsCheckFails(callWithAllure(() => createCustomer(payloadCreateCus as any)), 400, errorMessages.customer.createCustomerInvalidPhone);
  });

  testWithAllure("CUSTOMER_ADD_031 - Thêm mới khách hàng không thành công với phone > 14 số", async () => {
      //Gọi API tạo khách hàng với tên khách hàng để trống
      const payloadCreateCus = await createCustomerWithPhoneInvalid19();
      //So sánh mã lỗi trả về
      await testsCheckFails(callWithAllure(() => createCustomer(payloadCreateCus as any)), 400, errorMessages.customer.createCustomerInvalidPhone);
  });

    testWithAllure("CUSTOMER_ADD_032 - Thêm mới khách hàng thành công khi tạo KH có giới tính Nữ", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomerGenderFemale();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);
      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("CUSTOMER_ADD_033 - Thêm mới khách hàng thành công khi tạo KH có giới tính Nam", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomerGenderMale();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);

      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("@smoke CUSTOMER_ADD_034 - Thêm mới khách hàng thành công khi tạo KH có giới tính KHÁC", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomerGenderAnother();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);

      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });

    testWithAllure("CUSTOMER_ADD_035 - Thêm mới khách hàng thất bại khi nhập giới tính không hợp lệ", async () => {
      //Gọi API tạo khách hàng với tên khách hàng để trống
      const payloadCreateCus = await createCustomerGenderInvalid();
      const numberGender = payloadCreateCus.gender ?? -1;
      //So sánh mã lỗi trả về
      await testsCheckFails(callWithAllure(() => createCustomer(payloadCreateCus as any)), 400, errorMessages.customer.createCustomerGenderInvalid(numberGender));
  });

    testWithAllure("@smoke CUSTOMER_ADD_036 - Thêm mới khách hàng thất bại khi nhập Email không hợp lệ", async () => {
      //Gọi API tạo khách hàng với tên khách hàng để trống
      const payloadCreateCus = await createCustomerEmailInvalid();
      //So sánh mã lỗi trả về
      await testsCheckFails(callWithAllure(() => createCustomer(payloadCreateCus as any)), 400, errorMessages.customer.createCustomerInvalidEmail);
  });

    testWithAllure("@smoke CUSTOMER_ADD_037 - Thêm mới khách hàng thành công khi tạo KH không gắn thẻ tag", async () => {
      //Gọi API tạo khách hàng với đầy đủ dữ liệu
      const payloadCreateCus = await createCustomerNullTags();

      const response = await callWithAllure(() => createCustomer(payloadCreateCus as any));

      // ✅ So sánh status code
      expect(response.status).toBe(200);

      //So sánh chi tiết khách hàng sau khi tạo
      await compareCustomerDetail(response.data.id, payloadCreateCus);

      //So sánh kết quả tìm kiếm khách hàng theo tên đã tạo
      await compareCustomerSearch(payloadCreateCus);
  });
});