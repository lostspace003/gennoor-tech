/** Replaces {type:'image', ref:'draft'} with the real picture, so scenes stay small and editable until they are rendered. */
export function withDraftImage<T extends { elements?: unknown[] }>(scene: T, img: Buffer): T {
  const data = img.toString('base64')
  return { ...scene, elements: (scene.elements || []).map(e => (e && typeof e === 'object' && (e as { ref?: string }).ref === 'draft' ? { ...(e as object), data } : e)) }
}
