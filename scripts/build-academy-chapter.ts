/*
 * Build pipeline for Academy chapters in the AB-100 style.
 *
 * Takes slide definitions, generates:
 *   1. A slide-deck HTML file (compatible with ChapterViewer iframe protocol)
 *   2. Per-slide MP3 narration via Azure Speech (Academy instance — eastus)
 *
 * Uploads everything to Azure Blob Storage container `website-content` at:
 *   courses/<course-id>/chapters/<chapter-slug>.html
 *   courses/<course-id>/audio/<chapter-id>/slide-XX.mp3
 *
 * Run with:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts <chapterId>
 *
 * Example:
 *   node --experimental-strip-types scripts/build-academy-chapter.ts chapter-01
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

config({ path: path.join(PROJECT_ROOT, '.env.local') })

const SPEECH_KEY = process.env.AZURE_SPEECH_ACADEMY_KEY
const SPEECH_REGION = process.env.AZURE_SPEECH_ACADEMY_REGION
const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
const CONTAINER = 'website-content'
const DEFAULT_VOICE = 'en-IN-NeerjaExpressiveNeural'

if (!SPEECH_KEY || !SPEECH_REGION) {
  console.error('Missing AZURE_SPEECH_ACADEMY_KEY or AZURE_SPEECH_ACADEMY_REGION')
  process.exit(1)
}
if (!STORAGE_CONN) {
  console.error('Missing AZURE_STORAGE_CONNECTION_STRING')
  process.exit(1)
}

// ─────────────────────────────────────────────────────────────────────
// ICON LIBRARY — inline SVG (Lucide-style stroke icons)
// ─────────────────────────────────────────────────────────────────────

const ICONS = {
  brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
  cog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  lightbulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  alertTriangle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
} as const

// ─────────────────────────────────────────────────────────────────────
// SLIDE DEFINITIONS — Chapter 1: What is AI?
// Narration is rewritten as conversational human speech.
// ─────────────────────────────────────────────────────────────────────

interface SlideStep {
  /** Renderable HTML for the step content */
  html: string
  /** Narration text — conversational, with em-dashes for natural pauses */
  narration: string
}

interface Slide {
  /** Slide-deck visible title */
  title: string
  /** Optional accent icon key from ICONS */
  iconKey?: keyof typeof ICONS
  /** Optional eyebrow above the title (e.g., "OPENING", "TAKEAWAYS") */
  eyebrow?: string
  /** Optional main body HTML (before steps) */
  bodyHtml?: string
  /** Lead narration — read first */
  narrationLead?: string
  /** Step cards revealed one at a time */
  steps?: SlideStep[]
  /** Callout HTML appearing after steps */
  calloutHtml?: string
  /** Narration for the callout (read after steps) */
  calloutNarration?: string
  /** Closing narration after callout */
  narrationTrail?: string
}

interface Chapter {
  courseId: string
  chapterId: string
  chapterNumber: number
  chapterSlug: string
  title: string
  subtitle: string
  slides: Slide[]
}

// Helper to wrap a step card with an icon + content
function stepCard(iconKey: keyof typeof ICONS, accent: 'blue' | 'amber' | 'red' | 'green', heading: string, body: string): string {
  return `<div class="step-card accent-${accent}">
    <div class="step-icon">${ICONS[iconKey]}</div>
    <div class="step-content">
      <h3>${heading}</h3>
      <p>${body}</p>
    </div>
  </div>`
}

