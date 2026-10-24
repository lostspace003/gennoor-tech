import { escapeHtml } from '@/lib/escape-html'
import { emailShell, emailTitle, emailSteps, emailCallout, emailButton, emailDetails, emailContact, emailIconRows } from '@/lib/crm/email-theme'

// Every email a visitor receives, as pure functions (no sending), so they can be
// previewed and tested. One look: the shared shell in crm/email-theme.ts.
// Wording about the Claude Partner Network is never added here; where it is
// needed it must be the approved line, word for word.

const SITE = 'https://www.gennoor.com'
const first = (name: string) => escapeHtml((String(name || '').trim().split(/\s+/)[0]) || 'there')

/** First Learning Studio sign-in. Carries the catalog workbook. */
export function welcomeEmailHtml(name: string, siteUrl = SITE): string {
  return emailShell(
    emailTitle(
      `Welcome, ${first(name)}.`,
      'Your Gennoor Learning Studio account is ready. Self-paced, and your progress follows you to any device.'
    ) +
      emailSteps(
        [
          { title: 'Open the Learning Studio', body: 'Open the menu, then Learning Studio, then Courses.' },
          { title: 'Pick a course', body: 'Filter by company, type and level. Watch the preview first.' },
          { title: 'Start learning', body: 'Video lessons, quizzes, and a discussion with other learners.' },
        ],
        'Your first three steps'
      ) +
      emailCallout('play', 'See how it works in 8 minutes', `A short walkthrough, from the first click to your first lesson. <a href="${siteUrl}/studio" style="color:#2563EB;font-weight:600;text-decoration:none">Watch it here</a>.`) +
      emailCallout('file', 'Attached: our full catalog', 'An Excel workbook with every course, PoC blueprint and free resource in one place.') +
      emailButton('Open the Learning Studio', `${siteUrl}/studio`) +
      emailContact({ email: 'admin@gennoor.com' }),
    { preheader: 'Your Learning Studio account is ready. Three steps to your first lesson.', senderEmail: 'info@gennoor.com' }
  )
}

export interface TrainingConfirmation {
  name: string
  programTitle: string
  programKind: string
  company?: string
  trainingForLabel?: string
  timelineLabel?: string
  message?: string
  offerText?: string // only when the offer is switched on
}

/** Training or bootcamp enquiry: details PDF and catalog attached. */
export function trainingConfirmationHtml(d: TrainingConfirmation): string {
  const kind = escapeHtml(d.programKind)
  return emailShell(
    emailTitle(
      `Thank you, ${first(d.name)}.`,
      `Here are the details of <strong>${escapeHtml(d.programTitle)}</strong>, the ${kind} you asked about. The PDF and our full catalog are attached.`
    ) +
      emailCallout('file', `Attached: ${escapeHtml(d.programTitle)}`, 'The curriculum, learning objectives, hands-on labs and delivery format, as a PDF. Our full catalog (Excel) is attached too.') +
      emailDetails('Your requirements', [
        ['Organization', d.company],
        ['Training for', d.trainingForLabel],
        ['Timeline', d.timelineLabel],
        ['Special requirements', d.message],
      ]) +
      (d.offerText ? emailCallout('check', 'Current offer', escapeHtml(d.offerText)) : '') +
      emailSteps(
        [
          { title: 'Read the attached details', body: `Review the ${kind} outline and the catalog.` },
          { title: 'We contact you', body: 'Our training specialist gets in touch soon.' },
          { title: 'Free consultation call', body: 'We talk about customization for your team.' },
          { title: 'Your proposal', body: 'A tailored proposal with pricing options.' },
        ],
        'What happens next'
      ) +
      emailButton('Schedule a free consultation', `mailto:training@gennoor.com?subject=Schedule%20Consultation%20-%20${encodeURIComponent(d.programTitle)}`) +
      emailContact({ email: 'training@gennoor.com' }),
    { preheader: `Details for ${d.programTitle}, with the PDF and our catalog attached.`, senderEmail: 'training@gennoor.com' }
  )
}

/** "Talk to an expert" request. Catalog attached. */
export function expertCallHtml(d: { name: string; programTitle?: string; company?: string; country?: string; role?: string }): string {
  return emailShell(
    emailTitle(
      `Thank you, ${first(d.name)}.`,
      `We received your interest in <strong>${escapeHtml(d.programTitle || 'our programs')}</strong>. Our training specialist will contact you shortly to schedule a call.`
    ) +
      emailDetails('Your request', [
        ['Program', d.programTitle],
        ['Organization', d.company],
        ['Country', d.country],
        ['Role', d.role],
      ]) +
      emailSteps(
        [
          { title: 'We reach out', body: 'By phone or WhatsApp.' },
          { title: 'We understand your needs', body: 'Your team, your goals, your timeline.' },
          { title: 'You get a proposal', body: 'A customized training proposal.' },
          { title: 'We finalize the plan', body: 'Schedule and delivery format.' },
        ],
        'What to expect'
      ) +
      emailCallout('file', 'While you wait: our full catalog', 'Attached as an Excel workbook: every training program, PoC blueprint and free resource. Note anything relevant so we can start straight in on the call.') +
      emailContact({ email: 'training@gennoor.com' }),
    { preheader: 'We received your request. A specialist will contact you shortly.', senderEmail: 'training@gennoor.com' }
  )
}

