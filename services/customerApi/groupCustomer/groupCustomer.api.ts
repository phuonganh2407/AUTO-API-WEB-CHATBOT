import { baseCustomerEndpoints } from "../../../config/urls.config";
import axiosClient from "../../../core/axiosClient";
import { createGroupCustomerBody } from "../../../object/serviceCustomerObject/customer.api.object";

export async function createGroupCustomer(body: createGroupCustomerBody) {
    return axiosClient.post(baseCustomerEndpoints.urlCreateGroupCustomer, body);
}