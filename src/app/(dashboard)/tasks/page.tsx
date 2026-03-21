import { KanbanBoard } from '@/components/kanban-board';
import { PeteTasks } from '@/components/pete-tasks';

export default function TasksPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Tasks</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>Action items & kanban board</p>
        </div>
        <button
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[#00d4ff]/10 font-medium"
          style={{ color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          + Add Task
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-5">
        {/* Pete Tasks — always top */}
        <PeteTasks />

        {/* Kanban */}
        <div className="min-h-[400px]">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}
