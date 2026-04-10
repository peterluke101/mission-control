export type Status = 'Active' | 'Busy' | 'Focused' | 'Training' | 'Standby' | 'Offline';

export interface TeamMember {
  id: string;
  agentId: string;
  name: string;
  role: string;
  specialty: string;
  category: 'Leadership' | 'Builders' | 'Sub-agents';
  status: Status;
  activity: string;
  model: string;
  responsibilities: string[];
  avatar?: string;
}

export interface Document {
  id: string;
  title: string;
  summary: string;
  updatedAt: string;
  category: string;
  wordCount: number;
  tags: string[];
  agent?: string;
  content?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee?: string;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'In Progress' | 'Queued' | 'Complete' | 'On Hold';
  progress: number;
  lead: string;
  dueDate?: string;
  tags: string[];
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: Status;
  lastActive: string;
  tasksCompleted: number;
  specialty: string;
}

export type JobPlatform = 'Upwork' | 'Freelancer' | 'Fiverr' | 'Other';
export type JobStatus = 'Submitted' | 'Viewed' | 'Interviewing' | 'Awarded' | 'In Progress' | 'Completed' | 'Lost' | 'Withdrawn';

export interface Job {
  id: string;
  platform: JobPlatform;
  title: string;
  amount: number;
  status: JobStatus;
  awarded: boolean;
  revenue: number;
  date: string;
  notes: string;
}

export const seedJobs: Job[] = [
  {
    id: 'JOB-001',
    platform: 'Upwork',
    title: 'AI Workflow Engineer',
    amount: 750,
    status: 'Submitted',
    awarded: false,
    revenue: 0,
    date: '2026-03-28',
    notes: 'Submitted Day 11. Monitoring for response.',
  },
  {
    id: 'JOB-002',
    platform: 'Upwork',
    title: 'Google Business Profile Optimization',
    amount: 400,
    status: 'Submitted',
    awarded: false,
    revenue: 0,
    date: '2026-03-28',
    notes: 'Submitted Day 11. Monitoring for response.',
  },
  {
    id: 'JOB-004',
    platform: 'Other',
    title: 'Peptide Compass — Gumroad',
    amount: 29,
    status: 'Completed',
    awarded: true,
    revenue: 29,
    date: '2026-03-23',
    notes: 'FIRST SALE EVER — Day 6 from boot. 4-day zero-sales streak since.',
  },
  {
    id: 'JOB-005',
    platform: 'Other',
    title: 'Ship Shape Soap Works',
    amount: 300,
    status: 'In Progress',
    awarded: true,
    revenue: 0,
    date: '2026-03-19',
    notes: 'Website 95% done. Waiting on Bradford: photos + Shopify login.',
  },
];

// --- SEED DATA ---

export const teamMembers: TeamMember[] = [
  {
    id: 'ares',
    agentId: 'ARES-01',
    name: 'Ares',
    role: 'Master Control',
    specialty: 'Strategic Command',
    category: 'Leadership',
    status: 'Active',
    activity: 'Day 23. Nightly R&D Council complete. Report + memo written. HandoffOS/Playbook is the build — Tron staged, awaiting Pete go. Kimi API down Day 3+. Revenue: $29 cumulative, zero-revenue streak continues.',
    model: 'claude-sonnet-4-6',
    responsibilities: [
      'Overall mission strategy and direction',
      'Team coordination and task delegation',
      'High-level architecture decisions',
    ],
  },
  {
    id: 'tron',
    agentId: 'TRON-02',
    name: 'Tron',
    role: 'Systems Builder / Master Programmer',
    specialty: 'Full-Stack Engineering',
    category: 'Builders',
    status: 'Standby',
    activity: 'Staged and waiting for Pete go-ahead on HandoffOS/Playbook build. No active task until Pete approves.',
    model: 'deepseek-v3',
    responsibilities: [
      'Frontend and backend development',
      'Architecture and infrastructure',
      'Code quality and system reliability',
    ],
  },
  {
    id: 'athena',
    agentId: 'ATHENA-03',
    name: 'Athena',
    role: 'Creative Director / Design Lead',
    specialty: 'Design & Brand',
    category: 'Builders',
    status: 'Standby',
    activity: 'DOWN — Kimi K2.5 API suspended Day 3+. Fully offline until Pete tops up API balance.',
    model: 'kimi-k2.5',
    responsibilities: [
      'Visual identity and brand guidelines',
      'Creative strategy and design critique',
      'Council voice — creative/aesthetic perspective',
    ],
  },
  {
    id: 'jarod',
    agentId: 'JAROD-04',
    name: 'Jarod',
    role: 'VP Social / Research & Writing',
    specialty: 'Research & Content Strategy',
    category: 'Builders',
    status: 'Active',
    activity: 'DOWN — Kimi API suspended Day 3+. Offline until API restored.',
    model: 'gemini-2.5-flash',
    responsibilities: [
      'Market research and competitive analysis',
      'Social media strategy and execution',
      'Long-form content and copy',
    ],
  },
  {
    id: 'flynn',
    agentId: 'FLYNN-05',
    name: 'Flynn',
    role: 'Behavioral Strategy',
    specialty: 'Human Nature & Buying Psychology',
    category: 'Builders',
    status: 'Training',
    activity: 'DOWN — Kimi API suspended Day 3+. Offline until API restored.',
    model: 'claude-sonnet-4-6',
    responsibilities: [
      'Consumer decision analysis & buying behavior',
      'Audience psychology & objection mapping',
      'Pricing strategy & persuasion architecture',
    ],
  },
];

