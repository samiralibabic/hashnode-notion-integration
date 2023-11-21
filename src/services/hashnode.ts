import { ArticleData } from "../model/ArticleData.js";
import { gqlHashnodeRequest } from "../util/util.js";
const hashnodePublication = process.env.HASHNODE_PUBLICATION;

if (!hashnodePublication) {
  console.error("HASHNODE_API_KEY or HASHNODE_PUBLICATION not found in env!");
  process.exit(1);
}

type PostsResponse = {
  posts: {
    id: string;
    slug: string;
  }[];
  nextBatch: string | false;
};

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

export async function fetchPosts(
  numResults: number,
  cursor?: string
): Promise<PostsResponse> {
  try {
    const query = `
    {
      publication(host:"${hashnodePublication}") {
        posts(first: ${numResults}${cursor ? `, after: "${cursor}"` : ""}) {
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

    const result = (await gqlHashnodeRequest(query)) as {
      data: {
        publication: {
          posts: {
            pageInfo: {
              hasNextPage: boolean;
              endCursor: string | null;
            };
            edges: Array<{ node: { id: string; slug: string } }>;
          };
        };
      };
    };

    const posts = result.data.publication.posts.edges.map((edge) => edge.node);
    const { hasNextPage, endCursor } = result.data.publication.posts.pageInfo;
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
