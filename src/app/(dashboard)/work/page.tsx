'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { PeteTasks } from '@/components/pete-tasks';
import { ProjectCard } from '@/components/project-card';
import { JobsTable } from '@/components/jobs-table';
import { useAppStore } from '@/lib/store';
import { useJobsStore } from '@/lib/jobs-store';

type WorkView = 'board' | 'list' | 'projects' | 'jobs';

const VIEWS: { id: WorkView; label: string }[] = [
  { id: 'board', label: 'Board' },
  { id: 'list', label: 'List' },
  { id: 'projects', label: 'Projects' },
  { id: 'jobs', label: 'Jobs' },
];

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#8b92a8',
  Medium: '#3DE8C3',
  High: '#ffaa00',
  Critical: '#ff4466',
};

const STATUS_COLORS: Record<string, string> = {
  Backlog: '#8b92a8',
  'In Progress': '#ffaa00',
  Review: '#3DE8C3',
  Done: '#00ff88',
};

export default function WorkPage() {
  const [view, setView] = useState<WorkView>('board');
  const tasks = useAppStore((s) => s.tasks);
  const projects = useAppStore((s) => s.projects);
  const setModalOpen = useJobsStore((s) => s.setModalOpen);

  const inProgress = projects.filter((p) => p.status === 'In Progress').length;
  const queued = projects.filter((p) => p.status === 'Queued').length;

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Work</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>
            Tasks, projects &amp; jobs
          </p>
        </div>

        {view === 'jobs' && (
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 active:bg-[#3DE8C3]/10 font-medium"
            style={{ color: '#3DE8C3', border: '1px solid rgba(61,232,195,0.3)', touchAction: 'manipulation', minHeight: '44px' }}
          >
            + Add Job
          </button>
        )}
      </div>

      {/* View Toggle */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-2 flex gap-1 overflow-x-auto"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex-shrink-0"
            style={{
              minHeight: '44px',
              touchAction: 'manipulation',
              backgroundColor: view === v.id ? 'rgba(61,232,195,0.12)' : 'transparent',
              color: view === v.id ? '#3DE8C3' : '#4a4f65',
              border: view === v.id ? '1px solid rgba(61,232,195,0.3)' : '1px solid transparent',
              textShadow: view === v.id ? '0 0 8px rgba(61,232,195,0.4)' : 'none',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        {view === 'board' && (
          <div className="space-y-5">
            <PeteTasks />
            <div className="min-h-[400px]">
              <KanbanBoard />
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-2 max-w-3xl">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg p-4 flex items-center gap-4"
                style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[task.status] || '#4a4f65' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#e8eaf0' }}>
                    {task.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#4a4f65' }}>
                    {task.assignee || 'Unassigned'} · {task.status}
                    {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{
                    color: PRIORITY_COLORS[task.priority],
                    backgroundColor: `${PRIORITY_COLORS[task.priority]}18`,
                    border: `1px solid ${PRIORITY_COLORS[task.priority]}40`,
                  }}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}

        {view === 'projects' && (
          <div>
            <p className="text-xs mb-4" style={{ color: '#8b92a8' }}>
              {projects.length} total · {inProgress} in progress · {queued} queued
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        {view === 'jobs' && (
          <JobsTable />
        )}
      </div>
    </div>
  );
}
