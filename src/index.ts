import { fetchDraft, fetchPost, fetchPosts } from "./services/hashnode.js";
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

/* const article = await fetchPost("an-introduction-to-link-shortening");
const response = await addPageToNotionDatabase(article, "#");
const response2 = await postToNotionPage(article, response.id); */


// this can be used to fetch posts in batches too
console.log(await fetchPosts(5));

// On init: fetch all posts from hashnode, and create pages in Notion for a) new articles, b) updated atricles
// This will ensure all articles from Hashnode are available in Notion on startup
// Can be used later for a two-way sync, but for now we will restrict editing to Notion only.