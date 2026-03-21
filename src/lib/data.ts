export type Status = 'Active' | 'Busy' | 'Focused' | 'Standby' | 'Offline';

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
    title: 'WooCommerce Website Development for Premium Wellness Peptide Brand',
    amount: 500,
    status: 'Submitted',
    awarded: false,
    revenue: 0,
    date: '2026-03-20',
    notes: 'Peptide brand luxury WooCommerce build. 9 Connects used. Less than 5 proposals when submitted.',
  },
  {
    id: 'JOB-002',
    platform: 'Upwork',
    title: 'AI Website Builder - Simple Template Work',
    amount: 150,
    status: 'Submitted',
    awarded: false,
    revenue: 0,
    date: '2026-03-20',
    notes: 'Template-based local business sites. $150/site volume play. Blocked by ID verification.',
  },
];

// --- SEED DATA ---

export const teamMembers: TeamMember[] = [
  {
    id: 'ares',
    agentId: 'ARES-01',
    name: 'Ares',
    role: 'Mission Lead / Master Control',
    specialty: 'Strategic Command',
    category: 'Leadership',
    status: 'Active',
    activity: 'Directing Mission Control v2 build',
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
    status: 'Active',
    activity: 'Building Mission Control v2 core systems',
    model: 'gpt-5.4-mini',
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
    status: 'Active',
    activity: 'Redesigning Mission Control visual layer',
    model: 'claude-sonnet-4-6',
    responsibilities: [
      'Visual identity and brand guidelines',
      'UI/UX design for all products',
      'Creative direction for marketing',
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
    activity: 'Queued: Peptide Compass research',
    model: 'grok-4-fast-reasoning',
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
    role: 'Chief of Staff',
    specialty: 'Operations & Coordination',
    category: 'Leadership',
    status: 'Active',
    activity: 'Coordinating team priorities and sprint planning',
    model: 'claude-sonnet-4-6',
    responsibilities: [
      'Daily standup and priority management',
      'Resource allocation across projects',
      'Stakeholder communication',
    ],
  },
  {
    id: 'evekim',
    agentId: 'EVE-07',
    name: 'Eve Kim',
    role: 'Infrastructure Engineer',
    specialty: 'DevOps & Systems',
    category: 'Builders',
    status: 'Active',
    activity: 'Monitoring system health and uptime',
    model: 'claude-sonnet-4-6',
    responsibilities: [
      'Server provisioning and maintenance',
      'CI/CD pipeline management',
      'Security and uptime monitoring',
    ],
  },
  {
    id: 'scout',
    agentId: 'SCOUT-S1',
    name: 'Scout',
    role: 'Recon Sub-agent',
    specialty: 'Recon & Research',
    category: 'Sub-agents',
    status: 'Standby',
    activity: 'Idle — awaiting assignment',
    model: 'gpt-4o-mini',
    responsibilities: [
      'Web research and data gathering',
      'Competitive intelligence',
      'Summarization and briefing',
    ],
  },
  {
    id: 'quill',
    agentId: 'QUILL-S2',
    name: 'Quill',
    role: 'Content Sub-agent',
    specialty: 'Content & Copy',
    category: 'Sub-agents',
    status: 'Standby',
    activity: 'Idle — awaiting assignment',
    model: 'claude-haiku-3-5',
    responsibilities: [
      'Long-form writing and editing',
      'Marketing copy and scripts',
      'Email sequences and outreach',
    ],
  },
  {
    id: 'pixel',
    agentId: 'PIXEL-S3',
    name: 'Pixel',
    role: 'Visual Sub-agent',
    specialty: 'Visual Generation',
    category: 'Sub-agents',
    status: 'Standby',
    activity: 'Idle — awaiting assignment',
    model: 'gpt-image-1',
    responsibilities: [
      'AI image generation and editing',
      'Visual asset creation',
      'Brand-consistent imagery',
    ],
  },
  {
    id: 'echo',
    agentId: 'ECHO-S4',
    name: 'Echo',
    role: 'Comms Sub-agent',
    specialty: 'Comms & Outreach',
    category: 'Sub-agents',
    status: 'Standby',
    activity: 'Idle — awaiting assignment',
    model: 'claude-haiku-3-5',
    responsibilities: [
      'Email and DM outreach campaigns',
      'Community management',
      'Partner and influencer coordination',
    ],
  },
];

export const documents: Document[] = [
  {
    id: 'doc-1',
    title: 'Mission Statement',
    summary: 'We create autonomous businesses determined and focused on massive profits.',
    updatedAt: '2026-03-15',
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
    updatedAt: '2026-03-10',
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
    updatedAt: '2026-03-18',
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
    updatedAt: '2026-03-17',
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
    updatedAt: '2026-03-16',
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
    updatedAt: '2026-03-12',
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
    updatedAt: '2026-03-19',
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
    updatedAt: '2026-03-14',
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
    updatedAt: '2026-03-13',
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
    updatedAt: '2026-03-11',
    category: 'Strategy',
    wordCount: 2200,
    tags: ['General'],
    agent: 'Ares',
    content: 'Top pick: AI-powered niche research guide portfolio. Same model as Peptide Compass replicated across 15-20 niches. Candidate niches: nootropics, SARMs, longevity protocols, cold therapy, red light therapy, sleep optimization. Asset factory model: Ares orchestrates, Jarod researches, Quill writes, Athena designs. Target: $5k-10k MRR within 6 months across portfolio.',
  },
];

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build Mission Control UI',
    description: 'Full Next.js 15 app with sidebar, team roster, kanban, and all dashboard pages.',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Tron',
    dueDate: '2026-03-20',
  },
  {
    id: 'task-2',
    title: 'Write Mission Statement v2',
    description: 'Update and expand the mission statement to reflect current goals and team structure.',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Jarod',
  },
  {
    id: 'task-4',
    title: 'Peptide Compass Research',
    description: 'Market research, competitor analysis, and audience definition for Peptide Compass product.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Jarod',
  },
  {
    id: 'task-5',
    title: 'Design System — Color Tokens',
    description: 'Establish Figma color tokens and spacing scale for consistent design across products.',
    status: 'Review',
    priority: 'Medium',
    assignee: 'Athena',
    dueDate: '2026-03-19',
  },
  {
    id: 'task-6',
    title: 'Deploy Staging Environment',
    description: 'Set up Vercel staging deployment with preview branches and environment variables.',
    status: 'Done',
    priority: 'High',
    assignee: 'Eve Kim',
  },
  {
    id: 'task-7',
    title: 'Tech Stack Document',
    description: 'Document all stack decisions with rationale for future reference.',
    status: 'Done',
    priority: 'Low',
    assignee: 'Tron',
  },
  {
    id: 'task-8',
    title: 'Team Roster Sync',
    description: 'Sync team roster data with Mission Control app and verify all roles are accurate.',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'Flynn',
  },
  {
    id: 'task-9',
    title: 'Brave Search API Integration',
    description: 'Configure Brave Search API key in OpenClaw for live web search across all agents. Key: BSALU12hvpKvrKaD95NFHPgnb-N_ABD. Gateway restarted and confirmed working.',
    status: 'Done',
    priority: 'High',
    assignee: 'Ares',
    dueDate: '2026-03-20',
  },
  {
    id: 'task-10',
    title: 'Freelance Job Sourcing — Upwork / Freelancer / Outlier',
    description: 'Identify and bid on quick-win freelance jobs (1-2 day delivery) across Upwork, Freelancer.com, Contra, Fiverr, Braintrust, and Outlier. Focus: AI automation, chatbots, content writing, web design. Managed by Ares.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Ares',
    dueDate: '2026-03-22',
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
    id: 'pete-1',
    title: 'Upwork Identity Verification',
    description: 'Complete ID verification on Upwork to unblock proposal submissions',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-2',
    title: 'Review Peptide Compass Cover',
    description: 'Approve the cover mockup, tagline, and design direction',
    actionType: 'APPROVE',
    completed: false,
  },
  {
    id: 'pete-3',
    title: 'X Account Access',
    description: 'Provide X/Twitter login so Jarod can start posting the 40 queued posts',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
  {
    id: 'pete-4',
    title: 'Define Problem-Hunt Keywords',
    description: 'Give Ares 10-20 keywords/topics to search on Reddit, LinkedIn, and X for problems people are frustrated with. Feeds the nightly 3 AM Opportunity Hunt that finds million-dollar ideas.',
    actionType: 'NEEDS_ACTION',
    completed: false,
  },
];

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Mission Control',
    description: 'Internal command center dashboard for managing team, tasks, projects, and agents. Built on Next.js 15 with full dark-mode command center aesthetic.',
    status: 'In Progress',
    progress: 40,
    lead: 'Tron',
    dueDate: '2026-03-25',
    tags: ['Next.js', 'React', 'Internal Tool'],
  },
  {
    id: 'proj-2',
    name: 'Peptide Compass',
    description: 'Content platform and product suite targeting the peptide/biohacking market. Research phase pending. High revenue potential.',
    status: 'In Progress',
    progress: 65,
    lead: 'Jarod',
    tags: ['Research', 'Content', 'Product'],
  },
  {
    id: 'proj-3',
    name: 'Ship Shape Soap Works',
    description: 'Handcrafted shaving soap website for Bradford Luke. Military/nautical theme. 14 scents. Paid project ($300).',
    status: 'In Progress',
    progress: 95,
    lead: 'Tron',
    dueDate: '2026-03-20',
    tags: ['Website', 'Client', 'Paid'],
  },
  {
    id: 'proj-4',
    name: 'Upwork Freelancing',
    description: 'Submitting proposals and delivering freelance work on Upwork. Target: 10 proposals/week, first revenue within 2 weeks.',
    status: 'In Progress',
    progress: 5,
    lead: 'Ares',
    tags: ['Freelance', 'Revenue', 'Upwork'],
  },
  {
    id: 'PROJ-05',
    name: 'Ares Research Lab',
    description: 'Autonomous R&D platform. Trend radar, opportunity scanner, R&D council. Twice-daily intelligence reports.',
    status: 'In Progress',
    progress: 15,
    lead: 'Ares',
    tags: ['R&D', 'Autonomous', 'Intelligence'],
  },
];
