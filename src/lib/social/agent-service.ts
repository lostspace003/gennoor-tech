// Client for the Python Microsoft Agent Framework service (services/studio-agents).
const BASE = (process.env.STUDIO_AGENTS_URL || '').replace(/\/$/, '')
const KEY = process.env.STUDIO_AGENTS_KEY || ''

export const agentServiceConfigured = () => !!(BASE && KEY)

export function agentGet(path: string, signal?: AbortSignal) {
  if (!agentServiceConfigured()) throw new Error('The agent service is not configured (STUDIO_AGENTS_URL and STUDIO_AGENTS_KEY).')
  return fetch(`${BASE}${path}`, { headers: { 'X-Api-Key': KEY }, signal })
}

export function agentFetch(path: string, body: unknown, signal?: AbortSignal) {
  if (!agentServiceConfigured()) throw new Error('The agent service is not configured (STUDIO_AGENTS_URL and STUDIO_AGENTS_KEY).')
  return fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': KEY }, body: JSON.stringify(body), signal })
}
