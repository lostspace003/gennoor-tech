# ADMIN_SECRET — Blog Comment Moderation Setup Guide

## What It Does

The `ADMIN_SECRET` environment variable protects the comment moderation API. It allows you to hide/delete spam or inappropriate comments from blog posts via a simple API call. Without it, anyone could delete comments.

---

## Step 1: Generate a Strong Secret

Use any random string generator. Here's a simple one — run this in your browser console (F12 → Console):

```javascript
crypto.randomUUID() + '-' + crypto.randomUUID()
```

This gives you something like: `a3f7b2c1-d4e5-6789-abcd-ef0123456789-f1e2d3c4-b5a6-7890-cdef-123456789abc`

Or just make up a long random string (32+ characters). Example:
```
gennoor-admin-2026-xK9mP4qR7wT2vN8jL5
```

**Save this secret somewhere safe** (password manager, secure note). You'll need it for API calls.

---

## Step 2: Add to Azure (Production)

1. Go to **https://portal.azure.com**
2. Navigate to your **App Service**
3. Go to **Configuration** → **Application settings**
4. Click **+ New application setting**:
   - **Name:** `ADMIN_SECRET`
   - **Value:** your secret string from Step 1
5. Click **OK** → Click **Save**
6. App will restart automatically

---

## Step 3: Add to Vercel (Staging)

1. Go to **https://vercel.com/dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key:** `ADMIN_SECRET`
   - **Value:** same secret string
   - **Environment:** Production, Preview, Development
5. Click **Save**
6. Redeploy for it to take effect

---

## Step 4: How to Moderate Comments

### View All Comments for a Blog Post

Open any browser or use curl:

```
GET https://gennoor.com/api/blog-comments?slug=what-are-ai-agents-enterprise-guide
```

This returns all approved comments with their `rowKey` (comment ID).

### Hide/Delete a Spam Comment

Use curl or Postman or any API tool:

```bash
curl -X DELETE "https://gennoor.com/api/blog-comments" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "what-are-ai-agents-enterprise-guide",
    "rowKey": "THE_COMMENT_ROW_KEY",
    "secret": "YOUR_ADMIN_SECRET_HERE"
  }'
```

**Replace:**
- `slug` — the blog post slug
- `rowKey` — the comment ID (from the GET response)
- `secret` — your ADMIN_SECRET value

### Using Postman (Easier)

1. Open **Postman** (download from postman.com if needed)
2. Create a new request:
   - **Method:** DELETE
   - **URL:** `https://gennoor.com/api/blog-comments`
   - **Body** (raw JSON):
     ```json
     {
       "slug": "the-blog-post-slug",
       "rowKey": "comment-id-here",
       "secret": "your-admin-secret"
     }
     ```
3. Click **Send**
4. Response `200` = comment hidden successfully

### Using Browser Console (Quick & Dirty)

On any page of your site, open F12 → Console and run:

```javascript
fetch('/api/blog-comments', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'the-blog-post-slug',
    rowKey: 'comment-id-here',
    secret: 'your-admin-secret'
  })
}).then(r => r.json()).then(console.log)
```

---

## Step 5: Moderation Workflow

1. **Daily check** (optional): Visit your top blog posts and scan comments
2. **When you see spam/abuse:**
   - Note the blog slug (from the URL)
   - Open browser console on that page
   - Run the GET request to find the comment's `rowKey`
   - Run the DELETE request with your secret
3. The comment is soft-deleted (hidden, not permanently removed from storage)

---

## Security Notes

- **Never share your ADMIN_SECRET** publicly or in code
- **Never commit it to git** — it's only in environment variables
- The API checks: if `secret` in the request body matches `ADMIN_SECRET` env var, the delete is allowed
- Without the correct secret, the DELETE endpoint returns 403 Forbidden
- Rate limiting is built in: max 5 comments per hour per email address
