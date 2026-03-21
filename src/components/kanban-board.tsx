'use client';

import { useAppStore } from '@/lib/store';
import { type Task } from '@/lib/data';

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'Backlog', label: 'Backlog', color: '#8b92a8' },
  { id: 'In Progress', label: 'In Progress', color: '#ffaa00' },
  { id: 'Review', label: 'Review', color: '#00d4ff' },
  { id: 'Done', label: 'Done', color: '#00ff88' },
];

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  Low: '#8b92a8',
  Medium: '#00d4ff',
  High: '#ffaa00',
  Critical: '#ff4466',
};

function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className="rounded-lg p-3 transition-all duration-200 hover:ring-1 hover:ring-[#2a2d42] cursor-pointer"
      style={{ backgroundColor: '#0a0b0f', border: '1px solid #1e2030' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium leading-tight" style={{ color: '#e8eaf0' }}>
          {task.title}
        </p>
        <span
          className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium"
          style={{
            color: PRIORITY_COLORS[task.priority],
            backgroundColor: `${PRIORITY_COLORS[task.priority]}18`,
            border: `1px solid ${PRIORITY_COLORS[task.priority]}40`,
          }}
        >
          {task.priority}
        </span>
      </div>
      <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8b92a8' }}>
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        {task.assignee && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: '#1e2030', color: '#00d4ff' }}
            >
              {task.assignee.charAt(0)}
            </div>
            <span className="text-xs" style={{ color: '#8b92a8' }}>{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <span className="text-xs" style={{ color: '#4a4f65' }}>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const tasks = useAppStore((s) => s.tasks);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full overflow-y-auto md:overflow-y-hidden">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="md:flex-1 md:min-w-[200px] flex flex-col">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-t-lg mb-2"
              style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
              <span
                className="text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                style={{ backgroundColor: '#1e2030', color: '#8b92a8' }}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {colTasks.length === 0 && (
                <div
                  className="rounded-lg py-6 flex items-center justify-center border-dashed"
                  style={{ border: '1px dashed #1e2030' }}
                >
                  <span className="text-xs" style={{ color: '#4a4f65' }}>Empty</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
