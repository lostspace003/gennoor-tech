/**
 * The two looks of the public website: 'dark' (the stage) and 'light' (the day look, soft grey paper).
 *
 * Which one shows follows the visitor's own clock (owner, 13 November 2026: "If it is the daylight, it will
 * be light. If it is the dawn or the night time, it will be dark ... as per the zone in which the website is
 * being opened"). Light from DAY_FROM to DAY_UNTIL, dark the rest of the time. The clock of the visitor's
 * device is already in their own zone, so nothing is asked of them and nothing is sent anywhere.
 *
 * The switch still works. A choice made by hand lasts until the next change of the clock (the next evening
 * or the next morning) and is kept in the visitor's browser; after that the clock decides again.
 *
 * The class goes on <html>: `stage` for dark, `day` for light (src/styles/stage.css).
 * The lesson players get neither and keep the plain paper values of globals.css. The admin
 * centre and the CRM are paper too unless the person there chooses dark (see the end of this file).
 */
export type Theme = 'dark' | 'light'
export const THEME_CLASS: Record<Theme, string> = { dark: 'stage', light: 'day' }

/** The light look is shown from this hour (07:00 on the visitor's device)... */
export const DAY_FROM = 7
/** ...until this hour (18:00), when the dark look returns. Change the two numbers here and nowhere else. */
export const DAY_UNTIL = 18

/** A choice made by hand: "<look>|<the moment it stops counting, in milliseconds>". */
export const THEME_CHOICE_KEY = 'gennoor.theme.choice'
/**
 * Where a choice was kept before the site followed the clock. It decided for ever, so it must not decide
 * any more: everyone who once pressed the switch would never see the new rule. It is removed when met.
 */
const OLD_THEME_KEY = 'gennoor.theme'

/**
 * The look a visitor sees unless they choose: always light (owner, 27 November 2026: "default view on website should
 * always be light theme"). The switch still gives dark to whoever presses it, until the next 07:00 or 18:00.
 */
export function lookAt(_when: Date = new Date()): Theme {
  return 'light'
}

/** The next moment the clock changes the look: the next 07:00 or 18:00 on this device, in milliseconds. */
export function nextChange(when: Date = new Date()): number {
  const at = new Date(when.getTime())
  const hour = when.getHours()
  if (hour < DAY_FROM) at.setHours(DAY_FROM, 0, 0, 0)
  else if (hour < DAY_UNTIL) at.setHours(DAY_UNTIL, 0, 0, 0)
  else { at.setDate(at.getDate() + 1); at.setHours(DAY_FROM, 0, 0, 0) }
  return at.getTime()
}

// When the browser gives no storage (a private window), a choice lasts for this page only
let pageChoice: string | null = null

function storedChoice(): string | null {
  try {
    const store = window.localStorage
    if (store.getItem(OLD_THEME_KEY) !== null) store.removeItem(OLD_THEME_KEY)
    return store.getItem(THEME_CHOICE_KEY)
  } catch {
    return pageChoice
  }
}

function keepChoice(value: string | null) {
  pageChoice = value
  try {
    if (value === null) window.localStorage.removeItem(THEME_CHOICE_KEY)
    else window.localStorage.setItem(THEME_CHOICE_KEY, value)
  } catch {
    /* private mode: pageChoice holds it */
  }
}

/** The look to show now: a choice made by hand while it still counts, otherwise what the clock gives. */
export function readTheme(): Theme {
  const now = new Date()
  const raw = storedChoice()
  if (raw) {
    const [look, until] = raw.split('|')
    if ((look === 'light' || look === 'dark') && Number(until) > now.getTime()) return look
    keepChoice(null) // it has run out (or is not a choice at all)
  }
  return lookAt(now)
}

/**
 * Put the theme on the page. `none` is for the pages that have their own shell.
 * The class is changed in one step, so <html> never carries both looks, or neither, on the way.
 */
export function showTheme(theme: Theme | 'none') {
  const root = document.documentElement
  const others = root.className.split(/\s+/).filter((c) => c && c !== THEME_CLASS.dark && c !== THEME_CLASS.light)
  const next = (theme === 'none' ? others : [...others, THEME_CLASS[theme]]).join(' ')
  if (root.className !== next) root.className = next
}

