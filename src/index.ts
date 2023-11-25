import { fetchDrafts, fetchPosts } from "./services/hashnode.js";
import {
  addPageToNotionDatabase,
  fetchNotionDatabase,
  postToNotionPage,
} from "./services/notion.js";
import "./util/logger";

// const notionDbId = process.env.NOTION_DB_ID;

async function init() {
  try {
    await syncHashnodeToNotion();
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

async function fetchAll(
  type: "posts" | "drafts" = "posts",
  batchSize: number | string = 5
) {
  let posts = [];
  let nextBatch: string | false = false;

  do {
    let response: any =
      type === "posts"
        ? await fetchPosts(
            typeof batchSize === "number" ? batchSize : parseInt(batchSize),
            nextBatch !== false ? nextBatch : undefined
          )
        : await fetchDrafts(
            typeof batchSize === "number" ? batchSize : parseInt(batchSize),
            nextBatch !== false ? nextBatch : undefined
          );
    posts.push(response.posts);
    nextBatch = response.nextBatch;
  } while (nextBatch);

  return posts;
}


async function syncHashnodeToNotion() {
  const posts = await fetchAll("posts", 10);
  const drafts = await fetchAll("drafts", 10);

  console.log(posts, drafts);
  //  posts.forEach((posts) => await postToNotionPage(post, page));
  //  drafts.forEach((draft) => await postToNotionPage(draft, page));
}

await init();
