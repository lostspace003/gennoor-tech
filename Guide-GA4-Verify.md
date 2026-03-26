# Google Analytics 4 (GA4) — Setup Verification Guide

## Step 1: Find Your Measurement ID

1. Go to **https://analytics.google.com**
2. Sign in with your Google account
3. In the bottom-left, click the **gear icon** (Admin)
4. Under your property, click **Data Streams**
5. Click on your web stream (should show `gennoor.com`)
6. Copy the **Measurement ID** — it looks like `G-XXXXXXXXXX`

**If you don't have a property yet:**
- Click Admin → **Create Property**
- Name: "Gennoor Tech"
- Time zone: your local time zone
- Currency: USD or INR
- Click **Next** → choose "Business" → select "Examine user behavior"
- Click **Create** → choose **Web** → enter `https://gennoor.com`
- Copy the Measurement ID

---

## Step 2: Add Measurement ID to Vercel (Staging)

1. Go to **https://vercel.com/dashboard**
2. Select your **gennoor-tech** project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Key:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XPPTY9C6M1`
   - **Environment:** Select all: Production, Preview, Development
5. Click **Save**
6. **Redeploy** — go to Deployments tab → click the 3-dot menu on latest → Redeploy

---

## Step 3: Add Measurement ID to Azure (Production)

1. Go to **https://portal.azure.com**
2. Navigate to your **App Service** (gennoor-tech or whatever it's named)
3. Go to **Configuration** (left sidebar under Settings)
4. Under **Application settings**, click **+ New application setting**
   - **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX`
5. Click **OK** → Click **Save** at the top
6. The app will restart automatically

---

## Step 4: Verify GA4 Is Working

### Method 1: Real-time Report
1. Open **https://gennoor.com** in your browser (or the Vercel preview URL)
2. Go to **Google Analytics** → **Reports** → **Realtime**
3. You should see **1 active user** (that's you)
4. Browse a few pages on the site — you should see page views appearing in real-time

### Method 2: Browser DevTools
1. Open your site in Chrome
2. Press **F12** → go to **Network** tab
3. In the filter box, type `google-analytics` or `gtag`
4. Reload the page
5. You should see network requests to `www.google-analytics.com` or `www.googletagmanager.com`
6. If you see these requests with status **200**, GA4 is working

### Method 3: Google Tag Assistant
1. Install **Tag Assistant Legacy** Chrome extension
2. Visit your site
3. Click the Tag Assistant icon in Chrome toolbar
4. It should show a **green tag** for Google Analytics with your Measurement ID

---

## Step 5: Set Up Key Events (Conversions)

In GA4, go to **Admin** → **Events** and mark these as conversions:

| Event | What It Tracks |
|-------|---------------|
| `page_view` | Already tracked automatically |
| `form_submit` | When someone submits a booking/contact form |
| `click` (outbound) | Clicks to external links |
| `scroll` | 90% page scroll (already tracked by default) |

To track form submissions as conversions:
1. Go to **Admin** → **Events** → **Create Event**
2. Name: `book_call_submit`
3. Condition: `event_name equals form_submit` AND `page_location contains book-expert-call`
4. Save → then mark it as a **Key Event** (conversion)

---

## Step 6: Verify Page View Tracking Is Working

Your site already has a client-side page view tracker. To confirm:

1. Visit 5 different pages on your site
2. In GA4 → **Reports** → **Engagement** → **Pages and screens**
3. Set date range to "Today"
4. You should see the 5 pages you visited with view counts

---

## What "Good" Looks Like After 7 Days

- Realtime shows active users when you browse
- Pages and screens report shows all major pages
- Events are firing (page_view, scroll, click)
- No errors in the Realtime debug view
