# Xavier Crosas Official Website

Official multilingual artist website for Xavier Crosas.

Built with Astro 6 and Tailwind CSS v4, deployed to Cloudflare Workers.

## Overview

- Locales by route: /, /es/, /ca/, /nl/
- Content-first architecture using Astro Content Collections
- Static prerender for public pages
- Edge API route for latest YouTube videos: /api/youtube-latest

## Tech Stack

- Astro 6
- Tailwind CSS v4
- Cloudflare Workers (Wrangler)
- fast-xml-parser (YouTube RSS parsing)

## Project Structure

src/
	assets/
	components/
	content/
		bio/
		releases/
	data/
	i18n/
	layouts/
	pages/
	styles/

## Commands

- npm install: install dependencies
- npm run dev: local dev server on localhost:4321
- npm run build: production build to dist/
- npm run preview: build + wrangler dev
- npm run deploy: build + wrangler deploy
- npm run generate-types: regenerate Wrangler types

## Environment

Create a local .env file with:

YOUTUBE_CHANNEL_ID=your_channel_id

For production, set it as a Worker secret:

npx wrangler secret put YOUTUBE_CHANNEL_ID

## Temporary Album Promo Banner

The homepage promo banner for The Hero's Crisis is controlled from:

- src/data/site.ts

Toggle this value when you want to disable the campaign:

- promoBanner.enabled: true or false

You can also update:

- promoBanner.albumTitle
- promoBanner.spotifyUrl

## Source of Truth Docs

- .specify/memory/constitution.md
- specs/001-astro-rework/spec.md
- specs/001-astro-rework/quickstart.md
- AGENTS.md
