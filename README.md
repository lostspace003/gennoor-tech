# Gennoor Tech: where things stand (2026-10-24)

Everything below is live on gennoor.com unless marked pending. Written so you can pick the work up again later.

## Vision and rules to keep

- Vision line (Home and About): a world where anyone can learn the skills that work asks for, and prove them. Three pillars: Certification, Projects, Interactive learning, all in the Learning Studio. Live training and Expert sessions sit apart. Client and organisation messaging is on hold until you decide it.
- Never write "free" about courses, cards, the video or search data (courses may become paid).
- Authors on guides and blog: Gennoor Technical Team, not a person.
- Cards and their links must be aligned: icon, title, text, then the card's own link; centred, same pattern on every page.
- No credentials (PIN, password, code) are ever typed by Claude. GitHub token has no workflow scope, so automation runs inside the app.

## Learning Studio

- Lessons open paused at 0:00. Only the Resume button continues where the learner stopped.
- Clicking a lesson in the course outline signs in if needed, enrolls, and opens that lesson paused.
- Quiz and lesson text is markdown (code blocks, lists). Format and Course Factory rules: `docs/lms-course-format.md`.
- Course map bars: thin, equal width, as tall as each lesson is long.
- Ratings: asked after a module, every 5th lesson and at the end of the course, until the learner has rated once.
- Credentials page and a "Credentials" line on each course page: `src/data/credentials.ts` (edit this list after a new exam; numbers come from the Microsoft Learn transcript).
- Sign-in cookie covers gennoor.com and www.gennoor.com.
- Walkthrough video: `public/videos/learning-studio-walkthrough.mp4` (web copy) and `Learning Studio - Walkthrough (4K).mp4` in this folder. Scripts to re-record: `Desktop\studio-demo`.

## Search, indexing, SEO (automatic)

- CRM lead search runs on Qdrant (alias `crm_leads`, rebuilt 90 seconds after any lead change). Azure AI Search is deleted.
- Two minutes after every deploy the app indexes any published course that is not indexed yet and refreshes the assistant's site index. Details: `docs/course-index.md`.
- Sitemap, IndexNow and Search Console resubmits run after every deploy.

## Enquiries (new)

- Every form records where it came from (campaign tag, referrer, landing page, page sent from) plus a status.
- CRM screen: `/crm/enquiries` (status New, Replied, Closed; notes; count by source).
- LinkedIn link for the walkthrough post: `gennoor.com/studio?src=linkedin-walkthrough`.
- Older enquiries show source "direct".

## Waiting for you

- Design input for the exam guides and webinar pages (kept as placeholders). Blogs stay as they are.
- Check the "Notes" line in the LinkedIn post, or ask Claude to confirm how notes work.
- Decide the apex-to-www redirect (sign-in already works on both).
- Remove the unused AZURE_SEARCH_* lines from `.github/workflows/deploy.yml` when a workflow edit is possible.
- Delete the old Azure blobs of the removed showcase projects (`videos/safar-anbiya-full.mp4`, `videos/nanhe-momin-ep01.mp4`) if you approve.
- Certificates, welcome emails and the video watermark still say "Gennoor Academy".

## LinkedIn post (ready to paste)

```
Learn what the job actually asks for. 🎓

Gennoor Learning Studio

▪️ Certification courses · Cloud and AI
▪️ Project-based courses · Real production problems
▪️ Claude courses · Built on your industry's use cases
▪️ Customized courses · For your team

Inside every course:
✔ 4K video with captions and speed control
✔ Ask assistant · answers from the course itself
✔ Notes · saved at the moment you take them
✔ Quizzes · with code and explanations
✔ Discussion and polls
✔ Ratings and certificate
✔ Resume on any device

▶ Watch the walkthrough above. Link in the first comment 👇

#CloudCertification #AI #Claude
```

First comment: `Start here: gennoor.com/studio?src=linkedin-walkthrough` and the question "What problem at your work would you like a course to solve?"

Alt text: Narrated 4K walkthrough of Gennoor Learning Studio: browsing and filtering the course catalog, previewing and opening a course, signing in and enrolling, playing a lesson with captions and speed controls, asking the course assistant a question, taking a quiz, and joining discussions and polls.
