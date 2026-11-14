# The CRM: leads, replies, the email series

Read this before changing anything under `src/lib/crm`, `src/components/crm`, `src/app/crm` or
`src/app/api/admin/leads`.

The owner's words (13 November 2026): "Make the CRM the best CRM. Very easy to eyes, very correct, very
professional, simple, and very easy to manage the leads and close them end to end in a better way, not
creating too many funnels." And his questions: how do we follow up, where do we see a reply, can the
assistant draft the reply, can we send to many at once, can we track them in one view.

## 1. The idea

- **One list of leads, one axis.** A lead stands at one step: New, Emailed, Talking, Proposal, Customer,
  Closed (`STEP_LABELS` in `src/lib/crm/types.ts`). No boards, no second pipeline, no scores. A step is
  named for what has happened, never for something in progress: the second step was called "Emailing"
  and the owner read it as "the email is still being sent".
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
| Has an email really gone (pure, runs in the browser too) | `src/lib/crm/delivery.ts`; the looking is in `delivery-sync.ts` |
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
| A real reply | New or Emailed becomes **Talking**. The lead shows under "They replied" on Today, with a red number beside Replies in the menu, until we write back or someone presses "No reply needed". The series is no longer offered for them. |
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

## 6. Has it gone?

The owner (13 November 2026) sent four emails, saw no copy arrive and asked: "why is it still showing
emailing? ... will I be receiving it?" The CRM used to write "sent" the moment the email service TOOK an
email. On an ordinary day the service finishes within two seconds, so the two were the same. That day
Microsoft's mail was slow: the service took every email, finished almost none for hours, and nobody could
tell. One of his four arrived after 64 minutes.

So each email has a state (`sendState()` in `src/lib/crm/delivery.ts`), and the screens say it:

| State | It means | What a person does |
|---|---|---|
| **on its way** | The email service has taken it and has not finished it. | Nothing. Never send it again: it is in the queue. |
| **sent** | Confirmed: the service finished it, or our own copy of it arrived in the admin mailbox. | Nothing. |
| **not confirmed** | A day has passed and nothing confirmed it. | Decide: "Send it again" on the lead's Emails tab makes that email due again. |
| **did not go** | The service refused it, or gave up on it later. | A series email is due again by itself; the lead goes back to New if it was their only email. |

`confirmSends()` in `delivery-sync.ts` looks for the proof, with the reply check (every 15 minutes from the
heartbeat, every three minutes while the CRM is open):

1. **Our own copy.** Every outreach email is copied to the admin mailbox. A copy with the same subject, to
   the same person, that arrived after the send is proof that the email has left (`matchCopies`).
2. **The email service**, by the number it gave the send (`emailSendState()` in `src/lib/email-service.ts`).
   Azure allows the whole site about 200 questions an hour and each send already uses up to two, so this
   asks six every ten minutes and goes round all the waiting emails. Do not raise that without counting.

Rules that must stay:

- "Sent" is never written on a screen for an email that nothing has confirmed.
- An email that is on its way, or that has gone, is never sent twice. Only a failed one, or one that
  nothing confirmed for a day, can go again, and only when a person says so.
- A series email that failed stops counting as sent (`failSend`), so the series does not move on by itself
  past an email that never went. (A person may still choose to send any email: section 10.)
- The number of a send is kept even while the send is still in progress (`sendNumberOf`). Before this it
  was kept only for a send that finished within the first seconds, so a slow one could never be asked about.
- Emails recorded before `TRACKED_FROM` count as sent: until that day every send finished at once.

What this cannot know: whether the lead's own mail server put the email in their inbox or in spam. "Sent"
means it left our email service.

## 7. Asking before doing

Use `ask()` from `useCrm()`: a small window in the page, with a reason field when one is wanted and a red
button for a step that cannot be taken back. Never `prompt()`, `confirm()` or `alert()`: they look like
an error from the browser, cannot be styled, and stop the automated checks. Messages after an action go
through `notify()`.

