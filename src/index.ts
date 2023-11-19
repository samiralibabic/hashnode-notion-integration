import { fetchDraft } from "./services/hashnode.js";
import { postToNotion } from "./services/notion.js";
import './util/logger.js';

async function fetchDataAndPost() {
  try {
    const draft = await fetchDraft('655a2f47172909000f94cd0f');
    await postToNotion(draft);
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

fetchDataAndPost();
