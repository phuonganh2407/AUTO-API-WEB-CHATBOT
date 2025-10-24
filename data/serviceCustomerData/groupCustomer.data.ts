import { fakerVI } from "@faker-js/faker";
import { createGroupCustomerBody, editGroupCustomerBody } from "../../object/serviceCustomerObject/customer.api.object"; // Update the path as needed
import { createRandomNumberString } from "../../utils/genFunctionData";
import { getRandomData, getSubObjectByKeys } from "../../utils/funtionHelper";
import { getListGroupCustomer } from "../../services/customerApi/groupCustomer/groupCustomer.api";

/**
 *  Tạo dữ liệu với đầy đủ thông tin hợp lệ
 * @returns 
 */
export async function fullDataGroupCus(): Promise<Partial<createGroupCustomerBody>> {
    return {
        name: fakerVI.lorem.words(10) + ' ' + createRandomNumberString(4), // Thêm timestamp để đảm bảo unique
    };
}

/**
 *  Tạo dữ liệu với tên nhóm KH rỗng
 * @returns 
 */
export async function emptyNameGroupCus(): Promise<Partial<createGroupCustomerBody>> {
    return {
        name: '',
    };
}

/**
 * Tạo dữ liệu với tên nhóm KH đã tồn tại
 */
export async function duplicateNameGroupCus(): Promise<Partial<createGroupCustomerBody>> {
    const getNameGroupCus = getRandomData((await getListGroupCustomer()).data, 1, "name"); // Thay thế bằng tên nhóm khách hàng thực tế đã tồn tại
    return {
        name: getNameGroupCus[0],
    };
}

/**
 * Tạo dữ liệu với tên nhóm KH đã tồn tại
 */
export async function longNameGroupCus(): Promise<Partial<createGroupCustomerBody>> {
    return {
        name: fakerVI.lorem.words(50) + ' ' + createRandomNumberString(4), // Tạo tên nhóm KH dài
    };
}


/**
 * Map dữ liệu chỉnh sửa từ một nhóm khách hàng ngẫu nhiên
 * @returns 
 */
export async function mapEditGroupCusData(): Promise<{ payload: Partial<editGroupCustomerBody>; id: number }> {
    //Lấy ngẫu nhiên 1 nhóm khách hàng
    const randomGroupCus = getRandomData((await getListGroupCustomer()).data, 1)[0];
    //Lây id của nhóm khách hàng
    const idGroupCusEdit = randomGroupCus.id;
    // Map trực tiếp từ keys của interface - những field nào giống nhau sẽ map value từ nhóm khách hàng ngẫu nhiên cho body edit
    const mappedPayload = getSubObjectByKeys(randomGroupCus, Object.values(editGroupCustomerBody));
    return { payload: mappedPayload, id: idGroupCusEdit };
}