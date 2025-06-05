import { getFileExtension } from "../../src/domain/utils/files-utils";

describe("files utils", () => {
  describe("Get file extension", () => {
    it("should return .jpeg when path is blabla.jpg", () => {
      const path = "blabla.jpg";

      expect(getFileExtension(path)).toBe("jpg");
    });

    it("should return .png when path is blabla.jpg.png", () => {
      const path = "blabla.jpg";

      expect(getFileExtension(path)).toBe("jpg");
    });
  });
});
