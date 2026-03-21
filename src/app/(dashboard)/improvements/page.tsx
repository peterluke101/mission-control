'use client';

const teamNeeds = [
  {
    title: 'X Account Access',
    description: 'Twitter/X account credentials or access needed for marketing launch. Without this, the X content library Jarod built cannot be published.',
    assigned: 'Pete action required',
    urgency: 'LAUNCH BLOCKER' as const,
    color: '#ff5050',
  },
  {
    title: 'Gumroad Account Setup',
    description: 'Gumroad seller account must be configured before Peptide Compass can go live. Payment processing, product listing, and delivery all depend on this.',
    assigned: 'Pete action required',
    urgency: 'LAUNCH BLOCKER' as const,
    color: '#ff5050',
  },
  {
    title: 'Eve Kim / Infrastructure',
    description: 'Eve Kim (Infrastructure Engineer) needs to stand up the web deployment stack when we go live. Staging environment ready; production config pending.',
    assigned: 'Ares to activate',
    urgency: 'PRE-LAUNCH' as const,
    color: '#ffaa00',
  },
  {
    title: 'PDF Generation Tooling Decision',
    description: 'Tron needs a direction before building the PDF pipeline. Options: InDesign-based (manual, high polish) vs code-generated (automated, scalable). Revenue implications differ significantly.',
    assigned: 'Pete decision needed',
    urgency: 'PENDING DECISION' as const,
    color: '#00d4ff',
  },
];

const growthOpportunities = [
  {
    title: 'Email List Capture',
    description: 'Build a lead magnet to capture emails before launch. Every email collected pre-launch = day-1 sales. Even a simple landing page with a free peptide cheat sheet would convert.',
    potential: '⭐⭐⭐⭐⭐',
    rank: 1,
    tag: 'HIGH ROI',
    tagColor: '#00ff88',
  },
  {
    title: 'Reddit Community Presence',
    description: 'r/Peptides, r/semaglutide, r/biohackers — organic traffic that converts. Jarod can start engaging now as a contributor, not a spammer, to build trust before launch.',
    potential: '⭐⭐⭐⭐',
    rank: 2,
    tag: 'ORGANIC',
    tagColor: '#00d4ff',
  },
  {
    title: 'Affiliate Program',
    description: 'Let buyers refer others for commission. Gumroad natively supports this. A 20-30% affiliate commission on a $37 product is compelling and self-funding.',
    potential: '⭐⭐⭐⭐',
    rank: 3,
    tag: 'SCALABLE',
    tagColor: '#7c3aed',
  },
  {
    title: 'Volume 2 Planning',
    description: 'Position Peptide Compass as a series from day one. "Volume 1: Foundations" sets up Volume 2: Advanced Protocols, Volume 3: Stacking Guides. Series buyers spend 3x more.',
    potential: '⭐⭐⭐',
    rank: 4,
    tag: 'LONG GAME',
    tagColor: '#f0b429',
  },
  {
    title: 'Bundle Pricing',
    description: 'Guide + coaching/Q&A upsell. Offer the PDF at $37, bundle with a 30-min consult for $97. Captures the high-intent buyer who wants hand-holding.',
    potential: '⭐⭐⭐',
    rank: 5,
    tag: 'UPSELL',
    tagColor: '#ffaa00',
  },
];

const processImprovements = [
  {
    title: 'Morning Brief Automation',
    description: 'Heartbeat system is in progress — Ares auto-checks email, calendar, and alerts on a schedule. This page becomes the live output of that system.',
    status: 'IN PROGRESS',
    statusColor: '#00d4ff',
  },
  {
    title: 'Mission Control Live Data Integration',
    description: 'Currently seeded with static data. Future state: real task completion, agent activity, and revenue metrics pulled live. Removes the need to manually update.',
    status: 'QUEUED',
    statusColor: '#4a4f65',
  },
  {
    title: 'Automated Research Monitoring',
    description: 'Set up Jarod to auto-alert on new peptide studies, FDA updates, or competitor releases. Keeps the Peptide Compass content current without manual monitoring.',
    status: 'PLANNED',
    statusColor: '#4a4f65',
  },
];

export default function ImprovementsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-sm font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#e8eaf0' }}>
            Improvements
          </h1>
          <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
            What the team needs · growth opportunities · process upgrades
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
        >
          <span className="font-mono text-[10px]" style={{ color: '#7c3aed' }}>CONTINUOUS IMPROVEMENT</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-4xl space-y-10">

          {/* SECTION: Team Needs */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#ff5050', textShadow: '0 0 8px rgba(255,80,80,0.3)' }}>
                🚧 TEAM NEEDS
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,80,80,0.3) 0%, transparent 100%)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teamNeeds.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#0d0e14', border: `1px solid rgba(${item.color === '#ff5050' ? '255,80,80' : item.color === '#ffaa00' ? '255,170,0' : '0,212,255'},0.15)` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                        border: `1px solid ${item.color}40`,
                      }}
                    >
                      {item.urgency}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: '#8b92a8' }}>{item.description}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>Assigned:</span>
                    <span className="text-[10px] font-mono" style={{ color: item.color }}>{item.assigned}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Growth Opportunities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.3)' }}>
                📈 GROWTH OPPORTUNITIES
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.3) 0%, transparent 100%)' }} />
              <span className="text-[10px] font-mono" style={{ color: '#2a2d42' }}>Ranked by profit potential</span>
            </div>
            <div className="space-y-3">
              {growthOpportunities.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 flex items-start gap-4"
                  style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm"
                    style={{ backgroundColor: '#0a0b0f', border: '1px solid #2a2d42', color: '#e8eaf0' }}
                  >
                    {item.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${item.tagColor}15`,
                          color: item.tagColor,
                          border: `1px solid ${item.tagColor}35`,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: '#8b92a8' }}>{item.description}</p>
                    <p className="text-[10px]" style={{ color: '#4a4f65' }}>Potential: {item.potential}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: Process Improvements */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#f0b429', textShadow: '0 0 8px rgba(240,180,41,0.3)' }}>
                ⚙️ PROCESS IMPROVEMENTS
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(240,180,41,0.3) 0%, transparent 100%)' }} />
            </div>
            <div className="space-y-3">
              {processImprovements.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4 flex items-start gap-4"
                  style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${item.statusColor}15`,
                          color: item.statusColor,
                          border: `1px solid ${item.statusColor}35`,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#8b92a8' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
