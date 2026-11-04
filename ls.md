# LinkedIn Studio: what is pending

Status as of 4 Nov 2026. Only the LinkedIn work is listed here.

## You need to do

| # | Item | How |
|---|---|---|
| 1 | **Add the ads app secret** | LinkedIn Developers, app 265066422, **Auth** tab, **Show** next to Primary Client Secret. Then Azure portal, App Services, `gennoor-tech`, Environment variables, add `LINKEDIN_ADS_CLIENT_SECRET`. The same steps are on `/admin/linkedin`. `LINKEDIN_ADS_CLIENT_ID` and `LINKEDIN_ADS_ACCOUNT_ID` are already set. |
| 2 | **Connect the ads login** | `/admin/linkedin`, **Connect ads**, then **Create conversion rules**, then **Sync leads now**. |
| 3 | **Add a payment method to the ad account** | Campaign Manager, account 519832004. It shows "On hold: payment method required". Until then no ads run and no Lead Gen leads arrive. |
| 4 | **Wait for Community Management API approval** | Still "Review in progress". It is needed for posting as the company page through the page app and for some page-level actions. |
| 5 | **Test each new feature once on the live site** | See the next section. |

## Built but not yet tested against live LinkedIn

These compile and are deployed, but the LinkedIn calls have never run for real. If one is rejected, the error shows in the admin page.

- **Lead Sync:** form field names and the import into the CRM.
- **Conversions:** the types `QUALIFIED_LEAD`, `BOOK_APPOINTMENT` and `PURCHASE`, and the event payload.
- **Carousel PDF:** the document upload and post.
- **Events:** LinkedIn Event creation and the announcement post.
- **Teams link for events:** needs Microsoft Graph with calendar write permission on the admin mailbox.
- **Scheduling:** carousels, event announcements and LinkedIn Events go out from the 15-minute heartbeat, so they can be up to 15 minutes late.
- **Delete post:** from the "Scheduled and posted" list, or by pasting a post link.

## Not built

- **Ads cost and reporting screen** (spend, cost per lead). The scope is already granted.
- **LinkedIn click ID (`li_fat_id`) capture** on website forms. Email matching works without it.
- **Bulk invites or adding thousands of people:** not possible through LinkedIn's API. Use the page's own "Invite to follow", ads, or your email list pointing at the event pages.
- **Old blog articles** that contain first-person lines such as "I worked with a client". They have not been rewritten.
- **Page Specialties and Featured links:** done. External links cannot go in Featured, only LinkedIn posts. Two blog share posts are featured.

## Watch out for

- The page tagline reverted once after saving. It is set correctly now. If it flips back, another tab or session is overwriting it.
- The Azure CLI default resource group is wrong on this machine. Use `-g rg-gennoor-tech`.
- The studio container (`ca-gennoor-studio`) must be redeployed after any change under `services/studio-agents`. Last deployed: v7.
- The LinkedIn hub login lives in `ca-gennoor-linkedin-mcp` and is not affected by studio redeploys.

## Done

- Ads app connection, Lead Sync, Conversions and the setup guide.
- Events with Teams links, a public registration page, a LinkedIn Event and an announcement.
- Carousel PDFs, scheduling and post deletion.
- No first-person voice in new posts and blogs. Realistic images that build on the source page's own picture. GIF posts switched off in autopilot.
- Company page: tagline, About, specialties, phone, year founded (2026), banner and two featured posts.
