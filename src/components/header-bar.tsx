'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Radio, Search, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useJobsStore } from '@/lib/jobs-store';

interface SearchResult {
  type: 'task' | 'project' | 'document' | 'person' | 'job';
  id: string;
  title: string;
  sub: string;
  href: string;
}

export function HeaderBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const tasks = useAppStore((s) => s.tasks);
  const projects = useAppStore((s) => s.projects);
  const documents = useAppStore((s) => s.documents);
  const team = useAppStore((s) => s.team);
  const jobs = useJobsStore((s) => s.jobs);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).toUpperCase()
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
        setTypeFilter(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const getResults = useCallback((): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    if (!typeFilter || typeFilter === 'task') {
      tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
        .forEach((t) => results.push({ type: 'task', id: t.id, title: t.title, sub: `${t.status} · ${t.assignee || 'Unassigned'}`, href: '/work' }));
    }
    if (!typeFilter || typeFilter === 'project') {
      projects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        .forEach((p) => results.push({ type: 'project', id: p.id, title: p.name, sub: `${p.status} · ${p.lead}`, href: '/work' }));
    }
    if (!typeFilter || typeFilter === 'document') {
      documents.filter((d) => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q))
        .forEach((d) => results.push({ type: 'document', id: d.id, title: d.title, sub: `${d.category} · ${d.agent || '—'}`, href: '/documents' }));
    }
    if (!typeFilter || typeFilter === 'person') {
      team.filter((t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q))
        .forEach((t) => results.push({ type: 'person', id: t.id, title: t.name, sub: t.role, href: '/team' }));
    }
    if (!typeFilter || typeFilter === 'job') {
      jobs.filter((j) => j.title.toLowerCase().includes(q))
        .forEach((j) => results.push({ type: 'job', id: j.id, title: j.title, sub: `${j.platform} · ${j.status}`, href: '/work' }));
    }

    return results.slice(0, 12);
  }, [query, typeFilter, tasks, projects, documents, team, jobs]);

  const results = getResults();

  const typeColors: Record<string, string> = {
    task: '#ffaa00',
    project: '#3DE8C3',
    document: '#00ff88',
    person: '#a78bfa',
    job: '#f0b429',
  };

  function handleResultClick(result: SearchResult) {
    setSearchOpen(false);
    setQuery('');
    setTypeFilter(null);
    router.push(result.href);
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 md:px-5 h-11"
        style={{
          backgroundColor: 'rgba(10, 11, 15, 0.96)',
          borderBottom: '1px solid #1e2030',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Left: Mission name */}
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: '#3DE8C3' }} />
          <span
            className="text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase"
            style={{ color: '#3DE8C3', textShadow: '0 0 8px rgba(61,232,195,0.5)' }}
          >
            MC
            <span className="hidden md:inline"> — Mission Control</span>
          </span>
          <span
            className="text-[10px] font-mono tracking-widest ml-1 hidden md:inline"
            style={{ color: '#2a2d42', fontWeight: 600 }}
          >
            v3.0
          </span>
        </div>

        {/* Center: Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1 rounded-md transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(30,32,48,0.6)',
            border: '1px solid #2a2d42',
            color: '#4a4f65',
            touchAction: 'manipulation',
            minHeight: '28px',
          }}
        >
          <Search size={12} />
          <span className="text-[11px] font-mono hidden md:inline">Search...</span>
          <kbd className="text-[9px] font-mono px-1 py-0.5 rounded hidden md:inline" style={{ backgroundColor: '#1e2030', color: '#4a4f65' }}>
            K
          </kbd>
        </button>

        {/* Mobile: small green dot indicator */}
        <div className="md:hidden flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full status-dot-active"
            style={{ backgroundColor: '#00ff88' }}
          />
          <span className="text-[9px] font-mono font-semibold uppercase" style={{ color: '#00ff88' }}>
            OK
          </span>
        </div>

        {/* Right: System clock */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className="system-clock hidden md:inline" style={{ color: '#4a4f65' }}>{date}</span>
          <span
            className="system-clock font-semibold tabular-nums text-[10px] md:text-xs"
            style={{ color: '#8b92a8', minWidth: '3.5rem', textAlign: 'right' }}
          >
            {time}
          </span>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false);
              setQuery('');
              setTypeFilter(null);
            }
          }}
        >
          <div
            className="w-full max-w-lg mx-4 rounded-xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#0d0e14', border: '1px solid #2a2d42' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #1e2030' }}>
              <Search size={16} style={{ color: '#4a4f65' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, docs, projects, people, jobs..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#e8eaf0' }}
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(''); setTypeFilter(null); }}
                className="p-1 rounded transition-colors"
                style={{ color: '#4a4f65', touchAction: 'manipulation', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Type filters */}
            <div className="flex gap-1 px-4 py-2" style={{ borderBottom: '1px solid #1e2030' }}>
              {[null, 'task', 'document', 'project', 'person', 'job'].map((t) => (
                <button
                  key={t ?? 'all'}
                  onClick={() => setTypeFilter(t)}
                  className="px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all"
                  style={{
                    minHeight: '32px',
                    touchAction: 'manipulation',
                    backgroundColor: typeFilter === t ? 'rgba(61,232,195,0.12)' : 'transparent',
                    color: typeFilter === t ? '#3DE8C3' : '#4a4f65',
                    border: typeFilter === t ? '1px solid rgba(61,232,195,0.3)' : '1px solid transparent',
                  }}
                >
                  {t ?? 'All'}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto">
              {query.trim() && results.length === 0 && (
                <div className="p-6 text-center text-sm" style={{ color: '#4a4f65' }}>
                  No results found
                </div>
              )}
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => handleResultClick(r)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/[0.03]"
                  style={{ borderBottom: '1px solid #1e2030', touchAction: 'manipulation', minHeight: '44px' }}
                >
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0"
                    style={{
                      backgroundColor: `${typeColors[r.type]}15`,
                      color: typeColors[r.type],
                      border: `1px solid ${typeColors[r.type]}35`,
                    }}
                  >
                    {r.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#e8eaf0' }}>{r.title}</p>
                    <p className="text-[11px] truncate" style={{ color: '#4a4f65' }}>{r.sub}</p>
                  </div>
                </button>
              ))}
              {!query.trim() && (
                <div className="p-6 text-center text-sm" style={{ color: '#4a4f65' }}>
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
