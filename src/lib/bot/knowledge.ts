import type { SiteChunk } from './store'
import crypto from 'crypto'

import { allCoursePdfs } from '@/data/course-pdfs'
import { allPrograms } from '@/data/training-programs'
import { courses as academyCourses } from '@/data/academy/courses'
import { pocs } from '@/data/pocs'
import { caseStudies } from '@/data/case-studies'
import { certifications, mctStatus } from '@/data/certifications'
import { industries } from '@/data/industries'
import { functions as businessFunctions } from '@/data/functions'
import { upcomingWebinars, pastWebinars } from '@/data/webinars'

/**
 * Structured knowledge for the site bot — everything a visitor might ask
 * about, taken from the source data rather than from crawled HTML.
 *
 * The crawler already reads every public page, but rendered pages are a poor
 * substitute for the underlying data: course pages don't print all 8 modules
 * and their topics, the POC catalogue doesn't render its timelines and price
 * bands, and case studies show a summary rather than the full approach. A
 * visitor asking "how long does a fraud detection build take and what does it
 * cost?" should get the real answer, so we index the source.
 *
 * These chunks carry stable synthetic URLs pointing at the page a reader
 * should land on, so citations still work.
 *
 * Public content only. Nothing here touches leads, emails or anything internal.
 */

const hash = (s: string) => crypto.createHash('sha1').update(s).digest('hex')

const clean = (s: unknown): string =>
  String(s ?? '').replace(/\s+/g, ' ').trim()

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

interface Source {
  url: string
  title: string
  /** Chunked at write time if long; kept whole when it reads as one answer. */
  body: string
}

/** Split long bodies so one giant course never crowds out everything else. */
const MAX_CHARS = 2600

function toChunks(sources: Source[], tag: string): SiteChunk[] {
  const out: SiteChunk[] = []
  for (const s of sources) {
    const text = clean(s.body)
    if (text.length < 80) continue
    const pageHash = hash(`${tag}|${s.url}|${text}`)
    if (text.length <= MAX_CHARS) {
      out.push({ id: hash(`${s.url}|0|${text}`), url: s.url, title: s.title, text, hash: pageHash })
      continue
    }
    for (let i = 0, n = 0; i < text.length && n < 8; i += MAX_CHARS - 250, n++) {
      const piece = text.slice(i, i + MAX_CHARS)
      out.push({
        id: hash(`${s.url}|${n}|${piece}`),
        url: s.url,
        title: n === 0 ? s.title : `${s.title} (part ${n + 1})`,
        text: piece,
        hash: pageHash,
      })
    }
  }
  return out
}

// ── Courses (full catalogue content, incl. every module and topic) ────────
function courseCatalogSources(): Source[] {
  return allCoursePdfs.map((c) => ({
    url: `/services/training/curriculum/${c.slug}`,
    title: `${c.title} — course`,
    body: [
      `${c.title}. ${c.subtitle}`,
      `Track: ${c.trackLabel}. Duration: ${c.duration}.`,
      `Who it is for: ${c.audience}`,
      c.requirements ? `Requirements: ${c.requirements}` : '',
      c.outcomes?.length ? `What you will be able to do: ${c.outcomes.join('; ')}` : '',
      c.modules?.length
        ? `Modules: ${c.modules.map((m) => `${m.number} ${m.title} (${(m.topics || []).join(', ')})`).join(' | ')}`
        : '',
      c.aiEnablementSummary ? `How this fits AI enablement: ${c.aiEnablementSummary}` : '',
      c.aiEnablementPhases?.length
        ? `Enablement journey: ${c.aiEnablementPhases.map((p) => `${p.phase} — ${p.action}`).join('; ')}`
        : '',
      c.pilotPriceBand ? `Indicative pilot price band: ${c.pilotPriceBand}.` : '',
      c.pilotTimeline ? `Pilot timeline: ${c.pilotTimeline}.` : '',
    ].filter(Boolean).join('\n'),
  }))
}

