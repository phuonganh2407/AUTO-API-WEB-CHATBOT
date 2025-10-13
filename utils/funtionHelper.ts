/**
 * FUNCTION HỖ TRỢ CHO VIỆC LẤY DATA, CHECK REQUEST, CHECK RESPONSE
 * Có thể tái sử dụng trong nhiều test case
 */

/**
 * Lấy ngẫu nhiên một số lượng phần tử từ list, có thể theo field cụ thể
 * @param list - Mảng dữ liệu đầu vào
 * @param count - Số lượng phần tử cần lấy (null để lấy tất cả)
 * @param field - Tên field để map (null để giữ nguyên object)
 * @returns Mảng các phần tử ngẫu nhiên
 */
function getRandomData<T>(list: T[], count: number | null = null, field: keyof T | null = null): any[] {
    // Tạo một bản sao của list để tránh ảnh hưởng đến list ban đầu
    let newList: any[] = field ? list.map(element => element[field as keyof T]) : list.slice();
    // Nếu count là null, lấy toàn bộ dữ liệu
    if (count === null) {
        return newList;
    }
    let randData: any[] = [];
    while (randData.length < count && newList.length > 0) {
        const randIndex = Math.floor(Math.random() * newList.length);
        randData.push(newList[randIndex]);
        newList.splice(randIndex, 1); // Loại bỏ phần tử đã chọn để tránh lặp lại
    }

    return randData;
}

export { getRandomData };
