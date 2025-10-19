import { createTag, getDetailTag, getListTag } from "../../../services/product/tags/tag.api";
import { compareRequestResponse, ComparisonConfig, handleComparisonResult } from "../../../utils/funtionHelper";

/**
 * Tạo tag và so sánh chi tiết sau khi tạo thành công
 * @param payload - Body request tạo tag (name, type, tagColorId)
 * @param config - Cấu hình comparison (optional)
 */
export async function compareTagDetails(
  requestCreate: any,
  payload: any,           // Request body (name, type, tagColorId)
): Promise<void> {
  // Gọi API detail để lấy thông tin chi tiết
  const detailResponse = await getDetailTag(requestCreate.data.id);
  const detailData = detailResponse.data; // Response body từ detail API

  // So sánh request body (payload) với detail response (detailData)
  const result = compareRequestResponse(payload, detailData);

  // Xử lý kết quả comparison (chỉ log khi fail, throw error nếu cần)
  handleComparisonResult(result, "Tag comparison");
}

export async function compareSearchTagList(
  payload: any     // Request body từ create (name, type, tagColorId)
): Promise<void> {
  const listResponse = await getListTag({ SearchText: payload.name }); // Search theo name từ payload

  const listData = listResponse.data.items; // Lấy danh sách tags từ response

  // Chỉ so sánh với tag đầu tiên trong danh sách
  if (listData && listData.length > 0) {
    const firstTag = listData[0];
    const result = compareRequestResponse(payload, firstTag); // So sánh toàn bộ payload với firstTag
    // console.log('Comparison result for search tag list:', result);
    handleComparisonResult(result, "Search tag comparison");
  } else {
    console.warn("No tags found in search response");
  }
}