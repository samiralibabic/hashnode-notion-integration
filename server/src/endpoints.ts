import { insertIntoDb, selectByUuid } from "./services/database.js";
import { getAccessToken } from "./services/notion.js";
import { UserProfile } from "./model/UserProfile.js";
import Database from "bun:sqlite";

/**
 * Creates a unique UUID, appends it to 'state' and initiates OAuth flow with Notion 
 * @returns {Response} - Redirect response to enriched authorization url
 */
export function add(): Response {
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
export async function notion(req: Request, hashionDb: Database): Promise<Response> {
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

      return new Response('Ok. Notion data collected. Proceeed to /hashnode.', { status: 200 });
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
export function verify(req: Request, hashionDb: Database): Response {
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
export function hashnode(req: Request, hashionDb: Database): Response {
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

