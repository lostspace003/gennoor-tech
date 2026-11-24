import type { Metadata } from 'next'
import {
  AudioLines, BarChart3, Building2, Check, ClipboardCheck, Database, FileScan, FileText, GraduationCap, Hammer,
  FlaskConical, Languages, Library, MessageSquareText, Plug, Scale, ScrollText, ShieldCheck, TrendingDown, UserSearch, Users, Wrench,
} from 'lucide-react'
import { pageMeta } from '@/lib/seo'
import Ground from '@/components/stage/Ground'
import Reveal from '@/components/stage/Reveal'
import { Ico } from '@/components/stage/Ico'
import FilmPlayer from '@/components/home/FilmPlayer'
import PocRequestForm from '@/components/automation/PocRequestForm'
import { OpenCustomTraining } from '@/components/custom-training/CustomTraining'
import films from '@/data/films.json'

export const metadata: Metadata = pageMeta({
  title: 'HR Intelligence: a proof of concept we built',
  description: 'Ask HR anything, get an answer you can check: AI specialists answer from your own records, and a compliance review checks every reply.',
  path: '/automation/hr-intelligence',
  image: 'hr-intelligence',
})

const film = films.hrIntelligence
const NAME = 'HR Intelligence'
const turn = (i: number) => ({ '--i': i }) as React.CSSProperties

const PROBLEM = [
  { icon: Languages, tone: 'blue', title: 'CVs', body: 'in many languages' },
  { icon: AudioLines, tone: 'violet', title: 'Interview recordings', body: 'that nobody replays' },
  { icon: FileScan, tone: 'cyan', title: 'Scanned forms', body: 'typed in by hand' },
  { icon: MessageSquareText, tone: 'rose', title: 'Policy questions', body: 'all day, every day' },
  { icon: TrendingDown, tone: 'ink', title: 'Attrition', body: 'seen after the resignation' },
] as const

const SPECIALISTS = [
  { icon: ScrollText, tone: 'blue', title: 'Policy advisor', body: 'The rules, with their source.' },
  { icon: UserSearch, tone: 'violet', title: 'Talent scout', body: 'Candidates and CVs.' },
  { icon: BarChart3, tone: 'cyan', title: 'Workforce analyst', body: 'Headcount and trends.' },
  { icon: Users, tone: 'green', title: 'Retention advisor', body: 'Who may leave, and why.' },
] as const

const DOES = [
  { icon: MessageSquareText, tone: 'blue', title: 'Answers policy questions', body: 'Annual leave in Germany, carry-over, overtime: the answer comes with the policy it is taken from.' },
  { icon: BarChart3, tone: 'cyan', title: 'Gives live numbers', body: 'Headcount and retention risk are read from the HR records at that moment. Never guessed.' },
  { icon: TrendingDown, tone: 'green', title: 'Spots attrition early', body: 'Shows who may leave and why, while there is still time to talk to them.' },
  { icon: Scale, tone: 'rose', title: 'Says no to unfair requests', body: 'Asked to screen out older applicants or other nationalities, it refuses and quotes the recruitment policy.' },
  { icon: FileScan, tone: 'violet', title: 'Reads and files documents', body: 'A scanned form is recognised, read, checked against the employee record and filed. No retyping.' },
  { icon: Plug, tone: 'cyan', title: 'Connects to your systems', body: 'It works from the records and documents you already have, not from a copy made for it.' },
] as const

const TRUST = [
  { icon: FileText, text: 'Every answer shows its source' },
  { icon: ClipboardCheck, text: 'A compliance review before every reply' },
  { icon: ShieldCheck, text: 'Personal details are redacted' },
  { icon: ScrollText, text: 'Every action is logged' },
] as const

const DATA = [
  { icon: Database, title: 'Records', body: 'Employees, payroll, leave, reviews.' },
  { icon: FileText, title: 'Documents', body: 'CVs, forms, recordings, policies.' },
  { icon: Library, title: 'Knowledge', body: 'The policy library, searchable by meaning.' },
] as const

/** What a team builds in the custom training: the four parts of the build guide. */
const COURSE = [
  { title: 'The idea and the design', body: 'Why a team of specialists beats one chatbot, and the decisions behind it.' },
  { title: 'The data and the cloud', body: 'Sample HR records, CVs, recordings and forms, and the Azure services that hold them.' },
  { title: 'The tools and the agents', body: 'Tools that read records safely, the specialists, triage and the compliance review.' },
  { title: 'The app, live', body: 'Sign-in, the web app, putting it online, testing it and fixing what breaks.' },
] as const

const DEPARTMENTS = ['Human Resources', 'Finance', 'Logistics', 'Healthcare', 'Education'] as const

