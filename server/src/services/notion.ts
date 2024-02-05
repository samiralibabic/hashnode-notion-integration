import { Client } from "@notionhq/client";
import { ArticleData } from "../model/ArticleData.js";
import { NotionPage } from "../model/NotionPage.js";
import "../util/logger";
import {
  BlockObjectRequest,
  BlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  CreatePageResponse,
  OauthTokenResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUrl = process.env.OAUTH_REDIRECT_URL;

if (!clientId || !clientSecret || !redirectUrl) {
  console.error("OAuth data not found in .env.");
  process.exit(1);
}

const notion = new Client();

// getters
export async function getAccessToken(authCode: string) {
  const token = notion.oauth.token({
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: redirectUrl,
    client_id: clientId as string,
    client_secret: clientSecret as string,
  });

  return token;
}

export async function getSharedPage(accessToken: string) {
  try {
    const response = await notion.search({
      filter: {
        value: "page",
        property: "object",
      },
      auth: accessToken,
    });
    const sharedParentPage = response.results.find(
      (page) => (page as PageObjectResponse).parent?.type === "workspace"
    );
    return sharedParentPage ? sharedParentPage : null;
  } catch (error: any) {
    console.error("Error fetching shared content:", error.message);
    throw error;
  }
}

export async function getDatabaseFromPage(
  page_id: string,
  accessToken: string
): Promise<NotionPage> {
  let response: NotionPage = {
    hasContent: false,
    hasDatabase: false,
  };

  try {
    const blockListResponse = await notion.blocks.children.list({
      block_id: page_id,
      auth: accessToken,
    });

    if (blockListResponse.results.length !== 0) {
      response.hasContent = true;

      let isChildDatabaseBlock = function (
        block: PartialBlockObjectResponse | BlockObjectResponse
      ): block is ChildDatabaseBlockObjectResponse {
        return "type" in block && block.type === "child_database";
      };

      const childDatabaseObject =
        blockListResponse.results.find(isChildDatabaseBlock);

      if (childDatabaseObject) {
        response.hasDatabase = true;
        response.database = {
          id: childDatabaseObject.id,
        };
      }
    }

    return response;
  } catch (error: any) {
    console.error("Error fetching Notion page:", error.message);
    throw error;
  }
}

export async function fetchNotionDatabase(
  database_id: string,
  accessToken: string
) {
  try {
    const response = await notion.databases.query({
      database_id,
      auth: accessToken,
    });
    return response.results;
  } catch (error: any) {
    console.error("Error fetching Notion database:", error.message);
    throw error;
  }
}

// setters
export async function createNewDatabase(
  parentPageId: string,
  accessToken: string
) {
  try {
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: parentPageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: "Hashnode",
          },
        },
      ],
      properties: {
        Title: { title: {} },
        hashnodeIdOrSlug: {
          type: "rich_text",
          rich_text: {},
        },
        status: {
          type: "select",
          select: {
            options: [
              {
                name: "Published",
                color: "green",
              },
              {
                name: "Draft",
                color: "red",
              },
            ],
          },
        },
      },
      auth: accessToken,
    });
    return response.id;
  } catch (error: any) {
    console.error("Error creating Notion database:", error.message);
    throw error;
  }
}

export async function postToNotionPage(
  draftData: ArticleData,
  pageId: string,
  accessToken: string
) {
  try {
    const { content } = draftData;
    const cleanMarkdown = content.markdown.replace(/ align="[^"]+"/g, "");
    const notionBlocks = markdownToBlocks(cleanMarkdown);

    const notionResponse = await notion.blocks.children.append({
      block_id: pageId,
      children: notionBlocks as BlockObjectRequest[],
      auth: accessToken
    });
    console.info("Response from Notion: ", notionResponse);
  } catch (error: any) {
    console.error("Error posting to Notion:", error.message);
    throw error;
  }
}

export async function addPageToNotionDatabase(
  articleData: ArticleData,
  databaseId: string,
  accessToken: string
) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: { title: [{ text: { content: articleData.title } }] },
        hashnodeIdOrSlug: {
          type: "rich_text",
          rich_text: [{ text: { content: articleData.idOrSlug } }],
        },
        status: {
          type: "select",
          select: {
            name: articleData.status,
          },
        },
      },
      auth: accessToken,
    });
    return response.id;
  } catch (error: any) {
    console.error("Error creating page:", error.message);
    throw error;
  }
}
