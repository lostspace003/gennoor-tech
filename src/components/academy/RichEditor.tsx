'use client'

import { useEffect, useRef } from 'react'
import { Bold, Heading3, Italic, Link2, List, ListOrdered, Quote } from 'lucide-react'

/**
 * A small rich-text box for the community: bold, italic, heading, lists, quote and links.
 * It hands the HTML to onChange; the server cleans it again before anything is stored.
 */
export default function RichEditor({ value, onChange, placeholder, minHeight = 120, label }: {
  value: string; onChange: (html: string) => void; placeholder?: string; minHeight?: number; label?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Only write into the box when the parent changes it from outside (for example after posting).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value
  }, [value])

  const run = (cmd: string, arg?: string) => {
    ref.current?.focus()
    document.execCommand(cmd, false, arg)
    onChange(ref.current?.innerHTML ?? '')
  }
  const addLink = () => {
    const url = window.prompt('Link address (https://…)')
    if (url && /^https?:\/\//i.test(url.trim())) run('createLink', url.trim())
  }

  const Btn = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" title={title} aria-label={title} onMouseDown={e => e.preventDefault()} onClick={onClick}
      className="p-1.5 rounded-md text-[#6e6e73] hover:bg-white hover:text-gray-900 transition-colors">{children}</button>
  )

  return (
    <div className="border border-[#d2d2d7] rounded-xl bg-white focus-within:border-primary-600 overflow-hidden">
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#f5f6f8] border-b border-[#e8e8ed]">
        <Btn title="Bold" onClick={() => run('bold')}><Bold className="w-4 h-4" /></Btn>
        <Btn title="Italic" onClick={() => run('italic')}><Italic className="w-4 h-4" /></Btn>
        <Btn title="Heading" onClick={() => run('formatBlock', 'h3')}><Heading3 className="w-4 h-4" /></Btn>
        <Btn title="Bulleted list" onClick={() => run('insertUnorderedList')}><List className="w-4 h-4" /></Btn>
        <Btn title="Numbered list" onClick={() => run('insertOrderedList')}><ListOrdered className="w-4 h-4" /></Btn>
        <Btn title="Quote" onClick={() => run('formatBlock', 'blockquote')}><Quote className="w-4 h-4" /></Btn>
        <Btn title="Link" onClick={addLink}><Link2 className="w-4 h-4" /></Btn>
      </div>
      <div
        ref={ref}
        role="textbox"
        aria-multiline="true"
        aria-label={label || 'Your post'}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange(ref.current?.innerHTML ?? '')}
        onPaste={e => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')) }}
        style={{ minHeight }}
        className="rich-body px-3.5 py-2.5 text-[14.5px] text-gray-900 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-[#86868b]"
      />
    </div>
  )
}

/** Renders already-sanitized HTML from the server. */
export function RichText({ html, className = '' }: { html: string; className?: string }) {
  return <div className={`rich-body ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
