import { baseProductEndpoints } from "../../../config/urls.config";
import axiosClient from "../../../core/axiosClient";

/**
 * Lấy danh sách màu sắc của các thẻ (tag)
 * @returns Promise chứa danh sách màu sắc của các thẻ
 */
export async function getTagColor() {
    return axiosClient.get(baseProductEndpoints.urlGetTagColor);
}
