'use client';

import { useAppStore } from '@/lib/store';

const accomplished = [
  { label: 'Mission Control v2 built', agent: 'Tron + Athena' },
  { label: 'Brand identity complete', agent: 'Athena' },
  { label: 'Cover mockup complete', agent: 'Athena' },
  { label: 'Peptide research dossier — 17 peptides', agent: 'Jarod' },
  { label: 'Content strategy — 14 chapters, $37 price', agent: 'Jarod' },
  { label: 'Community questions research — 40 FAQs', agent: 'Jarod' },
  { label: 'Retatrutide deep dive — 71.2 lbs Phase 3 data', agent: 'Jarod' },
  { label: 'Design inspiration report', agent: 'Jarod' },
  { label: 'Social card templates — 6 templates', agent: 'Athena' },
  { label: 'Master disclaimer — 3 versions locked', agent: 'Team' },
  { label: 'X content library in progress', agent: 'Jarod' },
];

const inProgress = [
  { label: 'X Content Library', agent: 'Jarod', progress: 85, status: 'active' as const },
  { label: 'PDF Layout System', agent: 'Athena', progress: 0, status: 'queued' as const },
  { label: 'PDF Generation Pipeline', agent: 'Tron', progress: 0, status: 'queued' as const },
  { label: 'Gumroad Listing Setup', agent: '—', progress: 0, status: 'queued' as const },
  { label: 'Marketing Automation', agent: '—', progress: 0, status: 'queued' as const },
];

const metrics = [
  { label: 'Products in Pipeline', value: '1', sub: 'Peptide Compass' },
  { label: 'Est. Revenue (Month 1)', value: 'TBD', sub: 'Pre-launch' },
  { label: 'Days Since Launch', value: 'Pre-launch', sub: '—' },
  { label: 'Research Files Generated', value: '5', sub: 'Docs ready' },
  { label: 'Pages of Content Ready', value: '~200+', sub: 'Draft complete' },
];

