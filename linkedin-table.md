# LinkedIn at Gennoor: status table

Updated Oct 31, 2026

## 1. Admin pages (live after the latest deploy)

| Page | Link | What it is |
|---|---|---|
| LinkedIn connection and blog sharing | https://www.gennoor.com/admin/linkedin | Connect LinkedIn, share blog posts, token expiry banner |
| Social studio | https://www.gennoor.com/admin/social | AI posts, polls, webinar announcements, images, LinkedIn Events |

Use the `www` address, since that is where the admin login lives.

## 2. Done

| Item | Status |
|---|---|
| LinkedIn connect/callback (OAuth) | Merged. Returns to the host you started on (www or non-www). |
| Share blog posts as you | Merged. Not yet tested against live LinkedIn. |
| AI-written posts (gpt-5.4) and images (gpt-image-2) | Merged. Both models tested working. |
| Polls (2 to 4 options, 1 to 14 days) | Merged |
| Webinar announcement mode | Merged |
| LinkedIn Event for a webinar (page) | Merged (PR #111). Not yet tested. |
| "i" help buttons on the admin pages | Merged |
| Token expiry warning | Merged |
| Second LinkedIn app (Gennoor Tech Page Publisher, ID 265066422) | Created, verified against the Gennoor page |
| New app redirect URLs (www and non-www) | Set |
| New app client ID and secret on the live site | Set (`LINKEDIN_PAGE_CLIENT_ID`, `LINKEDIN_PAGE_CLIENT_SECRET`) |
| Old app credentials, page ID, Foundry settings on the live site | Already set |
| Privacy page (LinkedIn API, ads, privacy contact) | Live |
| Conversions API access form | Submitted, in review |
| Community Management API request | Submitted, in review |
| Business email admin@gennoor.com verified for LinkedIn | Done |

## 3. LinkedIn approvals (new app)

| Product | Status |
|---|---|
| Share on LinkedIn | Approved |
| Sign In with LinkedIn (OpenID) | Approved |
| Events Management API | Approved |
| Community Management API | Review in progress |
| Conversions API | Review in progress |
| Advertising API | Review in progress |

## 4. What works today vs later

| Feature | Works now? |
|---|---|
| Post as you (text, image, poll, webinar) | Yes, once you click Connect LinkedIn |
| Share a blog post as you | Yes, same |
| Post to the Gennoor page | No, needs Community Management API approval |
| Create a LinkedIn Event for a webinar | After "Connect + company page" and a first test |

## 5. Pending

| Item | Who | Notes |
|---|---|---|
| Click Connect LinkedIn and do a first test post | You | https://www.gennoor.com/admin/linkedin |
| Watch admin@gennoor.com for LinkedIn and Microsoft Vetting Services emails | You | Verification can hold up the review |
| Fill the Community Management access form when it appears | You | 21 days from the request |
| Rotate the new app secret | You | It was pasted into chat; Generate a new Client Secret, then update `LINKEDIN_PAGE_CLIENT_SECRET` |
| Add admin@gennoor.com as app team member | You | Must be a LinkedIn connection of yours first |
| Test the Events feature | You, then me | Connect + company page, then Webinar, then Create LinkedIn Event |
| Fix anything the first real post or event reveals | Me | LinkedIn calls are written from docs, not yet tried live |
| Live Events access | You | Not requested on purpose; could affect the Community Management review |
| Advertising, Matched Audiences, Ad Library, Lead Sync forms | None | Skipped; not needed now |
| Animations (HTML cards to MP4) | Me | Not built; no Sora |
