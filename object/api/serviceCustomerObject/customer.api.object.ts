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
  phone: string;
  gender: number;
  dateOfBirth: string;
  streetNo: string;
  wardCode: string;
  districtCode: string;
  cityCode: string;
  isNewAddress: boolean;
  email: string;
  tagIds: number[];
  isDefault: boolean;
  shipmentDetails: [
    {
      id: number;
      name: string;
      phone: string;
      streetNo: string;
      wardCode: string;
      districtCode: string;
      cityCode: string;
      isDefault: boolean;
      isNewAddress: boolean;
    }
  ];
  authorId: string;
  customerGroupIds: number[];
}
