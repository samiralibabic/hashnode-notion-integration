import {
  describe,
  test,
  expect,
  mock,
  jest,
} from "bun:test";

describe("Bun.serve", () => {
  test("throws an exception if 'error' query parameter is present when '/notion' endpoint is hit", async () => {
    mock.module(require.resolve('./services/notion.ts'), () => ({
      getAccessToken: jest.fn(),
    }));
    const request = "http://localhost:3000/notion?error=123";

    const response = await fetch(request);

    expect(this).toThrow(Error);
    // expect(response.status).toBe(400);
    // expect(await response.text()).toBe("Something went wrong: 123");
  });

  test("returns 400 if '/notion' endpoint is hit without auth code or error parameters", async () => {
    const response = await fetch("http://localhost:3000/notion");

    expect(response.status).toEqual(400);
    expect(await response.text()).toBe("Bad request.");
  });

  test("returns 200 and calls init when authorization code hits '/notion' endpoint", async () => {
    const request = "http://localhost:3000/notion?code=123";
    mock.module(require.resolve("./index.js"), () => ({
      init: jest.fn(),
    }));

    const response = await fetch(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Ok");
    // expect(init).toHaveBeenCalledWith("123");
  });

  test("returns 404 when anything but /notion is hit", async () => {
    const request = "http://localhost:3000/";

    const response = await fetch(request);

    expect(response.status).toBe(404);
  });
});
