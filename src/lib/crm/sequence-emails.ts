import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailButton, emailSteps, emailCallout, emailIconRows, type EmailIcon } from './email-theme'
import { stepById, fillTokens } from './sequence'
import type { Lead } from './types'
import type { TeamMember } from './team'

// The nine emails of the series, as pure functions (no sending), so each one
// can be previewed in the CRM exactly as the lead will receive it.
//
// Ground rules for every email here:
//  - Only describe what exists on the site or what Gennoor has agreed to offer.
//  - No prices. Cost depends on scope and is discussed on a call.
//  - No customer names.
//  - Claude Partner Network: the approved line only, word for word.
//  - One clear next step per email.

const SITE = 'https://www.gennoor.com'
const STUDIO = `${SITE}/studio`
const CALL = `${SITE}/resources/calendar`
const CPN_BADGE = `${SITE}/email/cpn-certified-horizontal.png`
const CPN_LINE = 'Gennoor is Certified in the Claude Partner Network.'

const link = (label: string, href: string) => `<a href="${href}" style="color:#2563EB;font-weight:600;text-decoration:none">${label}</a>`
const p = (html: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#475569">${html}</p>`

/** Linked cards, one per row: a title, one line, and where it goes. */
function cards(items: { title: string; body: string; href: string; cta: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 6px">${items
    .map(
      (c) => `<tr><td style="padding:0 0 12px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e2e8f0;border-radius:12px"><tr>
        <td width="6" bgcolor="#2563EB" style="background:#2563EB;border-radius:12px 0 0 12px;font-size:0;line-height:0">&nbsp;</td>
        <td style="padding:16px 18px;font-size:15px;line-height:1.55;color:#475569">
          <strong style="color:#0f172a;font-size:16px">${c.title}</strong><br/>${c.body}<br/>
          <a href="${c.href}" style="display:inline-block;margin-top:8px;color:#2563EB;font-weight:700;text-decoration:none;font-size:14px">${c.cta} &rarr;</a>
        </td>
      </tr></table></td></tr>`
    )
    .join('')}</table>`
}

const label = (text: string) => `<p style="margin:24px 0 12px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#64748b;text-transform:uppercase">${text}</p>`

/** The quiet last line of every email: how to stop them. */
const optOut = `<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#94a3b8">If these are not useful, reply with the word stop and I will not write again.</p>`

interface Content { title: string; lead: string; body: string; preheader: string; plain: string }

function content(stepId: string, first: string, company: string): Content {
  const co = escapeHtml(company)
  const rows = (r: { icon: EmailIcon; title: string; body: string }[]) => emailIconRows(r)

  switch (stepId) {
    case 'intro':
      return {
        preheader: 'Full video courses with labs and quizzes, open for your team to start today.',
        title: `Hello ${first},`,
        lead: `I work on corporate training at Gennoor Tech. We teach teams AI and cloud skills, and we have built it so that ${co} can try the real thing before any conversation about buying.`,
        body:
          p(`Our <strong style="color:#0f172a">Learning Studio</strong> is open to your team today at no charge. Each person signs in, picks a course and starts. They get the complete course, not a preview.`) +
          rows([
            { icon: 'play', title: 'Full video lessons', body: 'Short lessons with captions. Progress is saved, so people continue where they stopped.' },
            { icon: 'file', title: 'Labs they can download', body: 'The lab files and guides come with the course, so the practice happens on their own machine.' },
            { icon: 'check', title: 'Quizzes and a certificate', body: 'Each module checks understanding, and finishing the course earns a certificate.' },
            { icon: 'chat', title: 'Help while they learn', body: 'An assistant inside the player answers questions, and there is a discussion page for each course.' },
          ]) +
          emailButton('Open the Learning Studio', STUDIO) +
          p(`Over the next few weeks I will send you sample courses, our catalogue, and how we build training around one organization. If you would rather talk now, ${link('pick a time here', CALL)}.`),
        plain: `Hello ${first},\n\nI work on corporate training at Gennoor Tech. Our Learning Studio is open to your team today at no charge: full video lessons, labs to download, quizzes, a certificate, and an assistant inside the player.\n\nOpen it here: ${STUDIO}\n\nIf you would rather talk now, pick a time: ${CALL}`,
      }

    case 'samples':
      return {
        preheader: 'Three courses to open now, and the full catalogue attached as Excel.',
        title: `${first}, here is what the courses look like`,
        lead: `The quickest way to judge training is to open it. These three are live now, and your team can take any of them from start to finish.`,
        body:
          cards([
            { title: 'AI-103: Build and Ship AI Agents on Microsoft Azure', body: 'One project from the first lesson to the last. Learners build a working agent step by step, with labs in every module.', href: `${STUDIO}/ai-103`, cta: 'Open the course' },
            { title: 'AI-500: Designing and Implementing Multi-Agent AI Solutions', body: 'For engineers and architects. Follows one company as it builds a multi-agent platform.', href: `${STUDIO}/ai-500`, cta: 'Open the course' },
            { title: 'Claude certification guides', body: 'Four guides, from Associate to Architect, each with a storyline, short videos and a practice exam.', href: `${SITE}/claude/certifications`, cta: 'See the guides' },
          ]) +
          emailCallout('file', 'Attached: our full catalogue', 'An Excel workbook with every programme we run, including the instructor-led bootcamps and courses. Share it with whoever plans training at ' + co + '.') +
          p(`Tell me which topics matter to your team this year and I will point you to the right two or three, so nobody has to read the whole list.`) +
          emailButton('Book a 20-minute call', CALL),
        plain: `${first}, here is what the courses look like.\n\n- AI-103: Build and Ship AI Agents on Microsoft Azure: ${STUDIO}/ai-103\n- AI-500: Designing and Implementing Multi-Agent AI Solutions: ${STUDIO}/ai-500\n- Claude certification guides: ${SITE}/claude/certifications\n\nOur full catalogue is attached as an Excel workbook.\n\nBook a 20-minute call: ${CALL}`,
      }

    case 'custom':
      return {
        preheader: 'Training built on your own processes, on a platform set up for your people.',
        title: `Training built around ${co}`,
        lead: `The open courses cover the common ground. Most teams also need training on their own tools, their own processes and their own data. We build that.`,
        body:
          label('Two ways to work with us') +
          cards([
            { title: 'Use our platform', body: 'Your people learn on the Learning Studio. We add the courses you need and you see who has finished what.', href: STUDIO, cta: 'See the platform' },
            { title: 'Have your own platform', body: 'We set up a learning platform for your organization, with your courses, your branding and your people only.', href: CALL, cta: 'Talk it through' },
          ]) +
          label('What we build into a custom course') +
          rows([
            { icon: 'learn', title: 'Lessons on your own work', body: 'Written around the processes and examples your team deals with, not generic ones.' },
            { icon: 'play', title: 'A presenter and voice you choose', body: 'Video lessons can be narrated in a custom voice, with a digital presenter if you want one on screen.' },
            { icon: 'chat', title: 'An assistant that knows the course', body: 'Learners ask questions in the player and get answers drawn from the course itself.' },
            { icon: 'team', title: 'A place to raise doubts', body: 'A question board for your organization, answered by a trainer.' },
          ]) +
          p(`To suggest something sensible I need three things: how many people, which teams, and when you would like them trained. A short call covers it.`) +
          emailButton('Book a 20-minute call', CALL),
        plain: `Training built around ${company}.\n\nTwo ways to work with us:\n1. Use our platform, with the courses you need added.\n2. Have your own learning platform, with your courses and your people only.\n\nA custom course can include lessons on your own processes, narration in a custom voice with a digital presenter, an assistant that knows the course, and a question board answered by a trainer.\n\nBook a 20-minute call: ${CALL}`,
      }

    case 'time':
      return {
        preheader: 'Self-paced lessons first, trainer time only where it is needed.',
        title: `Fewer days away from work, ${first}`,
        lead: `A typical cloud or AI course keeps people in a classroom for three to five days, which is 24 to 40 hours away from their work. Much of that time is spent listening.`,
        body:
          // Animated where the mail app allows it. The first frame is the finished picture, and the
          // sentence under it repeats the message for readers whose images are switched off.
          `<img src="${SITE}/email/less-classroom-time.gif" width="560" alt="A usual course takes 3 to 5 days in a classroom. With lessons and labs first and a trainer for questions, we aim for about 60% less classroom time." style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:12px;margin:6px 0 14px"/>` +
          p(`We aim to cut classroom time by <strong style="color:#0f172a">about 60%</strong>. Here is how.`) +
          emailSteps(
            [
              { title: 'Learn the concepts alone', body: 'Short video lessons, taken when it suits each person, at their own speed.' },
              { title: 'Practise with the labs', body: 'Hands-on work on their own machine, with the files and guides provided.' },
              { title: 'Bring the questions to a trainer', body: 'Trainer time is kept for doubts and the hard parts, online or on your premises.' },
            ],
            'How the time is saved'
          ) +
          p(`The classroom hours that remain are the useful ones. How much time you save depends on the course and the team, so I would rather work it out for one of your real programmes than quote a number.`) +
          emailButton('Work it out for one course', CALL),
        plain: `Fewer days away from work.\n\nA usual cloud or AI course takes 3 to 5 days in a classroom, 24 to 40 hours. We aim for about 60% less classroom time:\n1. People learn the concepts alone with short video lessons.\n2. They practise with the labs.\n3. Trainer time is kept for questions, online or on your premises.\n\nWork it out for one of your courses: ${CALL}`,
      }

    case 'claude':
      return {
        preheader: 'Claude training for everyday work, certification preparation, and automation.',
        title: `Claude for the team at ${co}`,
        lead: `A large part of our work is Claude: teaching people to use it well, preparing them for the Claude certifications, and automating one process at a time.`,
        body:
          cards([
            { title: 'Claude certification preparation', body: 'Guides for all four Claude certifications, each with a storyline, short narrated videos and a practice exam.', href: `${SITE}/claude/certifications`, cta: 'See the four guides' },
            { title: 'Claude training for teams', body: 'Live sessions on Claude for everyday work, Claude Cowork and Claude Code, built around what your team does.', href: `${SITE}/claude`, cta: 'See Claude training' },
            { title: 'Automation, one process at a time', body: 'We scope a process in writing first, build it with Claude, and test it on your own examples.', href: `${SITE}/automation`, cta: 'How automation works' },
          ]) +
          `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 6px"><tr>
            <td width="170" valign="middle"><a href="https://claude.com/partners"><img src="${CPN_BADGE}" width="160" alt="Claude Partner Network - Certified" style="display:block;border:0"/></a></td>
            <td valign="middle" style="padding-left:14px;font-size:14px;line-height:1.5;color:#475569">${CPN_LINE}</td>
          </tr></table>` +
          emailButton('Talk about Claude training', CALL),
        plain: `Claude for the team at ${company}.\n\n- Claude certification preparation: ${SITE}/claude/certifications\n- Claude training for teams: ${SITE}/claude\n- Automation, one process at a time: ${SITE}/automation\n\n${CPN_LINE}\n\nTalk about Claude training: ${CALL}`,
      }

    case 'projects':
      return {
        preheader: 'One real project per course, built module by module.',
        title: `${first}, people remember what they build`,
        lead: `Our project-based courses give each learner one real thing to build. Every module adds a working part, so the course ends with something finished instead of a folder of notes.`,
        body:
          emailSteps(
            [
              { title: 'One project for the whole course', body: 'In AI-103, learners build a support agent from an empty folder to a deployed service.' },
              { title: 'A lab in every module', body: 'Each lab adds one piece. Starter files and a guide are provided.' },
              { title: 'A result they can show', body: 'At the end there is a working project, a quiz record and a certificate.' },
            ],
            'How a project course runs'
          ) +
          p(`We can build the same kind of course around a project from ${co}: a process you want automated, a tool you are rolling out, or a product your team has to support.`) +
          emailButton('See a project course', `${STUDIO}/ai-103`),
        plain: `People remember what they build.\n\nOur project-based courses give each learner one real project. Every module adds a working part, with a lab and starter files. They finish with a working project, a quiz record and a certificate.\n\nWe can build the same kind of course around a project from ${company}.\n\nSee a project course: ${STUDIO}/ai-103`,
      }

    case 'support':
      return {
        preheader: 'Questions do not stop when the course does. Here is what we do about it.',
        title: `What happens after the training`,
        lead: `Most training ends on the last day, and the questions start the week after, when people try it on real work. We plan for that.`,
        body:
          rows([
            { icon: 'chat', title: 'A doubt desk for your organization', body: 'Learners post a question on the platform. It stays there with its answer, so the next person finds it.' },
            { icon: 'team', title: 'A trainer to resolve it', body: 'A trainer answers on the platform, or meets the team online or on your premises for the harder ones.' },
            { icon: 'learn', title: 'The course stays open', body: 'People can go back to any lesson or lab whenever they need it.' },
          ]) +
          p(`This works the same way whether your team learns on our platform or on one we set up for ${co}.`) +
          emailButton('Ask how support would work for you', CALL),
        plain: `What happens after the training.\n\n- A doubt desk for your organization: learners post questions on the platform and the answers stay there.\n- A trainer resolves them, on the platform, online or on your premises.\n- The course stays open, so people can go back to any lesson or lab.\n\nAsk how support would work for you: ${CALL}`,
      }

    case 'platform':
      return {
        preheader: 'Your courses, your people, your name on it.',
        title: `A learning platform for ${co}`,
        lead: `If training is a regular need, it is worth having a home for it. We can set up a learning platform for your organization and build the courses that go on it.`,
        body:
          label('What it includes') +
          rows([
            { icon: 'play', title: 'Video lessons with captions', body: 'Progress is saved for every learner and they pick up where they stopped.' },
            { icon: 'check', title: 'Quizzes, labs and certificates', body: 'Understanding is checked in every module, and completion is recorded.' },
            { icon: 'chat', title: 'An assistant and a question board', body: 'Help is available inside the lesson, and doubts go to a trainer.' },
            { icon: 'file', title: 'Other features on request', body: 'Tell us what your training needs and we will say plainly what we can add.' },
          ]) +
          p(`You can start on our platform and move to your own later. The courses we build for you go with you.`) +
          emailButton('See the platform your team would use', STUDIO),
        plain: `A learning platform for ${company}.\n\nWe can set up a learning platform for your organization and build the courses for it: video lessons with captions, quizzes, labs, certificates, an assistant inside the lesson and a question board answered by a trainer. Other features on request.\n\nYou can start on our platform and move to your own later.\n\nSee the platform: ${STUDIO}`,
      }

    case 'checkin':
    default:
      return {
        preheader: 'One question, and then I will leave it with you.',
        title: `${first}, a quick check`,
        lead: `I have sent you a few notes about how we train teams. I do not want to keep writing if the timing is wrong.`,
        body:
          p(`Which of these is closest?`) +
          `<ul style="margin:0 0 18px;padding-left:20px;font-size:16px;line-height:1.8;color:#475569">
            <li><strong style="color:#0f172a">Interested, later.</strong> Tell me the month and I will write then.</li>
            <li><strong style="color:#0f172a">Interested, different person.</strong> Tell me who plans training at ${co}.</li>
            <li><strong style="color:#0f172a">Not for us.</strong> Reply with the word stop and I will close this.</li>
          </ul>` +
          p(`Either way, the ${link('Learning Studio', STUDIO)} stays open for your team to use.`),
        plain: `${first}, a quick check.\n\nWhich of these is closest?\n- Interested, later: tell me the month.\n- Interested, different person: tell me who plans training at ${company}.\n- Not for us: reply with the word stop.\n\nThe Learning Studio stays open for your team: ${STUDIO}`,
      }
  }
}

/**
 * One step of the series, ready to send to one lead.
 * `note` is an optional personal line from the sender, shown above the email body.
 */
export function buildStepEmail(
  stepId: string,
  lead: Pick<Lead, 'name' | 'company'>,
  signer: TeamMember,
  note = ''
): { subject: string; html: string; text: string } {
  const step = stepById(stepId)
  if (!step) throw new Error(`Unknown sequence step: ${stepId}`)
  const first = escapeHtml((lead.name || '').trim().split(/\s+/)[0] || 'there')
  const company = (lead.company || '').trim() || 'your team'
  const c = content(stepId, first, company)
  const personal = note.trim()
    ? `<p style="margin:0 0 20px;padding:14px 16px;background:#f8fafc;border-left:3px solid #2563EB;border-radius:6px;font-size:15px;line-height:1.6;color:#334155;white-space:pre-line">${escapeHtml(note.trim().slice(0, 600))}</p>`
    : ''
  const html = emailShell(emailTitle(c.title, c.lead) + personal + c.body + optOut, {
    preheader: c.preheader,
    signature: { name: signer.name, email: signer.email, phones: signer.phones },
  })
  const text = `${note.trim() ? `${note.trim()}\n\n` : ''}${c.plain}\n\n${signer.name}\nGennoor Tech`
  return { subject: fillTokens(step.subject, lead), html, text }
}
