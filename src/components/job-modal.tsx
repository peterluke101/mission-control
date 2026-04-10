'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useJobsStore } from '@/lib/jobs-store';
import { type Job, type JobPlatform, type JobStatus } from '@/lib/data';

const PLATFORMS: JobPlatform[] = ['Upwork', 'Freelancer', 'Fiverr', 'Other'];
const STATUSES: JobStatus[] = ['Submitted', 'Viewed', 'Interviewing', 'Awarded', 'In Progress', 'Completed', 'Lost', 'Withdrawn'];

interface JobModalProps {
  job?: Job | null;
  onClose: () => void;
}

export function JobModal({ job, onClose }: JobModalProps) {
  const { jobs, addJob, updateJob } = useJobsStore();
  const isEdit = !!job;

  const [form, setForm] = useState({
    platform: job?.platform || 'Upwork' as JobPlatform,
    title: job?.title || '',
    amount: job?.amount?.toString() || '',
    status: job?.status || 'Submitted' as JobStatus,
    awarded: job?.awarded || false,
    revenue: job?.revenue?.toString() || '0',
    date: job?.date || new Date().toISOString().split('T')[0],
    notes: job?.notes || '',
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    if (isEdit && job) {
      updateJob(job.id, {
        platform: form.platform,
        title: form.title,
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        awarded: form.awarded,
        revenue: parseFloat(form.revenue) || 0,
        date: form.date,
        notes: form.notes,
      });
    } else {
      const nextNum = jobs.length + 1;
      const id = `JOB-${String(nextNum).padStart(3, '0')}`;
      addJob({
        id,
        platform: form.platform,
        title: form.title,
        amount: parseFloat(form.amount) || 0,
        status: form.status,
        awarded: form.awarded,
        revenue: parseFloat(form.revenue) || 0,
        date: form.date,
        notes: form.notes,
      });
    }
    onClose();
  };

  const inputStyle = {
    backgroundColor: '#0a0b0f',
    border: '1px solid #1e2030',
    color: '#e8eaf0',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#13151c',
          border: '1px solid #2a2d42',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e2030' }}
        >
          <h2 className="text-base font-semibold" style={{ color: '#e8eaf0' }}>
            {isEdit ? 'Edit Job' : 'Add Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors active:bg-white/5 flex items-center justify-center"
            style={{ color: '#4a4f65', touchAction: 'manipulation', minWidth: '44px', minHeight: '44px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Platform */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value as JobPlatform })}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
              style={inputStyle}
            >
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Job Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Job title..."
              className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
              style={inputStyle}
            />
          </div>

          {/* Amount + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
                style={inputStyle}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Awarded + Revenue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Awarded</label>
              <select
                value={form.awarded ? 'yes' : 'no'}
                onChange={(e) => setForm({ ...form, awarded: e.target.value === 'yes' })}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
                style={inputStyle}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Revenue Received ($)</label>
              <input
                type="number"
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                placeholder="0"
                className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Date Submitted</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-[#3DE8C3]/40"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: '#8b92a8' }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes..."
              rows={3}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none focus:ring-1 focus:ring-[#3DE8C3]/40"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 flex-shrink-0" style={{ borderTop: '1px solid #1e2030' }}>
          <button
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-colors active:bg-white/5 active:scale-95"
            style={{ color: '#8b92a8', border: '1px solid #1e2030', touchAction: 'manipulation', minHeight: '44px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95"
            style={{
              color: '#3DE8C3',
              border: '1px solid rgba(61,232,195,0.3)',
              backgroundColor: 'rgba(61,232,195,0.08)',
              touchAction: 'manipulation',
              minHeight: '44px',
            }}
          >
            {isEdit ? 'Save Changes' : 'Add Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
