import axiosClient from "../../../core/api/axiosClient";
import { baseAuthEndpoints } from "../../../config/api/urls.config";
import { loginBody } from "../../../object/api/serviceAuthenticationObject/account.api.object";
export async function login(body: loginBody) {
  return axiosClient.post(baseAuthEndpoints.urlLogin,body);
}
