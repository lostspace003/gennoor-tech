import { BlobServiceClient, ContainerClient } from '@azure/storage-blob'
import type { LmsCourse, LmsItem, LmsQuizBank } from '@/lib/lms'
import { parseAbout } from '@/lib/lms-about'
import { parseSasUrl, blobSource } from '@/lib/lms-import'
import { KEYS_CONTAINER, hlsContainer } from '@/lib/lms-hls'

/**
 * Reader for the "Learning Studio package" the Course Factory builds (Stage 4):
 *   <CODE> Studio/studio.json + hls/<id>/* + keys/<id>.key + captions/ + docs/ + _public/
 * Each part goes where the player expects it:
 *   hls/*      -> container <slug>-hls          (encrypted pieces)
 *   keys/*     -> container lms-keys, <slug>/   (private)
 *   the rest   -> container <slug>
 */

export interface CopyEntry { from: string; container: string; to: string }

export interface StudioPackage {
  course: LmsCourse & { published: boolean }
  quizzes: LmsQuizBank
  entries: CopyEntry[]
  source: ContainerClient
  sourceUrl: URL
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')

/** Returns null when the container holds no Studio package (older packages are handled by the classic importer). */
export async function readStudioPackage(sasUrl: string, slugIn?: string): Promise<StudioPackage | null> {
  const { container, url } = parseSasUrl(sasUrl)
  const source = new ContainerClient(sasUrl.trim())

  let base: string | null = null
  for await (const item of source.listBlobsByHierarchy('/')) {
    if (item.kind === 'blob' && item.name === 'studio.json') { base = ''; break }
    if (item.kind === 'prefix' && /studio\/$/i.test(item.name) && (await source.getBlobClient(`${item.name}studio.json`).exists())) {
      base = item.name
      break
    }
  }
  if (base === null) return null

  const raw = JSON.parse((await source.getBlobClient(`${base}studio.json`).downloadToBuffer()).toString('utf8').replace(/^﻿/, ''))
  if (raw.format !== 'learning-studio-package') throw new Error('studio.json is not a Learning Studio package')

  const slug = slugify(slugIn || raw.slug || container)
  if (!slug) throw new Error('Could not derive a course slug')

  const quizzes: LmsQuizBank = {}
  let lectures = 0
  let quizCount = 0
  const sections = (raw.sections as any[]).map(sec => ({
    title: String(sec.title).trim(),
    items: (sec.items as any[]).map((it): LmsItem => {
      if (it.type === 'quiz') {
        quizCount += 1
        quizzes[it.id] = { title: it.title, passPercent: it.passPercent ?? 70, questions: it.questions }
        return { id: it.id, type: 'quiz', title: it.title, description: it.description || '', questionCount: it.questions.length, passPercent: it.passPercent ?? 70 }
      }
      lectures += 1
      return {
        id: it.id,
        type: 'lecture',
        kind: it.kind || 'lecture',
        title: it.title,
        description: it.description || '',
        preview: false,
        video: '',
        caption: it.caption || null,
        durationSec: it.durationSec || undefined,
        resources: (it.resources || []).map((r: any) => ({ name: r.name, blob: r.path })),
      }
    }),
  }))

  const about = parseAbout(String(raw.about || ''))
  const entries: CopyEntry[] = []
  const hls = hlsContainer(slug)
  for await (const b of source.listBlobsFlat({ prefix: base })) {
    const rel = b.name.slice(base.length)
    if (rel.startsWith('hls/')) entries.push({ from: b.name, container: hls, to: rel.slice(4) })
    else if (rel.startsWith('keys/')) entries.push({ from: b.name, container: KEYS_CONTAINER, to: `${slug}/${rel.slice(5)}` })
    else if (/^(captions|docs|_public)\//.test(rel)) entries.push({ from: b.name, container: slug, to: rel })
  }

  const course = {
    slug,
    code: String(raw.code || slug).toUpperCase(),
    container: slug,
    title: raw.title,
    subtitle: raw.subtitle || '',
    level: raw.level || '',
    description: about.filter(b => b.t === 'lead' || b.t === 'p').map(b => (b as { text: string }).text),
    about,
    outcomes: raw.outcomes || [],
    requirements: raw.requirements || [],
    audience: raw.audience || [],
    instructor: raw.instructor || '',
    topics: [],
    topics_tags: raw.topics || [],
    domains: raw.domains || [],
    vendor: raw.platform || 'Vendor-neutral',
    kind: raw.kind || 'course',
    track: raw.track || '',
    protected: true,
    thumbnail: raw.thumbnail || undefined,
    promo: raw.promo || undefined,
    badge: raw.badge || undefined,
    congrats: raw.congrats || undefined,
    stats: { sections: sections.length, lectures, quizzes: quizCount },
    sections,
    published: false,
    packageFiles: entries.length,
  } as unknown as LmsCourse & { published: boolean }

  return { course, quizzes, entries, source, sourceUrl: url }
}

/**
 * Start server-side copies, resumable: stops when the time budget is spent and
 * says how many are left; calling again carries on (already-copied files are skipped).
 */
export async function copyEntries(opts: {
  connectionString: string
  entries: CopyEntry[]
  source: ContainerClient
  sourceUrl: URL
  budgetMs?: number
}) {
  const svc = BlobServiceClient.fromConnectionString(opts.connectionString)
  const containers = new Map<string, ContainerClient>()
  const dest = async (name: string) => {
    let c = containers.get(name)
    if (!c) {
      c = svc.getContainerClient(name)
      await c.createIfNotExists()
      containers.set(name, c)
    }
    return c
  }

  // What is already there, per container, so finished files cost no requests.
  const existing = new Map<string, number>()
  for (const name of new Set(opts.entries.map(e => e.container))) {
    for await (const b of (await dest(name)).listBlobsFlat({ includeCopy: true })) {
      if ((b.properties.copyStatus || 'success') !== 'failed') existing.set(`${name}/${b.name}`, b.properties.contentLength ?? -1)
    }
  }

  const deadline = Date.now() + (opts.budgetMs ?? 240_000)
  const queue = opts.entries.filter(e => !existing.has(`${e.container}/${e.to}`))
  let started = 0
  let failed = 0
  const worker = async () => {
    while (Date.now() < deadline) {
      const e = queue.pop()
      if (!e) return
      try {
        await (await dest(e.container)).getBlobClient(e.to).beginCopyFromURL(blobSource(opts.sourceUrl, e.from))
        started += 1
      } catch {
        failed += 1
      }
    }
  }
  await Promise.all(Array.from({ length: 16 }, worker))
  return { started, skipped: opts.entries.length - queue.length - started - failed, failed, remaining: queue.length }
}

/** How many of the course's files have landed (success), are still copying, or failed. */
export async function studioCopyStatus(connectionString: string, course: LmsCourse & { packageFiles?: number }) {
  const svc = BlobServiceClient.fromConnectionString(connectionString)
  const total = course.packageFiles ?? 0
  let success = 0
  let pending = 0
  let failed = 0
  const count = async (container: string, prefix?: string) => {
    try {
      for await (const b of svc.getContainerClient(container).listBlobsFlat({ includeCopy: true, prefix })) {
        if (container === course.slug && !/^(captions|docs|_public)\//.test(b.name)) continue
        const s = b.properties.copyStatus || 'success'
        if (s === 'success') success += 1
        else if (s === 'pending') pending += 1
        else failed += 1
      }
    } catch {
      // container not created yet
    }
  }
  await count(hlsContainer(course.slug))
  await count(KEYS_CONTAINER, `${course.slug}/`)
  await count(course.slug)
  return { total, success, pending, failed, missing: Math.max(0, total - success - pending - failed) }
}
