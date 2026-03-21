'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { type TeamMember, type Status } from '@/lib/data';
import { cn } from '@/lib/utils';

// Tier color system
const tierColors = {
  Leadership: { accent: '#00d4ff', dim: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', glow: 'rgba(0,212,255,0.12)' },
  Builders:   { accent: '#7c3aed', dim: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', glow: 'rgba(124,58,237,0.1)' },
  'Sub-agents': { accent: '#ffaa00', dim: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.2)', glow: 'rgba(255,170,0,0.08)' },
};

function StatusDot({ status }: { status: Status }) {
  const configs: Record<Status, { color: string; cls: string }> = {
    Active:  { color: '#00ff88', cls: 'status-dot-active' },
    Busy:    { color: '#ffaa00', cls: 'status-dot-busy' },
    Focused: { color: '#ffaa00', cls: 'status-dot-busy' },
    Standby: { color: '#8b92a8', cls: 'status-dot-standby' },
    Offline: { color: '#2a2d42', cls: '' },
  };
  const { color, cls } = configs[status];
  return (
    <span
      className={cn('w-2 h-2 rounded-full flex-shrink-0', cls)}
      style={{ backgroundColor: color }}
    />
  );
}

function StatusBadge({ status }: { status: Status }) {
  const configs: Record<Status, { color: string; label: string }> = {
    Active:  { color: '#00ff88', label: 'ACTIVE' },
    Busy:    { color: '#ffaa00', label: 'BUSY' },
    Focused: { color: '#ffaa00', label: 'FOCUSED' },
    Standby: { color: '#4a4f65', label: 'STANDBY' },
    Offline: { color: '#2a2d42', label: 'OFFLINE' },
  };
  const { color, label } = configs[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-mono font-bold"
      style={{
        fontSize: '0.55rem',
        letterSpacing: '0.12em',
        backgroundColor: `${color}14`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      <StatusDot status={status} />
      {label}
    </span>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tier = tierColors[member.category];

  return (
    <div
      className={cn('rounded-xl transition-all duration-200 cursor-pointer card-hover relative overflow-hidden')}
      style={{
        backgroundColor: '#111319',
        border: `1px solid ${hovered || expanded ? tier.border : '#1e2030'}`,
        boxShadow: hovered || expanded
          ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${tier.glow}`
          : '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar (tier color) */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: tier.accent, opacity: expanded || hovered ? 1 : 0.5, transition: 'opacity 0.2s' }}
      />

      <div className="p-4 pt-[18px]">
        {/* Header row: Avatar + Info + Expand */}
        <div className="flex items-start justify-between gap-3">
          {/* Avatar block */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* ID Badge + Avatar */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: tier.dim,
                  color: tier.accent,
                  border: `1px solid ${tier.border}`,
                  textShadow: `0 0 8px ${tier.accent}60`,
                }}
              >
                {member.name.charAt(0)}
              </div>
              {/* Agent ID below avatar */}
              <span
                className="agent-id-badge"
                style={{ color: tier.accent, opacity: 0.7 }}
              >
                {member.agentId}
              </span>
            </div>

            {/* Name + Status + Role */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3
                  className="text-sm font-semibold leading-tight"
                  style={{ color: '#e8eaf0' }}
                >
                  {member.name}
                </h3>
                <StatusBadge status={member.status} />
              </div>
              <p className="text-xs truncate" style={{ color: '#8b92a8' }}>
                {member.role}
              </p>
              {/* Specialty tag */}
              <span
                className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: tier.dim,
                  color: tier.accent,
                  border: `1px solid ${tier.border}`,
                  opacity: 0.85,
                }}
              >
                {member.specialty}
              </span>
            </div>
          </div>

          {/* Expand toggle */}
          <button
            className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white/5 mt-1"
            style={{ color: '#4a4f65' }}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        {/* Model chip */}
        <div className="mt-3 flex items-center gap-1.5">
          <Cpu size={10} style={{ color: '#4a4f65', flexShrink: 0 }} />
          <span
            className="model-chip"
            style={{ color: '#4a4f65' }}
          >
            {member.model}
          </span>
        </div>

        {/* Activity line */}
        <div
          className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-md"
          style={{ backgroundColor: '#0a0b0f', border: '1px solid #161820' }}
        >
          <StatusDot status={member.status} />
          <span className="activity-line truncate" style={{ color: '#4a4f65' }}>
            &gt; {member.activity}
          </span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: '#1e2030' }}
        >
          <div className="pt-3 space-y-3">
            <div>
              <p
                className="text-[9px] font-mono font-bold mb-2 tracking-[0.18em]"
                style={{ color: '#2a2d42' }}
              >
                // RESPONSIBILITIES //
              </p>
              <ul className="space-y-1.5">
                {member.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#8b92a8' }}>
                    <span style={{ color: tier.accent }} className="mt-0.5 flex-shrink-0 font-mono">›</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
