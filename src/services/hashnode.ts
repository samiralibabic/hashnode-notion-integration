import { ArticleData } from "../model/ArticleData.js";
import { gqlHashnodeRequest } from "../util/util.js";
const hashnodePublication = process.env.HASHNODE_PUBLICATION;

if (!hashnodePublication) {
  console.error("HASHNODE_API_KEY or HASHNODE_PUBLICATION not found in env!");
  process.exit(1);
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
    return result.data.post;
  } catch (error: any) {
    console.error("Error fetching post from Hashnode: ", error.message);
    throw error;
  }
}
