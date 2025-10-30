import { baseProductEndpoints } from "../../../../config/api/urls.config";
import axiosClient from "../../../../core/api/axiosClient";

/**
 * Lấy danh sách màu sắc của các thẻ (tag)
 * @returns Promise chứa danh sách màu sắc của các thẻ
 */
export async function getTagColor() {
    return axiosClient.get(baseProductEndpoints.urlGetTagColor);
}
