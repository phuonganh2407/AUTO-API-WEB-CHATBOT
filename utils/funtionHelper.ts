/**
 * FUNCTION HỖ TRỢ CHO VIỆC LẤY DATA, CHECK REQUEST, CHECK RESPONSE
 * Có thể tái sử dụng trong nhiều test case
 */

/**
 * Interface cho cấu hình comparison
 */
export interface ComparisonConfig {
  /** Map field request -> field response (nếu tên khác nhau) */
  fieldMapping?: Record<string, string>;
  /** Map special fields cần xử lý đặc biệt */
  specialFieldMapping?: Record<string, string>;
  /** Danh sách fields bỏ qua không cần so sánh */
  ignoredFields?: string[];
}

/**
 * Kết quả comparison
 */
export interface ComparisonResult {
  isSuccess: boolean;
  matches: string[];
  warnings: string[];
  errors: string[];
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
  if (!data) return [];
  // Xử lý data để lấy list
  let list: any[];
  if (Array.isArray(data)) {
    list = data;
  } else if (Array.isArray(data[customField])) {
    list = data[customField];
  } else {
    throw new Error(
      `Invalid data format: '${customField}' is not a valid list`
    );
  }

  // Áp dụng filter nếu có
  if (filterFunction) {
    list = list.filter(filterFunction);
  }

  if (!list || list.length === 0) return [];

  // Tạo bản sao và map field nếu cần
  let newList: any[] = field
    ? list.map((element) => element[field])
    : list.slice();

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
  if (typeof str !== "string") return str; // Nếu không phải string, trả về nguyên

  let result = str;

  if (options.trim) {
    result = result.trim();
  }

  if (options.toLowerCase) {
    result = result.toLowerCase();
  }

  if (options.toUpperCase) {
    result = result.toUpperCase();
  }

  return result;
}

/**
 * So sánh dữ liệu giữa request body và response body (Đơn giản)
 * Chỉ so sánh các field có tên giống nhau
 * @param requestBody - Body từ request
 * @param responseBody - Body từ response
 * @param config - Cấu hình comparison (optional, chỉ dùng khi cần mapping/ignore)
 * @returns ComparisonResult
 */
export function compareRequestResponse(
  requestBody: any,
  responseBody: any,
  config: ComparisonConfig = {}
): ComparisonResult {
  const { fieldMapping = {}, ignoredFields = [] } = config;

  // Validate inputs
  if (!requestBody || typeof requestBody !== "object") {
    return {
      isSuccess: false,
      matches: [],
      warnings: [],
      errors: ["Request body is invalid or empty"],
    };
  }

  if (!responseBody || typeof responseBody !== "object") {
    return {
      isSuccess: false,
      matches: [],
      warnings: [],
      errors: ["Response body is invalid or empty"],
    };
  }

  const result: ComparisonResult = {
    isSuccess: true,
    matches: [],
    warnings: [],
    errors: [],
  };

  // So sánh từng field trong request
  Object.entries(requestBody).forEach(([reqKey, reqValue]) => {
    // Skip ignored fields
    if (ignoredFields.includes(reqKey)) return;

    // Xác định field trong response (có thể mapping)
    const resKey = fieldMapping[reqKey] || reqKey;

    // Check if field exists in response
    if (!(resKey in responseBody)) {
      result.warnings.push(`Field '${reqKey}' missing in response`);
      return;
    }

    const resValue = responseBody[resKey];

    // So sánh values
    if (areValuesEqual(reqValue, resValue)) {
      const mappingInfo = fieldMapping[reqKey] ? ` (→ ${resKey})` : "";
      result.matches.push(
        `✅ ${reqKey}${mappingInfo}: ${formatValue(reqValue)}`
      );
    } else {
      result.errors.push(
        `'${reqKey}': ${formatValue(reqValue)} ≠ ${formatValue(resValue)}`
      );
      result.isSuccess = false;
    }
  });

  return result;
}

function formatValue(value: any): string {
  return typeof value === "string" ? `"${value}"` : String(value);
}

/**
 * Helper functions for comparison
 */
function isPlainObject(value: any): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeValue(value: any): any {
  if (typeof value === "string") {
    return normalizeString(value, { trim: true });
  }
  return value;
}

function areValuesEqual(val1: any, val2: any): boolean {
  // Deep equality check
  return JSON.stringify(val1) === JSON.stringify(val2);
}

function getCommonKeys(arr1: any[], arr2: any[]): string[] {
  if (arr1.length === 0 || arr2.length === 0) return [];

  const keys1 = new Set(Object.keys(arr1[0] || {}));
  const keys2 = new Set(Object.keys(arr2[0] || {}));

  return [...keys1].filter((key) => keys2.has(key));
}

function filterArrayByKeys(arr: any[], keys: string[]): any[] {
  return arr.map((item) => {
    const filtered: any = {};
    keys.forEach((key) => {
      if (key in item) {
        filtered[key] = item[key];
      }
    });
    return filtered;
  });
}

/**
 * Xử lý kết quả comparison: log và throw error nếu cần
 * @param result - Kết quả comparison
 * @param context - Context message cho logging (vd: "Tag comparison")
 * @param throwOnFailure - Có throw error khi fail hay không (default: true)
 */
export function handleComparisonResult(
  result: ComparisonResult,
  context: string = "Comparison",
  throwOnFailure: boolean = true
): void {
  // Log matches
  result.matches.forEach((match) => console.log(match));

  // Log warnings
  result.warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));

  if (!result.isSuccess) {
    // Log errors
    console.error(`❌ ${context} failed:`);
    result.errors.forEach((error) => console.error(`  ${error}`));

    if (throwOnFailure) {
      throw new Error(`${context} failed:\n${result.errors.join("\n")}`);
    }
  } else {
    console.log(`🎉 ${context} passed successfully!`);
  }
}