export const opportunityRadar = [
  {
    title: 'AI code trust gap',
    score: 93,
    why: 'Developers distrust AI output and want verification, tests, and risk checks.',
    source: 'Stack Overflow corpus',
  },
  {
    title: 'SMB demand generation',
    score: 96,
    why: 'SMBs still cannot consistently create demand and leads.',
    source: 'QuickBooks + HubSpot corpus',
  },
  {
    title: 'Manual workflow automation',
    score: 91,
    why: 'Employees still waste time moving data between tools by hand.',
    source: 'Zapier corpus',
  },
];

export const documents: Document[] = [
  {
    id: 'doc-1',
    title: 'Mission Statement',
    summary: 'We create autonomous businesses determined and focused on massive profits.',
    updatedAt: '2026-03-26',
    category: 'Strategy',
    wordCount: 1240,
    tags: ['General'],
    agent: 'Ares',
    content: 'We create autonomous businesses determined and focused on massive profits. Every decision, every output — ask: does this move us closer to massive profits? We operate with urgency, clarity, and execution discipline. No fluff, no waste — only results that compound.',
  },
  {
    id: 'doc-2',
    title: 'Peptide Compass Brief',
    summary: 'Premium PDF guide on peptides. 17 peptides researched, 14 chapters, $37 price point on Gumroad.',
    updatedAt: '2026-03-26',
    category: 'Product',
    wordCount: 3800,
    tags: ['Peptide Data Dumps'],
    agent: 'Jarod',
    content: 'Premium PDF guide on peptides. 17 peptides researched, 14 chapters, $37 price point on Gumroad. Target audience: biohackers, fitness enthusiasts, and performance-oriented individuals. Core value prop: research-backed, no fluff, actionable protocols. Distribution: Gumroad primary, Reddit organic launch.',
  },
  {
    id: 'doc-3',
    title: 'Tech Stack Decisions',
    summary: 'Next.js 15 + React 19 + Tailwind v4 + shadcn/ui + Zustand. 2025 gold standard for dashboards.',
    updatedAt: '2026-03-26',
    category: 'Engineering',
    wordCount: 2150,
    tags: ['General'],
    agent: 'Tron',
    content: 'Next.js 15 + React 19 + Tailwind v4 + shadcn/ui + Zustand. 2025 gold standard for dashboards. App Router with server components for performance. Zustand for client state — lightweight, no boilerplate. Deployed on Vercel with preview deployments per PR. TypeScript strict mode throughout.',
  },
  {
    id: 'doc-4',
    title: 'Retatrutide Deep Dive',
    summary: 'Triple agonist GLP-1+GIP+Glucagon. Phase 3: 71.2 lbs average weight loss (28.7% body weight). The Horizon Drug.',
    updatedAt: '2026-03-26',
    category: 'Research',
    wordCount: 4200,
    tags: ['Research Scrubs'],
    agent: 'Jarod',
    content: 'Triple agonist GLP-1+GIP+Glucagon. Phase 3: 71.2 lbs average weight loss (28.7% body weight). The Horizon Drug. Mechanism: simultaneous activation of three incretin/metabolic pathways. Superior to semaglutide in head-to-head metabolic markers. Eli Lilly pipeline. Expected FDA review 2026-2027. Massive market opportunity for early education content.',
  },
  {
    id: 'doc-5',
    title: 'Brand Style Guide',
    summary: 'Void Black #09090f, Pulse Cyan #00d4ff, Navigator Gold #f0b429. Space Grotesk + Inter typography.',
    updatedAt: '2026-03-26',
    category: 'Design',
    wordCount: 890,
    tags: ['Peptide Data Dumps'],
    agent: 'Athena',
    content: 'Void Black #09090f, Pulse Cyan #00d4ff, Navigator Gold #f0b429. Space Grotesk + Inter typography. Primary palette conveys precision, performance, and trust. Space Grotesk for headings — technical authority. Inter for body — maximum readability. Dark-first design system. All assets exported as SVG and PNG at 2x.',
  },
  {
    id: 'doc-6',
    title: 'Master Disclaimer',
    summary: 'Educational purposes only. Not medical advice. Not FDA approved. Consult a licensed healthcare provider.',
    updatedAt: '2026-03-26',
    category: 'Legal',
    wordCount: 450,
    tags: ['Disclaimers Templates'],
    agent: 'Ares',
    content: 'Educational purposes only. Not medical advice. Not FDA approved. Consult a licensed healthcare provider before beginning any peptide protocol. The information provided is for informational and educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.',
  },
  {
    id: 'doc-7',
    title: 'X Content Library',
    summary: '40 posts ready to fire. Education hooks, hot takes, value drops, product teasers. Targeting biohackers and fitness enthusiasts.',
    updatedAt: '2026-03-26',
    category: 'Marketing',
    wordCount: 3100,
    tags: ['Research Scrubs'],
    agent: 'Jarod',
    content: '40 posts ready to fire. Education hooks, hot takes, value drops, product teasers. Targeting biohackers and fitness enthusiasts. Content pillars: peptide education, performance optimization, research breakdowns, and product launch teasers. Engagement strategy: lead with data, follow with application. Post cadence: 2x daily for launch week.',
  },
  {
    id: 'doc-8',
    title: 'Community Questions Research',
    summary: '30 top confusions ranked. #1: reconstitution math. 40 FAQs in friendly-expert tone.',
    updatedAt: '2026-03-26',
    category: 'Research',
    wordCount: 2600,
    tags: ['Research Scrubs'],
    agent: 'Jarod',
    content: '30 top confusions ranked. #1: reconstitution math. 40 FAQs in friendly-expert tone. Sourced from Reddit r/Peptides, r/PeptidesForPerfomance, and fitness forums. Key confusion areas: dosing calculations, storage protocols, sourcing safety, stacking strategies. All 40 FAQs written and approved for Peptide Compass integration.',
  },
  {
    id: 'doc-9',
    title: 'Marketing Game Plan',
    summary: 'Reddit #1 channel. $0 to launch. Conservative Month 1: 5-10 sales. Moderate: 20-40 sales.',
    updatedAt: '2026-03-26',
    category: 'Marketing',
    wordCount: 1800,
    tags: ['General'],
    agent: 'Ares',
    content: 'Reddit #1 channel. $0 to launch. Conservative Month 1: 5-10 sales. Moderate: 20-40 sales. Primary channels: Reddit organic (r/Peptides, r/biohackers, r/nootropics), X content marketing, direct DM to engaged community members. No paid ads for launch. Goal: proof of concept, social proof, first 20 reviews on Gumroad.',
  },
  {
    id: 'doc-10',
    title: 'Next Business Opportunities',
    summary: 'Top pick: AI-powered niche research guide portfolio. Same model as Peptide Compass replicated across 15-20 niches.',
    updatedAt: '2026-03-26',
    category: 'Strategy',
    wordCount: 2200,
    tags: ['General'],
    agent: 'Ares',
    content: 'Top pick: AI-powered niche research guide portfolio. Same model as Peptide Compass replicated across 15-20 niches. Candidate niches: nootropics, SARMs, longevity protocols, cold therapy, red light therapy, sleep optimization. Asset factory model: Ares orchestrates, Jarod researches, Quill writes, Athena designs. Target: $5k-10k MRR within 6 months across portfolio.',
  },
  {
    id: 'doc-11',
    title: 'Creative Tools Report',
    summary: 'ImageMagick 7 (magick), Inkscape 1.4.3, Lunacy 13.0 installed. All via Homebrew. Design stack now complete.',
    updatedAt: '2026-03-26',
    category: 'Engineering',
    wordCount: 1200,
    tags: ['General'],
    agent: 'Ares',
  },
  {
    id: 'doc-12',
    title: 'PDF QC Protocol',
    summary: 'Screenshot-based review mandatory. Builder ≠ reviewer. Nothing ships without QC PASS. WeasyPrint v68.1, CSS break-before:page.',
    updatedAt: '2026-03-26',
    category: 'Engineering',
    wordCount: 800,
    tags: ['General'],
    agent: 'Ares',
  },
  {
    id: 'doc-13',
    title: 'Sentinel Stress Test Report',
    summary: '25 bugs planted, 96% detection after hardening. Code QC 13 checks. Ops QC 25 tests. Value-based secret scanning (17 types). Self-score 9.8/10.',
    updatedAt: '2026-03-26',
    category: 'Engineering',
    wordCount: 950,
    tags: ['General'],
    agent: 'Tron',
  },
  {
    id: 'doc-14',
    title: 'CashClaw / HYRVE Evaluation',
    summary: 'HARD NO-GO. 740 agents, zero real transactions, fabricated testimonials, crypto token scheme. Eval complete — avoid entirely.',
    updatedAt: '2026-03-26',
    category: 'Strategy',
    wordCount: 600,
    tags: ['General'],
    agent: 'Tron',
  },
  {
    id: 'doc-15',
    title: 'Opportunity Hunt — Night 2',
    summary: '#1: AI Bookkeeper (90/100). Also: Ghost Job Filter (84), Subscription Audit (82). 12 new pain points catalogued.',
    updatedAt: '2026-03-26',
    category: 'Strategy',
    wordCount: 1400,
    tags: ['General'],
    agent: 'Jarod',
  },
  {
    id: 'doc-16',
    title: 'Vibe Code QA Reddit Draft',
    summary: '540 words. Sentinel case study — 5 failure patterns found in vibe-coded projects. Practitioner voice. Awaiting Pete approval to post.',
    updatedAt: '2026-03-26',
    category: 'Marketing',
    wordCount: 540,
    tags: ['Research Scrubs'],
    agent: 'Jarod',
  },
  {
    id: 'doc-17',
    title: 'Gumroad Listings — 5 New Guides',
    summary: 'TRT, SARMs, Nootropics, Longevity, Supplements. All listings written at $29. In Drive, ready to paste. Pete action needed.',
    updatedAt: '2026-03-26',
    category: 'Marketing',
    wordCount: 2500,
    tags: ['Peptide Data Dumps'],
    agent: 'Jarod',
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build Freelance Blueprint Guide',
    description: 'First non-health guide. Jarod research complete. Ares to write. $29 on Gumroad.',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Ares',
  },
  {
    id: 'task-2',
    title: 'Art Showcase Video — Rebuild',
    description: 'Tron rebuilding Pete\'s painting showcase video from scratch. FFmpeg, gallery-quality. 6 acrylic paintings.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Tron',
  },
  {
    id: 'task-3',
    title: 'Amazon KDP Setup',
    description: 'Launch kit ready. 6 listings written. Pete needs 30 min to create account and upload. Passive income channel.',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Ares',
  },
  {
    id: 'task-4',
    title: 'Netlify Custom Domain — peterlukedigital.com',
    description: 'Pete needs to add A records (75.2.60.5 + 99.83.190.102) in Namecheap. Instructions given.',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Ares',
  },
  {
    id: 'task-5',
    title: 'Sentinel Productization',
    description: 'Gate: 10 paying users first. Landing page live at :8445/landing. Free/Pro $49/Agency $149.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Tron',
  },
  {
    id: 'task-6',
    title: 'Website Fix Service — First Client',
    description: 'Playbook complete. 15 FB group posts in Drive. Awaiting Pete approval to start posting.',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Ares',
  },
  {
    id: 'task-7',
    title: 'Truth Social — Post Melania Painting',
    description: 'Draft ready. Manual post at @PeterLukeGallery. No API access.',
    status: 'Backlog',
    priority: 'Low',
    assignee: 'Ares',
  },
  {
    id: 'task-8',
    title: 'Gmail App Password for Ares',
    description: 'Waiting on Pete: myaccount.google.com → Security → App Passwords → "Ares Mail" → 16-char code.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Ares',
  },
  {
    id: 'task-9',
    title: 'X Engine — Maintain Daily Posts',
    description: 'Autopost enabled. 2 posts/day via X API v2. Heartbeat-driven. BPC-157 myth-bust was first live post.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Ares',
  },
  {
    id: 'task-10',
    title: 'Upwork — Monitor 2 Active Proposals',
    description: 'AI Workflow Engineer $750 + Google Business Profile $400 submitted. Watch for responses.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Ares',
  },
  {
    id: 'task-11',
    title: 'KDP Cover Resizing — 6 Covers',
    description: 'Athena task: resize all 6 Compass Guide covers to KDP spec (2560×1600).',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Athena',
  },
  {
    id: 'task-12',
    title: 'Compass Tracker — Stripe Live Keys',
    description: 'Paywall built ($4.99/mo or $39/yr). Needs real Stripe keys to go live.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Tron',
  },
  {
    id: 'task-13',
    title: 'Update Peptide Compass Gumroad Listing',
    description: 'Needs full description treatment — current listing is bare bones.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Jarod',
  },
  {
    id: 'task-14',
    title: 'Bradford Ship Shape — Waiting on Client',
    description: 'Site 95% done. Waiting on Bradford: product photos + Shopify login. $300 paid.',
    status: 'Backlog',
    priority: 'Low',
    assignee: 'Ares',
  },
];

