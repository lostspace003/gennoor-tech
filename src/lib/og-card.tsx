import { createElement, type ReactElement } from 'react'
import { ImageResponse } from 'next/og'
import type { LucideIcon } from 'lucide-react'
import type { Tone } from '@/components/stage/Ico'

/**
 * The picture a page shows when its link is shared (LinkedIn, WhatsApp, X, a search result):
 * 1200 x 630, light and coloured: the page's icon tile on the colour of that tile, dark words
 * on a light ground. It is light on purpose (owner, 13 Nov 2026): a dark picture read as a
 * black box in a chat and nobody looked at it.
 *
 * Drawn by next/og, which knows only a small part of CSS: every box with more than one thing
 * in it needs `display: flex`, and there is one font in one weight, so the heading gets its
 * weight from a thin outline in its own colour.
 *
 * Used by src/app/og/[key] (the fixed pages) and src/app/og/blog/[slug] (the blog posts).
 */

export const OG_SIZE = { width: 1200, height: 630 }

/** The colours of a tile, as in .st-ico of src/styles/stage.css: light, middle, dark, glow. */
const TILE: Record<Tone, [string, string, string, string]> = {
  blue: ['#7fc0ff', '#2a7bff', '#12306e', 'rgba(61,148,255,0.55)'],
  gold: ['#ffe29a', '#ffab2e', '#8a4a00', 'rgba(255,170,46,0.5)'],
  green: ['#9ff3cf', '#22b47e', '#0a4a36', 'rgba(34,180,126,0.5)'],
  violet: ['#cfc6ff', '#7a66ff', '#2a1f7a', 'rgba(122,102,255,0.55)'],
  claude: ['#ffc3a3', '#e0764a', '#7a3215', 'rgba(224,118,74,0.55)'],
  rose: ['#ffc0cf', '#f0527a', '#7a1436', 'rgba(240,82,122,0.5)'],
  cyan: ['#b4f4f7', '#25b8c4', '#0a4f5c', 'rgba(37,184,196,0.5)'],
  ink: ['#5a6c94', '#2a3654', '#131b30', 'rgba(0,0,0,0.5)'],
}
/** The colour the small line above the heading is written in, on the light card. */
const INK: Record<Tone, string> = {
  blue: '#1657d6', gold: '#a35f00', green: '#0c7a54', violet: '#5a45e0', claude: '#b5522a', rose: '#c62a55', cyan: '#0b7b88', ink: '#3d4a68',
}
/** The words: the heading, the line under it, the address at the foot. */
const WORDS = { head: '#0b1533', soft: '#3d4a68', foot: '#5a6889' }

type IconNode = Array<[string, Record<string, string | number>]>
/** A lucide icon, or 'spark': the eight-ray spark of the Claude pages. */
export type OgIcon = LucideIcon | 'spark'
const SPARK = 'M12 2l1.6 6.1L19 4.9l-3.4 5.2 6.1 1.9-6.1 1.9L19 19.1l-5.4-3.2L12 22l-1.6-6.1L5 19.1l3.4-5.2L2.3 12l6.1-1.9L5 4.9l5.4 3.2L12 2z'

/** The lines of a lucide icon. A lucide icon keeps them in the element its render function returns. */
function linesOf(icon: LucideIcon): IconNode {
  try {
    const made = (icon as unknown as { render: (props: object, ref: null) => { props?: { iconNode?: IconNode } } }).render({}, null)
    return made?.props?.iconNode || []
  } catch {
    return []
  }
}

function Shape({ icon, size, soft }: { icon: OgIcon; size: number; soft?: boolean }) {
  if (icon === 'spark') {
    return soft ? null : (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: '23%', top: '23%' }}>
        <path d={SPARK} fill="#ffffff" />
      </svg>
    )
  }
  const paint = soft
    ? { fill: '#ffffff', fillOpacity: 0.26, stroke: 'none' }
    : { fill: 'none', stroke: '#ffffff', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: '23%', top: '23%' }}>
      {linesOf(icon).map(([tag, attrs], i) => {
        const { key: _key, ...rest } = attrs as Record<string, string | number> & { key?: string }
        return createElement(tag, { ...rest, ...paint, key: i })
      })}
    </svg>
  )
}

/** One glass tile with its icon, as on the site. */
function Tile({ icon, tone, size, turn = 0 }: { icon: OgIcon; tone: Tone; size: number; turn?: number }) {
  const [a, b, c, glow] = TILE[tone]
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundImage: `linear-gradient(155deg, ${a} 0%, ${b} 44%, ${c} 100%)`,
        boxShadow: `0 ${Math.round(size * 0.2)}px ${Math.round(size * 0.42)}px ${glow}, 0 0 0 1px rgba(255,255,255,0.14)`,
        // next/og refuses a style that is set but empty, so the turn is only named when there is one
        ...(turn ? { transform: `rotate(${turn}deg)` } : null),
      }}
    >
      {/* the light on the top left of the glass */}
      <div style={{ display: 'flex', position: 'absolute', left: '10%', top: '6%', width: '60%', height: '36%', borderRadius: '50%', backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 70%)' }} />
      <Shape icon={icon} size={size * 0.54} soft />
      <Shape icon={icon} size={size * 0.54} />
    </div>
  )
}

