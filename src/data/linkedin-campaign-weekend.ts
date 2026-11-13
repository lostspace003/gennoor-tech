import type { CampaignPost } from '@/lib/promo-campaign'

/**
 * The posts that go out with the AI Weekend film. Written once, for a cycle of 14 weeks, then used again.
 *
 * Every one is its own idea: one thing that is built or taught on the weekend, or one reason to come.
 * They say only what the AI Weekend page says (src/data/ai-weekend.ts). So: no price, nothing called
 * "free", no promise of a result, no story about a past weekend or a past learner, no client names,
 * and nobody named as the trainer ("an industry expert").
 * The weekend is about AI, not one product: Claude is one of the assistants used, and is named only
 * where the thing itself is Claude's (skills, connectors).
 * And, as in every LinkedIn post of ours, never the first person singular ("I", "my", "me"): the post
 * speaks to the reader as "you", and of the company as "we".
 *
 * `{when}` and `{dates}` are filled in when the post goes out, from the same dates the page shows:
 * "on 28 and 29 November" (or "this weekend, 28 and 29 November" in its last week) and "28 and 29 November".
 *
 * The shape is the house shape for LinkedIn (src/lib/linkedin-format.ts): the first line is the hook, in
 * **double asterisks**; short lines; a few bullets; the page address; three or four hashtags.
 * `share` is the short line the company page writes when it reposts the founder's post.
 *
 * After changing a post: npx tsx scripts/campaign-check.ts
 */

