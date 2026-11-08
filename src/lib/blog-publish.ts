import { sendEmail } from '@/lib/email-service'
import { getLinkedInState, publishArticle, resharePost, saveLinkedInState } from '@/lib/linkedin'
import { addFirstComment, repostLine } from '@/lib/linkedin-engage'
import { loadState as loadAutopilot } from '@/lib/autopilot/live'
import { githubConfigured, getPullRequest, mergePullRequest, openPullRequest, readFile } from '@/lib/github-pr'
import { siteUrl } from '@/lib/tech-call-mail'
import { formatForLinkedIn, HOOK_BULLETS_RULES, LINKEDIN_STYLE_GUIDE } from '@/lib/linkedin-format'
import { blogPostsMeta } from '@/data/blog-posts'
import { contentFile, getBlogDraft, listBlogDrafts, mutateBlogDraft, patchIndex, type BlogDraft } from '@/lib/blog-studio'
import { foundry, readBlob, recordSpend, textUsd, tokensOf, writeBlob } from '@/lib/social/studio'
import type { PipelineDeps, Target } from '@/lib/blog-pipeline'

const TEXT_MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'

export function missingFields(d: BlogDraft): string[] {
  const m = d.meta
  return [!m.title.trim() && 'a title', !m.excerpt.trim() && 'an excerpt', !m.tldr.trim() && 'a TL;DR', !d.body.trim() && 'the article body', !m.category.trim() && 'a category', !m.tags.length && 'at least one tag', !m.faqs.length && 'at least one FAQ'].filter(Boolean) as string[]
}

/**
 * Approved post -> pull request -> (merged straight away when auto-merge is on). The rest of the flow (website live,
 * LinkedIn) is carried on by the pipeline tick, which also survives the site restarting during its own deploy.
 */
export async function submitBlogPost(id: string, opts: { autoMerge: boolean; shareToLinkedIn: boolean }): Promise<BlogDraft> {
  const d = await getBlogDraft(id)
  if (!d) throw new Error('Not found.')
  if (d.status === 'submitted') throw new Error('This post has already been submitted.')
  if (d.status !== 'approved') throw new Error('Approve the post before publishing.')
  const problems = missingFields(d)
  if (problems.length) throw new Error(`Still missing: ${problems.join(', ')}.`)
  if (blogPostsMeta.some(p => p.slug === d.meta.slug)) throw new Error('A published post already uses this slug. Change it.')
  if (!githubConfigured()) throw new Error('GitHub is not connected yet (GITHUB_TOKEN). Use Export to download the file instead.')

  const m = d.meta
  const index = patchIndex(await readFile('src/data/blog-posts/index.ts'), d)
  const pr = await openPullRequest({
    branch: `blog/${m.slug}`.slice(0, 80), title: `Add blog post: ${m.title}`.slice(0, 120),
    body: `New post ${d.auto ? 'written by the daily blog autopilot' : 'approved in the Blog studio'}.\n\n- Category: ${m.category}\n- Tags: ${m.tags.join(', ')}\n- Read time: ${m.readTime}\n- Slug: /resources/blog/${m.slug}\n\nMerging this deploys the post.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)`,
    files: [{ path: `src/data/blog-posts/content/${m.slug}.ts`, content: contentFile(d) }, { path: 'src/data/blog-posts/index.ts', content: index }],
  })
  let merged = false
  let note: string | undefined
  if (opts.autoMerge) {
    try { await mergePullRequest(pr.number, `Add blog post: ${m.title}`.slice(0, 100)); merged = true } catch (e: any) { note = `Could not merge yet: ${String(e?.message || e).slice(0, 160)}` }
  }
  const now = new Date().toISOString()
  return (await mutateBlogDraft(id, x => {
    x.status = 'submitted'; x.pr = pr
    x.pipeline = { stage: merged ? 'merged' : 'pr', autoMerge: opts.autoMerge, shareToLinkedIn: opts.shareToLinkedIn, mergeTries: merged ? 0 : 1, shareTries: {}, ...(merged ? { mergedAt: now } : {}), ...(note ? { note } : {}) }
  }))!
}

/** The Merge button: merges now and moves the flow on. */
export async function mergeBlogPost(id: string): Promise<BlogDraft> {
  const d = await getBlogDraft(id)
  if (!d?.pr || !d.pipeline) throw new Error('This post has no pull request.')
  const pr = await getPullRequest(d.pr.number)
  if (!pr.merged) await mergePullRequest(d.pr.number, `Add blog post: ${d.meta.title}`.slice(0, 100))
  return (await mutateBlogDraft(id, x => { x.pipeline!.stage = 'merged'; x.pipeline!.mergedAt = new Date().toISOString(); x.pipeline!.note = undefined; x.pipeline!.busy = undefined }))!
}

/** Puts a post that needs attention back in the flow (retry sharing, re-check the deploy). */
export async function retryBlogPipeline(id: string): Promise<BlogDraft> {
  return (await mutateBlogDraft(id, x => {
    const p = x.pipeline
    if (!p) return
    p.busy = undefined; p.note = undefined; p.shareTries = {}; p.mergeTries = 0
    p.stage = p.stage === 'attention' ? (x.pr && !p.mergedAt ? 'pr' : p.liveAt ? 'live' : 'merged') : p.stage
  }))!
}