export interface OgCard {
  /** The small line above the heading: what kind of page it is */
  kicker: string
  /** The heading */
  title: string
  /** One line under the heading. Leave out for a long heading. */
  line?: string
  /** The address written at the foot, without https:// */
  foot: string
  icon: OgIcon
  tone: Tone
  /** Up to two smaller tiles beside the big one */
  beside?: Array<{ icon: OgIcon; tone: Tone }>
}

const cut = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '').replace(/[\s,;:.—-]+$/, '')}…`)

export function ogCard(card: OgCard): ReactElement {
  const title = cut(card.title, 118)
  const size = title.length <= 34 ? 74 : title.length <= 56 ? 64 : title.length <= 84 ? 54 : 47
  const line = card.line && title.length <= 84 ? cut(card.line, 96) : ''
  const [light, mid] = TILE[card.tone]
  const [left, right] = card.beside || []
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', color: WORDS.head, backgroundColor: '#f3f6ff', backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #eff3ff 46%, #e1e8ff 100%)' }}>
      {/* the colour of the page's tile, as light behind the tiles */}
      <div style={{ display: 'flex', position: 'absolute', right: -250, top: -260, width: 1000, height: 1000, borderRadius: 500, opacity: 0.5, backgroundImage: `radial-gradient(circle at 50% 50%, ${mid} 0%, ${light} 34%, rgba(255,255,255,0) 68%)` }} />
      <div style={{ display: 'flex', position: 'absolute', right: 150, bottom: -330, width: 620, height: 620, borderRadius: 310, opacity: 0.3, backgroundImage: 'radial-gradient(circle at 50% 50%, #7a66ff 0%, rgba(255,255,255,0) 68%)' }} />
      <div style={{ display: 'flex', position: 'absolute', left: -280, bottom: -440, width: 800, height: 800, borderRadius: 400, opacity: 0.2, backgroundImage: 'radial-gradient(circle at 50% 50%, #2a7bff 0%, rgba(255,255,255,0) 68%)' }} />

      {/* the words */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 770, padding: '60px 0 58px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: WORDS.head, WebkitTextStroke: `0.7px ${WORDS.head}` }}>
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, backgroundColor: '#ff9d1c', marginRight: 10 }} />
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, backgroundColor: '#2a7bff', marginRight: 18 }} />
          Gennoor Tech
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 27, color: INK[card.tone], marginBottom: 18, WebkitTextStroke: `0.6px ${INK[card.tone]}` }}>{card.kicker}</div>
          <div style={{ display: 'flex', fontSize: size, lineHeight: 1.1, letterSpacing: -1.2, color: WORDS.head, WebkitTextStroke: `1.4px ${WORDS.head}` }}>{title}</div>
          {line ? <div style={{ display: 'flex', fontSize: 29, lineHeight: 1.35, color: WORDS.soft, marginTop: 24 }}>{line}</div> : null}
        </div>
        <div style={{ display: 'flex', fontSize: 25, color: WORDS.foot }}>{card.foot}</div>
      </div>

      {/* the tiles */}
      <div style={{ display: 'flex', position: 'relative', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        {left ? (
          <div style={{ display: 'flex', position: 'absolute', left: 18, top: 352 }}>
            <Tile icon={left.icon} tone={left.tone} size={104} turn={-8} />
          </div>
        ) : null}
        {right ? (
          <div style={{ display: 'flex', position: 'absolute', right: 44, top: 126 }}>
            <Tile icon={right.icon} tone={right.tone} size={104} turn={8} />
          </div>
        ) : null}
        <Tile icon={card.icon} tone={card.tone} size={214} />
      </div>
    </div>
  )
}

/**
 * The picture itself. next/og draws a PNG of about 350 KB; WhatsApp is said to leave out a
 * preview picture over 300 KB, so it is saved again as a JPEG (about a quarter of the size)
 * with the image tool that comes with Next. Without that tool the PNG is sent as it is.
 */
export async function ogImageResponse(card: OgCard): Promise<Response> {
  const png = Buffer.from(await new ImageResponse(ogCard(card), { ...OG_SIZE }).arrayBuffer())
  const cache = 'public, max-age=86400'
  try {
    const sharp = (await import('sharp')).default
    const jpeg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
    return new Response(new Uint8Array(jpeg), { headers: { 'content-type': 'image/jpeg', 'cache-control': cache } })
  } catch {
    return new Response(new Uint8Array(png), { headers: { 'content-type': 'image/png', 'cache-control': cache } })
  }
}
