import { baseProductEndpoints } from "../../../config/urls.config";
import axiosClient from "../../../core/axiosClient";
import { createTagBody as CreateTagBody } from "../../../object/tag.api.object";

/**
 * Tạo mới một thẻ (tag)
 * @param body Thông tin thẻ cần tạo
 * @returns Promise chứa thông tin thẻ vừa tạo
 */
export async function createTag(body: CreateTagBody) {
  return axiosClient.post(baseProductEndpoints.urlCreateTag, body);
}

/**
 * Lấy chi tiết thẻ (tag) theo ID
 * @param id ID của thẻ
 * @returns Promise chứa thông tin chi tiết thẻ
 */
export async function getDetailTag(id: number) {
  return axiosClient.get(`${baseProductEndpoints.urlDetailTag}/${id}`);
}

/**
 * Lấy danh sách thẻ (tag) theo tên hoặc loại thẻ
 * @param params Truyền tên thẻ tag || typeTag
 * @returns Trả về Danh sách theo params đã truyền
 */
export async function getListTag(params: { SearchText?: string; TagType?: number }) {
  console.log('Search params:', params); // Debug log
  return axiosClient.get(baseProductEndpoints.urlSearchTags, { params });
}

