import { Client } from "@notionhq/client";
import { config } from "dotenv";

config();

const pageId = process.env.NOTION_PAGE_ID;
const notionKey = process.env.NOTION_API_KEY;
const hashnodeKey = process.env.HASHNODE_API_KEY;

console.log("pageId: ", pageId);
console.log("notionKey: ", notionKey);
console.log("hashnodeKey: ", hashnodeKey);

const notion = new Client({ auth: notionKey });

/* 
---------------------------------------------------------------------------
*/

/**
 * Resources:
 * - Appending block children endpoint (notion.blocks.children.append(): https://developers.notion.com/reference/patch-block-children)
 * - Working with page content guide: https://developers.notion.com/docs/working-with-page-content
 */

async function postToNotion(node) {
  const { title, content } = node;
  console.log("title: ", title);
  console.log("content: ", content.markdown);
  const blockId = pageId; // Blocks can be appended to other blocks *or* pages. Therefore, a page ID can be used for the block_id parameter
  const newHeadingResponse = await notion.blocks.children.append({
    block_id: blockId,
    // Pass an array of blocks to append to the page: https://developers.notion.com/reference/block#block-type-objects
    children: [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content: content.markdown,
              },
            },
          ],
        },
      },
    ],
  });

  // Print the new block(s) response
  console.log(newHeadingResponse);
}

async function fetchFromHashnode() {
  const query = `
    query {
      publication(host: "samiralibabic.hashnode.dev") {
        posts(first: 1) {
          edges {
            node {
              title
              content {
                markdown
              } 
            }
          }
        }
      }
    }
  `;

  const data = JSON.stringify({ query });

  const response = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${hashnodeKey}`,
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const result = await response.json();

  return result.data.publication.posts.edges[0].node;
}

const response = await fetchFromHashnode();
postToNotion(response);
