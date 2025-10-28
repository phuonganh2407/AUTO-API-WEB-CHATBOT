import { fakerVI } from "@faker-js/faker";
import { createCustomerBody } from "../../object/serviceCustomerObject/customer.api.object";
import { CUSTOMER_CONSTANT } from "../../constants/customer.constant";
import { getRandomData } from "../../utils/funtionHelper";
import {
  getCitiesCodes,
  getDistrictsCityCode,
  getWardsCode,
} from "../../services/publicApi/location.api";
import { getListTag } from "../../services/productApi/tags/tag.api";
import { TAGS } from "../../constants/tags.constant";
import { getSession } from "../../utils/session.helper";
import { getListGroupCustomer } from "../../services/customerApi/groupCustomer.api";

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
}

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
    phone: fakerVI.phone.number("0#########"),
    gender: randomGender,
    dateOfBirth: fakerVI.date
      .birthdate({ min: 18, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0],
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
}
