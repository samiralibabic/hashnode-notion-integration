import { describe, expect, test, jest, beforeEach, afterEach } from "bun:test";
import * as path from "path";
import { decorate, getRelativeFilePath } from "./logger.js";

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


// describe("decorate", () => {
//   let mockOriginalFunction;
//
//   beforeEach(() => {
//     jest.spyOn(global, 'Error').mockImplementation(() => ({
//       stack: undefined,
//     }));
//
//     mockOriginalFunction = jest.fn();
//   });
//
//   afterEach(() => {
//     jest.spyOn(global, 'Error').mockRestore();
//   });
//
//
//   test("should call the original function with decorated arguments", () => {
//     const mockArgs = ["arg1", "arg2"];
//
//     decorate(mockOriginalFunction, ...mockArgs as []);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining("[mockOriginalFunction |"),
//       ...mockArgs
//     );
//   });
//
//   test("should enhance the original function with timestamp, file path, and function name", () => {
//     const mockArgs = ["arg1", "arg2"];
//     const timestamp = new Date().toLocaleTimeString();
//
//     decorate(mockOriginalFunction, ...mockArgs as []);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining(`[${mockOriginalFunction.name} | ${timestamp} | unknown]`), 
//       ...mockArgs
//     );
//   });
//
//   test("should correctly decorate the 'log' function", () => {
//     const mockArgs = ["arg1", "arg2"];
//     const timestamp = new Date().toLocaleTimeString();
//
//     console.log(...mockArgs);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining(`[log | ${timestamp} | unknown]`),
//       ...mockArgs
//     );
//   });
//
//   test("should correctly decorate the 'error' function", () => {
//     const mockArgs = ["arg1", "arg2"];
//     const timestamp = new Date().toLocaleTimeString();
//
//     console.error(...mockArgs);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining(`[error | ${timestamp} | unknown]`),
//       ...mockArgs
//     );
//   });
//
//   test("should correctly decorate the 'info' function", () => {
//     const mockArgs = ["arg1", "arg2"];
//     const timestamp = new Date().toLocaleTimeString();
//
//     console.info(...mockArgs);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining(`[info | ${timestamp} | unknown]`),
//       ...mockArgs
//     );
//   });
//
//   test("should correctly decorate the 'warn' function", () => {
//     const mockArgs = ["arg1", "arg2"];
//     const timestamp = new Date().toLocaleTimeString();
//
//     console.warn(...mockArgs);
//
//     expect(mockOriginalFunction).toHaveBeenCalledWith(
//       expect.stringContaining(`[warn | ${timestamp} | unknown]`),
//       ...mockArgs
//     );
//   });
// });
