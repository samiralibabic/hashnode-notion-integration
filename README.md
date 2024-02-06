# Hashion monorepo

There are following services:

    +---------+           +----------+   +----------+
    | Server  |           | Client   |   | Waitlist |
    | (Bun)   |<--------->| (Bun)    |   | (Nextjs) |
    +---------+           +----------+   +----------+
        ^
        |----------------------+
        |                      |
        v                      v
    +---------+           +----------+
    | Notion  |           | Hashnode |
    | (REST)  |           | GraphQL  |
    +---------+           +----------+

## How it works?

* client renders a landing page with the "Add to Notion button"
* the request is sent to server where unique uuid for user is 
  created, before passing OAuth request to Notion
* after authorizing with Notion, Notion redirects user back to
  server (/notion endpoint)
* server stores Notion tokens and uuid in a database and 
  redirects user back to frontend (/form page) with their uuid
* user fills in the form with Hashnode publication and API Key
  and submits the form back to server (/hashnode endpoint)
* the server takes publication and Hashnode API key, retrieves 
  the user with uuid and saves a complete profile in a database
* the server responds with 200 and frontend displays confirmation
  message to the client
* cron job runs regularly to sync data of all the users in database
* if a cron detects that a user has revoked access, user profile
  is removed from the database
* waitlist is an independent service for collecting e-mails, 
  which are managed by EmailOctopus

# Install

TODO

# Run

TODO
