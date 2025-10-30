import axiosClient from "../../../../core/api/axiosClient";
import { baseAuthEndpoints } from "../../../../config/api/urls.config";

export async function login(phone: string, password: string) {
  return axiosClient.post(baseAuthEndpoints.urlLogin,
    {
      phoneNumber: phone,
      password: password
    }
  );
}
