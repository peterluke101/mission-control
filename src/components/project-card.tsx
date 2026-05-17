import { type Project } from '@/lib/data';

const STATUS_COLORS: Record<Project['status'], string> = {
  'In Progress': '#ffaa00',
  'Queued': '#8b92a8',
  'Complete': '#00ff88',
  'On Hold': '#ff4466',
};

// Extra metadata for specific projects
const PROJECT_META: Record<string, { owner?: string; team?: string[]; metrics?: { label: string; value: string }[] }> = {
  'proj-4': {
    owner: 'Ares',
    metrics: [
      { label: 'Proposals Submitted', value: '1' },
      { label: 'Awarded', value: '0' },
      { label: 'Revenue', value: '$0' },
    ],
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const statusColor = STATUS_COLORS[project.status];
  const meta = PROJECT_META[project.id];

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200 hover:ring-1 hover:ring-[#2a2d42]"
      style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-1" style={{ color: '#e8eaf0' }}>
            {project.name}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: '#8b92a8' }}>
            {project.description}
          </p>
        </div>
        <span
          className="flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            color: statusColor,
            backgroundColor: `${statusColor}18`,
            border: `1px solid ${statusColor}40`,
          }}
        >
          {project.status}
        </span>
      </div>

      {/* Progress bar — HUD Style */}
      <div className="mb-3 hud-bar-container">
        <div className="flex items-center justify-between mb-1.5">
          <span className="hud-label">
            {project.progress > 0 ? 'PROGRESS....' : 'PROGRESS'}
          </span>
          <span className="text-[11px] hud-pct">
            {project.progress}%
          </span>
        </div>
        <div className="h-[6px] hud-bar-track">
          <div
            className="h-full hud-bar-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Key Metrics */}
      {meta?.metrics && (
        <div
          className="flex gap-4 mb-3 py-2.5 px-3 rounded-lg"
          style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
        >
          {meta.metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#4a4f65' }}>
                {m.label}
              </span>
              <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
            style={{ backgroundColor: '#1e2030', color: '#3DE8C3' }}
          >
            {project.lead.charAt(0)}
          </div>
          <span className="text-xs" style={{ color: '#8b92a8' }}>{project.lead}</span>
          {meta?.team && (
            <div className="flex items-center gap-1 ml-1">
              {meta.team.map((member) => (
                <div
                  key={member}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold -ml-1 first:ml-0"
                  style={{ backgroundColor: '#1e2030', color: '#8b92a8', border: '1px solid #0d0e14' }}
                  title={member}
                >
                  {member.charAt(0)}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: '#1e2030', color: '#8b92a8' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {project.dueDate && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #1e2030' }}>
          <span className="text-xs" style={{ color: '#4a4f65' }}>
            Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      )}
    </div>
  );
}
