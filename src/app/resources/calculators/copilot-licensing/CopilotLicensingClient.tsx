'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp, AlertCircle } from 'lucide-react'

const COPILOT_PRICE_PER_USER_PER_MONTH = 30 // public list

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0, style: 'currency', currency: 'USD' })

export default function CopilotLicensingClient() {
  const [total, setTotal] = useState(500)
  const [heavy, setHeavy] = useState(20) // %
  const [moderate, setModerate] = useState(35) // %
  const [light, setLight] = useState(45) // %
  const [pilotSpend, setPilotSpend] = useState(60000)

  const calc = useMemo(() => {
    const sum = heavy + moderate + light
    const normHeavy = (heavy / sum) * 100
    const normModerate = (moderate / sum) * 100
    const normLight = (light / sum) * 100

    const heavyUsers = Math.round(total * normHeavy / 100)
    const moderateUsers = Math.round(total * normModerate / 100)
    const lightUsers = Math.round(total * normLight / 100)

    // Recommendation: license all heavy + half moderate + none light in year 1
    const recommendedLicenses = heavyUsers + Math.round(moderateUsers * 0.5)
    const blanketLicenses = total

    const recommendedYearly = recommendedLicenses * COPILOT_PRICE_PER_USER_PER_MONTH * 12
    const blanketYearly = blanketLicenses * COPILOT_PRICE_PER_USER_PER_MONTH * 12
    const savings = blanketYearly - recommendedYearly

    return {
      heavyUsers,
      moderateUsers,
      lightUsers,
      recommendedLicenses,
      blanketLicenses,
      recommendedYearly,
      blanketYearly,
      savings,
      totalYear1: recommendedYearly + pilotSpend,
    }
  }, [total, heavy, moderate, light, pilotSpend])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-secondary-400/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> COPILOT LICENSING
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Don’t blanket-license Copilot.
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Most orgs over-buy in year 1 and under-train. Size your rollout by persona, fund the adoption pilot, and watch usage actually stick.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Your org</h2>
            <Slider label="Total headcount" value={total} setValue={setTotal} min={10} max={20000} step={10} suffix="people" />
            <Slider label="% heavy users (knowledge workers, leaders)" value={heavy} setValue={setHeavy} min={0} max={100} step={5} suffix="%" />
            <Slider label="% moderate users (managers, ops)" value={moderate} setValue={setModerate} min={0} max={100} step={5} suffix="%" />
            <Slider label="% light users (occasional / frontline)" value={light} setValue={setLight} min={0} max={100} step={5} suffix="%" />
            <Slider label="Adoption pilot spend (year 1)" value={pilotSpend} setValue={setPilotSpend} min={0} max={500000} step={5000} prefix="$" />

            <div className="mt-4 text-xs text-gray-500 flex gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Persona percentages don’t need to sum to 100 — we normalize. Heavy = daily doc/email/data work. Moderate = a few touches a day. Light = occasional consumer of others’ output.</span>
            </div>
          </div>

          {/* Output */}
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-800 text-white rounded-2xl p-6 md:p-8 sticky top-6 self-start">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary-200 mb-6">Recommended mix</h2>

            <Row label={`Heavy users (license all)`} value={`${calc.heavyUsers.toLocaleString()} licenses`} />
            <Row label={`Moderate users (license 50%)`} value={`${Math.round(calc.moderateUsers * 0.5).toLocaleString()} licenses`} />
            <Row label={`Light users (defer year 1)`} value={`0 licenses`} />
            <Divider />
            <Row label="Recommended licenses" value={calc.recommendedLicenses.toLocaleString()} highlight />
            <Row label="Year-1 license cost" value={fmt(calc.recommendedYearly)} />
            <Row label="Adoption pilot" value={fmt(pilotSpend)} />
            <Divider />
            <Row label="Total year-1 investment" value={fmt(calc.totalYear1)} large />
            <Row label="vs blanket-license everyone" value={`${fmt(calc.savings)} saved`} />

            <Link
              href={`/contact?intent=pilot&fromCalc=copilot-licensing&licenses=${calc.recommendedLicenses}`}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-secondary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Plan our rollout — book a call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <Tip
            icon={TrendingUp}
            title="Why not blanket?"
            body="Year-1 usage skews 80/20 to the heavy persona. Buying for everyone burns budget on seats that won’t generate value until year 2 anyway."
          />
          <Tip
            icon={TrendingUp}
            title="Why fund a pilot?"
            body="A $40–60k adoption pilot lifts usage 3–5× vs no pilot. That is the difference between a $360k license investment paying off — or not."
          />
          <Tip
            icon={TrendingUp}
            title="Year 2 question"
            body="Reassess moderate users at 6 months. If a sub-group has crossed into heavy use, expand. If not, you saved the licenses for something that will."
          />
        </div>
      </section>
    </div>
  )
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string
  value: number
  setValue: (n: number) => void
  min: number
  max: number
  step: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm font-bold text-secondary-700 tabular-nums">
          {prefix}
          {value.toLocaleString()}
          {suffix && ` ${suffix}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full h-1.5 accent-secondary-600 cursor-pointer"
      />
    </div>
  )
}

function Row({ label, value, large, highlight }: { label: string; value: string; large?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/70">{label}</span>
      <span className={`tabular-nums font-bold ${large ? 'text-2xl' : 'text-base'} ${highlight ? 'text-primary-200' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-white/10 my-2" />
}

function Tip({ icon: Icon, title, body }: { icon: typeof TrendingUp; title: string; body: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <Icon className="w-5 h-5 text-secondary-600 mb-2" />
      <h3 className="font-bold text-gray-900 mb-1 text-sm">{title}</h3>
      <p className="text-xs text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}
