'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { type TeamMember, type Status } from '@/lib/data';
import { cn } from '@/lib/utils';

// Tier color system
const tierColors = {
  Leadership: { accent: '#3DE8C3', dim: 'rgba(61,232,195,0.08)', border: 'rgba(61,232,195,0.2)', glow: 'rgba(61,232,195,0.12)' },
  Builders:   { accent: '#7c3aed', dim: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', glow: 'rgba(124,58,237,0.1)' },
  'Sub-agents': { accent: '#ffaa00', dim: 'rgba(255,170,0,0.08)', border: 'rgba(255,170,0,0.2)', glow: 'rgba(255,170,0,0.08)' },
};

// Simulated progress per agent based on current known tasks
const agentProgress: Record<string, number> = {
  ares: 72,
  tron: 58,
  athena: 45,
  jarod: 30,
  flynn: 65,
  evekim: 88,
  scout: 0,
  quill: 0,
  pixel: 0,
  echo: 0,
};

function StatusDot({ status }: { status: Status }) {
  const configs: Record<Status, { color: string; cls: string }> = {
    Active:  { color: '#00ff88', cls: 'status-dot-active' },
    Busy:    { color: '#ffaa00', cls: 'status-dot-busy' },
    Focused: { color: '#ffaa00', cls: 'status-dot-busy' },
    Training: { color: '#3b82f6', cls: 'status-dot-active' },
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
    Training: { color: '#3b82f6', label: 'TRAINING' },
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

function ProgressBar({ progress }: { progress: number; accent?: string }) {
  const isActive = progress > 0;

  return (
    <div className="mt-3 hud-bar-container">
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="hud-label">
          {isActive ? 'TASK PROGRESS....' : 'TASK PROGRESS'}
        </span>
        <span className={cn('text-[11px] hud-pct', !isActive && 'opacity-30')}
          style={!isActive ? { color: '#2a2d42', textShadow: 'none', animation: 'none' } : undefined}
        >
          {progress}%
        </span>
      </div>

      {/* Bar track */}
      <div
        className={cn('relative h-[6px]', isActive && 'hud-bar-track')}
        style={!isActive ? { backgroundColor: '#0a0b0f', border: '1px solid #161820', borderRadius: 0 } : undefined}
      >
        {/* Fill */}
        <div
          className={cn('h-full', isActive && 'hud-bar-fill')}
          style={{
            width: `${progress}%`,
            ...(!isActive ? { backgroundColor: '#1e2030', borderRadius: 0 } : {}),
          }}
        />
      </div>
    </div>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tier = tierColors[member.category];
  const progress = agentProgress[member.id] ?? 0;
  const isActive = member.status === 'Active' || member.status === 'Busy' || member.status === 'Focused';

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
      {/* Left edge glow bar for active agents */}
      {isActive && (
        <div
          className="absolute top-0 left-0 bottom-0 w-[3px] progress-edge-glow"
          style={{
            background: `linear-gradient(180deg, ${tier.accent}00, ${tier.accent}, ${tier.accent}00)`,
            ['--edge-color' as string]: tier.accent,
          }}
        />
      )}

      {/* Top accent bar (tier color) */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: tier.accent, opacity: expanded || hovered ? 1 : 0.5, transition: 'opacity 0.2s' }}
      />

      <div className="p-4 pt-[18px]" style={{ paddingLeft: isActive ? '18px' : '16px' }}>
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
            className="flex-shrink-0 p-1 rounded transition-colors active:bg-white/5 mt-1 flex items-center justify-center"
            style={{ color: '#4a4f65', touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
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

        {/* Progress bar */}
        <ProgressBar progress={progress} />
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: '#1e2030', paddingLeft: isActive ? '18px' : '16px' }}
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

            {/* Agent details section (merged from Agents tab) */}
            <div>
              <p
                className="text-[9px] font-mono font-bold mb-2 tracking-[0.18em]"
                style={{ color: '#2a2d42' }}
              >
                // AGENT DETAILS //
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#4a4f65' }} className="font-mono text-[10px]">Category</span>
                  <span style={{ color: '#8b92a8' }} className="text-[11px]">{member.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#4a4f65' }} className="font-mono text-[10px]">Model</span>
                  <span style={{ color: '#8b92a8' }} className="text-[11px] font-mono">{member.model}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: '#4a4f65' }} className="font-mono text-[10px]">Task Progress</span>
                  <span style={{ color: tier.accent }} className="text-[11px] font-mono font-bold">{progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