// ---- The short LinkedIn post that carries the blog link --------------------------------------------------------------
export async function shareTexts(d: BlogDraft): Promise<{ page: string; profile: string }> {
  const url = `${siteUrl()}/resources/blog/${d.meta.slug}`
  const tags = d.meta.hashtags.slice(0, 4).join(' ')
  const fallback = formatForLinkedIn(`**${d.meta.title}**\n\n${d.meta.excerpt.slice(0, 260).trim()}\n\n→ Read the full article: ${url}\n\n${tags}`)
  try {
    const j = await foundry('/openai/v1/responses', {
      model: TEXT_MODEL,
      instructions: `You write short LinkedIn posts that bring readers to a new article. Do not "announce" it: lead with the problem the article solves. Write TWO versions as JSON only: {"page": string, "profile": string}.
${HOOK_BULLETS_RULES}
- Exception to the link rule: end both versions with the line "Read the full article: ${url}" just before the hashtags (the link also goes in the first comment).
- "page": for the Gennoor Tech company page, 3-4 bullets taken from the article's key takeaways.
- "profile": the founder's personal version, first person, a different hook on the same problem, same bullets reworded, same link line and hashtags.
Never invent facts beyond the article summary. No hype words. Keep each under 1,300 characters.
${LINKEDIN_STYLE_GUIDE}`,
      input: `Title: ${d.meta.title}\nSummary: ${d.meta.tldr}\nKey takeaways:\n- ${d.meta.keyTakeaways.slice(0, 5).join('\n- ')}\nHashtags: ${tags}`,
    })
    await recordSpend(`blog-${d.id}`, 'LinkedIn share text', textUsd(j), tokensOf(j))
    const out: string = j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('')
    const p = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)) as { page?: string; profile?: string }
    // The link line sits before the hashtags; the formatter moves the hashtags to the end.
    const fix = (s?: string) => { const t = (s || '').trim(); return t.length > 60 ? formatForLinkedIn(t.includes(url) ? t : `${t}\n\n→ Read the full article: ${url}`, { fallbackHashtags: d.meta.hashtags }) : fallback }
    return { page: fix(p.page), profile: fix(p.profile) }
  } catch { return { page: fallback, profile: fallback } }
}

async function alertedToday(key: string): Promise<boolean> {
  const raw = await readBlob('blog/alerted.json')
  const m: Record<string, string> = raw ? JSON.parse(raw.toString('utf-8')) : {}
  const today = new Date().toISOString().slice(0, 10)
  if (m[key] === today) return true
  m[key] = today
  for (const k of Object.keys(m)) if (m[k] < new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)) delete m[k]
  await writeBlob('blog/alerted.json', JSON.stringify(m), 'application/json')
  return false
}

export async function sendAdminAlert(subject: string, html: string, key: string) {
  if (await alertedToday(key)) return
  try {
    await sendEmail({ from: process.env.EMAIL_FROM_INFO || 'info@gennoor.com', to: process.env.EMAIL_ADMIN || 'admin@gennoor.com', subject: `[Gennoor blog] ${subject}`, html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">${html}<p style="color:#666;font-size:12px">Manage this in the Blog studio of the admin centre.</p></div>` })
  } catch (e) { console.error('blog alert email failed', e) }
}

export function liveBlogPipelineDeps(): PipelineDeps {
  return {
    now: () => new Date(),
    list: async () => (await listBlogDrafts()).filter(d => d.status === 'submitted' && d.pipeline),
    update: (id, fn) => mutateBlogDraft(id, fn),
    getPr: n => getPullRequest(n),
    merge: (n, title) => mergePullRequest(n, title),
    isLive: async slug => {
      const r = await fetch(`${siteUrl()}/resources/blog/${slug}`, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15_000), headers: { 'User-Agent': 'GennoorBlogPipeline/1.0' } })
      return r.status === 200
    },
    linkedinReady: async () => {
      const s = await getLinkedInState()
      return {
        member: !!s.accessToken && !!s.memberUrn && !!s.expiresAt && new Date(s.expiresAt) > new Date(),
        organization: !!s.orgUrn && !!s.orgAccessToken && !!s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date(),
      }
    },
    share: async (d, target: Target) => {
      const s = await getLinkedInState()
      const author = target === 'member' ? s.memberUrn : s.orgUrn
      const token = target === 'member' ? s.accessToken : s.orgAccessToken
      if (!author || !token) throw new Error('not connected')
      const cached = d.shareText ?? (await shareTexts(d))
      if (!d.shareText) await mutateBlogDraft(d.id, x => { x.shareText = cached })
      const url = `${siteUrl()}/resources/blog/${d.meta.slug}`
      const pageUrn = d.shared?.organization?.urn
      const reshare = target === 'member' && !!pageUrn && ((await loadAutopilot().catch(() => null))?.config.profileMode ?? 'reshare') === 'reshare'
      let urn: string
      if (reshare) {
        // The profile reposts the company page post with a short note of its own.
        urn = await resharePost({ token, author, parentUrn: pageUrn!, commentary: await repostLine(cached.page, `blog-${d.id}`) })
      } else {
        urn = await publishArticle({ token, author, commentary: target === 'member' ? cached.profile : cached.page, url, title: d.meta.title, description: d.meta.excerpt.slice(0, 250) })
      }
      // Every share gets a meaningful first comment from its author. A failed comment never fails the share.
      const c = await addFirstComment({ token, actor: author, postUrn: urn, post: `${d.meta.title}
${d.meta.tldr}
Key points: ${d.meta.keyTakeaways.slice(0, 4).join('; ')}`, spendId: `blog-${d.id}`, link: { label: 'Full article', url }, extra: `This is for a blog article on ${url}. Add a detail or question that is NOT already in the post; do not mention the link (it is appended).` })
      if (c.error) console.error('blog first comment failed', c.error)
      // Recorded where the LinkedIn page already looks, so it shows up there too.
      const st = await getLinkedInState()
      st.shares = st.shares || {}
      st.shares[d.meta.slug] = [...(st.shares[d.meta.slug] || []), { urn, as: target, at: new Date().toISOString(), by: 'blog pipeline' }]
      await saveLinkedInState(st)
      return { urn }
    },
    alert: sendAdminAlert,
  }
}
