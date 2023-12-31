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

// import dependencies, mock different return values for each case
import {
  getAccessToken,
  getSharedPage,
  getDatabaseFromPage,
  fetchNotionDatabase,
  addPageToNotionDatabase,
  createNewDatabase,
  postToNotionPage,
} from "./services/notion.js";
import { fetchAll, fetchDraft, fetchPost } from "./services/hashnode.js";
import userTokens from "./model/UserTokens.js";

describe("init", () => {
  let originalSetInterval: any;

  beforeEach(() => {
    originalSetInterval = global.setInterval;
    const setIntervalMock = jest.fn();
    (global as any).setInterval = setIntervalMock;

    mock.module(require.resolve("./services/notion.js"), () => ({
      getAccessToken: jest.fn().mockReturnValue({ bot_id: "TeslaBot", access_token: "XAE12" }),
    }));
  });

  afterEach(() => {
    (global as any).setInterval = originalSetInterval;
    jest.restoreAllMocks();
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

    userTokens.set.mockRestore();
  });

  test("calls setInterval with syncHashnodeToNotion every 5 seconds", async () => {
    await init("123");

    expect(setInterval).toHaveBeenCalledTimes(1);
  });
});

describe("syncHashnodeToNotion", () => {
  beforeEach(() => {
    // mock dependencies
    mock.module(require.resolve("./services/notion.js"), () => ({
      getSharedPage: jest.fn().mockReturnValue({ id: "123abc" }),
      getDatabaseFromPage: jest.fn().mockReturnValue({
        res: {
          hasDatabase: true,
          database: {
            id: "db1"
          }
        }
      }),
      fetchNotionDatabase: jest.fn().mockReturnValue([{
        properties: {
          hashnodeIdOrSlug: {
            rich_text: [{
              plain_text: "Article1"
            }]
          },
        },
        last_edited_time: new Date()
      }]),
      addPageToNotionDatabase: jest.fn(),
      createNewDatabase: jest.fn(),
      postToNotionPage: jest.fn(),
    }));

    mock.module(require.resolve("./services/hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValue([]),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("always fetches all posts and drafts", async () => {
    await syncHashnodeToNotion("123", 5);

    expect(fetchAll).toHaveBeenCalledTimes(2);
  });

  test("when sharedPage not found then the program exits", async () => {
    mock.module(require.resolve("./services/notion.ts"), () => ({
      getSharedPage: jest.fn()
    }));
    const consoleErrorSpy = spyOn(console, "error").mockImplementation();

    const exitSpy = spyOn(process, "exit").mockImplementation((code) => {
      expect(code).toBe(1); 
    });

    try {
      await syncHashnodeToNotion("fakeAccessToken", 5);
      // The function should exit before reaching this line
      expect(true).toBe(false);
    } catch (error) {
      expect(consoleErrorSpy).toHaveBeenCalledWith("No shared page found in Notion");
    } finally {
      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
    }
  });

  test("when database does not exist then new database is created", async () => {
    mock.module(require.resolve("./services/notion.ts"), () => ({
      getDatabaseFromPage: jest.fn().mockReturnValue({
        hasDatabase: false,
        hasContetn: false
      })
    }))

    await syncHashnodeToNotion("token", 3);

    expect(createNewDatabase).toHaveBeenCalledTimes(1);
  });

  test("always fetches the notion database", async () => {
    await syncHashnodeToNotion("token", 3);

    expect(fetchNotionDatabase).toHaveBeenCalledTimes(1);
  });

  test("when there are drafts or posts to add then fetches their content", async () => {
    mock.module(require.resolve("./services/hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValueOnce([{
        slug: "abc",
      }]).mockReturnValueOnce([{
        id: 123
      }]),
      fetchDraft: jest.fn(),
      fetchPost: jest.fn()
    }))

    await syncHashnodeToNotion("token", 3);

    expect(fetchPost).toHaveBeenCalledTimes(1);
    expect(fetchDraft).toHaveBeenCalledTimes(1);
  });

  test("when posts or drafts exist then posts them to notion page", async () => {
    mock.module(require.resolve("./services/hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValueOnce([{
        slug: "abc",
      }]).mockReturnValueOnce([{
        id: 123
      }]),
      fetchDraft: jest.fn(),
      fetchPost: jest.fn()
    }))

    await syncHashnodeToNotion("token", 3);

    expect(postToNotionPage).toHaveBeenCalledTimes(2);
  });

});
