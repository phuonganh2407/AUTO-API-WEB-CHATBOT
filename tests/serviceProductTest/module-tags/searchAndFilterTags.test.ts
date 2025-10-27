import { TAGS } from "../../../constants/tags.constant";
import { searchFullKeywordTag } from "./tags.step";

describe("Tìm kiếm thẻ tags theo tên và bộ lọc thẻ tag theo điều kiện bộ lọc", () => {
  test("@smoke searchTag_001 - Kiểm tra tìm kiếm theo loại thẻ tag SẢN PHẨM", async () => {
    await searchFullKeywordTag(TAGS.TAG_PRODUCT);
  });

    test("@smoke searchTag_002 - Kiểm tra tìm kiếm theo loại thẻ tag KHÁCH HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_CUSTOMER);
  });

    test("@smoke searchTag_003 - Kiểm tra tìm kiếm theo loại thẻ tag ĐƠN HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_ORDER);
  });

    test("@smoke searchTag_004 - Kiểm tra tìm kiếm theo loại thẻ tag NHÀ CUNG CẤP", async () => {
    await searchFullKeywordTag(TAGS.TAG_SUPPLIER);
  });
  
});
