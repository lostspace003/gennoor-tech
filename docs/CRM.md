# The CRM: leads, replies, the email series

Read this before changing anything under `src/lib/crm`, `src/components/crm`, `src/app/crm` or
`src/app/api/admin/leads`.

The owner's words (13 November 2026): "Make the CRM the best CRM. Very easy to eyes, very correct, very
professional, simple, and very easy to manage the leads and close them end to end in a better way, not
creating too many funnels." And his questions: how do we follow up, where do we see a reply, can the
assistant draft the reply, can we send to many at once, can we track them in one view.

## 1. The idea

- **One list of leads, one axis.** A lead stands at one step: New, Emailing, Talking, Proposal, Customer,
  Closed (`STEP_LABELS` in `src/lib/crm/types.ts`). No boards, no second pipeline, no scores.
- **Nine emails, sent by a person.** The series (`src/lib/crm/sequence.ts`) is fixed text. Nothing goes to
  a lead by itself: someone reviews and presses Send.
- **A reply drives the lead.** When a lead writes back, the CRM moves them and shows them; nobody has to
  notice first.
- **One page says what to do today.** Today (`/crm/queue`) lists the work top to bottom.

## 2. Where things are

| What | Where |
|---|---|
| The steps, the lead record | `src/lib/crm/types.ts` |
| The series: which email, when it is due | `src/lib/crm/sequence.ts`, the emails in `sequence-emails.ts` |
| What a reply means (pure, runs in the browser too) | `src/lib/crm/replies.ts` |
| Reading the mailboxes and bringing the leads in step | `src/lib/crm/reply-sync.ts`, `src/lib/crm/graph.ts` |
| The lists of the Today page and of the morning email | `src/lib/crm/today.ts` |
| Who may sign in, and to what | `src/lib/crm/users.ts` (see "Who may sign in" in `AGENTS.md`) |
| The screens | `src/components/crm/`: `QueueView` (Today), `LeadsView`, `OtherViews` (Replies, Meetings, Files), `LeadWorkspace` (one lead), `SendStep` (the send window) |
| The frame, the menu, questions and messages | `src/app/crm/shell.tsx`, `src/components/crm/CrmContext.tsx` |
| The store | one file of leads in the storage account (`src/lib/crm/store.ts`), copied every morning |

## 3. What a reply does

`applyReplies()` in `src/lib/crm/replies.ts` decides; `syncReplies()` in `reply-sync.ts` runs it on the
real mailboxes. It runs from the heartbeat every 15 minutes, whenever the CRM is open (every three
minutes), when the Replies page is opened, just before a series send, and before the morning email.

| They sent | What happens |
|---|---|
| A real reply | New or Emailing becomes **Talking**. The lead shows under "They replied" on Today, with a red number beside Replies in the menu, until we write back or someone presses "No reply needed". The series is no longer offered for them. |
| The ready-made "Not for us" of email 9 (subject "stop") | The lead is **Closed** and the series stopped. That is what the email promised. |
| Any other request to stop ("unsubscribe", "remove me", "not interested", the word stop alone) | The series is **stopped**. The step stays. The reply is shown to a person, with a "Close lead" button. |
| Out of office, a delivery failure, a meeting answer | Nothing. It is listed on the Replies page only when "Show automatic mail" is ticked. |
| A reply we answered from Outlook or a phone | It counts as answered: the check also reads what the team sent (`listRecentSentTo`). |

Rules that must stay:

- Read their **own words** only (`ownWords`): everything from "On ... wrote:" down is our own email quoted
  back, and it contains the word "stop" every time.
- The foot of every email says "Reply with the word stop and I will not write again." Never remove the
  code that keeps that promise.
- A closed or archived lead who writes back is still shown. A machine never reopens or closes a lead on a
  free-text reply; a person decides.
- The mailbox check reads the first lines of a message, never stores the body, and writes the store only
  when something changed. It leaves out mail from our own addresses (every outreach email is copied to
  admin and to its sender, and those copies used to push the real replies out of "the newest 50").

## 4. Today

`todayLists()` in `src/lib/crm/today.ts` puts every open lead on a person's desk in exactly one list, in
this order: **They replied**, **In conversation** (Talking and Proposal, quietest first; four quiet days
earn a "follow up" mark), **New leads, not yet picked up**, **Start the email series** and **Email N is
due**, **Missing an email address**, **Series finished, no reply**, **Waiting**. The morning email
(`/api/admin/crm-digest`) uses the same function, so the email and the page cannot disagree.

The row of six numbers at the top (`StepStrip` in `shared.tsx`) is the one view of where every lead
stands. It is on Today (as links) and on the Leads page (as the step filter). Do not add a board.

## 5. Sending

- The series is never sent to someone who is waiting for an answer from us. The server checks the
  mailboxes first, then refuses (`needsAnswer`); the send window says why.
- **60 emails an hour** from the CRM (`HOURLY_SEND_LIMIT`). The email service allows about 100 an hour for
  the whole site, and the codes that let learners sign in share that. On 12 November 2026 one large send
  used it up and every email of the site was refused for an hour. What does not fit is held back and
  said so; it is never queued in secret.
- Several leads at once: those whose next email is not due yet are left out unless the box is unticked.
  One lead can be taken out with the cross beside their name.
- Every email copies admin and the sender, and greets by the rule in `greeting.ts` (a name only when it is
  clearly a first name; never "there").
- The reply window writes a first draft by itself (`/api/admin/leads/generate-email`). A person reads,
  corrects and sends. Nothing drafted goes out by itself.

## 6. Asking before doing

Use `ask()` from `useCrm()`: a small window in the page, with a reason field when one is wanted and a red
button for a step that cannot be taken back. Never `prompt()`, `confirm()` or `alert()`: they look like
an error from the browser, cannot be styled, and stop the automated checks. Messages after an action go
through `notify()`.

Words on screen are plain: what happened and what to do next. Never the name of a service, a permission
or a status code on its own ("Microsoft Graph is not configured" became "Reading replies is not set up on
this site yet").

## 7. Checks

```bash
npx tsx scripts/crm-check.ts        # the rules above, with made-up leads and mail; must end with ALL OK
npx tsx --env-file=.env.local scripts/crm-replies-preview.ts   # the real mailboxes and leads, read only: what the next check would change, as counts
npx tsx --env-file=.env.local scripts/access-check.ts   # who gets in where (needs the built site; see the file)
```

The preview prints numbers only (never a name, an address or a word of a message) and writes nothing. Run
it after changing `replies.ts` or the mailbox reading in `graph.ts`. When Microsoft's mail service is slow
or failing (as on 13 November 2026, a long outage), a mailbox that does not answer in 12 seconds is left
out of that look, the screens say that a reply may be missing, and it is read again a few minutes later.

To look at the screens without real leads: run the site, and in a puppeteer script answer
`/api/auth/session` with a pretend session and `/api/admin/leads` and `/api/admin/leads/inbox` with
made-up data (the sign-in check did not run under `next dev` on the owner's machine on 13 November 2026;
if it does, see the note in the `gennoor-site-design` skill). Look at 1366 and 390 wide. Never photograph
or print real leads.

## 8. Not to do

- Do not send an email to try something. Not even one.
- Do not add a step, a score, a tag system or a second list of "stages".
- Do not make a machine send to a lead, close a lead on a free-text reply, or delete anything.
- Do not print or log a lead's name, address or message. Counts and ids only.
- Do not match an imported row to a lead by its position in the list (`upsertLeads` once filled in the
  blanks of the wrong person that way): match by the lead itself.
