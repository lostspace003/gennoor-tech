/**
 * The two looks of the public website: 'dark' (the stage, the default) and 'light' (soft
 * grey paper). The choice is kept in the visitor's browser; nothing is sent anywhere.
 *
 * The class goes on <html>: `stage` for dark, `day` for light (src/styles/stage.css).
 * Pages with their own full-screen shell (admin, CRM, the lesson players) get neither
 * and keep the plain paper values of globals.css.
 */
export type Theme = 'dark' | 'light'
export const THEME_KEY = 'gennoor.theme'
export const THEME_CLASS: Record<Theme, string> = { dark: 'stage', light: 'day' }

export function readTheme(): Theme {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/** Put the theme on the page. `none` is for the pages that have their own shell. */
export function showTheme(theme: Theme | 'none') {
  const root = document.documentElement
  root.classList.toggle('stage', theme === 'dark')
  root.classList.toggle('day', theme === 'light')
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* private mode: the choice lasts for this page only */
  }
}

/**
 * Runs in <head> before anything is drawn, so a visitor who chose the light look never sees
 * a flash of the dark one. It must agree with isChromelessRoute() in src/lib/chrome.ts:
 * those pages get no theme class.
 */
export const THEME_SCRIPT = `(function(){try{var p=location.pathname;if(/^\\/(admin|crm)(\\/|$)/.test(p)||/^\\/studio\\/[^/]+\\/learn\\/?$/.test(p)||/^\\/ai-academy\\/[^/]+\\/[^/]+/.test(p))return;var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}document.documentElement.classList.add(t==='light'?'day':'stage')}catch(e){}})()`
