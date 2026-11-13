import type { CampaignPost } from '@/lib/promo-campaign'

/**
 * The posts that go out with the film "What we do", twice a week, on days without an AI Weekend post.
 * Written once, for a cycle of 14 weeks, then used again.
 *
 * Every one is its own idea: one part of what Gennoor does. They say only what the film and the
 * presentation say (src/data/films.json, scripts/show/js/scenes-overview.js). So: no price, no course
 * called "free", no client names, no promise of a result, and the Claude Partner line word for word.
 *
 * `share` is the short line the company page writes when it reposts the founder's post.
 */
export const OVERVIEW_POSTS: CampaignPost[] = [
  {
    id: 'o01',
    text: `**Most training ends when the slides end. It should end when you can do the work.**

That one sentence is why Gennoor Tech exists.

- Watch a short lesson
- Practise in a lab you run yourself
- Build something real
- Prove it: a quiz, a project, a certificate

The film is 95 seconds. It shows what we do, and how.

Start here: gennoor.com

#AITraining #Upskilling #LearningAndDevelopment #FutureOfWork`,
    share: 'Why we exist, in one sentence and 95 seconds. From our founder. gennoor.com',
  },
  {
    id: 'o02',
    text: `**Our vision fits in one line: a world where anyone can learn the skills that work asks for, and prove them.**

"Prove" is the word that matters.

- Not "attended"
- Not "watched"
- Done, checked, and certified

Every course we make is built to end in something you can show.

See how: gennoor.com

#Upskilling #SkillBuilding #AITraining #FutureOfWork`,
    share: 'A world where anyone can learn the skills that work asks for, and prove them. Our vision: gennoor.com',
  },
  {
    id: 'o03',
    text: `**Every course at Gennoor Tech is built the same way. Five parts, every time.**

- Short video lessons
- Labs you run yourself, with a guide for every step
- An assistant inside the lesson, that answers from the course
- A quiz in every module
- A certificate at the end

Once you know the shape of one course, you know them all.

Watch a preview lesson: gennoor.com/studio

#LearnAI #AITraining #Upskilling #DigitalSkills`,
    share: 'The five parts of every Gennoor course. Preview lessons are open to watch: gennoor.com/studio',
  },
  {
    id: 'o04',
    text: `**You do not learn a skill by watching someone else do it. You learn it in the lab.**

So every course of ours has labs you run yourself.

- On your own machine
- With a guide for every step
- With the files included

Each module adds one working part, so the course ends with a finished project.

See a course: gennoor.com/studio

#LearnAI #SkillBuilding #AITraining #Upskilling`,
    share: 'Labs you run yourself, with a guide for every step. How our courses are built: gennoor.com/studio',
  },
  {
    id: 'o05',
    text: `**The hardest moment in online learning is being stuck at 11 at night with nobody to ask.**

So we put an assistant inside the lesson.

- Ask in your own words
- It answers from the course itself
- You never leave the video

Every course also has a discussion page, where learners talk with each other and with our team.

gennoor.com/studio

#LearnAI #AITraining #Upskilling #LearningAndDevelopment`,
    share: 'An assistant inside every lesson, that answers from the course. gennoor.com/studio',
  },
  {
    id: 'o06',
    text: `**Three ways to start learning with us, depending on where you are.**

- Prepare for a certification, and build the real thing while you prepare
- Build one real project, from start to finish
- Learn one useful skill, in about an hour

Different lengths. The same five parts inside each.

Browse them: gennoor.com/studio

#Upskilling #LearnAI #AITraining #DigitalSkills`,
    share: 'A certification, a project, or one skill in an hour. Three ways in: gennoor.com/studio',
  },
  {
    id: 'o07',
    text: `**Gennoor is Certified in the Claude Partner Network.**

What that means for someone learning Claude with us:

- A guide for every Claude certification
- A practice exam for each one
- Live training for teams
- Courses built around a use case in your field

See Claude at Gennoor: gennoor.com/claude

#Claude #AITraining #Upskilling #AIForWork`,
    share: 'Gennoor is Certified in the Claude Partner Network. What we offer for Claude: gennoor.com/claude',
  },
  {
    id: 'o08',
    text: `**Ready-made training teaches your team about someone else's work.**

For a team, we do it differently.

- First we learn your work
- Then we build the course around it
- Then we teach it live, online or at your office

The examples and exercises come from what your people do every day.

See how it works: gennoor.com/training

#CorporateTraining #LearningAndDevelopment #Teams #AITraining`,
    share: 'We learn your work, build the course around it, and teach it live. Training for teams: gennoor.com/training',
  },
  {
    id: 'o09',
    text: `**The best automation training does not teach automation. It automates one of your own processes, with your team.**

That is how we teach it.

- One process your team runs, chosen with you
- A course built on it, with your own examples and files
- Your people automate it themselves

And a person still checks the result.

gennoor.com/training

#Automation #CorporateTraining #AIForWork #Teams`,
    share: 'One process your team runs, and a course built on it. Automation training: gennoor.com/training',
  },
  {
    id: 'o10',
    text: `**If training is a regular need in your company, it deserves a home.**

We can set up a learning platform for you.

- Your courses
- Your people
- Your name on it

In the cloud or on your premises, built and set up by us.

Tell us what you need: gennoor.com/contact

#LearningAndDevelopment #CorporateTraining #Teams #Upskilling`,
    share: 'Your courses. Your people. Your name. A learning platform for your company: gennoor.com/contact',
  },
  {
    id: 'o11',
    text: `**"Show us it works first." A fair thing to ask before you commit to anything.**

So we build a prototype.

- One use case
- The scope agreed in writing before we start
- Tested on your own examples
- People stay in charge of checking

One process at a time.

How it works: gennoor.com/automation

#Automation #AIForWork #AIAdoption #Leadership`,
    share: 'See it work before you commit: a prototype on your own examples. gennoor.com/automation',
  },
  {
    id: 'o12',
    text: `**The simplest way to find out if we are for you: watch one lesson.**

There is nothing to sign up for.

- Open a course
- Play a preview lesson
- See how a lesson is built

If it is not for you, you have lost five minutes. That is what the preview lessons are there for.

gennoor.com/studio

#LearnAI #AITraining #Upskilling #DigitalSkills`,
    share: 'Start with a preview lesson. Nothing to sign up for. gennoor.com/studio',
  },
  {
    id: 'o13',
    text: `**Train. Innovate. Build. Our three words, and the work behind them.**

- Courses with labs, a quiz in every module and a certificate
- Live training for teams, built on their own work
- Automation training, on a process the team already runs
- A prototype first, if you want to see it work

The film shows it all in 95 seconds.

gennoor.com

#AITraining #Automation #Upskilling #AIForWork`,
    share: 'Train. Innovate. Build. The work behind our three words: gennoor.com',
  },
  {
    id: 'o14',
    text: `**Watch. Practise. Build. Prove.**

Four steps. Most training stops after the first.

- Watch: short video lessons, with captions
- Practise: labs you run yourself
- Build: a working part in every module
- Prove: a quiz in every module, a certificate at the end

That is the whole method.

gennoor.com/studio

#SkillBuilding #LearnAI #AITraining #Upskilling`,
    share: 'Watch. Practise. Build. Prove. The method behind every Gennoor course: gennoor.com/studio',
  },
  {
    id: 'o15',
    text: `**A course about your own work beats a course about someone else's.**

It sounds obvious. It is rarely done, because it takes time to learn a team's work first.

We take that time.

- We start with what your people do every day
- The exercises come from your context
- We teach it live, hands-on

Tell us about your team: gennoor.com/training

#CorporateTraining #Teams #LearningAndDevelopment #AITraining`,
    share: 'Training built on the work your people do. gennoor.com/training',
  },
  {
    id: 'o16',
    text: `**Two things every training buyer asks: how long, and what happens afterwards.**

How long: people learn from short lessons and labs first, so the trainer's time is kept for the hard parts. About 60% less classroom time is our aim. How much depends on the course and the team.

Afterwards: a doubt desk. A trainer answers, and the answer is kept for the next person.

Talk to us: gennoor.com/contact

#CorporateTraining #LearningAndDevelopment #Teams #Upskilling`,
    share: 'Less classroom time, and help that stays after the training. gennoor.com/contact',
  },
  {
    id: 'o17',
    text: `**Good learning is quiet. You should be able to follow a lesson with the sound off.**

So every lesson of ours has captions.

- Short lessons, at your own pace
- Captions on every one
- A discussion page for every course

Small things. They decide whether people finish.

See a lesson: gennoor.com/studio

#LearnAI #Upskilling #AITraining #DigitalSkills`,
    share: 'Captions on every lesson, and a discussion page for every course. gennoor.com/studio',
  },
  {
    id: 'o18',
    text: `**A certificate should come after a project, not instead of one.**

Our project courses work that way.

- One real project
- Built from start to finish
- A working part added in every module

By the end you have something that runs, and you made it.

Browse the project courses: gennoor.com/studio

#SkillBuilding #LearnAI #AITraining #Upskilling`,
    share: 'One real project, from start to finish. Our project courses: gennoor.com/studio',
  },
  {
    id: 'o19',
    text: `**Not everyone needs a forty-hour course. Sometimes you need one useful skill, today.**

That is what AI Essentials is for.

- One skill, in about an hour
- For every role, not only technical people
- Interactive, so you do it as you learn

Pick the one closest to your job.

gennoor.com/ai-academy

#LearnAI #Upskilling #AIForWork #DigitalSkills`,
    share: 'One useful skill, in about an hour, for every role. AI Essentials: gennoor.com/ai-academy',
  },
  {
    id: 'o20',
    text: `**Studying for a certification and learning to do the job should be the same hours.**

In our certification courses they are.

- You prepare for the exam
- You build the real thing while you prepare
- Labs on camera, quizzes as you go

Prepare for the exam, and keep a project you can show.

gennoor.com/studio

#Upskilling #AITraining #SkillBuilding #LearnAI`,
    share: 'Prepare for the exam and build the real thing. Certification courses: gennoor.com/studio',
  },
  {
    id: 'o21',
    text: `**The question we hear most about automation: "Will a person still check it?" Yes.**

It is how we work.

- The scope is agreed in writing
- It is tested on your examples
- People stay in charge
- One process at a time

Automation should take the repeated steps, not the judgement.

gennoor.com/automation

#Automation #AIAdoption #AIForWork #Leadership`,
    share: 'People stay in charge. How we work on automation: gennoor.com/automation',
  },
  {
    id: 'o22',
    text: `**What we teach teams, in one list.**

- Claude
- Microsoft AI
- Automation
- Microsoft official courses
- Exam preparation
- Custom courses, built on your own work

Live, online or at your office, hands-on. And for a team, we learn your work first, so the examples are your own.

See team training: gennoor.com/training

#CorporateTraining #AITraining #Teams #Upskilling`,
    share: 'Claude, Microsoft AI, automation and custom courses, taught live. gennoor.com/training',
  },
  {
    id: 'o23',
    text: `**What does Gennoor Tech do? We made a 95-second film, because a paragraph was not enough.**

In short:

- Courses for people who want a skill they can prove
- Live training for teams, built on their own work
- Automation training, on a process the team already runs
- A live AI Weekend, the last weekend of every month

The rest is in the film, and on the website.

gennoor.com

#AITraining #Upskilling #Automation #AIForWork`,
    share: 'What we do, in 95 seconds. gennoor.com',
  },
  {
    id: 'o24',
    text: `**Gennoor Tech is a company in Mumbai with one stubborn idea: knowledge should be practical.**

Practical means:

- You run the lab yourself
- The examples come from real work
- A quiz checks it has landed
- You finish with something to show

That is what "practical AI and cloud knowledge" means to us.

gennoor.com

#AITraining #Upskilling #LearnAI #FutureOfWork`,
    share: 'Practical AI and cloud knowledge, from Mumbai. gennoor.com',
  },
  {
    id: 'o25',
    text: `**The real questions come a week after the training, back at the desk.**

By then the training is usually over.

So we keep a doubt desk for the team.

- A learner asks, in their own words
- A trainer answers
- The answer is kept for the next person
- The course stays open

Help that stays.

gennoor.com/training

#CorporateTraining #LearningAndDevelopment #Teams #AITraining`,
    share: 'A doubt desk for your team: help that stays after the training. gennoor.com/training',
  },
  {
    id: 'o26',
    text: `**Once a month we open the doors: the AI Weekend.**

It is the easiest way to see how we teach.

- Two live sessions, Saturday and Sunday
- Seven working demos, built in front of you
- The complete kit afterwards

Each demo starts from an empty screen, and every step is explained. The last weekend of every month, online.

gennoor.com/ai-weekend

#Claude #AITraining #AIForWork #LearnAI`,
    share: 'The AI Weekend: two live sessions and seven working demos, every month. gennoor.com/ai-weekend',
  },
  {
    id: 'o27',
    text: `**Four people, four ways to begin with us.**

- You want one skill today: AI Essentials, about an hour
- You want a certification: a course with labs, where you build the real thing
- You lead a team: live training, built on your work
- You want to see it first: a preview lesson, or the AI Weekend

Find yours: gennoor.com

#Upskilling #AITraining #LearnAI #Teams`,
    share: 'Four ways to begin with Gennoor Tech. Find yours: gennoor.com',
  },
  {
    id: 'o28',
    text: `**If you remember one thing about Gennoor Tech, make it this: we build training to be done, not just watched.**

Everything else follows from that.

- Labs in every course
- A quiz in every module
- Team courses built on the team's own work
- Automation the team makes itself

Watch the film, then watch a preview lesson.

gennoor.com

#AITraining #SkillBuilding #Upskilling #LearningAndDevelopment`,
    share: 'Built to be done, not just watched. gennoor.com',
  },
]
