# MC Paperclip-Inspired Upgrades — Build Spec for Tron
*Drafted: Mon 2026-03-30 7:35 AM PDT by Ares*
*For Pete's approval → Tron builds during off-peak hours (11 PM - 5 AM)*
*Stack: Next.js 15 + React 19 + Tailwind v4 + shadcn + Zustand*

---

## What This Is

After studying Paperclip (open-source agent company orchestration), Pete identified features worth bringing into our MC. These aren't copies — they're adapted to how WE work. Our MC is already the nerve center. These upgrades make it smarter.

---

## 🔥 Feature 1: Goals Tab (Pete's Pick)

**Inspired by:** Paperclip's goal alignment chain (Mission → Project Goal → Agent Goal → Task)

**What:** New "Goals" tab in MC showing a cascading goal hierarchy. Every piece of work traces back to the mission. Visual, clickable, always up to date.

### Data Model (JSON file, no database needed)
```json
{
  "mission": "Create autonomous businesses focused on massive profits",
  "goals": [
    {
      "id": "g1",
      "title": "Land First Freelance Client",
      "status": "active",       // active | completed | blocked | paused
      "priority": "critical",   // critical | high | medium | low
      "progress": 40,           // 0-100
      "owner": "Ares",
      "deadline": "2026-04-15",
      "subgoals": [
        {
          "id": "g1.1",
          "title": "Submit 20+ targeted Upwork proposals",
          "status": "active",
          "progress": 40,
          "owner": "Ares",
          "tasks": [
            { "title": "Monday AM batch (3-5 proposals)", "status": "in_progress", "owner": "Ares" },
            { "title": "Phil Snyder follow-up", "status": "waiting", "owner": "Pete" },
            { "title": "Profile portfolio items", "status": "todo", "owner": "Ares" }
          ]
        },
        {
          "id": "g1.2",
          "title": "Build impressive portfolio site",
          "status": "blocked",
          "progress": 80,
          "owner": "Tron",
          "blockedBy": "Netlify credits reset Apr 1"
        }
      ]
    },
    {
      "id": "g2",
      "title": "Government Contracts Pipeline",
      "status": "paused",
      "priority": "medium",
      "progress": 5,
      "owner": "Ares",
      "deadline": null,
      "subgoals": [
        {
          "id": "g2.1",
          "title": "SAM.gov Registration",
          "status": "todo",
          "progress": 0,
          "owner": "Pete"
        },
        {
          "id": "g2.2",
          "title": "Monitor 3 Active RFIs",
          "status": "active",
          "progress": 10,
          "owner": "Ares",
          "tasks": [
            { "title": "Air Force AI-Powered Software Dev (NAICS 541511)", "status": "watching", "owner": "Ares" },
            { "title": "Army AI-Enabled Coding (CDAO_26-01)", "status": "watching", "owner": "Ares" },
            { "title": "USPTO Automated AI Solutions", "status": "watching", "owner": "Ares" }
          ]
        },
        {
          "id": "g2.3",
          "title": "Build past performance (need freelance jobs first)",
          "status": "blocked",
          "progress": 0,
          "blockedBy": "Need completed client work for past performance record"
        },
        {
          "id": "g2.4",
          "title": "Explore SBIR/STTR grants for AI capabilities",
          "status": "todo",
          "progress": 0,
          "owner": "Ares"
        }
      ]
    },
    {
      "id": "g3",
      "title": "Passive Revenue Streams",
      "status": "active",
      "priority": "high",
      "progress": 65,
      "owner": "Ares",
      "subgoals": [
        {
          "id": "g2.1",
          "title": "6 Guides on Gumroad",
          "status": "completed",
          "progress": 100
        },
        {
          "id": "g2.2",
          "title": "KDP Launch (6 books)",
          "status": "blocked",
          "progress": 95,
          "blockedBy": "Pete upload (~15 min)"
        }
      ]
    }
  ]
}
```

### UI Design
- **Tree view** with expand/collapse — mission at top, goals, subgoals, tasks cascade down
- Each node shows: title, owner avatar/icon, status badge, progress bar
- Color coding: 🟢 active, ✅ completed, 🔴 blocked, ⏸️ paused
- Click a goal → expand to see subgoals and tasks inline
- Blocked items show the blocker reason in red text
- **Pete action items** highlighted with a special badge (things only Pete can unblock)
- Progress bars auto-calculate from child completion %
- Mobile responsive — stacks vertically on phone

### Data Source
- `/public/data/goals.json` — Ares updates via API route
- API route: `PUT /api/goals` — accepts full JSON, writes to file
- Later: Ares auto-updates goals from daily activity

**Effort:** ~2 hours

---

## 🔥 Feature 2: Agent Org Chart Card

**Inspired by:** Paperclip's visual org chart with roles, reporting lines, and status

