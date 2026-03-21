import { teamMembers } from '@/lib/data';
import { AgentStatusCard } from '@/components/agent-status-card';

export default function AgentsPage() {
  const allAgents = teamMembers;
  const activeCount = allAgents.filter((a) => a.status === 'Active' || a.status === 'Busy').length;
  const standbyCount = allAgents.filter((a) => a.status === 'Standby').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <h1 className="text-lg font-semibold" style={{ color: '#e8eaf0' }}>Agents</h1>
        <p className="text-xs mt-0.5" style={{ color: '#8b92a8' }}>
          {allAgents.length} agents · {activeCount} active · {standbyCount} standby
        </p>
      </div>

      {/* Stats row */}
      <div
        className="flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        {[
          { label: 'Total', value: allAgents.length, color: '#e8eaf0' },
          { label: 'Active', value: allAgents.filter(a => a.status === 'Active').length, color: '#00ff88' },
          { label: 'Busy', value: allAgents.filter(a => a.status === 'Busy').length, color: '#ffaa00' },
          { label: 'Standby', value: allAgents.filter(a => a.status === 'Standby').length, color: '#8b92a8' },
        ].map((stat) => (
          <div key={stat.label} className="px-4 md:px-6 py-3" style={{ backgroundColor: '#0a0b0f' }}>
            <p className="text-xs" style={{ color: '#8b92a8' }}>{stat.label}</p>
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {allAgents.map((agent) => (
            <AgentStatusCard key={agent.id} member={agent} />
          ))}
        </div>
      </div>
    </div>
  );
}
