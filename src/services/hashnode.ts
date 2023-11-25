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

export async function fetchDraft(draftId: string): Promise<ArticleData> {
  try {
    const query = `
    query {
      draft(id: "${draftId}") {
        title
        content {
          html
          text
          markdown
        }
      }
    }    
  `;

    const result = await gqlHashnodeRequest(query);
    return result.data.draft;
  } catch (error: any) {
    console.error("Error fetching draft from Hashnode:", error.message);
    throw error;
  }
}

export async function fetchPost(postSlug: string): Promise<ArticleData> {
  try {
    const query = `
      {
        publication(host: "${hashnodePublication}") {
          post(slug: "${postSlug}") {
            title
            content {
              markdown
            }
          }
        }
      }
    `;

    const result = await gqlHashnodeRequest(query);

    return result.data.publication.post;
  } catch (error: any) {
    console.error("Error fetching post from Hashnode: ", error.message);
    throw error;
  }
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
    console.error("Error fetching posts from Hashnode: ", error.message);
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
