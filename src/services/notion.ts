import { Client } from "@notionhq/client";
import { ArticleData } from "../model/ArticleData.js";
import '../util/logger.ts';

const notionKey = process.env.NOTION_API_KEY;
const pageId = process.env.NOTION_PAGE_ID;

if (!notionKey || !pageId) {
  console.error("NOTION_API_KEY or NOTION_PAGE_ID not found in env!");
  process.exit(1);
}

const notion = new Client({ auth: notionKey });

export async function postToNotion(draftData: ArticleData) {
  try {
    const { title, content } = draftData;
    const blockId = pageId;

    const notionResponse = await notion.blocks.children.append({
      block_id: blockId as string,
      children: [
        {
          heading_1: {
            rich_text: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content.markdown,
                },
              },
            ],
          },
        },
      ],
    });
    console.info("Response from Notion: ", notionResponse);
  } catch (error: any) {
    console.error("Error posting to Notion:", error.message);
    throw error;
  }
}