/** Monday to Friday: a problem at work, what the weekend does about it, how to get there. */
export const WEEKEND_WEEKDAY: CampaignPost[] = [
  {
    id: 'w01',
    text: `**AI keeps giving you generic answers. It is not the tool. It does not know your work yet.**

The first thing built on day one of the AI Weekend is a context file.

- Your role, your company, how you write
- Set up once, used in every chat
- The answers stop sounding like everyone else's

Seven working demos, built live, step by step. The next one is {when}.

Reserve a seat: gennoor.com/ai-weekend

#AIForWork #Productivity #AITraining #GenerativeAI`,
    share: 'Why the AI Weekend starts with a context file. The next one is {when}: gennoor.com/ai-weekend',
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

#Excel #Reporting #AIForWork #Productivity`,
    share: 'The weekly report, in minutes. One of seven demos built live at the AI Weekend. Seats: gennoor.com/ai-weekend',
  },
  {
    id: 'w03',
    text: `**How much of your week is copy and paste between a chat window and your files?**

On day one of the AI Weekend, a connected workspace is set up in front of you.

- AI reads your files
- It reaches the tools you use
- No pasting back and forth

It is one of seven demos, each built live so you can see how it is done and why.

The last weekend of every month, Saturday & Sunday. Next: {dates}.

gennoor.com/ai-weekend

#AIForWork #Productivity #Workflows #AITraining`,
    share: 'Less copy and paste: the connected workspace demo from the AI Weekend. Next: {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w04',
    text: `**Think of one job you do by hand every single week.**

Day two of the AI Weekend starts with that job.

- Map it: what starts it, the steps, the result
- Build it with AI
- Now it runs when you ask

You watch it built live. After the weekend you get the kit and repeat it on your own task.

No coding background needed. The next one is {when}.

gennoor.com/ai-weekend

#Automation #AIForWork #Productivity #Workflows`,
    share: 'One weekly task, automated live. Day two of the AI Weekend. Reserve a seat: gennoor.com/ai-weekend',
  },
  {
    id: 'w05',
    text: `**A picture, a short video and a voice track, each made from a plain description.**

That is the third demo of the AI Weekend: pictures, video and sound with AI.

- Which kind of tool is good for which job
- How to describe what you want
- What comes out, and how to improve it

It is built live, so you see the whole path and not only the result.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#GenerativeAI #AIForWork #LearnAI #AITraining`,
    share: 'Pictures, video and sound with AI: the third demo of the AI Weekend. gennoor.com/ai-weekend',
  },
  {
    id: 'w06',
    text: `**Everyone talks about AI agents. Very few people have built one.**

On day two of the AI Weekend, your first agent is built in front of you.

- You give it a goal
- It researches, drafts, and checks its own work
- Then a small team of agents takes over, each with one job

Built live, step by step, with the kit to repeat it yourself.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#AIAgents #Automation #AIForWork #FutureOfWork`,
    share: 'From hearing about agents to seeing one built. Day two of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w07',
    text: `**If you use AI only for emails and summaries, you are leaving most of it unused.**

That is who the AI Weekend is for. People who:

- Use AI for small things, with nothing that saves real time yet
- Explain their business again in every chat
- Edit every answer twice
- Want to build, and have not yet

Two mornings, seven working demos, one kit to repeat them all.

{dates}, live online: gennoor.com/ai-weekend

#AIForWork #Upskilling #Productivity #LearnAI`,
    share: 'Who the AI Weekend is for. Two mornings, seven working demos. gennoor.com/ai-weekend',
  },
  {
    id: 'w08',
    text: `**"Do you need to know how to code?" No.**

Everything in the AI Weekend is built by describing what you want in plain language.

- A context file, and a weekly report
- A picture, a short video and a voice track
- A connected workspace
- One task automated
- Your first agent, then a team of agents

If you can write a clear email, you can follow it.

The last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#NoCode #LearnAI #AITraining #AIForWork`,
    share: 'No coding needed. Seven demos, in plain language, at the AI Weekend: gennoor.com/ai-weekend',
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

#AITraining #LearnAI #Upskilling #AIForWork`,
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

#AIForWork #Productivity #SkillBuilding #LearnAI`,
    share: 'The kit: notes, every prompt, the files and the guides. Sent after the AI Weekend. gennoor.com/ai-weekend',
  },
  {
    id: 'w11',
    text: `**A recording cannot answer your question. A live session can.**

The AI Weekend is live. You watch each demo being built and ask as it happens.

- 8 hours with an industry expert, across two days
- Seven working demos
- Your questions answered live
- The complete kit afterwards

Saturday and Sunday, 10:00 AM to 2:00 PM IST, on Microsoft Teams.

Next: {dates}. gennoor.com/ai-weekend

#AITraining #LearnAI #AIForWork #Upskilling`,
    share: 'Live, not recorded: ask as it is built. The AI Weekend, {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w12',
    text: `**Two mornings. That is the whole commitment.**

The AI Weekend runs 10:00 AM to 2:00 PM IST on a Saturday and a Sunday.

- Saturday: from understanding AI to using it on your work
- Sunday: automate your work, then build agents

Your afternoons stay yours. The kit stays with you.

It is on the last weekend of every month. The next one is {when}.

gennoor.com/ai-weekend

#Upskilling #AIForWork #WeekendLearning #LearnAI`,
    share: 'Two mornings, seven working demos. The AI Weekend, the last weekend of every month: gennoor.com/ai-weekend',
  },
  {
    id: 'w13',
    text: `**The difference between asking AI questions and getting work done is setup.**

Day one of the AI Weekend, in four parts:

- How AI works, and where it fits in your work
- AI for everyday operations
- Pictures, video and sound with AI
- Skills and connectors (MCP)

By the end of Saturday you have seen AI set up to know your work, and to reach your files and tools.

Next: {dates}. gennoor.com/ai-weekend

#AIForWork #Productivity #AITraining #GenerativeAI`,
    share: 'Saturday at the AI Weekend: from how AI works to your own tools. gennoor.com/ai-weekend',
  },
  {
    id: 'w14',
    text: `**Before you automate a task, write down three things: what starts it, the steps, and the result.**

That is how day two of the AI Weekend begins. Then, in order:

- Automate a workflow you repeat
- Build your first AI agent
- Agents that work as a team

The aim: you can choose the next task yourself.

{dates}, live online: gennoor.com/ai-weekend

#Automation #AIAgents #Workflows #AIForWork`,
    share: 'Sunday at the AI Weekend: automate a workflow, build an agent, then a team of agents. gennoor.com/ai-weekend',
  },
  {
    id: 'w15',
    text: `**You do not need twenty new tools. You need to use a few kinds of tool properly.**

What is worked with in the AI Weekend:

- Claude and other AI assistants
- AI tools for pictures, video and sound
- Skills and connectors (MCP)
- Agents
- Excel and PowerPoint, which you already use

Seven demos show how they fit together on real work.

The next one is {when}. gennoor.com/ai-weekend

#AIForWork #GenerativeAI #MCP #AIAgents`,
    share: 'AI assistants, tools for pictures, video and sound, skills, connectors and agents: what the AI Weekend works with. gennoor.com/ai-weekend',
  },
  {
    id: 'w16',
    text: `**Leading a team? See what is practical before you ask your people to adopt it.**

The AI Weekend gives you that in two mornings.

- Seven real demos, not slides
- Built live, so you see what it takes
- Your questions answered as we go

Send a group: register each person, or write to admin@gennoor.com. We also run it as a private session for one organization.

gennoor.com/ai-weekend

#Leadership #AIAdoption #Teams #AIForWork`,
    share: 'For team leads: see what is practical before your team adopts it. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w17',
    text: `**Tired of explaining your business to AI in every new chat?**

You should only have to do it once.

- A context file holds your role, your company and how you write
- It is set up once
- Every new chat starts from there

It is the first demo of the AI Weekend, and the kit shows you each step.

Next: {dates}. gennoor.com/ai-weekend

#Productivity #AIForWork #WorkSmarter #GenerativeAI`,
    share: 'Explain your business once, not in every chat. The first demo of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w18',
    text: `**If you edit every AI answer twice, the problem is upstream.**

Generic in, generic out. The fix is not a cleverer prompt.

- Tell the AI who you are and how you write, once
- Give it your files, not a pasted piece of them
- Connect it to the tools you use

That is Saturday at the AI Weekend. On Sunday we automate a task and build agents.

{dates}: gennoor.com/ai-weekend

#AIForWork #Productivity #AITraining #WorkSmarter`,
    share: 'Stop editing every answer twice. What Saturday at the AI Weekend fixes: gennoor.com/ai-weekend',
  },
  {
    id: 'w19',
    text: `**One AI agent is useful. A small team of them, each with one job, goes further.**

The last demo of the AI Weekend is a team of agents.

- Each agent has a single job
- They pass the work to each other
- You see how the jobs are divided, and why

It follows straight from the demo before it: your first agent.

The next weekend is {when}.

gennoor.com/ai-weekend

#AIAgents #MultiAgent #Automation #LearnAI`,
    share: 'A team of agents, each with one job. The last demo of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w20',
    text: `**Not every task needs an AI agent. Some need one. Some need a team.**

Day two of the AI Weekend shows all three, in order:

- One task automated: it runs when you ask
- Your first agent: give it a goal, and it researches, drafts and checks its own work
- A team of agents: each with one job

Seeing them side by side shows which to reach for.

Next: {dates}. gennoor.com/ai-weekend

#AIAgents #Automation #AIForWork #Workflows`,
    share: 'An automated task, an agent, a team of agents. Day two of the AI Weekend, {dates}: gennoor.com/ai-weekend',
  },
  {
    id: 'w21',
    text: `**What do you need to join the AI Weekend? Less than you think.**

- To watch and ask questions: a stable internet connection
- To repeat the demos afterwards: a laptop, and an account for the AI tools that were used
- The kit includes a setup checklist that names them

No coding background. Nothing to learn first.

Live online on Microsoft Teams, 10:00 AM to 2:00 PM IST, both days.

The next one is {when}. gennoor.com/ai-weekend

#LearnAI #AITraining #Upskilling #AIForWork`,
    share: 'What you need for the AI Weekend: an internet connection, and later a laptop. gennoor.com/ai-weekend',
  },
  {
    id: 'w22',
    text: `**Seven things built in front of you in one weekend:**

- A context file, so the answers stop being generic
- A weekly report, in minutes
- A picture, a short video and a voice track
- A workspace where AI reads your files
- One weekly task, automated
- Your first agent
- A team of agents

Each from an empty screen, each explained step by step. Then the complete kit is yours.

{dates}, live online: gennoor.com/ai-weekend

#AIForWork #Automation #AIAgents #GenerativeAI`,
    share: 'Seven working demos in one weekend. The list: gennoor.com/ai-weekend',
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

#Upskilling #AIForWork #FutureOfWork #LearnAI`,
    share: 'It runs every month, on a weekend, for two mornings. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w24',
    text: `**AI can work on the documents, sheets and slides you already deal with.**

The second part of day one of the AI Weekend is about everyday work.

- The sheet behind your weekly report
- The summary someone always asks for
- The files you already have

You see it done live, then repeat it with the demo files in your kit.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#Excel #PowerPoint #Productivity #AIForWork`,
    share: 'AI for everyday operations. Part of Saturday at the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w25',
    text: `**"Skills" and "connectors" are two words worth knowing if you use an AI assistant at work.**

In plain terms:

- A skill teaches the assistant how you want a kind of job done
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

#AITraining #LearnAI #SkillBuilding #AIForWork`,
    share: 'Every demo starts from an empty screen. How the AI Weekend is taught: gennoor.com/ai-weekend',
  },
  {
    id: 'w27',
    text: `**Want your whole team to see the same thing at the same time?**

Two ways to do that with the AI Weekend:

- Register each person for the monthly weekend
- Or ask us for a private session for your organization

Write to admin@gennoor.com and we will arrange it.

Either way: two mornings, seven working demos, and the kit for everyone who attended.

gennoor.com/ai-weekend

#Teams #AIAdoption #CorporateTraining #AIForWork`,
    share: 'Bring a group, or ask for a private session for your organization. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w28',
    text: `**Attend both days of the AI Weekend and you get a certificate of attendance.**

More useful is what comes with it:

- You have seen seven working demos built
- You hold every prompt and file that was used
- You have a guide for each one

The certificate says you were there. The kit lets you do it again.

Next: {dates}. gennoor.com/ai-weekend

#Upskilling #AITraining #LearnAI #AIForWork`,
    share: 'A certificate for attending both days, and a kit to repeat every demo. gennoor.com/ai-weekend',
  },
  {
    id: 'w29',
    text: `**What could you build with AI in one weekend?**

Come and see. That is the whole idea.

- Saturday: how AI works, a weekly report, pictures, video and sound, and a connected workspace
- Sunday: a task automated, your first agent, and a team of agents

Everything built live, step by step. Then the complete kit, so you can repeat it yourself.

The next one is {when}.

gennoor.com/ai-weekend

#AIForWork #AIAgents #Automation #GenerativeAI`,
    share: 'What could you build with AI in one weekend? The film, and the page: gennoor.com/ai-weekend',
  },
  {
    id: 'w30',
    text: `**The task you should automate first is not the biggest one. It is the most repeated one.**

For day two of the AI Weekend, bring one to mind:

- You do it every week
- The steps are always the same
- The result is always the same shape

A task like that is mapped, then built with AI, live.

{dates}, 10:00 AM to 2:00 PM IST.

gennoor.com/ai-weekend

#Automation #Workflows #Productivity #AIForWork`,
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

#LearnAI #AITraining #AIForWork #SkillBuilding`,
    share: 'Watch first, then build with the kit. A question people ask about the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w32',
    text: `**"Is it about one AI tool?" No. It is about working with AI.**

The AI Weekend covers:

- How AI works, and where it fits in your work
- Everyday operations
- Pictures, video and sound
- Skills and connectors
- Automation, agents, and teams of agents

Claude is one of the assistants used, and what you learn carries over to the others.

The next weekend is {when}.

gennoor.com/ai-weekend

#GenerativeAI #AIForWork #LearnAI #AITraining`,
    share: 'Not one tool: working with AI, from how it works to teams of agents. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 'w33',
    text: `**If AI has not saved you real time yet, it is probably doing your small jobs, not your repeated ones.**

The AI Weekend moves you from one to the other.

- Day one: from understanding AI to using it on your work
- Day two: automate your work, then build agents

Seven demos, built live. A kit to repeat them.

The last weekend of every month, Saturday & Sunday.

gennoor.com/ai-weekend

#AIForWork #Automation #Productivity #AIAgents`,
    share: 'From small jobs to repeated ones. What the two days of the AI Weekend are for: gennoor.com/ai-weekend',
  },
  {
    id: 'w34',
    text: `**Why is the AI Weekend on a weekend? Because that is when people who are busy all week can finally sit with one thing.**

It is led live by an industry expert, who builds every demo in front of you.

- 8 hours live, across two mornings
- Seven working demos
- Your questions answered as we go

The next one is {when}. You are welcome to join.

gennoor.com/ai-weekend

#AITraining #AIForWork #LearnAI #Upskilling`,
    share: 'Why the AI Weekend is a weekend. Next: {dates}. gennoor.com/ai-weekend',
  },
  {
    id: 'w35',
    text: `**Cannot make this month's AI Weekend? It runs every month.**

Always the last weekend of every month, Saturday & Sunday. Always live online.

- From understanding AI to using it on your work
- Automate your work, then build agents
- The complete kit after the weekend

Each cohort has a fixed number of seats, so reserve yours when you know your dates.

The next one is {when}.

gennoor.com/ai-weekend

#AIWeekend #Upskilling #AIForWork #LearnAI`,
    share: 'It runs on the last weekend of every month. The next AI Weekend is {when}: gennoor.com/ai-weekend',
  },
]

