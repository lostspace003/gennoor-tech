// Reading the document library: which lead a file belongs to, which version it
// is, and which files are just older copies of the same document.
//
// Generated proposals carry blob metadata (leadid/leadname/company/version).
// Files written before metadata existed — and anything uploaded by hand — are
// read from the name instead (`pitches/Acme-proposal-v3.pdf`), so nothing in
// the library is invisible to the filters.
//
// Client-safe: no server-only imports.

export interface DocLike {
  name: string
  size: number
  lastModified: string
  metadata?: Record<string, string>
}

export interface DocInfo<T extends DocLike = DocLike> {
  doc: T
  /** Top-level blob folder: manuals, posters, pitches, general, email-attachments. */
  folder: string
  /** File name without the folder. */
  fileName: string
  ext: string
  /** Version number, 0 when the document isn't versioned. */
  version: number
  leadId: string
  /** Lead or company this was prepared for; '' for shared collateral. */
  leadLabel: string
  /** Identity of the document across its versions — same family = same doc. */
  family: string
  /** Generated client-facing proposal (vs. uploaded collateral). */
  isProposal: boolean
}

export const folderOf = (name: string) => (name.includes('/') ? name.split('/')[0] : 'general')

export function docInfo<T extends DocLike>(doc: T): DocInfo<T> {
  const meta = doc.metadata || {}
  const folder = folderOf(doc.name)
  const fileName = doc.name.split('/').pop() || doc.name
  const ext = (fileName.split('.').pop() || '').toLowerCase()
  const nameVersion = Number(fileName.match(/-v(\d+)\.[a-z0-9]+$/i)?.[1] || 0)
  const version = Number(meta.version) || nameVersion
  // Strip the version suffix so v1..v9 of one document share a family key.
  const stem = fileName.replace(/-v\d+(\.[a-z0-9]+)$/i, '$1').replace(/\.[a-z0-9]+$/i, '')
  const leadId = meta.leadid || ''
  const leadLabel = meta.company || meta.leadname || ''
  return {
    doc,
    folder,
    fileName,
    ext,
    version,
    leadId,
    leadLabel,
    // Without a leadId (legacy files) the stem alone identifies the family.
    family: `${folder}/${leadId || stem}/${stem}/${ext}`,
    isProposal: folder === 'pitches' || meta.kind === 'proposal',
  }
}

/**
 * Does this file belong to the given lead? Metadata is authoritative; legacy
 * proposals fall back to the company/name slug baked into the file name by
 * pitchDocName, which is how they were addressable before metadata.
 */
export function belongsToLead(info: DocInfo, lead: { id: string; name: string; company: string }): boolean {
  if (info.leadId) return info.leadId === lead.id
  if (!info.isProposal) return false
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const stem = slug(info.fileName)
  const company = slug(lead.company)
  const name = slug(lead.name)
  return Boolean((company && stem.startsWith(company)) || (name && stem.startsWith(name)))
}

export interface DocFamily<T extends DocLike = DocLike> {
  key: string
  /** Newest version of the document. */
  latest: DocInfo<T>
  /** Superseded versions, newest first. */
  older: Array<DocInfo<T>>
}

/**
 * Collapse a list into one entry per document, keeping the highest version as
 * the head and the rest as history. Same version in two formats (.docx/.pdf)
 * stays separate — those are different files, not duplicates.
 */
export function groupVersions<T extends DocLike>(infos: Array<DocInfo<T>>): Array<DocFamily<T>> {
  const byFamily = new Map<string, Array<DocInfo<T>>>()
  for (const info of infos) {
    const list = byFamily.get(info.family)
    if (list) list.push(info)
    else byFamily.set(info.family, [info])
  }
  const families: Array<DocFamily<T>> = []
  for (const [key, list] of byFamily) {
    const sorted = [...list].sort(
      (a, b) => b.version - a.version || b.doc.lastModified.localeCompare(a.doc.lastModified)
    )
    families.push({ key, latest: sorted[0], older: sorted.slice(1) })
  }
  return families.sort((a, b) => b.latest.doc.lastModified.localeCompare(a.latest.doc.lastModified))
}
