import { Client } from "@notionhq/client";
import { ArticleData } from "../model/ArticleData.js";
import { NotionPage } from "../model/NotionPage.js";
import "../util/logger";
import {
  BlockObjectRequest,
  BlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  CreatePageResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";

//const notionKey = process.env.NOTION_API_KEY;
//const pageId = process.env.NOTION_PAGE_ID;

const clientId = process.env.OAUTH_CLIENT_ID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const redirectUrl = process.env.OAUTH_REDIRECT_URL;

if (!clientId || !clientSecret || !redirectUrl) {
  console.error("OAuth data not found in .env.");
  process.exit(1);
}

let notion: Client;

export async function connectToNotion(authCode: string) {
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  
  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUrl,
    }),
  });

  const data: any = await response.json();
  notion = new Client({ auth: data["access_token"] });
  return data;
}

// getters
export async function getSharedPage() {
  try {
    const response = await notion.search({
      filter: {
        value: "page",
        property: "object",
      },
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
  page_id: string
): Promise<NotionPage> {
  let response: NotionPage = {
    hasContent: false,
    hasDatabase: false,
  };

  try {
    const blockListResponse = await notion.blocks.children.list({
      block_id: page_id,
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

export async function createNewDatabase(parentPageId: string) {
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
    });
    return response.id;
  } catch (error: any) {
    console.error("Error creating Notion database:", error.message);
    throw error;
  }
}

export async function fetchNotionDatabase(database_id: string) {
  try {
    const response = await notion.databases.query({ database_id });
    return response.results;
  } catch (error: any) {
    console.error("Error fetching Notion database:", error.message);
    throw error;
  }
}

// setters
export async function postToNotionPage(draftData: ArticleData, pageId: string) {
  try {
    const { content } = draftData;
    const cleanMarkdown = content.markdown.replace(/ align="[^"]+"/g, "");
    const notionBlocks = markdownToBlocks(cleanMarkdown);

    const notionResponse = await notion.blocks.children.append({
      block_id: pageId,
      children: notionBlocks as BlockObjectRequest[],
    });
    console.info("Response from Notion: ", notionResponse);
  } catch (error: any) {
    console.error("Error posting to Notion:", error.message);
    throw error;
  }
}

export async function addPageToNotionDatabase(
  articleData: ArticleData,
  databaseId: string
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
    });
    return response.id;
  } catch (error: any) {
    console.error("Error creating page:", error.message);
    throw error;
  }
}

export async function updateNotionPage(pageId: string, pageData: ArticleData) {
  try {
    const { content } = pageData;
    const notionBlocks = markdownToBlocks(content.markdown);

    const notionResponse = await notion.blocks.children.append({
      block_id: pageId,
      children: notionBlocks as BlockObjectRequest[],
    });
    console.info("Response from Notion: ", notionResponse);
  } catch (error: any) {
    console.error("Error updating Notion page:", error.message);
    throw error;
  }
}
