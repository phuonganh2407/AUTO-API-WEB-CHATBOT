<<<<<<<< HEAD:services/api/customerApi/groupCustomer.api.ts
import { baseCustomerEndpoints } from "../../config/urls.config";
import axiosClient from "../../core/axiosClient";
import { createGroupCustomerBody } from "../../object/serviceCustomerObject/customer.api.object";
========
import { baseCustomerEndpoints } from "../../../../config/api/urls.config";
import axiosClient from "../../../../core/api/axiosClient";
import { createGroupCustomerBody } from "../../../../object/api/serviceCustomerObject/customer.api.object";
>>>>>>>> 8f92a4cbbe2900e2b539337c9f1fcf159464f120:services/api/customerApi/groupCustomer/groupCustomer.api.ts

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

/**
 * Chỉnh sửa nhóm khách hàng
 * @param id id nhóm KH cần chỉnh sửa
 * @param body body thông tin chỉnh sửa nhóm KH
 * @returns 
 */
export async function editGroupCustomer(id: number, body: Partial<createGroupCustomerBody>) {
    return axiosClient.patch(`${baseCustomerEndpoints.urlEditGroupCustomer}/${id}`, body);
};

/**
 * Xóa nhóm khách hàng
 * @param id id nhóm KH cần xóa
 * @returns
 */
export async function deleteGroupCustomer(id: number) {
    return axiosClient.delete(`${baseCustomerEndpoints.urlDeleteGroupCustomer}/${id}`);
}   