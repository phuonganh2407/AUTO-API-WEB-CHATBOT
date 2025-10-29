import { TAGS } from "../../../constants/tags.constant";
import { searchFullKeywordTag } from "./tags.step";
import { testWithAllure } from "../../testWithAllure";

describe("Tìm kiếm thẻ tags theo tên và bộ lọc thẻ tag theo điều kiện bộ lọc", () => {
  testWithAllure("@smoke TAG_SEARCH_012 - Kiểm tra tìm kiếm theo loại thẻ tag SẢN PHẨM", async () => {
    await searchFullKeywordTag(TAGS.TAG_PRODUCT);
  });

  testWithAllure("@smoke TAG_SEARCH_013 - Kiểm tra tìm kiếm theo loại thẻ tag KHÁCH HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_CUSTOMER);
  });

  testWithAllure("@smoke TAG_SEARCH_014 - Kiểm tra tìm kiếm theo loại thẻ tag ĐƠN HÀNG", async () => {
    await searchFullKeywordTag(TAGS.TAG_ORDER);
  });

  testWithAllure("@smoke TAG_SEARCH_015 - Kiểm tra tìm kiếm theo loại thẻ tag NHÀ CUNG CẤP", async () => {
    await searchFullKeywordTag(TAGS.TAG_SUPPLIER);
  });
  
});
