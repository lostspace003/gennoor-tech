import { requireCrmUser, type CrmSessionUser } from './access'
import { isAdminUser } from './users'

/**
 * Who may open the University Partnership campaign: the people who may open the whole back office, not the ones who only
 * work leads (owner, 27 November 2026: "only for this lead"). The sign-in check on pages does not cover /api,
 * so every address of the campaign starts with this.
 */
export async function requireCampaignUser(): Promise<CrmSessionUser | null> {
  const user = await requireCrmUser()
  return user && isAdminUser(user.email) ? user : null
}
