/** @type {import('tailwindcss').Config} */

/**
 * ── Gennoor "iCloud-calm" palette ───────────────────────────────────────────
 *
 * One neutral ramp + one accent. Everything else is a *muted* semantic ramp
 * that exists only so genuine status text stays legible — never so a page can
 * be decorated with it.
 *
 * The source now names only five families: gray, primary, green, amber, red.
 * The decorative families below (purple, teal, indigo, pink, …) are no longer
 * referenced anywhere — they are kept, re-pointed at the system, purely as a
 * **guardrail**. Delete them and Tailwind's own vivid defaults come back, so a
 * stray `bg-purple-500` would silently punch a hole in the palette instead of
 * quietly resolving to grey.
 *
 * Adding a new colour here should feel like a big decision. It is.
 */

/**
 * Apple system neutrals.
 *
 * Two constraints drove the exact values, and both are easy to break:
 *
 *  1. `gray-50` is the panel surface (~185 usages: heroes, alternating
 *     sections, soft cards). It must be *visible* against white. At #fbfbfd
 *     it was a 1.03 contrast ratio — imperceptible — and the whole page
 *     collapsed into one flat white blur. #f5f5f7 is iCloud's actual sidebar
 *     grey and reads as a panel. Do not lighten it.
 *  2. `gray-400` is tertiary text (~285 usages). Below #8e8e93 it drops
 *     under 3:1 on white and stops being legible.
 */
const neutral = {
  50: '#f5f5f7',   // panel — the iCloud surface
  100: '#ebebef',  // deeper panel / row hover
  200: '#e0e0e5',  // hairline
  300: '#c7c7cc',  // strong hairline
  400: '#8e8e93',  // tertiary ink  (3.5:1 on white)
  500: '#6e6e73',  // secondary ink (5.1:1)
  600: '#545458',  // body ink      (7.4:1)
  700: '#3a3a3c',
  800: '#2c2c2e',
  900: '#1d1d1f',  // primary ink
  950: '#000000',
}

// The single accent. Used for links, active nav, and primary buttons. Nothing else.
const accentBlue = {
  50: '#f0f7ff',
  100: '#e8f0fe',
  200: '#cfe3fd',
  300: '#a6cbfa',
  400: '#5aa9f3',
  500: '#1a8cf0',
  600: '#0071e3',
  700: '#0058b0',
  800: '#004488',
  900: '#00336b',
  950: '#002450',
}

// Muted semantics. Tints (50/100) sit a hair off white so old `bg-green-50`
// panels read as paper, while 600/700 stays dark enough for accessible text.
const ok = {
  50: '#f3f8f4', 100: '#e4efe8', 200: '#c6dfcf', 300: '#98c6a7',
  400: '#5fa77a', 500: '#318f56', 600: '#1d8348', 700: '#17663a',
  800: '#14512f', 900: '#113f27', 950: '#0b2a1a',
}
const warn = {
  50: '#fbf8f0', 100: '#f5eeda', 200: '#e9dcb3', 300: '#d8c283',
  400: '#c2a455', 500: '#a98634', 600: '#9a6700', 700: '#7c5400',
  800: '#63430a', 900: '#52380c', 950: '#372408',
}
const err = {
  50: '#fdf4f3', 100: '#fbe7e5', 200: '#f4cbc7', 300: '#eaa59d',
  400: '#d9746a', 500: '#ca4d41', 600: '#c0392b', 700: '#9b2c21',
  800: '#7d251c', 900: '#682019', 950: '#3f120e',
}

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
        'gradient-primary': accentBlue[600],
        'gradient-glass': neutral[50],
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
