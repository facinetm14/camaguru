import { extractFileExtension } from "../../src/shared/extract-file-extension";

describe("files utils", () => {
  describe("Extract file extension", () => {
    it("should return .jpeg when path is blabla.jpg", () => {
      const path = "blabla.jpg";

      expect(extractFileExtension(path)).toBe("jpg");
    });

    it("should return .png when path is blabla.jpg.png", () => {
      const path = "blabla.jpg";

      expect(extractFileExtension(path)).toBe("jpg");
    });
  });
});
