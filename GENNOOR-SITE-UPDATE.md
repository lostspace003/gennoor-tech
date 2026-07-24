# Gennoor.com website updates required for YouTube API compliance

**Context for whoever implements this (human or Claude Code session):**
Gennoor Tech runs an automated YouTube channel **"AI in 45 Seconds"**
(https://www.youtube.com/@AIin45Seconds-gennoor), uploaded to via the YouTube Data API
by an internal tool. Google's API audit requires our privacy policy to disclose YouTube
API usage, and our homepage to clearly link the privacy policy. These changes must be
**live on https://gennoor.com before we submit the audit form.**

---

## CHANGE 1 (required) — Add a "YouTube API Services" section to the Privacy Policy

**File/page:** the page served at `https://gennoor.com/privacy`
**Where:** add as a new section before the final "Contact" section.
**Content — paste as-is (adjust heading style to match the page):**

---

### YouTube API Services

Gennoor Tech operates the YouTube channel **"AI in 45 Seconds"**
(https://www.youtube.com/@AIin45Seconds-gennoor). To publish and manage videos on our
own channel, we use an internal automation tool that accesses **YouTube API Services**.

- Our use of YouTube API Services is limited to **our own channel**: uploading our own
  videos, setting their titles and descriptions, posting comments from our channel, and
  reading our own channel's performance statistics.
- We do **not** collect, store, or process any data about YouTube users or visitors
  through the YouTube API. No third party can access YouTube data through our tool.
- Authorization tokens for our own account are stored encrypted in Microsoft Azure Key
  Vault and are never shared.
- By using YouTube API Services, we agree to be bound by the
  [YouTube Terms of Service](https://www.youtube.com/t/terms). Users interacting with
  our channel are subject to the [Google Privacy Policy](https://policies.google.com/privacy).
- To revoke any permission you may have granted to Google/YouTube services, visit your
  [Google security settings](https://security.google.com/settings/security/permissions).

---

Also update the "Last updated" date at the top of the privacy page.

## CHANGE 2 (required) — Privacy Policy link in the site footer

Confirm the footer of the **homepage** contains a clearly visible link labelled
"Privacy Policy" pointing to `/privacy`. If it already exists, no change needed —
just confirm.

## CHANGE 3 (recommended) — Add the YouTube channel to the site

- Add YouTube to the site's social links (footer and/or contact page):
  `https://www.youtube.com/@AIin45Seconds-gennoor`
- Optional but nice: mention the channel wherever Gennoor lists its content/media
  presence (e.g., "Watch our daily AI explainers on YouTube: AI in 45 Seconds").

## After deploying

Reply to the yt-autopilot session with **"site updated"**. It will then:
1. Verify https://gennoor.com/privacy shows the new section (live check)
2. Re-capture the two compliance screenshots
3. Proceed with the YouTube API audit submission
