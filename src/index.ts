import {
  fetchDraft,
  fetchDrafts,
  fetchPost,
  fetchPosts,
} from "./services/hashnode.js";
import {
  addPageToNotionDatabase,
  fetchNotionDatabase,
  postToNotionPage,
} from "./services/notion.js";
import "./util/logger";

const notionDbId = process.env.NOTION_DB_ID;

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

  return posts.flat();
}

async function syncHashnodeToNotion() {
  const posts = await fetchAll("posts", 10);
  const drafts = await fetchAll("drafts", 10);

  const notionDb: any[] = await fetchNotionDatabase(notionDbId as string);
  const notionArticleIds = notionDb
    .map((page) => page.properties.HashnodeId.rich_text[0]?.plain_text)
    .filter((id) => id);

  const postSlugsToAdd = posts
    .filter((post) => !notionArticleIds.includes(post.id))
    .map((post) => post.slug);

  const draftIdsToAdd = drafts
    .filter((draft) => !notionArticleIds.includes(draft.id))
    .map((draft) => draft.id);

  const postPromises = postSlugsToAdd.map(
    async (slug) => await fetchPost(slug)
  );
  const draftPromises = draftIdsToAdd.map(async (id) => await fetchDraft(id));

  const postsToAdd = await Promise.all(postPromises);
  const draftsToAdd = await Promise.all(draftPromises);

  // TODO: after creating each new page, fetch it's id and call postToNotionPage to 
  // populate its content / markdown
  postsToAdd.forEach((post) => addPageToNotionDatabase(post, notionDbId as string));
  draftsToAdd.forEach((draft) => addPageToNotionDatabase(draft, notionDbId as string));
}

await init();
