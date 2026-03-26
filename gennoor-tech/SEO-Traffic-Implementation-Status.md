# Gennoor.com — SEO & Traffic Growth Implementation Status

**Last updated:** 2026-03-24

---

## COMPLETED (Already in codebase)

| # | Item | What It Does For You |
|---|------|---------------------|
| 1 | **Blog SSR (partial)** | Individual blog posts are server-rendered — Google can crawl them. Blog listing page is still client-side. |
| 2 | **robots.txt** | Tells Google what to crawl, points to sitemap. Foundation for all SEO. |
| 3 | **sitemap.xml** | Auto-generated page list submitted to Google — ensures every page gets discovered and indexed. |
| 4 | **JSON-LD Structured Data** | Organization, Person, Article, Service, FAQ, Breadcrumb schemas — enables rich snippets in Google results (star ratings, FAQ dropdowns, author info). |
| 5 | **FAQ sections + FAQPage schema** | On service pages & guides — gets you expandable FAQ rich snippets in Google search results, increasing click-through rate. |
| 6 | **Per-page meta titles & descriptions** | Every page has unique, keyword-targeted metadata — directly controls what appears in Google search results. |
| 8 | **Internal linking** | Blog → services, services → services, guides → training — helps Google understand site structure, passes authority between pages. |
| 9 | **Canonical URLs** | Prevents duplicate content penalties — tells Google the authoritative URL for each page. |
| 11 | **Floating CTA (Career Command Center)** | Fixed bottom-right button on every page — captures visitor intent, drives engagement. |
| 12 | **WhatsApp chat button** | Real WhatsApp number, fixed position — high conversion for India/Saudi market. |
| 14 | **Related posts on blog** | Shows 3 related articles at bottom of each post — keeps visitors on site longer, reduces bounce rate. |
| 15 | **Newsletter signup on blog** | Email capture on listing + individual posts with OTP verification — builds your email list for direct marketing. |
| 17 | **Location pages (all 3)** | Saudi Arabia, India, Remote — rank for "AI training in [location]" searches, mention real clients (Aramco, HDFC, etc). |
| 18 | **Certification guides (all 3)** | AI-102, PL-300, MS-4004 — rank for "exam prep" searches, funnel to your training services. |
| 19 | **Course landing pages (all 3)** | Copilot Studio, Azure AI Foundry, Enterprise AI Roadmap — dedicated pages for each service = better keyword targeting. |
| 20 | **Google Analytics (GA4)** | Measurement ID `G-HBBNWHYFVK` active — tracks all visitor behavior, page views, sources. |

---

## REMAINING

### A. Code Changes (Claude implements in codebase)

| # | Item | What It Will Do For You |
|---|------|------------------------|
| 1b | **Fix blog listing SSR** | Blog listing page (`/resources/blog`) still has `'use client'` — Google sees a blank page. Fixing this makes ALL blog content crawlable. **High impact.** |
| 7 | **Alt text on all images** | Only 4 images have alt text. Adding descriptive alt text improves image search ranking + accessibility score. |
| 10 | **Next.js Image optimization** | Only 3 files use `<Image>` component. Converting `<img>` tags to Next.js `<Image>` enables lazy loading, WebP, responsive sizing — faster page load = better ranking. |
| 13 | **Author bio component** | Currently just "By Jalal" as text. A proper bio card with credentials, photo, social links builds E-E-A-T (Google's trust signal for expert content). |
| 16b | **Full accessibility audit** | 24 ARIA labels exist but incomplete. Proper heading hierarchy, roles, keyboard nav, contrast — Google increasingly rewards accessible sites. |
| 21 | **Meta/remarketing pixels** | No Facebook/LinkedIn pixels. Adding these lets you retarget visitors who left without converting — cheapest ad spend possible. |

### B. Accounts & Setup (Jalal does — all free)

| # | Item | What It Will Do For You |
|---|------|------------------------|
| 21 | **Google Search Console** | Submit sitemap, monitor which keywords bring traffic, find crawl errors. **Must do — without it, Google may take weeks longer to find your pages.** |
| 22 | **GA4 setup verification** | GA4 code exists but verify the property is receiving data at analytics.google.com. |
| 23 | **Google Business Profile** | Appear in Google Maps + local pack results for "AI training near me". Free, massive visibility. |
| 24 | **Bing Webmaster Tools** | Powers Bing + DuckDuckGo + Copilot search results. One-click import from Search Console. |
| 25 | **Trustpilot profile** | Social proof. Even 3-5 real reviews boost conversion and Google trust signals. |
| 26 | **Directory listings** | Clutch, GoodFirms, G2, Training Industry, Crunchbase — free backlinks from high-authority domains. Each one improves domain authority. |
| 27 | **Connectively (HARO)** | Get quoted in Forbes/TechCrunch level publications. One backlink from these = months of SEO work. |
| 28 | **MCT directory listing** | People searching Microsoft's trainer directory have highest purchase intent. |

### C. Content Creation (Jalal creates)

| # | Item | What It Will Do For You |
|---|------|------------------------|
| 29 | **Expand existing blog posts to 1,500+ words** | Google favors comprehensive content. Current posts are 400-600 words — expanding with real experience doubles ranking potential. |
| 30 | **2 new blog posts/week** | Each post is a new keyword door into your site. 2/week = 100+ indexed pages in a year. Compound growth. |
| 31 | **3 lead magnets (PDFs)** | AI Readiness Checklist, Roadmap Template, Use Cases guide — email capture in exchange for value. Builds your list. |
| 32 | **LinkedIn posting 3-5x/week** | Real training insights → drives traffic + builds personal brand. LinkedIn is where your buyers are. |
| 33 | **YouTube tutorials** | Screen recordings of what you teach. Embeds in blog posts. YouTube is the #2 search engine. |
| 34 | **Guest posts** | Microsoft Tech Community, Dev.to, Medium — backlinks + new audience discovery. |
| 35 | **Webinar → blog repurposing** | Transcribe webinars into blog posts + YouTube uploads. Multiply content 5-6x with minimal effort. |
| 36 | **Community participation** | Microsoft Q&A, Reddit, Stack Overflow, Quora — free traffic, backlinks, authority building. |

### D. Paid (when ready, small budget)

| # | Item | What It Will Do For You |
|---|------|------------------------|
| 37 | **Google Ads ($10-20/day)** | Target "Azure AI training", "Copilot Studio course" — immediate traffic while organic SEO builds. |
| 38 | **LinkedIn Ads** | Target IT leaders in India/Saudi — expensive but precise, promote lead magnets/webinars. |
| 39 | **Remarketing ads** | Show ads to past visitors — highest ROI ad spend since they already know you. |
| 40 | **Udemy course** | $10-20 intro course as top-of-funnel. Thousands discover you, some convert to enterprise. |

---

## Priority Order

1. **Google Search Console setup** (Jalal, 15 min) — unlocks everything
2. **Fix blog listing SSR** (code change) — makes all blog content visible to Google
3. **Google Business Profile** (Jalal, 20 min) — free local visibility
4. **Expand existing blog posts** (Jalal, ongoing) — compound growth
5. **Directory listings** (Jalal, 2-3 hours total) — free high-authority backlinks
6. **Author bio component** (code change) — builds E-E-A-T trust
7. **Alt text + accessibility** (code change) — quick ranking boost
8. **LinkedIn posting** (Jalal, daily habit) — drives traffic + brand
9. **Bing Webmaster Tools** (Jalal, 5 min) — covers Bing/DuckDuckGo/Copilot
10. **Lead magnets + newsletter** (Jalal, content creation) — email list building
