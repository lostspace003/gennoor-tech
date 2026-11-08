import { foundry, recordSpend, textUsd, tokensOf } from '@/lib/social/studio'
import { commentOnPost } from '@/lib/linkedin'

const MODEL = process.env.FOUNDRY_POST_MODEL || process.env.FOUNDRY_WEB_MODEL || 'gpt-5.4'

const textOf = (j: any): string => (j.output_text || (j.output || []).flatMap((o: any) => o.content || []).map((c: any) => c.text || '').join('') || '').trim()

async function ask(instructions: string, input: string, spendId: string, label: string): Promise<string> {
  const j = await foundry('/openai/v1/responses', { model: MODEL, instructions, input })
  await recordSpend(spendId, label, textUsd(j), tokensOf(j))
  return textOf(j)
}

/** The short line the personal profile puts on top of a repost of the company page post: 1-2 sentences, first person. */
export async function repostLine(post: string, spendId: string): Promise<string> {
  const fallback = 'Sharing this from the Gennoor Tech page. Worth a read if this is on your roadmap.'
  try {
    const t = await ask('Write the short note a founder puts on top of a repost of their company\'s LinkedIn post. First person, 1-2 sentences, under 220 characters, plain and specific to the post (say why it matters to IT teams). No hashtags, no emojis, no links, no hype words. Return the note only.', post.slice(0, 2500), spendId, 'Repost line')
    return t.length >= 20 && t.length <= 300 ? t : fallback
  } catch { return fallback }
}

/** A first comment that adds something: a practical next step, a question to practitioners, or one useful detail. Never "Great post". */
export async function firstComment(post: string, spendId: string, extra = ''): Promise<string> {
  const fallback = 'What is the first place your team would try this? Curious how others are approaching it.'
  try {
    const t = await ask('Write the FIRST COMMENT for this LinkedIn post, written by its author. It must be meaningful on its own: add one concrete extra detail, a practical next step, or a specific question that practitioners can answer from experience. 1-3 sentences, under 280 characters, plain text, no hashtags, no emojis, no "great post"-style filler, no repeating the post. Return the comment only.', `${extra ? `${extra}\n\n` : ''}${post.slice(0, 2500)}`, spendId, 'First comment')
    return t.length >= 25 && t.length <= 600 ? t : fallback
  } catch { return fallback }
}

/** Posts the first comment. Never throws: a failed comment must not cause the post to be retried (and published twice). */
export async function addFirstComment(o: { token: string; actor: string; postUrn: string; post: string; spendId: string; extra?: string; link?: { label: string; url: string } }): Promise<{ text: string; error?: string }> {
  const said = await firstComment(o.post, o.spendId, o.extra)
  // The reference link lives in the first comment (the post body stays clean).
  const text = o.link?.url ? `${said}

🔗 ${o.link.label}: ${o.link.url}` : said
  try { await commentOnPost({ token: o.token, actor: o.actor, postUrn: o.postUrn, text }); return { text } } catch (e: any) { return { text, error: String(e?.message || e).slice(0, 200) } }
}
