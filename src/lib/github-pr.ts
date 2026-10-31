// Minimal GitHub client: create a branch, commit files to it, open a pull request. Needs GITHUB_TOKEN
// (a fine-grained token with Contents + Pull requests write on the repo); GITHUB_REPO defaults to this site's repo.
const REPO = process.env.GITHUB_REPO || 'lostspace003/gennoor-tech'
const BASE = process.env.GITHUB_BASE_BRANCH || 'main'

export const githubConfigured = () => !!process.env.GITHUB_TOKEN

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const j: any = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.message ? `GitHub: ${j.message}` : `GitHub returned ${res.status}`)
  return j
}

export interface PrInfo { state: 'open' | 'closed'; merged: boolean; mergeable: boolean | null; url: string }
export async function getPullRequest(number: number): Promise<PrInfo> {
  const j = await gh(`/pulls/${number}`)
  return { state: j.state, merged: !!j.merged, mergeable: j.mergeable, url: j.html_url }
}

/** Squash-merges a pull request. Throws with GitHub's reason when it cannot (conflict, branch rules, not yet mergeable). */
export async function mergePullRequest(number: number, title: string): Promise<void> {
  await gh(`/pulls/${number}/merge`, { method: 'PUT', body: JSON.stringify({ merge_method: 'squash', commit_title: `${title} (#${number})` }) })
}

export async function readFile(path: string, ref = BASE): Promise<string> {
  const j = await gh(`/contents/${path}?ref=${encodeURIComponent(ref)}`)
  return Buffer.from(j.content, 'base64').toString('utf-8')
}

/** Commits the given files to a new branch off main and opens a PR. Existing files are updated, new ones created. */
export async function openPullRequest(opts: { branch: string; title: string; body: string; files: { path: string; content: string }[] }) {
  if (!githubConfigured()) throw new Error('GitHub is not connected (GITHUB_TOKEN is not set).')
  const base = await gh(`/git/ref/heads/${BASE}`)
  await gh('/git/refs', { method: 'POST', body: JSON.stringify({ ref: `refs/heads/${opts.branch}`, sha: base.object.sha }) })
  for (const f of opts.files) {
    let sha: string | undefined
    try { sha = (await gh(`/contents/${f.path}?ref=${encodeURIComponent(opts.branch)}`)).sha } catch { /* new file */ }
    await gh(`/contents/${f.path}`, { method: 'PUT', body: JSON.stringify({ message: opts.title, content: Buffer.from(f.content).toString('base64'), branch: opts.branch, ...(sha ? { sha } : {}) }) })
  }
  const pr = await gh('/pulls', { method: 'POST', body: JSON.stringify({ title: opts.title, head: opts.branch, base: BASE, body: opts.body }) })
  return { url: pr.html_url as string, number: pr.number as number, branch: opts.branch }
}
