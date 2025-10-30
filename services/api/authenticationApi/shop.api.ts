import { baseAuthEndpoints } from "../../config/urls.config";
import axiosClient from "../../core/axiosClient";

export async function getIdShop() {
  return axiosClient.get(baseAuthEndpoints.urlGetAllShops);
};