import { createCustomerBody } from "../../../object/serviceCustomerObject/customer.api.object";
import { detailCustomer } from "../../../services/customerApi/customer.api";
import {
  compareRequestResponse,
  handleComparisonResult,
} from "../../../utils/funtionHelper";

export async function compareCustomerDetail(
  id: number,
  expectedData: Partial<createCustomerBody>
): Promise<void> {
  // Lấy chi tiết khách hàng từ API
  const response = await detailCustomer(id);
  const actualData = response.data;
  // So sánh từng trường trong expectedData với actualData
  const config = {
    fieldMapping: {
      tagIds: "tags",
      customerGroupIds: "customerGroups",
    },
    ignoredFields: ["streetNo", "wardCode", "districtCode", "cityCode"],
  };
  const result = compareRequestResponse(expectedData, actualData, config);
  // Xử lý kết quả comparison (chỉ log khi fail, throw error nếu cần)
  handleComparisonResult(result, "So sánh chi tiết khách hàng sau khi tạo");
}
