import { pageMeta } from '@/lib/seo'
import { verifyDecision } from '@/lib/complimentary'

export const dynamic = 'force-dynamic'
export const metadata = pageMeta({ title: 'Complimentary access: decide', description: 'Approve or reject a request.', path: '/complimentary-access/decide', noindex: true })

/** Where the Approve and Reject buttons of the team's email land: one more press decides (a link alone never does). */
export default async function Decide({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams
  const box = 'mx-auto max-w-[560px] px-4 py-16 text-center'
  if (q.done) return <div className={box}><h1 className="text-xl font-bold text-gray-900">Done</h1><p className="mt-3 text-gray-600">{q.done.slice(0, 300)}</p></div>
  const check = verifyDecision(q.r || '', q.a || '', q.e || '', q.t || '')
  if (!check.ok) return <div className={box}><h1 className="text-xl font-bold text-gray-900">This link cannot be used</h1><p className="mt-3 text-gray-600">{check.why}</p></div>
  const approve = check.action === 'approve'
  return (
    <div className={box}>
      <h1 className="text-xl font-bold text-gray-900">{approve ? 'Approve this request?' : 'Reject this request?'}</h1>
      <p className="mt-3 text-gray-600">{approve ? 'A code is made for each course chosen and emailed to the person at once.' : 'The request is closed and nothing is sent.'}</p>
      <form method="post" action="/api/complimentary/decide" className="mt-6">
        {(['r', 'a', 'e', 't'] as const).map((k) => <input key={k} type="hidden" name={k} value={q[k] || ''} />)}
        <button type="submit" className={`inline-flex items-center rounded-xl px-6 py-3 text-[15px] font-semibold text-white ${approve ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>{approve ? 'Approve and send the codes' : 'Reject'}</button>
      </form>
    </div>
  )
}
