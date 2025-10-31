import { createCustomerBody } from "../../../../object/api/serviceCustomerObject/customer.api.object";
import { detailCustomer } from "../../../../services/api/customerApi/customer.api";
import {
  compareRequestResponse,
  handleComparisonResult,
} from "../../../../utils/funtionHelper";

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
      tagIds: "tags[].id",
      customerGroupIds: "customerGroups[].id",
    }
  };
    //Chỉ xử lý riêng customer. Vì body request và response có định dạng khác nhau ở trường dateOfBirth. body request là "YYYY-MM-DD", response là "YYYY-MM-DDTHH:mm:ss.sssZ"
  if (actualData.dateOfBirth?.includes("T")) {
    actualData.dateOfBirth = actualData.dateOfBirth.split("T")[0];
  }
  const result = compareRequestResponse(expectedData, actualData, config);
  // Xử lý kết quả comparison (chỉ log khi fail, throw error nếu cần)
  handleComparisonResult(result, "So sánh chi tiết khách hàng sau khi tạo");
}

export async function compareCustomerSearch(): Promise<void> {
  
}