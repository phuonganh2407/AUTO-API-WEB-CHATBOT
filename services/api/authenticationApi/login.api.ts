import axiosClient from "../../../core/api/axiosClient";
import { baseAuthEndpoints } from "../../../config/api/urls.config";
import { loginBody } from "../../../object/api/serviceAuthenticationObject/account.api.object";

export async function login(body: loginBody) {
  // Convert to form data for OAuth2. Do body login không phải nằm dưới dạng JSON
  //OAuth2 luôn yêu cầu dữ liệu dưới dạng application/x-www-form-urlencoded => Nên phải convert thủ công chỗ này

  // Cách tự động: convert object thành form data
  const formData = new URLSearchParams(Object.entries(body));

  return axiosClient.post(baseAuthEndpoints.urlLogin, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