/** Saturday and Sunday: slower and more personal. A thought to sit with, then the invitation. */
export const WEEKEND_WEEKEND: CampaignPost[] = [
  {
    id: 's01',
    text: `**Saturday is a good day for an honest question: what did you do by hand again this week?**

Most of us have one. A report. A sheet. The same email, written once more.

On the Sunday of the AI Weekend a task like that is mapped and automated, live. Then you get the kit and do it with your own.

No coding. Two mornings. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Automation #AIForWork`,
    share: 'A Saturday question: what did you do by hand again this week? gennoor.com/ai-weekend',
  },
  {
    id: 's02',
    text: `**A slow Sunday thought: the tools are not the hard part. Starting is.**

You have heard about agents, automation, connected workspaces. You have not built one. That is not a failing. Nobody showed you from an empty screen.

That is all the AI Weekend is. Two mornings where seven things are built in front of you, slowly, with the reasons explained.

It is on the last weekend of every month. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #LearnAI #AIForWork`,
    share: 'Starting is the hard part. A Sunday note on the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's03',
    text: `**What would you do with a Saturday morning if it kept giving back, every week after?**

Here is one answer. Spend it watching AI being set up to know your work: your role, your company, how you write.

It takes a morning to learn. After that, every answer starts closer to done.

That is day one of the AI Weekend. On day two, a task is automated and agents are built.

Next: {dates}, live online.

gennoor.com/ai-weekend

#WeekendLearning #AIForWork #Productivity`,
    share: 'One Saturday morning that keeps giving back. Day one of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's04',
    text: `**Sunday evening. The week ahead is already on your mind.**

Somewhere in it is a job you will do exactly as you did last week. And the week before.

AI does not do everything. But a job with the same steps and the same result, every week, is one it can run when you ask.

One is built live on day two of the AI Weekend. The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Automation #AIForWork`,
    share: 'The job you will repeat next week. A Sunday note on what day two of the AI Weekend is for: gennoor.com/ai-weekend',
  },
  {
    id: 's05',
    text: `**One of the best ways to learn something new is to watch someone do it slowly.**

Not a finished example. Not a slide. The real thing, from an empty screen, with the reasons said out loud.

That is how the AI Weekend is taught. Seven demos, two mornings. You watch. You ask. Then you get the kit and do each one yourself, at your own pace.

The last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #LearnAI #AITraining`,
    share: 'Learning by watching it done slowly. How the AI Weekend is taught: gennoor.com/ai-weekend',
  },
  {
    id: 's06',
    text: `**A weekend question for anyone who leads a team: what would you ask your people to adopt, if you had seen it work?**

It is hard to decide from articles. It is easier after two mornings of watching real work get done.

The AI Weekend is seven live demos, from a context file to a team of agents. Come yourself, bring a few of your team, or ask us for a private session.

Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #Leadership #AIAdoption`,
    share: 'For people who lead a team: see it work before you decide. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's07',
    text: `**Saturday morning, coffee, and one small promise to yourself: this month, build one thing with AI.**

Not read about it. Build it.

The AI Weekend is made for that promise. Two mornings, 10:00 AM to 2:00 PM IST. Seven working demos, built live. A kit with every prompt and file, so the one thing you build is yours.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #AIForWork #LearnAI`,
    share: 'This month, build one thing with AI. A Saturday note: gennoor.com/ai-weekend',
  },
  {
    id: 's08',
    text: `**Sunday has one great advantage: nobody is asking you for anything.**

It is the only time some of us can learn. So the AI Weekend is on a weekend, and it asks for two mornings, not two days.

You watch seven demos being built. You ask what you want. Your afternoons stay yours. And the kit means nothing is lost if your attention drifts.

Next: {dates}, live online.

gennoor.com/ai-weekend

#WeekendLearning #Upskilling #AIForWork`,
    share: 'Why the AI Weekend asks for two mornings, not two days. gennoor.com/ai-weekend',
  },
  {
    id: 's09',
    text: `**A thought for the weekend: AI answers feel generic because we treat every chat as a first meeting.**

Imagine a colleague who forgets who you are each morning. You would stop asking them for help too.

The fix is simple, and it is the first thing shown in the AI Weekend: a context file. Your role, your company, how you write. Set once.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #AIForWork #Productivity`,
    share: 'Why AI answers feel generic, and the first fix. A weekend thought: gennoor.com/ai-weekend',
  },
  {
    id: 's10',
    text: `**A Sunday thought on teaching: nobody remembers a slide about AI agents.**

What stays is watching one being given a goal, going off to research, drafting, and checking its own work. So it is built in front of you, from an empty screen.

Then a small team of agents is built the same way, each with one job.

Those are the last two demos of the AI Weekend. It runs on the last weekend of every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #AIAgents #LearnAI`,
    share: 'Nobody remembers a slide about agents. The last two demos of the AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's11',
    text: `**If you have been meaning to "get into AI properly", here is a gentle way to begin.**

No course to finish. No exam. No coding.

Two mornings, live online. You watch seven things being built with AI, from a simple context file to a team of agents. You ask whatever you like. Afterwards you get the notes, the prompts, the files and the guides.

The next AI Weekend is {when}.

gennoor.com/ai-weekend

#WeekendLearning #LearnAI #AIForWork`,
    share: 'A gentle way to begin with AI: two mornings, seven demos, one kit. gennoor.com/ai-weekend',
  },
  {
    id: 's12',
    text: `**A Sunday list. Seven things worth your attention this month:**

How to tell AI who you are, once.
How to turn a messy sheet into a report.
How to make a picture, a short video and a voice track.
How to connect AI to your files and tools.
How to automate one weekly job.
How to build an agent.
How to build a team of them.

That is the AI Weekend, in order. Seven demos, two mornings.

Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #AIForWork #AIAgents`,
    share: 'The seven demos of the AI Weekend, in order. A Sunday list: gennoor.com/ai-weekend',
  },
  {
    id: 's13',
    text: `**Weekends are for the things we keep postponing.**

Learning to really use AI is one of them for many of us. Not because it is hard. Because there is never a quiet hour.

So here is a quiet eight. Two mornings, the last weekend of every month, live online. It is built in front of you, you watch and ask, and the kit is yours afterwards.

The next one is {when}.

gennoor.com/ai-weekend

#WeekendLearning #Upskilling #LearnAI`,
    share: 'For the thing you keep postponing: eight quiet hours, over two mornings. The AI Weekend: gennoor.com/ai-weekend',
  },
  {
    id: 's14',
    text: `**One last thing before Monday.**

You do not have to change how you work all at once. Choose one task you repeat every week. Just one.

On day two of the AI Weekend one such task is taken, with what starts it, the steps and the result written down, and built with AI. Then you get the guide and do the same with yours.

It runs every month. Next: {dates}.

gennoor.com/ai-weekend

#WeekendLearning #Automation #AIForWork`,
    share: 'Choose one task. Just one. A note before Monday: gennoor.com/ai-weekend',
  },
]
