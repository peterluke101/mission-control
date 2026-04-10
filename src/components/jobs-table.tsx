'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useJobsStore } from '@/lib/jobs-store';
import { JobModal } from '@/components/job-modal';
import { type Job, type JobPlatform, type JobStatus } from '@/lib/data';

const PLATFORM_COLORS: Record<JobPlatform, string> = {
  Upwork: '#00ff88',
  Freelancer: '#3DE8C3',
  Fiverr: '#ffaa00',
  Other: '#8b92a8',
};

const STATUS_COLORS: Record<JobStatus, string> = {
  Submitted: '#8b92a8',
  Viewed: '#3DE8C3',
  Interviewing: '#ffaa00',
  Awarded: '#00ff88',
  'In Progress': '#3DE8C3',
  Completed: '#10b981',
  Lost: '#ff4466',
  Withdrawn: '#ff8800',
};

const ALL_PLATFORMS: JobPlatform[] = ['Upwork', 'Freelancer', 'Fiverr', 'Other'];
const ALL_STATUSES: JobStatus[] = ['Submitted', 'Viewed', 'Interviewing', 'Awarded', 'In Progress', 'Completed', 'Lost', 'Withdrawn'];

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div
      className="flex-1 min-w-[120px] rounded-xl px-4 py-3"
      style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
    >
      <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: '#4a4f65' }}>
        {label}
      </p>
      <p className="text-lg font-semibold" style={{ color: color || '#e8eaf0' }}>
        {value}
      </p>
    </div>
  );
}

