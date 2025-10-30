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

// export async function