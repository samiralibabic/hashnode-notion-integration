import { describe, expect, test } from "bun:test";
import * as path from "path";
import { getRelativeFilePath } from "./logger.js";

describe("getRelativeFilePath", () => {
  test("returns the relative file path", () => {
    const filePath = path.resolve(__dirname, "index.ts");
    const relativeFilePath = getRelativeFilePath(filePath);
    expect(relativeFilePath).toBe("src/util/index.ts");
  });

  test("returns the relative file path from subdirectory", () => {
    const filePath = path.resolve(__dirname, "files/fileUtils.ts");
    const relativeFilePath = getRelativeFilePath(filePath);
    expect(relativeFilePath).toBe("src/util/files/fileUtils.ts");
  });
});
