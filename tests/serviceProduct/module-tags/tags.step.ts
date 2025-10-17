import { createTag, getDetailTag } from "../../../services/product/tags/tag.api";
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