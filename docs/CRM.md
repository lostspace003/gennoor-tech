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
  when something changed. It leaves out mail from our own addresses (an outreach email is copied to
  its sender, and such copies used to push the real replies out of "the newest 50").

## 4. Today

`todayLists()` in `src/lib/crm/today.ts` puts every open lead on a person's desk in exactly one list, in
this order: **They replied**, **In conversation** (Talking and Proposal, quietest first; four quiet days
earn a "follow up" mark), **New leads, not yet picked up**, **Start the email series** and **Email N is
due**, **Missing an email address**, **Series finished, no reply**, **Waiting**. The morning email
(`/api/admin/crm-digest`) uses the same function, so the email and the page cannot disagree.

The row of six numbers at the top (`StepStrip` in `shared.tsx`) is the one view of where every lead
stands. It is on Today (as links) and on the Leads page (as the step filter). Do not add a board.

## 4a. The Leads page

The owner (14 November 2026):

- **It opens on New**: the leads nothing has been sent to yet. A link that asks for a step or a view
  (`?step=`, `?scope=`) wins over that.
- **One step at a time.** Pressing another step moves to it; pressing the chosen one again shows every
  step. When the chosen step is empty and the other choices leave leads elsewhere, the list says how many
  and offers them.
- **A lead has a type: Technical professional or Business professional**, or it is not set (`profile` on
  the lead; `readProfile()` in `src/lib/crm/types.ts` is the one place that reads what someone typed).
  It is a column of the lead sheet ("Type"), a column and a filter of the list, a field when adding or
  editing a lead, and a column of the export. A sheet's type that is neither is left blank and the check
  before importing says so; it is never guessed. It is a fact about the person, not a step: it moves
  nothing and no email depends on it yet.
- **Every step, view and tab says what it is the moment the pointer is on it** (`Hint` in `shared.tsx`,
  a few words; the step words are `STEP_HINTS`). Not the browser's own `title`, which waits a second.
- **The page is held until a change shows.** `src/components/BusyPointer.tsx` holds the page from the
  press until the list has been read again, and the step control shows the chosen step at once
  (`StepSelect`). Before this the old step stayed on screen for some seconds and looked stuck.

## 5. Sending

- The series is never sent to someone who is waiting for an answer from us. The server checks the
  mailboxes first, then refuses (`needsAnswer`); the send window says why.
- **60 emails an hour** from the CRM (`HOURLY_SEND_LIMIT`). The email service allows about 100 an hour for
  the whole site, and the codes that let learners sign in share that. On 12 November 2026 one large send
  used it up and every email of the site was refused for an hour. What does not fit is held back and
  said so; it is never queued in secret.
- Several leads at once: those whose next email is not due yet are left out unless the box is unticked.
  One lead can be taken out with the cross beside their name.
