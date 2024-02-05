import { UserProfile } from "../model/UserProfile.js";
import { fetchAll, fetchDraft, fetchPost } from "./hashnode.js";
import {
  addPageToNotionDatabase,
  createNewDatabase,
  fetchNotionDatabase,
  getDatabaseFromPage,
  getSharedPage,
  postToNotionPage,
} from "./notion.js";
import "../util/logger.js";

export async function syncHashnodeToNotion(userProfile: UserProfile, batchSize: number) {
  // fetch posts and drafts from Hashnode
  const posts = await fetchAll(userProfile, "posts", batchSize);
  const drafts = await fetchAll(userProfile, "drafts", batchSize);

  // for now, just take the first page we find
  const sharedPage = await getSharedPage(userProfile.notion_oauth_access_token);

  if (!sharedPage) {
    console.error("No shared page found in Notion");
    process.exit(1);
  }

  const res = await getDatabaseFromPage(sharedPage.id, userProfile.notion_oauth_access_token); // returns the first db it finds
  let notionDbId = res.database?.id;

  if (!res.hasDatabase) {
    notionDbId = await createNewDatabase(sharedPage.id, userProfile.notion_oauth_access_token); // or creates a new one if not found
  }

  const notionDb: any[] = await fetchNotionDatabase(
    notionDbId as string,
    userProfile.notion_oauth_access_token
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
    async (slug) => await fetchPost(userProfile, slug)
  );
  const draftPromises = draftIdsToAdd.map(async (id) => await fetchDraft(userProfile, id));

  const postsToAdd = await Promise.all(postPromises);
  const draftsToAdd = await Promise.all(draftPromises);

  for (const post of postsToAdd) {
    const newPageId = await addPageToNotionDatabase(
      post,
      notionDbId as string,
      userProfile.notion_oauth_access_token
    );
    await postToNotionPage(post, newPageId, userProfile.notion_oauth_access_token);
  }

  for (const draft of draftsToAdd) {
    const newPageId = await addPageToNotionDatabase(
      draft,
      notionDbId as string,
      userProfile.notion_oauth_access_token
    );
    await postToNotionPage(draft, newPageId, userProfile.notion_oauth_access_token);
  }
}