Words on screen are plain: what happened and what to do next. Never the name of a service, a permission
or a status code on its own ("Microsoft Graph is not configured" became "Reading replies is not set up on
this site yet").

## 8. Checks

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

## 9. The AI Weekend's own campaign

The AI Weekend is not part of the nine-email series. It has its own emails on its own page (Admin centre,
AI Weekend, Emails; `src/lib/weekend-emails.ts`, `src/app/api/admin/weekend/route.ts`), in two lists:

- **The campaign**, five emails that bring people in: Invitation, What you will see built, Is it for you?,
  Registration closes, Thank you. The first four go to people someone chooses, ticked from the leads
  ("Choose from the leads") or pasted; the thank-you goes to everyone registered. Their order can be changed
  by dragging, or with the arrows; the order is one for all weekends.
- **After someone registers**: How to pay, Reminder, Joining link, The kit.

Rules that hold for the campaign:

- Nothing goes by itself. A person chooses who gets an email and presses Send. At most 50 at a time: the
  email service allows the whole site about 100 an hour.
- Left out whatever is ticked or pasted: anyone already registered for that weekend, anyone who already had
  that email for that weekend, a lead whose emails were stopped or who replied "stop", and anyone who pressed
  Unsubscribe. If that last check cannot be read, nothing is sent.
- No amount in an email that goes to many people: the fee is in rupees in India and in dollars elsewhere.
- The only urgency is the real closing time: registration closes one day before the weekend
  (`closesWords`). No countdown, no seat count that nobody counted.

## 10. The Emails board and the tracker

The owner (14 November 2026): "I'll drag into the canvas and then I'll say send ... I hover over it, it will
tell me the timeline ... I can click on it, it will show a pop-up what was being sent", and "a dashboard canvas
feel, which makes it very easy for us to track individuals ... very simple filters but very effective".

**A lead's Emails tab is a board** (`src/components/crm/EmailBoard.tsx`).

- Left: the emails that can go, for the nine-email series or for the AI Weekend campaign. **Any of them can be
  sent next**: drag it onto the board (or press it), read the real email, press Send. The series no longer has
  to go in its written order.
- **The order is the lead's own.** Dragging one email onto another (or its arrows) changes the order of the
  emails not sent yet, for that lead only (`sequence.order`, `orderFor()` and `setOrder()` in
  `src/lib/crm/sequence.ts`). The next email, on Today and in a send to many, is the first one in that order.
- **The wait belongs to the rhythm, not to an email** (`gapAfter()`): the second email to go waits four days,
  the third six, whichever emails they are.
- Right: everything sent and received as cards, newest first, with five filters. Resting the pointer on a card
  says when it went and what became of it; pressing it opens what was sent.
- An AI Weekend email sent to a lead (from the board, or from the AI Weekend page) is written on that lead
  (`EmailRecord.weekend`, `src/lib/crm/weekend-outreach.ts`), so it shows here beside the series.
- A lead who replied and is waiting for an answer is sent nothing until that is answered; the board says so.
- A finger cannot drag: every card also works by pressing it, and the order has arrows. Keep both.

**Emails, in the menu, is the tracker** (`src/components/crm/EmailTracker.tsx`): one row a lead, one column an
email. The six numbers at the top are the filters. Pressing an email that went shows what was sent; pressing
one that has not gone opens the lead's board with that email ready (`?tab=emails&stage=<step>`). The emails
themselves (the plan and how each looks) are the second tab.

Try both with made-up leads before shipping a change to them: every request answered by the test, nothing
sent. Never open them with real leads in a script.

## 11. Not to do

- Do not send an email to try something. Not even one, unless the owner asks for that one email.
- Do not write "sent" for an email the email service has only taken (section 6).
- Do not add a step, a score, a tag system or a second list of "stages".
- Do not make a machine send to a lead, close a lead on a free-text reply, or delete anything.
- Do not print or log a lead's name, address or message. Counts and ids only.
- Do not match an imported row to a lead by its position in the list (`upsertLeads` once filled in the
  blanks of the wrong person that way): match by the lead itself.
