/**
 * Types for `public/data/github.json` — written by
 * scripts/sync-github-data.mjs via the hourly GitHub Action.
 *
 * Keep this file in sync with the script's output schema.
 */

export interface GithubIssue {
  number: number;
  title: string;
  state: string;
  labels: string[];
  author: string | null;
  createdAt: string;
  updatedAt: string;
  url: string;
  commentCount: number;
}

export interface GithubPR {
  number: number;
  title: string;
  state: string;
  draft: boolean;
  author: string | null;
  head: string | undefined;
  base: string | undefined;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface GithubRepo {
  name: string;
  fullName: string;
  description: string | null;
  visibility: 'public' | 'private' | string;
  archived: boolean;
  defaultBranch: string;
  pushedAt: string;
  updatedAt: string;
  htmlUrl: string;
  openIssueCount: number;
  openPRCount: number;
  branchCount: number | null;
  topics: string[];
  language: string | null;
  issues: GithubIssue[];
  pullRequests: GithubPR[];
}

export interface GithubSummary {
  repoCount: number;
  activeRepoCount: number;
  archivedRepoCount: number;
  openIssueCount: number;
  openPRCount: number;
}

export interface GithubData {
  syncedAt: string;
  owner: string;
  summary: GithubSummary;
  repos: GithubRepo[];
}

/**
 * Format an ISO timestamp as a short relative string ("12m ago", "3h ago").
 * Falls back to a locale date for anything older than 7 days.
 */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '—';
  const diffMs = Date.now() - t;
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Stable color picker for a language string. */
export function languageColor(language: string | null | undefined): string {
  if (!language) return '#4a4f65';
  // A small curated palette matching the dashboard's vibe.
  const known: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Ruby: '#701516',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    PHP: '#4F5D95',
  };
  if (known[language]) return known[language];
  // Hash the name into a hue for stable fallback color.
  let hash = 0;
  for (let i = 0; i < language.length; i += 1) hash = (hash * 31 + language.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 55%)`;
}
