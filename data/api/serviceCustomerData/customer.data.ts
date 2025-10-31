import { fakerVI } from "@faker-js/faker";
import { createCustomerBody } from "../../../object/api/serviceCustomerObject/customer.api.object";
import { CUSTOMER_CONSTANT } from "../../../constants/api/customer.constant";
import { getRandomData } from "../../../utils/funtionHelper";
import { getCitiesCodes } from "../../../services/api/publicApi/location.api";
import { getDistrictsCityCode, getWardsCode } from "../../../services/api/publicApi/location.api";
import { getListTag } from "../../../services/api/productApi/tags/tag.api";
import { TAGS } from "../../../constants/api/tags.constant";
import { getSession } from "../../../utils/session.helper";
import { getListGroupCustomer } from "../../../services/api/customerApi/groupCustomer.api";
import { createRandomNumberString, createRandomString } from "../../../utils/genFunctionData";

// ====================================== CUSTOMER PREPARE DATA ======================================
// Tạo random giới tính
const genderOptions = [
  CUSTOMER_CONSTANT.ANOTHER_GENDER,
  CUSTOMER_CONSTANT.MALE_GENDER,
  CUSTOMER_CONSTANT.FEMALE_GENDER,
];
const randomGender =
  genderOptions[Math.floor(Math.random() * genderOptions.length)]; // 1: Nam, 2: Nữ, 0: Khác

// Lấy id owner từ session đã lưu
const getIdOwner = () => getSession().ownerId.toString();

/**
 * Tạo danh sách địa chỉ giao hàng ngẫu nhiên theo số lượng
 * @param quantity số lượng địa chỉ cần tạo
 * @param cityCode mã thành phố
 * @param districtCode mã quận
 * @param wardCode mã phường
 * @returns
 */
export async function generateShipmentDetails(
  quantity: number
): Promise<any[]> {
  const shipmentList = [];
  for (let i = 0; i < quantity; i++) {
    // Lấy ngẫu nhiên mã thành phố, quận, phường nhằm data sinh động hơn khi chạy test
    const citiesData = await getCitiesCodes();
    const randomCity = getRandomData(citiesData.data, 1, "code")[0];

    const districtsData = await getDistrictsCityCode({ cityCode: randomCity });
    const randomDistrict = getRandomData(districtsData.data, 1, "code")[0];

    const wardsData = await getWardsCode({ districtCode: randomDistrict });
    const randomWard = getRandomData(wardsData.data, 1, "code")[0];

    shipmentList.push({
      id: i + 1,
      name: fakerVI.name.fullName() + Math.floor(Math.random() * 1000),
      phone: fakerVI.phone.number("07#########"),
      streetNo:
        Math.floor(Math.random() * 100000) + " " + fakerVI.address.streetName(),
      wardCode: randomWard,
      districtCode: randomDistrict,
      cityCode: randomCity,
      isDefault: false,
      isNewAddress: false,
    });
  }
  return shipmentList;
};

// ====================================== CREATE CUSTOMER DATA ======================================
export async function fullCreateCustomerData(): Promise<
  Partial<createCustomerBody>
> {
// Lấy ngẫu nhiên mã thành phố, quận, phường
  const citiesData = await getCitiesCodes();
  const randomCity = getRandomData(citiesData.data, 1, "code")[0];

  const districtsData = await getDistrictsCityCode({ cityCode: randomCity });
  const randomDistrict = getRandomData(districtsData.data, 1, "code")[0];

  const wardsData = await getWardsCode({ districtCode: randomDistrict });
  const randomWard = getRandomData(wardsData.data, 1, "code")[0];
  // Lấy ngẫu nhiên ID tag customer
  const tagData = await getListTag({ TagType: TAGS.TAG_CUSTOMER });
  const tagIds = getRandomData(tagData.data, 2, "id");

  // Lấy id của nhóm KH
  const groupData = await getListGroupCustomer();
  const customerGroupIds = [getRandomData(groupData.data, 1, "id")[0]];

  return {
    name: fakerVI.name.fullName() + " " + Date.now(),
    phone: fakerVI.phone.number("09########"),
    gender: randomGender,
    dateOfBirth: fakerVI.date
      .birthdate({ min: 18, max: 65, mode: "age" })
      .toISOString().split("T")[0],
    streetNo: fakerVI.address.streetAddress(),
    cityCode: randomCity,
    districtCode: randomDistrict,
    wardCode: randomWard,
    isNewAddress: false, //Đang mặc định sử dụng địa chỉ cũ (3 cấp)
    email: fakerVI.internet.email(),
    tagIds,
    isDefault: false,
    shipmentDetails: await generateShipmentDetails(2),
    authorId: getIdOwner(),
    customerGroupIds,
  };
};

/**
 * Bỏ trống tên khách hàng - Tạo random giá trị hợp lệ các field còn lại
 * @returns 
 */
export async function createCustomerWithEmptyName(): Promise<Partial<createCustomerBody>>
{
  return{...await fullCreateCustomerData(), name: ''};
};


/**
 * Tạo danh sách khách hàng với phone hợp lệ: 8 số
 * @returns 
 */
export async function createCustomersWithPhone8(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: fakerVI.phone.number("09######") };
};

/**
 * Tạo danh sách khách hàng với phone hợp lệ: 14 số
 * @returns 
 */
export async function createCustomersWithPhone14(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: fakerVI.phone.number("09############") };
};

/**
 * Tạo danh sách khách hàng với phone hợp lệ: +84
 * @returns 
 */
export async function createCustomersWithPhonePlus84(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: fakerVI.phone.number("+849########") };
};

/**
 * Tạo danh sách khách hàng với phone hợp lệ: null
 * @returns 
 */
export async function createCustomersWithPhoneNull(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: null};
};

/**
 * Tạo danh sách khách hàng với phone không hợp lệ: 6 số (Nhỏ hơn 8 số )
 * @returns 
 */
export async function createCustomerWithPhoneInvalid6(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: fakerVI.phone.number("07####") };
};

/**
 * Tạo danh sách khách hàng với phone không hợp lệ: 19 số (Lớn hơn 14 số )
 * @returns 
 */
export async function createCustomerWithPhoneInvalid19(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), phone: fakerVI.phone.number("09#################") };
};

/**
 * Tạo danh sách khách hàng với Giới tính Nữ
 * @returns 
 */
export async function createCustomerGenderFemale(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), gender: CUSTOMER_CONSTANT.FEMALE_GENDER };
};

/**
 * Tạo danh sách khách hàng với Giới tính Nam
 * @returns 
 */
export async function createCustomerGenderMale(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), gender: CUSTOMER_CONSTANT.MALE_GENDER };
};

/**
 * Tạo danh sách khách hàng với Giới tính Khác
 * @returns 
 */
export async function createCustomerGenderAnother(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), gender: CUSTOMER_CONSTANT.ANOTHER_GENDER };
};

/**
 * Tạo danh sách khách hàng với Giới tính không hợp lệ
 * @returns 
 */
export async function createCustomerGenderInvalid(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), gender: Number(createRandomNumberString(2))};
};

/**
 * Tạo danh sách khách hàng với Email không hợp lệ
 * @returns 
 */
export async function createCustomerEmailInvalid(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), email: createRandomString(10)};
};

/**
 * Tạo danh sách khách hàng với TagIds là null
 * @returns 
 */
export async function createCustomerNullTags(): Promise<Partial<createCustomerBody>> {
  return { ...await fullCreateCustomerData(), tagIds: []};
};