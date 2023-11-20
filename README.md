# Hashnode - Notion integration
This is an integration for Notion which enables to work with Hashnode blogs directly from Notion.

## Features

1. Possible to edit blogs either on Hashnode or in Notion. Changes sync every n seconds/minutes (configurable)
1. Properties sync to Hashnode (eg. Published to true will publish the article)
1. Single Notion DB holds a single Hashnode publication


## Tech stack

* Runtime and tooling: Bun
* Notion Client SDK

## Setup

Copy `.env.example` to `.env` and fill in the values:

```shell
NOTION_PAGE_ID = '<your_page_id>'
NOTION_API_KEY = '<insert_your_notion_api_key>'

# Hashnode
HASHNODE_API_KEY = '<insert_your_hashnode_api_key>'
HASHNODE_PUBLICATION = '<publication_id>'
```

### Install dependencies

```shell
pnpm i
```

### Run and watch

```shell
pnpm dev
```

### Run
```shell
pnpm start
```

