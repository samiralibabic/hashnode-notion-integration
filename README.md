# Hashnode - Notion integration

This is an integration for Notion which enables to work with Hashnode blogs directly from Notion.

## Features

1. Possible to edit blogs either on Hashnode or in Notion. Changes sync every n seconds/minutes (configurable)
1. Properties sync to Hashnode (eg. Published to true will publish the article)
1. Single Notion DB holds a single Hashnode publication

## Tech stack

- Runtime and tooling: Bun
- Notion Client SDK
- @tryfabric/martian for parsing Markdown into Notion blocks

## Setup

Copy `.env.example` to `.env` and fill in the values:

```shell
# Notion
NOTION_DB_ID = '<notion_db_id>'
NOTION_API_KEY = '<notion_api_key>'

# Hashnode
HASHNODE_PUBLICATION = '<hashnode_publication>'
HASHNODE_API_KEY = '<hashnode_api_key>'
```

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
