import { getAccessToken } from "./services/notion.js";
import { syncHashnodeToNotion } from "./services/sync.js";
import { createDatabase, insertIntoDb, selectByPublication, selectByUuid } from "./services/database.js";
import { UserProfile } from "./model/UserProfile.js";

import "./util/logger.js";
import Database from "bun:sqlite";

console.log(`Starting ${Bun.env.NODE_ENV} server.`);

Bun.serve({
  async fetch(req) {
    let hashionDb = createDatabase();
    const url = new URL(req.url);
    const path = url.pathname;

    switch (path) {
      case '/add': return add();

      case '/notion': return await notion(req, hashionDb);

      case '/verify': return verify(req, hashionDb);

      case '/hashnode': return hashnode(req, hashionDb);
    }

    return new Response("404!", { status: 404 });
  },
  tls:
    Bun.env.NODE_ENV === "development"
      ? {
        key: Bun.file("./ssl/localhost.key"),
        cert: Bun.file("./ssl/localhost.crt"),
      }
      : undefined,
  error(error) {
    console.error(error.message);

    return Response.error();
  }
});

/**
 * Creates a unique UUID, appends is to 'state' and initiates OAuth flow with Notion 
 * @returns {Response} - Redirect response to authorization url
 */
function add(): Response {
  console.log('Initiating OAuth flow with Notion...');
  const uuid = Math.random().toString(36).substring(2) + Date.now().toString(36);
  let authUrl = (Bun.env.AUTHORIZATION_URL as string).concat(`&state=${uuid}`);
  console.log(`Redirecting to ${authUrl}`);

  return Response.redirect(authUrl, 302);
}

/**
  * Handles OAuth response from Notion, exchanges the authorization code for an access
  * token, refresh token and saves the UUID and tokens to the database.
  * @param {Request} req - The HTTP request object containing the OAuth response.
  * @param {Database} hashionDb - A database on which to operate
  * @returns {Response} - The HTTP response object.
  */
async function notion(req: Request, hashionDb: Database): Promise<Response> {
  console.log('Received OAuth response from Notion: ', req)
  const url = new URL(req.url);

  if (url.searchParams.has('error')) {
    throw new Error('Access to Notion denied.');
  }

  // check for uuid, fetch access_token and save both to sqllite
  if (url.searchParams.has('code')) {
    console.log('Received authorization code from Notion.')

    try {
      const tokenResponse = await getAccessToken(url.searchParams.get('code') as string);
      console.log('Received token: ', tokenResponse);
      const uuid = url.searchParams.get('state');
      console.log(`Saving UUID ${uuid} and access token ${tokenResponse.access_token} to database...`);

      let userProfile: UserProfile | null = selectByUuid(hashionDb, uuid as string);

      if (userProfile) {
        userProfile.notion_oauth_access_token = tokenResponse.access_token;
        // userProfile.notion_oauth_refresh_token= tokenResponse.refresh_token;
        userProfile.uuid = uuid as string;
      } else {
        userProfile = {
          uuid: uuid as string,
          hashnode_publication: "",
          hashnode_key: "",
          notion_oauth_access_token: tokenResponse.access_token,
          notion_oauth_refresh_token: "",
        }
      }

      insertIntoDb(hashionDb, userProfile);

      return Response.redirect('/hashnode', 302);
    } catch (error) {
      console.error('Could not exchange authorization code for access token.', (error as Error).message);

      return new Response('Internal server error.', { status: 500 });
    }
  }

  return new Response("Bad request.", { status: 400 });
}

/**
 * Verifies if UUID is present in a Databse
 * @param {Request} req - The HTTP request object containing UUID to verify
 * @returns {Response} - The HTTP response object.
 */
function verify(req: Request, hashionDb: Database): Response {
  let url = new URL(req.url);
  console.log('Verifying UUID: ', url.searchParams.get('uuid'));

  const userProfile: UserProfile | null = selectByUuid(hashionDb, url.searchParams.get('uuid') as string);
  
  return userProfile ? new Response('Ok.', { status: 200}) : new Response('Not found.', { status: 404});
}

/** Synchronises data between Notion and Hashnode for a specific user
 * @param {Database} hashionDb - A database on which to operate
 * @param {Request} req - The HTTP request object with user profile data
 * @returns {Response} - The HTTP response object.
 */
function hashnode(req: Request, hashionDb: Database): Response {
  const url = new URL(req.url);
  const publication = url.searchParams.get('publication');
  const hashnode_key = url.searchParams.get('hashnode_key');
  const uuid = url.searchParams.get('uuid');

  let userProfile: UserProfile = selectByUuid(hashionDb, uuid as string) as UserProfile;

  userProfile.hashnode_publication = publication as string;
  userProfile.hashnode_key = hashnode_key as string;

  console.log(`Synchronising user profile ${userProfile} \n`, req);

  // TODO: replace with cron
  setInterval(() => syncHashnodeToNotion(userProfile, 10), 5000);
  return new Response('', { status: 200 });
}


