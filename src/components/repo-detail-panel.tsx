'use client';

import { useEffect } from 'react';
import {
  X,
  CircleDot,
  GitPullRequest,
  ExternalLink,
  GitBranch,
  MessageSquare,
} from 'lucide-react';
import { type GithubRepo, relativeTime, languageColor } from '@/lib/github-data';

interface RepoDetailPanelProps {
  repo: GithubRepo | null;
  onClose: () => void;
}

export function RepoDetailPanel({ repo, onClose }: RepoDetailPanelProps) {
  // ESC-to-close.
  useEffect(() => {
    if (!repo) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [repo, onClose]);

  if (!repo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: 'rgba(5,6,10,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="flex-1" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl h-full overflow-y-auto flex flex-col"
        style={{
          backgroundColor: '#0d0e14',
          borderLeft: '1px solid #1e2030',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-5 py-4 flex items-start justify-between gap-3"
          style={{ borderBottom: '1px solid #1e2030' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-semibold truncate" style={{ color: '#e8eaf0' }}>
                {repo.name}
              </h2>
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white/[0.04]"
                style={{ color: '#4a4f65' }}
              >
                <ExternalLink size={13} />
              </a>
            </div>
            <p className="text-xs" style={{ color: '#8b92a8' }}>
              {repo.fullName} ·{' '}
              <span style={{ color: '#4a4f65' }}>{repo.visibility}</span>
              {repo.archived && (
                <span className="ml-1.5" style={{ color: '#ffaa00' }}>
                  · archived
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded transition-colors hover:bg-white/[0.04]"
            style={{ color: '#8b92a8' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Metadata strip */}
        <div
          className="flex-shrink-0 px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono"
          style={{ borderBottom: '1px solid #1e2030' }}
        >
          <Meta label="Default" value={repo.defaultBranch} icon={<GitBranch size={11} />} />
          <Meta label="Branches" value={repo.branchCount ?? '—'} />
          <Meta
            label="Language"
            value={
              repo.language ? (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                  />
                  {repo.language}
                </span>
              ) : (
                '—'
              )
            }
          />
          <Meta label="Last push" value={relativeTime(repo.pushedAt)} />
        </div>

        {repo.description && (
          <div
            className="flex-shrink-0 px-5 py-3 text-sm"
            style={{ color: '#c4c9d9', borderBottom: '1px solid #1e2030' }}
          >
            {repo.description}
          </div>
        )}

        {repo.topics.length > 0 && (
          <div
            className="flex-shrink-0 px-5 py-3 flex flex-wrap gap-1.5"
            style={{ borderBottom: '1px solid #1e2030' }}
          >
            {repo.topics.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded font-mono"
                style={{ backgroundColor: '#1e2030', color: '#8b92a8' }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Issues */}
        <Section
          title="Open Issues"
          count={repo.openIssueCount}
          icon={<CircleDot size={12} />}
          accent="#ffaa00"
        >
          {repo.issues.length === 0 ? (
            <Empty text="No open issues." />
          ) : (
            <ul className="space-y-1.5">
              {repo.issues.map((issue) => (
                <li
                  key={`issue-${issue.number}`}
                  className="rounded-md px-3 py-2"
                  style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
                >
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="text-[10px] font-mono mt-0.5 flex-shrink-0"
                        style={{ color: '#4a4f65' }}
                      >
                        #{issue.number}
                      </span>
                      <span
                        className="text-sm group-hover:text-[#3DE8C3] transition-colors flex-1"
                        style={{ color: '#e8eaf0' }}
                      >
                        {issue.title}
                      </span>
                      {issue.commentCount > 0 && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-mono flex-shrink-0"
                          style={{ color: '#8b92a8' }}
                        >
                          <MessageSquare size={10} />
                          {issue.commentCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono" style={{ color: '#4a4f65' }}>
                        {issue.author || 'unknown'} · {relativeTime(issue.updatedAt)}
                      </span>
                      {issue.labels.map((l) => (
                        <span
                          key={l}
                          className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                          style={{
                            backgroundColor: '#1e2030',
                            color: '#8b92a8',
                          }}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* PRs */}
        <Section
          title="Open Pull Requests"
          count={repo.openPRCount}
          icon={<GitPullRequest size={12} />}
          accent="#3DE8C3"
        >
          {repo.pullRequests.length === 0 ? (
            <Empty text="No open pull requests." />
          ) : (
            <ul className="space-y-1.5">
              {repo.pullRequests.map((pr) => (
                <li
                  key={`pr-${pr.number}`}
                  className="rounded-md px-3 py-2"
                  style={{ backgroundColor: '#13151c', border: '1px solid #1e2030' }}
                >
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="text-[10px] font-mono mt-0.5 flex-shrink-0"
                        style={{ color: '#4a4f65' }}
                      >
                        #{pr.number}
                      </span>
                      <span
                        className="text-sm group-hover:text-[#3DE8C3] transition-colors flex-1"
                        style={{ color: '#e8eaf0' }}
                      >
                        {pr.title}
                      </span>
                      {pr.draft && (
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-mono flex-shrink-0"
                          style={{
                            backgroundColor: 'rgba(139,146,168,0.15)',
                            color: '#8b92a8',
                            border: '1px solid rgba(139,146,168,0.3)',
                          }}
                        >
                          draft
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[10px] font-mono" style={{ color: '#4a4f65' }}>
                      {pr.author || 'unknown'} · {pr.head} → {pr.base} ·{' '}
                      {relativeTime(pr.updatedAt)}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function Meta({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: '#4a4f65' }}>
        {label}
      </p>
      <p
        className="text-xs mt-1 flex items-center gap-1.5"
        style={{ color: '#e8eaf0' }}
      >
        {icon && <span style={{ color: '#8b92a8' }}>{icon}</span>}
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  count,
  icon,
  accent,
  children,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-4" style={{ borderBottom: '1px solid #1e2030' }}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: accent }}>{icon}</span>
        <h3
          className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase"
          style={{ color: '#e8eaf0' }}
        >
          {title}
        </h3>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="text-xs italic" style={{ color: '#4a4f65' }}>
      {text}
    </p>
  );
}
