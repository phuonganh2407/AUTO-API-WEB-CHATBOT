import { createTag } from "../../api/apiProduct/tag.api";

describe("Tag API - Create Tag", () => {
  test("creTag_001 - Should create a new tag successfully", async () => {
    const body = {
      name: "Sữa",
      type: 1,
      tagColorId: 57601197211648,
    };

    const res = await createTag(body);

    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty("id");
    expect(res.data.data.name).toBe(body.name);
  });
});
