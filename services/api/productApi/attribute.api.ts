import axiosClient from '../../../core/api/axiosClient';
import { attributeBody } from '../../../object/api/serviceProductObject/attribute.api.object';
import { baseProductEndpoints } from '../../../config/api/urls.config';

/**
 * Cập nhật thuộc tính sản phẩm
 * @param attributeId ID của thuộc tính cần cập nhật
 * @param body  Dữ liệu thuộc tính cần cập nhật
 * @returns
 */
export async function updateAttribute(body: Partial<attributeBody>) {
  return await axiosClient.patch(`${baseProductEndpoints.urlCreateAttribute}`, body);
}