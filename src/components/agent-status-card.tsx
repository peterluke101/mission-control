'use client';

import { Cpu } from 'lucide-react';
import { type TeamMember, type Status } from '@/lib/data';

const tierColors = {
  Leadership: { accent: '#00d4ff', dim: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)' },
  Builders:   { accent: '#7c3aed', dim: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)' },
  'Sub-agents': { accent: '#ffaa00', dim: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.2)' },
};

function StatusDot({ status }: { status: Status }) {
  const configs: Record<Status, { color: string; cls: string }> = {
    Active:  { color: '#00ff88', cls: 'status-dot-active' },
    Busy:    { color: '#ffaa00', cls: 'status-dot-busy' },
    Focused: { color: '#ffaa00', cls: 'status-dot-busy' },
    Standby: { color: '#4a4f65', cls: 'status-dot-standby' },
    Offline: { color: '#2a2d42', cls: '' },
  };
  const { color, cls } = configs[status];
  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${cls}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function AgentStatusCard({ member }: { member: TeamMember }) {
  const statusColors: Record<Status, string> = {
    Active:  '#00ff88',
    Busy:    '#ffaa00',
    Focused: '#ffaa00',
    Standby: '#4a4f65',
    Offline: '#2a2d42',
  };
  const tier = tierColors[member.category];
  const statusColor = statusColors[member.status];

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 relative overflow-hidden"
      style={{
        backgroundColor: '#111319',
        border: '1px solid #1e2030',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = tier.border;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 16px ${tier.dim}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e2030';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Tier accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-50"
        style={{ backgroundColor: tier.accent }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: tier.dim, color: tier.accent, border: `1px solid ${tier.border}` }}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{member.name}</p>
            <span
              className="text-[9px] font-mono font-bold"
              style={{ color: tier.accent, opacity: 0.7, letterSpacing: '0.1em' }}
            >
              {member.agentId}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold"
          style={{
            backgroundColor: `${statusColor}14`,
            color: statusColor,
            border: `1px solid ${statusColor}30`,
            letterSpacing: '0.08em',
          }}
        >
          <StatusDot status={member.status} />
          {member.status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: '#4a4f65' }} className="font-mono text-[10px]">Role</span>
          <span style={{ color: '#8b92a8' }} className="text-right text-[11px]">{member.role}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: '#4a4f65' }} className="font-mono text-[10px]">Specialty</span>
          <span style={{ color: '#8b92a8' }} className="text-right text-[11px]">{member.specialty}</span>
        </div>
      </div>

      {/* Model chip */}
      {member.model && (
        <div className="flex items-center gap-1 mb-2">
          <Cpu size={9} style={{ color: '#2a2d42' }} />
          <span className="model-chip" style={{ color: '#2a2d42' }}>{member.model}</span>
        </div>
      )}

      <div
        className="px-2.5 py-1.5 rounded-md flex items-center gap-2"
        style={{ backgroundColor: '#0a0b0f', border: '1px solid #161820' }}
      >
        <StatusDot status={member.status} />
        <span className="activity-line text-[11px] truncate" style={{ color: '#4a4f65' }}>
          &gt; {member.activity}
        </span>
      </div>
    </div>
  );
}
