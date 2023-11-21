import { Client } from "@notionhq/client";
import { ArticleData } from "../model/ArticleData.js";
import "../util/logger";
import {
  BlockObjectRequest,
  CreatePageResponse,
} from "@notionhq/client/build/src/api-endpoints.js";
import { markdownToBlocks, markdownToRichText } from "@tryfabric/martian";

const notionKey = process.env.NOTION_API_KEY;
const pageId = process.env.NOTION_PAGE_ID;

if (!notionKey) {
  console.error("NOTION_API_KEY not found in env!");
  process.exit(1);
}

const notion = new Client({ auth: notionKey });


// getters
export async function fetchNotionDatabase(database_id: string) {
  try {
    const response = await notion.databases.query({ database_id });
    return response.results;
  } catch (error: any) {
    console.error("Error fetching Notion database:", error.message);
    throw error;
  }
}

// fetch articles from notion database
export async function fetchNotionArticles(databaseId: string){
}

// setters
export async function postToNotionPage(draftData: ArticleData, pageId: string) {
  try {
    const { content } = draftData;
    const notionBlocks = markdownToBlocks(content.markdown);

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
  pageData: ArticleData,
  databaseId: string
): Promise<CreatePageResponse> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: { title: [{ text: { content: pageData.title } }] },
      },
    });
    return response;
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
