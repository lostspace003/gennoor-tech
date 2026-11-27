/**
 * The drawn line icons of everything we send (owner, 27 November 2026, after a Claude email: "so minimum written but
 * makes it attractive. Too much color does not give the people necessity ... icons, theme matches our system").
 * One style: a calm dark line on one soft wash, the drawing a little off the wash like a hand placed it. Few colours:
 * the ink, and one wash per idea. The Microsoft squares and the Claude spark are the makers' own marks, drawn small.
 *
 *   lineIcon('MonitorPlay', { wash: 'blue' })   SVG markup, 64 x 64 units, for a page or a PDF
 *   brandMark('microsoft' | 'claude')             the two marks, as SVG
 * Used by catalog/build.mjs and scripts/email-art/icons-png.mjs (the PNG copies an email needs: email apps show no SVG).
 */
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const require = createRequire(path.join(ROOT, 'package.json'))
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const lucide = require('lucide-react')

export const INK = '#1b2540'
export const WASHES = {
  blue: '#e4ecfb', sand: '#efe9dd', mint: '#dff1e8', lilac: '#ebe6f8', rose: '#f6e3ea', sky: '#dff0f6', claude: '#f5e4dc', none: 'transparent',
}

/** The inside of a lucide icon (its paths), drawn on the 24-unit grid. */
function lucideInside(name) {
  const I = lucide[name]
  if (!I) throw new Error(`There is no lucide icon called ${name}`)
  const svg = renderToStaticMarkup(React.createElement(I, {}))
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
}

export function lineIcon(name, { wash = 'blue', size = 64, stroke = 1.55 } = {}) {
  const w = WASHES[wash] ?? wash
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" class="li">
  <circle cx="35" cy="35" r="24" fill="${w}"/>
  <g transform="translate(14 14) scale(1.5)" fill="none" stroke="${INK}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${lucideInside(name)}</g>
</svg>`
}

const SPARK = 'M12 2l1.6 6.1L19 4.9l-3.4 5.2 6.1 1.9-6.1 1.9L19 19.1l-5.4-3.2L12 22l-1.6-6.1L5 19.1l3.4-5.2L2.3 12l6.1-1.9L5 4.9l5.4 3.2L12 2z'

export function brandMark(which, size = 18) {
  if (which === 'microsoft') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 23 23" class="bm" aria-label="Microsoft"><rect width="11" height="11" fill="#F25022"/><rect x="12" width="11" height="11" fill="#7FBA00"/><rect y="12" width="11" height="11" fill="#00A4EF"/><rect x="12" y="12" width="11" height="11" fill="#FFB900"/></svg>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" class="bm" aria-label="Claude"><path fill="#D97757" d="${SPARK}"/></svg>`
}
