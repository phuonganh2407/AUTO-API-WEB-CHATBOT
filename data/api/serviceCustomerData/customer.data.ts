import { fakerVI } from "@faker-js/faker";
import { createCustomerBody, editCustomerBody } from "../../../object/api/serviceCustomerObject/customer.api.object";
import { CUSTOMER_CONSTANT } from "../../../constants/api/customer.constant";
import { getRandomData, getSubObjectByKeys } from "../../../utils/funtionHelper";
import { getCitiesCodes } from "../../../services/api/publicApi/location.api";
import { getDistrictsCityCode, getWardsCode } from "../../../services/api/publicApi/location.api";
import { getListTag } from "../../../services/api/productApi/tags/tag.api";
import { TAGS } from "../../../constants/api/tags.constant";
import { getSession } from "../../../utils/session.helper";
import { getListGroupCustomer } from "../../../services/api/customerApi/groupCustomer.api";
import { createRandomNumberString, createRandomString } from "../../../utils/genFunctionData";
import { detailCustomer, editCustomer, getListCustomer } from "../../../services/api/customerApi/customer.api";
import { getShopUserInfo } from "../../../services/api/authenticationApi/shopUser.api";

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
      // isNewAddress: false,
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
    // isNewAddress: false, //Đang mặc định sử dụng địa chỉ cũ (3 cấp)
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


// ====================================== EDIT CUSTOMER DATA ======================================
export async function mapEditCustomerData(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy danh sách khách hàng hiện có
  const listRes = getRandomData((await getListCustomer()).data, 1)[0];

  const idCustomerEdit = listRes.id;

  const detailRes = (await detailCustomer(idCustomerEdit)).data;
  
  if(detailRes.dateOfBirth?.includes("T")){
    detailRes.dateOfBirth = detailRes.dateOfBirth.split("T")[0];
  }

  // Convert response fields về đúng format của request body
  if (detailRes.tags && Array.isArray(detailRes.tags)) {
    // Map tags[] thành tagIds[] để lấy giá trị id gán vào body request (Vì respsonse trả về là tags object)
    detailRes.tagIds = detailRes.tags.map((tag: any) => tag.id);
    delete detailRes.tags;
  }
  
  if (detailRes.customerGroups && Array.isArray(detailRes.customerGroups)) {
    // Map customerGroups[] thành customerGroupIds[] để lấy giá trị id gán vào body request (Vì respsonse trả về là customerGroups object)
    detailRes.customerGroupIds = detailRes.customerGroups.map((group: any) => group.id);
    delete detailRes.customerGroups;
  }
  
  // Clean shipmentDetails - chỉ giữ lại các field cần thiết theo template
  if (detailRes.shipmentDetails && Array.isArray(detailRes.shipmentDetails)) {
    //Mặc định lấy [0] vì body editCustomerBody chỉ có 1 object shipmentDetails
    const shipmentTemplate = editCustomerBody.shipmentDetails[0];
    const shipmentKeys = Object.keys(shipmentTemplate);
    detailRes.shipmentDetails = detailRes.shipmentDetails.map((item: any) => 
      getSubObjectByKeys(item, shipmentKeys)
    );
  }
  
  const mapped = getSubObjectByKeys(detailRes, Object.keys(editCustomerBody));
  return { payload: mapped, id: idCustomerEdit };
}

/**
 * Thay đổi tên khách hàng khi chỉnh sửa
 * @returns 
 */
export async function editCustomerChangeName(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy dữ liệu chỉnh sửa từ một khách hàng ngẫu nhiên
  const { payload, id } = await mapEditCustomerData();
  return {payload: { ...payload as any, name: `${fakerVI.color.human()}_${Date.now()}` }, id };
};

/**
 * Thay đổi tên khách hàng thành chuỗi rỗng khi chỉnh sửa
 * @returns 
 */
export async function editCustomerEmptyName(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy dữ liệu chỉnh sửa từ một khách hàng ngẫu nhiên
  const { payload, id } = await mapEditCustomerData();
  return {payload: { ...payload as any, name: "" }, id };
};

/**
 * Thay đổi phone khách hàng thành phone hợp lệ khi chỉnh sửa
 * @returns 
 */
export async function editCustomerPhoneValid(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy dữ liệu chỉnh sửa từ một khách hàng ngẫu nhiên
  const { payload, id } = await mapEditCustomerData();
  return {payload: { ...payload as any, phone: fakerVI.phone.number("038#######") }, id };
};

/**
 * Thay đổi email khách hàng thành email hợp lệ khi chỉnh sửa
 * @returns 
 */
export async function editCustomerEmailValid(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy dữ liệu chỉnh sửa từ một khách hàng ngẫu nhiên
  const { payload, id } = await mapEditCustomerData();
  return {payload: { ...payload as any, email: fakerVI.internet.email() }, id };
};

export async function editCustomerAuthorIdValid(): Promise<{
  payload: Partial<typeof editCustomerBody>;
  id: number;
}> {
  // Lấy dữ liệu chỉnh sửa từ một khách hàng ngẫu nhiên
  const { payload, id } = await mapEditCustomerData();
  const getIdAccountant = getRandomData((await getShopUserInfo()).data, 1, "id", "shopUsers", item => item.role.name === "Kế toán")[0];
  console.log('Selected Accountant ID for AuthorId:', getIdAccountant);
  return {payload: { ...payload as any, authorId: String(getIdAccountant) }, id };
};
