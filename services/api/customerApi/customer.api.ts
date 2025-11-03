import { baseCustomerEndpoints } from "../../../config/api/urls.config";
import axiosClient from "../../../core/api/axiosClient";
import { createCustomerBody } from "../../../object/api/serviceCustomerObject/customer.api.object";

/**
 *  Tạo khách hàng mới
 * @param body
 * @returns
 */
export async function createCustomer(body: createCustomerBody) {
  return axiosClient.post(baseCustomerEndpoints.urlCreateCustomer, body);
}

/**
 *  Lấy chi tiết khách hàng
 * @param id khách hàng cần lấy chi tiết
 * @returns
 */
export async function detailCustomer(id: number) {
  return axiosClient.get(`${baseCustomerEndpoints.urlDetailCustomer}/${id}`);
}

/**
 * Lấy danh sách khách hàng theo điều kiện bộ lọc
 * @param params 
 * @returns 
 */
export async function getListCustomer(params?: {
  TagIds?: number[];
  CustomerGroupIds?: number[];
  SearchText?: string;
  MaxResultCount?: number;
  SkipCount?: number;
}) {
  return axiosClient.get(baseCustomerEndpoints.urlGetListCustomer, { params });
}


export async function editCustomer(id: number, body: Partial<createCustomerBody>) {
  return axiosClient.patch(`${baseCustomerEndpoints.urlEditCustomer}/${id}`, body);
}