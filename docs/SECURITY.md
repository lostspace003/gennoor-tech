# Keeping the site safe: the rules, and why each one exists

Read this before changing anything that takes a file name, an address, a search value, an email address or
HTML from a visitor, from the browser or from a model. That is most forms, every address under `src/app/api`,
the chatbot, the blog studio and the CRM's document library.

How this guide came to be. On 16 November 2026 someone signed up to the Learning Studio with web code typed
into the name field. It did nothing: the page showed it as text. The owner then asked (19 November 2026):
"I just want it to be fully secure", and "Whatever you will implement, keep this in the skill so that this is
followed for the every single time". A review of the code followed. Every rule below is a hole that review
found and that has been closed. The words of each rule say what happened, because a rule with its reason is
kept and a rule without one is deleted by the next person in a hurry.

## 1. The idea

- **Nothing that arrives is trusted for what it says it is.** A name is not a name until it has been checked
  to be one. This holds for a visitor's form, for what the browser sends back to us (it can be changed on the
  way), and for what a model writes (a web page it read may have told it what to write).
- **One gate, in the library, not a check in each address.** A check that lives in one address is forgotten in
  the next one. Each rule below names the one function that everything goes through.
- **Say what is allowed, never what is forbidden.** A list of bad things always misses one.
- **A staff account is not the whole site.** Someone who works leads must not be able to reach the payment
  records or the files of another part of the storage.

## 2. The rules

### Files

**A file name or a path that came from a request is never used to find a file by itself.**

- The training enquiry form sent the name of the brochure wanted. The server read whatever that name pointed at,
  from its own disk if need be, and emailed it to the address in the form. Asking for the file that holds the
  server's settings would have emailed every secret of the site to a stranger. Now a brochure is picked from the
  site's own list and read from the file store only: `attachPDF` in `src/lib/email-service.ts`.
- The CRM's document library took the name of the document to open, attach or delete. The storage library reads
  `../` in a name the way a file system does, so `email-attachments/../../crm-data/leads.json` was not a document:
  it was the leads store. Anyone signed in to the CRM could download it, email it or delete it. Now every name
  passes `libraryBlob` in `src/lib/crm/documents.ts`, which checks its shape and then where the storage library
  says it really points. A route asks `isDocumentName` first and answers 400.
- **Nothing private goes in `public/`.** Every file there can be downloaded by anyone who knows or guesses its
  address. A spreadsheet of 166 leads sat in `public/downloads/` for four months.
