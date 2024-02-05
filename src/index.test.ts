import {
  describe,
  test,
  expect,
} from "bun:test";
import { createNewDatabase } from "./services/notion.js";

describe("Bun.serve", () => {
  // TODO: investigate how to test the server
  test.skip("always creates a database", async () => {
    const requestUrl = 'http://localhost:3000';

    const response = await fetch(requestUrl);

    expect(createNewDatabase).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(404);
  });

});
