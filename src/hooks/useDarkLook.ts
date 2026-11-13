'use client'

import { useEffect, useState } from 'react'

/**
 * Is the page in a dark look right now (the class `stage` on <html>)? It follows the switch as it is pressed.
 *
 * Almost nothing needs this: colours written by name change by themselves. It is for the few things that take
 * a colour as a plain value and cannot read a CSS variable, such as the fill of a column in a chart library.
 * The first paint is always "not dark" (the server cannot know), and the real answer follows at once.
 */
export function useDarkLook(): boolean {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const read = () => setDark(root.classList.contains('stage'))
    read()
    const watch = new MutationObserver(read)
    watch.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => watch.disconnect()
  }, [])
  return dark
}
