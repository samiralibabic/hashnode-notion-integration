import { Database } from 'bun:sqlite';
import { UserProfile } from '../model/UserProfile.js';

export function createDatabase() {
  const db = new Database(':memory:');

  db.exec(`create table if not exists user_data (
    uuid text primary key, 
    hashnode_publication text not null,
    hashnode_key text not null,
    notion_oauth_access_token text,
    notion_oauth_refresh_token text
  )`);

  return db;
}

export function insertIntoDb(database: Database, userProfile: UserProfile) {
  console.log(`Inserting or updating: ${userProfile.hashnode_publication}`);

  const insert = database.prepare(`
    INSERT OR REPLACE INTO user_data (
      uuid, 
      hashnode_publication, 
      hashnode_key, 
      notion_oauth_access_token,
      notion_oauth_refresh_token
    ) VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(
    userProfile.uuid,
    userProfile.hashnode_publication,
    userProfile.hashnode_key,
    userProfile.notion_oauth_access_token,
    userProfile.notion_oauth_refresh_token
  );
}

export function selectByUuid(database: Database, uuid: string): UserProfile | null {
  const selectByUuid = database.prepare(`SELECT * FROM user_data WHERE uuid = ?`);

  return selectByUuid.get(uuid) as UserProfile | null;
}

export function selectByPublication(database: Database, publication: string): UserProfile | null {
  const selectByPublication = database.prepare(`SELECT * FROM user_data WHERE hashnode_publication = ?`);

  return selectByPublication.get(publication) as UserProfile | null;
}