- **Deleting a file from `public/` does not take it off the live site.** A deploy copies the new files over the
  old ones on the server and removes none. On 20 November 2026, 166 of the 167 files that had been deleted from
  `public/` over the years still answered on gennoor.com, the spreadsheet among them. A file that must go has to
  be deleted on the server as well (Azure, the App Service's own file manager), and until that is done its
  address is closed by a rule in `next.config.js` (`beforeFiles`, as for `/downloads`).

### Questions to the database

**Every value put into the text of a table filter goes through `odq()`** (`src/lib/azure-storage.ts`), whoever
it came from. Where a value should be one of ours (the name of a blog post, the id of a course), it is also
checked against the list or the pattern before the question is asked. A visitor who typed
`x' or PartitionKey ne '` as the name of a blog post was once given every comment in the table.

### One record, one person

**A key made from an email address must lose nothing of the address.** A learner's record was kept under the
address with every unknown character taken out, so `a.b+2@x.com` and `a.b2@x.com` shared one record. Whoever
owned the first mailbox could reset "their" password and then sign in as the second person.

- `findLearnerRow` in `src/lib/azure-storage.ts` decides whose record a row is. The old key is still read,
  because today's records are there, but a row found under it belongs to an address only when the address saved
  inside the row is that very address. Any other address gets a record of its own, under a key no two addresses
  share. Nothing was moved or deleted.
- `getLearner`, `saveLearner` and `updateLearnerFields` are the only way to a learner's record. Do not read the
  `Learners` table by a key you built yourself.
- A new table keyed by a person uses the whole address in lower case (as `pk()` in `src/lib/lms.ts` does), never
  a shortened or cleaned one.

### The chatbot

**What one visitor sends must never shape what the next visitor is told.**

- An answer to an opening question is saved for a day and given to everyone who asks the same. It may be saved
  only when the request is exactly one message, in plain words (`isPlainQuestion` in `src/lib/bot/links.ts`), and
  the model was told no name. Before, a request could carry earlier "assistant" turns of the sender's own
  writing, a "name" that was an instruction, or hidden characters the saved key drops.
- **Only our own links are shown**: a path on this site, a page on gennoor.com, an @gennoor.com address, the one
  WhatsApp number. `botLink` decides, on the server before an answer leaves and again in the widget before a
  link is drawn. It reads the address the way a browser does. The test that stood there before looked for
  "gennoor.com" anywhere in the text and passed `https://gennoor.com.another-site/login`.
- When the rules for what may be saved are tightened, change the mark in `questionKey` (`src/lib/bot/store.ts`),
  so answers saved under the old rules are not read again.

### Words written by a model

**HTML written by a model is rebuilt, not trusted.** A blog article is written from what a web search found, and
with the daily blog switched on it reaches the live site with nobody reading it first.

- `cleanArticleHtml` in `src/lib/article-html.ts` writes out again only the tags an article is made of, with the
  attributes and class names listed there, each value checked. Everything else becomes plain text. It runs where
  a body is saved (`createBlogDraft`, `reviseBlogDraft`, the editor's own changes), where it is read
  (`listBlogDrafts`, the admin preview) and where it becomes a page (`contentFile`).
- A new block for articles needs its class name added to `CLASSES` in that file. Never allow `style`, and never
  let a class through because it looks harmless: `fixed inset-0 z-50` is in the site's stylesheet and covers the
  whole window.
- A value that must be one line (a title, a summary) goes through `oneLine`. A line break in a title would have
  made the post's file a syntax error and stopped every later deploy.
- Structured data in a page is written with `ldJson` (`src/components/JsonLd.tsx`), so words inside it cannot
  close the script tag they sit in.
- **What this does not do.** The words of an article, and the outside pages it links to, are still chosen by a
  model. Cleaning stops code; it cannot tell a true sentence from a false one. Only a person reading the article
  before it is merged can. The daily blog is switched on and off on the Blog page of the admin centre; while it
  is on, its articles are merged with nobody reading them (`autoMerge` in `src/lib/blog-auto.ts`, which that
  page has no switch for). A draft published by hand has its own tick box, "Merge to the website automatically".

### Email

**One email, a few people, one line of subject.** `sendEmail` (`src/lib/email-service.ts`) refuses a recipient
that is not a valid address, more than 25 recipients, and line breaks in a subject. A form once accepted a list
in place of one address and put the sender's own words in the subject: our mail, our name, a stranger's message.
A form still checks its own fields first; the mailer is the last gate, not the only one.

## 3. The check

```bash
npx tsx scripts/attack-check.ts
```

It tries each attack above on made-up data (no network, no real record) and must end with `ALL OK`. Run it
after any change to the files named in this guide. When you close a new hole, add the attack to it first, see
it fail, then fix the code.

## 4. Before you add something

- **A new address under `src/app/api`**: who may call it? A staff address starts with `verifyAdmin` or
  `requireCrmUser`; the sign-in check on pages (`middleware.ts`) does not cover `/api`. A public one needs a
  limit and a length for every field.
- **A new place that shows HTML** (`dangerouslySetInnerHTML`): where do the words come from? If a visitor, a
  lead's email or a model can reach them, they pass a cleaner first.
- **A new link built from data**: read it with `new URL()`, check the host you get back, never the text.
- **A new file read, attached or deleted by name**: the name is chosen from a list of ours.

## 5. Not done yet (20 November 2026)

The review found more than is fixed here. Waiting, in this order:

1. The branch `security-hardening`: sign-in by emailed code, limits that a caller cannot dodge, safety headers,
   and three unused addresses to remove. Written, type-checked, not yet built or tried.
2. The review of the staff-only addresses stopped after its first finding and has to be run again.
3. The smaller findings of the review (limits on forms and on the bots, coupon guessing, certificates).
