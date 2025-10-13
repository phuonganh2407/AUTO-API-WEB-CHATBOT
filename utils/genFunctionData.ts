//FUNCTION HỖ TRỢ CHO VIỆC RANDOM DATA, TẠO DỮ LIỆU TEST

/**
 * Tạo chuỗi ký tự ngẫu nhiên
 * @param length nhập chiều dài ký tự chuỗi mong muốn
 * @returns Trả về chuỗi ký tự theo lengh
 */
export function createRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Tạo chuỗi số ngẫu nhiên
 * @param length nhập chiều dài ký tự chuỗi mong muốn 
 * @returns Trả về chuỗi ký tự theo lengh
 */
export function createRandomNumberString(length: number): string {
    const chars = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
