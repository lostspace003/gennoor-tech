import type { CampaignPost } from '@/lib/promo-campaign'

/**
 * The posts that go out with the AI Weekend film. Written once, for a cycle of 14 weeks, then used again.
 *
 * Every one is its own idea: one thing that is built or taught on the weekend, or one reason to come.
 * They say only what the AI Weekend page says (src/data/ai-weekend.ts). So: no price, nothing called
 * "free", no promise of a result, no story about a past weekend or a past learner, no client names.
 * And, as in every LinkedIn post of ours, never the first person singular ("I", "my", "me"): the post
 * speaks to the reader as "you", and of the company as "we".
 *
 * `{when}` and `{dates}` are filled in when the post goes out, from the same dates the page shows:
 * "on 28 and 29 November" (or "this weekend, 28 and 29 November" in its last week) and "28 and 29 November".
 *
 * The shape is the house shape for LinkedIn (src/lib/linkedin-format.ts): the first line is the hook, in
 * **double asterisks**; short lines; a few bullets; the page address; three or four hashtags.
 * `share` is the short line the company page writes when it reposts the founder's post.
 */

/** Monday to Friday: a problem at work, what the weekend does about it, how to get there. */
export const WEEKEND_WEEKDAY: CampaignPost[] = [
  {
    id: 'w01',
    text: `**Claude keeps giving you generic answers. It is not the tool. It does not know your work yet.**

The first thing built on day one of the AI Weekend is a context file.

- Your role, your company, how you write
- Set up once, used in every chat
- The answers stop sounding like everyone else's

Six working demos, built live, step by step. The next one is {when}.

Reserve a seat: gennoor.com/ai-weekend

#Claude #AIForWork #Productivity #AITraining`,
    share: 'Why the AI Weekend starts with a context file, from our founder. The next one is {when}: gennoor.com/ai-weekend',
  },
  {
    id: 'w02',
    text: `**A messy spreadsheet goes in. A summary you can send upward comes out.**

That is the second demo of the AI Weekend: a weekly report in minutes.

- Start from the sheet you already have
- Ask in plain language
- Read it, correct it, send it

It is built from an empty screen, with every step explained. Then you get the files and do it with your own sheet.

Live online, {when}: gennoor.com/ai-weekend

#Excel #Claude #Reporting #AIForWork`,
    share: 'The weekly report, in minutes. One of six demos built live at the AI Weekend. Seats: gennoor.com/ai-weekend',
  },
  {
    id: 'w03',
    text: `**How much of your week is copy and paste between a chat window and your files?**

On day one of the AI Weekend, a connected workspace is set up in front of you.

- Claude reads your files
- It drafts directly, in place
- No pasting back and forth

It is one of six demos, each built live so you can see how it is done and why.

The last weekend of every month, Saturday & Sunday. Next: {dates}.

gennoor.com/ai-weekend

#Claude #Productivity #Workflows #AITraining`,
    share: 'Less copy and paste: the connected workspace demo from the AI Weekend. Next: {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w04',
    text: `**Think of one job you do by hand every single week.**

Day two of the AI Weekend is about that job.

- Map it: what starts it, the steps, the result
- Build it with Claude
- Now it runs when you ask

You watch it built live. After the weekend you get the kit and repeat it on your own task.

No coding background needed. The next one is {when}.

gennoor.com/ai-weekend

#Automation #Claude #AIForWork #Productivity`,
    share: 'One weekly task, automated live. Day two of the AI Weekend. Reserve a seat: gennoor.com/ai-weekend',
  },
  {
    id: 'w05',
    text: `**You can build a small working app by describing it. See how, on a Sunday morning.**

It is the fifth demo of the AI Weekend.

- No coding background needed
- You describe what it should do
- Claude builds it, step by step

If you can write a clear email, you can follow it.

Live online on Microsoft Teams, {when}.

gennoor.com/ai-weekend

#NoCode #Claude #AITraining #LearnAI`,
    share: 'A small working app, built by describing it. See it done live at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w06',
    text: `**Everyone talks about AI agents. Very few people have built one.**

The last demo of the AI Weekend is your first agent.

- You give it a goal
- It researches, drafts, and checks its own work
- You see when an agent is the right choice, and when it is not

Built live, step by step, with the kit to repeat it yourself.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#AIAgents #Claude #Automation #FutureOfWork`,
    share: 'From hearing about agents to building one. The closing demo of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w07',
    text: `**If you use AI only for emails and summaries, you are leaving most of it unused.**

That is who the AI Weekend is for. People who:

- Use AI for small things, with nothing that saves real time yet
- Explain their business again in every chat
- Edit every answer twice
- Want to build, and have not yet

Two mornings, six working demos, one kit to repeat them all.

{dates}, live online: gennoor.com/ai-weekend

#AIForWork #Claude #Upskilling #Productivity`,
    share: 'Who the AI Weekend is for. Two mornings, six working demos. gennoor.com/ai-weekend',
  },
  {
    id: 'w08',
    text: `**"Do you need to know how to code?" No.**

Everything in the AI Weekend is built by describing what you want in plain language.

- A context file
- A weekly report
- A connected workspace
- One task automated
- A small working app
- Your first agent

If you can write a clear email, you can follow it.

The last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#NoCode #Claude #LearnAI #AITraining`,
    share: 'No coding needed. Six demos, in plain language, at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w09',
    text: `**In a type-along workshop it is easy to fall behind, and then you stop listening.**

The AI Weekend works the other way.

- First you watch each demo built live
- Every step is explained, and why
- Then you receive the full kit and repeat it at your own pace

You follow the thinking without rushing to keep up.

Next: {dates}, live online.

gennoor.com/ai-weekend

#AITraining #Claude #LearnAI #Upskilling`,
    share: 'Watch it built, then do it yourself with the kit. How the AI Weekend teaches: gennoor.com/ai-weekend',
  },
  {
    id: 'w10',
    text: `**What do you take home from the AI Weekend? Everything that was used.**

The kit:

- Session notes
- Every prompt used
- The demo files
- Step-by-step guides
- A setup checklist

So on Monday you are not trying to remember. You open the guide and repeat the demo on your own work.

The next weekend is {when}.

gennoor.com/ai-weekend

#Claude #AIForWork #Productivity #SkillBuilding`,
    share: 'The kit: notes, every prompt, the files and the guides. Sent after the AI Weekend. gennoor.com/ai-weekend',
  },
  {
    id: 'w11',
    text: `**A recording cannot answer your question. A live session can.**

The AI Weekend is live. You watch each demo being built and ask as it happens.

- 8 hours with the trainer, across two days
- Six working demos
- Your questions answered live
- The complete kit afterwards

Saturday and Sunday, 10:00 AM to 2:00 PM IST, on Microsoft Teams.

Next: {dates}. gennoor.com/ai-weekend

#Claude #AITraining #LearnAI #AIForWork`,
    share: 'Live, not recorded: ask as it is built. The AI Weekend, {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w12',
    text: `**Two mornings. That is the whole commitment.**

The AI Weekend runs 10:00 AM to 2:00 PM IST on a Saturday and a Sunday.

- Saturday: from asking questions to getting work done
- Sunday: automate one task, then build your first agent

Your afternoons stay yours. The kit stays with you.

It is on the last weekend of every month. The next one is {when}.

gennoor.com/ai-weekend

#Claude #Upskilling #AIForWork #WeekendLearning`,
    share: 'Two mornings, six working demos. The AI Weekend, the last weekend of every month: gennoor.com/ai-weekend',
  },
  {
    id: 'w13',
    text: `**The difference between asking AI questions and getting work done is setup.**

Day one of the AI Weekend, in four parts:

- How Claude works, in plain words
- Projects, instructions and context
- Claude for documents, sheets and slides
- Skills and connectors

By the end of Saturday you have seen Claude set up to know your work, and to use your files.

Next: {dates}. gennoor.com/ai-weekend

#Claude #AIForWork #Productivity #AITraining`,
    share: 'Saturday at the AI Weekend: set Claude up to know your work. gennoor.com/ai-weekend',
  },
  {
    id: 'w14',
    text: `**Before you automate a task, write down three things: what starts it, the steps, and the result.**

That is how day two of the AI Weekend begins.

- Mapping a task: trigger, steps, result
- Building it with Claude
- Claude Code for people who do not code
- Agents: when to use one, and building yours

The aim: you can choose the next task yourself.

{dates}, live online: gennoor.com/ai-weekend

#Automation #AIAgents #Claude #Workflows`,
    share: 'Sunday at the AI Weekend: map a task, automate it, build an agent. gennoor.com/ai-weekend',
  },
  {
    id: 'w15',
    text: `**You do not need eight new tools. You need to use a few of them properly.**

What we work with in the AI Weekend:

- Claude and Claude Projects
- Claude Cowork and Claude Code
- Skills and Connectors (MCP)
- Excel and PowerPoint, which you already use

Six demos show how they fit together on real work.

The next one is {when}. gennoor.com/ai-weekend

#Claude #ClaudeCode #MCP #AIForWork`,
    share: 'Claude, Projects, Cowork, Code, Skills, Connectors, Excel and PowerPoint: what the AI Weekend works with. gennoor.com/ai-weekend',
  },
  {
    id: 'w16',
    text: `**Leading a team? See what is practical before you ask your people to adopt it.**

The AI Weekend gives you that in two mornings.

- Six real demos, not slides
- Built live, so you see what it takes
- Your questions answered as we go

Send a group: register each person, or write to admin@gennoor.com. We also run it as a private session for one organization.

gennoor.com/ai-weekend

#Leadership #AIAdoption #Teams #Claude`,
    share: 'For team leads: see what is practical before your team adopts it. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w17',
    text: `**Tired of explaining your business to AI in every new chat?**

You should only have to do it once.

- A context file holds your role, your company and how you write
- Projects keep the instructions and the files together
- Every new chat starts from there

Both are set up live on day one of the AI Weekend, and the kit shows you each step.

Next: {dates}. gennoor.com/ai-weekend

#Claude #Productivity #AIForWork #WorkSmarter`,
    share: 'Explain your business once, not in every chat. Day one of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w18',
    text: `**If you edit every AI answer twice, the problem is upstream.**

Generic in, generic out. The fix is not a cleverer prompt.

- Tell Claude who you are and how you write, once
- Give it your files, not a pasted piece of them
- Keep the instructions with the work

That is Saturday at the AI Weekend. Sunday we automate a task and build an agent.

{dates}: gennoor.com/ai-weekend

#Claude #AIForWork #Productivity #AITraining`,
    share: 'Stop editing every answer twice. What Saturday at the AI Weekend fixes: gennoor.com/ai-weekend',
  },
  {
    id: 'w19',
    text: `**"Claude Code" sounds like it is only for programmers. It is not.**

On day two of the AI Weekend there is a part called exactly this: Claude Code for people who do not code.

- You describe the result
- It does the building
- You check what it made

The same morning has the fifth demo: a small working app, built by describing it.

The next weekend is {when}.

gennoor.com/ai-weekend

#ClaudeCode #NoCode #Claude #LearnAI`,
    share: 'Claude Code for people who do not code. Part of day two of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w20',
    text: `**Not every task needs an AI agent. Knowing which ones do is the skill.**

A part of day two of the AI Weekend is called "Agents: when to use one, and building yours".

- A plain rule for when an agent is worth it
- One built live, from a goal
- It researches, drafts, and checks its own work

You see the judgement, not only the build.

Next: {dates}. gennoor.com/ai-weekend

#AIAgents #Claude #Automation #AIForWork`,
    share: 'When to use an agent, and how to build one. The AI Weekend, {dates}: gennoor.com/ai-weekend',
  },
  {
    id: 'w21',
    text: `**What do you need to join the AI Weekend? Less than you think.**

- To watch and ask questions: a stable internet connection
- To repeat the demos afterwards: a laptop and a Claude account
- The kit includes a setup checklist

No coding background. No special software to learn first.

Live online on Microsoft Teams, 10:00 AM to 2:00 PM IST, both days.

The next one is {when}. gennoor.com/ai-weekend

#Claude #LearnAI #AITraining #Upskilling`,
    share: 'What you need for the AI Weekend: an internet connection, and later a laptop and a Claude account. gennoor.com/ai-weekend',
  },
  {
    id: 'w22',
    text: `**Six things built in front of you in one weekend:**

- A context file, so the answers stop being generic
- A weekly report, in minutes
- A workspace where Claude reads your files
- One weekly task, automated
- A small working app
- Your first agent

Each from an empty screen, each explained step by step.

Then the complete kit is yours.

{dates}, live online: gennoor.com/ai-weekend

#Claude #AIForWork #Automation #AIAgents`,
    share: 'Six working demos in one weekend. The list, from our founder. gennoor.com/ai-weekend',
  },
  {
    id: 'w23',
    text: `**"AI can wait until work is quieter." Work does not get quieter.**

So the AI Weekend is built to fit around it.

- Two mornings, on a weekend
- You watch, you do not scramble to keep up
- The kit lets you repeat everything later, at your own pace

And it runs every month. If this one does not suit you, the next one will.

Next: {dates}. gennoor.com/ai-weekend

#Upskilling #Claude #AIForWork #FutureOfWork`,
    share: 'It runs every month, on a weekend, for two mornings. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w24',
    text: `**Claude can work on the documents, sheets and slides you already deal with.**

One part of day one of the AI Weekend is only about that.

- The documents you write and read
- The sheet behind your weekly report
- The slides you present

You see it done live, then repeat it with the demo files in your kit.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#Excel #PowerPoint #Claude #Productivity`,
    share: 'Claude for documents, sheets and slides. Part of Saturday at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w25',
    text: `**"Skills" and "connectors" are two words worth knowing if you use Claude at work.**

In plain terms:

- A skill teaches Claude how you want a kind of job done
- A connector lets it reach the tools and files you use

Both are covered on day one of the AI Weekend, and both are used in the demos that follow.

Live online, {dates}.

gennoor.com/ai-weekend

#Claude #MCP #AIForWork #LearnAI`,
    share: 'Skills and connectors, in plain words. Covered live at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w26',
    text: `**A good demo starts from an empty screen.**

Finished examples hide the hard part: how you get there.

In the AI Weekend every demo is built from nothing, and the trainer explains:

- What is being done
- Why it is done that way
- What each step is for

Then the kit gives you the same steps in writing.

The last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#AITraining #Claude #LearnAI #SkillBuilding`,
    share: 'Every demo starts from an empty screen. How the AI Weekend is taught: gennoor.com/ai-weekend',
  },
  {
    id: 'w27',
    text: `**Want your whole team to see the same thing at the same time?**

Two ways to do that with the AI Weekend:

- Register each person for the monthly weekend
- Or ask us for a private session for your organization

Write to admin@gennoor.com and we will arrange it.

Either way: two mornings, six working demos, and the kit for everyone who attended.

gennoor.com/ai-weekend

#Teams #AIAdoption #CorporateTraining #Claude`,
    share: 'Bring a group, or ask for a private session for your organization. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w28',
    text: `**Attend both days of the AI Weekend and you get a certificate of attendance.**

More useful is what comes with it:

- You have seen six working demos built
- You hold every prompt and file that was used
- You have a guide for each one

The certificate says you were there. The kit lets you do it again.

Next: {dates}. gennoor.com/ai-weekend

#Claude #Upskilling #AITraining #LearnAI`,
    share: 'A certificate for attending both days, and a kit to repeat every demo. gennoor.com/ai-weekend',
  },
  {
    id: 'w29',
    text: `**What could you build with Claude in one weekend?**

Come and see. That is the whole idea.

- Saturday: Claude set up to know your work, a weekly report, a connected workspace
- Sunday: a task automated, a small app, your first agent

Everything built live, step by step. Then the complete kit, so you can repeat it yourself.

The next one is {when}.

gennoor.com/ai-weekend

#Claude #AIForWork #AIAgents #Automation`,
    share: 'What could you build with Claude in one weekend? The film, and the page: gennoor.com/ai-weekend',
  },
  {
    id: 'w30',
    text: `**The task you should automate first is not the biggest one. It is the most repeated one.**

For day two of the AI Weekend, bring one to mind:

- You do it every week
- The steps are always the same
- The result is always the same shape

We map a task like that, then build it with Claude, live.

{dates}, 10:00 AM to 2:00 PM IST.

gennoor.com/ai-weekend

#Automation #Workflows #Claude #Productivity`,
    share: 'Which task to automate first? A plain rule, and a live build, at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w31',
    text: `**"Do you build during the session?" You watch first. On purpose.**

Each demo of the AI Weekend is built live and explained step by step, so you can follow the thinking.

After the weekend you receive the full kit:

- The notes and every prompt
- The demo files
- Step-by-step guides

Then you repeat every demo yourself, and apply it to your own tasks.

Next: {dates}. gennoor.com/ai-weekend

#Claude #LearnAI #AITraining #AIForWork`,
    share: 'Watch first, then build with the kit. A question people ask about the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w32',
    text: `**A project in Claude is where your instructions and your files live together.**

It sounds small. It changes how every chat starts.

- No re-explaining
- No re-uploading
- The same standard every time

"Projects, instructions and context" is one of the four parts of day one of the AI Weekend.

The next weekend is {when}.

gennoor.com/ai-weekend

#Claude #Productivity #AIForWork #WorkSmarter`,
    share: 'Projects, instructions and context: one part of day one of the AI Weekend. gennoor.com/ai-weekend',
  },
  {
    id: 'w33',
    text: `**If AI has not saved you real time yet, it is probably doing your small jobs, not your repeated ones.**

The AI Weekend moves you from one to the other.

- Day one: from asking questions to getting work done
- Day two: automate one task, then build your first agent

Six demos, built live. A kit to repeat them.

The last weekend of every month, Saturday & Sunday.

gennoor.com/ai-weekend

#AIForWork #Automation #Claude #Productivity`,
    share: 'From small jobs to repeated ones. What the two days of the AI Weekend are for: gennoor.com/ai-weekend',
  },
  {
    id: 'w34',
    text: `**Why is the AI Weekend on a weekend? Because that is when people who are busy all week can finally sit with one thing.**

It is taught live by our founder, Jalal Ahmed Khan, a Microsoft Certified Trainer.

- 8 hours live, across two mornings
- Six working demos
- Your questions answered as we go

The next one is {when}. You are welcome to join.

gennoor.com/ai-weekend

#Claude #AITraining #AIForWork #LearnAI`,
    share: 'Our founder on why the AI Weekend is a weekend. Next: {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w35',
    text: `**Cannot make this month's AI Weekend? It runs every month.**

Always the last weekend of every month, Saturday & Sunday. Always live online.

- From asking questions to getting work done
- Automate one task, then build your first agent
- The complete kit after the weekend

Each cohort has a fixed number of seats, so reserve yours when you know your dates.

The next one is {when}.

gennoor.com/ai-weekend

#Claude #AIWeekend #Upskilling #AIForWork`,
    share: 'It runs on the last weekend of every month. The next AI Weekend is {when}: gennoor.com/ai-weekend',
  },
]