- Every email copies the person who sends it, and nobody else (owner, 14 November 2026: the copy to the
  admin mailbox used up one of the hour's emails each time; the evening report replaces it, section 12),
  and greets by the rule in `greeting.ts` (a name only when it is
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
| **sent** | Confirmed: the email service finished it. | Nothing. |
| **not confirmed** | A day has passed and nothing confirmed it. | Decide: "Send it again" on the lead's Emails tab makes that email due again. |
| **did not go** | The service refused it, or gave up on it later. | A series email is due again by itself; the lead goes back to New if it was their only email. |

`confirmSends()` in `delivery-sync.ts` looks for the proof, with the reply check (every 15 minutes from the
heartbeat, every three minutes while the CRM is open):

1. **Our own copy** in the admin mailbox (`matchCopies`). Since 14 November 2026 outreach emails are no
   longer copied there, so this finds nothing for new emails; the proof is the email service, below.
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

## 12. The evening report

One email a day, at 19:30 India time (the evening run of `.github/workflows/scheduled.yml`, owner 27 November 2026: two runs a day), to Yusuf and Jalal with a copy to admin: what happened today
(emails sent and by whom, emails that did not go, replies, new leads, where every lead stands, AI Weekend
registrations, payments, website enquiries, learners), with an Excel file of the detail, one tab for each part.

- The counting is ordinary code in `src/lib/daily-report.ts`; no model writes or counts anything.
- `/api/admin/daily-report` is called by the evening run of `.github/workflows/scheduled.yml` with the cron secret.
  `?dry=1` answers with the numbers and sends nothing; `?day=YYYY-MM-DD` is another day.
- Who gets it: the settings `DAILY_REPORT_TO` and `DAILY_REPORT_CC`, or the two lines at the top of the route.
- `npx tsx scripts/daily-report-check.ts <folder>` makes the report from made-up people and writes the
  email and the Excel file into the folder, to look at.
- The amounts in it are for the three readers only. It is never sent to a list.

## 13. Paid customers

Someone who has paid for a course or an AI Weekend is a customer, not a prospect (owner, 14 November 2026).

- **Their own page:** CRM, "Paid customers" (`/crm/customers`): who, what they paid for, how much, when, and
  their lead. Read from the course purchases and the paid AI Weekend registrations; a refund is not a payment.
- **No promotional email:** their lead is marked `customer` and the email series is stopped with the reason
  "Paid customer" (`markCustomers` in `src/lib/crm/customers.ts`, run when the leads are read). The AI Weekend
  campaign leaves out every paid address, lead or not. The emails about what they bought (payment received,
  the joining link, the kit) still go, and so does the weekly email they subscribed to themselves.
- A lead is marked once. If a person starts the series again by hand for a customer, it stays started.
- They stay in the leads list, with a green "paid" mark.
- `npx tsx scripts/customers-check.ts` checks it with made-up people.

## 14. Coupon codes

The owner (14 November 2026): "at the time of checkout, do you have coupon code ... 20% off, 50% off, whatever
coupon code they apply ... they'll just enter and that will show the discounted price", and a code that takes
everything off lets them book with nothing to pay.

- **Made by staff**, Admin centre, Payments, "Coupon codes" (`src/app/admin/payments/Coupons.tsx`,
  `/api/admin/coupons`; managers only): how much it takes off (any percent; 100 leaves nothing to pay), until
  when, for how many people, and what it is good for: every course, one course, the AI Weekend, or every course
  and the AI Weekend. A code made before this day for "every course" stays for courses only.
- **Typed by the buyer**, in a field that is always in view: on a course page, under the Buy button
  (`CouponBox` in `CourseAccess.tsx`), and in the AI Weekend's registration form (`RegisterForm.tsx`). The
  lower price is shown before anything is paid. It began as a small link, "Have a coupon code?", and the owner,
  already inside the payment window, asked "where is coupon code option?". Never hide it behind a link again.
- **The payment window is Razorpay's own**: nothing of ours can be put inside it. So the field is also on the
  screen someone comes back to when they close that window ("Your seat is reserved"), and a code typed there is
  taken off the seat they hold (`applyCouponToSeat` in `src/lib/weekend-pay.ts`, through `/api/weekend/pay`).
- **The server decides the amount**, never the page: `couponProblem()`, `couponPrice()` (a course) and
  `couponAmount()` (the AI Weekend) in `src/lib/lms-coupons.ts`. The check a form makes uses nothing up; the
  code is checked again and counted when the course or the seat becomes theirs.
- **Nothing to pay**: a course opens at once (`grantCourseByCoupon`); an AI Weekend seat is confirmed at once
  (`/api/weekend/register`), and its email says "Your seat is confirmed" and never "payment".
- Each person counts once per course, or once per weekend. A seat or a course taken with a code shows the code
  on the Payments page, the AI Weekend list and the evening report. Someone who took a seat with a full code is
  listed with the paid customers, with the amount 0: they are attending, so they get no promotional email.
- `npx tsx scripts/crm-flow-test.ts` checks what a code is good for and what it takes off.

## 15. University partnerships

The owner (27 November 2026) gave the "Global University Partnership Toolkit" (27 universities in 21 countries, 55
contacts, a first email for each, an evaluation form) and asked for all of it inside the CRM "as a separate tab ...
end to end we will close", each university managed on its own, "a full dashboard for all of them to see how it's
moving and all analytics", the email through Outlook, the evaluation form as our own ("nothing on google ...
everything for ours"), its answers in the CRM, and that people can pick a university up and work it.

- **Where:** CRM, "Universities" (`/crm/universities`), then one page for each university (`/crm/universities/GEN-001`).
  Everyone who works in the CRM opens it, the people who work leads only included (`requireCampaignUser`, which every
  address of the campaign starts with).
- **Who works it.** Like a lead: anyone picks up a university nobody has; its holder or a manager releases it; only a
  manager gives it to someone, and only to a person on `CRM_USERS` (`POST /api/admin/universities`, `pick`, `release`,
  `assign`). The list shows who works each and filters on "Mine" and "Not picked up yet".
- **Apart from the leads.** The store is its own file, `crm-data/universities.json` (`src/lib/crm/universities-store.ts`),
  filled from the toolkit the first time the page opens (`src/data/university-partnership.ts`) and never filled again.
  Nothing here is on Today, in the email series, the Replies page or the evening report, and no lead is made.
- **Its own stages** (`UNI_STAGES`): New, Emailed, Replied, Evaluating, Call booked, Partner, Closed. A reply or an
  answer to the form moves New or Emailed to Replied. A machine never moves a university further or closes it; booking
  the call from the CRM moves it to Call booked, because a person pressed it. Closing asks for a reason.
- **The page is five tabs:** Dashboard (`UniversityDashboard`: the funnel, form answers, who needs a person now, emails by
  day, waves and regions, calls to come, courses chosen; every number comes from `campaignStats` in
  `universities-stats.ts`, the same that the list uses), Universities (the list), Form answers (every answer; one that
  came through the general link is put on its university here), Emails (one row each) and Setup (the form, the Excel
  file, the steps, the courses, the markets).
- **One university's page** says the one thing to do next (`nextStep`: send, write again after five days, answer a reply,
  give access, ask for the debrief call, record the outcome) and holds who works it, its email, overview (with "Book the
  Teams call"), contacts, evaluation (the form's answers, the seven courses, two representatives, the dates) and activity.

### The evaluation form (our own page)

- **`/evaluate/<key>`**, one link for each university, made from a 24-character key the store gives it
  (`formKey`, `newFormKey`, `formLinkOf`). The key is never typed by anyone and cannot be guessed from another. The page
  opens with the university's name, place and department filled in; its answer lands on that university. **`/evaluate`**
  is the general link, for anyone the email was forwarded to; its answers wait under Form answers ("Put it there").
  An unknown key shows the general form and says nothing about which keys exist.
- **The look:** a page of its own, no site menu (`isEvaluateRoute` in `src/lib/chrome.ts`, and the same in
  `THEME_SCRIPT`), always the light paper look: the logo band of our emails at the top, what the university gets and
  the Claude Partner card on the left, the form in numbered steps on the right, the seven courses as cards to tick.
  Kept out of search results (`noindex`). The Microsoft Form made on 27 November 2026 under admin@ is not used.
- **What it takes** (`POST /api/universities/evaluate`, anyone may call it): five answers per visitor in half an hour, at
  most 20,000 characters, every field rebuilt by `cleanFormAnswer` (named fields only, each cut to its length; a course,
  an area or a choice that is not ours is dropped; one or two people, each with a real address). The university comes
  only from the key, never from the name typed. A hidden field filled in means a machine: it is told "thank you" and
  nothing is kept.
- **What an answer does** (`applyFormAnswer`): it is kept on the university (the last ten), its courses and people go on
  the evaluation unless access has already been given, and the stage moves to Replied at most. Two emails go from admin@
  through Outlook: the answer to admin@ with Jalal and Yusuf in copy, and a fixed thank-you to the first representative
  that names only our courses. If they cannot go, the answer is kept anyway.

### The emails

- **Sent through Outlook** from `admin@gennoor.com` (`sendFromOutlook` in `graph.ts`), so each sits in that mailbox's Sent
  Items and a reply threads under it; `jalalkhan@` and `yusufchaudhary@` always in copy (`CAMPAIGN_CC`), signed as Jalal.
  What goes out is what is saved on the university, read by the server (`send/route.ts`): the browser sends only which
  university. It is refused while a square-bracket sentence is still to be written, while an email to that university
  has already gone (unless the person chose "Send another"), and past the hour's limit (`sentThisHour`: leads and
  universities share the 60). Pressing twice cannot send twice: the university is held for two minutes while it goes.
- **The HTML** (`campaignEmailHtml`): the person's words as paragraphs on the light email frame (`emailShell`), the
  Claude Partner card under the first paragraph that names Claude, and a "Choose your courses" button under the
  paragraph that holds the university's form link. "See it as they will" draws that same HTML in the CRM, on a white
  page that runs nothing; "Open as a page" opens it in a tab of its own (`campaignEmailPage`).
- **After the first one** (`src/data/university-templates.ts`, "Start from" above the editor): Follow-up (no answer after
  five days, answers the first email and carries the form link), Access is ready (lists the courses; how to sign in is
  left in square brackets for a person to write, so it cannot go without it), Ask for the call. A template only fills the
  editor: a person reads it and presses Save or Send.
- **The call** ("Book the Teams call" on Overview, `meeting/route.ts`): a Teams meeting on the admin calendar, 20 to 60
  minutes, with the people ticked and Jalal and Yusuf; Microsoft sends the invitations. The date and the join link are
  kept on the university.
- **Has it gone, did they write back?** `check/route.ts`, when the page opens, every five minutes while it is open and on
  "Check replies": an Outlook send counts as gone when Outlook takes it; it reads the team mailboxes for mail from a
  university's addresses (`replyOwner`: the sender, or the same mail domain, never a free webmail domain, never mail from
  before our first email, never an automatic reply).
