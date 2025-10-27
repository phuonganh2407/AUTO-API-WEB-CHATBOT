import { fakerVI } from "@faker-js/faker";
import { createCustomerBody } from "../../object/serviceCustomerObject/customer.api.object";
import { CUSTOMER_CONSTANT } from "../../constants/customer.constant";
import { getRandomData } from "../../utils/funtionHelper";
import { getCitiesCodes } from "../../services/publicApi/location.api";

const genderOptions = [CUSTOMER_CONSTANT.ANOTHER_GENDER, CUSTOMER_CONSTANT.MALE_GENDER, CUSTOMER_CONSTANT.FEMALE_GENDER];
const randomGender = genderOptions[Math.floor(Math.random() * genderOptions.length)]; // 1: Nam, 2: Nữ, 0: Khác
const cityCodeRandom =getRandomData(getCitiesCodes(),1,'code')[0];
// ============= CREATE CUSTOMER DATA =============
export async function fullCreateCustomerData(): Promise<Partial<createCustomerBody>> {
    return {
        name: fakerVI.name.fullName() + ' ' + Date.now(),
        phone: fakerVI.phone.number('0#########'),
        gender: randomGender,
        dateOfBirth: fakerVI.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().split('T')[0],
        streetNo: fakerVI.address.streetAddress(),

    };
};
