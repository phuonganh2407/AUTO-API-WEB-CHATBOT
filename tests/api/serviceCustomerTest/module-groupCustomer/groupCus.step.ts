import { getListGroupCustomer } from "../../../../services/api/customerApi/groupCustomer.api";
import {
  compareRequestResponse,
} from "../../../../utils/funtionHelper";

/**
 * So sánh kết quả tìm kiếm nhóm KH theo name
 * @param payload - Request body từ create (name)
 */
export async function compareSearchGroupCusList(
  payload: any // Request body từ create (name)
): Promise<void> {
  const listResponse = await getListGroupCustomer({
    CustomerSearchText: payload.name,
  }); // Search theo name từ payload

  const listData = listResponse.data.items; // Lấy danh sách tags từ response

  // Chỉ so sánh với tag đầu tiên trong danh sách
  if (listData && listData.length > 0) {
    const firstTag = listData[0];
    const result = compareRequestResponse(payload, firstTag); // So sánh toàn bộ payload với firstTag
  } else {
    console.warn("No Group Cus found in search response");
  }
}