export function JobsTable() {
  const {
    jobs, updateJob,
    filterPlatform, filterStatus, filterAwarded,
    setFilterPlatform, setFilterStatus, setFilterAwarded,
    sortColumn, sortDirection, setSort,
    selectedJobId, setSelectedJob,
    modalOpen, setModalOpen,
  } = useJobsStore();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState('');

  // Filter
  const filtered = useMemo(() => {
    let result = [...jobs];
    if (filterPlatform !== 'All') result = result.filter((j) => j.platform === filterPlatform);
    if (filterStatus !== 'All') result = result.filter((j) => j.status === filterStatus);
    if (filterAwarded === 'Yes') result = result.filter((j) => j.awarded);
    if (filterAwarded === 'No') result = result.filter((j) => !j.awarded);
    return result;
  }, [jobs, filterPlatform, filterStatus, filterAwarded]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filtered, sortColumn, sortDirection]);

  // Stats
  const totalProposals = jobs.length;
  const awarded = jobs.filter((j) => j.awarded).length;
  const inProgress = jobs.filter((j) => j.status === 'In Progress').length;
  const completed = jobs.filter((j) => j.status === 'Completed').length;
  const winRate = totalProposals > 0 ? Math.round((awarded / totalProposals) * 100) : 0;
  const totalRevenue = jobs.reduce((sum, j) => sum + j.revenue, 0);

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) || null : null;

  const handleNoteClick = (job: Job) => {
    setEditingNoteId(job.id);
    setNoteValue(job.notes);
  };

  const handleNoteSave = (id: string) => {
    updateJob(id, { notes: noteValue });
    setEditingNoteId(null);
  };

  const SortIcon = ({ column }: { column: keyof Job }) => {
    if (sortColumn !== column) return <ChevronUp size={10} style={{ color: '#2a2d42' }} />;
    return sortDirection === 'asc'
      ? <ChevronUp size={10} style={{ color: '#3DE8C3' }} />
      : <ChevronDown size={10} style={{ color: '#3DE8C3' }} />;
  };

  const selectStyle = {
    backgroundColor: '#0a0b0f',
    border: '1px solid #1e2030',
    color: '#8b92a8',
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Stats Bar — 2-col on mobile, flex-wrap on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Proposals" value={totalProposals} />
        <StatCard label="Awarded" value={awarded} color="#00ff88" />
        <StatCard label="In Progress" value={inProgress} color="#3DE8C3" />
        <StatCard label="Completed" value={completed} color="#10b981" />
        <StatCard label="Win Rate" value={`${winRate}%`} color="#3DE8C3" />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#00ff88" />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as JobPlatform | 'All')}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={selectStyle}
        >
          <option value="All">All Platforms</option>
          {ALL_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'All')}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={selectStyle}
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filterAwarded}
          onChange={(e) => setFilterAwarded(e.target.value as 'Yes' | 'No' | 'All')}
          className="text-xs px-3 py-1.5 rounded-lg outline-none"
          style={selectStyle}
        >
          <option value="All">Awarded: All</option>
          <option value="Yes">Awarded: Yes</option>
          <option value="No">Awarded: No</option>
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="flex-1 overflow-auto md:hidden space-y-3">
        {sorted.map((job) => (
          <div
            key={job.id}
            className="rounded-xl p-4 cursor-pointer active:opacity-80"
            style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
            onClick={() => setSelectedJob(selectedJobId === job.id ? null : job.id)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight" style={{ color: '#e8eaf0' }}>
                  {job.title}
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: '#3DE8C3' }}>{job.id}</p>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  color: STATUS_COLORS[job.status],
                  backgroundColor: `${STATUS_COLORS[job.status]}18`,
                  border: `1px solid ${STATUS_COLORS[job.status]}30`,
                }}
              >
                {job.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{
                  color: PLATFORM_COLORS[job.platform],
                  backgroundColor: `${PLATFORM_COLORS[job.platform]}18`,
                  border: `1px solid ${PLATFORM_COLORS[job.platform]}30`,
                }}
              >
                {job.platform}
              </span>
              {job.awarded && (
                <span className="text-[10px] font-mono" style={{ color: '#00ff88' }}>Awarded</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[9px] font-mono uppercase" style={{ color: '#4a4f65' }}>Amount</p>
                <p className="text-xs font-medium" style={{ color: '#e8eaf0' }}>${job.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono uppercase" style={{ color: '#4a4f65' }}>Revenue</p>
                <p className="text-xs" style={{ color: job.revenue > 0 ? '#00ff88' : '#4a4f65' }}>${job.revenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] font-mono uppercase" style={{ color: '#4a4f65' }}>Date</p>
                <p className="text-xs" style={{ color: '#8b92a8' }}>
                  {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            {job.notes && (
              <p className="text-xs mt-2 truncate" style={{ color: '#8b92a8' }}>{job.notes}</p>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="text-center py-10">
            <span className="text-xs" style={{ color: '#4a4f65' }}>No jobs match the current filters</span>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="flex-1 overflow-auto rounded-xl hidden md:block" style={{ border: '1px solid #1e2030' }}>
        <table className="w-full text-left" style={{ minWidth: '900px' }}>
          <thead>
            <tr style={{ backgroundColor: '#13151c', borderBottom: '1px solid #1e2030' }}>
              {[
                { key: 'id' as keyof Job, label: 'Job #' },
                { key: 'platform' as keyof Job, label: 'Platform' },
                { key: 'title' as keyof Job, label: 'Job Title' },
                { key: 'amount' as keyof Job, label: 'Amount' },
                { key: 'status' as keyof Job, label: 'Status' },
                { key: 'awarded' as keyof Job, label: 'Awarded' },
                { key: 'revenue' as keyof Job, label: 'Revenue' },
                { key: 'date' as keyof Job, label: 'Date' },
                { key: 'notes' as keyof Job, label: 'Notes' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-[10px] font-mono font-semibold uppercase tracking-wider px-3 py-2.5 cursor-pointer select-none whitespace-nowrap"
                  style={{ color: '#4a4f65' }}
                  onClick={() => setSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <SortIcon column={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((job) => {
              const isExpanded = selectedJobId === job.id;
              return (
                <tr
                  key={job.id}
                  className="transition-colors duration-150 cursor-pointer hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid #1e2030', backgroundColor: isExpanded ? 'rgba(61,232,195,0.03)' : 'transparent' }}
                  onClick={() => setSelectedJob(isExpanded ? null : job.id)}
                >
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono font-medium" style={{ color: '#3DE8C3' }}>{job.id}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                      style={{
                        color: PLATFORM_COLORS[job.platform],
                        backgroundColor: `${PLATFORM_COLORS[job.platform]}18`,
                        border: `1px solid ${PLATFORM_COLORS[job.platform]}30`,
                      }}
                    >
                      {job.platform}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 max-w-[250px]">
                    <span className="text-xs truncate block" style={{ color: '#e8eaf0', maxWidth: '250px' }} title={job.title}>
                      {job.title.length > 40 ? `${job.title.slice(0, 40)}...` : job.title}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-medium" style={{ color: '#e8eaf0' }}>${job.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: STATUS_COLORS[job.status],
                        backgroundColor: `${STATUS_COLORS[job.status]}18`,
                        border: `1px solid ${STATUS_COLORS[job.status]}30`,
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-xs" style={{ color: job.awarded ? '#00ff88' : '#4a4f65' }}>
                      {job.awarded ? '\u2713' : '\u2014'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs" style={{ color: job.revenue > 0 ? '#00ff88' : '#4a4f65' }}>
                      ${job.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs whitespace-nowrap" style={{ color: '#8b92a8' }}>
                      {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    {editingNoteId === job.id ? (
                      <input
                        autoFocus
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        onBlur={() => handleNoteSave(job.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNoteSave(job.id); }}
                        className="text-xs px-2 py-1 rounded outline-none w-full min-w-[120px] focus:ring-1 focus:ring-[#3DE8C3]/40"
                        style={{ backgroundColor: '#0a0b0f', border: '1px solid #1e2030', color: '#e8eaf0' }}
                      />
                    ) : (
                      <span
                        className="text-xs truncate block cursor-text max-w-[180px]"
                        style={{ color: '#8b92a8' }}
                        title={job.notes}
                        onClick={() => handleNoteClick(job)}
                      >
                        {job.notes || '\u2014'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10">
                  <span className="text-xs" style={{ color: '#4a4f65' }}>No jobs match the current filters</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal (row click) */}
      {selectedJobId && selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Add Modal */}
      {modalOpen && (
        <JobModal
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
