'use client';

import { useAppStore } from '@/lib/store';
import { ProjectCard } from '@/components/project-card';

export default function ProjectsPage() {
  const projects = useAppStore((s) => s.projects);
  const inProgress = projects.filter((p) => p.status === 'In Progress').length;
  const queued = projects.filter((p) => p.status === 'Queued').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Projects</h1>
          <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>
            {projects.length} total · {inProgress} in progress · {queued} queued
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
