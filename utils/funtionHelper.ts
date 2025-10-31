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
    case "LOWERCASE":
      return text.toLowerCase();
    case "UPPERCASE":
      return text.toUpperCase();
    case "UNACCENT":
      // Loại bỏ dấu (basic implementation)
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
 * Cấu hình so sánh giữa request và response
 */
export type CompareConfig = {
  /** Map field request -> field response (nếu khác tên) */
  fieldMapping?: Record<string, string>;
};

/**
 * Kết quả so sánh
 */
export type CompareResult = {
  isSuccess: boolean;
  matches: string[];
  warnings: string[];
  errors: string[];
};

/**
 *  So sánh dữ liệu giữa requestBody và responseBody
 *  - Không quan tâm thứ tự mảng
 *  - Chỉ cần tồn tại các giá trị tương ứng trong mảng
 *  - Tự động bỏ qua một số field động (id, thời gian, ...)
 */
export function compareRequestResponse(
  requestBody: Record<string, any>,
  responseBody: Record<string, any>,
  { fieldMapping = {} }: CompareConfig = {}
): CompareResult {
  const result: CompareResult = {
    isSuccess: true,
    matches: [],
    warnings: [],
    errors: [],
  };

  /** Danh sách field tự động bỏ qua */
  const autoIgnored = ["id", "creationTime", "lastRecordTime"];

  /** So sánh deep-equal (dùng Jest expect) */
  const isEqual = (a: any, b: any): boolean => {
    try {
      expect(b).toEqual(a);
      return true;
    } catch {
      return false;
    }
  };

  /** Format giá trị để log dễ đọc */
  const format = (v: any): string =>
    Array.isArray(v)
      ? `[${v.map(format).join(", ")}]`
      : typeof v === "string"
      ? `"${v}"`
      : v && typeof v === "object"
      ? JSON.stringify(v)
      : String(v);

  /** Thêm lỗi và đánh dấu fail */
  const addError = (msg: string) => {
    result.errors.push(msg);
    result.isSuccess = false;
  };

  /**
   * So sánh mảng (unordered, chỉ cần tồn tại giá trị)
   */
  const compareArrays = (expected: any[], actual: any[], key: string) => {
    let matchedCount = 0;

    for (const expItem of expected) {
      if (typeof expItem === "object" && expItem !== null) {
        // Kiểm tra xem có object nào trong actual chứa đủ các field của expItem không
        const found = actual.some(actItem =>
          Object.entries(expItem)
            .filter(([k]) => !autoIgnored.includes(k))
            .every(([k, v]) => isEqual(v, actItem[k]))
        );
        if (found) matchedCount++;
      } else if (actual.includes(expItem)) {
        matchedCount++;
      }
    }

    matchedCount === expected.length
      ? result.matches.push(`${key}: all ${matchedCount} items found (unordered)`)
      : addError(`${key}: found ${matchedCount}/${expected.length} expected items`);
  };

  /** Lấy giá trị thực tế từ response theo key (hỗ trợ "tags[].id") */ 
  /* 
    * regex pattern để kiểm tra xem resKey có đúng format đặc biệt "tênMảng[].tênField" hay không. 
    * match = tênmảng, tênfield
  */
  const getResponseValue = (resKey: string, reqKey: string) => {
    const match = resKey.match(/^(.+)\[\]\.(.+)$/); // ví dụ: tags[].id
    //Nếu tồn tại match
    if (match) {
      // [full match, tên mảng, tên field]. VD: ["tags[].id", "tags", "id"]
      const [, arrayField, subField] = match;
      //Lấy dữ liệu mảng từ response. responseBody["tags"] -> [{id: 1}, {id:2}]
      const data = responseBody[arrayField];
      //Nếu data là mảng, map lấy subField từ từng phần tử. VD: [{id:1}, {id:2}] -> [1,2]
      if (Array.isArray(data)) return data.map(item => item[subField]);
        result.warnings.push(`Field '${reqKey}': '${arrayField}' is not an array in response`);
        return undefined;
    }
    return responseBody[resKey];
  };

  // So sánh từng field trong requestBody
  for (const [reqKey, expectedValue] of Object.entries(requestBody)) {
    if (autoIgnored.includes(reqKey)) continue; // tự động bỏ qua

    const resKey = fieldMapping[reqKey] ?? reqKey;
    const actualValue = getResponseValue(resKey, reqKey);

    if (actualValue === undefined) {
      result.warnings.push(`Missing field '${reqKey}' in response`);
      continue;
    }

    // Nếu là mảng → so sánh tồn tại (unordered)
    if (Array.isArray(expectedValue) && Array.isArray(actualValue)) {
      compareArrays(expectedValue, actualValue, reqKey);
      continue;
    }

    // So sánh thường
    const mappingInfo = fieldMapping[reqKey] ? ` (→ ${resKey})` : "";
    if (isEqual(expectedValue, actualValue)) {
      result.matches.push(`${reqKey}${mappingInfo}: ${format(expectedValue)}`);
    } else {
      addError(`${reqKey}${mappingInfo}: ${format(expectedValue)} ≠ ${format(actualValue)}`);
    }
  }

  // console.log("Comparison Result:", result);
  return result;
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
