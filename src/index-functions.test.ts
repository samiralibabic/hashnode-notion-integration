import {
  describe,
  test,
  expect,
  mock,
  jest,
  spyOn,
  beforeEach,
  afterEach,
} from "bun:test";
import { init, syncHashnodeToNotion } from "./index.js";

// mock dependencies
mock.module(require.resolve("./services/notion.js"), () => ({
  getAccessToken: jest
    .fn()
    .mockReturnValue({ bot_id: "TeslaBot", access_token: "XAE12" }),
}));

// then load them
import { getAccessToken } from "./services/notion.js";
import userTokens from "./model/UserTokens.js";

describe("init", async () => {
  let originalSetInterval: any;

  beforeEach(() => {
    originalSetInterval = global.setInterval;
    const setIntervalMock = jest.fn();
    (global as any).setInterval = setIntervalMock;
  });

  afterEach(() => {
    (global as any).setInterval = originalSetInterval;
  });

  test("always calls getAccessToken with authCode", async () => {
    await init("123");

    expect(getAccessToken).toHaveBeenCalledWith("123");
  });

  test("when response 200 then stores access_token in userTokens", async () => {
    spyOn(userTokens, "set");

    await init("123");

    expect(userTokens.set).toHaveBeenCalledTimes(1);
    expect(userTokens.get("TeslaBot")).toBe("XAE12");
  });

  test("calls setInterval with syncHashnodeToNotion every 5 seconds", async () => {
    await init("123");

    expect(setInterval).toHaveBeenCalledTimes(1);
  });
});