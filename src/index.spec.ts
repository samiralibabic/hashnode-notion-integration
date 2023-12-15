import { describe, test, expect, mock, jest } from "bun:test";
import { init } from "./index.js";

describe("Bun.serve", () => {
  test("returns 400 and error if 'error' query parameter is present when '/redirect' endpoint is hit", async () => {
    const request = "http://localhost:3000/redirect?error=123";

    const response = await fetch(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Something went wrong: 123");
  });

  test("returns 400 if '/redirect' endpoint is hit without auth code or error parameters", async () => {
    const response = await fetch("http://localhost:3000/redirect");

    expect(response.status).toEqual(400);
    expect(await response.text()).toBe("Bad request.");
  });

  test("returns 200 and calls init when authorization code hits '/redirect' endpoint", async () => {
    const request = "http://localhost:3000/redirect?code=123";
    mock.module(require.resolve('./index.js'), () => ({
      init: jest.fn(),
    }));

    const response = await fetch(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Integration successful.");
    expect(init).toHaveBeenCalledWith("123");
  });

  test("returns 404 when anything but /redirect is hit", async () => {
    const request = "http://localhost:3000/";

    const response = await fetch(request);

    expect(response.status).toBe(404);
  });
});


