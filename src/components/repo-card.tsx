'use client';

import { GitBranch, CircleDot, GitPullRequest, Lock, Archive, ExternalLink } from 'lucide-react';
import { type GithubRepo, languageColor, relativeTime } from '@/lib/github-data';

interface RepoCardProps {
  repo: GithubRepo;
  onSelect: (repo: GithubRepo) => void;
}

export function RepoCard({ repo, onSelect }: RepoCardProps) {
  const isPrivate = repo.visibility === 'private';
  const langColor = languageColor(repo.language);
  const accent = repo.archived ? '#4a4f65' : '#3DE8C3';

  return (
    <button
      type="button"
      onClick={() => onSelect(repo)}
      className="text-left rounded-xl p-4 transition-all duration-200 hover:ring-1 hover:ring-[#2a2d42] focus:outline-none focus:ring-1 focus:ring-[#3DE8C3]/50"
      style={{
        backgroundColor: '#13151c',
        border: '1px solid #1e2030',
        opacity: repo.archived ? 0.65 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {isPrivate && <Lock size={11} style={{ color: '#8b92a8' }} />}
            {repo.archived && <Archive size={11} style={{ color: '#8b92a8' }} />}
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: '#e8eaf0' }}
              title={repo.fullName}
            >
              {repo.name}
            </h3>
          </div>
          {repo.description && (
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: '#8b92a8' }}
            >
              {repo.description}
            </p>
          )}
        </div>
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white/[0.04]"
          style={{ color: '#4a4f65' }}
          title="Open on GitHub"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-3 gap-2 mt-3 py-2 px-2.5 rounded-md"
        style={{ backgroundColor: '#0d0e14', border: '1px solid #1e2030' }}
      >
        <Stat icon={<CircleDot size={11} />} value={repo.openIssueCount} label="issues" color={repo.openIssueCount > 0 ? '#ffaa00' : '#4a4f65'} />
        <Stat icon={<GitPullRequest size={11} />} value={repo.openPRCount} label="PRs" color={repo.openPRCount > 0 ? '#3DE8C3' : '#4a4f65'} />
        <Stat icon={<GitBranch size={11} />} value={repo.branchCount ?? '—'} label="branches" color="#8b92a8" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 min-w-0">
          {repo.language ? (
            <>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span style={{ color: '#8b92a8' }}>{repo.language}</span>
            </>
          ) : (
            <span style={{ color: '#4a4f65' }}>no language</span>
          )}
        </div>
        <span style={{ color: '#4a4f65' }} title={repo.pushedAt}>
          pushed {relativeTime(repo.pushedAt)}
        </span>
      </div>

      {/* Active indicator line */}
      <div
        className="mt-3 h-px"
        style={{
          background: repo.archived
            ? '#1e2030'
            : `linear-gradient(90deg, ${accent}40 0%, transparent 100%)`,
        }}
      />
    </button>
  );
}

function Stat({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span style={{ color }} className="flex-shrink-0">
        {icon}
      </span>
      <span className="text-xs font-bold" style={{ color: '#e8eaf0' }}>
        {value}
      </span>
      <span className="text-[10px] truncate" style={{ color: '#4a4f65' }}>
        {label}
      </span>
    </div>
  );
}