/** Saturday and Sunday: slower and more personal. A thought to sit with, then the invitation. */
export const WEEKEND_WEEKEND: CampaignPost[] = [
  {
    id: 's01',
    text: `**Saturday is a good day for an honest question: what did you do by hand again this week?**

Most of us have one. A report. A sheet. The same email, written once more.

On the Sunday of the AI Weekend we take a task like that, map it, and automate it, live. Then you get the kit and do it with your own.

No coding. Two mornings. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Claude #Automation`,
    share: 'A Saturday question from our founder: what did you do by hand again this week? gennoor.com/ai-weekend',
  },
  {
    id: 's02',
    text: `**A slow Sunday thought: the tools are not the hard part. Starting is.**

You have heard about agents, automation, connected workspaces. You have not built one. That is not a failing. Nobody showed you from an empty screen.

That is all the AI Weekend is. Two mornings where six things are built in front of you, slowly, with the reasons explained.

It is on the last weekend of every month. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Claude #LearnAI`,
    share: 'Starting is the hard part. A Sunday note from our founder on the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's03',
    text: `**What would you do with a Saturday morning if it kept giving back, every week after?**

Here is one answer. Spend it watching Claude being set up to know your work: your role, your company, how you write.

It takes a morning to learn. After that, every answer starts closer to done.

That is day one of the AI Weekend. Day two, we automate a task and build an agent.

Next: {dates}, live online.

gennoor.com/ai-weekend

#WeekendLearning #Claude #AIForWork`,
    share: 'One Saturday morning that keeps giving back. Day one of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's04',
    text: `**Sunday evening. The week ahead is already on your mind.**

Somewhere in it is a job you will do exactly as you did last week. And the week before.

AI does not do everything. But a job with the same steps and the same result, every week, is one it can run when you ask.

We build one live on day two of the AI Weekend. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Automation #Claude`,
    share: 'The job you will repeat next week. A Sunday note on what day two of the AI Weekend is for: gennoor.com/ai-weekend',
  },
  {
    id: 's05',
    text: `**One of the best ways to learn something new is to watch someone do it slowly.**

Not a finished example. Not a slide. The real thing, from an empty screen, with the reasons said out loud.

That is how the AI Weekend is taught. Six demos, two mornings. You watch. You ask. Then you get the kit and do each one yourself, at your own pace.

The last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #LearnAI #Claude`,
    share: 'Learning by watching it done slowly. How our founder teaches the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's06',
    text: `**A weekend question for anyone who leads a team: what would you ask your people to adopt, if you had seen it work?**

It is hard to decide from articles. It is easier after two mornings of watching real work get done.

The AI Weekend is six live demos, from a context file to a first agent. Come yourself, bring a few of your team, or ask us for a private session.

Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #Leadership #AIAdoption`,
    share: 'For people who lead a team: see it work before you decide. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's07',
    text: `**Saturday morning, coffee, and one small promise to yourself: this month, build one thing with AI.**

Not read about it. Build it.

The AI Weekend is made for that promise. Two mornings, 10:00 AM to 2:00 PM IST. Six working demos, built live. A kit with every prompt and file, so the one thing you build is yours.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Claude #AIForWork`,
    share: 'This month, build one thing with AI. A Saturday note from our founder: gennoor.com/ai-weekend',
  },
  {
    id: 's08',
    text: `**Sunday has one great advantage: nobody is asking you for anything.**

It is the only time some of us can learn. So the AI Weekend is on a weekend, and it asks for two mornings, not two days.

You watch six demos being built. You ask what you want. Your afternoons stay yours. And the kit means nothing is lost if your attention drifts.

Next: {dates}, live online.

gennoor.com/ai-weekend

#WeekendLearning #Claude #Upskilling`,
    share: 'Why the AI Weekend asks for two mornings, not two days. From our founder: gennoor.com/ai-weekend',
  },
  {
    id: 's09',
    text: `**A thought for the weekend: AI answers feel generic because we treat every chat as a first meeting.**

Imagine a colleague who forgets who you are each morning. You would stop asking them for help too.

The fix is simple, and it is the first thing shown in the AI Weekend: a context file. Your role, your company, how you write. Set once.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Claude #AIForWork`,
    share: 'Why AI answers feel generic, and the first fix. A weekend thought from our founder: gennoor.com/ai-weekend',
  },
  {
    id: 's10',
    text: `**A Sunday thought on teaching: nobody remembers a slide about AI agents.**

What stays is watching one being given a goal, going off to research, drafting, and checking its own work. So it is built in front of you, from an empty screen.

That is the last demo of the AI Weekend.

It runs on the last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #AIAgents #Claude`,
    share: 'Nobody remembers a slide about agents. Our founder on the last demo of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's11',
    text: `**If you have been meaning to "get into AI properly", here is a gentle way to begin.**

No course to finish. No exam. No coding.

Two mornings, live online. You watch six things being built with Claude, from a simple context file to a first agent. You ask whatever you like. Afterwards you get the notes, the prompts, the files and the guides.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#WeekendLearning #LearnAI #Claude`,
    share: 'A gentle way to begin with AI: two mornings, six demos, one kit. gennoor.com/ai-weekend',
  },
  {
    id: 's12',
    text: `**A Sunday list. Six things worth your attention this month:**

How to tell Claude who you are, once.
How to turn a messy sheet into a report.
How to stop copying and pasting.
How to automate one weekly job.
How to build a small app by describing it.
How to build an agent.

That is the AI Weekend, in order. Six demos, two mornings.

Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #Claude #AIForWork`,
    share: 'The six demos of the AI Weekend, in order. A Sunday list from our founder: gennoor.com/ai-weekend',
  },
  {
    id: 's13',
    text: `**Weekends are for the things we keep postponing.**

Learning to really use AI is one of them for many of us. Not because it is hard. Because there is never a quiet hour.

So here is a quiet eight. Two mornings, the last weekend of every month, live online. It is built in front of you, you watch and ask, and the kit is yours afterwards.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Upskilling #Claude`,
    share: 'For the thing you keep postponing: eight quiet hours, over two mornings. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's14',
    text: `**One last thing before Monday.**

You do not have to change how you work all at once. Choose one task you repeat every week. Just one.

On day two of the AI Weekend we take one such task, write down what starts it, the steps and the result, and build it with Claude. Then you get the guide and do the same with yours.

It runs every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #Automation #Claude`,
    share: 'Choose one task. Just one. A note before Monday from our founder: gennoor.com/ai-weekend',
  },
]
