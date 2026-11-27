import { escapeHtml } from '@/lib/escape-html'
import { briefShell, briefHead, briefPicture, briefTiles, briefLinks, briefBadges, briefButton, briefLine, briefLink, briefStrip, briefChoices, briefNote, BRIEF } from './brief-theme'
import { stepById, subjectFor } from './sequence'
import { companyOf, greetingOf } from './greeting'
import type { Lead } from './types'
import type { TeamMember } from './team'

// The nine emails of the series, as pure functions (no sending), so each one
// can be previewed in the CRM exactly as the lead will receive it.
//
// Every email is a briefing, not a letter: one hook, one sentence, one moving
// picture, three tiles of a few words each, one button. If a sentence can go,
// it goes.
//
// Ground rules for every email here:
//  - Only describe what exists on the site or what Gennoor has agreed to offer.
//  - No prices. Cost depends on scope and is discussed on a call.
//  - No customer names.
//  - Claude Partner Network: the approved line only, word for word.
//  - One clear next step per email.
//  - A lead's name and company are used only when we have them (./greeting.ts). Every
//    sentence that carries one also reads well without it: never "Hello there", never
//    "the team at your team".

const SITE = 'https://www.gennoor.com'
const STUDIO = `${SITE}/studio`
const CALL = `${SITE}/resources/calendar`
const CPN_BADGE = `${SITE}/email/cpn-certified-horizontal.png`
const CPN_LINE = 'Gennoor is Certified in the Claude Partner Network.'
const REPLY_TO = 'sales@gennoor.com'

/** A link that opens a ready-made reply, so answering takes one tap. */
const reply = (subject: string, body: string) => `mailto:${REPLY_TO}?subject=${encodeURIComponent(subject)}&amp;body=${encodeURIComponent(body)}`

interface Content { body: string; preheader: string; plain: string }

