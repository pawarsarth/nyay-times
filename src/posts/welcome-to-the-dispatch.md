---
title: Welcome to The Dispatch
date: 2026-10-17
category: Updates
summary: How this site works, and how to publish your first article by adding one Markdown file.
author: Editorial Desk
tags: [how-to, markdown]
---

Every article on this site is a single Markdown file in `src/posts`. There is no database and no server.

## Publishing in three steps

1. Create a new file in `src/posts`, for example `my-first-story.md`.
2. Add the frontmatter block at the top (title, date, category, summary).
3. Commit and push. GitHub Actions builds the site and publishes it.

## What Markdown can do

You can write **bold**, *italic*, [links](https://example.com), and lists:

- Quotes
- Tables
- Images

> A good headline tells the reader what happened. A good summary tells them why it matters.

| Field | Required | Example |
|-------|----------|---------|
| title | yes | Welcome |
| date | yes | 2026-10-17 |
| image | no | /images/cover.jpg |
