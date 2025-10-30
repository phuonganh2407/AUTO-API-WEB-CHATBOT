import { baseAuthEndpoints } from "../../../../config/api/urls.config";
import axiosClient from "../../../../core/api/axiosClient";

export async function getShopUserInfo(params?: { Status?: number , SearchText?: string , SortType?: number }) {
  return axiosClient.get(baseAuthEndpoints.urlGetShopUserInfo ,  { params } );
}
