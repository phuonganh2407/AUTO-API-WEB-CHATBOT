
import { tagsDataValid } from "../../../data/tags.data";
import { createTag } from "../../../services/product/tags/tag.api";
import { compareTagDetails } from "./tags.step";

describe("Tag API - Create Tag", () => {
  test("creTag_001 - Should create a new tag successfully", async () => {
    const payload = await tagsDataValid();
    const res = await createTag(payload);
    const response = res.data;
    console.log('Create Tag Response:', response);
     await compareTagDetails(payload, res); // Thêm dòng này để so sánh
  });
});