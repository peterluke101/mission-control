import { teamMembers } from '@/lib/data';
import { TeamCard } from '@/components/team-card';

const tierConfig = {
  Leadership: {
    label: '// COMMAND TIER //',
    color: '#00d4ff',
    count: 0,
  },
  Builders: {
    label: '// OPERATIONS TIER //',
    color: '#7c3aed',
    count: 0,
  },
  'Sub-agents': {
    label: '// RECON TIER //',
    color: '#ffaa00',
    count: 0,
  },
};

export default function TeamPage() {
  const leadership = teamMembers.filter((m) => m.category === 'Leadership');
  const builders = teamMembers.filter((m) => m.category === 'Builders');
  const subagents = teamMembers.filter((m) => m.category === 'Sub-agents');

  const activeCount = teamMembers.filter(
    (m) => m.status === 'Active' || m.status === 'Busy' || m.status === 'Focused'
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1
            className="text-sm font-mono font-bold tracking-[0.15em] uppercase"
            style={{ color: '#e8eaf0' }}
          >
            Team Roster
          </h1>
          <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
            {teamMembers.length} agents deployed · {activeCount} active
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tier legend */}
          <div className="hidden sm:flex items-center gap-4">
            {(['Leadership', 'Builders', 'Sub-agents'] as const).map((tier) => {
              const cfg = tierConfig[tier];
              return (
                <div key={tier} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: '#4a4f65' }}
                  >
                    {tier}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live pill */}
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
            style={{
              backgroundColor: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.15)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full status-dot-active"
              style={{ backgroundColor: '#00ff88' }}
            />
            <span className="font-mono text-[10px]" style={{ color: '#00ff88' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="space-y-10 max-w-5xl">

          {/* COMMAND TIER */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="tier-header"
                style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.4)' }}
              >
                // COMMAND TIER //
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,212,255,0.3) 0%, rgba(0,212,255,0.05) 50%, transparent 100%)',
                }}
              />
              <span
                className="text-[10px] font-mono"
                style={{ color: '#2a2d42' }}
              >
                {leadership.length} agents
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {leadership.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          </section>

          {/* OPERATIONS TIER */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="tier-header"
                style={{ color: '#7c3aed', textShadow: '0 0 8px rgba(124,58,237,0.5)' }}
              >
                // OPERATIONS TIER //
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.05) 50%, transparent 100%)',
                }}
              />
              <span
                className="text-[10px] font-mono"
                style={{ color: '#2a2d42' }}
              >
                {builders.length} agents
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {builders.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          </section>

          {/* RECON TIER */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="tier-header"
                style={{ color: '#ffaa00', textShadow: '0 0 8px rgba(255,170,0,0.4)' }}
              >
                // RECON TIER //
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,170,0,0.3) 0%, rgba(255,170,0,0.05) 50%, transparent 100%)',
                }}
              />
              <span
                className="text-[10px] font-mono"
                style={{ color: '#2a2d42' }}
              >
                {subagents.length} sub-agents
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {subagents.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
