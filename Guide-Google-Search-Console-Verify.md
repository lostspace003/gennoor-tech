# Google Search Console — Verification & Health Check Guide

## Step 1: Confirm Your Property Is Verified

1. Go to **https://search.google.com/search-console**
2. Sign in with your Google account
3. In the left sidebar, check the **property selector** (top-left dropdown)
4. You should see `gennoor.com` listed. If it shows a green checkmark, it's verified.

**If you don't see it or it shows an error:**
- Click **"Add Property"** → choose **"Domain"** → type `gennoor.com`
- Google will give you a DNS TXT record like: `google-site-verification=XXXXX`
- Add this TXT record in your domain DNS settings (Hostinger or wherever your domain is managed)
- Wait 5-10 minutes, then click **Verify** in Search Console

---

## Step 2: Submit Your Sitemap

1. In Search Console, go to **Sitemaps** (left sidebar under "Indexing")
2. In the "Add a new sitemap" field, type: `sitemap.xml`
3. Click **Submit**
4. It should show status: **"Success"** after a few minutes
5. Check the "Discovered URLs" count — should show 80+ pages (blogs + services + guides)

**If sitemap was already submitted:**
- Check the "Last read" date — it should be recent
- Check "Discovered URLs" — if it shows 0 or very few, there's a problem

---

## Step 3: Check Indexing Status

1. Go to **Pages** (left sidebar under "Indexing")
2. Look at the chart:
   - **Green bar** = "Indexed" pages (these show up in Google)
   - **Gray bar** = "Not indexed" pages (these are invisible to Google)
3. **Target:** At least 50+ pages indexed (blogs + services + guides + static pages)

**If most pages are "Not indexed":**
- Click on the gray bar to see WHY
- Common reasons: "Discovered - currently not indexed", "Crawled - currently not indexed"
- For important pages, use URL Inspection (Step 4) to request indexing

---

## Step 4: Manually Request Indexing for Key Pages

1. Go to **URL Inspection** (top search bar in Search Console)
2. Paste each of these URLs one by one and click Enter:
   - `https://gennoor.com/`
   - `https://gennoor.com/resources/blog`
   - `https://gennoor.com/services/training`
   - `https://gennoor.com/services/copilot-studio-training`
   - `https://gennoor.com/services/ai-training-saudi-arabia`
   - `https://gennoor.com/services/ai-training-india`
   - `https://gennoor.com/about`
   - `https://gennoor.com/guides/ai-102-azure-ai-engineer`
3. For each URL:
   - If it says **"URL is on Google"** → Great, it's indexed
   - If it says **"URL is not on Google"** → Click **"Request Indexing"**
   - Google will queue it for crawling (takes 1-7 days)

---

## Step 5: Check Core Web Vitals

1. Go to **Core Web Vitals** (left sidebar under "Experience")
2. Check both **Mobile** and **Desktop** tabs
3. All URLs should show **"Good"** (green):
   - **LCP** (Largest Contentful Paint) < 2.5 seconds
   - **INP** (Interaction to Next Paint) < 200ms
   - **CLS** (Cumulative Layout Shift) < 0.1

---

## Step 6: Check for Errors

1. Go to **Pages** → look for any pages with errors (red)
2. Go to **Enhancements** → check for structured data errors:
   - **FAQ** — should show valid FAQ pages
   - **Breadcrumbs** — should show valid breadcrumbs
   - **Articles** — should show valid blog articles
3. Fix any errors flagged here

---

## Weekly Routine (5 minutes)

Every Monday, open Search Console and check:
1. **Performance** → Are impressions and clicks growing week over week?
2. **Pages** → Are more pages getting indexed?
3. **Core Web Vitals** → Any new issues?
4. **Top queries** → What keywords are people finding you for?

---

## What "Good" Looks Like After 30 Days

- 60+ pages indexed
- Sitemap status: Success
- Core Web Vitals: All Good
- Impressions trending upward in Performance tab
- Top queries showing AI-related terms
