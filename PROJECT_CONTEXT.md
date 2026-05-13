# PROJECT CONTEXT

## Product Vision

Mission Control is the central dashboard for Pete's client-services and product work — projects, tasks, goals, team status, repo health, and recent activity in one place. It exists so Pete (and his agents) can answer "what's happening this week?" in five seconds.

## Current Features

- Project and task listing with status tracking
- Goals tab with subgoals, progress, owners, blockers
- Team / org chart with live status per agent
- Activity feed (recent agent + system events)
- Calendar and scheduling tools

## Data Pipeline

All dashboard data lives in `public/data/*.json` so the frontend stays a static read with no API call at render time. Each file has its own update path:

| File | Updated by | Cadence |
|------|------------|---------|
| `github.json` | `.github/workflows/sync-github-data.yml` (Action) → `scripts/sync-github-data.mjs` | Hourly cron + on-demand dispatch |
| `goals.json` | Manual edits by Pete or Ares_106 (commits to main) | When priorities shift |
| `team.json` | Manual edits by Pete or Ares_106 (commits to main) | When roster or model assignments change |
| `activity.json` | Manual seed; future Phase 2 = NanoClaw scheduled task extracts entries from `observations.md` | Daily (Phase 2) |

Cloudflare Pages auto-redeploys on every push to `main`, so any data file commit goes live within ~1 minute.

### Retired: the v1 Librarian

The original auto-update mechanism was a Node script (`librarian.mjs`) running every 20 minutes on Pete's Mac via NanoClaw. It died on May 6 due to two issues:

1. `better-sqlite3` native binary ELF-header mismatch when crossing macOS ↔ container boundaries.
2. Missing `ANTHROPIC_API_KEY` — the script was written against the SDK, but Pete runs on a Claude subscription (no API key).

Replaced by the GitHub Action above. Reasons the Action is better than a self-hosted script:

- Runs in GitHub's infra — survives Mac reboots, no service to babysit
- Self-healing — if one run fails, the next one tries again
- Auditable — every refresh leaves a commit
- LLM-free for the GitHub data layer; just structured API → JSON → render
- $0 (well within free Action minutes)

Old librarian scripts are archived under `_archive/v1-librarian/` in the NanoClaw repo handoff folder; safe to delete entirely once Phase 2 ships.

## Unfinished Features

- Repos & Issues page (Next.js, reads `github.json`) — *Phase 3 of MC v2*
- Phase 2 of `activity.json` — wire to NanoClaw `observations.md` extraction
- Logbook tab inner toggle polish

## UI/UX Expectations

- Responsive and mobile-friendly layout
- Clean, data-driven dashboards
- Easy navigation with consistent tabs
- Visual cards for repos (Phase 3)

## Architecture Notes

- Built on Next.js 16.2 with React 19.2
- Tailwind CSS 4 for styling
- Zustand for state management
- Deployed on Cloudflare Pages from `main`
- `public/data/*.json` is the single source of truth for the frontend

## Important Assumptions

- Pete uses NanoClaw (not OpenClaw — migration complete) for all agent work
- Sensitive credentials (PATs etc.) live in repo secrets and OneCLI vault, never in this repo
- Cloudflare Pages auto-builds on push to `main`

## What Claude Should Know

- Preserve the data-pipeline contract: frontend reads `public/data/*.json`, period
- Do not delete working features without an explicit ask
- Use branches and PRs for any change
- Update this file when architecture or data flow changes
- The Action's PAT secret is `MC_SYNC_PAT` (falls back to `GITHUB_TOKEN`)
