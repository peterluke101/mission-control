'use client';

import { useState } from 'react';
import { useAppStore, type ApprovalCategory } from '@/lib/store';

type FilterType = 'All' | ApprovalCategory;

const filters: FilterType[] = ['All', 'Product', 'Mission Control', 'Marketing', 'Design'];

const priorityColor = {
  HIGH: { bg: 'rgba(255,80,80,0.12)', text: '#ff5050', border: 'rgba(255,80,80,0.25)' },
  MEDIUM: { bg: 'rgba(255,170,0,0.12)', text: '#ffaa00', border: 'rgba(255,170,0,0.25)' },
  LOW: { bg: 'rgba(74,79,101,0.3)', text: '#8b92a8', border: 'rgba(74,79,101,0.4)' },
};

const statusColor = {
  PENDING: { bg: 'rgba(255,170,0,0.1)', text: '#ffaa00', border: 'rgba(255,170,0,0.25)' },
  APPROVED: { bg: 'rgba(0,255,136,0.1)', text: '#00ff88', border: 'rgba(0,255,136,0.25)' },
  CHANGES_REQUESTED: { bg: 'rgba(255,80,80,0.1)', text: '#ff5050', border: 'rgba(255,80,80,0.25)' },
};

export default function ApprovalsPage() {
  const { approvals, setApprovalStatus, setApprovalOption } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filtered = activeFilter === 'All'
    ? approvals
    : approvals.filter((a) => a.category === activeFilter);

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-mono font-bold tracking-[0.15em] uppercase" style={{ color: '#e8eaf0' }}>
              Approvals
            </h1>
            <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
              Pete's decision inbox — everything waiting on you
            </p>
          </div>
          {pendingCount > 0 && (
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.3)' }}
            >
              {pendingCount} PENDING
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
          style={{ backgroundColor: 'rgba(255,170,0,0.05)', border: '1px solid rgba(255,170,0,0.15)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ffaa00', animation: 'pulse 2s infinite' }} />
          <span className="font-mono text-[10px]" style={{ color: '#ffaa00' }}>AWAITING</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest mr-1" style={{ color: '#2a2d42' }}>Filter:</span>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-md transition-all"
            style={{
              backgroundColor: activeFilter === f ? 'rgba(0,212,255,0.1)' : 'transparent',
              color: activeFilter === f ? '#00d4ff' : '#8b92a8',
              border: activeFilter === f ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="space-y-4 max-w-3xl">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm font-mono" style={{ color: '#4a4f65' }}>No items in this category.</p>
            </div>
          )}

          {filtered.map((item) => {
            const pColor = priorityColor[item.priority];
            const sColor = statusColor[item.status];

            return (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
              >
                {/* Card Header */}
                <div
                  className="px-5 py-4 flex items-start justify-between gap-4"
                  style={{ borderBottom: item.options ? '1px solid #1e2030' : 'none' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{item.title}</h3>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: pColor.bg, color: pColor.text, border: `1px solid ${pColor.border}` }}
                      >
                        {item.priority}
                      </span>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: sColor.bg, color: sColor.text, border: `1px solid ${sColor.border}` }}
                      >
                        {item.status === 'CHANGES_REQUESTED' ? 'CHANGES REQUESTED' : item.status}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#8b92a8' }}>{item.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>
                        Category: <span style={{ color: '#8b92a8' }}>{item.category}</span>
                      </span>
                      <span className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>
                        Assigned to: <span style={{ color: '#8b92a8' }}>{item.assignedTo}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Options (if applicable) */}
                {item.options && (
                  <div className="px-5 py-3 flex flex-wrap gap-2" style={{ borderBottom: '1px solid #1e2030' }}>
                    {item.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setApprovalOption(item.id, opt.value)}
                        className="rounded-md px-3 py-2 text-left transition-all"
                        style={{
                          backgroundColor: item.selectedOption === opt.value
                            ? 'rgba(0,212,255,0.1)'
                            : 'rgba(30,32,48,0.8)',
                          border: item.selectedOption === opt.value
                            ? '1px solid rgba(0,212,255,0.35)'
                            : '1px solid #2a2d42',
                          color: item.selectedOption === opt.value ? '#00d4ff' : '#8b92a8',
                        }}
                      >
                        <p className="text-[10px] font-mono font-bold mb-0.5" style={{ color: item.selectedOption === opt.value ? '#00d4ff' : '#4a4f65' }}>
                          {opt.label}
                        </p>
                        <p className="text-xs">{opt.value}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-5 py-3 flex items-center gap-2">
                  <button
                    onClick={() => setApprovalStatus(item.id, 'APPROVED')}
                    className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-md transition-all"
                    style={{
                      backgroundColor: item.status === 'APPROVED' ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,136,0.08)',
                      color: '#00ff88',
                      border: item.status === 'APPROVED' ? '1px solid rgba(0,255,136,0.35)' : '1px solid rgba(0,255,136,0.2)',
                    }}
                  >
                    {item.status === 'APPROVED' ? '✓ APPROVED' : 'Mark Approved'}
                  </button>
                  <button
                    onClick={() => setApprovalStatus(item.id, 'CHANGES_REQUESTED')}
                    className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-md transition-all"
                    style={{
                      backgroundColor: item.status === 'CHANGES_REQUESTED' ? 'rgba(255,80,80,0.15)' : 'rgba(255,80,80,0.06)',
                      color: '#ff5050',
                      border: item.status === 'CHANGES_REQUESTED' ? '1px solid rgba(255,80,80,0.35)' : '1px solid rgba(255,80,80,0.15)',
                    }}
                  >
                    {item.status === 'CHANGES_REQUESTED' ? '✗ CHANGES REQUESTED' : 'Request Changes'}
                  </button>
                  {item.status !== 'PENDING' && (
                    <button
                      onClick={() => setApprovalStatus(item.id, 'PENDING')}
                      className="text-[11px] font-mono px-3 py-1.5 rounded-md transition-all"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#4a4f65',
                        border: '1px solid #2a2d42',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
