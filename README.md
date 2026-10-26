# The Dispatch – SEO-ready news app for GitHub Pages

React + Vite + Tailwind CSS. Articles are Markdown files. No backend.

## 1. Set your site URL (important for SEO)

Edit `src/site.json`:

```json
{
  "title": "The Dispatch",
  "tagline": "Independent news and analysis",
  "description": "Short, sourced reporting on city, business and technology.",
  "url": "https://your-username.github.io/your-repo",
  "language": "en",
  "locale": "en_IN",
  "twitter": "",
  "defaultImage": "/images/og-default.jpg"
}
```

- Project site: `https://user.github.io/repo`
- User site or custom domain: `https://user.github.io` or `https://news.example.com`
- `defaultImage`: a 1200×630 image in `public/images/`, used for link previews when an article has no image.

## 2. Run and build

```bash
npm install
npm run dev      # local development
npm run build    # builds the app, then prerenders SEO pages
npm run preview  # check the production build
```

## 3. Add an article

Create `src/posts/your-slug.md`:

```md
---
title: Your headline (aim for under 60 characters)
date: 2026-10-17
updated: 2026-10-18
category: World
summary: One or two sentences shown on the home page.
description: Optional. Meta description for Google (under 160 characters). Falls back to summary.
image: /images/cover.jpg
imageAlt: Describe the picture in a few words
author: Your Name
tags: [one, two]
---

Your article in Markdown.
```

## 4. Deploy

1. Push to GitHub (branch `main`).
2. **Settings → Pages → Source → GitHub Actions**.
3. Every push builds and publishes.

Custom domain: add a file `public/CNAME` containing just the domain, and set `url` in `site.json` to match.

## What the build generates for SEO

| Output | Why |
|---|---|
| `post/<slug>/index.html` for every article | Real HTML with the full article text, so Google doesn't depend on JavaScript |
| `category/<slug>/index.html` | Crawlable category pages |
| Per-page `<title>`, description, canonical URL | Unique search snippets, no duplicate-URL issues |
| Open Graph + Twitter tags | Good link previews on WhatsApp, X, LinkedIn, Facebook |
| JSON-LD `NewsArticle` + `BreadcrumbList` | Rich results and clearer context for Google |
| `sitemap.xml`, `robots.txt`, `feed.xml` (RSS) | Discovery and indexing |
| `404.html` marked `noindex` | Unknown URLs don't get indexed |

## After your first deploy

1. Open [Google Search Console](https://search.google.com/search-console), add your site, and submit `sitemap.xml`.
2. Check an article with the Rich Results Test and a link preview tool.
3. Note: `robots.txt` is only read at a domain root (user site or custom domain). On a project site (`user.github.io/repo`) it is ignored, so submitting the sitemap in Search Console matters more.

## Writing tips that affect ranking

- One clear `title` per article, with the main keyword near the start.
- A `summary` or `description` that says what the article answers.
- Always set `imageAlt`.
- Update `updated` when you change an article.
- Link to your other articles inside the Markdown text.
