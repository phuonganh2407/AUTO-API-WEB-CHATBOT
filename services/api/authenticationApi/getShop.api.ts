import { baseAuthEndpoints } from "../../../config/api/urls.config";
import axiosClient from "../../../core/api/axiosClient";

export async function getIdShop() {
  return axiosClient.get(baseAuthEndpoints.urlGetAllShops);
};