const aiFoundationsChapter01: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-what-is-ai',
  title: 'What is AI? (Without the hype)',
  subtitle: 'A working definition that survives contact with reality.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'What is AI? (Without the hype)',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Before you can use AI well, you need a working definition that survives contact with reality. In the next few minutes, we'll cut through three years of marketing noise — and look at three things AI is decisively <em>not</em>.</p>`,
      narrationLead:
        "Hi, and welcome to chapter one. Today we're talking about what AI actually is — without the hype. Here's the thing. Before you can use AI well at work, you really need a working definition. One that survives contact with reality. So in the next few minutes, we're going to cut through three years of marketing noise. And we'll also look at three things AI is — decisively — not. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — AI vs ML vs GenAI
    // ──────────────────────────────────────────────────────
    {
      title: 'AI, machine learning, and generative AI',
      iconKey: 'brain',
      eyebrow: 'Lesson 1 · Definitions',
      bodyHtml: `<p>Vendors use these three terms interchangeably. They&rsquo;re not the same. Getting them straight is the first step to spotting which problems each one can solve.</p>`,
      narrationLead:
        "So let's start with three terms you hear everywhere. AI. Machine learning. And generative AI. Vendors use these interchangeably — but they're not the same. And getting them straight is the very first step to spotting which problems each one can actually solve. Let's break them down, one by one.",
      steps: [
        {
          html: stepCard('brain', 'blue', 'AI · Artificial Intelligence',
            "The umbrella term for any system that performs tasks normally requiring human intelligence — recognising faces, translating languages, drafting emails. It's a <em>goal</em>, not a technique."),
          narration:
            "First up — AI, or Artificial Intelligence. Think of this as the umbrella term. It covers any system that performs tasks that normally would require human intelligence. Things like recognising faces. Translating languages. Drafting emails. The key thing to remember? AI is a goal — not a technique.",
        },
        {
          html: stepCard('cog', 'blue', 'ML · Machine Learning',
            'A specific technique for achieving AI. Instead of programming the rules, you show a system many examples and let it figure out the patterns. Spam filters, fraud detection, and recommendation engines all use ML.'),
          narration:
            "Next — machine learning. Or ML. This is a specific technique for achieving AI. Now here's what makes it different. Instead of programming the rules — like you would in old-school software — you show the system many examples. And you let it figure out the patterns on its own. Your spam filter? That uses ML. Fraud detection? ML. Netflix recommendations? Also ML.",
        },
        {
          html: stepCard('sparkles', 'amber', 'GenAI · Generative AI',
            'A recent subset of ML that learned from <em>so much</em> text and so many images that it can produce new text and images on demand. ChatGPT, Microsoft Copilot, Claude, and Gemini — these are generative AI.'),
          narration:
            "And finally — generative AI. GenAI for short. This is a recent subset of machine learning that learned from so much text — and so many images — that it can produce new text and new images on demand. ChatGPT? That's generative AI. Microsoft Copilot? Same. Claude. Gemini. All generative AI.",
        },
      ],
      calloutHtml: `<div class="callout callout-tip">
        <div class="callout-icon">${ICONS.lightbulb}</div>
        <div>
          <div class="callout-title">Shorthand to remember</div>
          <div class="callout-body">AI is the destination. ML is the road. Generative AI is the truck that arrived at the destination in late 2022 — and changed which problems we now think are worth solving.</div>
        </div>
      </div>`,
      calloutNarration:
        "Here's a shorthand to remember all this. AI is the destination. Machine learning is the road. And generative AI? That's the truck that arrived at the destination in late 2022 — and changed which problems we now think are worth solving. Keep that picture in your head.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Three things AI is NOT
    // ──────────────────────────────────────────────────────
    {
      title: 'Three things AI is decisively NOT',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Common myths',
      bodyHtml: `<p>Half the bad decisions about AI come from misunderstanding what it <em>isn't</em>. Three myths worth retiring today.</p>`,
      narrationLead:
        "Alright. Now for something equally important. Half the bad decisions about AI come from misunderstanding what it is not. So let me give you three myths that are worth retiring today.",
      steps: [
        {
          html: stepCard('x', 'red', 'Myth one — AI is sentient',
            "AI does not understand, the way you and I understand. It <em>predicts</em>. ChatGPT isn't &lsquo;thinking about your question&rsquo; — it's computing the statistically most likely next word, given everything before. That doesn't make it less useful. But it should change how you trust its output."),
          narration:
            "Myth number one — AI is sentient. It is not. AI does not understand, the way you and I understand. It predicts. When you ask ChatGPT something, it isn't sitting there thinking about your question. It's computing the statistically most likely next word — given everything that came before. That doesn't make it less useful. But it should change how you trust its output.",
        },
        {
          html: stepCard('x', 'red', 'Myth two — AI is infallible',
            "It produces fluent, confident-sounding text — that is sometimes completely wrong. The fluency comes from how it was trained. The wrongness comes from <em>the same place</em>. Always verify factual claims it makes — especially numbers, names, dates, and citations."),
          narration:
            "Myth number two — AI is infallible. Also not true. AI produces fluent, confident-sounding text — that is sometimes completely wrong. The fluency comes from how it was trained. And the wrongness? Comes from the same place. So always verify factual claims it makes. Especially numbers. Names. Dates. And citations. Don't skip this step.",
        },
        {
          html: stepCard('x', 'red', 'Myth three — AI is magic',
            "AI can only work with the information it has — what it was trained on, which is a snapshot of the past, and what you give it in your prompt, which is the present. It doesn't know your company's policies unless you tell it. It doesn't know what happened last week unless you supply that information."),
          narration:
            "And myth number three — AI is magic. It really isn't. AI can only work with the information it has. That means what it was trained on — a snapshot of the past. And what you give it in your prompt — the present. So it doesn't know your company's policies unless you tell it. And it doesn't know what happened last week, unless that information is supplied. No magic. Just statistics.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Why now (2022)
    // ──────────────────────────────────────────────────────
    {
      title: 'Why now — what changed in 2022',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The inflection point',
      bodyHtml: `<p>AI research has been going for <strong>seventy years</strong>. Two things made the recent wave different — the <em>scale</em> of training data, and an architectural breakthrough called the <em>Transformer</em>, introduced by Google researchers in 2017. Together, they produced language models so much better than what came before that, when ChatGPT launched in November 2022, the conversation about what AI can do for work — changed permanently.</p>`,
      narrationLead:
        "So you might be wondering — why are we suddenly talking about AI everywhere? AI research has been going for seventy years. So what changed? Two things, really. First — the scale of training data. We're talking about the entire public internet being used to train these models. Second — an architectural breakthrough called the Transformer, introduced by Google researchers back in 2017. Now, put those two things together — internet-scale training plus the Transformer architecture — and what you get are language models so much better than what came before. So much better that, when ChatGPT launched in November 2022, the conversation about what AI can do for work — changed permanently. And it changed for non-technical professionals. Not just specialists.",
      calloutHtml: `<div class="callout callout-info">
        <div class="callout-icon">${ICONS.compass}</div>
        <div>
          <div class="callout-title">Why this matters for your week</div>
          <div class="callout-body">You don't need to track research papers. But you should know — GenAI is genuinely different from the AI that came before. Different enough that the playbooks of 2019 don't apply. What changed is <em>who can benefit</em>. Five years ago, you needed a data science team. Now? You need a curious manager with thirty minutes.</div>
        </div>
      </div>`,
      calloutNarration:
        "Why does any of this matter for your week? Honestly — you don't need to track research papers. But you should know this. Generative AI is genuinely different from the AI that came before. Different enough that the playbooks of 2019 just don't apply anymore. And what really changed is who can benefit from AI. Five years ago, you needed a data science team. Now? You just need a curious manager — and thirty minutes.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Scope
    // ──────────────────────────────────────────────────────
    {
      title: "What this course doesn't cover",
      iconKey: 'compass',
      eyebrow: 'A note on scope',
      bodyHtml: `<p>This is a <em>foundations</em> course. It deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. It teaches you the mental model — and the practical workflows — that let you apply AI to your work this week. If you need the technical depth, the Builder track is where you go next.</p>`,
      narrationLead:
        "Quick note on scope before we move on. This is a foundations course. So it deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. What it does teach? The mental model. And the practical workflows that let you apply AI to your work — this week. If you need the technical depth, the Builder track is where you go next. But for now, we're keeping it grounded. Practical. Useful.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 1',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon">${ICONS.check}</span><span>AI is the goal · ML is the technique · Generative AI is the recent wave that brought AI to non-technical work.</span></li>
        <li data-step="2"><span class="takeaway-icon">${ICONS.check}</span><span>AI is not sentient · not infallible · not magic — it predicts, fluently, from training data and your prompt.</span></li>
        <li data-step="3"><span class="takeaway-icon">${ICONS.check}</span><span>The 2022 inflection point was scale (internet-sized training data) plus architecture (the Transformer).</span></li>
        <li data-step="4"><span class="takeaway-icon">${ICONS.check}</span><span>You don't need to be technical to benefit — you need a working mental model, and a willingness to try things.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up. Here are the four takeaways from chapter one. Number one. AI is the goal. ML is the technique. And generative AI is the recent wave that brought AI to non-technical work. Number two. AI is not sentient. Not infallible. Not magic. It predicts — fluently — from training data and from your prompt. Number three. The 2022 inflection point was scale, meaning internet-sized training data — plus architecture, meaning the Transformer. And finally, number four. You don't need to be technical to benefit from AI. You just need a working mental model. And a willingness to try things. That's chapter one. See you in chapter two — where we'll go a level deeper. We'll look at how Large Language Models actually work, under the hood.",
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────
// SSML COMPOSITION — natural pacing via prosody + breaks
// ─────────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Adds an explicit pause after every period/question/exclamation/em-dash for natural pacing. */
function paceText(text: string): string {
  // Add breaks after sentence terminators
  let paced = escapeXml(text)
  // After ". " / "? " / "! "
  paced = paced.replace(/([.!?])\s+/g, '$1<break time="350ms"/> ')
  // After em-dash (—) for natural pause
  paced = paced.replace(/\s—\s/g, ' <break time="250ms"/>— <break time="150ms"/>')
  return paced
}

function composeSlideSSML(slide: Slide, voice: string = DEFAULT_VOICE): string {
  const parts: string[] = []

  if (slide.narrationLead) {
    parts.push(paceText(slide.narrationLead))
  }
  if (slide.steps) {
    for (const step of slide.steps) {
      parts.push('<break time="700ms"/>')
      parts.push(paceText(step.narration))
    }
  }
  if (slide.calloutNarration) {
    parts.push('<break time="800ms"/>')
    parts.push(paceText(slide.calloutNarration))
  }
  if (slide.narrationTrail) {
    parts.push('<break time="500ms"/>')
    parts.push(paceText(slide.narrationTrail))
  }

  const body = parts.join(' ')

  return `<speak version="1.0" xml:lang="en-IN" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts">
<voice name="${voice}">
<prosody rate="-7%" pitch="+0Hz">
${body}
</prosody>
</voice>
</speak>`
}

// ─────────────────────────────────────────────────────────────────────
// AZURE SPEECH CALL
// ─────────────────────────────────────────────────────────────────────

async function generateMp3(ssml: string): Promise<Buffer> {
  const endpoint = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': SPEECH_KEY!,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'gennoor-academy-build',
    },
    body: ssml,
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '<no body>')
    throw new Error(`Azure Speech failed: ${res.status} — ${errText.slice(0, 300)}`)
  }
  const arrayBuf = await res.arrayBuffer()
  return Buffer.from(arrayBuf)
}

// ─────────────────────────────────────────────────────────────────────
// HTML SLIDE-DECK GENERATION
// ─────────────────────────────────────────────────────────────────────

function renderSlideHtml(slide: Slide, slideNumber: number, totalSlides: number): string {
  const stepsHtml = slide.steps
    ? `<div class="steps">
        ${slide.steps
          .map((step, i) => `<div class="step" data-step="${i + 1}">${step.html}</div>`)
          .join('\n')}
      </div>`
    : ''

  const iconHtml = slide.iconKey ? `<div class="slide-icon">${ICONS[slide.iconKey]}</div>` : ''
  const eyebrowHtml = slide.eyebrow ? `<p class="slide-eyebrow">${escapeXml(slide.eyebrow)}</p>` : ''

  return `
    <section class="slide" data-slide="${slideNumber}">
      <div class="slide-inner">
        <div class="slide-meta">Slide ${slideNumber} of ${totalSlides}</div>
        <header class="slide-header">
          ${iconHtml}
          <div class="slide-head-text">
            ${eyebrowHtml}
            <h2>${escapeXml(slide.title)}</h2>
          </div>
        </header>
        ${slide.bodyHtml ?? ''}
        ${stepsHtml}
        ${slide.calloutHtml ?? ''}
      </div>
    </section>
  `
}

function renderChapterHtml(chapter: Chapter): string {
  const totalSlides = chapter.slides.length
  const slidesHtml = chapter.slides
    .map((slide, i) => renderSlideHtml(slide, i + 1, totalSlides))
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeXml(chapter.title)}</title>
  <style>
    :root {
      --brand-blue: #2563eb;
      --brand-blue-dark: #1d4ed8;
      --brand-amber: #f59e0b;
      --brand-amber-dark: #d97706;
      --text-strong: #0f172a;
      --text-body: #334155;
      --text-mute: #64748b;
      --text-soft: #94a3b8;
      --surface-base: #ffffff;
      --surface-tint: #f8fafc;
      --border-soft: #e2e8f0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(180deg, #fafafa 0%, #f1f5f9 100%);
      color: var(--text-body);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    /* Decorative ambient orbs */
    body::before, body::after {
      content: '';
      position: fixed;
      width: 480px; height: 480px; border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    body::before {
      top: -120px; right: -120px;
      background: radial-gradient(circle, rgba(37,99,235,0.10), transparent 70%);
    }
    body::after {
      bottom: -120px; left: -120px;
      background: radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%);
    }
    /* Built-in controls (hidden by parent iframe) */
    .controls-top {
      position: fixed; top: 0; left: 0; right: 0; height: 48px;
      background: #0c1426; color: #fff; display: flex; align-items: center;
      justify-content: space-between; padding: 0 16px; z-index: 50;
    }
    .controls-top button {
      background: rgba(255,255,255,0.1); color: #fff; border: 0;
      padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;
    }
    .controls-top button:disabled { opacity: 0.3; cursor: not-allowed; }
    .controls-top #counter { font-size: 13px; opacity: 0.7; }
    /* Progress bar — parent observes #progressFill style.width */
    .progress-track {
      position: fixed; top: 0; left: 0; right: 0; height: 3px;
      background: rgba(0,0,0,0.05); z-index: 100;
    }
    #progressFill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, var(--brand-blue), var(--brand-amber));
      transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    /* Step indicator — hidden by parent script */
    #stepIndicator {
      position: fixed; bottom: 18px; right: 18px;
      background: rgba(15, 23, 42, 0.85); color: #fff;
      padding: 6px 12px; border-radius: 999px; font-size: 11px;
      font-weight: 600; letter-spacing: 0.05em;
      z-index: 40; backdrop-filter: blur(8px);
    }

    /* Slides */
    .slides-container {
      max-width: 920px; margin: 0 auto;
      padding: 60px 32px 120px;
      position: relative;
      z-index: 1;
    }
    .slide { display: none; }
    .slide.active {
      display: block;
      animation: slideIn 600ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .slide-inner {
      background: var(--surface-base);
      border-radius: 24px;
      padding: 48px 44px 56px;
      box-shadow:
        0 1px 3px rgba(15,23,42,0.04),
        0 12px 32px -8px rgba(15,23,42,0.10);
      border: 1px solid rgba(226,232,240,0.6);
    }
    .slide-meta {
      font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--text-soft); margin-bottom: 20px;
    }

    /* Slide header */
    .slide-header {
      display: flex; align-items: flex-start; gap: 20px;
      margin-bottom: 24px;
    }
    .slide-icon {
      width: 56px; height: 56px; flex-shrink: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-dark));
      color: #fff; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px -6px rgba(37,99,235,0.35);
    }
    .slide-icon svg { width: 28px; height: 28px; }
    .slide-head-text { flex-grow: 1; padding-top: 4px; }
    .slide-eyebrow {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--brand-blue); margin-bottom: 6px;
    }
    .slide h2 {
      font-size: 32px; font-weight: 800; color: var(--text-strong);
      line-height: 1.15; letter-spacing: -0.015em;
    }
    .slide p {
      font-size: 17px; color: var(--text-body); margin-bottom: 16px;
    }
    .slide p:last-child { margin-bottom: 0; }
    .slide p.lead {
      font-size: 19px; color: var(--text-strong); line-height: 1.6;
      border-left: 4px solid var(--brand-amber);
      padding-left: 22px; padding-top: 4px; padding-bottom: 4px;
      margin-top: 8px; margin-bottom: 8px;
    }
    .slide em {
      color: var(--text-strong); font-weight: 600; font-style: italic;
    }
    .slide strong { color: var(--text-strong); font-weight: 700; }

    /* Steps */
    .steps { margin-top: 28px; display: grid; gap: 14px; }
    .step {
      opacity: 0; transform: translateY(12px) scale(0.98);
      transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .step.revealed {
      opacity: 1; transform: translateY(0) scale(1);
    }
    .step-card {
      display: flex; gap: 18px; align-items: flex-start;
      background: #fff;
      border: 1px solid var(--border-soft);
      border-radius: 14px;
      padding: 18px 22px;
      box-shadow: 0 1px 2px rgba(15,23,42,0.03);
      transition: border-color 200ms, box-shadow 200ms, transform 200ms;
    }
    .step-card:hover {
      border-color: rgba(37,99,235,0.3);
      box-shadow: 0 4px 12px -2px rgba(37,99,235,0.10);
      transform: translateY(-1px);
    }
    .step-icon {
      width: 40px; height: 40px; flex-shrink: 0;
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      color: #fff;
    }
    .step-icon svg { width: 20px; height: 20px; }
    .step-card.accent-blue .step-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .step-card.accent-amber .step-icon { background: linear-gradient(135deg, #fbbf24, #d97706); }
    .step-card.accent-red .step-icon { background: linear-gradient(135deg, #f87171, #dc2626); }
    .step-card.accent-green .step-icon { background: linear-gradient(135deg, #4ade80, #16a34a); }
    .step-content { flex-grow: 1; padding-top: 2px; }
    .step-content h3 {
      font-size: 17px; font-weight: 700; color: var(--text-strong);
      margin-bottom: 4px; letter-spacing: -0.005em;
    }
    .step-content p {
      font-size: 15px; color: var(--text-body); margin: 0; line-height: 1.55;
    }

    /* Callouts */
    .callout {
      margin-top: 28px;
      display: flex; gap: 16px; align-items: flex-start;
      padding: 20px 22px;
      border-radius: 14px;
      border: 1px solid;
    }
    .callout-icon {
      width: 36px; height: 36px; flex-shrink: 0;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff;
    }
    .callout-icon svg { width: 18px; height: 18px; }
    .callout-info { background: #eff6ff; border-color: #bfdbfe; }
    .callout-info .callout-icon { background: var(--brand-blue); }
    .callout-info .callout-title { color: var(--brand-blue-dark); }
    .callout-tip { background: #fffbeb; border-color: #fde68a; }
    .callout-tip .callout-icon { background: var(--brand-amber); }
    .callout-tip .callout-title { color: var(--brand-amber-dark); }
    .callout-warning { background: #fef2f2; border-color: #fecaca; }
    .callout-warning .callout-icon { background: #dc2626; }
    .callout-warning .callout-title { color: #b91c1c; }
    .callout > div:last-child { flex-grow: 1; }
    .callout-title {
      font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .callout-body {
      font-size: 15px; color: var(--text-body); line-height: 1.6;
    }

    /* Takeaways list */
    .takeaways {
      list-style: none; padding: 0; display: grid; gap: 12px; margin-top: 8px;
    }
    .takeaways li {
      display: flex; gap: 14px; align-items: flex-start;
      background: linear-gradient(135deg, rgba(239,246,255,0.6), rgba(255,251,235,0.4));
      border: 1px solid rgba(191,219,254,0.5);
      border-left: 4px solid var(--brand-blue);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 16px; color: var(--text-strong);
      line-height: 1.6;
      opacity: 0; transform: translateY(10px);
      transition: opacity 500ms, transform 500ms;
    }
    .takeaways li.revealed { opacity: 1; transform: translateY(0); }
    .takeaway-icon {
      width: 28px; height: 28px; flex-shrink: 0;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-dark));
      color: #fff;
      display: flex; align-items: center; justify-content: center;
    }
    .takeaway-icon svg { width: 16px; height: 16px; }

    /* Keyboard hint */
    .kb-hint {
      position: fixed; bottom: 18px; left: 18px; font-size: 11px;
      color: var(--text-soft); background: rgba(255,255,255,0.9);
      padding: 6px 12px; border-radius: 999px;
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-soft);
      font-weight: 500;
    }
    .kb-hint kbd {
      background: var(--surface-tint); padding: 2px 6px; border-radius: 4px;
      font-size: 10px; font-weight: 700; border: 1px solid var(--border-soft);
      color: var(--text-strong); margin: 0 2px;
    }

    /* Mobile */
    @media (max-width: 720px) {
      .slides-container { padding: 32px 16px 80px; }
      .slide-inner { padding: 32px 24px 40px; border-radius: 18px; }
      .slide h2 { font-size: 24px; }
      .slide-header { flex-direction: column; gap: 14px; }
      .slide-icon { width: 44px; height: 44px; }
      .slide-icon svg { width: 22px; height: 22px; }
      .step-card { padding: 14px 18px; }
      .kb-hint { display: none; }
    }
  </style>
</head>
<body>
  <!-- Built-in slide controls (hidden by parent iframe script) -->
  <div class="controls-top">
    <button id="prevBtn">‹ Prev</button>
    <span id="counter">1 / ${totalSlides}</span>
    <button id="nextBtn">Next ›</button>
  </div>

  <!-- Progress bar -->
  <div class="progress-track">
    <div id="progressFill"></div>
  </div>

  <!-- Step indicator -->
  <div id="stepIndicator">Step 1</div>

  <!-- Slides -->
  <main class="slides-container">
    ${slidesHtml}
  </main>

  <!-- Keyboard hint -->
  <div class="kb-hint">
    <kbd>←</kbd><kbd>→</kbd> Navigate · <kbd>Space</kbd> Play audio
  </div>

  <script>
    (function() {
      var slides = document.querySelectorAll('.slide');
      var totalSlides = slides.length;
      var currentSlide = 1;
      var counter = document.getElementById('counter');
      var progressFill = document.getElementById('progressFill');
      var stepIndicator = document.getElementById('stepIndicator');
      var prevBtn = document.getElementById('prevBtn');
      var nextBtn = document.getElementById('nextBtn');

      function show(n) {
        if (n < 1 || n > totalSlides) return;
        currentSlide = n;
        slides.forEach(function(s, i) {
          s.classList.toggle('active', i === n - 1);
        });
        counter.textContent = n + ' / ' + totalSlides;
        progressFill.style.width = ((n / totalSlides) * 100) + '%';
        // Reset reveals in newly active slide
        var active = slides[n - 1];
        var stepsInSlide = active.querySelectorAll('[data-step]');
        stepsInSlide.forEach(function(s) { s.classList.remove('revealed'); });
        updateStepIndicator();
      }

      function updateStepIndicator() {
        var active = slides[currentSlide - 1];
        var steps = active.querySelectorAll('[data-step]');
        var revealed = active.querySelectorAll('[data-step].revealed');
        if (steps.length === 0) {
          stepIndicator.style.display = 'none';
        } else {
          stepIndicator.style.display = 'block';
          stepIndicator.textContent = 'Step ' + revealed.length + ' / ' + steps.length;
        }
      }

      function advanceStep() {
        var active = slides[currentSlide - 1];
        var next = active.querySelector('[data-step]:not(.revealed)');
        if (next) {
          next.classList.add('revealed');
          updateStepIndicator();
          return true;
        }
        return false;
      }

      prevBtn.addEventListener('click', function() {
        if (currentSlide > 1) show(currentSlide - 1);
      });
      nextBtn.addEventListener('click', function() {
        if (!advanceStep() && currentSlide < totalSlides) {
          show(currentSlide + 1);
        }
      });

      show(1);
    })();
  </script>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────────────
// BLOB UPLOAD
// ─────────────────────────────────────────────────────────────────────

async function uploadToBlob(blobPath: string, body: Buffer, contentType: string): Promise<void> {
  const service = BlobServiceClient.fromConnectionString(STORAGE_CONN!)
  const container = service.getContainerClient(CONTAINER)
  await container.createIfNotExists()
  const blob = container.getBlockBlobClient(blobPath)
  await blob.uploadData(body, {
    blobHTTPHeaders: { blobContentType: contentType },
  })
}

// ─────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────

async function build(chapter: Chapter): Promise<void> {
  console.log(`\n→ Building ${chapter.courseId} / ${chapter.chapterId} — "${chapter.title}"`)
  console.log(`  Voice: ${DEFAULT_VOICE}`)
  console.log(`  ${chapter.slides.length} slides\n`)

  const stagingDir = path.join(PROJECT_ROOT, 'tmp', 'academy-build', chapter.courseId)
  const audioDir = path.join(stagingDir, 'audio', chapter.chapterId)
  await mkdir(audioDir, { recursive: true })

  // 1. Generate per-slide MP3s
  for (let i = 0; i < chapter.slides.length; i++) {
    const slide = chapter.slides[i]
    const slideNum = i + 1
    const slideNumStr = String(slideNum).padStart(2, '0')
    const mp3Path = path.join(audioDir, `slide-${slideNumStr}.mp3`)

    const ssml = composeSlideSSML(slide)
    console.log(`  [${slideNum}/${chapter.slides.length}] Generating slide-${slideNumStr}.mp3 — ${slide.title}...`)
    const mp3 = await generateMp3(ssml)
    await writeFile(mp3Path, mp3)
    console.log(`     ✓ ${(mp3.length / 1024).toFixed(1)} KB`)

    // Upload MP3
    const blobPath = `courses/${chapter.courseId}/audio/${chapter.chapterId}/slide-${slideNumStr}.mp3`
    const mp3Buf = await readFile(mp3Path)
    await uploadToBlob(blobPath, mp3Buf, 'audio/mpeg')
    console.log(`     ↑ uploaded`)
  }

  // 2. Generate chapter HTML
  const html = renderChapterHtml(chapter)
  const htmlPath = path.join(stagingDir, 'chapters', `${chapter.chapterSlug}.html`)
  await mkdir(path.dirname(htmlPath), { recursive: true })
  await writeFile(htmlPath, html, 'utf8')
  console.log(`\n  ✓ HTML: ${(html.length / 1024).toFixed(1)} KB → ${htmlPath}`)

  // 3. Upload HTML
  const htmlBlobPath = `courses/${chapter.courseId}/chapters/${chapter.chapterSlug}.html`
  await uploadToBlob(htmlBlobPath, Buffer.from(html, 'utf8'), 'text/html; charset=utf-8')
  console.log(`  ↑ uploaded to ${htmlBlobPath}`)

  console.log(`\n✓ Done. Visit: /ai-academy/${chapter.courseId}/${chapter.chapterSlug}\n`)
}

// ─────────────────────────────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────────────────────────────

const chapters: Record<string, Chapter> = {
  'chapter-01': aiFoundationsChapter01,
}

const args = process.argv.slice(2)
const chapterId = args[0] ?? 'chapter-01'
const chapter = chapters[chapterId]

if (!chapter) {
  console.error(`Unknown chapterId: ${chapterId}. Available: ${Object.keys(chapters).join(', ')}`)
  process.exit(1)
}

build(chapter).catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
