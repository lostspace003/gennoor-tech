import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import type { LmsCourse, LmsItem, LmsQuizBank } from '@/lib/lms'
import { parseAbout } from '@/lib/lms-about'
import { inferKind, inferPlatform, inferTopics, KINDS } from '@/lib/lms-taxonomy'

/**
 * Admin course importer. Takes a container SAS URL for a Course Factory course
 * (the one that holds "... Upload package/course.json" plus the lecture videos),
 * builds the LMS manifest, and copies every referenced blob into this site's own
 * LMS storage with server-side copies - the bytes never pass through the web
 * app, and the SAS is used only for this import (it is never stored).
 */

const base = (p: string) => String(p).split(/[\\/]/).pop() || ''

export function parseSasUrl(sasUrl: string): { container: string; account: string; url: URL } {
  let url: URL
  try {
    url = new URL(sasUrl.trim())
  } catch {
    throw new Error('That is not a valid URL')
  }
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.blob.core.windows.net')) {
    throw new Error('Use the container SAS URL from Azure Storage (https://<account>.blob.core.windows.net/<container>?...)')
  }
  const container = url.pathname.replace(/^\/+|\/+$/g, '')
  if (!container || container.includes('/')) throw new Error('The SAS URL must point at a container, not a folder or file')
  if (!url.searchParams.get('sig')) throw new Error('The URL has no SAS token (sig=...)')
  return { container, account: url.hostname.split('.')[0], url }
}

export function blobSource(sasUrl: URL, blobName: string): string {
  const u = new URL(sasUrl.toString())
  u.pathname = `${u.pathname.replace(/\/+$/, '')}/${blobName.split('/').map(encodeURIComponent).join('/')}`
  return u.toString()
}

function lectureRes(name: string) {
  return /\.pdf$/i.test(name) || /(lab files|student files)\.zip$/i.test(name)
}

export interface ImportResult {
  course: LmsCourse & { published: boolean }
  quizzes: LmsQuizBank
  /** blob names (in the source container) that must exist in the destination */
  blobs: string[]
  /** blobs copied under a different name (thumbnail, promo) */
  renamed: { from: string; to: string }[]
}

