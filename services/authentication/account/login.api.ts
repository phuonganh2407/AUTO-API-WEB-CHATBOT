import axiosClient from "../../../core/axiosClient";
import { baseAuthEndpoints } from "../../../config/urls.config";

export async function login(phone: string, password: string) {
  return axiosClient.post(baseAuthEndpoints.urlLogin,
    {
      phoneNumber: phone,
      password: password
    }
  );
}
