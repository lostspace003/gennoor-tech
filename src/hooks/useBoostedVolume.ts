'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Loudness of a <video> or <audio>, from 0 to 200 percent.
 *
 * Up to 100 it is the element's own volume, which works everywhere. Above 100 the sound is
 * handed to the browser's audio engine: a gain stage lifts it and a limiter after it keeps
 * the loud parts from crackling (the same chain as the chapter narration player).
 *
 * Three things can go wrong with the audio engine, and each one means silence, so each is
 * guarded:
 *  - It must be started by a click or a drag. So the chain is built only when the listener
 *    asks for more than 100, never when a page loads.
 *  - It may not process a video from another site unless that site allows it. A same-site
 *    video and a stream fed by the page (blob:) are fine. For another site the hook asks
 *    first, loads the video again with permission, and carries on from the same second.
 *    If the site says no, the slider simply ends at 100 for that video.
 *  - A phone's own streaming player (.m3u8 played directly) gives the engine nothing.
 *    There the slider ends at 100 too.
 *
 * The level is remembered in this browser, for every video on the site (never "off").
 */
export const MAX_LEVEL = 200
const KEY = 'gennoor.video.volume'

type Media = HTMLMediaElement
interface Chain { el: Media; ctx: AudioContext; gain: GainNode }

function audioEngine(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null
  return window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext || null
}

/** Whether the audio engine may process this media as it is loaded now. 'ask' is a video from another site. */
function standing(el: Media): 'yes' | 'no' | 'ask' {
  const src = el.currentSrc || el.src || ''
  if (!src || /^(blob:|data:)/.test(src)) return 'yes'
  if (/\.m3u8(\?|#|$)/i.test(src)) return 'no'
  try {
    if (new URL(src, window.location.href).origin === window.location.origin) return 'yes'
  } catch {
    return 'no'
  }
  return el.crossOrigin != null ? 'yes' : 'ask'
}

/** Ask the other site, and if it agrees load the video again with its permission, from the same second. */
async function loadWithPermission(el: Media): Promise<boolean> {
  const src = el.currentSrc || el.src
  try {
    const stop = new AbortController()
    const answer = await fetch(src, { mode: 'cors', credentials: 'omit', signal: stop.signal })
    stop.abort()                                       // the answer's headers are all we wanted
    if (!answer.ok) return false
  } catch {
    return false
  }
  const at = el.currentTime, wasPaused = el.paused, rate = el.playbackRate
  el.crossOrigin = 'anonymous'
  el.load()
  await new Promise<void>((done) => {
    const ready = () => { el.removeEventListener('loadedmetadata', ready); done() }
    el.addEventListener('loadedmetadata', ready)
    window.setTimeout(ready, 8000)
  })
  if (el.readyState < 1) return false
  try { el.currentTime = at; el.playbackRate = rate } catch { /* starts from the beginning */ }
  if (!wasPaused) el.play().catch(() => {})
  return true
}

export function useBoostedVolume(ref: RefObject<Media | null>) {
  const [level, setShown] = useState(100)
  // The most this video can be turned up to: 200, or 100 when it cannot be made louder
  const [max, setMax] = useState(MAX_LEVEL)
  const wanted = useRef(100)
  const chain = useRef<Chain | null>(null)

  const apply = useCallback((percent: number) => {
    const el = ref.current
    if (!el) return
    const c = chain.current
    if (c && c.el === el) {
      c.gain.gain.value = percent / 100
      if (el.volume !== 1) el.volume = 1
      if (c.ctx.state === 'suspended') c.ctx.resume().catch(() => {})
    } else {
      const own = Math.min(1, percent / 100)
      if (el.volume !== own) el.volume = own
    }
  }, [ref])

  const build = useCallback(async (): Promise<boolean> => {
    const el = ref.current
    const Engine = audioEngine()
    if (!el || !Engine) return false
    if (chain.current?.el === el) return true
    const may = standing(el)
    if (may === 'no') return false
    // Nothing is awaited on the usual path, so the engine starts inside the listener's own click or drag
    if (may === 'ask' && !(await loadWithPermission(el))) return false
    try {
      const ctx = new Engine()
      const source = ctx.createMediaElementSource(el)
      const gain = ctx.createGain()
      const limiter = ctx.createDynamicsCompressor()
      limiter.threshold.value = -3                     // just under full scale
      limiter.knee.value = 0
      limiter.ratio.value = 20
      limiter.attack.value = 0.003
      limiter.release.value = 0.25
      source.connect(gain)
      gain.connect(limiter)
      limiter.connect(ctx.destination)
      chain.current?.ctx.close().catch(() => {})
      chain.current = { el, ctx, gain }
      // A sleeping engine is silence: wake it now, and again whenever the video is started
      const wake = () => { if (ctx.state === 'suspended') ctx.resume().catch(() => {}) }
      wake()
      el.addEventListener('play', wake)
      window.addEventListener('pointerdown', wake, { once: true })
      return true
    } catch {
      return false
    }
  }, [ref])

  const setLevel = useCallback((percent: number) => {
    const next = Math.max(0, Math.min(MAX_LEVEL, Math.round(percent)))
    wanted.current = next
    setShown(next)
    // "Off" is not a level to come back to on the next video: only a level with sound is remembered
    if (next > 0) { try { window.localStorage.setItem(KEY, String(next)) } catch { /* not remembered */ } }
    if (next > 100 && chain.current?.el !== ref.current) {
      apply(100)                                       // as loud as it goes by itself, until the engine has it
      build().then((ok) => {
        if (ok) return apply(wanted.current)
        setMax(100)
        wanted.current = Math.min(100, wanted.current)
        setShown(wanted.current)
        apply(wanted.current)
      })
    } else {
      apply(next)
    }
  }, [apply, build, ref])

  /** Call from a click that starts the sound (play, unmute): a remembered level above 100 needs that click. */
  const prime = useCallback(() => {
    if (wanted.current > 100 && chain.current?.el !== ref.current) setLevel(wanted.current)
    else apply(wanted.current)
  }, [apply, ref, setLevel])

  // The level chosen last time, on any video
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY)
      const saved = raw === null ? NaN : Number(raw)
      if (Number.isFinite(saved) && saved > 0 && saved <= MAX_LEVEL) { wanted.current = saved; setShown(saved) }
    } catch { /* the default is fine */ }
  }, [])

  // A new video element, or a new source in the same one, starts at the chosen level (as far as it goes without a click)
  useEffect(() => { apply(wanted.current) })

  useEffect(() => () => { chain.current?.ctx.close().catch(() => {}); chain.current = null }, [])

  return { level, setLevel, max, prime }
}