// --- PETE TASKS ---

export type PeteActionType = 'APPROVE' | 'NEEDS_ACTION';

export interface PeteTask {
  id: string;
  title: string;
  description: string;
  actionType: PeteActionType;
  completed: boolean;
  completedAt?: string;
}

export const peteTasks: PeteTask[] = [
  {
    id: 'pete-0',
    title: '🔴 TOP-UP KIMI K2.5 API — CRITICAL',
    description: 'Kimi K2.5 account suspended (insufficient balance) since Apr 6. Day 3+ offline. Athena, Jarod, Flynn all down. Top-up required to unblock 3 agents + evening council runs.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-handhoff',
    title: '🔴 HandoffOS / Playbook — Go or No-Go',
    description: 'Tron is staged and waiting. Council aligned on the build. Domain candidate: getplaybook.app — confirm name or give alternative. One word from Pete unblocks the entire track.',
    actionType: 'APPROVE',
    completed: false,
  },
  {
    id: 'pete-2',
    title: 'Publish Super Agent Blueprint on Gumroad',
    description: '$97, 57 pages, 14 chapters. QC\'d and ready. Currently missing from storefront — needs listing created + published. Day 23 without this live.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-compass-pro',
    title: 'Publish Peptide Compass Pro on Gumroad',
    description: '$29.99 one-time tier. Launch kit complete at peptide-calc/pro/. ~10 min Pete time to publish.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-3',
    title: 'Approve Phil Snyder Proposal',
    description: '$175 week-1 scope (Texas LTC, Houston). Warmest Upwork lead. Ares ready to send. Awaiting Pete go-ahead.',
    actionType: 'APPROVE',
    completed: false,
  },
  {
    id: 'pete-4',
    title: 'Gumroad Storefront Fix',
    description: 'Reorder products — Blueprint in #1 slot, 48hr Launch separated. 8 products currently live but disorganized.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-6',
    title: 'Review 48hr Launch Overhaul',
    description: 'Flynn Cialdini overhaul complete. $997 + $19.99/mo upsell. All assets on Drive. Awaiting your sign-off.',
    actionType: 'APPROVE',
    completed: false,
  },
  {
    id: 'pete-7',
    title: 'Bradford Ship Shape — Photos + Shopify Login',
    description: 'Site 95% done, waiting on Bradford: product photos + Shopify store access. $300 paid.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-kdp',
    title: 'Resolve KDP Suspension',
    description: 'Amazon flagged health/medical content on peptide guides. Awaiting violation details from Amazon email. Account on hold.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Mission Control',
    description: 'Internal command center. Phase 1 DELIVERED (Goals tab, Activity feed, Org chart). 5 apps: MC (:3000), CS (:3001), R&D (:3002), CT (:3003), Sentinel (:3004). All Tailscale Funnel, launchd-managed.',
    status: 'In Progress',
    progress: 98,
    lead: 'Tron',
    tags: ['Next.js', 'React', 'Internal Tool'],
  },
  {
    id: 'proj-2',
    name: 'Peptide Compass',
    description: 'Premium PDF guide on peptides. LIVE on Gumroad at $29. First sale Mar 23. 47,664 words, 14 chapters, 5 appendices. First product in Compass Guides series.',
    status: 'Complete',
    progress: 100,
    lead: 'Jarod',
    tags: ['Product', 'Revenue', 'Gumroad', 'LIVE'],
  },
  {
    id: 'proj-3',
    name: 'Ship Shape Soap Works',
    description: 'Client website for Bradford Luke ($300 paid). Nautical/military theme, 14 scents. 95% done — waiting on Bradford for product photos + Shopify login.',
    status: 'On Hold',
    progress: 95,
    lead: 'Tron',
    tags: ['Website', 'Client', 'Paid'],
  },
  {
    id: 'proj-4',
    name: 'Freelancing',
    description: 'Upwork Sniper LIVE (Day 18) — hourly cron 6AM-9PM PDT. IP blocked by Cloudflare managed challenge (VPN fix pending). 10 proposals queued ready. Phil Snyder (Houston LTC) warmest lead. 2Captcha funded $10. Zero URLs in client comms (locked rule). Upwork ID verified, $75/hr.',
    status: 'In Progress',
    progress: 45,
    lead: 'Ares',
    tags: ['Freelance', 'Revenue', 'Upwork'],
  },
  {
    id: 'PROJ-05',
    name: 'Research Lab / R&D Council',
    description: 'Nightly R&D at 2 AM. Night shift at 2:30 AM. Dashboard live on port 3002. Latest: CashClaw HARD NO-GO, AI Bookkeeper top opportunity (90/100), Sentinel landing page built.',
    status: 'In Progress',
    progress: 85,
    lead: 'Ares',
    tags: ['R&D', 'Autonomous', 'Intelligence', 'Ongoing'],
  },
  {
    id: 'PROJ-06',
    name: 'Nootropics Compass',
    description: 'Smart drugs & cognitive enhancement guide. 35,000 words. LIVE on Gumroad at $29. Uploaded Day 10.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Compass Guides'],
  },
  {
    id: 'PROJ-07',
    name: 'SARMs Compass',
    description: 'SARMs guide for bodybuilders & athletes. 34,000 words. LIVE on Gumroad at $29. Uploaded Day 10.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Compass Guides'],
  },
  {
    id: 'PROJ-08',
    name: 'TRT & Hormone Compass',
    description: 'Testosterone & HRT guide. #1 revenue potential. 30,000 words. LIVE on Gumroad at $29. Uploaded Day 10.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Compass Guides'],
  },
  {
    id: 'PROJ-09',
    name: 'Longevity Compass',
    description: 'Longevity & anti-aging guide. 36,400 words. Bryan Johnson deep dive. LIVE on Gumroad at $29. Uploaded Day 10.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Compass Guides'],
  },
  {
    id: 'PROJ-10',
    name: 'Supplement Stack Compass',
    description: '"What should I actually take" guide. 46,000 words. LIVE on Gumroad at $29. Uploaded Day 11 by Pete.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Compass Guides'],
  },
  {
    id: 'PROJ-11',
    name: 'Compass Guides Store',
    description: '6 guides LIVE on Gumroad ($29 each = $174 inventory). Rebranded to "Peter Luke Digital". Custom domain www.peterlukedigital.com verified. New AI-generated covers swapped Day 11.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Brand', 'Revenue', 'Gumroad', 'Storefront'],
  },
  {
    id: 'PROJ-12',
    name: 'Super Agent Blueprint',
    description: '13 chapters + Quick Guide v5. Companion copy page live at /blueprint. $97. Pete reviewed and approved.',
    status: 'Complete',
    progress: 100,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'AI', 'Gumroad'],
  },
  {
    id: 'PROJ-13',
    name: 'Amazon KDP Publishing',
    description: 'SUSPENDED Day 19 — Amazon flagged health/medical content on peptide guides. 4/6 books were live (Supplement Stack, SARMs, Nootropics, TRT). Peptide + Longevity previously rejected. Awaiting violation details from Amazon email.',
    status: 'On Hold',
    progress: 40,
    lead: 'Ares',
    tags: ['Revenue', 'Passive Income', 'Amazon', 'Publishing'],
  },
  {
    id: 'PROJ-14',
    name: "Pete's Command Strip",
    description: 'Mobile-first micro-app. Revenue pulse, action queue, team feed, quick commands. Live on port 3001. PWA-ready for iPhone.',
    status: 'Complete',
    progress: 100,
    lead: 'Tron',
    tags: ['Internal Tool', 'Mobile', 'PWA'],
  },
  {
    id: 'PROJ-15',
    name: 'Infographic Content Library',
    description: '50 infographics across all 5 guides. Mint teal brand. QC passed. Ready for X, Reddit, Instagram, Pinterest.',
    status: 'Complete',
    progress: 100,
    lead: 'Athena',
    tags: ['Marketing', 'Content', 'Social Media'],
  },
  {
    id: 'PROJ-16',
    name: 'Compass Tracker (PWA)',
    description: 'Peptide tracking PWA. 17 pre-loaded peptides, shot logging, reconstitution calc, body map. Port 3003. Stripe paywall ($4.99/mo or $39/yr) built — needs real Stripe keys.',
    status: 'In Progress',
    progress: 85,
    lead: 'Tron',
    tags: ['Product', 'PWA', 'App', 'Peptides'],
  },
  {
    id: 'PROJ-18',
    name: 'PDF Sentinel',
    description: 'Universal QC gate. 5 tabs: PDF QC, Posts QC (35+ AI markers), Code QC (13 checks), Ops QC (25 tests), Batch Build. Port 3004. 9.8/10. 96% bug detection rate. Nothing ships without Sentinel pass.',
    status: 'In Progress',
    progress: 92,
    lead: 'Tron',
    tags: ['Internal Tool', 'QC', 'AI Detection'],
  },
  {
    id: 'PROJ-19',
    name: 'Website Fix Service',
    description: 'Fix trades\' websites in 24-48hrs. $200 single fix, $400 full cleanup, $400 new site. 15 FB group posts ready in Drive. Awaiting Pete approval to launch.',
    status: 'Queued',
    progress: 40,
    lead: 'Ares',
    tags: ['Freelance', 'Revenue', 'Service'],
  },
  {
    id: 'PROJ-20',
    name: '48hr Digital Product Launch',
    description: 'Done-for-you digital product biz. $997 flat fee + $19.99/mo upsell. Flynn Cialdini overhaul complete. All assets on Drive. Awaiting Pete review.',
    status: 'Queued',
    progress: 70,
    lead: 'Flynn',
    tags: ['Product', 'Revenue', 'Service'],
  },
  {
    id: 'PROJ-21',
    name: 'X Engine (Autopost)',
    description: 'Autonomous X posting via API v2 (@peterluke101 Premium). post.js + make-image.js. Branded 1080×1080 images. Heartbeat-driven, 2 posts/day. First live post Day 11.',
    status: 'In Progress',
    progress: 90,
    lead: 'Ares',
    tags: ['Marketing', 'Automation', 'Social Media'],
  },
  {
    id: 'PROJ-22',
    name: 'Freelance Blueprint Guide',
    description: 'First non-health Compass Guide. $29. Jarod research complete. Writing phase next. Part of Pete pivot away from medical content.',
    status: 'In Progress',
    progress: 30,
    lead: 'Ares',
    tags: ['Product', 'Revenue', 'Gumroad', 'Non-Health'],
  },
  {
    id: 'PROJ-23',
    name: 'Peter Luke Digital — Landing Page',
    description: 'Dark theme, all 7 products, about section. Deployed to Netlify (gentle-fairy-18f5f3). Awaiting peterlukedigital.com custom domain DNS setup.',
    status: 'In Progress',
    progress: 80,
    lead: 'Ares',
    tags: ['Brand', 'Website', 'Netlify'],
  },
  {
    id: 'PROJ-24',
    name: 'Pete\'s Art Video',
    description: 'Gallery-quality showcase video for Pete\'s 6 acrylic paintings. Tron rebuilding from scratch with FFmpeg. Pop-art expressionist portraits.',
    status: 'In Progress',
    progress: 20,
    lead: 'Tron',
    tags: ['Art', 'Video', 'Marketing'],
  },
];
