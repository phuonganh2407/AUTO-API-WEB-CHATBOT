import { detailTag } from "../../../services/product/tags/tag.api";
import { compareRequestResponse, ComparisonConfig, ComparisonResult } from "../../../utils/funtionHelper";

/**
 * So sánh chi tiết tag sau khi tạo thành công
 * @param payload - Body request tạo tag (name, type, tagColorId)
 * @param detailResponse - Response từ API detail tag
 * @param config - Cấu hình comparison (optional)
 * @returns ComparisonResult - Kết quả so sánh
 */
export function compareTagDetails(
  payload: any,           // Request body (name, type, tagColorId)
  detailResponse: any,    // Response từ detail API
  config: ComparisonConfig = {}
): ComparisonResult {
  const detailData = detailResponse.data; // Response body từ detail API

  // Default config cho tags
  const defaultConfig: ComparisonConfig = {
    ...config // Override với config truyền vào
  };

  // So sánh request body (payload) với detail response (detailData)
  return compareRequestResponse(payload, detailData, defaultConfig);
}
