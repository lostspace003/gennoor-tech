/*
  The parts the scenes are built from: icons, the logo mark, the dotted ring, windows.
  Each function returns HTML as text. build.mjs hands in window.ART:
    ART.icons  the line drawings of the lucide icons we use
    ART.files  pictures (logo, course thumbnails, the partner badge) as file addresses
    ART.data   facts read from the website (catalog-data.json), so nothing is typed twice
*/
const ART = window.ART || { icons: {}, files: {}, data: {} }
const SITE = 'https://www.gennoor.com'
let UID = 0
const uid = () => `u${++UID}`

/** A glass tile with a two-tone glyph. tone: blue | gold | green | violet | claude | rose | ink */
function ico(name, size = 64, tone = 'blue', cls = '') {
  const inner = ART.icons[name] || ''
  return `<span class="ico t-${tone} ${cls}" style="--s:${size}px"><svg viewBox="0 0 24 24" aria-hidden="true">
    <g fill="#fff" fill-opacity=".26" stroke="none">${inner}</g>
    <g fill="none" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg></span>`
}

/** The eight-ray spark the site uses on its Claude pages, as a glyph for an icon tile. */
const SPARK = '<path d="M12 2l1.6 6.1L19 4.9l-3.4 5.2 6.1 1.9-6.1 1.9L19 19.1l-5.4-3.2L12 22l-1.6-6.1L5 19.1l3.4-5.2L2.3 12l6.1-1.9L5 4.9l5.4 3.2L12 2z"/>'
function sparkIco(size = 64, label = '') {
  return `<span class="ico t-claude" style="--s:${size}px;flex-direction:column;gap:${Math.round(size * .04)}px"><svg viewBox="0 0 24 24" style="width:${label ? 40 : 56}%;height:${label ? 40 : 56}%"><g fill="#fff">${SPARK}</g></svg>${label ? `<b style="position:relative;font:800 ${Math.round(size * .17)}px/1 var(--display);letter-spacing:.02em;color:#fff">${label}</b>` : ''}</span>`
}

