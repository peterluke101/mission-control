# MC Upgrade Proposal — v2 Features
*Drafted: Sun 2026-03-29 11:30 PM PDT by Ares*
*For Pete's review and approval*

---

## 🔥 Priority 1: Chat Panel (Pete's Request)

**What:** Built-in chat widget in MC so Pete can talk to Ares directly from the dashboard — no Telegram needed.

**How it works:**
- Slide-out panel on the right side (like Intercom/Drift)
- Connects to OpenClaw's WebSocket gateway (already running on ws://127.0.0.1:18789)
- Messages route through the existing Ares session
- Chat history persists across page loads
- Mobile-responsive (works on Pete's phone too)

**Tech:** WebSocket client → OpenClaw Gateway → Ares agent. No new backend needed — we already have the gateway running.

**Effort:** Tron, ~2 hours. Single new component + API route.

**Why it's cool:** Pete can see dashboard data AND give orders without switching apps. One screen to rule it all.

---

## 🟢 Priority 2: Live Data Feeds (From Someday List)

**What:** Replace hardcoded arrays with real API data.

**Panels:**
1. **Gumroad Revenue** — live pull from Gumroad API (token already in .env.local)
   - Total revenue, today's sales, product breakdown
   - Already have the API route, just needs auto-refresh

2. **Upwork Pipeline** — new card showing:
   - Active proposals (count + status)
   - Response rate
   - Warm leads highlighted
   - Connects remaining

3. **X Stats** — follower count, engagement rate, recent post performance
   - Pull from X API v2 (credentials in .env.x-api)

**Effort:** Tron, ~3 hours total for all three.

---

## 🟡 Priority 3: Revenue Goal Tracker

**What:** Visual progress bar toward monthly revenue target.

- Set target (e.g., $500/mo first milestone)
- Auto-pulls from Gumroad + Upwork earnings
- Shows daily run rate and projection
- Color-coded: red (behind), yellow (on pace), green (ahead)

**Effort:** Tron, ~1 hour.

---

## 🔵 Priority 4: Quick Actions Panel

**What:** One-click buttons for common Pete tasks:
- "Check Upwork Messages"
- "Post to X" (triggers Ares to draft + post)
- "Run Sentinel QC" on a URL
- "Check Gumroad Sales"
- "Deploy to Netlify"

Each button sends a command to Ares via the chat WebSocket. Results appear in the chat panel.

**Effort:** Tron, ~1 hour (depends on chat panel being built first).

---

## 🟣 Priority 5: Agent Activity Feed

**What:** Real-time feed showing what the team is doing.
- "Ares posted to X at 8:03 AM"
- "Tron completed portfolio site QC fixes"
- "Revenue check: $0 today"
- Pulls from daily memory logs

**Effort:** Tron, ~2 hours.

---

---

## 🧪 Priority 6: Client Portal — "Meet Your Team" (Atoms-Inspired)

**Inspiration:** Atoms.dev brands their AI agents (Mike, Sarah, Alex) and shows them working in real-time. Clients see a team, not a tool.

**What:** A public-facing page on MC that makes us look like a full agency.

- **"Meet Your Team" section** — Tron (Engineering), Athena (Design), Jarod (Research), Flynn (Strategy), Ares (Project Lead). Each with a role card, avatar, and one-liner.
- **Live project status** — client sees "Tron is building your checkout page" / "Athena reviewing design mockup" (fed from agent activity logs)
- **Milestone tracker** — visual progress bar with approve/feedback buttons per milestone

**Why this matters:** Solo freelancers lose to agencies on trust. This makes us look like a 5-person team. Because we are one. Clients see progress without asking "where's my update?"

**Effort:** Tron, ~3 hours.

---

## 🔬 Priority 7: Auto-Validation Reports (Atoms "Iris" Concept)

**What:** For every freelance client project, auto-generate a professional market validation brief BEFORE building.

**Includes:**
- Competitor landscape (who else serves this niche?)
- Market size estimate
- UX best practices for their industry
- Recommended features (prioritized)
- Risk flags

**How:** Jarod runs deep research via web search, Flynn adds behavioral/conversion insights, Ares compiles into branded PDF.

**Why:** This is a $500 deliverable we give away free. Clients think "these guys actually understand my business" before we write a line of code. Massive trust builder. Also catches bad ideas early — saves us from building something that won't convert.

**Effort:** Template design ~1hr (Tron), research pipeline ~2hr (Ares/Jarod/Flynn). Reusable for every client.

---

## 🚀 Priority 8: One-Click Deploy Templates (Atoms Speed Play)

**What:** Pre-built starter templates that Tron customizes per client. Instead of building from scratch every time.

**Starter pack:**
1. **Local Business Site** — hero, services, testimonials, contact form, Google Maps
2. **E-Commerce Store** — WooCommerce, product pages, cart, Stripe checkout
3. **Booking Platform** — calendar, appointment slots, payment, confirmation emails
4. **Landing Page** — above-fold CTA, social proof, FAQ, email capture

**How it works:** Client says "I need a plumber website" → Tron forks Local Business template → customizes branding/content → deploys. 4 hours instead of 2 days.

**Effort:** Tron, ~4 hours to build the 4 base templates. Each client customization: 1-3 hours.

---

## 🏁 Priority 9: Race Mode (Phase 2)

**What:** For client projects, two agents build the same page/feature independently. Athena judges which is better. Client gets the winner.

**Why:** Better output quality. Also a premium selling point — "we run parallel builds and pick the best result for you."

**Phase 2 because:** Needs the deploy pipeline and templates working first. Race mode is the quality multiplier on top.

**Effort:** TBD after templates are built.

---

## Build Order (if Pete approves all)

### Phase 1 — Internal Tools (MC for Pete)
1. Chat Panel (~2hr) ← Pete specifically asked for this
2. Live Gumroad data (~1hr) ← already half-built
3. Revenue Goal Tracker (~1hr) ← quick win
4. Upwork Pipeline card (~1hr)
5. X Stats card (~1hr)
6. Quick Actions (~1hr)
7. Agent Activity Feed (~2hr)

### Phase 2 — Client-Facing (The Agency Play, Atoms-Inspired)
8. Meet Your Team page (~3hr) ← instant credibility for proposals
9. Auto-Validation Reports (~3hr) ← free deliverable that wins trust
10. One-Click Deploy Templates (~4hr) ← speed = money
11. Client Portal with milestones (~2hr)

### Phase 3 — Advanced
12. Race Mode (TBD)

**Total: ~22 hours of Tron time**

Phase 1: 2-3 overnight sessions
Phase 2: 2-3 more sessions after Phase 1 ships
Phase 3: After first 5 freelance clients

---

## ⚠️ Standing Order Check

"No new builds until 10 paying users" applies to **Sentinel**. MC is our internal tool + client-facing agency infrastructure — directly tied to landing freelance revenue. Pete explicitly asked for these features. Proceeding after approval.