- **What the emails say about Gennoor (owner, 27 November 2026).** Where Claude is first named, the Claude Partner Network
  badge and the line "Gennoor is Certified in the Claude Partner Network." sit on their cream card
  (`partnerCardHtml`), word for word, never recoloured. The work for King Saud University, Taibah University, MCIT Saudi
  Arabia, the Government of Bahrain, Bank of Tanzania, Microsoft ANZ and Tech Mahindra is Jalal's own ("I have personally
  delivered ...", never "Gennoor delivered"). Through Gennoor, only EY, on Agentic AI for Power Platform, Agentic AI for
  Copilot Studio and Claude Cowork for business professionals. No "Certified Services Partner", no "APAC", no price,
  nothing called "free".

### Checks

- `npx tsx scripts/universities-check.ts` checks all of it on the toolkit's own data and made-up mail and answers;
  `attack-check.ts` part 6 tries the form link, the public form, the recipients and the fields a browser may write.
  `npx tsx scripts/universities-fixture.ts <file>` writes made-up campaign data to look at the screens.
- Never send a university an email, or answer the form on the live site, to try something. The toolkit's own folder
  (`GENNOOR_University_Partnership_Toolkit/`) is not part of the site and is not committed.

## 16. The catalogue in an email

The owner (27 November 2026): one email with the catalogue "which we can send to any of the client, but that should be
optional". In a lead's email window, **Send our catalogue** fills a short message and ticks **Add our catalogue**: the
tall picture of the one-page catalogue goes into the email, linked to the PDF, and the PDF is attached. Both are our own
files on the site (`src/lib/crm/catalogue-email.ts`), fetched by a fixed address; the browser only says yes or no.
Nothing is added unless someone ticks it. The catalogue itself is made in `catalog/` (`catalog/README.md`).

