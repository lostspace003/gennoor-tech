'use client'

import { useState } from 'react'

/** Small "i" button that toggles a plain-English explanation next to a control. */
export default function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block align-middle ml-1">
      <button
        type="button"
        aria-label="What does this mean?"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onBlur={() => setOpen(false)}
        className="w-4 h-4 rounded-full border border-gray-300 text-xs leading-none font-semibold text-gray-500 hover:border-gray-500 hover:text-gray-700"
      >
        i
      </button>
      {open && (
        <span role="tooltip" className="absolute z-20 left-0 top-5 w-64 rounded-md border border-gray-200 bg-white p-2.5 text-xs font-normal normal-case text-gray-700 shadow-lg">
          {text}
        </span>
      )}
    </span>
  )
}
