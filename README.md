# Art Flaneur — Content Marketing Dashboard

A local-first editorial operations platform for **Art Flaneur**, a contemporary art media brand. Built to run the full content lifecycle — from audience research and topic strategy to AI-assisted brief writing, production pipeline, and publishing calendar — in a single browser-based dashboard.

---

## Features

| Section | What it does |
|---|---|
| **Overview** | Snapshot of pipeline health, cluster coverage, and upcoming calendar items |
| **Personas** | Define and manage buyer personas (role, pains, goals, preferred channels) |
| **Buyer's Journey** | Visual funnel — Awareness, Consideration, Decision — mapped to personas |
| **Topic Clusters** | Keyword clusters per persona × stage with priority score, intent, and subtopics |
| **Content Pipeline** | Kanban-style pipeline (Idea → Brief → Draft → Review → Published) with a full Brief Editor modal |
| **Publishing Calendar** | Schedule published pieces by date and channel; sorted chronologically |
| **Channels** | Track follower counts over time across Instagram, YouTube, LinkedIn, TikTok, Newsletter, and more; YouTube subscriber count can be auto-fetched via Google API |
| **AI Studio** | Prompt builder backed by AWS Bedrock — generates strategy plans, persona deep-dives, cluster gap analyses, content briefs, and full drafts |
| **Playbook** | Running editorial strategy roadmap |

---

## Tech Stack

- **Frontend** — Vanilla HTML / CSS / JavaScript, no framework, no build step
- **Backend** — Node.js HTTP server (`server.js`), zero dependencies
- **AI** — AWS Bedrock (Anthropic Claude by default) proxied through the local server
- **State** — `localStorage` (browser-persisted, private)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- (Optional) A [Google Cloud API key](https://console.cloud.google.com/) with **YouTube Data API v3** enabled — for auto-fetching subscriber counts
- (Optional) AWS credentials with Amazon Bedrock model access — for the AI Studio features

---

## Setup

```bash
git clone https://github.com/ArtFlaneur/artflaneur-content-dashboard.git
cd artflaneur-content-dashboard
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables (optional)

Set these before `npm start` (or put them in a `.env` file) to enable AWS Bedrock and YouTube auto-fetch:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export AWS_REGION=us-east-1
# Optional — defaults shown
export BEDROCK_MODEL_ID=us.anthropic.claude-sonnet-4-5-20250929-v1:0
export BEDROCK_MAX_TOKENS=8000
# Optional — only when using temporary STS credentials
export AWS_SESSION_TOKEN=your_session_token
```

> The AWS identity must have `bedrock:InvokeModel` permission and model access enabled for the chosen model ID in the target region (Bedrock → Model access).

YouTube API keys are entered per-channel directly in the Channels section of the UI — no environment variable needed.

---

## Project Structure

```
.
├── index.html      # Full dashboard markup and information architecture
├── app.js          # Application state, rendering, CRUD, AI prompting (~2100 lines)
├── styles.css      # Complete visual system (~1600 lines)
├── server.js       # Static file server + AWS Bedrock proxy + YouTube stats proxy
└── package.json
```

---

## AI Studio tasks

| Task | Description |
|---|---|
| `strategy-plan` | Full inbound content strategy for the active persona |
| `persona-depth` | Deep-dive audience research report |
| `cluster-gaps` | Identifies missing topic clusters given current coverage |
| `content-brief` | Structured HubSpot-style brief for a specific cluster |
| `full-draft` | Complete article draft based on the active brief |

---

## Channel Tracking

The Channels section stores weekly follower-count snapshots per platform. Each channel card shows:

- Current follower count + delta from the previous snapshot
- Sparkline bar chart (last 8 entries)
- Inline "Log today's count" form for manual entry
- **YouTube only** — "Auto-fetch" button that calls the YouTube Data API v3 via the local server proxy (requires channel ID and API key entered in the add-channel form)

---

## License

Private project — All rights reserved © Art Flaneur