## 17. Evaluation codes, and Introduce Gennoor (owner, 27 November 2026)

- **When a university submits the form**, two codes are made (`lms-coupons.ts`: 100% off every course, counted once for each person and course, as many uses as courses chosen, 90 days; the note starts `University evaluation`). "Access is ready" goes at once to the representatives through Outlook from admin@, with Jalal and Yusuf in copy, listing the courses and the codes, and is recorded on the university; its evaluation is marked given and it moves to Evaluating. "Ask for the call" stays a person's step.
- **The dashboard** of Universities shows the codes given and used, who enrolled with each, and how far they got (`/api/admin/universities/coupons`, progress from the Learning Studio).
- **Introduce Gennoor** in a lead's email window: the general first email in the designed look (`lib/crm/intro-email.ts`): the person's words, then who we are, what we do (every row a link), one button. Only `design: 'intro'` draws it.
- The Claude Partner card in our emails, the catalogue and the form links nowhere; every other link stays clickable.
- **Courses come from the live Learning Studio** (`courseChoices` in `src/lib/complimentary.ts`): a new published course appears in both forms by itself. Up to two courses, from dropdowns, each with "Explore the course" in a new tab. **One code per course** (that course only, 100%, 90 days), and every email pairs each course with its code.
- **Complimentary access** (`/complimentary-access`, in the menu under Learning Studio and as a band on the home page): anyone asks; admin@ gets it with Approve and Reject (signed links, seven days; the link opens a page and only its button decides). Approve makes the codes and emails them; Reject sends nothing. Its codes show in the same tracking panel.
