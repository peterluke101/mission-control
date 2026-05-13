'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Github, AlertCircle } from 'lucide-react';
import { RepoCard } from '@/components/repo-card';
import { RepoDetailPanel } from '@/components/repo-detail-panel';
import {
  type GithubData,
  type GithubRepo,
  relativeTime,
} from '@/lib/github-data';

type SortMode = 'recent' | 'issues' | 'prs' | 'name';

const SORTS: { id: SortMode; label: string }[] = [
  { id: 'recent', label: 'Recent' },
  { id: 'issues', label: 'Most Issues' },
  { id: 'prs', label: 'Most PRs' },
  { id: 'name', label: 'A–Z' },
];

export default function ReposPage() {
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [hideArchived, setHideArchived] = useState<boolean>(true);
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>('recent');
  const [selected, setSelected] = useState<GithubRepo | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Cache-bust so a freshly synced github.json shows up promptly.
      const res = await fetch(`/data/github.json?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as GithubData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load github.json');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const languages = useMemo(() => {
    if (!data) return [] as string[];
    const counts = new Map<string, number>();
    for (const r of data.repos) {
      if (!r.language) continue;
      if (hideArchived && r.archived) continue;
      counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  }, [data, hideArchived]);

  const filtered = useMemo(() => {
    if (!data) return [] as GithubRepo[];
    const q = search.trim().toLowerCase();
    let list = data.repos.filter((r) => {
      if (hideArchived && r.archived) return false;
      if (activeLang && r.language !== activeLang) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'issues':
          return b.openIssueCount - a.openIssueCount;
        case 'prs':
          return b.openPRCount - a.openPRCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
      }
    });
    return list;
  }, [data, search, hideArchived, activeLang, sort]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div className="min-w-0">
          <h1
            className="text-sm font-mono font-bold tracking-[0.15em] uppercase flex items-center gap-2"
            style={{ color: '#e8eaf0' }}
          >
            <Github size={14} style={{ color: '#3DE8C3' }} />
            Repos &amp; Issues
          </h1>
          <p className="text-[11px] mt-0.5 font-mono" style={{ color: '#4a4f65' }}>
            {data
              ? `${data.summary.repoCount} repos · synced ${relativeTime(data.syncedAt)}`
              : 'loading…'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-mono transition-colors hover:bg-white/[0.04] disabled:opacity-50"
            style={{
              color: '#8b92a8',
              border: '1px solid #1e2030',
              minHeight: '36px',
            }}
            aria-label="Refresh"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* LIVE pill */}
          {data && !error && (
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
              style={{
                backgroundColor: 'rgba(0,255,136,0.05)',
                border: '1px solid rgba(0,255,136,0.15)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full status-dot-active"
                style={{ backgroundColor: '#00ff88' }}
              />
              <span className="font-mono text-[10px]" style={{ color: '#00ff88' }}>
                LIVE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex-shrink-0 grid grid-cols-2 md:grid-cols-5 gap-px"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        {[
          { label: 'Repos', value: data?.summary.repoCount ?? '—', color: '#e8eaf0' },
          { label: 'Active', value: data?.summary.activeRepoCount ?? '—', color: '#00ff88' },
          { label: 'Archived', value: data?.summary.archivedRepoCount ?? '—', color: '#8b92a8' },
          { label: 'Open Issues', value: data?.summary.openIssueCount ?? '—', color: '#ffaa00' },
          { label: 'Open PRs', value: data?.summary.openPRCount ?? '—', color: '#3DE8C3' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-4 md:px-6 py-2.5"
            style={{ backgroundColor: '#0a0b0f' }}
          >
            <p className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>
              {stat.label}
            </p>
            <p className="text-lg font-bold font-mono" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div
        className="flex-shrink-0 px-4 md:px-6 py-3 flex flex-col gap-2"
        style={{ borderBottom: '1px solid #1e2030' }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md flex-1 min-w-[180px] max-w-xs"
            style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
          >
            <Search size={12} style={{ color: '#4a4f65' }} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repos, descriptions, topics…"
              className="flex-1 bg-transparent text-xs outline-none placeholder:opacity-50"
              style={{ color: '#e8eaf0' }}
            />
          </div>

          {/* Sort toggle */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                className="px-2.5 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-wider flex-shrink-0 transition-colors"
                style={{
                  minHeight: '36px',
                  backgroundColor: sort === s.id ? 'rgba(61,232,195,0.12)' : 'transparent',
                  color: sort === s.id ? '#3DE8C3' : '#4a4f65',
                  border:
                    sort === s.id
                      ? '1px solid rgba(61,232,195,0.3)'
                      : '1px solid transparent',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Archived toggle */}
          <label className="flex items-center gap-1.5 text-[11px] font-mono cursor-pointer select-none ml-auto">
            <input
              type="checkbox"
              checked={hideArchived}
              onChange={(e) => setHideArchived(e.target.checked)}
              className="accent-[#3DE8C3]"
            />
            <span style={{ color: '#8b92a8' }}>Hide archived</span>
          </label>
        </div>

        {/* Language chips */}
        {languages.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveLang(null)}
              className="px-2 py-0.5 rounded text-[10px] font-mono transition-colors"
              style={{
                backgroundColor: activeLang === null ? 'rgba(61,232,195,0.12)' : '#1e2030',
                color: activeLang === null ? '#3DE8C3' : '#8b92a8',
                border:
                  activeLang === null
                    ? '1px solid rgba(61,232,195,0.3)'
                    : '1px solid #1e2030',
              }}
            >
              all
            </button>
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(activeLang === lang ? null : lang)}
                className="px-2 py-0.5 rounded text-[10px] font-mono transition-colors"
                style={{
                  backgroundColor:
                    activeLang === lang ? 'rgba(61,232,195,0.12)' : '#1e2030',
                  color: activeLang === lang ? '#3DE8C3' : '#8b92a8',
                  border:
                    activeLang === lang
                      ? '1px solid rgba(61,232,195,0.3)'
                      : '1px solid #1e2030',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5">
        {error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-md mb-4 text-xs"
            style={{
              backgroundColor: 'rgba(255,68,102,0.08)',
              border: '1px solid rgba(255,68,102,0.3)',
              color: '#ff4466',
            }}
          >
            <AlertCircle size={12} />
            <span>
              Couldn&apos;t load <code>/data/github.json</code> — {error}. The hourly sync
              Action seeds this file; check the Actions tab.
            </span>
          </div>
        )}

        {loading && !data && (
          <p className="text-xs font-mono" style={{ color: '#4a4f65' }}>
            Loading github.json…
          </p>
        )}

        {data && filtered.length === 0 && (
          <p className="text-xs font-mono" style={{ color: '#4a4f65' }}>
            No repos match the current filters.
          </p>
        )}

        {data && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl">
            {filtered.map((r) => (
              <RepoCard key={r.fullName} repo={r} onSelect={setSelected} />
            ))}
          </div>
        )}
      </div>

      <RepoDetailPanel repo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