/**
 * The visitor pressed the switch. The choice counts until the clock next changes the look; choosing what
 * the clock gives anyway is not a choice, and hands the look back to the clock.
 */
export function saveTheme(theme: Theme) {
  const now = new Date()
  keepChoice(theme === lookAt(now) ? null : `${theme}|${nextChange(now)}`)
}

// ---- The back office: the admin centre and the CRM ---------------------------------------------------------------
//
// They are light ("paper") unless the person working there chooses dark (owner, November 2026: a dark look for
// the admin, "light stays default"). The choice is their own, kept apart from the public site's, in this browser,
// and it does not follow the clock.
// Dark is the stage's own colour values (the class `stage` on <html>), so every colour written by name is right
// in it without a second set of values to keep. Pages of the back office must therefore write colours by name:
// `python scripts/stage-codemod.py --admin` finds the ones that do not.

export type AdminTheme = 'light' | 'dark'
export const ADMIN_THEME_KEY = 'gennoor.admin.theme'

/** Is this a page of the admin centre or the CRM? */
export const isBackOffice = (pathname: string | null | undefined) => /^\/(admin|crm)(\/|$)/.test(pathname || '')

/**
 * The admin centre and the CRM follow the clock too (owner, 14 November 2026: "in the admin panel, same
 * process. In the day, it will be light, and in the night, it will be dark"). A look switched by hand holds
 * until the next change of day and night, exactly as on the public site: it is kept as "<look>|<until>".
 * A choice kept the old way (the bare word, with no time) is no longer followed.
 */
export function readAdminTheme(): AdminTheme {
  try {
    const [look, until] = (window.localStorage.getItem(ADMIN_THEME_KEY) || '').split('|')
    if ((look === 'light' || look === 'dark') && Number(until) > Date.now()) return look
  } catch {
    /* no storage: the clock decides */
  }
  return lookAt()
}

export function saveAdminTheme(theme: AdminTheme) {
  try {
    window.localStorage.setItem(ADMIN_THEME_KEY, `${theme}|${nextChange()}`)
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
 * Runs in <head> before anything is drawn, so no visitor sees a flash of the other look, and someone who
 * chose the dark admin never sees a flash of white.
 *
 * For a public page it is the rule of readTheme() above, written out by hand because it runs before any
 * other code: a choice made by hand while it still counts, otherwise the hour on the visitor's device. The
 * hours and the names of the keys are taken from the constants above, so the two cannot drift apart;
 * `node scripts/look-check.mjs` proves that they agree on the real page.
 *
 * It must also agree with isChromelessRoute() in src/lib/chrome.ts and isBackOffice() above:
 * the lesson players get no theme class; the admin centre and the CRM get their own choice.
 */
export const THEME_SCRIPT = `(function(){try{var p=location.pathname,d=document.documentElement;if(/^\\/(admin|crm)(\\/|$)/.test(p)){var m=new Date(),g=m.getHours(),a=g>=${DAY_FROM}&&g<${DAY_UNTIL}?'light':'dark';try{var b=(localStorage.getItem('${ADMIN_THEME_KEY}')||'').split('|');if((b[0]==='light'||b[0]==='dark')&&+b[1]>m.getTime())a=b[0]}catch(e){}if(a==='dark')d.classList.add('stage');return}if(/^\\/studio\\/[^/]+\\/learn\\/?$/.test(p)||/^\\/ai-academy\\/[^/]+\\/[^/]+/.test(p)||/^\\/evaluate(\\/[^/]*)?\\/?$/.test(p))return;var n=new Date(),t='light';try{var s=localStorage;s.removeItem('${OLD_THEME_KEY}');var c=(s.getItem('${THEME_CHOICE_KEY}')||'').split('|');if((c[0]==='light'||c[0]==='dark')&&+c[1]>n.getTime())t=c[0]}catch(e){}d.classList.add(t==='light'?'day':'stage')}catch(e){}})()`
