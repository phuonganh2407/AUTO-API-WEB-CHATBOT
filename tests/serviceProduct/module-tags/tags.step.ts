import { getDetailTag, getListTag } from "../../../services/product/tags/tag.api";
import { compareRequestResponse, getRandomData, handleComparisonResult, transformSearchText } from "../../../utils/funtionHelper";
import { expect } from '@jest/globals';



/**
 * Lấy random tag name theo type
 */
async function valueNameTagSearch(type: number): Promise<string> {
  const response = await getListTag({ TagType: type });
  const items = getRandomData(response.data.items, 1, 'name');
  return items[0] || '';
}

/**
 * Tìm kiếm tag với full keyword theo các case
 */
export async function searchFullKeywordTag(type: number): Promise<void> {
  const listCase = ["LOWERCASE", "UPPERCASE", "UNACCENT"];

  for (const condition of listCase) {
    const valueNameRand = await valueNameTagSearch(type);
    const modifiedSearchText = transformSearchText(valueNameRand, condition);
    console.log(`Searching with ${condition}: ${modifiedSearchText}`);

    const responseSearch = await getListTag({ SearchText: modifiedSearchText, TagType: type });

    expect(responseSearch.status).toBe(200);

    // Kiểm tra xem response có chứa valueNameRand
    const responseBody = JSON.stringify(responseSearch.data);
    expect(responseBody).toContain(valueNameRand);
  }
}

/**
 * Tạo tag và so sánh chi tiết sau khi tạo thành công
 * @param payload - Body request tạo tag (name, type, tagColorId)
 * @param config - Cấu hình comparison (optional)
 */
export async function compareTagDetails(
  id: number, //Tham số ID dành cho edit 
  payload: any,           // Request body (name, type, tagColorId)
): Promise<void> {
  // Gọi API detail để lấy thông tin chi tiết
  const detailResponse = await getDetailTag(id);
  const detailData = detailResponse.data; // Response body từ detail API

  // So sánh request body (payload) với detail response (detailData)
  const result = compareRequestResponse(payload, detailData);

  // Xử lý kết quả comparison (chỉ log khi fail, throw error nếu cần)
  handleComparisonResult(result, "Tag comparison");
}

/**
 * So sánh kết quả tìm kiếm tag theo name
 * @param payload - Request body từ create (name, type, tagColorId)
 */
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

