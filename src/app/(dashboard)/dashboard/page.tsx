'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Crown, Shield, Sparkles } from 'lucide-react';

type GoalTask = { title: string; status: string; owner?: string };
type GoalNode = {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'blocked' | 'paused' | 'todo';
  priority?: 'critical' | 'high' | 'medium' | 'low';
  progress?: number;
  owner?: string;
  deadline?: string | null;
  blockedBy?: string;
  subgoals?: GoalNode[];
  tasks?: GoalTask[];
};

type TeamPerson = { id: string; name: string; role: string; status: string; currentTask: string; lastActive: string; model: string };
type ActivityEntry = { id: string; type: 'system' | 'agent' | 'error' | 'pet'; agent: string; message: string; timestamp: string };

const statusStyles: Record<string, string> = {
  active: 'text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/10',
  completed: 'text-[#3DE8C3] border-[#3DE8C3]/30 bg-[#3DE8C3]/10',
  blocked: 'text-[#ff5d5d] border-[#ff5d5d]/30 bg-[#ff5d5d]/10',
  paused: 'text-[#ffaa00] border-[#ffaa00]/30 bg-[#ffaa00]/10',
  todo: 'text-[#8b92a8] border-[#2a2d42] bg-[#13151c]',
};

function fmt(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function Node({ node, depth = 0 }: { node: GoalNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasKids = (node.subgoals?.length || 0) + (node.tasks?.length || 0) > 0;
  return (
    <div className={depth ? 'pl-3 border-l border-white/5' : ''}>
      <button onClick={() => hasKids && setOpen(!open)} className="w-full text-left rounded-xl p-3 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-start gap-2">
          {hasKids ? (open ? <ChevronDown size={16} className="mt-0.5 text-[#3DE8C3]" /> : <ChevronRight size={16} className="mt-0.5 text-[#3DE8C3]" />) : <span className="w-4" />}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-sm text-[#e8eaf0]">{node.title}</h3>
              {node.owner && <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-[#3DE8C3]/25 text-[#3DE8C3]">{node.owner}</span>}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusStyles[node.status]}`}>{node.status}</span>
            </div>
            {node.blockedBy && <p className="text-xs mt-1 text-[#ff8787]">Blocked by: {node.blockedBy}</p>}
            {typeof node.progress === 'number' && <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden"><div className="h-full rounded-full bg-[#3DE8C3]" style={{ width: `${node.progress}%` }} /></div>}
          </div>
        </div>
      </button>
      {open && hasKids && (
        <div className="mt-2 space-y-2">
          {node.subgoals?.map((child) => <Node key={child.id} node={child} depth={depth + 1} />)}
          {node.tasks?.map((task, idx) => (
            <div key={`${task.title}-${idx}`} className="ml-7 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-xs text-[#c9cfde] flex items-center justify-between gap-3">
              <span>{task.title}</span>
              <span className="text-[10px] text-[#8b92a8] uppercase tracking-[0.18em]">{task.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'goals' | 'activity' | 'org'>('goals');
  const [goals, setGoals] = useState<GoalNode[]>([]);
  const [mission, setMission] = useState('');
  const [team, setTeam] = useState<TeamPerson[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => { (async () => { const r = await fetch('/data/goals.json'); const j = await r.json(); setMission(j.mission); setGoals(j.goals || []); })(); }, []);
  useEffect(() => { (async () => { const r = await fetch('/data/team.json'); const j = await r.json(); setTeam(j.people || []); })(); }, []);
  useEffect(() => { (async () => { const r = await fetch('/data/activity.json'); const j = await r.json(); setActivity(j.entries || []); })(); }, []);

  const totalProgress = useMemo(() => {
    const vals = goals.map((g) => g.progress || 0);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [goals]);

  return (
    <div className="h-full overflow-y-auto bg-[#0a0b0f] text-[#e8eaf0]">
      <div className="px-4 md:px-6 py-4 border-b border-[#1e2030] flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#3DE8C3] font-mono">HQ — Paperclip Upgrades</div>
          <h1 className="mt-1 text-xl font-semibold">Goals, activity, and org chart</h1>
          <p className="text-sm text-[#8b92a8]">{mission}</p>
        </div>
        <div className="rounded-xl border border-[#3DE8C3]/20 bg-[#3DE8C3]/10 px-3 py-2 text-right min-w-[120px]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#3DE8C3]">Average progress</div>
          <div className="text-2xl font-semibold text-[#3DE8C3]">{totalProgress}%</div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-[#0a0b0f]/95 backdrop-blur border-b border-[#1e2030] px-4 md:px-6 py-3 flex gap-2">
        {([['goals', 'Goals Tab'], ['activity', 'Activity Feed'], ['org', 'Org Chart']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm border transition ${tab === key ? 'border-[#3DE8C3]/40 bg-[#3DE8C3]/10 text-[#3DE8C3]' : 'border-white/5 bg-white/[0.02] text-[#8b92a8]'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 md:p-6">
        {tab === 'goals' && <div className="space-y-4">{goals.map((goal) => <Node key={goal.id} node={goal} />)}</div>}

        {tab === 'activity' && (
          <div className="rounded-2xl border border-white/5 bg-[#13151c] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 text-sm text-[#3DE8C3]"><Sparkles size={16} /> Live audit log</div>
            <div className="divide-y divide-white/5">
              {activity.map((entry) => (
                <div key={entry.id} className="px-4 py-3 flex gap-3 items-start">
                  <div className={`mt-1 h-2.5 w-2.5 rounded-full ${entry.type === 'system' ? 'bg-[#3DE8C3]' : entry.type === 'error' ? 'bg-[#ff5d5d]' : 'bg-[#00ff88]'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-sm">{entry.agent}</span>
                      <span className="text-[11px] text-[#8b92a8]">{fmt(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm text-[#c9cfde]">{entry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'org' && (
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/5 bg-[#13151c] p-4 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 text-[#3DE8C3]"><Crown size={16} /> Org chart</div>
              <div className="space-y-4 min-w-[320px]">
                {team.slice(0, 2).map((person) => (
                  <div key={person.id} className="rounded-xl border border-white/5 bg-black/20 p-3">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-xs text-[#8b92a8]">{person.role}</div>
                      </div>
                      <div className="text-right text-xs text-[#8b92a8]">
                        <div>{person.status}</div>
                        <div>{person.model}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-[#c9cfde]">{person.currentTask}</div>
                  </div>
                ))}
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {team.slice(2).map((person) => (
                    <div key={person.id} className="rounded-xl border border-white/5 bg-black/20 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-sm">{person.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${person.status === 'offline' ? 'border-white/10 text-[#8b92a8]' : 'border-[#3DE8C3]/20 text-[#3DE8C3]'}`}>{person.status}</span>
                      </div>
                      <div className="text-xs text-[#8b92a8]">{person.role}</div>
                      <div className="mt-2 text-sm text-[#c9cfde]">{person.currentTask}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#13151c] p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#3DE8C3]"><Shield size={16} /> Status notes</div>
              <div className="text-sm text-[#c9cfde]">Pete sits at the top, Ares below, then the live builders. Mothballed agents stay dimmed at the bottom.</div>
              <div className="text-sm text-[#8b92a8]">Mobile stacks vertically; desktop shows the hierarchy and the connections without crowding the screen.</div>
              <div className="rounded-xl border border-[#3DE8C3]/15 bg-[#3DE8C3]/10 p-3 text-sm text-[#3DE8C3]">Theme locked to dark surfaces, mint teal accents, and Inter/system typography.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