export default function HrIntelligencePage() {
  return (
    <main>
      {/* ===== Top: the promise, and the film ===== */}
      <Ground glow="green" mx={66} my={40} className="px-4 sm:px-6 pt-8 lg:pt-12 pb-10 lg:pb-14">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <p className="st-rise st-kicker" style={turn(1)}>A proof of concept we built</p>
            <h1 className="st-rise display-hero !text-[clamp(32px,4vw,54px)] mt-2" style={turn(1)}>Ask HR anything. Get an answer you can check.</h1>
            <p className="st-rise text-[clamp(17px,1.5vw,20px)] leading-[1.5] text-gray-600 max-w-[520px] mx-auto lg:mx-0 mt-5" style={turn(2)}>
              {NAME}: a team of AI specialists for people operations, working from the company&apos;s own records.
            </p>
            <div className="st-rise flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center mt-8" style={turn(3)}>
              <a href="#poc" className="st-pill whitespace-nowrap">Build one for you</a>
              <OpenCustomTraining topic={`Building an AI team like ${NAME}`} className="st-link text-[16px] whitespace-nowrap">Or train your team ›</OpenCustomTraining>
            </div>
          </div>
          <div className="st-rise order-1 lg:order-2" style={turn(1)}>
            <FilmPlayer src={film.src} poster={film.poster} title={`${NAME}: a proof of concept`} transcript={film.transcript} seconds={film.seconds} />
            <p className="text-[13px] text-gray-500 mt-3 text-center lg:text-left">The working solution, shown with sample data. No real employees.</p>
          </div>
        </div>
      </Ground>

      {/* ===== The problem ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="problem">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="problem" className="display-section">People teams are buried.</h2>
          <p className="lede mt-3.5 max-w-[640px]">The answers exist. They are scattered across documents and systems.</p>
          <Reveal as="ul" className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
            {PROBLEM.map((p, i) => (
              <li key={p.title} className={`st-rise st-card p-5 ${i === PROBLEM.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`} style={turn(i)}>
                <Ico icon={p.icon} tone={p.tone} size={40} />
                <h3 className="text-[16.5px] font-bold text-gray-900 mt-4">{p.title}</h3>
                <p className="text-[14.5px] text-gray-600 mt-1">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== The idea: one question, a team behind it ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="idea">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="idea" className="display-section">One question in. A team of specialists behind it.</h2>
          <p className="lede mt-3.5 max-w-[680px]">It works like a good HR team: the right expert answers, and someone checks the answer before it goes out.</p>
          <ol className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.2fr)_minmax(0,0.9fr)] gap-4 mt-8 items-stretch">
            <li className="st-card p-5 flex flex-col">
              <span className="st-ico t-blue" style={{ ['--s' as string]: '40px' }} aria-hidden="true"><b>1</b></span>
              <h3 className="text-[17px] font-bold text-gray-900 mt-4">A question, in plain words</h3>
              <p className="text-[14.5px] text-gray-600 mt-1.5">Triage decides who should answer it, and asks only them.</p>
            </li>
            <li className="st-card p-5">
              <span className="st-ico t-violet" style={{ ['--s' as string]: '40px' }} aria-hidden="true"><b>2</b></span>
              <h3 className="text-[17px] font-bold text-gray-900 mt-4">Four specialists</h3>
              <ul className="grid sm:grid-cols-2 gap-3 mt-3">
                {SPECIALISTS.map(s => (
                  <li key={s.title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-surface p-3">
                    <Ico icon={s.icon} tone={s.tone} size={34} />
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-gray-900">{s.title}</div>
                      <div className="text-[13.5px] text-gray-600">{s.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[13.5px] text-gray-500 mt-3">Each works from the company&apos;s own records, not from memory.</p>
            </li>
            <li className="st-card p-5 flex flex-col">
              <span className="st-ico t-green" style={{ ['--s' as string]: '40px' }} aria-hidden="true"><b>3</b></span>
              <h3 className="text-[17px] font-bold text-gray-900 mt-4">Compliance review, then one answer</h3>
              <p className="text-[14.5px] text-gray-600 mt-1.5">The answer is checked before you see it, and comes back with its sources.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ===== What it does ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="does">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="does" className="display-section">What it does, in the film.</h2>
          <p className="lede mt-3.5 max-w-[640px]">A day with an HR business partner: sign in, ask, add a document.</p>
          <Reveal as="ul" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {DOES.map((d, i) => (
              <li key={d.title} className="st-rise st-card p-6" style={turn(i)}>
                <Ico icon={d.icon} tone={d.tone} size={42} />
                <h3 className="text-[18px] font-bold tracking-[-0.01em] text-gray-900 mt-5">{d.title}</h3>
                <p className="text-[15px] leading-[1.55] text-gray-600 mt-2">{d.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== Underneath, and trust ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="underneath">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-2 gap-4">
          <div className="st-card p-6 sm:p-7">
            <h2 id="underneath" className="text-[clamp(22px,2.3vw,27px)] font-bold tracking-[-0.02em] text-gray-900">Every answer comes from your own data.</h2>
            <ul className="mt-5 space-y-4">
              {DATA.map(d => (
                <li key={d.title} className="flex items-start gap-4">
                  <Ico icon={d.icon} tone="cyan" size={36} />
                  <div><div className="text-[16px] font-semibold text-gray-900">{d.title}</div><div className="text-[14.5px] text-gray-600">{d.body}</div></div>
                </li>
              ))}
            </ul>
            <p className="text-[14.5px] text-gray-600 mt-5">It connects to the systems you already have.</p>
          </div>
          <div className="st-card p-6 sm:p-7">
            <h2 className="text-[clamp(22px,2.3vw,27px)] font-bold tracking-[-0.02em] text-gray-900">People stay in charge.</h2>
            <ul className="mt-5 space-y-4">
              {TRUST.map(t => (
                <li key={t.text} className="flex items-center gap-4">
                  <Ico icon={t.icon} tone="green" size={36} />
                  <span className="text-[16px] font-semibold text-gray-900">{t.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Beyond HR ===== */}
      <section className="px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="beyond">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6 lg:gap-12 items-center">
          <div>
            <h2 id="beyond" className="display-section">The same blueprint, any department.</h2>
            <p className="lede mt-3.5">Only the data and the instructions change.</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {DEPARTMENTS.map((d, i) => (
              <li key={d} className="st-chip text-[14.5px]" style={{ '--dot': i === 0 ? 'rgb(var(--primary-600))' : undefined } as React.CSSProperties}><i />{d}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== Two ways forward ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 py-10 lg:py-14" aria-labelledby="next">
        <div className="max-w-[1120px] mx-auto">
          <h2 id="next" className="display-section">Two ways to have one of your own.</h2>
          <p className="lede mt-3.5 max-w-[640px]">Your team learns to build it, or we build a proof of concept on your process first.</p>
          <div className="grid lg:grid-cols-2 gap-4 mt-8">
            <div className="st-card p-6 sm:p-7 flex flex-col">
              <div className="flex items-center gap-4">
                <Ico icon={GraduationCap} tone="blue" size={44} />
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900">Custom training</h3>
                  <p className="text-[14.5px] text-gray-600">Your team builds it, live and hands-on.</p>
                </div>
              </div>
              <ol className="mt-6 space-y-3.5 flex-1">
                {COURSE.map((c, i) => (
                  <li key={c.title} className="flex items-start gap-3.5">
                    <span className="st-ico t-blue mt-0.5" style={{ ['--s' as string]: '32px' }} aria-hidden="true"><b>{i + 1}</b></span>
                    <div><div className="text-[15.5px] font-semibold text-gray-900">{c.title}</div><div className="text-[14.5px] text-gray-600">{c.body}</div></div>
                  </li>
                ))}
              </ol>
              <p className="text-[14px] text-gray-500 mt-5">Built on your own process and examples, with a guide for every step.</p>
              <div className="mt-5"><OpenCustomTraining topic={`Building an AI team like ${NAME}`} className="st-pill st-ghost">Ask for custom training</OpenCustomTraining></div>
            </div>
            <div className="st-card st-lit p-6 sm:p-7 flex flex-col">
              <div className="flex items-center gap-4">
                <Ico icon={Hammer} tone="violet" size={44} />
                <div>
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] text-gray-900">A proof of concept</h3>
                  <p className="text-[14.5px] text-gray-600">We build it on your process, so you see it work first.</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {['We agree in writing what it will and will not do', 'We build it on your examples, or on sample data like this one', 'You try it, and we show your team how it works', 'Then you decide: grow it, train your team, or stop'].map(t => (
                  <li key={t} className="flex items-start gap-3 text-[15.5px] text-gray-900"><Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" strokeWidth={2} aria-hidden />{t}</li>
                ))}
              </ul>
              <div className="mt-6"><a href="#poc" className="st-pill">Ask for a proof of concept</a></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== The proof-of-concept form ===== */}
      <section id="poc" className="px-4 sm:px-6 py-12 lg:py-16 scroll-mt-20" aria-labelledby="poc-title">
        <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-12 items-start">
          <div>
            <h2 id="poc-title" className="display-section">Tell us the process.</h2>
            <p className="lede mt-3.5">A few lines are enough. We reply within one business day, with questions or a short plan, or tell you honestly if it is not a fit.</p>
            <ul className="mt-6 space-y-3.5">
              <li className="flex items-center gap-3.5"><Ico icon={Building2} tone="blue" size={34} /><span className="text-[15.5px] text-gray-900">For HR, or for any other department</span></li>
              <li className="flex items-center gap-3.5"><Ico icon={Wrench} tone="violet" size={34} /><span className="text-[15.5px] text-gray-900">Built on the tools you already use</span></li>
              <li className="flex items-center gap-3.5"><Ico icon={FlaskConical} tone="green" size={34} /><span className="text-[15.5px] text-gray-900">Tested on real cases from your work</span></li>
            </ul>
          </div>
          <div className="st-card p-6 sm:p-8">
            <PocRequestForm example={NAME} />
          </div>
        </div>
      </section>
    </main>
  )
}
