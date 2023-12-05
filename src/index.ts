import {
  fetchDraft,
  fetchDrafts,
  fetchPost,
  fetchPosts,
} from "./services/hashnode.js";
import {
  addPageToNotionDatabase,
  createNewDatabase,
  fetchNotionDatabase,
  getDatabaseFromPage,
  getSharedPage,
  postToNotionPage,
} from "./services/notion.js";
import "./util/logger";

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

  // for now, just take the first page we find
  const sharedPage = await getSharedPage();

  if (!sharedPage) {
    console.error("No shared page found in Notion");
    process.exit(1);
  }

  const res = await getDatabaseFromPage(sharedPage.id); // also, returns the first db it finds
  let notionDbId = res.database?.id;

  if (!res.hasDatabase) {
    notionDbId = await createNewDatabase(sharedPage.id); // or creates a new one if not found
  }

  const notionDb: any[] = await fetchNotionDatabase(notionDbId as string);
  const notionArticleIds = notionDb
    .map((page) => page.properties.hashnodeIdOrSlug.rich_text[0]?.plain_text)
    .filter((id) => id);

  const postSlugsToAdd = posts
    .filter((post) => !notionArticleIds.includes(post.slug))
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

  postsToAdd.forEach(async (post) => {
    let newPageId = await addPageToNotionDatabase(post, notionDbId as string);
    await postToNotionPage(post, newPageId);
  });
  draftsToAdd.forEach(async (draft) => {
    let newPageId = await addPageToNotionDatabase(draft, notionDbId as string);
    await postToNotionPage(draft, newPageId);
  });
}

await init();
