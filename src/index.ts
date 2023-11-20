import { fetchDraft, fetchPost } from "./services/hashnode.js";
import {
  addPageToNotionDatabase,
  fetchNotionDatabase,
  postToNotionPage,
} from "./services/notion.js";
import "./util/logger";

const notionDbId = process.env.NOTION_DB_ID;

async function fetchDataAndPost() {
  try {
    const draft = await fetchDraft("#");
    await postToNotionPage(draft, "#");
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

// fetchDataAndPost();

const article = await fetchPost("an-introduction-to-link-shortening");
const response = await addPageToNotionDatabase(article, "#");
const response2 = await postToNotionPage(article, response.id);
