import { baseProductEndpoints } from "../../../config/urls.config";
import axiosClient from "../../../core/axiosClient";
import { createTagBody as CreateTagBody } from "../../../object/tag.api.object";

/**
 * Tạo mới một thẻ (tag)
 * @param data Thông tin thẻ cần tạo
 * @returns Promise chứa thông tin thẻ vừa tạo
 */
export async function createTag(data: CreateTagBody) {
  return axiosClient.post(baseProductEndpoints.urlCreateTag, data);
}

/**
 * Lấy chi tiết thẻ (tag) theo ID
 * @param id ID của thẻ
 * @returns Promise chứa thông tin chi tiết thẻ
 */
export async function getDetailTag(id: number) {
  return axiosClient.get(`${baseProductEndpoints.urlDetailTag}/${id}`);
}