**What:** Interactive org chart showing our team hierarchy, who's active, what they're working on, and their current status.

### UI Design
- **Pete** at top (Board / Owner) — crown icon
- **Ares** below (CEO / Master Control) — ⚡ icon
- **Tron, Athena, Jarod, Flynn** below Ares — role icons
- **Mothballed agents** (Eve Kim, Daft Punk, Leto) shown grayed out at bottom

Each agent card shows:
- Name + role title
- Status indicator (🟢 active / 🟡 idle / ⚪ mothballed)
- Current task (one-liner, e.g., "Upwork proposal batch")
- Last active timestamp
- Model being used (e.g., "claude-opus-4-6")

### Connection Lines
- SVG lines connecting Pete → Ares → team members
- Animated pulse on active connections (subtle, not distracting)

### Data Source
- `/public/data/team.json` — updated by Ares
- Shows real-time-ish status (updated each heartbeat)

**Effort:** ~2 hours

---

## 🟢 Feature 3: Cost Tracker / Budget Dashboard

**Inspired by:** Paperclip's per-agent budget enforcement with spend tracking

**What:** New card or section showing token costs per agent, daily/monthly burn rate, and budget limits.

### UI Design
- **Total monthly spend** — large number + progress bar toward $200 Max limit
- **Per-agent breakdown** — bar chart or table:
  - Ares: $X / $200 budget
  - Tron (sub-agents): $X estimated
  - Cron jobs: $X
- **Daily burn rate** — sparkline showing cost per day this month
- **Projection** — "At this rate, you'll use $X of $200 by month end"
- Color: green (under 50%), yellow (50-80%), red (80%+)

### Data Source
- Pull from OpenClaw session_status / usage API
- `/api/usage` route that queries openclaw gateway
- Fallback: manual JSON if API not available

**Effort:** ~2 hours

---

## 🟡 Feature 4: Task Board (Kanban-style)

**Inspired by:** Paperclip's ticket system with states (Triage → Backlog → In Progress → Done)

**What:** Upgrade our existing kanban board to be a real task tracker for the operation.

### Columns
1. **Blocked** (red) — waiting on something external
2. **Backlog** (gray) — accepted, not started
3. **In Progress** (blue) — actively being worked
4. **Review** (yellow) — done, needs Pete's eyes
5. **Done** (green) — shipped

### Each Card Shows
- Task title
- Owner (agent avatar)
- Priority badge (🔴 critical, 🟠 high, 🔵 medium, ⚪ low)
- Goal linkage (which goal this serves — clickable)
- Due date (if set)
- Blocker tag (if blocked)

### Data Source
- `/public/data/tasks.json` — Ares manages
- API: `PUT /api/tasks` for updates

**Effort:** ~1.5 hours (upgrade existing kanban component)

---

## 🟡 Feature 5: Activity Feed / Audit Log

**Inspired by:** Paperclip's "every conversation traced, every decision explained" immutable log

**What:** Real-time scrolling feed showing what's happening across the operation.

### Example Entries
```
[7:35 AM] Ares — Started Upwork Monday hunt (3-5 proposals target)
[7:31 AM] Pete — Requested Paperclip comparison research
[6:49 AM] Ares — Connected Chrome MCP browser for Upwork access  
[5:35 AM] Ares — Morning brief sent to Pete
[5:35 AM] System — Services healthy: MC(307) CS(200) RD(200)
```

### UI Design
- Scrollable card, newest on top
- Agent avatar + name + action + timestamp
- Color-coded by type: 🔵 system, 🟢 agent action, 🟠 Pete action, 🔴 error
- Filter tabs: All | Ares | Pete | System | Errors

### Data Source
- `/public/data/activity.json` — appended by Ares each session
- Max 200 entries, auto-prune old ones

**Effort:** ~1 hour

---

## Build Order (for Tron tonight)

| Priority | Feature | Effort | Why First |
|----------|---------|--------|-----------|
| 1 | Goals Tab | 2 hrs | Pete's pick, highest impact |
| 2 | Activity Feed | 1 hr | Quick win, immediately useful |
| 3 | Org Chart Card | 2 hrs | Visual wow factor |
| 4 | Task Board upgrade | 1.5 hrs | Builds on existing component |
| 5 | Cost Tracker | 2 hrs | Nice to have, needs API work |

**Total: ~8.5 hours** — Tron can knock out #1-3 tonight (5 hours), #4-5 tomorrow night.

---

## Rules for Tron
1. Match existing MC theme: dark background, mint teal (#3DE8C3) accent, Inter font
2. All data from JSON files (no database, no external deps)
3. API routes for Ares to update data programmatically
4. Mobile responsive — Pete uses his phone
5. No new npm packages unless absolutely necessary
6. Sentinel QC before marking anything done
7. Build + test on port 3000 before deploying

---

*Awaiting Pete approval. Say "go" and Tron builds tonight.*
