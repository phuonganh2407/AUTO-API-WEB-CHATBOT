
import { tagsDataValid } from "../../../data/tags.data";
import { createTag, detailTag } from "../../../services/product/tags/tag.api";
import { compareTagDetails } from "./tags.step";
import { handleComparisonResult } from "../../../utils/funtionHelper";

describe("Tag API - Create Tag", () => {
  test("creTag_001 - Should create a new tag successfully", async () => {
    const payload = await tagsDataValid();
    const createRes = await createTag(payload);
    const detailRes = await detailTag(createRes.data.id);

    // So sánh chi tiết tag
    const result = compareTagDetails(payload, detailRes);

    // Xử lý kết quả comparison
    handleComparisonResult(result, "Tag comparison");
  });
});