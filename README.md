# Hashnode - Notion integration

This is an integration for Notion which enables to work with Hashnode blogs directly from Notion.

## Features

1. Possible to edit Hashnode blogs in Notion. Changes sync every n seconds/minutes (configurable)
1. Properties sync to Hashnode (there is a mapping from template to Hashnode)
1. Single Notion DB holds a single Hashnode publication

## Tech stack

- Runtime and tooling: Bun
- Notion Client SDK
- @tryfabric/martian for parsing Markdown into Notion blocks

## Setup

Copy `.env.example` to `.env` and fill in the values:

```shell
# Notion
OAUTH_CLIENT_ID = '<notion_client_id>'
OAUTH_CLIENT_SECRET = '<notion_client_secret>'
OAUTH_REDIRECT_URL = 'https://localhost:3000/redirect'

# Hashnode
HASHNODE_PUBLICATION = '<hashnode_publication>'
HASHNODE_API_KEY = '<hashnode_api_key>'
```

You can find those values in your notion [integrations](https://www.notion.so/my-integrations) page.

## SSL Certificates

### Generate a private key

```openssl genpkey -algorithm RSA -out localhost.key```

### Generate a certificate signing request (CSR)

```openssl req -new -key localhost.key -out localhost.csr```

### Generate a self-signed certificate

```openssl x509 -req -in localhost.csr -signkey localhost.key -out localhost.crt```

Put them in a `ssl` folder in project root.

### Install dependencies

```shell
bun install
```

### Run and watch

```shell
bun dev
```

### Run

```shell
bun start
```

### Test

When .env does not exist:

```shell
bun run test
```

or, when .env exists:

```shell
bun test
```

The server will be running on `https://localhost:3000` and expects redirects with authorization code to `https://localhost:3000/redirect`.
