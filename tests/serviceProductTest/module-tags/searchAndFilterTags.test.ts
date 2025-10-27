import { TAGS } from "../../../constants/tags.constant";
import { searchFullKeywordTag } from "./tags.step";

describe("Tìm kiếm thẻ tags theo tên và bộ lọc thẻ tag theo điều kiện bộ lọc", () => {
  test("@smoke TAG_SEARCH_001 - Kiểm tra tìm kiếm theo loại thẻ tag SẢN PHẨM", async () => {
    await searchFullKeywordTag(TAGS.TAG_PRODUCT);
  });

    test("@smoke TAG_SEARCH_002 - Kiểm tra tìm kiếm theo loại thẻ tag KHÁCH HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_CUSTOMER);
  });

    test("@smoke TAG_SEARCH_003 - Kiểm tra tìm kiếm theo loại thẻ tag ĐƠN HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_ORDER);
  });

    test("@smoke TAG_SEARCH_004 - Kiểm tra tìm kiếm theo loại thẻ tag NHÀ CUNG CẤP", async () => {
    await searchFullKeywordTag(TAGS.TAG_SUPPLIER);
  });
  
});
