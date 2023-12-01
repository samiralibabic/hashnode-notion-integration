import { ArticleData } from "../model/ArticleData.js";
import { gqlHashnodeRequest } from "../util/util.js";

const hashnodePublication = process.env.HASHNODE_PUBLICATION;

if (!hashnodePublication) {
  console.error("HASHNODE_PUBLICATION not found in env!");
  process.exit(1);
}

interface Post {
  id: string;
  slug: string;
}

interface PostsResponse {
  posts: Post[];
  nextBatch: string | boolean;
}

interface HashnodeQueryOptions {
  id?: string;
  slug?: string;
}

async function fetchPostOrDraft(
  options: HashnodeQueryOptions
): Promise<ArticleData> {
  try {
    const query = `
      {
        ${
          options.id
            ? `draft(id: "${options.id}")`
            : `publication(host: "${hashnodePublication}") { post(slug: "${options.slug}")`
        }
        {
          title
          subtitle
          content {
            markdown
          }
        }
      }
    ${options.id ? `` : `}`}
    `;

    const result = await gqlHashnodeRequest(query);
    return options.id ? result.data.draft : result.data.publication.post;
  } catch (error: any) {
    console.error(`Error fetching data from Hashnode: ${error.message}`);
    throw error;
  }
}

export async function fetchDraft(draftId: string): Promise<ArticleData> {
  return fetchPostOrDraft({ id: draftId });
}

export async function fetchPost(postSlug: string): Promise<ArticleData> {
  return fetchPostOrDraft({ slug: postSlug });
}

async function fetchPostsOrDrafts(
  numResults: number,
  cursor?: string,
  type: "posts" | "drafts" = "posts"
): Promise<PostsResponse> {
  try {
    const query = `
      {
        publication(host:"${hashnodePublication}") {
          ${type}(first: ${numResults}${cursor ? `, after: "${cursor}"` : ""}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                slug
              }
            }
          }
        }
      }
    `;

    const result = await gqlHashnodeRequest(query);

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
  numResults: number,
  cursor?: string
): Promise<PostsResponse> {
  return await fetchPostsOrDrafts(numResults, cursor, "posts");
}

export async function fetchDrafts(
  numResults: number,
  cursor?: string
): Promise<PostsResponse> {
  return await fetchPostsOrDrafts(numResults, cursor, "drafts");
}
