/**
 * FUNCTION HỖ TRỢ CHO VIỆC LẤY DATA, CHECK REQUEST, CHECK RESPONSE
 * Có thể tái sử dụng trong nhiều test case
 */

import { expect } from "@jest/globals";

/**
 * Transform search text theo condition
 */
export function transformSearchText(text: string, condition: string): string {
  switch (condition) {
    case 'LOWERCASE':
      return text.toLowerCase();
    case 'UPPERCASE':
      return text.toUpperCase();
    case 'UNACCENT':
      // Loại bỏ dấu (basic implementation)
      return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    default:
      return text;
  }
}

/**
 * @description HÀM KIỂM TRA STATUS ĐỐI VỚI CÁC REQUEST FAILED
 * @param response - Response object từ API call
 * @param status - Status code mong đợi
 * @param message - Message cần kiểm tra trong response
 */
export async function testsCheckFails(
  response: any,
  status: number,
  message: string
): Promise<void> {
  try {
    await response;
    throw new Error("Expected API to fail but it succeeded");
  } catch (error: any) {
    const res = error.response;
    expect(res.status).toBe(status);
    const resText = JSON.stringify(res.data);
    expect(resText).toContain(message);
  }
}

/**
 * Lấy ngẫu nhiên một số lượng phần tử từ list, có thể theo field cụ thể, hỗ trợ customField và filter
 * @param data - Dữ liệu đầu vào (mảng hoặc object chứa mảng)
 * @param quantity - Số lượng phần tử cần lấy (null để lấy tất cả)
 * @param field - Tên field để map (null để giữ nguyên object)
 * @param customField - Tên field chứa mảng nếu data là object (mặc định "items")
 * @param filterFunction - Hàm filter tuỳ chỉnh cho danh sách
 * @returns Mảng các phần tử ngẫu nhiên
 */
export function getRandomData(
  data: any,
  quantity: number | null = null,
  field: string | null = null,
  customField: string = "items",
  filterFunction?: (item: any) => boolean
): any[] {
  // Kiểm tra nếu data không tồn tại, trả về mảng rỗng
  if (!data) return [];

  // Xử lý data để lấy list
  let list: any[];
  if (Array.isArray(data)) {
    // Nếu data là mảng, sử dụng trực tiếp
    list = data;
  } else if (Array.isArray(data[customField])) {
    // Nếu data là object và có field customField là mảng, lấy mảng đó
    list = data[customField];
  } else {
    // Nếu không phải, throw error
    throw new Error(
      `Invalid data format: '${customField}' is not a valid list`
    );
  }

  // Áp dụng filter nếu có hàm filter được cung cấp
  if (filterFunction) {
    list = list.filter(filterFunction);
  }

  // Nếu list rỗng sau filter, trả về mảng rỗng
  if (!list || list.length === 0) return [];

  // Tạo bản sao của list và map field nếu cần
  let newList: any[] = field
    ? list.map((element) => element[field]) // Map từng element lấy field cụ thể
    : list.slice(); // Sao chép toàn bộ list

  // Nếu quantity là null, trả về toàn bộ newList
  if (quantity === null) {
    return newList;
  }

  // Lấy ngẫu nhiên quantity phần tử
  let randData: any[] = [];
  while (randData.length < quantity && newList.length > 0) {
    // Chọn index ngẫu nhiên
    const randIndex = Math.floor(Math.random() * newList.length);
    // Thêm phần tử vào randData
    randData.push(newList[randIndex]);
    // Loại bỏ phần tử đã chọn để tránh lặp lại
    newList.splice(randIndex, 1);
  }
  return randData;
}

/**
 * Chuẩn hóa chuỗi với các tùy chọn trim, uppercase, lowercase
 * @param str - Chuỗi đầu vào
 * @param options - Tùy chọn chuẩn hóa
 * @returns Chuỗi đã chuẩn hóa
 */
export function normalizeString(
  str: string,
  options: { trim?: boolean; toLowerCase?: boolean; toUpperCase?: boolean } = {}
): string {
  // Nếu không phải string, trả về nguyên giá trị
  if (typeof str !== "string") return str;

  let result = str;

  // Áp dụng trim nếu được bật
  if (options.trim) {
    result = result.trim();
  }

  // Chuyển về lowercase nếu được bật
  if (options.toLowerCase) {
    result = result.toLowerCase();
  }

  // Chuyển về uppercase nếu được bật
  if (options.toUpperCase) {
    result = result.toUpperCase();
  }

  return result;
}

/**
 * Type cho cấu hình comparison (optional)
 */
export type ComparisonConfig = {
  /** Map field request -> field response (nếu tên khác nhau) */
  fieldMapping?: Record<string, string>;
  /** Danh sách fields bỏ qua không cần so sánh */
  ignoredFields?: string[];
};