export default function DashboardPage() {
  const { approvals, setApprovalStatus } = useAppStore();
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-sm font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#e8eaf0' }}>
            Morning Brief
          </h1>
          <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
            Command overview — everything that matters, right now
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
          style={{ backgroundColor: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full status-dot-active" style={{ backgroundColor: '#00ff88' }} />
          <span className="font-mono text-[10px]" style={{ color: '#00ff88' }}>LIVE</span>
        </div>
      </div>

      {/* 4-Quadrant Grid — stacks on mobile */}
      <div className="flex-1 overflow-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-px p-px" style={{ backgroundColor: '#1e2030' }}>

        {/* TOP-LEFT: Accomplished */}
        <div className="overflow-hidden flex flex-col" style={{ backgroundColor: '#0a0b0f' }}>
          <div
            className="flex-shrink-0 px-4 md:px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid #1e2030' }}
          >
            <h2 className="text-xs font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#00ff88', textShadow: '0 0 8px rgba(0,255,136,0.4)' }}>
              ✅ ACCOMPLISHED
            </h2>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.2)' }}
            >
              {accomplished.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-2">
            {accomplished.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: '#00ff88' }}>✓</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: '#c4c9d9' }}>{item.label}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: '#4a4f65' }}>{item.agent}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP-RIGHT: Needs Your Approval */}
        <div className="overflow-hidden flex flex-col" style={{ backgroundColor: '#0a0b0f' }}>
          <div
            className="flex-shrink-0 px-4 md:px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid #1e2030' }}
          >
            <span className="pulse-amber-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ffaa00', display: 'inline-block', flexShrink: 0 }} />
            <h2 className="text-xs font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#ffaa00', textShadow: '0 0 8px rgba(255,170,0,0.4)' }}>
              ⏳ NEEDS YOUR APPROVAL
            </h2>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(255,170,0,0.1)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.25)' }}
            >
              {pendingApprovals.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="rounded-md px-3 py-2.5 flex items-center justify-between gap-2"
                style={{
                  backgroundColor: item.status === 'PENDING' ? 'rgba(255,170,0,0.05)' : item.status === 'APPROVED' ? 'rgba(0,255,136,0.05)' : 'rgba(255,80,80,0.05)',
                  border: `1px solid ${item.status === 'PENDING' ? 'rgba(255,170,0,0.2)' : item.status === 'APPROVED' ? 'rgba(0,255,136,0.2)' : 'rgba(255,80,80,0.2)'}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: '#e8eaf0' }}>{item.title}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: '#4a4f65' }}>{item.category}</p>
                </div>
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    backgroundColor: item.status === 'PENDING' ? 'rgba(255,170,0,0.15)' : item.status === 'APPROVED' ? 'rgba(0,255,136,0.15)' : 'rgba(255,80,80,0.15)',
                    color: item.status === 'PENDING' ? '#ffaa00' : item.status === 'APPROVED' ? '#00ff88' : '#ff5050',
                  }}
                >
                  {item.status === 'CHANGES_REQUESTED' ? 'CHANGES' : item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM-LEFT: In Progress */}
        <div className="overflow-hidden flex flex-col" style={{ backgroundColor: '#0a0b0f' }}>
          <div
            className="flex-shrink-0 px-4 md:px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid #1e2030' }}
          >
            <h2 className="text-xs font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.4)' }}>
              🔥 IN PROGRESS
            </h2>
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}
            >
              {inProgress.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-3">
            {inProgress.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs" style={{ color: '#c4c9d9' }}>{item.label}</p>
                    <p className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>{item.agent !== '—' ? item.agent : 'Unassigned'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === 'queued' ? (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(42,45,66,0.8)', color: '#4a4f65', border: '1px solid #2a2d42' }}
                      >
                        QUEUED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono" style={{ color: '#00d4ff' }}>{item.progress}%</span>
                    )}
                  </div>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', backgroundColor: '#1e2030' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.status === 'active' ? '#00d4ff' : '#2a2d42',
                      boxShadow: item.status === 'active' ? '0 0 6px rgba(0,212,255,0.5)' : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM-RIGHT: Mission Pulse */}
        <div className="overflow-hidden flex flex-col" style={{ backgroundColor: '#0a0b0f' }}>
          <div
            className="flex-shrink-0 px-4 md:px-5 py-3 flex items-center gap-2"
            style={{ borderBottom: '1px solid #1e2030' }}
          >
            <h2 className="text-xs font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#f0b429', textShadow: '0 0 8px rgba(240,180,41,0.4)' }}>
              📊 MISSION PULSE
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-5 py-3 space-y-4">
            {/* Mission statement */}
            <div
              className="rounded-md px-3 py-2.5"
              style={{ backgroundColor: 'rgba(240,180,41,0.05)', border: '1px solid rgba(240,180,41,0.15)' }}
            >
              <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: '#f0b429', opacity: 0.6 }}>
                Mission
              </p>
              <p className="text-xs leading-relaxed italic" style={{ color: '#c4c9d9' }}>
                "We create autonomous businesses determined and focused on massive profits."
              </p>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-2">
              {metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-md px-3 py-2"
                  style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
                >
                  <p className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#4a4f65' }}>{m.label}</p>
                  <p className="text-sm font-bold font-mono mt-0.5" style={{ color: '#e8eaf0' }}>{m.value}</p>
                  <p className="text-[9px] font-mono" style={{ color: '#2a2d42' }}>{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Launch Readiness */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#f0b429' }}>
                  Launch Readiness
                </p>
                <p className="text-[10px] font-mono font-bold" style={{ color: '#f0b429' }}>35%</p>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', backgroundColor: '#1e2030' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '35%',
                    background: 'linear-gradient(90deg, #f0b429, #ffaa00)',
                    boxShadow: '0 0 8px rgba(240,180,41,0.5)',
                  }}
                />
              </div>
              <p className="text-[9px] font-mono mt-1" style={{ color: '#4a4f65' }}>
                Research done · Design in review · PDF pipeline queued
              </p>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
}
