# 09 — Visual Identity Application

The visual brand is already strong. **What needs to change is consistency, not aesthetics.** This document codifies how the brand lands on every surface — website, PDFs, slides, social, email — so the experience feels like one firm regardless of where a prospect meets us.

---

## Anchor assets (already exist — keep)

### Logo (5 variants)
From `src/components/GennoorLogo.tsx`:
- **horizontal** — primary use, web header, document headers
- **hero** — large hero placement
- **stacked** — when vertical space is the constraint
- **icon** — icon-only, social avatars, course chapter headers, favicons
- **compact** — small footers, email signature

### Logo color treatment
- **Arc dots:** primary blue `#2563EB`
- **Bar dots:** amber `#F59E0B` (two amber + one blue)
- **Wordmark:** `Ge` gray-dark `#2D3748`, `nn` blue, `oo` amber, `r` blue, `Tech` gray `#4A5568`
- **Tagline:** gray `#AAAAAA`, small caps, letter-spaced

### Type system (already loaded)
- **Plus Jakarta Sans** — display + headings (700, 800)
- **Sora** — small caps, taglines, labels (700)
- **Inter** (implicit via tailwind) — body text default

### Color palette (Tailwind tokens already in repo)
- **Primary blue:** `primary-600` (#2563EB), `primary-700`
- **Accent amber:** `secondary-400` (#F59E0B), `accent-*`
- **Grays:** `gray-900`, `gray-700`, `gray-500`, `gray-300`
- **Neutrals:** white, gradient mesh (already used)

### UI patterns (keep)
- **Glass card** (`glass-card` class) — primary surface
- **Glow border** — hover states
- **Gradient mesh** — page backgrounds
- **Section divider** — between sections
- **Animated ambient orbs** — hero treatments

**Verdict:** the visual language is good. Don't touch it.

---

## What needs codifying

The asset is fine; the **rules of use** need to be written so PDFs, slides, and social posts all feel like the website. Today there is no codified usage guide. We'll create it.

### Logo usage rules

| Surface | Variant | Min size | Clear space |
|---|---|---|---|
| Website header | horizontal | 32px height | 16px around |
| Website hero | hero | 80–180px height | 32px around |
| PDF course cover | horizontal | 60px height | 24px around |
| PDF chapter header | icon | 32px square | 12px around |
| Social avatar | icon | 400×400 | edge bleed OK |
| Email signature | compact | 32px height | 12px around |
| Slide template (cover) | hero | proportional | 48px around |
| Slide template (footer) | compact | 24px height | 8px around |
| Favicon | icon (simplified) | 32×32 | tight |

**Never:**
- Recolor the logo
- Place on busy photographic backgrounds without a scrim
- Stretch / skew / rotate
- Use the wordmark without the dots
- Use the dots without the wordmark (exception: icon variant)

---

## PDF design system (for courses, proposals, briefs)

### Cover template

```
┌────────────────────────────────────────────────────────┐
│                                                          │
│  [Gennoor Tech horizontal logo]                          │
│                                                          │
│                                                          │
│                                                          │
│  AI FOUNDATIONS FOR EVERYONE                             │
│  Track 1: Foundations                                    │
│                                                          │
│  A practical 48-page guide for business teams.           │
│                                                          │
│                                                          │
│  ╭──────────────────────────╮                            │
│  │ [Audience: All staff]    │                            │
│  │ [Level: Foundation]      │                            │
│  │ [Pages: 48]              │                            │
│  ╰──────────────────────────╯                            │
│                                                          │
│                                                          │
│                                                          │
│                                                          │
│  ───────────────────────────────────────────────────     │
│  Gennoor Tech · train. innovate. build.                  │
│  Edition 1.0 · May 2026 · gennoor.com                   │
└────────────────────────────────────────────────────────┘
```

- White background
- Top-left logo only
- Generous whitespace
- Title in Plus Jakarta Sans 800, 48pt
- Subtitle in Sora small caps, 14pt, letter-spaced
- Audience/level/pages tag block in soft-gray glass card style
- Footer with logo tagline (small caps, gray)

### Inside front cover
- "About Gennoor Tech" (4 short paragraphs, no founder)
- Mini Gennoor Way diagram
- "How to use this course" (3 bullets)
- Contact box

### Chapter opener
- Icon logo top-left, small
- Chapter number + title (Plus Jakarta Sans 800, 36pt)
- One-sentence promise (Plus Jakarta Sans 500, 16pt, gray-500)
- Estimated reading time
- Pull-quote in amber sidebar

### Body pages
- 11pt body type, 1.5 line-height
- Headings: 24pt H2, 18pt H3
- **Blue callout boxes:** key concepts
- **Amber callout boxes:** "do this Monday morning" actions
- **The Enablement Sidebar:** at the end of every chapter, distinct treatment — soft amber-tinted glass card, 80% width centered, with a clear CTA

### Back cover
- "Next steps" page (3 options)
- Founder credibility footer (small)
- Contact + social

---

## Slide template (for live training, webinars, sales decks)

Three templates: **Cover**, **Section divider**, **Content slide**.

- 16:9 aspect ratio
- Master color: white background, blue + amber accents
- Logo: bottom-right compact on every slide
- Page numbering: bottom-left, "Gennoor Tech · 03/24"
- Section dividers: full-bleed gradient mesh + large heading
- Content slides: 1 idea, 1 headline, max 3 bullets — never the corporate-deck wall-of-text
- Reusable assets: the Gennoor Way diagram, the Three Pledges block, the SMB-vs-Enterprise card

Both PowerPoint (.pptx) and Google Slides versions exported — many enterprise clients live in O365, many SMBs live in Google.

---

## Social & email

### LinkedIn
- Banner: gradient mesh + "Diagnose. Train. Innovate. Build. Sustain." + logo
- Post template: 1 hero image (1080×1080 or 1080×1350), branded; caption in our voice (see [01 — voice section](01-brand-positioning.md))
- Carousel template: 10-slide template; cover = the hook, slides 2–9 = the content, slide 10 = CTA + logo

### Email
- Header: horizontal logo, 32px, left-aligned
- Body: 580px width, 16pt body, blue link color, amber CTA buttons
- Footer: compact logo + tagline + social + unsubscribe + sent-from address

### Email signature (per [memory feedback_email_sent_items.md](../../../memory/feedback_email_sent_items.md))

```
Jalal Ahmed Khan
Founder, Gennoor Tech
Diagnose. Train. Innovate. Build. Sustain.
gennoor.com  ·  WhatsApp  ·  LinkedIn
```

---

## Website-specific reinforcement

### Pages that need a brand consistency pass
- `/the-gennoor-way` — the 5-phase diagram becomes a *signature visual*, illustrated in detail, animated
- All `/solutions/by-phase/*` pages — repeated framework breadcrumb at the top
- All `/industries/*` pages — same template, same visual rhythm
- All `/resources/courses/[slug]` pages — same card hero
- All `/resources/pocs/[slug]` pages — same card hero

### Three new website graphic assets to produce
1. **The Gennoor Way diagram** — full color, animated SVG (used homepage + framework page + every phase page in compressed form)
2. **The Three Pledges block** — reusable component, used on every solution page
3. **The "Two-track" card** — the SMB/Enterprise selector, used homepage + footer + solutions hub

These three assets are the visual signatures of the new brand. A prospect should see at least two of them on every meaningful page.

---

## Accessibility & responsiveness

The current site is already responsive and uses semantic HTML. Two specific upgrades:
- **Color contrast:** verify the amber accent on white passes WCAG AA (`#F59E0B` on white — large text fine, body text borderline; use `#D97706` or `#92400E` for inline body links)
- **PDF accessibility:** all course PDFs tagged for screen readers (alt text on all diagrams, proper heading structure)

---

## What is explicitly out of scope for this redesign

- A new logo (we are NOT redesigning it; the current one works)
- A new color palette (current palette is on-brand)
- A new font stack (Plus Jakarta + Sora is correct)
- Photography (we keep the current illustration-led approach)

The visual brand is **lifted by consistency**, not replaced.

> **Continue to: [10 — SEO & AEO content strategy](10-seo-aeo-content.md)**
