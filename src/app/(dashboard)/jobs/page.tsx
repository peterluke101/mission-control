'use client';

import { JobsTable } from '@/components/jobs-table';
import { useJobsStore } from '@/lib/jobs-store';

export default function JobsPage() {
  const setModalOpen = useJobsStore((s) => s.setModalOpen);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Jobs</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>Freelance proposals &amp; contracts</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[#00d4ff]/10 font-medium"
          style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          + Add Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="flex-1 overflow-hidden px-4 md:px-6 py-4 md:py-5">
        <JobsTable />
      </div>
    </div>
  );
}
