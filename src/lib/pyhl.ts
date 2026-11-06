/** Tiny Python highlighter (VS Code Light+ scopes). Works on partial lines, which the
 *  code player needs while it "types" a file out. Output uses t-* classes styled in cert-course.css. */

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function set(s: string): Record<string, 1> {
  const o: Record<string, 1> = {}
  s.split(' ').forEach(w => { o[w] = 1 })
  return o
}
const CTL = set('if elif else for while return yield try except finally raise with await import from as pass break continue assert del match case')
const KW = set('def class async lambda global nonlocal and or not in is')
const CONST = set('None True False self cls')
const BUILTIN = set('print len isinstance str int float dict list set tuple range any all sum min max round open input enumerate zip type super sorted map filter repr bool bytes getattr hasattr')
const RE = /(#[^\n]*)|((?:[fFrRbB]{1,2})?"""[\s\S]*?(?:"""|$))|((?:[fFrRbB]{1,2})?"(?:\\.|[^"\\\n])*"?|(?:[fFrRbB]{1,2})?'(?:\\.|[^'\\\n])*'?)|(@[A-Za-z_][\w.]*)|(\b\d[\d_]*\.?\d*(?:e[+-]?\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/g

function sp(c: string, t: string): string {
  return '<span class="t-' + c + '">' + escapeHtml(t) + '</span>'
}

export function pyHighlight(src: string): string {
  let out = ''
  let m: RegExpExecArray | null
  let prevSig = ''
  const re = new RegExp(RE.source, 'g')
  while ((m = re.exec(src))) {
    if (m[1]) out += sp('com', m[1])
    else if (m[2] || m[3]) out += sp('str', m[2] || m[3])
    else if (m[4]) out += sp('dec', m[4])
    else if (m[5]) out += sp('num', m[5])
    else if (m[6]) {
      const w = m[6]
      const next = src.charAt(re.lastIndex)
      let cls: string
      if (prevSig === 'def') cls = 'fn'
      else if (prevSig === 'class') cls = 'cls'
      else if (CTL[w]) cls = 'ctl'
      else if (KW[w]) cls = 'kw'
      else if (CONST[w]) cls = 'const'
      else if (prevSig === '.') cls = next === '(' ? 'fn' : 'prop'
      else if (BUILTIN[w] && next === '(') cls = 'fn'
      else if (next === '(') cls = /^[A-Z]/.test(w) ? 'cls' : 'fn'
      else if (/^[A-Z][a-z]/.test(w)) cls = 'cls'
      else if (/^[A-Z_0-9]+$/.test(w) && w.length > 1) cls = 'const'
      else cls = 'var'
      out += sp(cls, w)
      prevSig = w
    } else {
      out += escapeHtml(m[7])
      if (!/\s/.test(m[7])) prevSig = m[7]
    }
  }
  return out
}

/** Minimal highlighter for the non-Python reference snippets (markdown / json / yaml / text). */
export function plainHighlight(src: string, lang: string): string {
  if (lang === 'python' || lang === 'py') return pyHighlight(src)
  const esc = escapeHtml(src)
  if (lang === 'json') {
    return esc
      .replace(/(&quot;|")((?:\\.|[^"\\])*)\1(\s*:)/g, (_m, q, k, c) => '<span class="t-prop">' + q + k + q + '</span>' + c)
      .replace(/:(\s*)("(?:\\.|[^"\\])*")/g, (_m, s, v) => ':' + s + '<span class="t-str">' + v + '</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="t-const">$1</span>')
      .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="t-num">$1</span>')
  }
  if (lang === 'markdown' || lang === 'md') {
    return esc
      .replace(/^(#{1,6} .*)$/gm, '<span class="t-cls">$1</span>')
      .replace(/^(\s*[-*] )/gm, '<span class="t-kw">$1</span>')
      .replace(/(\*\*[^*]+\*\*)/g, '<span class="t-fn">$1</span>')
  }
  if (lang === 'yaml' || lang === 'yml') {
    return esc
      .replace(/^(\s*#.*)$/gm, '<span class="t-com">$1</span>')
      .replace(/^(\s*[\w.-]+)(:)/gm, '<span class="t-prop">$1</span>$2')
  }
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    return esc.replace(/^(\s*#.*)$/gm, '<span class="t-com">$1</span>').replace(/(\$\w+)/g, '<span class="t-var">$1</span>')
  }
  return esc
}
