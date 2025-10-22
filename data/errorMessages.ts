// Danh sách message lỗi dùng cho test case, chia theo từng service
export const errorMessages = {
  product: {
    createTagEmptyName: "Please enter a name",
    createTagDuplicateName: "Tag already exists in the system",
    createTagLongName: "The maximum length of the name must be 25 characters or less.",
    deleteTagNoteExisted: "Tag not exist.",
    // Thêm các lỗi khác của service product ở đây
  },
  // Thêm các service khác ở đây
  // auth: { ... },
  // order: { ... },
};