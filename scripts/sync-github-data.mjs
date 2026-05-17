#!/usr/bin/env node
/**
 * sync-github-data.mjs
 *
 * Pulls live GitHub state for the configured owner and writes it to
 * public/data/github.json. Used by .github/workflows/sync-github-data.yml.
 *
 * Output schema is intentionally flat + cheap-to-render. Frontend reads this
 * file directly (no API call at render time).
 *
 * Env:
 *   GITHUB_TOKEN  — required. PAT or workflow token.
 *   GITHUB_OWNER  — optional, defaults to 'peterluke101'.
 *
 * No deps — pure Node 20 fetch.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const OWNER = process.env.GITHUB_OWNER || 'peterluke101';
const TOKEN = process.env.GITHUB_TOKEN;
const OUT = join(process.cwd(), 'public', 'data', 'github.json');
const MAX_REPOS = 100;
const MAX_ISSUES_PER_REPO = 30;
const MAX_PRS_PER_REPO = 20;

if (!TOKEN) {
  console.error('FATAL: GITHUB_TOKEN not set');
  process.exit(1);
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'mission-control-sync',
};

async function gh(path, params = {}) {
  const url = new URL(`https://api.github.com${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GH ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function pickIssue(i) {
  // GitHub API returns PRs in the issues endpoint too — caller filters.
  return {
    number: i.number,
    title: i.title,
    state: i.state,
    labels: (i.labels || []).map((l) => (typeof l === 'string' ? l : l.name)),
    author: i.user?.login || null,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
    url: i.html_url,
    commentCount: i.comments,
  };
}

function pickPR(p) {
  return {
    number: p.number,
    title: p.title,
    state: p.state,
    draft: p.draft,
    author: p.user?.login || null,
    head: p.head?.ref,
    base: p.base?.ref,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    url: p.html_url,
  };
}

async function fetchRepoDetails(repo) {
  const fullName = `${OWNER}/${repo.name}`;
  // Issues endpoint returns both issues and PRs; filter PRs out.
  const issuesRaw = await gh(`/repos/${fullName}/issues`, {
    state: 'open',
    per_page: String(MAX_ISSUES_PER_REPO),
  });
  const issues = issuesRaw.filter((i) => !i.pull_request).map(pickIssue);

  const prs = (
    await gh(`/repos/${fullName}/pulls`, {
      state: 'open',
      per_page: String(MAX_PRS_PER_REPO),
    })
  ).map(pickPR);

  // Branch count via cheap HEAD call (List branches w/ per_page=1, read Link header).
  let branchCount = null;
  try {
    const url = new URL(`https://api.github.com/repos/${fullName}/branches`);
    url.searchParams.set('per_page', '1');
    const res = await fetch(url, { headers });
    if (res.ok) {
      const link = res.headers.get('link') || '';
      const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
      branchCount = m ? Number(m[1]) : (await res.json()).length;
    }
  } catch {
    /* branchCount stays null */
  }

  return {
    name: repo.name,
    fullName,
    description: repo.description,
    visibility: repo.visibility || (repo.private ? 'private' : 'public'),
    archived: repo.archived,
    defaultBranch: repo.default_branch,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    htmlUrl: repo.html_url,
    openIssueCount: issues.length,
    openPRCount: prs.length,
    branchCount,
    topics: repo.topics || [],
    language: repo.language,
    issues,
    pullRequests: prs,
  };
}

async function main() {
  console.log(`Fetching repo list for owner=${OWNER}...`);
  const repos = await gh(`/users/${OWNER}/repos`, {
    per_page: String(MAX_REPOS),
    sort: 'pushed',
    direction: 'desc',
  });

  console.log(`Found ${repos.length} repos. Fetching details...`);
  const detailed = [];
  for (const r of repos) {
    if (r.archived) {
      // Keep archived repos visible but skip the expensive issue/PR fetch.
      detailed.push({
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        visibility: r.visibility || (r.private ? 'private' : 'public'),
        archived: true,
        defaultBranch: r.default_branch,
        pushedAt: r.pushed_at,
        updatedAt: r.updated_at,
        htmlUrl: r.html_url,
        openIssueCount: 0,
        openPRCount: 0,
        branchCount: null,
        topics: r.topics || [],
        language: r.language,
        issues: [],
        pullRequests: [],
      });
      continue;
    }
    try {
      detailed.push(await fetchRepoDetails(r));
      process.stdout.write('.');
    } catch (err) {
      console.error(`\n  skipping ${r.name}: ${err.message}`);
    }
  }
  console.log();

  const totalIssues = detailed.reduce((n, r) => n + r.openIssueCount, 0);
  const totalPRs = detailed.reduce((n, r) => n + r.openPRCount, 0);
  const activeCount = detailed.filter((r) => !r.archived).length;

  const out = {
    syncedAt: new Date().toISOString(),
    owner: OWNER,
    summary: {
      repoCount: detailed.length,
      activeRepoCount: activeCount,
      archivedRepoCount: detailed.length - activeCount,
      openIssueCount: totalIssues,
      openPRCount: totalPRs,
    },
    repos: detailed,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf-8');
  console.log(
    `Wrote ${OUT}: ${detailed.length} repos, ${totalIssues} open issues, ${totalPRs} open PRs.`,
  );
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
