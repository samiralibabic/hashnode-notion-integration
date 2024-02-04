import { ArticleData } from "../model/ArticleData.js";
import { PostsResponse, HashnodeQueryOptions } from "../model/HashnodeData.js";
import { UserProfile } from "../model/UserProfile.js";

async function gqlHashnodeRequest(userProfile: UserProfile, query: string) {
  const data = JSON.stringify({ query });

  const response = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userProfile.hashnode_key}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = await response.json();

  return result;
}

async function fetchPostOrDraft(
  userProfile: UserProfile,
  options: HashnodeQueryOptions
): Promise<ArticleData> {
  try {
    const query = `
      {
        ${options.id
        ? `draft(id: "${options.id}")`
        : `publication(host: "${userProfile.hashnode_publication}") { post(slug: "${options.slug}")`
      }
        {
          idOrSlug: ${options.id ? `id` : `slug`}
          title
          subtitle
          content {
            markdown
          }
          updatedAt
          ${options.id ? `` : `publishedAt`}
        }
      }
    ${options.id ? `` : `}`}
    `;

    const result: any = await gqlHashnodeRequest(userProfile, query);
    if (options.id) {
      result.data.draft.status = 'Draft';
    } else {
      result.data.publication.post.status = 'Published';
    }
    return options.id ? result.data.draft : result.data.publication.post;
  } catch (error: any) {
    console.error(`Error fetching data from Hashnode: ${error.message}`);
    throw error;
  }
}

export async function fetchDraft(userProfile: UserProfile, draftId: string): Promise<ArticleData> {
  return fetchPostOrDraft(userProfile, { id: draftId });
}

export async function fetchPost(userProfile: UserProfile, postSlug: string): Promise<ArticleData> {
  return fetchPostOrDraft(userProfile, { slug: postSlug });
}

async function fetchPostsOrDrafts(
  userProfile: UserProfile,
  numResults: number,
  cursor?: string,
  type: "posts" | "drafts" = "posts"
): Promise<PostsResponse> {
  try {
    const query = `
      {
        publication(host:"${userProfile.hashnode_publication}") {
          ${type}(first: ${numResults}${cursor ? `, after: "${cursor}"` : ""}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                slug
                updatedAt
                ${type === "drafts" ? `` : `publishedAt`}
              }
            }
          }
        }
      }
    `;

    const result: any = await gqlHashnodeRequest(userProfile, query);

    const posts = result.data.publication[type].edges.map(
      (edge: { node: any }) => edge.node
    );
    const { hasNextPage, endCursor } = result.data.publication[type].pageInfo;
    const nextBatch = hasNextPage ? endCursor || false : false;

    return {
      posts,
      nextBatch,
    };
  } catch (error: any) {
    console.error(`Error fetching ${type} from Hashnode: `, error.message);
    throw error;
  }
}

export async function fetchPosts(
  userProfile: UserProfile,
  numResults: number,
  cursor?: string
): Promise<PostsResponse> {
  return await fetchPostsOrDrafts(userProfile, numResults, cursor, "posts");
}

export async function fetchDrafts(
  userProfile: UserProfile,
  numResults: number,
  cursor?: string
): Promise<PostsResponse> {
  return await fetchPostsOrDrafts(userProfile, numResults, cursor, "drafts");
}

export async function fetchAll(
  userProfile: UserProfile,
  type: "posts" | "drafts" = "posts",
  batchSize: number | string = 5
) {
  let posts = [];
  let nextBatch: string | false = false;

  do {
    let response: any =
      type === "posts"
        ? await fetchPosts(
          userProfile,
          typeof batchSize === "number" ? batchSize : parseInt(batchSize),
          nextBatch !== false ? nextBatch : undefined
        )
        : await fetchDrafts(
          userProfile,
          typeof batchSize === "number" ? batchSize : parseInt(batchSize),
          nextBatch !== false ? nextBatch : undefined
        );
    posts.push(response.posts);
    nextBatch = response.nextBatch;
  } while (nextBatch);

  return posts.flat();
}
