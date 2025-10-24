import { group } from "console";

// Danh sách message lỗi dùng cho test case, chia theo từng service
export const errorMessages = {
  product: {
    createTagEmptyName: "Please enter a name",
    createTagDuplicateName: "Tag already exists in the system",
    createTagLongName: "The maximum length of the name must be 25 characters or less.",
    deleteTagNoteExisted: "Tag not exist.",
    // Thêm các lỗi khác của service product ở đây
  },

  groupCustomer: {
    createGroupCusDuplicateName: "Customer group with this name exists",
    // Function tạo message động cho tên quá dài
    createGroupCusLongName: (length: number) => `The length of 'Name' must be 100 characters or fewer. You entered ${length} characters.`,
    
    createGroupCusEmptyName: "'Name' must not be empty",
  },
  // Thêm các service khác ở đây
  // auth: { ... },
  // order: { ... },
};