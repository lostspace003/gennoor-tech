import { randomInt } from 'crypto'

// Every post gets its own art direction (style, colours, composition), chosen so that consecutive posts never look alike.
// The brand stays constant through the real Gennoor logo and website strip that is added afterwards, so the visuals are
// free to be varied. Blue is one option among many, not the default.
export interface Art { style: string; palette: string; composition: string }

export const STYLES = [
  'isometric 3D scene made of soft clay-like objects, gentle studio lighting',
  'layered paper-cut collage with soft drop shadows and visible paper texture',
  'bold editorial flat-vector illustration built from large geometric shapes',
  'two-colour risograph print with grain and slightly offset layers',
  'architectural blueprint-style line drawing with flat colour fills',
  'glossy abstract 3D objects on a seamless backdrop, dramatic studio lighting',
  'macro still-life photograph of physical objects acting as a metaphor, shallow depth of field',
  'retro-futurist travel-poster illustration with simple shapes and a sun or moon',
  'low-poly faceted landscape with crisp lighting',
  'ink and watercolour wash editorial illustration with loose, confident brushwork',
  'Swiss-style poster composition with oversized geometric forms and strong rhythm',
  'neon-noir city at dusk with rain reflections, cinematic',
  'abstract data sculpture: bars, ribbons and flows made of tactile materials like glass, wood and metal',
  'miniature diorama with tilt-shift focus, tiny figures and props',
]

export const PALETTES = [
  'warm terracotta, cream and deep olive with a saffron accent',
  'emerald and forest green with soft mint highlights and a warm off-white',
  'aubergine and plum with a coral-pink accent',
  'charcoal and warm amber with a touch of off-white',
  'deep teal and sand with a pale yellow accent',
  'oxblood red and antique gold on a dark warm background',
  'slate grey with a sharp lime accent',
  'violet and mint with a cool grey base',
  'sunrise gradient from deep magenta through orange to pale gold',
  'ocean blue with a complementary orange accent',
  'ink black and cream with a single vermilion accent',
  'sage green, blush pink and cream, calm and light',
]

export const COMPOSITIONS = [
  'one strong hero object centred, generous empty space around it',
  'wide panorama with a clear horizon and depth',
  'a diagonal flow leading the eye across the frame',
  'rule-of-thirds layout with calm negative space on the left',
  'top-down flat lay, objects arranged with intention',
  'close-up detail with soft background blur',
]

const pick = <T,>(list: T[], avoid: string[] = []): T => {
  const fresh = list.filter(x => !avoid.includes(String(x)))
  const from = fresh.length ? fresh : list
  return from[randomInt(from.length)]
}

/** A new art direction that differs from the recent ones (pass the `style`/`palette` strings of recent drafts). */
export function pickArt(recent: Art[] = []): Art {
  const last = recent.slice(0, 6)
  return {
    style: pick(STYLES, last.map(a => a.style)),
    palette: pick(PALETTES, last.map(a => a.palette)),
    composition: pick(COMPOSITIONS, last.slice(0, 3).map(a => a.composition)),
  }
}

/** Appended to an image prompt so it carries this post's own look and overrides any default palette it mentions. */
export function artBrief(a: Art): string {
  return `Art direction for this image (follows over any palette or style mentioned above; do NOT use dark navy or electric blue unless the palette below says so): style: ${a.style}. Colour palette: ${a.palette}. Composition: ${a.composition}. Build a specific visual metaphor for this post's single idea; avoid generic glowing brains, circuit boards, network nodes and padlocks. Fresh and distinctive, magazine quality, no text, no letters, no logos, no watermarks. Keep the bottom 12% of the frame calm and uncluttered.`
}

/** The art-direction instruction for the post-writing model, so it writes an image prompt that fits. */
export const artInstruction = (a: Art) => `\nFor the imagePrompt, use this art direction instead of any default palette: ${a.style}; palette: ${a.palette}; composition: ${a.composition}. Describe a specific visual metaphor for this post's one idea (no generic brains, circuit boards or glowing networks), no text in the image.`
