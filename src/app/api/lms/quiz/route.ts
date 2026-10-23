import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, getLmsQuizzes, saveLmsProgress } from '@/lib/lms'
import { noStore, requireEnrolled } from '@/lib/lms-guard'

async function load(slug: string, item: string, courseItem: ReturnType<typeof findLmsItem>) {
  if (!courseItem || courseItem.type !== 'quiz') return null
  return (await getLmsQuizzes(slug))[item] ?? null
}

// Questions go out WITHOUT the answer key; grading happens here.
export async function GET(req: NextRequest) {
  const gate = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (gate instanceof NextResponse) return gate
  const id = req.nextUrl.searchParams.get('item') || ''
  const quiz = await load(gate.course.slug, id, findLmsItem(gate.course, id))
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(
    { title: quiz.title, passPercent: quiz.passPercent, questions: quiz.questions.map(q => ({ question: q.question, answers: q.answers })) },
    { headers: noStore },
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const gate = await requireEnrolled(body.slug ?? null)
  if (gate instanceof NextResponse) return gate
  const id = String(body.item || '')
  const quiz = await load(gate.course.slug, id, findLmsItem(gate.course, id))
  if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const picks: number[] = Array.isArray(body.answers) ? body.answers : []
  const results = quiz.questions.map((q, i) => ({
    correct: picks[i] === q.correct,
    correctIndex: q.correct,
    explanation: q.explanation,
  }))
  const right = results.filter(r => r.correct).length
  const score = Math.round((right / quiz.questions.length) * 100)
  const passed = score >= quiz.passPercent
  await saveLmsProgress(gate.learner.email, gate.course.slug, id, { score, passed, done: passed })
  return NextResponse.json({ score, passed, passPercent: quiz.passPercent, results }, { headers: noStore })
}
