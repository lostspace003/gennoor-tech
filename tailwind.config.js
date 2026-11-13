/** @type {import('tailwindcss').Config} */

/**
 * ── Gennoor palette ─────────────────────────────────────────────────────────
 *
 * Every colour here is a CSS variable, not a fixed value. The values live in
 * src/styles/globals.css, twice:
 *
 *   :root    "paper": the light values. The admin centre, the CRM and the
 *            lesson players use these.
 *   .stage   "the stage": the dark values of the public website, the same look
 *            as the presentation and the films (see docs/DESIGN.md).
 *
 * So `text-gray-900` is near-black on paper and near-white on the stage, and
 * `bg-gray-50` is a soft panel in both. A page never has to know which one it
 * is on. Two rules follow from that:
 *
 *  1. Write colours with these names (`text-gray-500`), never as a hex in
 *     square brackets (`text-[#6e6e73]`): a hex cannot change with the theme.
 *  2. `gray` is a ramp of roles, not of lightness: 50/100 are panels, 200/300
 *     hairlines, 400-600 secondary text, 900 primary text. For a surface use
 *     `bg-surface` (the page) or `bg-raised` (a card); for a block that stays
 *     dark on both themes use `bg-inverse`.
 *
 * The source names only five families: gray, primary, green, amber, red. The
 * other names (purple, teal, indigo, pink, ...) are kept, pointed at the system,
 * as a guardrail: delete them and Tailwind's own vivid defaults come back.
 */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`
const ramp = (family) => Object.fromEntries(STEPS.map((step) => [step, v(`${family}-${step}`)]))

const neutral = ramp('gray')
// The single accent: links, the selected row in the menu, the main button.
const accentBlue = ramp('primary')
// Muted meanings: done, take care, something is wrong.
const ok = ramp('green')
const warn = ramp('amber')
const err = ramp('red')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── The system ──────────────────────────────────────────────
        primary: accentBlue,
        gray: neutral,
        slate: neutral,
        zinc: neutral,
        neutral: neutral,
        stone: neutral,
        dark: neutral,

        // ── Muted semantics ─────────────────────────────────────────
        green: ok,
        emerald: ok,
        lime: ok,
        amber: warn,
        yellow: warn,
        orange: warn,
        red: err,
        rose: err,

        // ── Guardrail aliases ───────────────────────────────────────
        // Unreferenced by design. They exist so that if anyone reaches for an
        // off-system hue, it resolves to the system instead of Tailwind's
        // vivid default. None of them adds a colour.
        accent: accentBlue,
        blue: accentBlue,
        sky: accentBlue,
        indigo: accentBlue,
        secondary: neutral,
        purple: neutral,
        violet: neutral,
        fuchsia: neutral,
        pink: neutral,
        teal: neutral,
        cyan: neutral,

        success: ok[600],
        warning: warn[600],
        error: err[600],

        // ── Surfaces ────────────────────────────────────────────────
        // The page itself, a card lifted off it, and a block that is dark on both themes.
        surface: v('surface'),
        raised: v('raised'),
        inverse: v('inverse'),
      },
      fontFamily: {
        // Apple system stack — the whole site sets type in the platform's own face.
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Flattened: the old brand gradients now resolve to solid accent/paper.
        'gradient-primary': 'linear-gradient(rgb(var(--primary-600)), rgb(var(--primary-600)))',
        'gradient-glass': 'linear-gradient(rgb(var(--gray-50)), rgb(var(--gray-50)))',
        'gradient-glow': 'none',
        'gradient-ambient': 'none',
        'gradient-mesh': 'none',
      },
      boxShadow: {
        // Depth comes from 1px hairlines and whitespace, not blur or glow.
        // The glow-* names are kept and neutered so no file needs editing.
        'glass': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'glass-glow': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'ambient': 'none',
        'glow-blue': '0 1px 2px rgba(0, 0, 0, 0.06)',
        'glow-teal': '0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        // Ambient motion is off; names kept so existing classes stay valid.
        'gradient-shift': 'none',
        'float': 'none',
        'glow': 'none',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
