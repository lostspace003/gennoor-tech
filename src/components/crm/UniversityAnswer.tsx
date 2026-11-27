import { UNI_AREAS, UNI_COURSES, UNI_WALKTHROUGH, type UniFormAnswer } from '@/lib/crm/universities-types'

/** What one answer to the evaluation form says. Plain text everywhere: these are a stranger's words. */
export default function AnswerBody({ a }: { a: UniFormAnswer }) {
  return (
    <dl className="mt-3 space-y-2 text-sm">
      <div><dt className="text-xs font-medium text-gray-500">Where</dt><dd className="text-gray-900 break-words">{a.institution} · {a.department} · {a.place}</dd></div>
      <div><dt className="text-xs font-medium text-gray-500">Who gets access</dt>
        <dd className="text-gray-900">{a.reps.map((r) => <span key={r.email} className="block break-words">{r.name}{r.title ? `, ${r.title}` : ''} · <a href={`mailto:${r.email}`} className="text-primary-700 hover:underline">{r.email}</a></span>)}</dd></div>
      <div><dt className="text-xs font-medium text-gray-500">Courses</dt><dd className="text-gray-900">{a.courses.map((id) => <span key={id} className="block">{UNI_COURSES.find((c) => c.id === id)?.title || id}</span>)}</dd></div>
      {a.areas.length > 0 && <div><dt className="text-xs font-medium text-gray-500">Also interested in</dt><dd className="text-gray-700">{a.areas.map((id) => UNI_AREAS.find((x) => x.id === id)?.label || id).join(' · ')}</dd></div>}
      {a.walkthrough && <div><dt className="text-xs font-medium text-gray-500">Walkthrough</dt><dd className="text-gray-700">{UNI_WALKTHROUGH.find((w) => w.id === a.walkthrough)?.label}</dd></div>}
      {a.notes && <div><dt className="text-xs font-medium text-gray-500">Notes</dt><dd className="text-gray-700 whitespace-pre-line break-words">{a.notes}</dd></div>}
    </dl>
  )
}
