import { createCustomerBody } from "../../../object/serviceCustomerObject/customer.api.object";
import { detailCustomer } from "../../../services/customerApi/customer.api";

export async function compareCustomerDetail(
  id: number,
  expectedData: Partial<createCustomerBody>
): Promise<void> {
  // Lấy chi tiết khách hàng từ API
  const response = await detailCustomer(id);
  const actualData = response.data;
  // So sánh từng trường trong expectedData với actualData
}
