import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  mock,
  spyOn,
  test,
} from "bun:test";

import { fetchNotionDatabase, createNewDatabase, postToNotionPage} from "./notion.js";
import { fetchAll, fetchDraft, fetchPost } from "./hashnode.js";
import { UserProfile } from "../model/UserProfile.js";

import { syncHashnodeToNotion } from "./sync.js";

describe("syncHashnodeToNotion", () => {
  beforeEach(() => {
    // mock dependencies
    mock.module(require.resolve("./notion.js"), () => ({
      getSharedPage: jest.fn().mockReturnValue({ id: "123abc" }),
      getDatabaseFromPage: jest.fn().mockReturnValue({
        res: {
          hasDatabase: true,
          database: {
            id: "db1",
          },
        },
      }),
      fetchNotionDatabase: jest.fn().mockReturnValue([{
        properties: {
          hashnodeIdOrSlug: {
            rich_text: [{
              plain_text: "Article1",
            }],
          },
        },
        last_edited_time: new Date(),
      }]),
      addPageToNotionDatabase: jest.fn(),
      createNewDatabase: jest.fn(),
      postToNotionPage: jest.fn(),
    }));

    mock.module(require.resolve("./hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValue([]),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("always fetches all posts and drafts", async () => {
    let userProfile: UserProfile = {
      uuid: "123",
      hashnode_publication: '',
      hashnode_key: '',
      notion_oauth_refresh_token: '',
      notion_oauth_access_token: ''
    }
    await syncHashnodeToNotion(userProfile, 5);

    expect(fetchAll).toHaveBeenCalledTimes(2);
  });

  test("when sharedPage not found then the program exits", async () => {
    mock.module(require.resolve("./notion.ts"), () => ({
      getSharedPage: jest.fn(),
    }));
    let userProfile: UserProfile = {
      uuid: "123",
      hashnode_publication: '',
      hashnode_key: '',
      notion_oauth_refresh_token: '',
      notion_oauth_access_token: ''
    }
    const consoleErrorSpy = spyOn(console, "error").mockImplementation(jest.fn());

    const exitSpy = spyOn(process, "exit").mockImplementation((code) => {
      expect(code).toBe(1);
    });

    try {
      await syncHashnodeToNotion(userProfile, 5);
      // The function should exit before reaching this line
      expect(true).toBe(false);
    } catch (error) {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "No shared page found in Notion",
      );
    } finally {
      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
    }
  });

  test("when database does not exist then new database is created", async () => {
    mock.module(require.resolve("./notion.ts"), () => ({
      getDatabaseFromPage: jest.fn().mockReturnValue({
        hasDatabase: false,
        hasContetn: false,
      }),
    }));

    let userProfile: UserProfile = {
      uuid: "123",
      hashnode_publication: '',
      hashnode_key: '',
      notion_oauth_refresh_token: '',
      notion_oauth_access_token: ''
    }

    await syncHashnodeToNotion(userProfile, 3);

    expect(createNewDatabase).toHaveBeenCalledTimes(1);
  });

  test("always fetches the notion database", async () => {
    let userProfile: UserProfile = {
      uuid: "123",
      hashnode_publication: '',
      hashnode_key: '',
      notion_oauth_refresh_token: '',
      notion_oauth_access_token: ''
    }
    await syncHashnodeToNotion(userProfile, 3);

    expect(fetchNotionDatabase).toHaveBeenCalledTimes(1);
  });

  test("when there are drafts or posts to add then fetches their content", async () => {
    mock.module(require.resolve("./hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValueOnce([{
        slug: "abc",
      }]).mockReturnValueOnce([{
        id: 123,
      }]),
      fetchDraft: jest.fn(),
      fetchPost: jest.fn(),
    }));

    let userProfile: UserProfile = {
      uuid: "123",
      hashnode_publication: '',
      hashnode_key: '',
      notion_oauth_refresh_token: '',
      notion_oauth_access_token: ''
    }
    await syncHashnodeToNotion(userProfile, 3);

    expect(fetchPost).toHaveBeenCalledTimes(1);
    expect(fetchDraft).toHaveBeenCalledTimes(1);
  });

  test("when posts or drafts exist then posts them to notion page", async () => {
    mock.module(require.resolve("./hashnode.js"), () => ({
      fetchAll: jest.fn().mockReturnValueOnce([{
        slug: "abc",
      }]).mockReturnValueOnce([{
        id: 123,
      }]),
      fetchDraft: jest.fn(),
      fetchPost: jest.fn(),
    }));

    await syncHashnodeToNotion("token", 3);

    expect(postToNotionPage).toHaveBeenCalledTimes(2);
  });
});
