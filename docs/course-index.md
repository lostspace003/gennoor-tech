# Course content index (Ask bot)

The Ask bots of the video courses and the interactive courses answer from what the lessons actually say.
The lesson text (captions, chapter text) is cut into chunks of about 500 tokens, embedded, and kept in Qdrant.
Without the settings below nothing changes: the bots answer as before.

## One-time setup (about 5 minutes)

1. Create a free cluster at https://cloud.qdrant.io (free tier: 1 GB, enough for roughly 700 to 1,400 three-hour courses).
2. Copy the cluster URL and create an API key.
3. Set them on the web app: `az webapp config appsettings set -g rg-gennoor-tech -n gennoor-tech --settings QDRANT_URL=... QDRANT_API_KEY=...`
   To keep them across deploys, also add the two as GitHub secrets and two lines to the `az webapp config appsettings set` step of `.github/workflows/deploy.yml` (after `AZURE_SEARCH_ADMIN_KEY`): `QDRANT_URL="${{ secrets.QDRANT_URL }}"` and `QDRANT_API_KEY="${{ secrets.QDRANT_API_KEY }}"`.
   (The push that created this change could not edit workflow files, so this step is yours.)
4. Index the existing courses on a machine with `.env.local`: `npx tsx scripts/index-course.ts --all`.
   Optional: copy `docs/course-index/index-courses.workflow.yml` to `.github/workflows/index-courses.yml` to run it from the Actions tab.

## Every new course

- Publishing a video course in the admin indexes it in the background.
- Or run the workflow / script with the course slug (`ai-103`, `ia-ab-100` for interactive courses), `--new` (only courses with nothing indexed yet) or `--all`.
- Re-running is safe: chunks have fixed ids and a lesson's old chunks are replaced first.
- `--dry-run` shows chunk counts and the embedding cost without calling Qdrant or the embedding service.

## Size and cost (estimates)

- A 3-hour course is about 36,000 tokens of narration, about 70 chunks, about 0.7 MB in Qdrant.
- Embedding with text-embedding-3-small costs about $0.02 per million tokens: about $0.001 per course.
- Each question costs one embedding call plus one search.

## Files

- `src/lib/course-chunker.ts` chunking, caption and HTML parsing (pure).
- `src/lib/course-index.ts` Qdrant calls, indexing, search, grounding text.
- `scripts/index-course.ts`, `scripts/check-course-chunker.ts`.
- The chat routes `src/app/api/lms/chat/route.ts` and `src/app/api/academy/chat/route.ts` use the search.
