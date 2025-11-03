//ĐỊNH NGHĨA KIỂU DỮ LIỆU CHO GROUP CUSTOMER API
export interface createGroupCustomerBody {
  name: string;
}

/**
 * Định nghĩa kiểu dữ liệu cho body khi chỉnh sửa một nhóm khách hàng
 */
export enum editGroupCustomerBody {
  name = "name",
}

/**
 * Định nghĩa kiểu dữ liệu cho body khi tạo mới một Khách hàng
 */
export interface createCustomerBody {
  name: string;
  // Cho phép phone có thể null nếu không cung cấp số điện thoại
  phone: string | null;
  gender: number;
  dateOfBirth: string;
  streetNo: string;
  // Các mã địa chỉ có thể null theo nghiệp vụ (đôi khi chưa cập nhật hoặc không bắt buộc)
  wardCode: string | null;
  districtCode: string | null;
  cityCode: string | null;
  // isNewAddress: boolean;
  email: string;
  tagIds: number[];
  isDefault: boolean;
  shipmentDetails: Array<{
    name: string;
    // Cho phép phone của địa chỉ giao hàng cũng có thể null
    phone: string | null;
    streetNo: string;
    wardCode: string | null;
    districtCode: string | null;
    cityCode: string | null;
    isDefault: boolean;
    // isNewAddress: boolean;
  }>;
  authorId: string;
  customerGroupIds: number[];
}

export const editCustomerBody: createCustomerBody = {
  name: "Lê Minh T",
  phone: "0935000999",
  gender: 0,
  dateOfBirth: "1997-12-27",
  streetNo: "268 Lý Thường Kiệt",
  wardCode: "213",
  districtCode: "321",
  cityCode: "123",
  // "isNewAddress": true,
  email: "example@gmail.com",
  tagIds: [0],
  isDefault: true,
  shipmentDetails: [
    {
      name: "Lê Minh T",
      phone: "0935000999",
      streetNo: "1 Bến Thành",
      wardCode: "26740",
      districtCode: "760",
      cityCode: "79",
      isDefault: true,
      // "isNewAddress": true
    },
  ],
  authorId: "string",
  customerGroupIds: [0],
};
