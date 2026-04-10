'use client';

import { useState } from 'react';

type SettingsTab = 'settings' | 'improvements';

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
    color: '#3DE8C3',
  },
];

const growthOpportunities = [
  { title: 'Email List Capture', description: 'Build a lead magnet to capture emails before launch.', potential: 5, tag: 'HIGH ROI', tagColor: '#00ff88' },
  { title: 'Reddit Community Presence', description: 'r/Peptides, r/semaglutide, r/biohackers — organic traffic that converts.', potential: 4, tag: 'ORGANIC', tagColor: '#3DE8C3' },
  { title: 'Affiliate Program', description: 'Let buyers refer others for commission. Gumroad natively supports this.', potential: 4, tag: 'SCALABLE', tagColor: '#7c3aed' },
  { title: 'Volume 2 Planning', description: 'Position Peptide Compass as a series from day one.', potential: 3, tag: 'LONG GAME', tagColor: '#f0b429' },
  { title: 'Bundle Pricing', description: 'Guide + coaching/Q&A upsell. $37 PDF, $97 bundle.', potential: 3, tag: 'UPSELL', tagColor: '#ffaa00' },
];

const processImprovements = [
  { title: 'Morning Brief Automation', description: 'Heartbeat system is in progress — Ares auto-checks email, calendar, and alerts on a schedule.', status: 'IN PROGRESS', statusColor: '#3DE8C3' },
  { title: 'Mission Control Live Data Integration', description: 'Currently seeded with static data. Future state: real task completion, agent activity, and revenue metrics pulled live.', status: 'QUEUED', statusColor: '#4a4f65' },
  { title: 'Automated Research Monitoring', description: 'Set up Jarod to auto-alert on new peptide studies, FDA updates, or competitor releases.', status: 'PLANNED', statusColor: '#4a4f65' },
];

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 px-4 rounded-lg"
      style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
    >
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{label}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative rounded-full transition-all duration-200 flex-shrink-0"
      style={{
        width: '44px',
        height: '28px',
        backgroundColor: on ? 'rgba(61,232,195,0.3)' : '#1e2030',
        border: `1px solid ${on ? '#3DE8C3' : '#2a2d42'}`,
        touchAction: 'manipulation',
        minHeight: '44px',
        minWidth: '44px',
      }}
    >
      <span
        className="absolute top-1 w-5 h-5 rounded-full transition-all duration-200"
        style={{
          left: on ? 'calc(100% - 24px)' : '2px',
          backgroundColor: on ? '#3DE8C3' : '#4a4f65',
          boxShadow: on ? '0 0 6px rgba(61,232,195,0.6)' : 'none',
        }}
      />
    </button>
  );
}

