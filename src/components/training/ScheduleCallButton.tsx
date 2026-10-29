'use client'

import { useState } from 'react'
import ScheduleCallModal from '@/components/training/ScheduleCallModal'

/** The "Schedule a Call" button; opens the booking popup over the page. */
export default function ScheduleCallButton({ course, courseSlug, label = 'Schedule a Call', className }: { course?: string; courseSlug?: string; label?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={className || 'inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-primary-700 transition-colors'}>
        {label}
      </button>
      <ScheduleCallModal isOpen={open} onClose={() => setOpen(false)} course={course} courseSlug={courseSlug} />
    </>
  )
}