/**
 * Type cho kết quả comparison
 */
export type ComparisonResult = {
  isSuccess: boolean;
  matches: string[];
  warnings: string[];
  errors: string[];
};

/**
 * So sánh dữ liệu giữa request body và response body
 * @param requestBody - Body từ request
 * @param responseBody - Body từ response
 * @param config - Cấu hình comparison (optional)
 * @returns Kết quả comparison
 */
export function compareRequestResponse(
  requestBody: any,
  responseBody: any,
  config: {
    /** Map field request -> field response (nếu tên khác nhau) */
    fieldMapping?: Record<string, string>;
    /** Danh sách fields bỏ qua không cần so sánh */
    ignoredFields?: string[];
  } = {}
): {
  isSuccess: boolean;
  matches: string[];
  warnings: string[];
  errors: string[];
} {
  // Lấy cấu hình, mặc định là object rỗng
  const { fieldMapping = {}, ignoredFields = [] } = config;

  // Validate inputs: kiểm tra requestBody
  if (!requestBody || typeof requestBody !== "object") {
    return {
      isSuccess: false,
      matches: [],
      warnings: [],
      errors: ["Request body is invalid or empty"],
    };
  }

  // Validate inputs: kiểm tra responseBody
  if (!responseBody || typeof responseBody !== "object") {
    return {
      isSuccess: false,
      matches: [],
      warnings: [],
      errors: ["Response body is invalid or empty"],
    };
  }

  // Khởi tạo kết quả comparison
  const result: {
    isSuccess: boolean;
    matches: string[];
    warnings: string[];
    errors: string[];
  } = {
    isSuccess: true,
    matches: [],
    warnings: [],
    errors: [],
  };

  // Duyệt qua từng field trong requestBody
  Object.entries(requestBody).forEach(([reqKey, reqValue]) => {
    // Bỏ qua fields trong ignoredFields
    if (ignoredFields.includes(reqKey)) return;

    // Xác định tên field trong response (có thể được map)
    const resKey = fieldMapping[reqKey] || reqKey;

    // Kiểm tra xem field có tồn tại trong response không
    if (!(resKey in responseBody)) {
      result.warnings.push(`Field '${reqKey}' missing in response`);
      return;
    }

    // Lấy giá trị từ response
    const resValue = responseBody[resKey];

    // So sánh values sử dụng Jest expect với try-catch để thu thập lỗi
    try {
      expect(resValue).toEqual(reqValue); // Dùng Jest toEqual cho deep equality
      // Nếu pass, thêm vào matches
      const mappingInfo = fieldMapping[reqKey] ? ` (→ ${resKey})` : "";
      result.matches.push(`${reqKey}${mappingInfo}: ${formatValue(reqValue)}`);
    } catch (error) {
      // Nếu fail, thu thập error mà không throw ngay
      result.errors.push(
        `'${reqKey}': ${formatValue(reqValue)} ≠ ${formatValue(resValue)}`
      );
      result.isSuccess = false;
    }
  });

  return result;
}

function formatValue(value: any): string {
  // Định dạng giá trị để khi console log ra dễ debug: nếu là string thì thêm dấu ngoặc kép, type: 4 (number) → log ra: type: 4
  return typeof value === "string" ? `"${value}"` : String(value);
}

/**
 * Xử lý kết quả comparison: chỉ log khi fail, không log khi pass
 * @param result - Kết quả comparison
 * @param context - Context message cho logging (vd: "Tag comparison")
 * @param throwOnFailure - Có throw error khi fail hay không (default: true)
 */
export function handleComparisonResult(
  result: {
    isSuccess: boolean;
    matches: string[];
    warnings: string[];
    errors: string[];
  },
  context: string = "Comparison",
  throwOnFailure: boolean = true
): void {
  // Nếu không thành công
  if (!result.isSuccess) {
    // Log các warnings (các field bị thiếu)
    result.warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));

    // Log các errors (các field không khớp)
    console.error(`❌ ${context} failed:`);
    result.errors.forEach((error) => console.error(`  ${error}`));

    // Nếu throwOnFailure = true, throw error để fail test
    if (throwOnFailure) {
      throw new Error(`${context} failed:\n${result.errors.join("\n")}`);
    }
  }
  // Nếu thành công, không log gì (để Jest tự báo pass)
}

/**
 * Map dữ liệu từ response sang interface body edit
 * @param source - Object nguồn
 * @param interfaceKeys - Mảng keys của interface
 * @returns Object mapped theo interface
 */
export function getSubObjectByKeys(source: any, keys: string[]): any {
  const result: any = {};

  // Duyệt qua từng key của interface
  for (const key of keys) {
    // Chỉ gán nếu source có field này và không undefined
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }

  return result;
}
