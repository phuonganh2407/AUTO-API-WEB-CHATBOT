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