/** Certification enquiry. Catalog attached. */
export function certificationHtml(d: { name: string; certification: string; level: string; targetDate: string; mode: string }): string {
  return emailShell(
    emailTitle(
      `Thank you, ${first(d.name)}.`,
      `Your certification enquiry for <strong>${escapeHtml(d.certification)}</strong> is with our expert. Our full catalog is attached.`
    ) +
      emailDetails('Your enquiry', [
        ['Certification', d.certification],
        ['Current level', d.level],
        ['Target date', d.targetDate],
        ['Preferred mode', d.mode],
      ]) +
      emailSteps(
        [
          { title: 'We review your requirements', body: 'Our certification expert reads your enquiry.' },
          { title: 'You get a preparation plan', body: 'Detailed, for your level and target date.' },
          { title: 'Free consultation call', body: 'We walk through the plan together.' },
          { title: 'Practice material', body: 'Sample questions and study materials.' },
        ],
        'What happens next'
      ) +
      emailIconRows([
        { icon: 'team', title: 'A trainer with 16+ active Microsoft certifications', body: 'Official curriculum and practice tests.' },
        { icon: 'learn', title: 'Hands-on labs and real scenarios', body: 'Post-training support and a free retake session if needed.' },
      ]) +
      emailCallout('file', 'Attached: our full catalog', 'Certification tracks, training programs, PoC blueprints and free resources, in one Excel workbook.') +
      emailContact({ email: 'training@gennoor.com' }),
    { preheader: 'Your certification enquiry is with our expert. Catalog attached.', senderEmail: 'enquiry@gennoor.com' }
  )
}

/** AI Readiness report: the PDF is attached. */
export function readinessReportHtml(name: string, reportLabel: string): string {
  return emailShell(
    emailTitle(`Your AI Readiness ${escapeHtml(reportLabel)} is ready, ${first(name)}.`, 'Your personalised report is attached to this email as a PDF.') +
      emailCallout('file', `Attached: AI Readiness ${escapeHtml(reportLabel)}`, 'Your overall score, dimension breakdown, skill gap analysis, recommended tools, a 90-day roadmap and ROI projections.') +
      emailSteps(
        [
          { title: 'Read your score', body: 'Start with the overall readiness and the dimension breakdown.' },
          { title: 'Start Phase 1', body: 'Your 90-day roadmap begins with the first phase.' },
          { title: 'Talk to us', body: 'Book a short call if you want guided implementation.' },
        ],
        "What's next"
      ) +
      emailButton('Book a free 15-minute call', `${SITE}/resources/calendar`) +
      emailContact({ email: 'info@gennoor.com' }),
    { preheader: `Your AI Readiness ${reportLabel} report is attached.`, senderEmail: 'info@gennoor.com' }
  )
}

/** Follow-up when the reader asked about AI readiness for their organization. */
export function readinessOrgHtml(name: string): string {
  return emailShell(
    emailTitle(
      `Let's build this for your organization, ${first(name)}.`,
      'Thanks for your interest in bringing AI readiness and training to your team. Here is what we can do together.'
    ) +
      emailIconRows([
        { icon: 'check', title: 'Custom AI assessment', body: "Built on your organization's data, tools and workflows." },
        { icon: 'team', title: 'AI training workshops', body: 'Hands-on training for teams, from Copilot to building AI agents.' },
        { icon: 'calendar', title: 'Strategy and 90-day roadmap', body: 'Tool selection, ROI tracking and change management.' },
        { icon: 'learn', title: 'Proof-of-concept development', body: 'Built and deployed around your business challenges.' },
      ]) +
      '<p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#475569">Our team will reach out within 24 hours to set up a no-obligation discovery call. You can also pick a slot yourself:</p>' +
      emailButton('Schedule a discovery call', `${SITE}/resources/calendar`) +
      emailContact({ email: 'info@gennoor.com' }),
    { preheader: 'We will contact you within 24 hours to set up a discovery call.', senderEmail: 'info@gennoor.com' }
  )
}

/** Claude Cowork workshop registration. The flyer PDF is attached. */
export function coworkHtml(d: { name: string; timeZone: string }): string {
  return emailShell(
    emailTitle(`You're in, ${first(d.name)}.`, 'You are confirmed for the free <strong>Claude Cowork Workshop</strong>. Nothing to set up: show up, watch live demos, and learn.') +
      emailDetails('Your session', [
        ['When', `4 hours in your local time zone (${d.timeZone}). Schedule details follow by email.`],
        ['Where', 'Online. The joining link and timings are shared by email.'],
        ['What to bring', 'Nothing. No setup required.'],
      ]) +
      emailSteps(
        [
          { title: 'What is Claude', body: 'An introduction to Claude and what it can do.' },
          { title: 'Claude Chat vs Claude Cowork', body: 'When to use each.' },
          { title: 'Organize data, create reports', body: 'Messy files to polished outputs and presentations, in minutes.' },
          { title: 'Connect your systems', body: 'Google Drive and other integrations, plus Cowork in Chrome.' },
          { title: 'Schedule flows, and what is next', body: 'Automate recurring tasks and plan your roadmap.' },
        ],
        'What we cover in 4 hours'
      ) +
      emailCallout('mail', 'Two things to do today', 'Watch your inbox for the session timings and joining link, and forward this email to one colleague who could use a free boost of five hours a week.') +
      emailButton('See the workshop page', 'https://gennoor.com/claude-cowork') +
      '<p style="margin:18px 0 0;font-size:15px;line-height:1.7;color:#475569">Questions? Reply to this email. We read every one.<br/>Welcome aboard,<br/><strong style="color:#0f172a">The Gennoor Team</strong></p>',
    { preheader: 'You are confirmed for the free Claude Cowork Workshop.', senderEmail: 'info@gennoor.com' }
  )
}
