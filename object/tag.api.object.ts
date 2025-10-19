/**
 * Định nghĩa kiểu dữ liệu cho body khi tạo mới một tag
 */
export interface createTagBody {
  name: string;
  type: number;
  tagColorId: number;
}


/**
 * Định nghĩa kiểu dữ liệu cho body khi chỉnh sửa một tag
 */
export enum editTagBody {
  name = "name",
  tagColorId = "tagColorId",
}