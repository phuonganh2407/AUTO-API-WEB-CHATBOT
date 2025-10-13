
import { tagsDataValid } from "../../data/tags.data";

import { createTag } from "../../services/product/tags/tag.api";



describe("Tag API - Create Tag", () => {
  test("creTag_001 - Should create a new tag successfully", async () => {
  const payload = tagsDataValid;
    const res = await createTag(payload);
    const response = res.data.data;
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response.name).toBe(payload.name);
    if (response.title) {
      expect(response.title).toBeDefined();
    }
  });
});