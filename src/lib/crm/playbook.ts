// What to say on a call and in a client presentation. One place, read by the
// CRM's "Call guide" page, so every salesperson follows the same order as the
// email series. Plain data, safe to import in the browser.
//
// Rules that apply to everything here:
//  - No prices before you know team size and scope. Give a range on the call.
//  - No customer names without their written consent. No invented numbers.
//  - Claude Partner Network: only "Gennoor is Certified in the Claude Partner Network."

export interface CallStep {
  title: string
  /** How long this part should take. */
  time: string
  goal: string
  /** Words you can say as they are. */
  say: string[]
  /** Questions to ask. Empty when this part is you talking. */
  ask?: string[]
}

export const CALL_STEPS: CallStep[] = [
  {
    title: 'Open',
    time: '20 seconds',
    goal: 'Get permission to continue',
    say: [
      'Hello {firstName}, this is {me} from Gennoor Tech. Have I caught you at a bad time?',
      'I will be brief. We train corporate teams on AI and cloud, and I wanted to ask how {company} handles that today. Is that worth two minutes?',
    ],
  },
  {
    title: 'Understand',
    time: '5 minutes, they talk most',
    goal: 'Learn the four things a quote depends on, and what is in the way',
    say: ['Let them finish. Write down their words; you will use them later.'],
    ask: [
      'What training is planned for your team this year?',
      'How many people, and which teams?',
      'Would you want it online, or at your premises? Which city?',
      'When would you like them trained by?',
      'How do you run training today, and what do you wish were different?',
      'What happens if nothing changes this quarter?',
    ],
  },
  {
    title: 'Connect it to what they said',
    time: '2 minutes',
    goal: 'One offering, tied to their own words',
    say: [
      'You mentioned {their words}. That is the part we work on.',
      'Pick the ONE line below that fits what you heard. Do not list everything.',
    ],
  },
  {
    title: 'Agree the next step',
    time: '1 minute',
    goal: 'A date in the calendar',
    say: [
      'The useful next step is a 30-minute session with whoever plans training, where I show you the platform and a plan for your team. Would Thursday or Friday suit you?',
      'Who else should be in that meeting?',
      'I will send the invitation now, and a short note with what we discussed.',
    ],
  },
]

/** Pick one, by what they told you. */
export const BRIDGES: { when: string; say: string }[] = [
  { when: 'They want to try before buying', say: 'On our Learning Studio your team can watch the preview lessons of any course today, without signing up, and see how we teach before we talk about anything paid.' },
  { when: 'Training takes people away for too long', say: 'A usual course is three to five days in a classroom. We put the concepts and labs into short lessons people take on their own, and keep trainer time for questions. We aim to cut classroom time by about 60%.' },
  { when: 'Generic courses do not fit them', say: 'We build the course around your own processes and tools, so the examples are your work, not someone else’s.' },
  { when: 'They want their own platform', say: 'We can set up a learning platform for your organization, with your courses and your people only, and an assistant and a question board built in.' },
  { when: 'They ask about Claude', say: 'Gennoor is Certified in the Claude Partner Network. We run Claude training for teams, prepare people for the Claude certifications, and automate one process at a time.' },
  { when: 'Nobody helps after the training', say: 'After the training, learners post their doubts on the platform and a trainer answers, online or at your premises for the harder ones.' },
  { when: 'A small first step', say: 'We run a live AI Weekend on the last weekend of every month. It is a low-cost way for a few of your people to see how we teach.' },
]

export const OBJECTIONS: { they: string; you: string }[] = [
  { they: 'Just send me an email.', you: 'Happy to. So it is useful and not a brochure: is it training for a team, or something for yourself? And roughly how many people?' },
  { they: 'What does it cost?', you: 'It depends on how many people, which topics and whether it is online or on site. With those three I can give you a real range now. How many people are we talking about?' },
  { they: 'We have no budget.', you: 'Understood. Is it that there is no budget this year, or that training is not a priority yet? If it helps, the preview lessons on the Learning Studio cost nothing to watch.' },
  { they: 'We have an internal training team.', you: 'Good. We usually work alongside them. Where are they stretched: content on new topics like Claude and agents, or time to deliver?' },
  { they: 'We already use another provider.', you: 'That makes sense. What would you change about it if you could? Many teams keep their provider and use us for the topics it does not cover.' },
  { they: 'Now is not a good time.', you: 'No problem. When is planning for next quarter? I will call then, and send one short note in the meantime so you have our details.' },
  { they: 'Is the platform free?', you: 'The preview lessons of every course are free to watch, with no sign-up. A full course is a one-time purchase per learner. For a whole team, let us talk about what you need.' },
]

export const AFTER_THE_CALL = [
  'Add a note on the lead with what they said, in their words.',
  'Move the lead to Talking.',
  'Book the meeting from the lead’s Meeting tab, so the invitation goes out at once.',
  'If they asked you to stop, press Stop the emails on the lead.',
]

export interface Slide {
  title: string
  /** What goes on the slide. */
  show: string
  /** What you say while it is up. */
  say: string
  /** The question that keeps it a conversation. */
  ask?: string
}

export const SLIDES: Slide[] = [
  { title: 'Where you are today', show: 'Three or four facts they told you on the call, in their words.', say: 'This is what I understood from our conversation. Tell me what I got wrong.', ask: 'Has anything changed since we spoke?' },
  { title: 'What it costs to leave it', show: 'The days people spend away from work, and what stays unlearned.', say: 'A three to five day course takes 24 to 40 working hours per person. For your team that adds up quickly.' },
  { title: 'The outcome', show: 'One sentence: what their people will be able to do, and by when.', say: 'This is the result we would be accountable for.', ask: 'Is this the right outcome, or would you word it differently?' },
  { title: 'How people learn with us', show: 'Three steps: lessons alone, labs, trainer time for questions.', say: 'People learn the concepts from short lessons, practise with labs, and bring their questions to a trainer. We aim to cut classroom time by about 60%.' },
  { title: 'See it', show: 'Open the Learning Studio live. Play one lesson, open one lab.', say: 'This is what your team would use. The preview lessons are open today, so they can look before you decide.', ask: 'Who on your team should try it first?' },
  { title: 'Built for you', show: 'Their processes and tools as the course examples. Their name on the platform, if they want one.', say: 'We build the course around your own work. It can run on our platform or on one set up for you, with a custom voice and presenter if you want.', ask: 'Would you prefer to use our platform, or have your own?' },
  { title: 'The plan', show: 'Week by week: build, pilot with a small group, roll out.', say: 'We start with a small group, adjust, then roll out to everyone.' },
  { title: 'After the training', show: 'The doubt desk: questions on the platform, answered by a trainer.', say: 'Questions come the week after, when people use it on real work. They post them here and a trainer answers.' },
  { title: 'Who we are', show: 'Microsoft Certified Trainer. The Claude Partner Network badge with the approved line. Certifications held.', say: 'Gennoor is Certified in the Claude Partner Network. Our trainer is a Microsoft Certified Trainer.' },
  { title: 'Investment and next step', show: 'A price range for their team size, and one date.', say: 'For your team this is the range. The next step is a pilot with one group.', ask: 'Can we fix a start date for the pilot?' },
]

export const PRESENTATION_RULES = [
  'Open with their situation, not our history.',
  'Ask a question every two or three slides.',
  'Show the price after the plan, never before.',
  'Show the live platform. It persuades more than any slide.',
  'Name a customer only with their written consent.',
]
