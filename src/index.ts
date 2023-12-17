import { fetchAll, fetchDraft, fetchPost } from "./services/hashnode.js";
import {
  addPageToNotionDatabase,
  getAccessToken,
  createNewDatabase,
  fetchNotionDatabase,
  getDatabaseFromPage,
  getSharedPage,
  postToNotionPage,
} from "./services/notion.js";
import userTokens from "./model/UserTokens.js";
import "./util/logger.js";

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const error = url.searchParams.get("error");
    const authCode = url.searchParams.get("code") as string;

    if (error) {
      return new Response(`Something went wrong: ${error}`, { status: 400 });
    }

    if (path === "/redirect" && !authCode && !error) {
      return new Response("Bad request.", { status: 400 });
    }

    if (path === "/redirect") {
      await init(authCode);
      return new Response("Integration successful.");
    }

    return new Response("404!", { status: 404 });
  },
  tls:
    process.env.NODE_ENV === "development"
      ? {
          key: Bun.file("./ssl/localhost.key"),
          cert: Bun.file("./ssl/localhost.crt"),
        }
      : undefined,
});

async function init(authCode: string) {
  try {
    const response = await getAccessToken(authCode);
    // TODO: check if token is expired and refresh if true
    userTokens.set(response.bot_id, response.access_token);
    

    setInterval(() => syncHashnodeToNotion(response.access_token, 10), 5000);
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

async function syncHashnodeToNotion(accessToken: string, batchSize: number) {
  // fetch posts and drafts from Hashnode
  const posts = await fetchAll("posts", batchSize);
  const drafts = await fetchAll("drafts", batchSize);

  // for now, just take the first page we find
  const sharedPage = await getSharedPage(accessToken);

  if (!sharedPage) {
    console.error("No shared page found in Notion");
    process.exit(1);
  }

  const res = await getDatabaseFromPage(sharedPage.id, accessToken); // also, returns the first db it finds
  let notionDbId = res.database?.id;

  if (!res.hasDatabase) {
    notionDbId = await createNewDatabase(sharedPage.id, accessToken); // or creates a new one if not found
  }

  const notionDb: any[] = await fetchNotionDatabase(
    notionDbId as string,
    accessToken
  );
  const notionArticles = notionDb.map((page) => {
    return {
      idOrSlug: page.properties.hashnodeIdOrSlug.rich_text[0]?.plain_text,
      updatedAt: page.last_edited_time,
    };
  });

  const postSlugsToAdd = posts
    .filter((post) => {
      const page = notionArticles.find((n) => n.idOrSlug === post.slug);
      return (
        !page ||
        new Date(post.lastUpdated || post.publishedAt) >
          new Date(page.updatedAt)
      );
    })
    .map((post) => post.slug);

  const draftIdsToAdd = drafts
    .filter((draft) => {
      const page = notionArticles.find((n) => n.idOrSlug === draft.id);
      return !page || new Date(draft.lastUpdated) > new Date(page.updatedAt);
    })
    .map((draft) => draft.id);

  const postPromises = postSlugsToAdd.map(
    async (slug) => await fetchPost(slug)
  );
  const draftPromises = draftIdsToAdd.map(async (id) => await fetchDraft(id));

  const postsToAdd = await Promise.all(postPromises);
  const draftsToAdd = await Promise.all(draftPromises);

  postsToAdd.forEach(async (post) => {
    let newPageId = await addPageToNotionDatabase(
      post,
      notionDbId as string,
      accessToken
    );
    await postToNotionPage(post, newPageId, accessToken);
  });
  draftsToAdd.forEach(async (draft) => {
    let newPageId = await addPageToNotionDatabase(
      draft,
      notionDbId as string,
      accessToken
    );
    await postToNotionPage(draft, newPageId, accessToken);
  });
}

export { init, syncHashnodeToNotion };
