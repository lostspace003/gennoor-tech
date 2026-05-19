'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calculator, TrendingUp, Clock, Users, DollarSign } from 'lucide-react'

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0, style: 'currency', currency: 'USD' })

export default function AIROICalculatorClient() {
  const [team, setTeam] = useState(50)
  const [hoursPerWeek, setHoursPerWeek] = useState(3)
  const [loadedCost, setLoadedCost] = useState(45) // $/hr fully-loaded
  const [programSpend, setProgramSpend] = useState(50000) // year-1 program cost
  const [adoption, setAdoption] = useState(60) // % of team realizing benefit
  const [sustainmentMonthly, setSustainmentMonthly] = useState(4000)

  const calc = useMemo(() => {
    const activeUsers = team * (adoption / 100)
    const hoursSavedYear = activeUsers * hoursPerWeek * 48
    const grossSavingsY1 = hoursSavedYear * loadedCost
    const sustainmentY1 = sustainmentMonthly * 12
    const totalSpendY1 = programSpend + sustainmentY1
    const netY1 = grossSavingsY1 - totalSpendY1
    const paybackMonths = grossSavingsY1 > 0 ? (totalSpendY1 / (grossSavingsY1 / 12)) : Infinity
    const grossSavingsY3 = grossSavingsY1 * 3
    const totalSpendY3 = programSpend + sustainmentY1 * 3
    const netY3 = grossSavingsY3 - totalSpendY3
    const roiPctY1 = totalSpendY1 > 0 ? ((netY1 / totalSpendY1) * 100) : 0
    return {
      activeUsers,
      hoursSavedYear,
      grossSavingsY1,
      totalSpendY1,
      netY1,
      paybackMonths,
      netY3,
      roiPctY1,
    }
  }, [team, hoursPerWeek, loadedCost, programSpend, adoption, sustainmentMonthly])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0C1426] via-[#0F1B33] to-[#1A2547] text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-primary-500/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs tracking-widest text-secondary-300 mb-6">
            <Calculator className="w-3.5 h-3.5" /> ROI CALCULATOR
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            AI ROI in 60 seconds.
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            No vendor math. Adjust the inputs that match your reality — see payback period and year-1 net before you book the call.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Your inputs</h2>
            <NumberSlider label="Team size benefiting" icon={Users} value={team} setValue={setTeam} min={5} max={5000} step={5} suffix="people" />
            <NumberSlider label="Hours saved / person / week" icon={Clock} value={hoursPerWeek} setValue={setHoursPerWeek} min={0.5} max={15} step={0.5} suffix="hrs" />
            <NumberSlider label="Fully-loaded cost / hour" icon={DollarSign} value={loadedCost} setValue={setLoadedCost} min={15} max={250} step={5} prefix="$" suffix="/hr" />
            <NumberSlider label="Realistic adoption" icon={TrendingUp} value={adoption} setValue={setAdoption} min={10} max={100} step={5} suffix="%" />
            <NumberSlider label="Year-1 program spend" icon={DollarSign} value={programSpend} setValue={setProgramSpend} min={5000} max={1000000} step={5000} prefix="$" />
            <NumberSlider label="Sustainment retainer / month" icon={DollarSign} value={sustainmentMonthly} setValue={setSustainmentMonthly} min={0} max={50000} step={500} prefix="$" suffix="/mo" />
          </div>

          {/* Outputs */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-6 md:p-8 sticky top-6 self-start">
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary-300 mb-6">Estimated outcome</h2>

            <OutcomeRow label="Active users (after adoption)" value={`${Math.round(calc.activeUsers).toLocaleString()} people`} />
            <OutcomeRow label="Hours saved / year" value={`${Math.round(calc.hoursSavedYear).toLocaleString()} hrs`} />
            <Divider />
            <OutcomeRow label="Gross savings year 1" value={fmt(calc.grossSavingsY1)} />
            <OutcomeRow label="Total spend year 1" value={fmt(calc.totalSpendY1)} />
            <Divider />
            <OutcomeRow label="Net value year 1" value={fmt(calc.netY1)} large highlight={calc.netY1 > 0} />
            <OutcomeRow label="Payback period" value={calc.paybackMonths === Infinity ? '—' : `${calc.paybackMonths.toFixed(1)} months`} />
            <OutcomeRow label="3-year net (same adoption)" value={fmt(calc.netY3)} />
            <OutcomeRow label="Year-1 ROI" value={`${calc.roiPctY1.toFixed(0)}%`} />

            <Link
              href={`/contact?intent=pilot&roiNet=${Math.round(calc.netY1)}`}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-primary-700 font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Pilot this — book a call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500 leading-relaxed max-w-3xl">
          <strong>How to read this:</strong> Treat the result as an upper bound, not a forecast.
          Real programs see 60–80% of the modeled savings in year 1; year 2+ is where the compounding starts.
          The sustainment line is what most vendors leave out — it’s included here on purpose.
        </div>
      </section>
    </div>
  )
}

function NumberSlider({
  label,
  icon: Icon,
  value,
  setValue,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string
  icon: typeof Calculator
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
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Icon className="w-4 h-4 text-gray-400" />
          {label}
        </label>
        <span className="text-sm font-bold text-primary-700 tabular-nums">
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
        className="w-full h-1.5 accent-primary-600 cursor-pointer"
      />
    </div>
  )
}

function OutcomeRow({ label, value, large, highlight }: { label: string; value: string; large?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-white/70">{label}</span>
      <span className={`tabular-nums font-bold ${large ? 'text-2xl' : 'text-base'} ${highlight ? 'text-secondary-300' : 'text-white'}`}>
        {value}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-white/10 my-2" />
}
