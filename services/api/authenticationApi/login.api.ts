import axiosClient from "../../../core/api/axiosClient";
import { baseAuthEndpoints } from "../../../config/api/urls.config";
import { loginBody } from "../../../object/api/serviceAuthenticationObject/account.api.object";

export async function login(body: loginBody) {
  // Convert to form data for OAuth2. OAuth2 requires application/x-www-form-urlencoded
  const formData = new URLSearchParams(Object.entries(body));

  return axiosClient.post(baseAuthEndpoints.urlLogin, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
