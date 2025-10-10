import { baseProductEndpoints } from "../../../config/urls.config";
import axiosClient from "../axiosClient";

export interface CreateTagBody {
  name: string;
  type: number;
  tagColorId: number;
}

export async function createTag(data: CreateTagBody) {
  return axiosClient.post(baseProductEndpoints.tags, data);
}
