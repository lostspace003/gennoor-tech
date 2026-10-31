import { getLinkedInState, publishPost, publishVideoPost, resharePost } from '@/lib/linkedin'
import { addFirstComment, repostLine } from '@/lib/linkedin-engage'
import { getDraft, getImage, getMotion, mutateDraft, prepareForPublish } from '@/lib/social/studio'

/**
 * Publishes a draft as a NEW post to one target, the same way the Social studio does, and records it on the draft.
 * Used by the autopilot. `commentary` overrides the text for this target only (the profile gets a different opening).
 */
export async function publishNew(id: string, target: 'member' | 'organization', opts: { commentary?: string; media?: 'gif' | 'video' | 'still'; reshareOf?: string } = {}): Promise<{ urn: string }> {
  const d = await getDraft(id)
  if (!d) throw new Error('Draft not found.')
  const text = (await prepareForPublish((opts.commentary || d.text).trim(), id)).trim()
  if (!text) throw new Error('The post is empty.')
  if (d.kind === 'poll' && (!d.poll?.question.trim() || (d.poll?.options.length ?? 0) < 2)) throw new Error('A poll needs a question and at least 2 options.')

  const s = await getLinkedInState()
  const author = target === 'member' ? s.memberUrn : s.orgUrn
  const token = target === 'member'
    ? (s.accessToken && s.expiresAt && new Date(s.expiresAt) > new Date() ? s.accessToken : '')
    : (s.orgAccessToken && s.orgExpiresAt && new Date(s.orgExpiresAt) > new Date() ? s.orgAccessToken : '')
  if (!author || !token) throw new Error(`LinkedIn ${target === 'member' ? 'profile' : 'company page'} is not connected or its token expired.`)

  // Personal profile reposting the company page post: a short note on top, then the first comment.
  if (opts.reshareOf && target === 'member') {
    const note = (await prepareForPublish(await repostLine(d.text, id), id)).trim()
    const urn = await resharePost({ token, author, parentUrn: opts.reshareOf, commentary: note })
    const c = await addFirstComment({ token, actor: author, postUrn: urn, post: d.text, spendId: id, extra: 'This is a repost of the company page post, so the comment should continue the conversation rather than repeat the page comment.' })
    await mutateDraft(id, x => { x.published.push({ as: target, urn, at: new Date().toISOString(), reshare: true, comment: c.text, commentError: c.error }); x.status = 'published'; x.publishedText = x.text })
    return { urn }
  }

  // Motion graphics post as an animated GIF by default; AI images as a still; polls and text-only posts carry no media.
  const media = opts.media ?? (d.motion ? 'gif' : 'still')
  const video = d.kind !== 'poll' && media === 'video' && d.motion?.hasMp4 ? (await getMotion(id, 'mp4')) || undefined : undefined
  const image = d.kind === 'poll' || video ? undefined : media === 'gif' && d.motion ? (await getMotion(id, 'gif')) || undefined : (d.hasImage ? (await getImage(id)) || undefined : undefined)

  const urn = video
    ? await publishVideoPost({ token, author, commentary: text, video, title: d.topic.slice(0, 200) })
    : await publishPost({ token, author, commentary: text, image, altText: d.topic, poll: d.kind === 'poll' ? d.poll : undefined })
  // Every post gets a meaningful first comment from its own author. A failed comment never fails the post.
  const c = await addFirstComment({ token, actor: author, postUrn: urn, post: text, spendId: id })
  await mutateDraft(id, x => { x.published.push({ as: target, urn, at: new Date().toISOString(), comment: c.text, commentError: c.error }); x.status = 'published'; x.publishedText = x.text })
  return { urn }
}