/** The logo mark, dot for dot: twelve blue dots in an open ring, and the bar of the G. */
const MARK_DOTS = [[51.8, 40.1], [45.2, 48.6], [35.5, 53.4], [24.8, 53.4], [15.1, 48.8], [8.4, 40.5], [6, 30], [8.4, 19.5], [15.1, 11.2], [24.8, 6.6], [35.5, 6.6], [45.2, 11.4]]
function mark(size = 60, glow = true) {
  const dot = (x, y, c) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`
  return `<svg width="${size}" height="${size}" viewBox="0 0 60 60" style="overflow:visible;${glow ? 'filter:drop-shadow(0 0 ' + size * .12 + 'px rgba(61,148,255,.55))' : ''}">
    ${MARK_DOTS.map(([x, y]) => dot(x, y, '#3d94ff')).join('')}${dot(38, 30, '#ffb02e')}${dot(46, 30, '#ffb02e')}${dot(54, 30, '#3d94ff')}</svg>`
}

/**
 * A large ring of fine dots, the logo's ring at the scale of the whole picture. It turns slowly.
 * r: radius, n: dots, open: how many dots are left out at the upper right (the opening of the G).
 */
function ring(r, n = 72, o = {}) {
  const { dot = 2.4, open = 4, color = '#6fb4ff', gold = 3, alpha = .9, speed = 2 } = o
  const size = r * 2 + 40
  let dots = ''
  for (let i = 0; i < n; i++) {
    if (i >= n - open) continue
    const a = (i / n) * Math.PI * 2 + 0.44
    const big = i % 6 === 0
    const isGold = i < gold
    dots += `<circle cx="${(size / 2 + r * Math.cos(a)).toFixed(1)}" cy="${(size / 2 + r * Math.sin(a)).toFixed(1)}" r="${(big ? dot * 1.7 : dot).toFixed(1)}" fill="${isGold ? '#ffc24b' : color}" opacity="${(big ? alpha : alpha * .55).toFixed(2)}"/>`
  }
  return `<div class="ring" data-loop="spin" data-speed="${speed}" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${dots}</svg></div>`
}

/** The ground of a scene: coloured glows, the dot grid, grain and a vignette. `glows` = [x, y, size, colour] */
function ground(glows, o = {}) {
  return `${glows.map(([x, y, s, c], i) => `<div class="aura" data-loop="drift" data-i="${i}" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;--c:${c}"></div>`).join('')}
    <div class="dots" style="--mx:${o.mx || 50}%;--my:${o.my || 45}%"></div>${o.extra || ''}<div class="vignette"></div><div class="grain"></div>`
}
const GLOW = {
  blue: [[150, 90, 900, 'rgba(34,110,255,.34)'], [1150, 640, 820, 'rgba(120,96,255,.26)'], [1000, 60, 520, 'rgba(255,190,80,.09)']],
  deep: [[1100, 120, 900, 'rgba(34,110,255,.32)'], [140, 640, 760, 'rgba(98,224,232,.14)'], [640, 760, 700, 'rgba(120,96,255,.2)']],
  violet: [[640, 80, 1000, 'rgba(120,96,255,.3)'], [120, 660, 700, 'rgba(34,110,255,.28)'], [1200, 620, 600, 'rgba(98,224,232,.12)']],
  claude: [[1080, 140, 900, 'rgba(229,138,98,.3)'], [140, 620, 800, 'rgba(34,110,255,.26)'], [700, 760, 600, 'rgba(255,190,80,.1)']],
  gold: [[640, 40, 900, 'rgba(255,170,46,.2)'], [120, 600, 860, 'rgba(34,110,255,.34)'], [1180, 620, 700, 'rgba(120,96,255,.26)']],
  green: [[1100, 600, 900, 'rgba(62,213,152,.16)'], [160, 110, 900, 'rgba(34,110,255,.32)'], [700, 0, 600, 'rgba(120,96,255,.16)']],
}

/** The words above a scene: a small gold label and the line under it. Both arrive when the scene opens. */
function head(kicker, title, o = {}) {
  const x = o.x ?? 84, y = o.y ?? 62
  return `<div class="abs kicker" data-b="0" data-fx="fade" style="left:${x}px;top:${y}px;${o.color ? `color:${o.color}` : ''}">${kicker}</div>
    <div class="abs h2" data-b="0" data-o="1" style="left:${x - 2}px;top:${y + 26}px;width:${o.w ?? 1000}px">${title}</div>`
}

/** Deck only: the way out to the website, shown as a button with the address. */
function go(label, path, o = {}) {
  const url = path.startsWith('http') ? path : `${SITE}${path}`
  const shown = url.replace('https://www.', '')
  return `<div class="abs pill ${o.cls || ''}" data-b="${o.b ?? 9}" data-fx="rise" data-film="0" data-href="${url}" data-alt="${label}: ${shown}" style="left:${o.x ?? 84}px;top:${o.y ?? 632}px"><small>${label}</small>${shown} <span>&rarr;</span></div>`
}

/** A feature row: icon, a few words, a few more. */
function feat(icon, tone, title, line, cls = 'card') {
  return `<div class="feat ${cls}">${ico(icon, 58, tone)}<div><b>${title}</b><small>${line}</small></div></div>`
}

const img = (key, style = '') => `<img src="${ART.files[key] || ''}" style="display:block;${style}" alt="">`
const thumb = (slug, w, style = '') => `<div class="thumb" style="width:${w}px;height:${Math.round(w * 9 / 16)}px;background-image:url('${ART.files['thumb-' + slug] || ''}');${style}"></div>`
/** The Claude Partner Network badge on its own white card, as the brand rules ask. */
const cpn = (w = 240) => `<div style="display:inline-block;background:#fff;border-radius:16px;padding:${Math.round(w * .055)}px;box-shadow:0 24px 60px -20px rgba(0,0,0,.7)">${img('cpn', `width:${w}px`)}</div>`
const CPN_LINE = 'Gennoor is Certified in the Claude Partner Network.'