// ── Delivery catalogue (bootcamps + short courses) ────────────────────────
function programSources(): Source[] {
  return allPrograms.map((p) => ({
    url: `/services/training/${slugify(p.title)}`,
    title: `${p.title} — ${p.category}`,
    body: [
      `${p.title}: ${p.description}`,
      `Format: ${p.category}, ${p.duration}, level ${p.level}.`,
      `Audience: ${p.audience}.`,
      `Technology: ${p.technology}. Industry focus: ${p.industry}.`,
      p.certCode ? `Prepares for certification ${p.certCode}.` : p.certification === 'Yes' ? 'Includes certification preparation.' : '',
      p.highlights?.length ? `Covers: ${p.highlights.join('; ')}.` : '',
      p.modules?.length ? `Modules: ${p.modules.join('; ')}.` : '',
    ].filter(Boolean).join('\n'),
  }))
}

// ── Academy self-paced courses ────────────────────────────────────────────
function academySources(): Source[] {
  return academyCourses.map((c) => ({
    url: `/academy/courses/${c.slug}`,
    title: `${c.title} — Gennoor Academy`,
    body: [
      `${c.title}. ${c.subtitle || ''}`,
      c.hookSentence || '',
      `Track: ${c.track}. Level: ${c.level}. Duration: ${c.duration}. Format: self-paced online.`,
      c.audience?.length ? `For: ${c.audience.join(', ')}.` : '',
      c.functions?.length ? `Business functions: ${c.functions.join(', ')}.` : '',
      c.industries?.length ? `Industries: ${c.industries.join(', ')}.` : '',
      c.whoThisIsFor ? `Who this is for: ${c.whoThisIsFor}` : '',
      c.whatYoullLearn?.length ? `What you will learn: ${c.whatYoullLearn.join('; ')}` : '',
      c.chapters?.length ? `Chapters: ${c.chapters.map((ch) => ch.title).join('; ')}` : '',
    ].filter(Boolean).join('\n'),
  }))
}

// ── Proof-of-concept builds (with real timelines and price bands) ─────────
function pocSources(): Source[] {
  return pocs.map((p) => ({
    url: `/services/poc-development#${p.id}`,
    title: `${p.title} — proof of concept`,
    body: [
      `${p.title}. ${p.phaseTag}.`,
      `Problem it solves: ${p.problem}`,
      p.build?.length ? `What we build: ${p.build.join('; ')}` : '',
      `Typical timeline: ${p.timeline}.`,
      `Indicative price: ${[p.priceBand?.smb ? `SMB ${p.priceBand.smb}` : '', `Enterprise ${p.priceBand?.enterprise}`].filter(Boolean).join(', ')}.`,
      p.sustainmentBand ? `Ongoing support: ${p.sustainmentBand}.` : '',
      p.industries?.length ? `Industries: ${p.industries.join(', ')}.` : '',
      p.functions?.length ? `Functions: ${p.functions.join(', ')}.` : '',
      p.technologies?.length ? `Technologies: ${p.technologies.join(', ')}.` : '',
      p.pairedCourseTitle ? `Paired training: ${p.pairedCourseTitle}.` : '',
    ].filter(Boolean).join('\n'),
  }))
}

// ── Delivered work — the only honest source of proof ──────────────────────
function caseStudySources(): Source[] {
  return caseStudies.map((c) => ({
    url: '/portfolio',
    title: `${c.title} — ${c.client}`,
    body: [
      `Client: ${c.client} (${c.industry}). Duration: ${c.duration}.`,
      c.participants ? `Participants: ${c.participants}.` : '',
      `Challenge: ${c.challenge}`,
      c.approach?.length ? `What we did: ${c.approach.join('; ')}` : '',
      c.outcomes?.length ? `Outcomes: ${c.outcomes.join('; ')}` : '',
      c.technologies?.length ? `Technologies: ${c.technologies.join(', ')}.` : '',
      c.testimonial ? `Testimonial from ${c.testimonial.author}, ${c.testimonial.role}: "${c.testimonial.quote}"` : '',
    ].filter(Boolean).join('\n'),
  }))
}

