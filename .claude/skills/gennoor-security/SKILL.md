---
name: gennoor-security
description: Keeping gennoor.com safe whenever anything on it is built or changed - forms, addresses under src/app/api, sign-in, the chatbot, the blog studio, the CRM's documents, files in public/, emails, links and HTML. Use before adding or changing anything that takes words, a file name, an address, an email address or HTML from a visitor, from the browser or from a model; when asked "is it secure", "check for phishing", "can someone attack this"; when a tester or a scanner has tried something on the site; and before every pull request that touches those parts of the gennoor-tech repo.
---

# Keeping gennoor.com safe

The rules are in `docs/SECURITY.md`. **Read it first, all of it.** This file is the working order and
the mistakes that have already been made once.

The owner's words. 19 November 2026: "I just want it to be fully secure", and "Whatever you will implement,
keep this in the skill so that this is followed for the every single time on our website. For anything that
is updated, created, deleted, we are keeping this in mind." 20 November 2026: "add in skills what we are
doing so that in future the website follows this properly for any thing on website."

So this is not a special job done once. It is part of every change, like the look and like the checks
before a pull request.

## The order of work

1. **Before writing anything, answer four questions about what you are adding.**
   - Who may call it? Anyone, a signed-in learner, staff who work leads, a manager?
   - What arrives, and from whom? A visitor's form, something the browser sends back, words a model wrote.
     None of the three is trusted for what it says it is.
   - Where do those words end up? In a page as HTML, in an email, in a file name, in a question to the
     database, in a model's instructions, in a link.
   - What happens when it is called a thousand times in a minute? Who pays, and who stops getting email?
2. **Use the gate that exists.** Never write a second check of your own in one address: the next address
   forgets it.

   | You have | It goes through | Where |
   |---|---|---|
   | The name of a file to open, attach or delete | a list of ours, or `libraryBlob` / `isDocumentName` | `src/lib/email-service.ts` (`attachPDF`), `src/lib/crm/documents.ts` |
   | A value for a table filter | `odq()`, and a check against the known list or pattern | `src/lib/azure-storage.ts` |
   | A learner's email address, to find their record | `getLearner`, `saveLearner`, `updateLearnerFields` only | `src/lib/azure-storage.ts` |
   | HTML of an article (a model's or an editor's) | `cleanArticleHtml` | `src/lib/article-html.ts` |
   | HTML a learner typed (community, discussions) | `sanitizeHtml` | `src/lib/rich-text.ts` |
   | A visitor's text going into the HTML of an email | `escapeHtml` | `src/lib/escape-html.ts` |
   | A link the chatbot is about to show | `botLink` | `src/lib/bot/links.ts` |
   | A link inside an article, a source under it | `articleHref`, `referenceUrl` | `src/lib/article-html.ts` |
   | Who an email goes to, and its subject | one address checked by the form; `sendEmail` is the last gate | `src/lib/email-service.ts` |
   | Data written into a `<script>` tag | `ldJson` | `src/components/JsonLd.tsx` |
   | A value that must be one line | `oneLine` | `src/lib/article-html.ts` |

   If there is no gate for what you have, write ONE in `src/lib/`, add it to this table and to
   `docs/SECURITY.md`, and use it everywhere.
3. **Write the attack before the fix.** Add it to `scripts/attack-check.ts` with made-up data, run it and
   see it get through, then change the code until it does not.
4. **Check it (below).** Then say in the pull request what was tried and what was not.

## The check that is not optional

```bash
npx tsx scripts/attack-check.ts        # the attacks that once worked, on made-up data: must end ALL OK
npx tsc --noEmit && npx next build      # before every pull request
```

Also, when the change touches it: who may sign in, `scripts/access-check.ts` against the BUILT site; the CRM,
`npx tsx scripts/crm-check.ts`; the daily blog, `npx tsx scripts/blog-automation-test.ts`.

A new address under `src/app/api` is not finished until you can say, in the pull request, who may call it
and what stops everyone else. The sign-in check on pages (`middleware.ts`) does not cover `/api`: a staff
address starts with `verifyAdmin` or `requireCrmUser` itself.

## Mistakes already made here, so do not repeat them

- **A file was read by a name the browser sent.** The training enquiry form named the brochure it wanted; the
  server read whatever the name pointed at, from its own disk if need be, and emailed it to the address in the
  form. Any file of the server, its secrets included, could be emailed to a stranger.
- **`../` in a document's name left the document library.** `email-attachments/../../crm-data/leads.json`
  was the whole leads store, and a rule "only managers may delete" was passed because the name BEGAN with
  `email-attachments/`. Never decide anything from how a name begins before the name itself has been checked.
- **A spreadsheet of leads was put in `public/`.** Everything there is public.
- **Deleting a file from the project did not take it off the live site.** A deploy removes nothing from the
  server: 166 of the 167 files ever deleted from `public/` still answered. A file that must go is deleted on
  the server too, and its address is closed in `next.config.js` until then.
- **A question to the database was built from typed text.** `x' or PartitionKey ne '` as the name of a blog
  post returned every comment in the table.
- **A key threw away part of an email address.** Two addresses that differed by a "+" shared one learner
  record, and one person could set the other's password.
- **A link was judged by looking for "gennoor.com" in its text.** `https://gennoor.com.another-site/login`
  passed, so did `//another-site/pay`. Read a link with `new URL()` and judge the host it gives back.
- **One visitor's request shaped the answer saved for the next visitor.** Earlier turns the browser sent, a
  "name" that was an instruction, characters the saved key dropped. Anything shared between visitors may
  depend only on what is in its key.
- **A model's HTML went into the site as written**, with nobody reading it. Words written by a model from a
  web search are a stranger's words.
- **A class name was treated as harmless.** `fixed inset-0 z-50` is in the stylesheet and covers the window.
  Class names and tags are allowed from a list, never forbidden from one.
- **A form took a list where one address was meant**, and put the sender's own words in the subject. Our
  mail, our logo, a stranger's message, to as many people as they liked.
- **A check that only the browser makes is not a check.** A form may show a step ("enter the code we sent
  you") that the server never asks about. Whatever matters is checked again on the server.
- **"Fully secure" was asked for, and must never be answered with yes.** Say what was looked at, what was
  found, what was fixed and what nobody has checked.

## When someone has tried something on the site

1. Look at how the page showed what they typed. As plain text (`<h1>` visible as letters), it did nothing.
   As a red heading, a link or a pop-up, it worked.
2. Find every other place those words are shown or sent: emails first (a working link there carries our
   name), then the admin centre and the CRM, certificates, exports to Excel.
3. Search the saved enquiries and leads for the same address or name: they may have tried other forms.
4. Tell the owner plainly: what it was, whether it worked, what was checked and what was not.

## Do not, without being asked

- Try an attack against the live site. Use made-up data and the built site on this machine. Asking the live
  site for a page's headers, to see whether a file still answers, is fine.
- Open the server's files or read a secret, and never print one.
- Delete a record, an account or a file on the server.
- Change who may sign in (`src/lib/crm/users.ts`).

## Related

- What is still open from the review of November 2026: `docs/SECURITY.md`, section 5.
- Branch, pull request, merge, deploy: skill `gennoor-ship`.