export async function buildCourseFromContainer(
  sasUrl: string,
  slugIn?: string,
  opts: { vendor?: string; kind?: string; topics?: string[]; domains?: string[] } = {},
): Promise<ImportResult & { source: ContainerClient; sourceUrl: URL }> {
  const { container, url } = parseSasUrl(sasUrl)
  const source = new ContainerClient(sasUrl.trim())

  // Course Factory containers also hold raw recordings and work files (tens of
  // thousands of blobs). Only the "... Udemy ..." folders matter, so list
  // those and nothing else.
  const names: string[] = []
  const prefixes: string[] = []
  for await (const item of source.listBlobsByHierarchy('/')) {
    if (item.kind === 'prefix') {
      if (/udemy/i.test(item.name) && !/screenshots/i.test(item.name)) prefixes.push(item.name)
    } else if (/course\.json$/i.test(item.name)) names.push(item.name)
  }
  for (const prefix of prefixes) {
    for await (const b of source.listBlobsFlat({ prefix })) names.push(b.name)
  }
  const byBase = new Map<string, string>()
  for (const n of names) {
    const b = base(n)
    // First hit wins, but never let a replaced/backup folder shadow the real file.
    if (!byBase.has(b) || (/replaced|_expand|_voice/i.test(byBase.get(b)!) && !/replaced|_expand|_voice/i.test(n))) byBase.set(b, n)
  }

  const jsonName = names.find(n => /upload package\/course\.json$/i.test(n)) || names.find(n => /(^|\/)course\.json$/i.test(n))
  if (!jsonName) throw new Error('No course.json found in that container (expected "<course> Udemy - Upload package/course.json")')
  const raw = JSON.parse((await source.getBlobClient(jsonName).downloadToBuffer()).toString('utf8').replace(/^﻿/, ''))

  const slug = (slugIn || container).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!slug) throw new Error('Could not derive a course slug')

  const missing: string[] = []
  const need = (name: string): string | null => {
    const hit = byBase.get(base(name))
    if (!hit) missing.push(name)
    return hit ?? null
  }

  // ---- course copy (two course.json shapes in the wild) ----
  let aboutSource = ''
  let meta: Pick<LmsCourse, 'title' | 'subtitle' | 'level' | 'description' | 'outcomes' | 'requirements' | 'audience' | 'instructor' | 'topics'>
  if (raw.course) {
    const c = raw.course
    aboutSource = String(c.description_text || '')
    meta = {
      title: c.title,
      subtitle: c.subtitle || '',
      level: c.level || '',
      description: String(c.description_text || '').split(/\n{2,}|\n(?=[A-Z])/).map((s: string) => s.trim()).filter(Boolean),
      outcomes: c.what_you_will_learn || [],
      requirements: c.requirements || [],
      audience: c.who_this_course_is_for || [],
      instructor: c.instructor_headline || '',
      topics: c.topics || [],
    }
  } else {
    const text: string = raw.landing || ''
    const block = (head: string, next?: RegExp) => {
      const a = text.indexOf(head)
      if (a < 0) return ''
      const rest = text.slice(a + head.length)
      const b = next ? rest.search(next) : -1
      return b < 0 ? rest : rest.slice(0, b)
    }
    const bullets = (s: string) => s.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim())
    const title = (block('COURSE TITLE', /\n\s*\n/).split('\n').map(l => l.trim()).filter(l => l && !/^\[|^-+$/.test(l))[0] || '').replace(/\s*\[\d+\/\d+\]$/, '')
    const subtitle = (block('COURSE SUBTITLE', /\n\s*\n/).split('\n').map(l => l.trim()).filter(l => l && !/^-+$/.test(l))[0] || '').replace(/\s*\[\d+\/\d+\]$/, '')
    aboutSource = block('COURSE DESCRIPTION  (headings in bold)', /\nWHAT STUDENTS WILL LEARN/)
    meta = {
      title: title || raw.code || slug,
      subtitle,
      level: /Level:\s*(\w+)/.exec(text)?.[1] || '',
      description: block('COURSE DESCRIPTION  (headings in bold)', /\nWHAT STUDENTS WILL LEARN/).split(/\n{2,}/).map(x => x.trim().replace(/\*\*/g, '').replace(/^[-=\s]+/, '')).filter(x => x && !x.startsWith('- ')),
      outcomes: bullets(block('WHAT STUDENTS WILL LEARN', /\nREQUIREMENTS/)),
      requirements: bullets(block('REQUIREMENTS', /\nWHO THIS COURSE IS FOR/)),
      audience: bullets(block('WHO THIS COURSE IS FOR', /\nPREVIEW LECTURES/)),
      instructor: '',
      topics: [],
    }
  }

  // ---- sections ----
  const quizzes: LmsQuizBank = {}
  const blobs = new Set<string>()
  let n = 0
  let lectures = 0
  let quizCount = 0
  const sections = (raw.sections as any[]).map(sec => ({
    title: String(sec.title).trim(),
    items: (sec.items as any[]).map((it): LmsItem => {
      n += 1
      const id = `i${String(n).padStart(3, '0')}`
      if (it.type === 'quiz') {
        quizCount += 1
        const qs = (it.questions || []).map((q: any) => ({
          question: q.question,
          answers: q.answers,
          correct: q.correct_index ?? q.correct,
          explanation: q.explanation || '',
        }))
        const pass = it.pass_percent ?? 70
        quizzes[id] = { title: it.title, passPercent: pass, questions: qs }
        return { id, type: 'quiz', title: it.title, description: it.description || '', questionCount: qs.length, passPercent: pass }
      }
      lectures += 1
      const videoName = base(typeof it.video === 'string' ? it.video : it.video?.path || '')
      const video = need(videoName) || ''
      if (video) blobs.add(video)
      const cap = byBase.get(videoName.replace(/\.mp4$/i, '.vtt')) || null
      if (cap) blobs.add(cap)
      const resources = ((it.resources || []) as any[])
        .map(r => (typeof r === 'string' ? r : r.name) as string)
        .filter(lectureRes)
        .map(name => ({ name, blob: need(name) }))
        .filter((r): r is { name: string; blob: string } => !!r.blob)
      resources.forEach(r => blobs.add(r.blob))
      return {
        id,
        type: 'lecture',
        kind: it.kind || (/demo/i.test(it.title) ? 'demo' : 'lecture'),
        title: it.title,
        description: it.description || '',
        preview: !!it.free_preview,
        video,
        caption: cap,
        resources,
      }
    }),
  }))

  // Lecture length = end of the last caption cue (the manifest has no video metadata).
  const toSec = (t: string) => t.split(':').map(Number).reduce((a, v) => a * 60 + v, 0)
  const lecturesWithCaption = sections.flatMap(s => s.items).filter((i): i is Extract<LmsItem, { type: 'lecture' }> => i.type === 'lecture' && !!i.caption)
  const q = [...lecturesWithCaption]
  await Promise.all(Array.from({ length: 12 }, async () => {
    for (let it = q.pop(); it; it = q.pop()) {
      try {
        const txt = (await source.getBlobClient(it.caption as string).downloadToBuffer()).toString('utf8')
        const ends = [...txt.matchAll(/-->\s*([\d:.]+)/g)].map(m => toSec(m[1]))
        if (ends.length) it.durationSec = Math.ceil(Math.max(...ends))
      } catch { /* no duration for this one */ }
    }
  }))

  const missingVideos = missing.filter(m => /\.mp4$/i.test(m))
  if (missingVideos.length) {
    throw new Error(`${missingVideos.length} lecture videos referenced by course.json are not in the container (first: ${missingVideos[0]})`)
  }

  // Course image + promo video, when the package has them. Shown on cards and the course page.
  const renamed: { from: string; to: string }[] = []
  const thumb =
    names.find(n => /upload package\/images\/[^/]*1500x844\.png$/i.test(n)) ||
    names.find(n => /upload package\/images\/[^/]*\.(png|jpe?g)$/i.test(n))
  if (thumb) renamed.push({ from: thumb, to: `_public/thumbnail${/\.jpe?g$/i.test(thumb) ? '.jpg' : '.png'}` })
  const promo = names.find(n => /(^|\/)(promo|trailer)[^/]*\.mp4$/i.test(n) && !/\bb\d\d|clip|footage|raw/i.test(base(n)))
  if (promo) renamed.push({ from: promo, to: '_public/promo.mp4' })

  const course = {
    slug,
    code: (raw.code || slug).toString().toUpperCase(),
    container: slug,
    ...meta,
    about: parseAbout(aboutSource),
    vendor: opts.vendor || inferPlatform(`${raw.code || ''} ${meta.title}`),
    kind: KINDS.some(k => k.id === opts.kind) ? opts.kind : inferKind(`${raw.code || ''} ${meta.title}`),
    topics_tags: opts.topics && opts.topics.length ? opts.topics : inferTopics(`${meta.title} ${meta.subtitle} ${meta.outcomes.join(' ')}`),
    domains: opts.domains || [],
    ...(thumb ? { thumbnail: renamed.find(r => r.from === thumb)!.to } : {}),
    ...(promo ? { promo: '_public/promo.mp4' } : {}),
    stats: { sections: sections.length, lectures, quizzes: quizCount },
    sections,
    published: false,
  } as LmsCourse & { published: boolean }

  return { course, quizzes, blobs: [...blobs], renamed, source, sourceUrl: url }
}

