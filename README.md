## MALRO — Making cultural event data universally accessible

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [TL;DR](#tldr)
- [Questions](#questions)
- [Contributions](#contributions)
- [MALRO format](#malro-format)
  - [Guiding principles](#guiding-principles)
  - [Specification: What's a MALRO event?](#specification-whats-a-malro-event)
- [MALRO open data](#malro-open-data)
  - [MALRO database model](#malro-database-model)
  - [Download MALRO database](#download-malro-database)
    - [Event data](#event-data)
    - [Event images](#event-images)
  - [MALRO public SQLite API](#malro-public-sqlite-api)
  - [MALRO enums translations](#malro-enums-translations)
  - [Daily MALRO database purge](#daily-malro-database-purge)
- [MALRO widget](#malro-widget)
- [MALRO tech](#malro-tech)
  - [Tech stack](#tech-stack)
  - [Hosting](#hosting)
  - [How to run MALRO locally?](#how-to-run-malro-locally)
- [Roadmap + rough ideas](#roadmap--rough-ideas)
  - [Features](#features)
  - [Spec](#spec)
  - [Code](#code)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## TL;DR

Cultural operators are experts at organizing events and exhibitions, but they might have less experience building apps. MALRO (pronounced `/mal-ROH/`) lets them publish **freely**, **quickly**, **once**, **worldwide** and in an **open** way their events (while staying forever in **full control**), and developers freely consume these data to **build innovative services**.

At its core, MALRO is 5 simple things:

- A **simple**, **open** and **interoperable data format** that describes in a multilingual way cultural events and associated metadata like schedules, description, location, etc.

- An **open and downloadable database** where live worldwide, standardized and up-to-date cultural events data (aka MALRO event).

- A **public and no-auth `SQLite API`** allowing anyone to consume MALRO data and build innovative services.

- An **open source app** allowing cultural operators to generate, validate and freely host MALRO events.

- A **widget** allowing anyone to embed anywhere any MALRO event (or custom feed) as simply as you embed a YouTube video or a Tweet.

→ A longer story is available on [MALRO.org](https://malro.org).

## Questions

For questions, please use the [discussion list](https://github.com/charnould/malro/discussions). The issue list of this repo is exclusively code and translation-related.

## Contributions

Healthy criticism, discussion and suggestions for improvements are more than welcome.

Feel free to contribute. You can help:

- improve code, tools and copywriting
- translate MALRO (only french and english are currently available)
- The BIG One — evangelize MALRO to cultural operators and public authorities.

## MALRO format

### Guiding principles

In order to preserve the vision of MALRO, some guiding principles have been established to take into consideration when modifying or extending the format:

- **Speculative features are discouraged**  
  Every new feature adds complexity to the creation and reading of feeds. Therefore, MALRO want to take care to only add features that we know to be useful.

- **MALRO event should be easy to create and edit**  
  We chose `json` as the basis for the format because it's easy to manipulate for developers. It's also pretty straightforward to generate, which is good for publishers of larger feeds.

- **MALRO event should be easy to parse**  
  Event readers should be able to extract the information they're looking for with as little work as possible. Changes and additions to MALRO event should be as broadly useful as possible, to minimize the number of code paths that readers of MALRO event need to implement.

- **The format is about citizen information**  
  MALRO is primarily concerned with citizen information. That is, the format should include information that can help power tools for citizen, first and foremost. There is potentially a large amount of operations-oriented information that cultural operators might want to transmit internally between systems. MALRO is not intended for that purpose.

### Specification: What's a MALRO event?

A MALRO event is a single `json` object that describes a **unique cultural event** that occurs **one or multiple times** in the very **same location**. It contains everything that describes a cultural event including location, description and calendar.

> Examples: permanent collections of a Museum are described in 1 MALRO event. The same for a 3-time concert in the same hall. However, the same event occuring in 6 different places needs 6 MALRO events.

→ [**Discover MALRO format**](./SPEC.jsonc) through a `.jsonc` example.

## MALRO open data

### MALRO database model

MALRO database/archive contains several tables:

- `events`: MALRO events with a data model aligned with [MALRO format](#specification-whats-a-malro-event)
- `calendar`: convenient denormalization of `events.calendar`
- `linked_to`: convenient denormalization of `events.linked_to`

**Note:** MALRO uses another database (called `users.db`) handling `users` and event `drafts`. This database is not public.

### Download MALRO database

#### Event data

MALRO SQLite Database is open, free to use and downloadable at this URL: https://malro.org/datastore/archives/yyyy-mm-dd.db.gz where `yyyy-mm-dd` stands for a date (e.g. `2023-07-01`). At this time, backup is featherweight (😅) and done at 23:45 (GMT).

#### Event images

- **thumbnails** are available at https://malro.org/datastore/images/uuid.webp where `uuid` stands for event `id`. Image size is `636` (widht) x `340` (height) pixels and format `webp`.
- **originals** are available at https://malro.org/datastore/images/originals/uuid.webp where `uuid` stands for event `id`. Image format is `webp`.

### MALRO public SQLite API

MALRO provides a public, no-auth and free to use `API` to query database. This `API` is `GET`-only and doesn't perform any action other than delivering readonly `json` or `html` event.

`API` is accessible at https://malro.org/sql/query?format=json where:

- `query` is a valid `encodeURI()` `SELECT` SQLite statement.
- `format` query string parameter is set to `json` (if omitted, it will return a [MALRO widget](#malro-widget)).

**Please:** Do not bring down MALRO, add a `LIMIT` or paginate your query.

> Examples:  
> A [simple query](<https://malro.org/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20inner%20join%20linked_to%20using%20(id)%20where%20status='published'%20and%20linked_to.domain='jubilons.org'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20next%20limit%201?format=json>) returning a particular `json` event.  
> The [same query](<https://malro.org/sql/select%20*,%20min(start)%20as%20next%20from%20calendar%20inner%20join%20events%20using%20(id)%20inner%20join%20linked_to%20using%20(id)%20where%20status='published'%20and%20linked_to.domain='jubilons.org'%20and%20calendar.start%3Estrftime('%25Y-%25m-%25d',%20'now')%20group%20by%20id%20order%20by%20next%20limit%201>) returning an `html` response.

### MALRO enums translations

MALRO event contains a few public-facing enums (e.g. `type`, `feature`). Translations of theses enums are available and free to use at [`locales/enums`](locales/enums). Feel free to help translating.

### Daily MALRO database purge

In order to keep MALRO database clean, MALRO will purge every day at 01:00 (GMT) the `events` table of all events marked as `trashed` or `spam` 10 days ago or before. Note that `calendar` and `linked_to` tables are purged in realtime at `status` change.

That means that developers mirroring MALRO database must do it frequently to keep their data in sync.

## MALRO widget

MALRO widget allows anyone to embed anywhere for free an event (or a custom feed) in the same way you embed a YouTube video or a Tweet.

This widget is accessible at https://malro.org/sql/query?format=001 where:

- `query` is a valid `encodeURI()` `SELECT` SQLite statement
- (optional) `format` query string parameter is set to `001` (default to `001`).  
  This corresponds to widget original version.
- (optional) `embed` query string parameter is set to `true` or `false` (default to `false`).  
  It displays or not sharing link and code to embed widget.
- (optional) `referral` query string parameter is an `encodeURI()` `<a href="..." style="...">link</a>`.  
  It displays this link (`embed` must be `false` or omitted).

## MALRO tech

### Tech stack

- Language: [`Typescript`](https://typescriptlang.org)
- Framework: [`Bun`](https://bun.sh)/[`Hono`](https://bun.sh) +[`Hotwired`](https://hotwired.dev)
- Datastore: [`SQLite`](https://sqlite.org/index.html)
- Deployment: [`Docker`](https://docker.com) via [`Kamal`](https://kamal-deploy.org)

### Hosting

- Hosted in Falkenstein (Germany) on an ARM `Hetzner` VPS
- Static files (images, archives...) cached by `Cloudflare`
- Rolling backups via `Hetzner`

### How to run MALRO locally?

1. Download [`Bun`](https://bun.sh) + Be sure that `sqlite3` and `ImageMagick` are available
2. `bun dev:init` to initiate local env (create DB and folder structure) and install deps
3. `bun dev:start` to run/build every time a file change
4. Access a local version of MALRO at [http://localhost:3000](http://localhost:3000)
5. Open your server `console` to login!

## Roadmap + rough ideas

Below some items MALRO has in mind, whether it's something that must be done or a rough idea. The fact that a feature isn't listed here doesn't mean that a patch for it will be refused! The fact that a rough idea is listed doesn't mean it will become a feature.

We're always happy to receive patches for new cool features we haven't thought about.

### Features

- [ ] Allow BIG cultural operators to use MALRO through their IS
- [ ] Simplify how to set up multi-occurring event (exclude calendar list?)
- [ ] YouTube works; add Vimeo+Dailymotion to illustrate event?
- [ ] Anyone can _follow_ cultural operators he/she is interested in (without login)?
- [ ] Stylesheet to pretty print an event or a feed?
- [ ] RSS feed?
- [ ] Auto-translate `description`?
- [ ] Rich widget to simplify embedment?
- [ ] Handle spam/abuse through GitHub Discussions and a Spam Corps?
- [ ] Add abuse/spam report to widget?
- [ ] Export your event data (json)?
- [ ] Have a clean and shiny UI?
- [ ] Widget dark theme?
- [ ] Auto-create `sitemap.xml` (for search engines index)?

### Spec

- [ ] Add special discount (e.g. Pass Culture in France)?
- [ ] Add simultaneous live broadcast?

### Code

- [ ] Auto deploy through GitHub Actions
- [ ] Write tests, refactor/clean code, fix Typescript errors
- [ ] Paginate widget results?
- [ ] Detect spam/wrong event with AI?
- [ ] Generate beautiful illustration with AI?

## Licence

Except as otherwise noted, content of MALRO GitHub repos and websites are licensed under the `CC BY 4.0` and code under the `MIT`. By contributing to this project, you agree to license your contributions under the same license.

Copyright (c) 2023-present, Charles-Henri Arnould • info@malro.org
