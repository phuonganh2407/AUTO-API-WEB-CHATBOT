import { detailTag } from "../../../services/product/tags/tag.api";

/**
 * So sánh chi tiết tag sau khi tạo thành công
 * @param payload - Body request tạo tag
 * @param createResponse - Response từ API tạo tag
 */
export async function compareTagDetails(payload: any, createResponse: any) {
  const id = createResponse.data.id; // Lấy id từ response create (sửa từ data.data.id thành data.id)
  const detailResponse = await detailTag(id); // Gọi API detail
  const detailData = detailResponse.data; // Dữ liệu detail (sửa từ data.data thành data)

  // So sánh các field giống nhau giữa payload và detailData
  for (const key in payload) {
    if (detailData.hasOwnProperty(key)) {
      const expectedValue = typeof payload[key] === 'string' ? payload[key].trim() : payload[key];
      const actualValue = typeof detailData[key] === 'string' ? detailData[key].trim() : detailData[key];
      const errMess = `${key}: expected ${expectedValue}, got ${actualValue}`;
      expect(actualValue).toEqual(expectedValue); // So sánh giá trị
    }
  }
}
