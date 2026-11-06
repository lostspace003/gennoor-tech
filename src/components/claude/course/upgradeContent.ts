/**
 * Turns the authored chapter HTML into "notebook" markup on the client, where a real DOM is available:
 *  - a .card whose sections are labelled with <h4> (What is it? / Why? / How? / Analogy / Example / Exam …)
 *    becomes a concept notebook (.cn) with icon-labelled facets in a two-column grid
 *  - .note callouts get an icon and a label (Note / Exam relevance / Watch out)
 *  - Python code blocks are highlighted and get a copy button
 *  - tables are wrapped so wide ones scroll inside their own box
 */
import { pyHighlight } from '@/lib/pyhl'

const ICON: Record<string, string> = {
  what: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  why: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  how: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/></svg>',
  analogy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>',
  example: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  when: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  arch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 8.5 4.9v9.8L12 21.6l-8.5-4.9V6.9z"/><path d="M3.5 7 12 12l8.5-5M12 12v9.6"/></svg>',
  exam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>',
  output: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3M12 15h6"/></svg>',
  walk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3"/><path d="M12 9v4M12 17h.01"/></svg>',
}

const FACETS: [RegExp, string, string, boolean][] = [
  // [matcher on the h4 text, facet kind, label, full width]
  [/what is it|what it is|^what\b/i, 'what', 'What it is', false],
  [/why/i, 'why', 'Why it matters', false],
  [/how does it work|how it works|^how\b/i, 'how', 'How it works', false],
  [/analogy/i, 'analogy', 'Think of it as', false],
  [/practical example|^example|in practice/i, 'example', 'In the story', false],
  [/code implementation|^code\b/i, 'code', 'Code', true],
  [/reading the output/i, 'output', 'Reading the output', true],
  [/architecture/i, 'arch', 'Architecture', false],
  [/when to use/i, 'when', 'When to use it', false],
  [/exam/i, 'exam', 'Exam lens', true],
]

function facetFor(label: string): [string, string, boolean] {
  for (const [re, kind, name, wide] of FACETS) if (re.test(label)) return [kind, name, wide]
  return ['other', label, false]
}

function upgradeCards(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('div.card').forEach(card => {
    const h4s = Array.from(card.children).filter(el => el.tagName === 'H4')
    if (h4s.length < 1) return
    const cn = document.createElement('section')
    cn.className = 'cn'
    const grid = document.createElement('div')
    grid.className = 'cn-grid'
    let intro: HTMLElement | null = null
    let facet: HTMLElement | null = null
    Array.from(card.childNodes).forEach(node => {
      const isH4 = node.nodeType === 1 && (node as Element).tagName === 'H4'
      if (isH4) {
        const label = (node as Element).textContent || ''
        const [kind, name, wide] = facetFor(label)
        facet = document.createElement('div')
        facet.className = 'cn-f ' + kind + (wide ? ' wide' : '')
        const k = document.createElement('div')
        k.className = 'cn-k'
        k.innerHTML = (ICON[kind] || ICON.other) + '<span></span>'
        ;(k.lastChild as HTMLElement).textContent = kind === 'other' ? label : name
        facet.appendChild(k)
        grid.appendChild(facet)
        return
      }
      if (!facet) {
        if (!intro) { intro = document.createElement('div'); intro.className = 'cn-intro' }
        intro.appendChild(node)
      } else {
        facet.appendChild(node)
      }
    })
    // facets that contain a code player or a table need the full width
    grid.querySelectorAll<HTMLElement>('.cn-f').forEach(f => {
      if (f.querySelector('[data-player], .cp-wrap, table, pre, [data-anim]')) f.classList.add('wide')
    })
    if (intro) cn.appendChild(intro)
    cn.appendChild(grid)
    card.replaceWith(cn)
  })
}

function upgradeNotes(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('div.note').forEach(note => {
    if (note.querySelector(':scope > .note-ic')) return
    const exam = note.classList.contains('exam'), warn = note.classList.contains('warn')
    let label = exam ? 'Exam relevance' : warn ? 'Watch out' : 'Note'
    // "<b>Exam relevance:</b> text" → use the bold lead as the label
    const first = note.firstElementChild
    if (first && first.tagName === 'B' && /:\s*$/.test(first.textContent || '') && (first.textContent || '').length < 40) {
      label = (first.textContent || '').replace(/:\s*$/, '')
      first.remove()
    }
    const ic = document.createElement('span')
    ic.className = 'note-ic'
    ic.innerHTML = exam ? ICON.exam : warn ? ICON.warn : ICON.note
    const k = document.createElement('span')
    k.className = 'note-k'
    k.textContent = label
    note.prepend(k)
    note.prepend(ic)
  })
}

function copyText(text: string, btn: HTMLButtonElement) {
  const ok = () => { btn.textContent = 'Copied ✓'; setTimeout(() => { btn.textContent = 'Copy' }, 1500) }
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, () => { btn.textContent = 'Press Ctrl+C' })
}

function upgradeCode(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('pre > code.py').forEach(code => {
    const raw = code.textContent || ''
    code.innerHTML = pyHighlight(raw)
    const pre = code.parentElement as HTMLElement
    if (pre.querySelector(':scope > .cp')) return
    const b = document.createElement('button')
    b.type = 'button'; b.className = 'cp'; b.textContent = 'Copy'
    b.onclick = () => copyText(raw, b)
    pre.appendChild(b)
  })
}

function upgradeTables(root: HTMLElement) {
  root.querySelectorAll<HTMLTableElement>('table').forEach(t => {
    if (t.parentElement && t.parentElement.classList.contains('tw')) return
    const w = document.createElement('div')
    w.className = 'tw'
    t.replaceWith(w)
    w.appendChild(t)
  })
}

export function upgradeContent(root: HTMLElement) {
  upgradeCards(root)
  upgradeNotes(root)
  upgradeCode(root)
  upgradeTables(root)
  // the old guide's exam engine mounted here; the reader has its own exam player
  root.querySelectorAll<HTMLElement>('#exam-root').forEach(el => { el.className = 'exam-root-placeholder'; el.removeAttribute('id') })
}