function Select({ options, defaultValue }: { options: string[]; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="text-xs px-2.5 py-1.5 rounded-md outline-none cursor-pointer"
      style={{
        backgroundColor: '#1e2030',
        color: '#e8eaf0',
        border: '1px solid #2a2d42',
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('settings');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>Configure &amp; improve Mission Control</p>
      </div>

      {/* Tab Toggle */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-2 flex gap-1"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        {([{ id: 'settings' as const, label: 'Settings' }, { id: 'improvements' as const, label: 'Improvements' }]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              backgroundColor: tab === t.id ? 'rgba(61,232,195,0.12)' : 'transparent',
              color: tab === t.id ? '#3DE8C3' : '#4a4f65',
              border: tab === t.id ? '1px solid rgba(61,232,195,0.3)' : '1px solid transparent',
              textShadow: tab === t.id ? '0 0 8px rgba(61,232,195,0.4)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        {tab === 'improvements' ? (
          <div className="max-w-4xl space-y-10">
            {/* Team Needs */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#ff5050', textShadow: '0 0 8px rgba(255,80,80,0.3)' }}>
                  TEAM NEEDS
                </span>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,80,80,0.3) 0%, transparent 100%)' }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamNeeds.map((item, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ backgroundColor: '#0d0e14', border: `1px solid ${item.color}25` }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
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

            {/* Growth Opportunities */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.3)' }}>
                  GROWTH OPPORTUNITIES
                </span>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.3) 0%, transparent 100%)' }} />
              </div>
              <div className="space-y-3">
                {growthOpportunities.map((item, i) => (
                  <div key={i} className="rounded-lg p-4 flex items-start gap-4" style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm" style={{ backgroundColor: '#0a0b0f', border: '1px solid #2a2d42', color: '#e8eaf0' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${item.tagColor}15`, color: item.tagColor, border: `1px solid ${item.tagColor}35` }}>
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#8b92a8' }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Process Improvements */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold tracking-[0.2em] uppercase" style={{ color: '#f0b429', textShadow: '0 0 8px rgba(240,180,41,0.3)' }}>
                  PROCESS IMPROVEMENTS
                </span>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(240,180,41,0.3) 0%, transparent 100%)' }} />
              </div>
              <div className="space-y-3">
                {processImprovements.map((item, i) => (
                  <div key={i} className="rounded-lg p-4" style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${item.statusColor}15`, color: item.statusColor, border: `1px solid ${item.statusColor}35` }}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#8b92a8' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
        <div className="space-y-6 max-w-2xl">

          {/* Appearance */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3DE8C3' }}>
              Appearance
            </h2>
            <div className="space-y-2">
              <SettingRow label="Dark Mode" description="Command center aesthetic">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Accent Color" description="Primary highlight color">
                <div className="flex items-center gap-2">
                  {['#3DE8C3', '#00ff88', '#ffaa00', '#ff44aa', '#8b5cf6'].map((c) => (
                    <button
                      key={c}
                      className="w-8 h-8 rounded-full transition-transform active:scale-90"
                      style={{ backgroundColor: c, boxShadow: c === '#3DE8C3' ? `0 0 8px ${c}` : 'none', touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
                    />
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Sidebar" description="Default state on load">
                <Select options={['Expanded', 'Collapsed']} defaultValue="Expanded" />
              </SettingRow>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#ffaa00' }}>
              Notifications
            </h2>
            <div className="space-y-2">
              <SettingRow label="Agent Activity Alerts" description="Notify when agent status changes">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Task Updates" description="Notify on task status changes">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Project Milestones" description="Notify on progress thresholds">
                <Toggle />
              </SettingRow>
              <SettingRow label="Daily Digest" description="Morning summary email">
                <Toggle />
              </SettingRow>
            </div>
          </section>

          {/* Agent Defaults */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00ff88' }}>
              Agent Defaults
            </h2>
            <div className="space-y-2">
              <SettingRow label="Default Model" description="LLM used for new agent tasks">
                <Select options={['claude-sonnet-4', 'claude-opus-4', 'gpt-4o', 'gemini-2.0']} defaultValue="claude-sonnet-4" />
              </SettingRow>
              <SettingRow label="Auto-assign Tasks" description="Automatically assign tasks to available agents">
                <Toggle />
              </SettingRow>
              <SettingRow label="Parallel Execution" description="Allow concurrent agent tasks">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Max Concurrent Agents" description="Limit parallel agent sessions">
                <Select options={['1', '2', '3', '5', '10', 'Unlimited']} defaultValue="5" />
              </SettingRow>
            </div>
          </section>

          {/* System */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#8b92a8' }}>
              System
            </h2>
            <div className="space-y-2">
              <SettingRow label="Persist State to localStorage" description="Save UI state across sessions">
                <Toggle defaultOn />
              </SettingRow>
              <SettingRow label="Telemetry" description="Anonymous usage data to improve the system">
                <Toggle />
              </SettingRow>
            </div>
          </section>

          {/* Save button */}
          <div className="pt-2 pb-8">
            <button
              className="px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: 'rgba(61,232,195,0.15)',
                color: '#3DE8C3',
                border: '1px solid rgba(61,232,195,0.4)',
                touchAction: 'manipulation',
                minHeight: '44px',
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
