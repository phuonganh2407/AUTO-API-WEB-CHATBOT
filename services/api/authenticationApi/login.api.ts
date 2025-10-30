<<<<<<<< HEAD:services/api/authenticationApi/login.api.ts
import axiosClient from "../../core/axiosClient";
import { baseAuthEndpoints } from "../../config/urls.config";
========
import axiosClient from "../../../../core/api/axiosClient";
import { baseAuthEndpoints } from "../../../../config/api/urls.config";
>>>>>>>> 8f92a4cbbe2900e2b539337c9f1fcf159464f120:services/api/authenticationApi/account/login.api.ts

export async function login(phone: string, password: string) {
  return axiosClient.post(baseAuthEndpoints.urlLogin,
    {
      phoneNumber: phone,
      password: password
    }
  );
}
