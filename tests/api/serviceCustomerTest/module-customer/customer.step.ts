import { createCustomerBody } from "../../../../object/api/serviceCustomerObject/customer.api.object";
import {
  detailCustomer,
  getListCustomer,
} from "../../../../services/api/customerApi/customer.api";
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
    },
  };
  //Chỉ xử lý riêng customer. Vì body request và response có định dạng khác nhau ở trường dateOfBirth. body request là "YYYY-MM-DD", response là "YYYY-MM-DDTHH:mm:ss.sssZ"
  if (actualData.dateOfBirth?.includes("T")) {
    actualData.dateOfBirth = actualData.dateOfBirth.split("T")[0];
  }
  const result = compareRequestResponse(expectedData, actualData, config);
  // Xử lý kết quả comparison (chỉ log khi fail, throw error nếu cần)
  handleComparisonResult(result, "So sánh chi tiết khách hàng sau khi tạo");
}

/**
 * So sánh kết quả tìm kiếm khách hàng theo tên KH đã tạo
 * @param payload object customer (body request)
 */
export async function compareCustomerSearch(payload: any): Promise<void> {
  const listResponse = await getListCustomer({
    SearchText: payload.name,
  }); // Search theo name từ payload
  const listData = listResponse.data.items; // Lấy danh sách khách hàng từ response

  // So sánh với khách hàng đầu tiên trong danh sách
  if (listData && listData.length > 0) {
    const firstCustomer = listData[0];
    if (firstCustomer.dateOfBirth?.includes("T")) {
      firstCustomer.dateOfBirth = firstCustomer.dateOfBirth.split("T")[0];
      const result = compareRequestResponse(payload, firstCustomer); // So sánh toàn bộ payload với firstCustomer
      handleComparisonResult(
        result,
        "So sánh kết quả tìm kiếm khách hàng theo tên"
      );
    }
  }
}
