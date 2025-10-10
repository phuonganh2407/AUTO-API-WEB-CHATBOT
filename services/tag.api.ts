import { baseProductEndpoints } from "../config/urls.config";
import axiosClient from "../core/axiosClient";
import { createTagBody as CreateTagBody } from "../object/tag.api.object";


export async function createTag(data: CreateTagBody) {
  return axiosClient.post(baseProductEndpoints.tags, data);
}