// ── Credentials ───────────────────────────────────────────────────────────
function certificationSources(): Source[] {
  const grouped = certifications.map(
    (c) => `${c.name} (${c.code}, ${c.issuer}, ${c.category})${c.description ? `: ${c.description}` : ''}${c.skills?.length ? ` Skills: ${c.skills.join(', ')}.` : ''}`
  )
  const out: Source[] = [
    {
      url: '/about/certifications',
      title: 'Gennoor trainer certifications and credentials',
      body: [
        `Gennoor's trainers hold ${certifications.length} certifications.`,
        mctStatus ? `Microsoft Certified Trainer status: ${JSON.stringify(mctStatus).slice(0, 400)}` : '',
        grouped.join(' | '),
      ].filter(Boolean).join('\n'),
    },
  ]
  return out
}

// ── Industry and function pages — problems in the visitor's own words ─────
function verticalSources(): Source[] {
  const ind = industries.map((i) => ({
    url: `/industries/${i.slug}`,
    title: `AI for ${i.name} (${i.shortName})`,
    body: [
      `${i.name} — ${i.tagline}`,
      i.hero,
      i.whyNow ? `Why now: ${i.whyNow}` : '',
      i.problems?.length ? `Problems we solve: ${i.problems.map((p) => `${p.title} — ${p.detail}`).join('; ')}` : '',
      i.flagshipCourse ? `Flagship training: ${i.flagshipCourse}.` : '',
    ].filter(Boolean).join('\n'),
  }))
  const fns = businessFunctions.map((f) => ({
    url: `/functions/${f.slug}`,
    title: `AI for ${f.name}`,
    body: [
      `${f.name} — ${f.tagline}`,
      f.hero,
      f.problems?.length ? `Problems we solve: ${f.problems.map((p) => `${p.title} — ${p.detail}`).join('; ')}` : '',
      f.flagshipCourse ? `Flagship training: ${f.flagshipCourse}.` : '',
    ].filter(Boolean).join('\n'),
  }))
  return [...ind, ...fns]
}

// ── Webinars and live sessions ────────────────────────────────────────────
function webinarSources(): Source[] {
  const rows = [
    ...upcomingWebinars.map((w: any) => `UPCOMING — ${w.title} on ${w.date || 'a date to be announced'}${w.type ? ` (${w.type})` : ''}${w.summary ? `: ${w.summary}` : ''}`),
    ...pastWebinars.map((w: any) => `PAST — ${w.title}${w.date ? ` (${w.date})` : ''}${w.recordingUrl ? `, recording available` : ''}`),
  ]
  return [
    {
      url: '/webinars',
      title: 'Gennoor webinars and live workshops',
      body: [
        'Gennoor runs free webinars and live workshops. Every prospective client can also request a free 2-hour webinar tailored to their organisation, and a free 1-day online training — both no-obligation.',
        rows.length ? rows.join(' | ') : 'No sessions are listed on the public schedule right now; tailored sessions are arranged on request by writing to admin@gennoor.com.',
      ].join('\n'),
    },
  ]
}

/**
 * All structured knowledge, as indexable chunks. Merged with the crawled
 * pages by the site indexer — crawl covers presentation and anything not
 * modelled here; this covers the depth the pages don't render.
 */
export function knowledgeChunks(): SiteChunk[] {
  return [
    ...toChunks(courseCatalogSources(), 'course'),
    ...toChunks(programSources(), 'program'),
    ...toChunks(academySources(), 'academy'),
    ...toChunks(pocSources(), 'poc'),
    ...toChunks(caseStudySources(), 'case'),
    ...toChunks(certificationSources(), 'cert'),
    ...toChunks(verticalSources(), 'vertical'),
    ...toChunks(webinarSources(), 'webinar'),
  ]
}

/** Counts by source, for the indexer's status report. */
export function knowledgeSummary(): Record<string, number> {
  return {
    courses: allCoursePdfs.length,
    programs: allPrograms.length,
    academy: academyCourses.length,
    pocs: pocs.length,
    caseStudies: caseStudies.length,
    industries: industries.length,
    functions: businessFunctions.length,
    webinars: upcomingWebinars.length + pastWebinars.length,
  }
}
