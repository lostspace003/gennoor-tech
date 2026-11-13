'use client'

import { Loader2, Paperclip, Link2, FileText, ImageIcon, X } from 'lucide-react'

export interface Ref { id: string; kind: 'url' | 'file' | 'image'; name: string; chars: number }

/** Reference material picker: paste a link or attach a document or image. Used by the Social and Blog studios. */
export default function RefBox({ refs, busy, url, setUrl, onUrl, onFile, onRemove }: { refs: Ref[]; busy: boolean; url: string; setUrl: (v: string) => void; onUrl: () => void; onFile: (f: File) => void; onRemove: (id: string) => void }) {
  return (
    <div className="mb-2">
      {refs.length > 0 && (
        <ul className="mb-2 space-y-1">
          {refs.map(r => (
            <li key={r.id} className="flex items-center gap-1.5 text-xs rounded-md bg-gray-50 border border-gray-200 px-2 py-1">
              {r.kind === 'url' ? <Link2 className="w-3 h-3 shrink-0 text-gray-500" /> : r.kind === 'image' ? <ImageIcon className="w-3 h-3 shrink-0 text-gray-500" /> : <FileText className="w-3 h-3 shrink-0 text-gray-500" />}
              <span className="truncate flex-1" title={r.name}>{r.name}</span>
              <button type="button" aria-label="Remove reference" onClick={() => onRemove(r.id)} className="text-gray-400 hover:text-red-600"><X className="w-3 h-3" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-1.5">
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && url.trim()) onUrl() }} placeholder="Paste a link…" className="flex-1 min-w-0 text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-500" />
        <button type="button" disabled={!url.trim() || busy} onClick={onUrl} className="px-2 py-1.5 text-xs rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40">{busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}</button>
        <label title="PDF, Word, text, markdown, CSV, JSON, HTML or an image" className="px-2 py-1.5 text-xs rounded-md border border-gray-200 bg-raised hover:border-gray-400 cursor-pointer inline-flex items-center">
          <Paperclip className="w-3.5 h-3.5" />
          <input type="file" className="hidden" accept=".pdf,.docx,.txt,.md,.csv,.json,.html,.htm,image/*" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
        </label>
      </div>
    </div>
  )
}
