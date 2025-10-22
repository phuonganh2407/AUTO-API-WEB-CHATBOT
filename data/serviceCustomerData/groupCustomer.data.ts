import { fakerVI } from "@faker-js/faker";
import { createGroupCustomerBody } from "../../object/serviceCustomerObject/customer.api.object"; // Update the path as needed

/**
 *  Tạo dữ liệu với đầy đủ thông tin hợp lệ
 * @returns 
 */
export async function fullDataGroupCus(): Promise<Partial<createGroupCustomerBody>> {
    return {
        name: fakerVI.company.name() + '_' + Date.now(), // Thêm timestamp để đảm bảo unique
    };
}