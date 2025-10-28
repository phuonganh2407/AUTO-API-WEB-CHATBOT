import { baseAuthEndpoints } from "../../config/urls.config";
import axiosClient from "../../core/axiosClient";

export async function getShopUserInfo(params?: { Status?: number , SearchText?: string , SortType?: number }) {
  return axiosClient.get(baseAuthEndpoints.urlGetShopUserInfo ,  { params } );
}
