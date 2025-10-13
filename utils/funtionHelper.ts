/**
 * FUNCTION HỖ TRỢ CHO VIỆC LẤY DATA, CHECK REQUEST, CHECK RESPONSE
 * Có thể tái sử dụng trong nhiều test case
 */

/**
 * Lấy ngẫu nhiên một số lượng phần tử từ list, có thể theo field cụ thể, hỗ trợ customField và filter
 * @param data - Dữ liệu đầu vào (mảng hoặc object chứa mảng)
 * @param quantity - Số lượng phần tử cần lấy (null để lấy tất cả)
 * @param field - Tên field để map (null để giữ nguyên object)
 * @param customField - Tên field chứa mảng nếu data là object (mặc định "items")
 * @param filterFunction - Hàm filter tuỳ chỉnh cho danh sách
 * @returns Mảng các phần tử ngẫu nhiên
 */
export function getRandomData(data: any, quantity: number | null = null, field: string | null = null, customField: string = "items",
    filterFunction?: (item: any) => boolean): any[] {
    if (!data) return [];
    // Xử lý data để lấy list
    let list: any[];
    if (Array.isArray(data)) {
        list = data;
    } else if (Array.isArray(data[customField])) {
        list = data[customField];
    } else {
        throw new Error(`Invalid data format: '${customField}' is not a valid list`);
    }

    // Áp dụng filter nếu có
    if (filterFunction) {
        list = list.filter(filterFunction);
    }

    if (!list || list.length === 0) return [];

    // Tạo bản sao và map field nếu cần
    let newList: any[] = field ? list.map(element => element[field]) : list.slice();

    // Nếu quantity là null, lấy toàn bộ dữ liệu
    if (quantity === null) {
        return newList;
    }

    // Lấy ngẫu nhiên quantity phần tử
    let randData: any[] = [];
    while (randData.length < quantity && newList.length > 0) {
        const randIndex = Math.floor(Math.random() * newList.length);
        randData.push(newList[randIndex]);
        newList.splice(randIndex, 1); // Loại bỏ để tránh lặp lại
    }
    return randData;
}
