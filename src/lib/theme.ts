/**
 * The two looks of the public website: 'dark' (the stage, the default) and 'light' (soft
 * grey paper). The choice is kept in the visitor's browser; nothing is sent anywhere.
 *
 * The class goes on <html>: `stage` for dark, `day` for light (src/styles/stage.css).
 * The lesson players get neither and keep the plain paper values of globals.css. The admin
 * centre and the CRM are paper too unless the person there chooses dark (see the end of this file).
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

// ---- The back office: the admin centre and the CRM ---------------------------------------------------------------
//
// They are light ("paper") unless the person working there chooses dark (owner, November 2026: a dark look for
// the admin, "light stays default"). The choice is their own, kept apart from the public site's, in this browser.
// Dark is the stage's own colour values (the class `stage` on <html>), so every colour written by name is right
// in it without a second set of values to keep. Pages of the back office must therefore write colours by name:
// `python scripts/stage-codemod.py --admin` finds the ones that do not.

export type AdminTheme = 'light' | 'dark'
export const ADMIN_THEME_KEY = 'gennoor.admin.theme'

/** Is this a page of the admin centre or the CRM? */
export const isBackOffice = (pathname: string | null | undefined) => /^\/(admin|crm)(\/|$)/.test(pathname || '')

export function readAdminTheme(): AdminTheme {
  try {
    return window.localStorage.getItem(ADMIN_THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveAdminTheme(theme: AdminTheme) {
  try {
    window.localStorage.setItem(ADMIN_THEME_KEY, theme)
  } catch {
    /* private mode: the choice lasts for this page only */
  }
}

/** Put the back office's look on the page: nothing for light (paper), the stage's values for dark. */
export function showAdminTheme(theme: AdminTheme) {
  const root = document.documentElement
  root.classList.toggle('stage', theme === 'dark')
  root.classList.remove('day')
}

/**
 * Runs in <head> before anything is drawn, so a visitor who chose the light look never sees
 * a flash of the dark one, and someone who chose the dark admin never sees a flash of white.
 * It must agree with isChromelessRoute() in src/lib/chrome.ts and isBackOffice() above:
 * the lesson players get no theme class; the admin centre and the CRM get their own choice.
 */
export const THEME_SCRIPT = `(function(){try{var p=location.pathname;if(/^\\/(admin|crm)(\\/|$)/.test(p)){var a=null;try{a=localStorage.getItem('${ADMIN_THEME_KEY}')}catch(e){}if(a==='dark')document.documentElement.classList.add('stage');return}if(/^\\/studio\\/[^/]+\\/learn\\/?$/.test(p)||/^\\/ai-academy\\/[^/]+\\/[^/]+/.test(p))return;var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}document.documentElement.classList.add(t==='light'?'day':'stage')}catch(e){}})()`
