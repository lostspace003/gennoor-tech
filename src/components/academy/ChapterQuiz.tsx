'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import type { QuizQuestion } from '@/data/academy/chapter-content/types'

interface ChapterQuizProps {
  questions: QuizQuestion[]
}

interface QuestionState {
  selectedIndex: number | null
  submitted: boolean
}

export default function ChapterQuiz({ questions }: ChapterQuizProps) {
  const [state, setState] = useState<QuestionState[]>(
    questions.map(() => ({ selectedIndex: null, submitted: false })),
  )

  const reset = () => {
    setState(questions.map(() => ({ selectedIndex: null, submitted: false })))
  }

  const allSubmitted = state.every((s) => s.submitted)
  const correctCount = state.filter(
    (s, i) => s.submitted && s.selectedIndex === questions[i].correctIndex,
  ).length

  return (
    <div className="rounded-3xl p-6 lg:p-8 glass-card glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-1">
            Chapter Quiz
          </p>
          <h3 className="text-xl font-bold text-gray-900">
            {questions.length} question{questions.length === 1 ? '' : 's'}
          </h3>
        </div>
        {allSubmitted && (
          <div className="text-right">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              Your score
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {correctCount} / {questions.length}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <QuestionView
            key={qIdx}
            number={qIdx + 1}
            question={q}
            state={state[qIdx]}
            onSelect={(idx) => {
              setState((prev) => {
                const next = [...prev]
                next[qIdx] = { ...next[qIdx], selectedIndex: idx }
                return next
              })
            }}
            onSubmit={() => {
              setState((prev) => {
                const next = [...prev]
                next[qIdx] = { ...next[qIdx], submitted: true }
                return next
              })
            }}
          />
        ))}
      </div>

      {allSubmitted && (
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            {correctCount === questions.length
              ? 'Perfect score. Nice work.'
              : correctCount >= Math.ceil(questions.length * 0.7)
                ? 'Solid pass. Review the explanations on the ones you missed.'
                : 'Worth re-reading the chapter and trying again.'}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset quiz
          </button>
        </div>
      )}
    </div>
  )
}

function QuestionView({
  number,
  question,
  state,
  onSelect,
  onSubmit,
}: {
  number: number
  question: QuizQuestion
  state: QuestionState
  onSelect: (idx: number) => void
  onSubmit: () => void
}) {
  const isCorrect = state.submitted && state.selectedIndex === question.correctIndex
  const isWrong =
    state.submitted &&
    state.selectedIndex !== null &&
    state.selectedIndex !== question.correctIndex

  return (
    <div className="rounded-2xl p-5 bg-gray-50/60 border border-gray-100">
      <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
        Question {number}
      </p>
      <p className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const isSelected = state.selectedIndex === idx
          const isCorrectAnswer = idx === question.correctIndex
          const showResult = state.submitted

          let stateClass = 'bg-white border-gray-200 hover:border-primary-300'
          if (showResult && isCorrectAnswer) {
            stateClass = 'bg-emerald-50 border-emerald-300'
          } else if (showResult && isSelected && !isCorrectAnswer) {
            stateClass = 'bg-red-50 border-red-300'
          } else if (!showResult && isSelected) {
            stateClass = 'bg-primary-50 border-primary-300'
          }

          return (
            <button
              key={idx}
              onClick={() => !state.submitted && onSelect(idx)}
              disabled={state.submitted}
              className={`w-full text-left rounded-xl p-3 border transition-all ${stateClass} ${
                state.submitted ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 mt-0.5 flex-shrink-0">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-sm text-gray-700 leading-relaxed flex-grow">
                  {option}
                </span>
                {showResult && isCorrectAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {!state.submitted && state.selectedIndex !== null && (
        <button
          onClick={onSubmit}
          className="mt-4 inline-flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all"
        >
          Check answer
        </button>
      )}

      {state.submitted && (
        <div
          className={`mt-4 rounded-xl p-4 ${
            isCorrect
              ? 'bg-emerald-50/60 border border-emerald-200/60'
              : isWrong
                ? 'bg-amber-50/60 border border-amber-200/60'
                : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">
            {isCorrect ? 'Correct' : 'Explanation'}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
