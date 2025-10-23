import { baseCustomerEndpoints } from "../../../config/urls.config";
import axiosClient from "../../../core/axiosClient";
import { createGroupCustomerBody } from "../../../object/serviceCustomerObject/customer.api.object";

/**
 * Tạo nhóm khách hàng mới
 * @param body Thông tin nhóm khách hàng cần tạo
 * @returns Promise chứa thông tin nhóm khách hàng vừa tạo
 */
export async function createGroupCustomer(body: createGroupCustomerBody) {
    return axiosClient.post(baseCustomerEndpoints.urlCreateGroupCustomer, body);
}

/**
 * Lấy danh sách nhóm khách hàng
 * @param params Tham số tìm kiếm
 * @returns Promise chứa danh sách nhóm khách hàng
 */
export async function getListGroupCustomer(params?: { CustomerSearchText?: string, TagIds?: number[] }) {
    return axiosClient.get(baseCustomerEndpoints.urlGetListGroupCustomer, { params });
}