function content(stepId: string, firstName: string, company: string): Content {
  const first = escapeHtml(firstName), co = escapeHtml(company)
  /** "Priya, the lessons play..." with a name, "The lessons play..." without. */
  const to = (name: string, rest: string) => (name ? `${name}, ${rest}` : rest.charAt(0).toUpperCase() + rest.slice(1))
  /** " at Acme Industries" with a company, nothing without. */
  const at = (name: string) => (name ? ` at ${name}` : '')

  switch (stepId) {
    case 'intro':
      return {
        // The owner, 14 November 2026: "remove word no sign up as we are making it payed option now preview is free".
        // The courses are paid; what is open to watch is the PREVIEW lessons. So outreach says "preview lessons"
        // and never "no sign-up", which read as if the whole course were open.
        preheader: 'Preview lessons from our AI and cloud courses, open to watch today.',
        body:
          briefHead('Learning Studio', 'See the training before you talk to us.', `${first ? `Hello ${first}.` : 'Hello.'} ${co ? `The team at ${co}` : 'Your team'} can watch preview lessons from our AI and cloud courses today.`) +
          briefPicture('video', 'A preview of the AI-103 course. Open it to play the video with sound.', `${STUDIO}/ai-103`) +
          briefTiles([
            { icon: 'play', title: 'Video lessons', line: 'Short, with captions' },
            { icon: 'labs', title: 'Hands-on labs', line: 'Files to download' },
            { icon: 'certificate', art: 'certification', title: 'Certificate', line: 'Quizzes in every module' },
          ]) +
          briefButton('Watch the preview lessons', STUDIO) +
          briefLine(`New to us? ${briefLink('Watch what we do in ninety seconds', SITE)}. Prefer to talk? ${briefLink('Pick a time', CALL)}.`),
        plain: `${firstName ? `Hello ${firstName},` : 'Hello,'}\n\nSee the training before you talk to us. ${company ? `The team at ${company}` : 'Your team'} can watch preview lessons from our AI and cloud courses today.\n\n- Video lessons: short, with captions\n- Hands-on labs: files to download\n- Certificate: quizzes in every module\n\nWatch the preview lessons: ${STUDIO}\nWhat we do, in ninety seconds: ${SITE}\nPrefer to talk? Pick a time: ${CALL}`,
      }

    case 'samples':
      return {
        preheader: 'Three courses to open now. The full catalogue is attached.',
        body:
          briefHead('Sample courses', 'Three courses. Open any one.', to(first, 'each one has preview lessons to watch today.')) +
          briefPicture('courses', 'Three courses: AI-103, AI-500 and the Claude certification guides.', STUDIO) +
          briefLinks([
            { icon: 'project', art: 'ai-103', title: 'AI-103: Build and Ship AI Agents', line: 'Microsoft certification course, one project throughout', href: `${STUDIO}/ai-103` },
            { icon: 'team', art: 'ai-500', title: 'AI-500: Multi-Agent AI Solutions', line: 'For engineers and architects', href: `${STUDIO}/ai-500` },
            { icon: 'certificate', art: 'claude', title: 'Claude certification guides', line: 'Four guides, each with a practice exam', href: `${SITE}/claude/certifications` },
          ]) +
          briefStrip('catalogue', `<strong style="color:${BRIEF.text}">Attached: the full catalogue.</strong> Every programme we run, in one Excel file.`) +
          briefButton('Book a 20-minute call', CALL) +
          briefLine('Tell me your topics and I will point you to the right two or three.'),
        plain: `${to(firstName, 'three courses.')} Open any one. Each one has preview lessons to watch today.\n\n- AI-103: Build and Ship AI Agents on Microsoft Azure: ${STUDIO}/ai-103\n- AI-500: Designing and Implementing Multi-Agent AI Solutions: ${STUDIO}/ai-500\n- Claude certification guides: ${SITE}/claude/certifications\n\nOur full catalogue is attached as an Excel file.\n\nBook a 20-minute call: ${CALL}`,
      }

    case 'custom':
      return {
        preheader: 'Your tools, your processes, your examples.',
        body:
          briefHead('Built for you', co ? `Training built around ${co}.` : 'Training built around your work.', 'Your tools, your processes, your examples. On our platform, or on one of your own.') +
          briefPicture('custom', 'Your tools, processes and examples go in. A course built for your team comes out.', CALL) +
          briefTiles([
            { icon: 'work', title: 'Your own work', line: 'Lessons on real processes' },
            { icon: 'voice', title: 'Your presenter', line: 'A voice you choose' },
            { icon: 'assistant', title: 'Course assistant', line: 'Answers inside the lesson' },
          ]) +
          briefButton('Book a 20-minute call', CALL) +
          briefLine('I need three things: how many people, which teams, and by when.'),
        plain: `Training built around ${company || 'your work'}.\n\nYour tools, your processes, your examples. On our platform, or on one of your own.\n\n- Lessons on your own work\n- A presenter and voice you choose\n- An assistant that answers inside the lesson\n\nI need three things: how many people, which teams, and by when.\n\nBook a 20-minute call: ${CALL}`,
      }

    case 'time':
      return {
        preheader: 'Self-paced lessons first, trainer time only where it is needed.',
        body:
          briefHead('Less classroom time', 'Fewer days away from work.', to(first, 'a usual course keeps people in a classroom for 3 to 5 days. We aim for about 60% less.')) +
          briefPicture('time', 'A usual course takes 3 to 5 days in a classroom. With lessons and labs first and a trainer for the questions, we aim for about 60% less classroom time.', CALL) +
          briefTiles([
            { icon: 'learn', title: '1. Learn alone', line: 'Short video lessons' },
            { icon: 'labs', title: '2. Practise', line: 'Labs on their machine' },
            { icon: 'trainer', title: '3. Ask a trainer', line: 'Only the hard parts' },
          ]) +
          briefButton('Work it out for one course', CALL) +
          briefLine('How much you save depends on the course and the team.'),
        plain: `Fewer days away from work.\n\nA usual cloud or AI course takes 3 to 5 days in a classroom. We aim for about 60% less classroom time:\n1. People learn the concepts alone with short video lessons.\n2. They practise with the labs.\n3. Trainer time is kept for the hard parts.\n\nHow much you save depends on the course and the team.\n\nWork it out for one of your courses: ${CALL}`,
      }

    case 'claude':
      return {
        preheader: 'Claude training, certification preparation, and automation.',
        body:
          briefHead('Claude', co ? `Claude for the team at ${co}.` : 'Claude for your team.', 'Use it well, get certified, automate one process at a time.') +
          briefPicture('claude', 'Three things we do with Claude: certification preparation, training for teams, and automation.', `${SITE}/claude`) +
          briefBadges('The four Claude certifications', [
            { art: 'ccas-f', name: 'Associate', href: `${SITE}/claude/certifications/associate-foundations` },
            { art: 'ccdv-f', name: 'Developer', href: `${SITE}/claude/certifications/developer-foundations` },
            { art: 'ccar-f', name: 'Architect', href: `${SITE}/claude/certifications/architect-foundations` },
            { art: 'ccar-p', name: 'Architect Pro', href: `${SITE}/claude/certifications/architect-professional` },
          ]) +
          briefLinks([
            { icon: 'certificate', art: 'claude', title: 'Certification preparation', line: 'A guide and practice exam for each', href: `${SITE}/claude/certifications` },
            { icon: 'team', title: 'Training for teams', line: 'Everyday work, Cowork and Claude Code', href: `${SITE}/claude` },
            { icon: 'automation', title: 'Automation', line: 'Scoped in writing, tested on your examples', href: `${SITE}/automation` },
          ]) +
          `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:14px 0 0"><tr>
            <td width="150" valign="middle" bgcolor="#ffffff" style="background:#ffffff;border-radius:10px;padding:8px 10px"><img src="${CPN_BADGE}" width="130" alt="Claude Partner Network - Certified" style="display:block;border:0"/></td>
            <td valign="middle" style="padding-left:14px;font-size:14px;line-height:1.5;color:${BRIEF.body}">${CPN_LINE}</td>
          </tr></table>` +
          briefButton('Talk about Claude training', CALL),
        plain: `${company ? `Claude for the team at ${company}.` : 'Claude for your team.'}\n\n- Claude certification preparation: ${SITE}/claude/certifications\n- Claude training for teams: ${SITE}/claude\n- Automation, one process at a time: ${SITE}/automation\n\n${CPN_LINE}\n\nTalk about Claude training: ${CALL}`,
      }

    case 'projects':
      return {
        preheader: 'One real project per course, built module by module.',
        body:
          briefHead('Learn by building', 'People remember what they build.', to(first, 'each course has one real project. Every module adds a working part.')) +
          briefPicture('build', 'Six modules, each adding a part, and a working project at the end.', `${STUDIO}/ai-103`) +
          briefTiles([
            { icon: 'project', art: 'project', title: 'One project', line: 'Start to finish' },
            { icon: 'module', title: 'A lab each module', line: 'Starter files included' },
            { icon: 'result', art: 'certification', title: 'A result to show', line: 'Project and certificate' },
          ]) +
          briefButton('See a project course', `${STUDIO}/ai-103`) +
          briefLine(co ? `We can build one around a project from ${co}.` : 'We can build one around a project of yours.'),
        plain: `People remember what they build.\n\nEach of our project courses has one real project. Every module adds a working part, with a lab and starter files. Learners finish with a working project and a certificate.\n\nWe can build one around a project ${company ? `from ${company}` : 'of yours'}.\n\nSee a project course: ${STUDIO}/ai-103`,
      }

    case 'support':
      return {
        preheader: 'Questions do not stop when the course does.',
        body:
          briefHead('After the training', 'The questions start a week later.', co ? `So at ${co} the help would not end on the last day.` : 'So the help does not end on the last day.') +
          briefPicture('chat', 'A learner asks a question a week after the course. A trainer answers, and the answer is kept for the next person.', CALL) +
          briefTiles([
            { icon: 'doubts', title: 'Doubt desk', line: 'Answers stay findable' },
            { icon: 'trainer', title: 'A trainer', line: 'Online or on your premises' },
            { icon: 'open', title: 'Course stays open', line: 'Go back any time' },
          ]) +
          briefButton('Ask how it would work for you', CALL),
        plain: `What happens after the training${at(company)}.\n\nThe questions start a week later, so the help does not end on the last day.\n\n- A doubt desk: learners post questions and the answers stay there.\n- A trainer resolves them, online or on your premises.\n- The course stays open, so people can go back any time.\n\nAsk how it would work for you: ${CALL}`,
      }

    case 'platform':
      return {
        preheader: 'Your courses, your people, your name on it.',
        body:
          briefHead('Your platform', co ? `A learning platform for ${co}.` : 'A learning platform of your own.', 'Your courses, your people, your name on it.') +
          briefPicture('platform', 'A learning platform with your company name, your courses and your team’s progress.', STUDIO) +
          briefTiles([
            { icon: 'play', title: 'Video lessons', line: 'Progress saved' },
            { icon: 'quiz', title: 'Quizzes and labs', line: 'Completion recorded' },
            { icon: 'assistant', title: 'Assistant', line: 'Help inside the lesson' },
          ]) +
          briefButton('See the platform', STUDIO) +
          briefLine('Start on ours and move to your own later. Your courses go with you.'),
        plain: `${company ? `A learning platform for ${company}.` : 'A learning platform of your own.'}\n\nYour courses, your people, your name on it: video lessons with saved progress, quizzes and labs, and an assistant inside the lesson.\n\nStart on ours and move to your own later. Your courses go with you.\n\nSee the platform: ${STUDIO}`,
      }

    case 'checkin':
    default:
      return {
        preheader: 'One tap, and then I will leave it with you.',
        body:
          briefHead('Quick check', to(first, 'should I keep writing?'), 'One tap is enough. Each answer opens a ready reply.') +
          briefChoices([
            { icon: 'calendar', title: 'Interested, later', line: 'Tell me the month and I will write then', href: reply('Interested, later', 'Please write to me again in: ') },
            { icon: 'person', title: 'Talk to someone else', line: `Whoever plans training${at(co)}`, href: reply('Please talk to someone else', 'The right person is: ') },
            { icon: 'stop', title: 'Not for us', line: 'I will close this and not write again', href: reply('stop', 'stop') },
          ]) +
          briefLine(`Either way, the preview lessons on the ${briefLink('Learning Studio', STUDIO)} stay open for your team.`),
        plain: `${to(firstName, 'should I keep writing?')}\n\nWhich of these is closest?\n- Interested, later: tell me the month.\n- Interested, different person: tell me who plans training${at(company)}.\n- Not for us: reply with the word stop.\n\nThe preview lessons on the Learning Studio stay open for your team: ${STUDIO}`,
      }
  }
}

/**
 * One step of the series, ready to send to one lead.
 * `note` is an optional personal line from the sender, shown above the email body.
 */
export function buildStepEmail(
  stepId: string,
  lead: Pick<Lead, 'name' | 'company' | 'greeting'>,
  signer: TeamMember,
  note = ''
): { subject: string; html: string; text: string } {
  const step = stepById(stepId)
  if (!step) throw new Error(`Unknown sequence step: ${stepId}`)
  const c = content(stepId, greetingOf(lead), companyOf(lead))
  const personal = note.trim() ? briefNote(note.trim().slice(0, 600)) : ''
  const html = briefShell(personal + c.body, {
    preheader: c.preheader,
    signature: { name: signer.name, email: signer.email, phones: signer.phones },
  })
  const text = `${note.trim() ? `${note.trim()}\n\n` : ''}${c.plain}\n\n${signer.name}\nGennoor Tech\n\nNot useful? Reply with the word stop and I will not write again.`
  return { subject: subjectFor(step, lead), html, text }
}