/**
 * Start server-side copies of the course blobs into <slug> in LMS storage.
 * Idempotent: blobs already present with the same size are skipped.
 */
export async function copyCourseBlobs(opts: {
  connectionString: string
  slug: string
  sourceUrl: URL
  source: ContainerClient
  blobs: string[]
  renamed?: { from: string; to: string }[]
}) {
  const dest = BlobServiceClient.fromConnectionString(opts.connectionString).getContainerClient(opts.slug)
  await dest.createIfNotExists()

  let started = 0
  let skipped = 0
  const failed: string[] = []
  const queue = [...opts.blobs, ...(opts.renamed || []).map(r => `${r.from}\u0000${r.to}`)]
  const worker = async () => {
    for (let entry = queue.pop(); entry; entry = queue.pop()) {
      const [name, destName = name] = entry.split('\u0000')
      try {
        const srcProps = await opts.source.getBlobClient(name).getProperties()
        const d = dest.getBlobClient(destName)
        const existing = await d.getProperties().catch(() => null)
        if (existing && existing.contentLength === srcProps.contentLength && existing.copyStatus !== 'pending') {
          skipped += 1
          continue
        }
        await d.beginCopyFromURL(blobSource(opts.sourceUrl, name))
        started += 1
      } catch {
        failed.push(name)
      }
    }
  }
  await Promise.all(Array.from({ length: 12 }, worker))
  return { started, skipped, failed }
}

/** Copy progress of an imported course: how many of its blobs have landed. */
export async function copyStatus(connectionString: string, slug: string, expected: string[]) {
  const dest = BlobServiceClient.fromConnectionString(connectionString).getContainerClient(slug)
  const state = new Map<string, string>()
  try {
    for await (const b of dest.listBlobsFlat({ includeCopy: true })) state.set(b.name, b.properties.copyStatus || 'success')
  } catch {
    // container not created yet
  }
  let success = 0
  let pending = 0
  let failed = 0
  for (const n of expected) {
    const s = state.get(n)
    if (!s) continue
    if (s === 'success') success += 1
    else if (s === 'pending') pending += 1
    else failed += 1
  }
  return { total: expected.length, success, pending, failed, missing: expected.length - success - pending - failed }
}
